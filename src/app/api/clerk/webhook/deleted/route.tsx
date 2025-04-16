import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest) => {
    try {
        const { data } = await req.json()

        console.log(data)
        console.log(data.id)
        

        // const existingUser = await db.user.findFirst({
        //     where: {
        //         id: userId,
        //         email: emailAdress
        //     }
        // })

        // if(existingUser) {
        //     const accountIds = await db.account.findMany({
        //         where: {
        //             userId: userId
        //         }
        //     })

        //     for(const accId of accountIds) {
        //         console.log("for account id: ", accId.id)
        //         const threadIds = await db.thread.findMany({
        //             where: {
        //                 accountId: accId.id
        //             }
        //         })

        //         for(const threadId of threadIds) {
        //             console.log("for thread id: ", threadId.id)
        //             await db.email.deleteMany({
        //                 where: {
        //                     threadId: threadId.id
        //                 }
        //             })
        //         }

        //         await db.emailAddress.deleteMany({
        //             where: {
        //                 accountId: accId.id
        //             }
        //         })
        //     }
        // }
        
        return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_URL)) 
    } catch(err) {
        return NextResponse.json({
            msg: "Internal Server Error"
        }, {
            status: 500
        })
    }
};