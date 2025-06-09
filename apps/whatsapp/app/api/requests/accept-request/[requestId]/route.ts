import { UserRequest } from "@/actions/fetchRequests";
import { SideChat } from "@/interfaces/ChatInterface";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import redis from "@/lib/redis";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, {params}: {params: {requestId: string}}){
    try {
        const ipAddress = req.ip ?? 'unknown'
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        if(!session){
            return NextResponse.json({success: false, message: 'unauthorized'}, {status: 400});
        }
        const userId = session.user.id;
        const { requestId } = params;
        if(!requestId){
            return NextResponse.json({success: false, message: 'Invalid data'}, {status: 400});
        }

        const existingRequest = await prisma.request.findUnique({
            where: {
                requestId
            },
            select: {
                receiverId: true,
                sender: {
                    select: {
                        userId: true,
                        username: true,
                        image: true
                    }
                },
                receiver: {
                    select: {
                        userId: true,
                        username: true,
                        image: true
                    }
                }
            }
        })
        if(!existingRequest){
            return NextResponse.json({success: false, message: 'Request not found'}, {status: 400})
        }
        if(existingRequest.receiverId !== userId){
            return NextResponse.json({success: false, message: 'Not authorized to accept this request'}, {status: 403})
        }
        await prisma.$transaction(async(tx) => {
            const request = await tx.request.update({
                where: {
                    requestId
                },
                data: {
                    requestStatus: "Accepted"
                },
                select: {senderId: true, receiverId: true}
            });
            const newFriend = await tx.friend.create({
                data: {
                    userId1: request.senderId,
                    userId2: request.receiverId
                },
                select: {
                    friendId: true,
                    createdAt: true
                }
            })
            
            const cacheKey = `fetch-contacts:${userId}`;
            const cachedContacts = await redis.get(cacheKey);
            if(cachedContacts){
                const receiverFriend: SideChat = {
                    user1: existingRequest.receiver,
                    user2: existingRequest.sender,
                    friendId: newFriend.friendId,
                    createdAt: newFriend.createdAt,
                    messages: []
                }
                const fetchedContacts = JSON.parse(cachedContacts) as SideChat[]
                fetchedContacts.unshift(receiverFriend)
                await redis.set(cacheKey, JSON.stringify(fetchedContacts), 'EX', 3600)
            }

            const requestCacheKey = `fetch-requests:${userId}`;
            const cachedRequests = await redis.get(requestCacheKey)
            if(cachedRequests){
                const fetchedRequests = JSON.parse(cachedRequests) as UserRequest[]
                const newRequests = fetchedRequests.filter(request => request.requestId !== requestId)
                await redis.set(requestCacheKey, JSON.stringify(newRequests), 'EX', 3600);
            }

            const friendCacheKey = `fetch-contacts:${existingRequest.sender.userId}`
            const friendCachedContacts = await redis.get(friendCacheKey);
            if(friendCachedContacts){
                const senderFriend: SideChat = {
                    user1: existingRequest.sender,
                    user2: existingRequest.receiver,
                    friendId: newFriend.friendId,
                    createdAt: newFriend.createdAt,
                    messages: []
                }
                const fetchedContacts = JSON.parse(friendCachedContacts) as SideChat[]
                fetchedContacts.unshift(senderFriend)
                await redis.set(friendCacheKey, JSON.stringify(fetchedContacts), 'EX', 3600)
            }
        })
        return NextResponse.json({success: true, message: 'Request accepted'})
    } catch (error) {
        return NextResponse.json({success: false, message: 'Internal server error'}, {status: 500})
    }
}


