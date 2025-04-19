import { db } from "@/server/db";
import { type EmailAddress, type EmailAttachment, type EmailMessage } from "./types";
import pLimit from 'p-limit'
import { OramaClient } from "./orama";
import { turndown } from "./turndown";


type SpamResponse = {
    result?: string;
    score?: number;
    is_spam?: boolean;
    text?: string;
}

export async function syncEmailToDatabase(emails: EmailMessage[], accountId: string) {
    console.log("attempting to sync emails: ", emails.length)
    const limit = pLimit(40)
    
    try {
        const orama = new OramaClient(accountId)
        await orama.initialize()

        await Promise.all(emails.map(email => {
            return limit(async() => {
                const strippedBody = turndown.turndown(email.body ?? '')
                
                await orama.insert({
                    subject: email.subject,
                    body: strippedBody,
                    rawBody: email.bodySnippet,
                    from: email.from.address,
                    to: email.to.map(to => to.address),
                    sentAt: email.sentAt.toLocaleString(), 
                    threadId: email.threadId
                })

                console.log("Added the email to orama")
            })    
        }))
        
        const result = await Promise.all(
            emails.map((email, idx) => {
                return  limit(() => upsertEmail(email, idx, accountId))
            })
        );

        console.log('successfully processed all emails')
        return result;
    } catch(err) {
        console.log(err)
    }
}

async function upsertEmailAddress(address: EmailAddress, accountId: string) {
    try {
        const result = await db.emailAddress.upsert({
            where: {
                accountId_address: {
                    accountId: accountId,
                    address: address.address ?? ""
                }
            },
            update: {
                name: address.name,
                raw: address.raw
            }, 
            create: {
                accountId,
                name: address.name,
                address: address.address ?? "",
                raw: address.raw
            }
        })

        return result
    } catch(err) {
        return null
    }
}

async function upsertAttachments(emailId: string, attachment: EmailAttachment) {
    try {
        const result = await db.emailAttachments.upsert({
            where: {
                id: attachment.id
            }, 
            update: {
                name: attachment.name,
                mimeType: attachment.mimeType,
                size: attachment.size,
                inline: attachment.inline,
                contentId: attachment.contentId,
                content: attachment.content,
                contentLocation: attachment.contentLocation
            }, 
            create: {
                id: attachment.id,
                emailId,
                name: attachment.name,
                mimeType: attachment.mimeType,
                size: attachment.size,
                inline: attachment.inline,
                contentId: attachment.contentId,
                content: attachment.content,
                contentLocation: attachment.contentLocation
            }
        })

        return result
    } catch(err) {
        console.log(err)
    }
}

