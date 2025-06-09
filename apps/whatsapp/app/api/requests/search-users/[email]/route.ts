import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import redis from "@/lib/redis";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {email: string}}){
    try {
        const email = params.email
        if(!email){
            return NextResponse.json({success: false, message: 'Invalid data'}, {status: 400});
        }
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        if(!session){
            return NextResponse.json({success: false, message: 'unauthorized'}, {status: 403});
        }

        const userId = session.user.id;
        const users = await prisma.user.findMany({
            where: {
                email: {
                    contains: email, // Partial match
                    mode: 'insensitive', // Case insensitive
                },
            },
            select: {
                userId: true,
                username: true,
                image: true,
                sentRequests: {
                    where: {
                        receiverId: userId
                    },
                    select: {
                        requestId: true,
                        requestStatus: true
                    }
                },
                receivedRequests: {
                    where: {
                        senderId: userId
                    },
                    select: {
                        requestId: true,
                        requestStatus: true
                    }
                }
            },
            take: 6, // Limit results to 6
        });
        return NextResponse.json({success: true, users})
    } catch (error) {
        return NextResponse.json({success: false, message: 'Internal server error'}, {status: 500})
    }
}