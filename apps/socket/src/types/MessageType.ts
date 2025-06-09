export interface MessageType{
    messageId: string;
    senderId: string;
    friendId: string;
    message: string;
    messageType: "text" | "image" | "video" | "audio";
    createdAt: Date;
    receiverId: string;
    messageStatus: "Sent" | "Delivered" | "Seen";
    senderDeleted: boolean;
    receiverDeleted: boolean;
}
