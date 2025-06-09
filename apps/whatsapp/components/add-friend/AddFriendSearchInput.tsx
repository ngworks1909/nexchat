"use client"
import { AddFriendSearchState } from '../../atoms/AddFriendSearchState'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Input } from '../ui/input'

export default function AddFriendSearchInput() {
  const searchQuery = useRecoilValue(AddFriendSearchState)
  const setSearchQuery = useSetRecoilState(AddFriendSearchState)
  return (
    <Input placeholder="Search friends..." value={searchQuery} onChange={(e) => {
        e.preventDefault();
        setSearchQuery(e.target.value)
  }} className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" />
  )
}
