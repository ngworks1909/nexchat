import { NEXT_AUTH_CONFIG } from "@/lib/auth"
import redis from "@/lib/redis";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth"

export interface UserRequest{
    requestId: string,
    sender: {
        image: string,
        username: string,
    };
}

export const fetchRequests = async() => {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if(!session){
        return []
    }
    const userId = session.user.id;
    const cacheKey = `fetch-requests:${userId}`;
    const cachedRequests = await redis.get(cacheKey);
    if(cachedRequests){
        return JSON.parse(cachedRequests) as UserRequest[]
    }
    const requests: UserRequest[] = await prisma.request.findMany({
        where: {
            receiverId: userId,
            requestStatus: "Sent"
        },
        select: {
            requestId: true,
            sender: {
                select: {
                    username: true,
                    image: true
                }
            }
        }
    });
    redis.set(cacheKey, JSON.stringify(requests), 'EX', 3600);
    return requests;
}