"use server"
import { Search } from 'lucide-react'
import { fetchFriends } from '@/actions/fetchFriends'
import BackButton from './BackButton'
import AddUserButton from './AddUserButton'
import FriendSearchInput from './FriendSearchInput'
import FriendList from './FriendList'


export default async function Friends() {
  let friends = await fetchFriends()

  return (
    <div className="flex flex-col h-dvh">
      <div className="flex-none p-6 space-y-6 bg-white shadow-sm">
        <div className="flex justify-between items-center">
          <BackButton/>
          <AddUserButton/>
        </div>
        
        <h1 className="text-3xl text-emerald-500 font-semibold">Friends</h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <FriendSearchInput/>
        </div>
      </div>
      
        <FriendList initialFriends={friends}/>
    </div>
  )
}

