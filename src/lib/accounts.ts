import { type EmailMessage, type SyncResponse, type SyncUpdatedResponse } from "@/lib/types"
import axios from "axios"

export class Account {
    private token: string

    constructor(token: string) {
        this.token = token
    }

    private async startSync() {
        const response = await axios<SyncResponse>({
            method: 'post',
            url: 'https://api.aurinko.io/v1/email/sync',
            headers: {
                'Authorization': `Bearer ${this.token}`
            }, 
            params: {
                'daysWithin': 10,
                'bodyType': 'html'
            }
        })

        return response.data
    }

    private async getUpdatedEmails({deltaToken, pageToken}: {
        deltaToken?: string;
        pageToken?: string
    }) {
        const params: Record<string, string> = {}
        if(deltaToken) params.deltaToken = deltaToken
        if(pageToken) params.pageToken = pageToken

        const response = await axios<SyncUpdatedResponse>({
            method: 'get',
            url: 'https://api.aurinko.io/v1/email/sync/updated',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            params
        })

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
}