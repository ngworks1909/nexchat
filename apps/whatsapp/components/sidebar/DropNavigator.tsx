"use client"
import React from 'react'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { UserPlus, Users, CircleUser } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DropNavigator({text}: {text: 'Requests' | 'Friends' | 'Profile'}) {
  const router = useRouter();

  function getIcon(){
    if(text === 'Requests'){
      return <Users className="mr-2 h-4 w-4" />
    } 
    else if(text === 'Friends'){
      return <UserPlus className="mr-2 h-4 w-4" />
    }
    else{
      return <CircleUser className="mr-2 h-4 w-4" />
    }
  }

  return (
    <DropdownMenuItem onClick = {() => {router.push(`/${text.toLowerCase()}`)}}>
        {getIcon()}
        <span>{text}</span>
    </DropdownMenuItem>
  )
}
