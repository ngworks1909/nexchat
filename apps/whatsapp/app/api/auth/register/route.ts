import prisma from "@repo/db/client";
import { signUpSchema } from "@/zod/validateUser";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'




export async function POST(req: NextRequest){
    
    try {

        const body = await req.json();
        const signupSuccess = signUpSchema.safeParse(body);
        if(!signupSuccess.success){
            return NextResponse.json({success: false, message: "Invalid inputs"}, {status: 400})
        }
        const {username, authId, password} = signupSuccess.data;
        const authUser = await prisma.auth.findUnique({
            where: {
                authId
            },
            select: {
                email: true
            }
        });
        if(!authUser){
            return NextResponse.json({success: false, message: 'Something went wrong. Please try again.'}, {status: 400})
        }
        const normalizedEmail = authUser.email.toLocaleLowerCase();
        const existingUser = await prisma.user.findFirst({
            where: {
                email: normalizedEmail
            },
            select: {
                email: true,
            }
        });
        
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 400 });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        //
        await prisma.$transaction(async(tx) => {
            await prisma.user.create({
                data: {
                    username,
                    email: normalizedEmail,
                    password: hashedpassword,
                }
            });
            await prisma.auth.delete({
                where: {
                    authId
                }
            })
        })
        
        return NextResponse.json({success: true, message: "Signup successful"});
    } catch (error) {
        return NextResponse.json({success: false, message: 'Internal server error'}, {status: 500});
    }
}