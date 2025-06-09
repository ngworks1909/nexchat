"use server"
import { Search } from 'lucide-react'
import { fetchFriends } from '@/actions/fetchFriends'
import FriendList from '../friends/FriendList'
import BackButton from '../friends/BackButton'
import AddFriendSearchInput from '../add-friend/AddFriendSearchInput'
import AddFriendList from '../add-friend/AddFriendList'
import RequestSearchInput from './RequestSearchInput'
import { fetchRequests } from '@/actions/fetchRequests'
import RequestList from './RequestList'


export default async function Requests() {
  const requests = await fetchRequests();
  return (
    <div className="flex flex-col h-dvh">
      <div className="flex-none p-6 space-y-6 bg-white shadow-sm">
        <div className="flex justify-start items-center">
          <BackButton/>
        </div>
        
        <h1 className="text-3xl text-emerald-500 font-semibold">Requests</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          < RequestSearchInput/>
        </div>
      </div>
        <RequestList initialRequests={requests}/>
    </div>
  )
}


