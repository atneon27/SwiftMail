import { EmailAddress, type EmailMessage, type SyncResponse, type SyncUpdatedResponse } from "@/lib/types"
import { db } from "@/server/db"
import axios from "axios"
import { syncEmailToDatabase } from "./syncdb"

export class Account {
    private token: string
    private id: string

    constructor(accountId: string, token: string) {
        this.token = token
        this.id = accountId
    }

    private async startSync() {
        const response = await axios<SyncResponse>({
            method: 'post',
            url: 'https://api.aurinko.io/v1/email/sync',
            headers: {
                'Authorization': `Bearer ${this.token}`
            }, 
            params: {
                'daysWithin': 1,
                'bodyType': 'html'
            }
        })

        return response.data
    }

    async getUpdatedEmails({deltaToken, pageToken}: {
        deltaToken?: string;
        pageToken?: string
    }) {
        if(!this.token) throw new Error("Invalid Access Token")

        const reqParams: Record<string, string> = {}
        if(deltaToken) reqParams.deltaToken = deltaToken ?? '';
        if(pageToken) reqParams.pageToken = pageToken ?? '';

        const config = {
            params: reqParams,
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        }
        
        const response = await axios.get<SyncUpdatedResponse>(
            'https://api.aurinko.io/v1/email/sync/updated', config
        )
        return response.data
    }

    async performInitialSync() {
        try {
            let syncResponse = await this.startSync()
            while(!syncResponse.ready) {
                await new Promise(resolve => setTimeout(resolve, 1000))
                syncResponse = await this.startSync()
            }
            
            let storedDeltaToken: string = syncResponse.syncUpdatedToken
            let updatedResponse = await this.getUpdatedEmails({deltaToken: storedDeltaToken})
            if(updatedResponse.nextDeltaToken) {
                storedDeltaToken = updatedResponse.nextDeltaToken
            }

            let allEmails: EmailMessage[] = updatedResponse.records

            while(updatedResponse.nextPageToken) {
                updatedResponse = await this.getUpdatedEmails({pageToken: updatedResponse.nextPageToken})
                allEmails = allEmails.concat(updatedResponse.records)
                if(updatedResponse.nextDeltaToken) {
                    storedDeltaToken = updatedResponse.nextDeltaToken
                }
            }

            console.log("Initial Sync Complete - Synced: ", allEmails.length, " emails")

            return {
                emails: allEmails,
                deltaToken: storedDeltaToken
            }
        } catch(err) {
            console.log(err)
        }
    }

    async syncEmails() {
        const acc = await db.account.findUnique({
            where: {
                id: this.id,
                accessToken: this.token
            }
        })

        if(!acc) throw new Error("Account not found!")
        if(!acc.nextDeltaToken) throw new Error("Account not ready for syncing")

        let response = await this.getUpdatedEmails({
            deltaToken: acc.nextDeltaToken
        })

        let storedDeltaToken = acc.nextDeltaToken

        if(response.nextDeltaToken) {
            storedDeltaToken = response.nextDeltaToken
        }

        let allEmails: EmailMessage[] = response.records

        while(response.nextPageToken) {
            response = await this.getUpdatedEmails({
                pageToken: response.nextPageToken
            })

            allEmails = allEmails.concat(response.records)
            if(response.nextDeltaToken) {
                storedDeltaToken = response.nextDeltaToken
            }
        }

        try {
            await syncEmailToDatabase(allEmails, acc.id)
        } catch(error) {
            console.error("An Error occured, ", error)
        }

        await db.account.update({
            where: {
                id: acc.id
            }, 
            data: {
                nextDeltaToken: storedDeltaToken
            }
        })

        return {
            emails: allEmails,
            deltaToken: storedDeltaToken
        }
    }

    async sendEmail({
        from,
        subject,
        body,
        inReplyTo,
        threadId,
        reffrences,
        to,
        cc,
        bcc,
        replyTo
    }: {
        from: EmailAddress,
        subject: string,
        body: string,
        inReplyTo?: string,
        threadId?: string,
        reffrences?: string,
        to: EmailAddress[],
        cc?: EmailAddress[] 
        bcc?: EmailAddress[],
        replyTo: EmailAddress
    }) {
        try {
            const response = await axios.post('https://api.aurinko.io/v1/email/messages', {
                from,
                subject,
                body,
                inReplyTo,
                threadId,
                reffrences,
                to,
                cc,
                bcc,
                replyTo: [replyTo]
            }, {
                params: {
                    returnIds: true
                },
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            })

            console.log('email sent', response.data)
        } catch(e) {
            console.log("Error Sending Email")
            throw e
        }
    }   
}