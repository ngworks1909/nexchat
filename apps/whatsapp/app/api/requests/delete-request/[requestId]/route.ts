import { UserRequest } from "@/actions/fetchRequests";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import redis from "@/lib/redis";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, params: {requestId: string}){
    try {
        const ipAddress = req.ip?? 'unknown'
        const {requestId} = params;
        if(!requestId){
            return NextResponse.json({success: false, message: 'Invalid data'}, {status: 400})
        }
        const session = await getServerSession(NEXT_AUTH_CONFIG);
        if(!session){
            return NextResponse.json({success: false, message: 'unauthorized'}, {status: 403});
        }
        const userId = session.user.id;
        const existingRequest = await prisma.request.findUnique({
            where: {
                requestId
            }
        })
        if(!existingRequest){
            return NextResponse.json({success: false, message: 'Request not found'}, {status: 400})
        }
        const isSender = existingRequest.senderId !== userId
        if(isSender || existingRequest.receiverId !== userId){
            return NextResponse.json({success: false, message: 'Not authorized to delete this request'}, {status: 403})
        }
        if(existingRequest.requestStatus !== "Sent"){
            return NextResponse.json({success: false, message: 'Something went wrong'}, {status: 400})
        }
        const request = await prisma.request.delete({
            where: {
                requestId
            },
            select: {
                receiverId: true,
            }
        });
        const requestCacheKey = `fetch-requests:${request.receiverId}`;
        const cachedRequests = await redis.get(requestCacheKey)
        if(cachedRequests){
            const fetchedRequests = JSON.parse(cachedRequests) as UserRequest[]
            const newRequests = fetchedRequests.filter(request => request.requestId !== requestId)
            await redis.set(requestCacheKey, JSON.stringify(newRequests), 'EX', 3600);
        }
        return NextResponse.json({message: `${isSender ? 'Request deleted': 'Request rejected'}`})

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: 'An error occurred.'}, { status: 500 });
    }
}

