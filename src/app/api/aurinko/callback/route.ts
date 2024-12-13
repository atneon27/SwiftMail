import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    // const { userId } = await auth()

    // if(!userId) {
    //     return NextResponse.json({
    //         msg: "Unauthorized!"
    //     }, {
    //         status: 200
    //     })
    // }

    return NextResponse.json({
        msg: "Hello World"
    }, {
        status: 200,
    })
}