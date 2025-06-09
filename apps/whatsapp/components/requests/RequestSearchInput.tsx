"use client"
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { Input } from '../ui/input'
import { RequestSearchState } from '@/atoms/RequestSearchState'

export default function RequestSearchInput() {
  const searchQuery = useRecoilValue(RequestSearchState)
  const setSearchQuery = useSetRecoilState(RequestSearchState)
  return (
    <Input placeholder="Search requests..." value={searchQuery} onChange={(e) => {
        e.preventDefault();
        setSearchQuery(e.target.value)
  }} className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" />
  )
}