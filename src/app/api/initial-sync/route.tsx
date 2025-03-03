import { Account } from "@/lib/accounts";
import { syncEmailToDatabase } from "@/lib/syncdb";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

type Data = {
    accountId: string
    userId: string
}

export const POST = async (req: NextRequest) => {
    const { accountId, userId }: Data = await req.json()
    
    if(!accountId || !userId) {
        return NextResponse.json({
            msg: "Invalid Data Recived!"
        }, {status: 401})
    }

    const dbAccount = await db.account.findFirst({
        where: {
            id: accountId,
            userId
        }
    })

    if(!dbAccount) {
        return NextResponse.json({
            msg: "No User Found!"
        }, {
            status: 401
        })
    }

    const account = new Account(accountId, dbAccount.accessToken)
    const response = await account.performInitialSync()

    if(!response) {
        return NextResponse.json({
            msg: "Internal Server Error - Error performing initial sync"
        }, {
            status: 500
        })
    }

    await db.account.update({
        where: {
            id: accountId,
        }, 
        data: {
            nextDeltaToken: response.deltaToken
        }
    })

    await syncEmailToDatabase(response.emails, accountId) 

    return NextResponse.json({
        msg: "Initial Sync is Complete"
    }, {
        status: 200
    })
}