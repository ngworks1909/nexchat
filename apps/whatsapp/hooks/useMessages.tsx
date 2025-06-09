// import { useState, useEffect, useCallback, useRef } from 'react';
// import { Message } from '@/interfaces/ChatInterface';
// import { useRecoilValue, useSetRecoilState } from 'recoil';
// import { SocketState } from '@/atoms/SocketState';
// import { useSession } from 'next-auth/react';
// import { SessionUser } from './useAddFriend';
// import { SelectedChatState } from '@/atoms/SelectedChatState';
// import { MessagesState } from '@/atoms/MessagesState';
// import { UnSeenMessagesState } from '@/atoms/UnseenMessagesState';

import { SelectedChatState } from "@/atoms/SelectedChatState"
import { SideChat } from "@/interfaces/ChatInterface"
import { useState } from "react"
import { useRecoilValue } from "recoil"

// export function useMessages() {
//   // const [messages, setMessages] = useState<Message[]>([]);
//   const messages = useRecoilValue(MessagesState);
//   const setMessages = useSetRecoilState(MessagesState); 
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const socket = useRecoilValue(SocketState);
//   const setUnSeenMessages = useSetRecoilState(UnSeenMessagesState);
//   const unseenMessages = useRecoilValue(UnSeenMessagesState);
//   const session = useSession();
//   const user: SessionUser = session.data?.user as SessionUser;
//   const userId = user?.id;
//   const selectedChat = useRecoilValue(SelectedChatState);
//   const messageSentAudio = new Audio("/send-message.mp3");
//   const messageReceivedAudio = new Audio("/receive-message.mp3");


//   useEffect(() => {
//     if(!selectedChat?.friendId) return
//     fetch(`/api/messages/fetch-messages/${selectedChat.friendId}`).then(res => res.json()).then(data => {
//       if (data.success) {
//         const fetchedMessages: Message[] = data.messages;
//         setMessages(fetchedMessages);

//         const unseen: Message[] = data.unseenMessages;
//         if(unseen.length > 0){
//           setUnSeenMessages(unseen);
//         }
//         else if(fetchedMessages[fetchedMessages.length - 1].senderId !== userId){
//           socket?.send(
//             JSON.stringify({
//               action: 'update-all-message-status',
//               payload: {
//                 receiverId:  fetchedMessages[fetchedMessages.length - 1].senderId,
//                 friendId: selectedChat.friendId
//               }
//           }))
//         } 
//       }
//     })
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedChat]);

//   const updateMessageStatus = ( targetMessageId: string, newStatus: "Sent" | "Delivered" | "Seen") => {
//     return unseenMessages.map(message =>
//       message.messageId === targetMessageId
//         ? { ...message, messageStatus: newStatus }
//         : message
//     );
//   };


//   useEffect(() => {
//     if(socket){
//       socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         if (data.action === 'receive_message') {
//           const message: Message = data.payload.message;
//           if(message.friendId !== selectedChat?.friendId) return
//           messageReceivedAudio.play();
//           socket?.send(
//             JSON.stringify({
//               action: 'update-all-message-status',
//               payload: {
//                 receiverId:  message.senderId,
//                 friendId: selectedChat.friendId
//               }
//           }))

//           setMessages(preveMessages => [...preveMessages, message]);
//           return
//         }
//         if(data.action === 'update-message-status'){
//           const {messageId, messageStatus, chatId} = data.payload;

//           if(selectedChat?.friendId !== chatId) return
//           const updatedMessages = updateMessageStatus(messageId, messageStatus);
//           messageSentAudio.play();
//           setUnSeenMessages(updatedMessages);
//         }
//         if(data.action === 'update-all-message-status'){
//           const {chatId} = data.payload;
//           if(selectedChat?.friendId !== chatId) return
//           const updatedMessages = unseenMessages.map(message => ({
//             ...message,
//             messageStatus: "Seen"
//           })) as Message[];
          
//           const mergedMessages = [...messages, ...updatedMessages];
//           setMessages(mergedMessages);
//           setUnSeenMessages([]);
//         }
//       };
//     }
//     return() => {
//       if(socket){
//         socket.onmessage = null;
//       }
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [messages, socket, unseenMessages, selectedChat]);

  

//   return { messages: [...messages, ...unseenMessages], loading };
// }


export const useMessages = () => {
  const [loading, setLoading] = useState(false)
  const selectedChat = useRecoilValue(SelectedChatState); 

  return {
    loading, 
    messages: selectedChat?.messages ?? []
  }
}
