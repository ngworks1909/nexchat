  export interface SideChat {
    user1: {
        image: string;
        userId: string;
        username: string;
    };
    user2: {
        image: string;
        userId: string;
        username: string;
    };
    friendId: string,
    createdAt: Date,
    messages: Message[]
}

export type Message = {
  message: string;
  messageId: string;
  senderId: string;
  friendId: string;
  messageType: "text" | "image" | "video" | "audio";
  messageStatus: "Sent" | "Delivered" | "Seen" | "Pending";
  senderDeleted: boolean;
  receiverDeleted: boolean;
  createdAt: Date
}


export type MessagesResponse = {
    messages: Message[]
    nextCursor: string | null
}
  