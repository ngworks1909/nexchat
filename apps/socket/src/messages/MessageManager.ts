import { prisma } from "../lib/client";
import { userManager } from "../users/UserManager";
import { CreateMessageType } from "../zod/actionValidation";

export class MessageManager{
    private static instance: MessageManager;

    static getInstance(){
        if(MessageManager.instance){
            return MessageManager.instance;
        }
        MessageManager.instance = new MessageManager();
        return MessageManager.instance;
    }

    public async sendMessage(data: CreateMessageType){
        const { senderId, friendId, message, messageType, messageId } = data;
        const friend = await prisma.friend.findUnique({
            where: {
                friendId
            },
            select: {
                userId1: true,
                userId2: true
            }
        });
        if(!friend){
            return {success: false, message: 'Friend not found'};
        }
        if(friend.userId1 !== senderId && friend.userId2 !== senderId){
            return {success: false, message: 'Not authorized to send message'};
        }
        const receiverId = friend.userId1 === senderId ? friend.userId2 : friend.userId1;
        const receiverSocket = userManager.getUser(receiverId)?.getSocket();
        const messageStatus = receiverSocket ? "Delivered" : "Sent";
        const createdMessage = await prisma.message.create({
            data: {
                messageId,
                senderId,
                receiverId,
                friendId,
                message,
                messageType,
                messageStatus
            }
        });

        receiverSocket?.send(JSON.stringify({
            action: 'receive_message',
            payload: {
                message: createdMessage
            }
        }))
        return {success: true, message: createdMessage};
    }

    public async updateAllMessagesToDelivered(receiverId: string){
        await prisma.message.updateMany({
            where: {
                receiverId,
                messageStatus: "Sent"
            },
            data: {
                messageStatus: "Delivered"
            }
        })
    }
}

export const messageManager = MessageManager.getInstance();