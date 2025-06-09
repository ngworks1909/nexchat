import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";


export async function fetchContacts(){
    const session = await getServerSession(NEXT_AUTH_CONFIG)

    const userId = session.user.id
    // console.log(userId)
    if(!session) return []

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

  return friendsWithReversedMessages;
}
