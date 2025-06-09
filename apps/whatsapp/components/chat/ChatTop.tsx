"use client"

import { SelectedChatState } from '@/atoms/SelectedChatState';
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MoreVertical, Phone, Video, X, Trash, UserRoundX } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useSession } from 'next-auth/react';
import { SideChat } from '@/interfaces/ChatInterface';


export default function ChatTop() {
  const selectedChat = useRecoilValue(SelectedChatState) as SideChat;
  const setSelectedChat = useSetRecoilState(SelectedChatState);
  const session: any = useSession();
  const userId = session.data?.user.id as string

  const friend = selectedChat.user1.userId === userId ? selectedChat.user2 : selectedChat.user1
  return (
    <div className="h-16 p-3 flex items-center justify-between border-b absolute top-0 left-0 right-0 bg-background z-10 md:relative">
        {/* Top Left */}
        <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={(e) => {e.preventDefault(), setSelectedChat(null)}}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
              <Avatar>
                <AvatarImage src={friend.image} />
                <AvatarFallback>{friend.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{friend?.username}</h2>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
        </div>
        {/* Top Right */}
        <div className="flex items-center gap-2">
            <Button variant="ghost" className='rounded-full' size="icon">
                <Phone className="h-5 w-5" />  
            </Button>
            <Button variant="ghost" className='rounded-full' size="icon">
                <Video className="h-5 w-5" />  
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className='rounded-full' size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-w-52 min-w-48" align="end">
                <DropdownMenuItem onClick = {() => setSelectedChat(null)}>
                <X className="mr-0 h-4 w-4" />
                  <span>Close Chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                <Trash className="mr-0 h-4 w-4" />
                <span>Clear chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-logout">
                <UserRoundX className="mr-0 h-4 w-4 text-red-600" />
                  <span className="text-red-600">Remove friend</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
  )
}
