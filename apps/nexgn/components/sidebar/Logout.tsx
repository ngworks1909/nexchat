"use client"
import { LogOut } from 'lucide-react'
import React from 'react'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { signOut } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

export default function Logout() {
  const {toast} = useToast()
  return (
    <DropdownMenuItem onClick={async() => {
        await signOut()
        toast({
            title: "Logged out",
            description: "You have been logged out.",
            variant: "destructive",
        })
    }} className="hover:bg-logout">
        <LogOut className="mr-2 h-4 w-4 text-red-600" />
        <span className='text-red-600'>Log out</span>
    </DropdownMenuItem>
  )
}
