"use client"
import { SelectedChatState } from '@/atoms/SelectedChatState';
import { UserSearchState } from '@/atoms/UserSearchState';
import { Message, SideChat } from '@/interfaces/ChatInterface';
import { Camera, Mic, Video } from "lucide-react";
import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import MessageStatus from '../messages/MessageStatus';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { format, isToday, isYesterday } from 'date-fns';
import { useSession } from 'next-auth/react';
import { SessionUser } from '@/hooks/useAddFriend';

export default function Chats({contacts}: {contacts: SideChat[]}) {
    const searchQuery = useRecoilValue(UserSearchState);
    const setSelectedChat = useSetRecoilState(SelectedChatState)
    const selectedChat = useRecoilValue(SelectedChatState) as SideChat

    const session = useSession();
    const user = session.data?.user as SessionUser;
    const userId = user?.id as string
    const handleChatSelect = (chat: SideChat) => {
        console.log(chat.messages)
        setSelectedChat(chat);
        const lastMessage = chat.messages[chat.messages.length - 1];
        if(lastMessage.senderId !== userId){
          setChats(prevChats => 
              prevChats.map(c => c.friendId === chat.friendId ? {...c, messages: c.messages.map(m => ({...m, messageStatus: "Seen"}))} : c)
          )
        }
    }
    

    const [chats, setChats] = useState<SideChat[]>(contacts)
    const filteredChats = chats?.filter(chat => 
        chat.user1.username.toLowerCase().includes(searchQuery.toLowerCase()) || chat.user2.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  return (
    <>
      {filteredChats && filteredChats.map((chat) => (
        <ChatListItem 
          key={chat.friendId} 
          chat={chat}
          isSelected={selectedChat?.friendId === chat.friendId}
          onClick={() => handleChatSelect(chat)}
        />
     ))}
    </>
  )
}


function ChatListItem({ chat, isSelected, onClick }: { chat: SideChat, isSelected: boolean, onClick: () => void }) {
  const handleDate = (date: Date): string => {
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'dd/MM/yy');
    }
  };

  const session: any = useSession();
  const userId = session.data?.user.id as string

  const friendUser = chat.user1.userId === userId ? chat.user2 : chat.user1;

  const unSeenCount = chat.messages.filter(message => message.senderId !== userId && message.messageStatus === "Delivered").length;
  const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1]: null
    return (
      <>
      <button 
        className={`flex items-center gap-3 p-3 w-full hover:bg-accent transition-colors border-b`}
        onClick={onClick}
      >
        <Avatar>
          <AvatarImage src={friendUser.image} />
          <AvatarFallback>{friendUser.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left">
          <div className="flex items-start justify-between">
            <h3 className="font-medium">{friendUser.username}</h3>
              <span className={`text-xs  ${unSeenCount > 0 ? 'text-emerald-500' : 'text-muted-foreground' }`}>{handleDate(lastMessage?.createdAt || chat.createdAt)}</span>
          </div>
          {<div className="flex justify-between">
            <div className='flex items-center'>
            {(chat.messages.length > 0 && chat.messages[chat.messages.length - 1].senderId === userId) && (
              <MessageStatus status={chat.messages[chat.messages.length - 1].messageStatus} />
            )}
            {lastMessage && <MessageTypeIcon type={lastMessage.messageType} />}
            <p className={`text-sm text-muted-foreground truncate w-[220px] ms:w-[350px] sm:w-[400px] md:w-[250px] ml-1`}>
              {lastMessage ? getMessagePreview(lastMessage) : "\u00A0"}
            </p>
            </div>
            {lastMessage && (unSeenCount > 0 && (
                <Badge className='bg-emerald-500 hover:bg-emerald-500 text-white text-xs rounded-full mt-[-2px]'>{unSeenCount < 10 ? unSeenCount : '10+'}</Badge>
            ))}
          </div>}
        </div>
        
      </button>
      </>
    )
  }

  function getMessagePreview(message: Message) {
    switch (message.messageType) {
      case 'text':
        return message.message
      case 'image':
        return 'Image'
      case 'audio':
        return 'Audio'
      case 'video':
        return 'Video'
    }
  }

  function MessageTypeIcon({ type }: { type: 'text' | 'image' | 'audio' | 'video' }) {
    switch (type) {
      case 'text':
        return null
      case 'image':
        return <Camera className="h-4 w-4 text-gray-400 mr-1" />
      case 'audio':
        return <Mic className="h-4 w-4 text-gray-400 mr-1" />
      case 'video':
        return <Video className="h-4 w-4 text-gray-400 mr-1" />
    }
  }
