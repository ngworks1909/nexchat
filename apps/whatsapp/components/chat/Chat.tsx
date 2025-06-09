"use client"
import { SelectedChatState } from '@/atoms/SelectedChatState'
import React from 'react'
import { useRecoilValue } from 'recoil'

export default function Chat({ children }: Readonly<{ children: React.ReactNode }>) {
  const selectedChat = useRecoilValue(SelectedChatState);
  return (
    <div className={`flex-1 flex flex-col h-[100svh] ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
      {selectedChat ? (<>
          {children}
      </>): (
        <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  )
}
