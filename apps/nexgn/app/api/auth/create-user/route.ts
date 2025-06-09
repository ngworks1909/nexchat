import { createSchema } from "@/zod/validateUser";
import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const data = await req.json()
        const emailValidation = createSchema.safeParse(data);
        if(!emailValidation.success){
            return NextResponse.json({success: false, message: 'Invalid email'}, {status: 400})
        }
        const {email} = emailValidation.data;
        const normalizedEmail = email.toLocaleLowerCase()
        const existingUser = await prisma.user.findUnique({
            where: {
                email: normalizedEmail
            },
            select: {
                userId: true
            }
        });
        if(existingUser){
            return NextResponse.json({success: false, message: 'User with this email already exists'}, {status: 400})
        }
        return NextResponse.json({success: true, message: 'We have sent an OTP to your mail'})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: 'Internal server error'}, {status: 500})
    }
}