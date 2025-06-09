"use client"
import { AddFriendSearchState } from '@/atoms/AddFriendSearchState'
import { ClientRequestStatus, SearchFriend, useAddFriend } from '@/hooks/useAddFriend';
import { useRecoilValue } from 'recoil'
import NoFriendsFound from '../friends/NoFriendsFound';
import FriendSkeletonCardGrid from './FriendSkeletonCardGrid';
import AddFriendCard from './AddFriendCard';
import { RequestStatus } from '@prisma/client';

export default function AddFriendList() {
  const email = useRecoilValue(AddFriendSearchState);
  const {users, loading, setUsers} = useAddFriend(email, 500);
  const handleChangeStatus = (userId: string, status: ClientRequestStatus) => {
    const updatedUsers = users.map((user) => {
        return user.userId === userId ? {...user, requestStatus: status} as SearchFriend: user
    })
    setUsers(updatedUsers)
  }
  if(loading){
    return <FriendSkeletonCardGrid/>
  }
  else if(!email){
    return <NoFriendsFound message='Seach for friends'/>
  }
  else if(users.length === 0){
    return <NoFriendsFound message='No users found'/>
  }

  return (
    <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-6">
        {users.map((user, index) => (
          <AddFriendCard user={user} key={index} updateStatus = {handleChangeStatus} />
        ))}
      </div>
    </div>
  )
}
