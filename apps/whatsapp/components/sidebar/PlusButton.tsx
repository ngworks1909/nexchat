"use client"
import React from 'react'
import { Button } from '../ui/button'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PlusButton() {
  const router = useRouter()
  return (
    <Button onClick={(e) => {router.push('/add-friend')}} variant="ghost" className='rounded-full' size="icon">
        <PlusCircle className="h-5 w-5" />
    </Button>
  )
}
