"use server"

import { auth } from "@clerk/nextjs/server"
import axios from "axios"

export const getAurinkoAuthUrl = async (serviceType: 'Google' | 'Office365') => {
    const { userId } = await auth()

    if(!userId) {
        throw new Error("Unauthorized!")
    }

    const aurinkoUrl = new URL('https://api.aurinko.io/v1/auth/authorize')

    const params = new URLSearchParams({
        clientId: process.env.AURINKO_CLIENT_ID!,
        serviceType,
        scopes: 'Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All',
        responseType: 'code',
        returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`
    })

    for(const [key, value] of params) {
        aurinkoUrl.searchParams.append(key, value.toString())
    }

    return aurinkoUrl.toString()
}

export const exchageAurinkoCodeForToken = async (code: string) => {
    try {
        const result = await axios({
            method: 'post',
            url: `https://api.aurinko.io/v1/auth/token/${code}`,
            auth: {
                username: process.env.AURINKO_CLIENT_ID!,
                password: process.env.AURINKO_CLIENT_SECRET!
            }
        })
        
        return result.data as {
            accountId: string
            accessToken: string
        }
    } catch(err) {
        console.log(err)
    }
}

export const getAccountDetails = async (accountToken: string) => {
    try {
        const result = await axios({
            method: "get",
            url: `https://api.aurinko.io/v1/account`,
            headers: {
                'Authorization': `Bearer ${accountToken}`
            }
        })

        return result.data as {
            email: string,
            name: string
        }
    } catch(err) {
        console.log(err)
    }
}