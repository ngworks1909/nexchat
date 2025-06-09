
import { verifySchema } from "@/zod/validateUser";
import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){

    try {
        const data = await req.json();
        const emailVerify = verifySchema.safeParse(data);
        if(!emailVerify.success){
            return NextResponse.json({success: false, message: 'Invalid credentials'}, {status: 400})
        }
        const {email, otp} = emailVerify.data;
        const userAuth = await prisma.auth.findUnique({
            where: {
                email
            },
            select: {
                otp: true,
                authId: true,
                expiresAt: true
            }
        });
    
        if(!userAuth){
            return NextResponse.json({success: false, message: 'Something went wrong. Please try again'}, {status: 400})
        }
        
        if(userAuth.expiresAt < new Date()){
            return NextResponse.json({success: false, message: 'Your OTP has been expired'}, {status: 400})
        }
        if(userAuth.otp !== otp){
            return NextResponse.json({success: false, message: 'Incorrect OTP. Please check and try again'}, {status: 400})
        }
        return NextResponse.json({success: true, message: 'OTP verified successfully', authId: userAuth.authId})
        
    } catch (error) {
        return NextResponse.json({success: false, message: 'Internal server error'}, {status: 500})
    }



}