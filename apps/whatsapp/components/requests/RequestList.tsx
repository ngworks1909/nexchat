"use client"
import { UserRequest } from '@/actions/fetchRequests'
import { RequestSearchState } from '@/atoms/RequestSearchState';
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil';
import RequestCard from './RequestCard';

export default function RequestList({initialRequests}: {initialRequests: UserRequest[]}) {
  const [requests, setRequests] = useState<UserRequest[]>(initialRequests);
  const searchQuery = useRecoilValue(RequestSearchState)
  const filteredRequests = requests.filter(request =>
    request.sender.username.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const removeRequest = (requestId: string) => {
    setRequests(requests.filter(request => request.requestId !== requestId))
  }
  return (
    <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6">
          {filteredRequests.map((request, index) => (
            <RequestCard key={index} request={request} removeRequest = {removeRequest}/>
          ))}
        </div>
    </div>
  )
}
