/* eslint-disable @typescript-eslint/no-unused-vars */
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest){
    try {
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        if(!session) return NextResponse.json({success: false, message: 'unauthorized'}, {status: 403});
        const userId = session.user.id;
        const friends = await prisma.friend.findMany({
                where: {
                    OR: [
                        { userId1: userId },
                        { userId2: userId }
                    ]
                },
                select: {
                    user1: {
                        select: {
                            userId: true,
                            username: true,
                            image: true
                        }
                    },
                    user2: {
                        select: {
                            userId: true,
                            username: true,
                            image: true
                        }
                    },
                    friendId: true,
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 10
                    },
                    createdAt: true
                }
            });

        const friendsWithReversedMessages = friends.map(friend => ({
          ...friend,
          messages: [...friend.messages].reverse()
        }));

        return NextResponse.json({success: true, friends: friendsWithReversedMessages}, {status: 200})
    } catch (error) {
        return NextResponse.json({success: false, message: 'Internal server error'}, {status: 500})
    }

}