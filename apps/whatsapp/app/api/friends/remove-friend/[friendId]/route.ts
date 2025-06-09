import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";
import { Friend } from "@/actions/fetchFriends";

export async function DELETE(req: NextRequest, {params}: {params: {friendId: string}}){
    try {
        const ipAddress = req.ip ?? 'unknown'
        const {friendId} = params;
        if(!friendId){
            return NextResponse.json({success: false, message: 'Invalid data'}, {status: 400})
        }
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        if(!session){
            return NextResponse.json({success: false, message: 'unauthorized'}, {status: 403});
        }
        const userId = session.user.id;
        const friend = await prisma.friend.findUnique({
            where: {
                friendId
            }
        })
        if(!friend){
            return NextResponse.json({success: false, message: 'Friend not found'}, {status: 404})
        }
        if(friend.userId1 !== userId && friend.userId2 !== userId){
            return NextResponse.json({success: false, message: 'Not authorized to remove friend'}, {status: 403})
        }
        const requests = await prisma.request.findMany({
            where: {
                OR: [
                    {senderId: friend.userId1, receiverId: friend.userId2},
                    {senderId: friend.userId2, receiverId: friend.userId2}
                ]
            },
            select: {
                requestId: true
            }
        })
        const requestId = requests[0].requestId
        await prisma.$transaction(async(tx) => {
            await tx.friend.delete({
                where: {
                    friendId
                }
            })
            await tx.request.delete({
                where: {
                    requestId
                }
            })
            const myCacheKey = `fetch-contacts:${userId}`;
            const myCachedFriends = await redis.get(myCacheKey);
            if(myCachedFriends){
                const friends: Friend[] = JSON.parse(myCachedFriends);
                const updatedFriends = friends.filter(f => f.friendId!== friendId);
                await redis.set(myCacheKey, JSON.stringify(updatedFriends), 'EX', 3600);
            }
            const friendCacheKey = `fetch-contacts:${userId !== friend.userId1 ? friend.userId1: friend.userId2}`;
            const friendCachedFriends = await redis.get(friendCacheKey);
            if(friendCachedFriends){
                const friends: Friend[] = JSON.parse(friendCachedFriends);
                const updatedFriends = friends.filter(f => f.friendId!== friendId);
                await redis.set(friendCacheKey, JSON.stringify(updatedFriends), 'EX', 3600);
            }
        })
        return NextResponse.json({success: true, message: 'Friend removed'})
    } catch (error) {
        return NextResponse.json({success: false, message: 'Internal server error'}, {status: 500})
    }
}
