"use client"
import React, { useEffect, useRef, useState } from 'react'
import { ImageIcon, Mic, Send, Smile, Paperclip, Video, Music } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createId } from '@paralleldrive/cuid2'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { SocketState } from '@/atoms/SocketState'
import { SelectedChatState } from '@/atoms/SelectedChatState'
import { useSession } from 'next-auth/react'
import { SessionUser } from '@/hooks/useAddFriend'
import { Message } from '@/interfaces/ChatInterface'
import { UnSeenMessagesState } from '@/atoms/UnseenMessagesState'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { uploadFile } from '@/firebase/uploadFile'

export default function MessageBar() {
  const [message, setMessage] = useState('');
  const socket = useRecoilValue(SocketState);
  const friend = useRecoilValue(SelectedChatState);
  const friendId = friend?.friendId;
  const session = useSession();
  const user = session.data?.user as SessionUser;
  const userId = user?.id;
  const setUnSeenMessages = useSetRecoilState(UnSeenMessagesState);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const messageBarRef = useRef<HTMLDivElement>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | 'audio' | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node) &&
          messageBarRef.current && !messageBarRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const sendMessageToServer = async (message: string, messageType: 'text' | 'image' | 'video' | 'audio') => {
    const messageId = createId();
    const newMessage: Message = {
      message,
      messageId,
      senderId: userId ?? "",
      friendId: friendId ?? "",
      messageType,
      messageStatus: 'Pending',
      senderDeleted: false,
      receiverDeleted: false,
      createdAt: new Date(),
    }
    setUnSeenMessages(preveMessages => [...preveMessages, newMessage])
    socket?.send(
      JSON.stringify({
        action: 'send-message',
        payload: {
          messageId,
          senderId: userId,
          friendId,
          message,
          messageType,
        },
      })
    );
  };

  const handleFileSelect = (type: 'image' | 'video' | 'audio') => {
    setFileType(type);
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const handleFileChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Selected ${fileType} file:`, file.name);
      const url = await uploadFile(file);
      if(url && fileType !== undefined){
        sendMessageToServer(url, fileType);
      }
      // Here you would typically handle the file upload or attachment
    }
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };
  const handleSend = async() => {
    if(message.length > 0 && message.trim().length > 0){
      sendMessageToServer(message, "text");
      setMessage('');
    }
  }

  return (
    <div className="border-t bg-background relative" ref={messageBarRef}>
      <div className="mx-auto flex items-center gap-2 bg-transparent rounded-full px-4 py-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:flex"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => handleFileSelect('image')}>
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>Image</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFileSelect('video')}>
              <Video className="mr-2 h-4 w-4" />
              <span>Video</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleFileSelect('audio')}>
              <Music className="mr-2 h-4 w-4" />
              <span>Audio</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="Type a message"
          autoFocus
          autoComplete='on'
          className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          size="icon"
          onClick={handleSend}
          className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 hover:scale-105 text-white rounded-full"
        >
          {message ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
      </div>
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef} 
          className="absolute bottom-full left-0 mb-2"
          style={{ zIndex: 1000 }}
        >
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </div>
      )}
      <input
        key={fileType}
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={fileType === 'image' ? 'image/*' : fileType === 'video' ? 'video/*' : fileType === 'audio' ? 'audio/*' : undefined}
        onChange={handleFileChange}
      />

      {/* <input
        key={fileType}
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={fileType === 'image' ? 'image/*' : fileType === 'video' ? 'video/*' : 'audio/*'}
        onChange={handleFileChange}
      /> */}
    </div>
  )
}
