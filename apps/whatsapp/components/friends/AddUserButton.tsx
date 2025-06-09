"use client"
import React from 'react'
import { Button } from '../ui/button'
import { UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AddUserButton() {
  const router = useRouter();
  return (
    <Button onClick={() => router.push('/add-friend')}
        size="lg" 
        className="rounded-full px-6 bg-emerald-500 hover:bg-emerald-600 transition-colors"
    >
      <UserPlus className="mr-2 h-5 w-5" />
      Add Friend
    </Button>
  )
}
