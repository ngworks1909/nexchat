"use client"
import { Friend } from '@/actions/fetchFriends'
import { FriendSearchState } from '@/atoms/FriendSearchState'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import NoFriendsFound from './NoFriendsFound'
import FriendListCard from './FriendListCard'

export default function FriendList({initialFriends}: {initialFriends: Friend[]}) {
  const [friends, setFriends] = useState(initialFriends)
  const searchQuery = useRecoilValue(FriendSearchState);
  const removeFriend = (userId: string) => {
    setFriends(friends.filter(friend => friend.friendUser.userId !== userId))
  }

  const filteredFriends = friends.filter(friend =>
    friend.friendUser.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (filteredFriends.length === 0) {
    return <NoFriendsFound message='No friends found' />
  }

  return (
    <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6">
        {filteredFriends.map((friend, index) => (
          <FriendListCard key={index} friend={friend} removeFriend={removeFriend} />
        ))}
      </div>
    </div>
  )
}

