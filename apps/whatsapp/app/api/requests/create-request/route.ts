import { UserRequest } from "@/actions/fetchRequests";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import redis from "@/lib/redis";
import { createRequestSchema } from "@/zod/validateRequest";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const ipAddress = req.ip ?? 'unknown'
        const data = await req.json()
        const validateRequest = createRequestSchema.safeParse(data)
        if(!validateRequest.success){
            return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
        }
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        if(!session){
            return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 403 });
        }
        const userId  = session.user.id;
        const {receiverId} = validateRequest.data
        const existingFriend = await prisma.friend.findMany({
            where: {
                OR: [
                    {userId1: userId, userId2: receiverId},
                    {userId1: receiverId, userId2: userId}
                ]
            }
        });
        if(existingFriend.length > 0){
            return NextResponse.json({success: false, message: 'You already have in friends list'}, {status: 400});
        }
        const request = await prisma.request.create({
            data: {
                senderId: userId,
                receiverId
            },
            select: {
                requestId: true,
                sender: {
                    select: {
                        image: true,
                        username: true
                    }
                }
            }
        })

        const requestCacheKey = `fetch-requests:${receiverId}`;
        const cachedRequests = await redis.get(requestCacheKey)
        if(cachedRequests){
            const newRequest: UserRequest = {
                requestId: request.requestId,
                sender: request.sender
            }
            const fetchedRequests = JSON.parse(cachedRequests) as UserRequest[]
            const newRequests = fetchedRequests.unshift(newRequest);
            await redis.set(requestCacheKey, JSON.stringify(newRequests), 'EX', 3600);
        }
        return NextResponse.json({ success: true, message: 'Request sent successfully' });
    } catch (error) {
        return NextResponse.json({success: false, message: 'Internal server error'}, {status: 500})
    }
}