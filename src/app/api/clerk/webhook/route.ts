import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest) => {
    try {
        const { data } = await req.json()
        
        const emailAdress = data.email_addresses[0].email_address
        const firstName = data.first_name
        const lastName = data.last_name
        const imgUrl = data.image_url
        const userId = data.id 
    
        await db.user.create({
            data: {
                id: userId,
                email: emailAdress,
                firstName: firstName,
                lastName: lastName,
                imageUrl: imgUrl
            }
        })
    
        return NextResponse.json({
            msg: "webhook hit"
        }, {
            status: 200
        })
    } catch(err) {
        return NextResponse.json({
            msg: "Internal Server Error"
        }, {
            status: 500
        })
    }
};