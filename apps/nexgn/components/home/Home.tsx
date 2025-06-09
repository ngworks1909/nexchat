import React from 'react'
import Sidebar from '../sidebar/Sidebar'
import ChatBar from '../chatbar/Chatbar'

export default function Home() {
  return (
    <div className="h-dvh flex bg-background">
      <Sidebar/>
      <ChatBar/>
    </div>
  )
}
