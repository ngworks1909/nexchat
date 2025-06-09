"use client"
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()
  return (
    <Button 
        variant="outline" 
        onClick={() => router.back()}
        className="rounded-lg border-none shadow-none"
    >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back
    </Button>
  )
}
