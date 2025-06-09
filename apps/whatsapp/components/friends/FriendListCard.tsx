import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Friend } from '@/actions/fetchFriends'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { useToast } from '@/hooks/use-toast'

export default function FriendListCard({friend, removeFriend}: {friend: Friend, removeFriend: (friendId: string) => void}) {
  const {toast} = useToast()
    
  const [loading, setLoading] = useState(false)
  const handleRemove = async () => {
    setLoading(true)
    const response = await fetch(`/api/friends/remove-friend/${friend.friendId}`, {
        method: "DELETE",
    });
    const json = await response.json();
    if(json.success){
        //handle success
        setLoading(false)
        removeFriend(friend.friendUser.userId)
        toast({
            title: "Success!",
            description: json.message,
            className: "bg-emerald-500 text-white"
        })
    }
    else{
        setLoading(false)
        toast({
            title: "Failed!",
            description: json.message,
            variant: "destructive"
        })
    }
  }
  return (
    <Card key={friend.friendUser.userId} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                   <AvatarImage src={friend.friendUser.image} alt={friend.friendUser.username} />
                   <AvatarFallback>{friend.friendUser.username[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{friend.friendUser.username}</span>
              </div>
              <Button className='rounded-full' variant={"destructive"}
                    onClick={async(e) => {e.preventDefault(); await handleRemove()}} disabled={loading}
                    >{loading ? <>
                      <svg className="w-5 h-5 mr-0 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {"Removing..."}
                    </>: "Remove"}
               </Button>
        </CardContent>
    </Card>
  )
}
