"use server"
import Auth from '@/components/auth/Auth'
import { NEXT_AUTH_CONFIG } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function page() {
  const session = await getServerSession(NEXT_AUTH_CONFIG)
  if(session){
      redirect('/')
  }
  return (
    <Auth type='login'/>
  )
}
