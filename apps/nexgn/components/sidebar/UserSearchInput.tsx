"use client"
import React from 'react'
import { Input } from '../ui/input';
import { useUserSearchState } from '@/atoms/UserSearchState';

export default function UserSearchInput() {
  const {search, setSearch} = useUserSearchState()
  return (
    <Input placeholder="Search chats..." value={search} onChange={(e) => {
        e.preventDefault();
        setSearch(e.target.value)
      }} className="pl-9 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" />
  )
}
