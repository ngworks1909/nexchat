import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { $Enums } from "@prisma/client";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Message { 
  message: string; 
  messageId: string; 
  senderId: string; 
  friendId: string; 
  messageType: $Enums.MessageType; 
  createdAt: Date; 
  messageStatus: $Enums.MessageStatus; 
  senderDeleted: boolean; 
  receiverDeleted: boolean; 
}

export async function GET(_: NextRequest, { params }: { params: { friendId: string } }) {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session) {
    return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 403 });
  }

  const userId: string = session.user.id;
  const { friendId } = params;
  if (!friendId) {
    return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
  }

    // Fetch messages from the database
    const messages = await prisma.message.findMany({
      where: {
        friendId,
        OR: [
          {
            senderId: userId,
            senderDeleted: false
          },
          {
            receiverId: userId,
            receiverDeleted: false
          }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        messageId: true,
        message: true,
        senderId: true,
        friendId: true,
        messageType: true,
        messageStatus: true,
        senderDeleted: true,
        receiverDeleted: true,
        createdAt: true
      }
    });
    const messageLength = messages.length
    if(messageLength === 0){
      return NextResponse.json({ success: true, messages, unseenMessages: [] });
    }
    const lastMessage = messages[messageLength - 1];
    if (lastMessage.messageStatus === 'Seen') {
      return NextResponse.json({ success: true, messages, unseenMessages: [] });
    }
    const firstUnseenIndex = messages.findIndex((message) => message.messageStatus !== "Seen");
    if (firstUnseenIndex === -1) {
      return NextResponse.json({ success: true, messages, unseenMessages: [] });
    }
    if(lastMessage.senderId === userId){
      const unseenMessages = messages.splice(firstUnseenIndex);
      return NextResponse.json({ success: true, messages, unseenMessages});
    }
    const unseenMessageIds =  messages
      .slice(firstUnseenIndex)  // Get all messages from the first unseen one
      .filter((message) => message.messageStatus !== 'Seen')  // Filter out only the unseen ones
      .map((message) => message.messageId);
    
    await prisma.message.updateMany({
      where: { messageId: { in: unseenMessageIds } },
      data: { messageStatus: "Seen" },
    });

    return NextResponse.json({ success: true, messages, unseenMessages: []});
  }

  

