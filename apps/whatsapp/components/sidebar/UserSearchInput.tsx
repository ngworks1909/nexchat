"use client"
import React from 'react'
import { Input } from '../ui/input';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { UserSearchState } from '@/atoms/UserSearchState';

export default function UserSearchInput() {
  const searchQuery = useRecoilValue(UserSearchState)
  const setSearchQuery = useSetRecoilState(UserSearchState)
  return (
    <Input placeholder="Search chats..." value={searchQuery} onChange={(e) => {
        e.preventDefault();
        setSearchQuery(e.target.value)
      }} className="pl-9 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" />
  )
}
