import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest) => {
    try {
        const { data } = await req.json()
        
        const emailAdress = data?.email_addresses[0].email_address
        const firstName = data?.first_name
        const lastName = data?.last_name
        const imgUrl = data?.image_url
        const userId = data?.id  

        const existingUser = await db.user.findFirst({
            where: {
                id: userId,
                email: emailAdress
            }
        })

        if(!existingUser) {
            await db.user.create({
                data: {
                    id: userId,
                    email: emailAdress,
                    firstName,
                    lastName,
                    imageUrl: imgUrl
                }
            })
        }
        
        return NextResponse.redirect(new URL('/dummy', process.env.NEXT_PUBLIC_URL)) 
    } catch(err) {
        return NextResponse.json({
            msg: "Internal Server Error"
        }, {
            status: 500
        })
    }
};