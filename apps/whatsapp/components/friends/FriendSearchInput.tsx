"use client"
import { FriendSearchState } from '@/atoms/FriendSearchState'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Input } from '../ui/input'

export default function FriendSearchInput() {
  const searchQuery = useRecoilValue(FriendSearchState)
  const setSearchQuery = useSetRecoilState(FriendSearchState)
  return (
    <Input placeholder="Search friends..." value={searchQuery} onChange={(e) => {
        e.preventDefault();
        setSearchQuery(e.target.value)
  }} className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" />
  )
}