async function upsertEmail(email: EmailMessage, idx: number, accountId: string) {
    try {
        let emailLabelType: 'inbox' | 'sent' | 'draft' = 'inbox';
        if(email.sysLabels.includes('inbox') || email.sysLabels.includes('important')) {
            emailLabelType = 'inbox'
        } else if(email.sysLabels.includes('sent')) {
            emailLabelType = 'sent'
        } else if(email.sysLabels.includes('draft')) {
            emailLabelType = 'draft'
        }
    

        const addressesToUpsert = new Map()
        for(const mail of [email.from, ...email.cc, ...email.bcc, ...email.replyTo]) {
            addressesToUpsert.set(mail.address, mail)
        }
        
        const upsertedAddresses: (Awaited<ReturnType<typeof upsertEmailAddress>>)[] = []
        
        for(const address of addressesToUpsert.values()) {
            if(address) {
                const upsertAddress = await upsertEmailAddress(address, accountId)
                upsertedAddresses.push(upsertAddress)
            }
        }
        
        const addressMap = new Map(
            upsertedAddresses.filter(Boolean).map(address => [address!.address, address])
        )
        
        const fromAddress = addressMap.get(email.from.address)
        if(!fromAddress) {
            console.log("failed to upsert from address for email ", email.bodySnippet)
            return
        }

        // spam model
        const response = await fetch("https://api.apilayer.com/spamchecker?threshold=2.51", { 
            method: "POST",
            body: email.body ?? '',
            headers: {
                "apikey": process.env.APILAYER_API_KEY!,
                "Content-Type": "text/plain",
            }
        });
    
        const data = await response.json() as SpamResponse;
        const currSpamStatus = data.is_spam ?? false
        
        const toAddress = email.to.map(addr => addressMap.get(addr.address)).filter((adr): adr is NonNullable<typeof adr> => Boolean(adr));
        const ccAddress = email.cc.map(addr => addressMap.get(addr.address)).filter((adr): adr is NonNullable<typeof adr> => Boolean(adr));
        const bccAddress = email.bcc.map(addr => addressMap.get(addr.address)).filter(Boolean)
        const replyToAddress = email.replyTo.map(addr => addressMap.get(addr.address)).filter(Boolean)
        
        const [thread, emailRecord] = await db.$transaction([
            // Threads upsert
            db.thread.upsert({
                where: {
                    id: email.threadId
                }, 
                update: {
                    accountId: accountId,
                    subject: email.subject ?? '',
                    lastMessageDate: new Date(email.sentAt),
                    done: false,
                    participantIds: [...new Set([
                        fromAddress.id,
                        ...toAddress.map(a => a.id),
                        ...ccAddress.map(a => a.id),
                        ...bccAddress.map(a => a!.id)
                    ])]
                }, 
                create: {
                    id: email.threadId,
                    accountId,
                    subject: email.subject ?? '',
                    done: false,
                    // revert the changes made
                    inboxStatus:  emailLabelType === 'inbox',
                    sentStatus: emailLabelType === 'sent',
                    draftStatus: emailLabelType === 'draft',
                    lastMessageDate: new Date(email.sentAt),
                    participantIds: [...new Set([
                        fromAddress.id,
                        ...toAddress.map(a => a.id),
                        ...ccAddress.map(a => a.id),
                        ...bccAddress.map(a => a!.id)
                    ])]
                }
            }),
            
            // Email Upsert 
            db.email.upsert({
                where: {
                    id: email.id
                }, 
                update: {
                    threadId: email.threadId,
                    createdTime: new Date(email.createdTime),
                    lastModifiedTime: new Date(),
                    sentAt: new Date(email.sentAt),
                    receivedAt: new Date(email.receivedAt),
                    internetMessageId: email.internetMessageId,
                    subject: email.subject ?? '',
                    keywords: email.keywords,
                    sysClassifications: email.sysClassifications,
                    sensitivity: email.sensitivity,
                    fromId: fromAddress.id,
                    to: { set: toAddress.map(adr => ({id: adr.id}))},
                    cc: { set: ccAddress.map(adr => ({id: adr.id}))},
                    bcc: { set: bccAddress.map(adr => ({id: adr!.id}))},
                    replyTo: {set: replyToAddress.map(adr => ({id: adr!.id}))},
                    hasAttachments: email.hasAttachments === 'true',
                    body: email.body,
                    bodySnippet: email.bodySnippet,
                    inReplyTo: email.inReplyTo,
                    references: email.references,
                    threadIndex: email.threadIndex,
                    internetHeaders: email.internetHeaders as any,
                    nativeProperties: email.nativeProperties as any,
                    folderId: email.folderId,
                    ommited: email.omitted
                }, 
                create: {
                    threadId: email.threadId,
                    createdTime: new Date(email.createdTime),
                    lastModifiedTime: new Date(),
                    sentAt: new Date(email.sentAt),
                    receivedAt: new Date(),
                    internetMessageId: email.internetMessageId,
                    subject: email.subject ?? '',
                    keywords: email.keywords,
                    sysClassifications: email.sysClassifications,
                    sensitivity: email.sensitivity,
                    fromId: fromAddress.id,
                    to: { connect: toAddress.map(adr => ({id: adr.id}))},
                    cc: { connect: ccAddress.map(adr => ({id: adr.id}))},
                    bcc: { connect: bccAddress.map(adr => ({id: adr!.id}))},
                    replyTo: {connect: replyToAddress.map(adr => ({id: adr!.id}))},
                    hasAttachments: email.hasAttachments === 'true',
                    body: email.body,
                    bodySnippet: email.bodySnippet,
                    inReplyTo: email.inReplyTo,
                    references: email.references,
                    threadIndex: email.threadIndex,
                    internetHeaders: email.internetHeaders as any,
                    nativeProperties: email.nativeProperties as any,
                    folderId: email.folderId,
                    ommited: email.omitted
                }
            })
        ])
        
        const account = await db.account.findFirst({
            where: {
                id: accountId
            }
        })
        
        const threadEmails = await db.email.findMany({
            where: {
                threadId: thread.id,
            }, 
            orderBy: {
                receivedAt: 'asc'
            }
        })
        
        let threadFolderType = 'sent'
        for(const threadEmail of threadEmails) {
            if(threadEmail.folderId === 'INBOX') {
                threadFolderType = 'inbox'
                break
            } else if(threadEmail.folderId === 'DRAFT') {
                threadFolderType = 'draft'
            }
        }
        
        await db.thread.update({
            where: {
                id: thread.id
            }, 
            data: {
                inboxStatus: threadFolderType === 'inbox' && !currSpamStatus,
                sentStatus: threadFolderType === 'sent',
                draftStatus: threadFolderType === 'draft',
                spamStatus: currSpamStatus,
            }
        })
        
        if(email.attachments && email.attachments.length > 0) {
            for(const attachment of email.attachments) {
                await upsertAttachments(email.id, attachment)
            }
        }

        console.log("Upserted email: ", idx)
    } catch(err) {
        console.log("Error upserting email: ", idx)
    }
}
