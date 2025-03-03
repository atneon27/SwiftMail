import { db } from "@/server/db";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { z } from 'zod'
import { emailAddressSchema } from "@/lib/types";
import { Account } from "@/lib/accounts";

const hasAccess = async (accountId: string, userId: string) => {
    const account = await db.account.findFirst({
        where: {
            id: accountId,
            userId
        }, 
        select: {
            id: true,
            name: true,
            emailAddress: true,
            accessToken: true
        }
    })

    if(!account) throw new Error("Unauthorized Access!")
    return account
}

export const accountRouter = createTRPCRouter({
    getAccounts: privateProcedure.query(async ({ctx}) => {
        return await ctx.db.account.findMany({
            where: {
                userId: ctx.auth.userId
            }, 
            select: {
                id: true,
                emailAddress: true,
                name: true
            }
        })
    }),
    getNumThreads: privateProcedure.input(z.object({
        accountId: z.string(),
        tab: z.string()
    })).query(async ({ctx, input}) => {
        const account = await hasAccess(input.accountId, ctx.auth.userId)
        
        const data =  await ctx.db.thread.count({
            where: {
                accountId: input.accountId,
                inboxStatus: input.tab === 'inbox' ? true : false,
                sentStatus: input.tab === 'sent' ? true : false,
                draftStatus: input.tab === 'draft' ? true : false,
                spamStatus: input.tab === 'spam' ? true : false,
                spoofStatus: input.tab === 'spoof' ? true : false
            }
        })
        
        return data
    }),
    getThreads: privateProcedure.input(z.object({
        accountId: z.string(),
        tab: z.string(),
        done: z.boolean()
    })).query(async ({ctx, input}) => { 
        const account = await hasAccess(input.accountId, ctx.auth.userId);
        const acc = new Account(input.accountId, account.accessToken)
    
        await acc.syncEmails().catch(console.error)
        
        const data = await ctx.db.thread.findMany({
            where: {
                accountId: input.accountId,
                inboxStatus: input.tab === 'inbox' ? true : false,
                sentStatus: input.tab === 'sent' ? true : false,
                draftStatus: input.tab === 'draft' ? true : false,
                spamStatus: input.tab === 'spam' ? true : false,
                spoofStatus: input.tab === 'spoof' ? true : false,
                done: input.done
            }, 
            include: {
                emails: {
                    orderBy: {
                        sentAt: 'asc'
                    }, 
                    select: {
                        from: true,
                        body: true,
                        bodySnippet: true,
                        emailLabel: true,
                        subject: true,
                        id: true,
                        sentAt: true,
                        sysLabels: true
                    }
                }
            },
            take: 25,
            orderBy: {
                lastMessageDate: 'desc'
            }
        })

        return data
    }),
    getSuggestions: privateProcedure.input(z.object({
        accountId: z.string()
    })).query(async ({ctx, input}) => {
        const account = await hasAccess(input.accountId, ctx.auth.userId)
        const data = await ctx.db.emailAddress.findMany({
            where: {
                accountId: account.id
            },
            select: {
                address: true,
                name: true
            }
        })

        return data
    }),
    getReplyDetails: privateProcedure.input(z.object({
        accountId: z.string(),
        threadId: z.string()
    })).query(async ({ctx, input}) => {
        const account = await hasAccess(input.accountId, ctx.auth.userId)
        const thread = await ctx.db.thread.findFirst({
            where: {
                id: input.threadId,
            }, 
            include: {
                emails: {
                    orderBy: {sentAt: 'asc'},
                    select: {
                        from: true,
                        to: true,
                        cc: true,
                        bcc: true,
                        sentAt: true,
                        subject: true,
                        internetMessageId: true
                    }
                }
            }
        })

        if(!thread || thread.emails.length == 0) throw new Error('No Thread Found')
        
        const lastExternalEmail = thread.emails.reverse().find(email => email.from.address != account.emailAddress);

        if(!lastExternalEmail) throw new Error('Thread Not Found')

        return {
            subject: lastExternalEmail.subject,
            to: [lastExternalEmail.from, ...lastExternalEmail.to.filter(to => to.address != account.emailAddress)],
            cc: lastExternalEmail.cc.filter(cc => cc.address != account.emailAddress),
            // bcc: lastExternalEmail.bcc.filter(bcc => bcc.address != account.emailAddress)
            from: { name: account.name, address: account.emailAddress },
            id: lastExternalEmail.internetMessageId
        }
    }),
    sendEmail: privateProcedure.input(z.object({
        accountId: z.string(),
        body: z.string(),
        subject: z.string(),
        from: emailAddressSchema,
        cc: z.array(emailAddressSchema).optional(),
        bcc: z.array(emailAddressSchema).optional(),
        to: z.array(emailAddressSchema),
        replyTo: emailAddressSchema,
        inReplyTo: z.string().optional(),
        threadId: z.string().optional()
    })).mutation(async ({ctx, input}) => {
        const account = await hasAccess(input.accountId, ctx.auth.userId)
        const acc = new Account(input.accountId, account.accessToken)

        await acc.sendEmail({
            from: input.from,
            body: input.body,
            subject: input.subject,
            to: input.to,
            cc: input.cc,
            bcc: input.bcc,
            replyTo: input.replyTo,
            inReplyTo: input.inReplyTo,
            threadId: input.threadId
        })
    })
})