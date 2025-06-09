"use client"
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { SelectedChatState } from '@/atoms/SelectedChatState';

export default function Sidebar({ children }: Readonly<{ children: React.ReactNode }>) {
    const selectedChat = useRecoilValue(SelectedChatState)
    
  return (
    <div className={`w-full md:w-[400px] border-r flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {children}
    </div>
  )
}


