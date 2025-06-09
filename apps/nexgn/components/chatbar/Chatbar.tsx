"use client"
import { useContactState } from '@/atoms/ContactState'
import React from 'react'

export default function ChatBar() {
  const {selected} = useContactState()
  return (
    <div className={`flex-1 flex flex-col h-[100svh] ${selected ? 'flex' : 'hidden md:flex'}`}>
      {selected ? (<>
          
      </>): (
        <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  )
}
