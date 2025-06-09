import { NEXT_AUTH_CONFIG } from "@/lib/auth"
import { getServerSession } from "next-auth"
import redis from "@/lib/redis";

export type Friend = {
    friendId: string,
    friendUser: {
        userId: string;
        username: string;
        image: string;
    }
}

export const fetchFriends = async() => {
    const session = await getServerSession(NEXT_AUTH_CONFIG);
    if(!session) return []
    const userId = session.user.id;
    const cacheKey = `fetch-contacts:${userId}`;
    const cachedContacts = await redis.get(cacheKey);
    if(!cachedContacts) return []
    const friends: Friend[] = JSON.parse(cachedContacts);
    return friends;
}