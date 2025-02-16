import { exchageAurinkoCodeForToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {waitUntil} from '@vercel/functions'
import axios from "axios";

export const GET = async (req: NextRequest) => {
    const { userId } = await auth()

    if(!userId) {
        return NextResponse.json({
            msg: "Unauthorized!"
        }, {
            status: 401 
        })
    }

    const params = req.nextUrl.searchParams
    const status = params.get("status")

    if(status != 'success') {
        return NextResponse.json({
            msg: "Request Failed!"
        }, {
            status: 401
        })
    }

    const code = params.get("code")
    if(!code) {
        return NextResponse.json({
            msg: "No Code Recived!"
        }, {
            status: 401
        })
    }

    const tokenData = await exchageAurinkoCodeForToken(code)
    if(!tokenData) {
        return NextResponse.json({
            msg: "No Token Recived"
        }, {
            status: 401
        })
    }

    const accountData = await getAccountDetails(tokenData.accessToken)
    if(!accountData) {
        return NextResponse.json({
            msg: "No Account Data Recived",
        }, {
            status: 401,
        })
    }

    try {
        await db.account.upsert({
            where: {
                id: tokenData.accountId.toString()
            }, 
            update: {
                accessToken: tokenData.accessToken
            }, 
            create: {
                id: tokenData.accountId.toString(),
                userId,
                accessToken: tokenData.accessToken,
                emailAddress: accountData.email,
                name: accountData.name,
                nextDeltaToken: ""
            }
        })

        try {
            waitUntil(
                new Promise((resolve, object) => {
                    axios({
                        method: 'post',
                        url: `${process.env.NEXT_PUBLIC_URL}/api/initial-sync`,
                        data: {
                            accountId: tokenData.accountId.toString(),
                            userId
                        }
                    })
                    .then(resolve)
                    .catch(object)
                })
            )
        } catch(e) {
            console.log(e)
            return NextResponse.json({
                msg: "erorr calling initial sync"
            })
        }


        return NextResponse.redirect(new URL('/mail', process.env.NEXT_PUBLIC_URL))
    } catch(err) {
        console.log(err)
        return NextResponse.json({
            msg: "Something Invalid Was passed probably"
        }, {
            status: 500
        })
    } 
}