import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ClientRequestStatus, SearchFriend } from '@/hooks/useAddFriend';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AddFriendCard({user, updateStatus}: {user: SearchFriend, updateStatus: (userId: string, status: ClientRequestStatus) => void}) {
  const [loading, setLoading] = useState(false);

  const {toast} = useToast()
  const handleSend = async() => {
    const userId = user.userId
    if(userId){
        setLoading(true);
        const response = await fetch('/api/requests/create-request', {
            method: "POST",
            body: JSON.stringify({receiverId: userId})
        });
        const json = await response.json();
        if(json.success){
            //handle send
            toast({
                title: "Success!",
                description: json.message,
                className: "bg-emerald-500 text-white"
            })
            updateStatus(userId, "Remove");
        }
        else{
            toast({
                title: "Failed!",
                description: json.message,
                variant: "desc"
            })
        }
        setLoading(false)
    }
  }
  const handleRemove = async() => {
    const requestId = user.requestId;
    const userId = user.userId
    if(requestId){
        setLoading(true);
        const response = await fetch(`/api/requests/delete-request/${requestId}`, {
            method: "DELETE",
        });
        const json = await response.json();
        if(json.success){
            //handle remove
            toast({
                title: "Success!",
                description: json.message,
                className: "bg-emerald-500 text-white"
            })
            updateStatus(userId, "Request")
        }
        else{
            toast({
                title: "Failed!",
                description: json.message,
                variant: "destructive"
            })
        }
        setLoading(false)
    }
  }

  const handleAccept = async() => {
    const requestId = user.requestId;
    const userId = user.userId
    if(requestId){
        setLoading(true);
        const response = await fetch(`/api/requests/accept-request/${requestId}`, {
            method: "PUT",
        });
        const json = await response.json();
        if(json.success){
            //handle accept
            toast({
                title: "Success!",
                description: json.message,
                className: "bg-emerald-500 text-white"
            })
            updateStatus(userId, "Friends")
        }
        else{
            toast({
                title: "Failed!",
                description: json.message,
                variant: "destructive"
            })
        }
        setLoading(false)
    }
  }
  const getButton = () => {
    if(user.requestStatus === "Request"){
      return <Button onClick={async(e) => {e.preventDefault(); await handleSend()}} 
        variant="secondary"
        className="rounded-full bg-emerald-400 hover:bg-emerald-500 text-white"
        disabled={loading}
      >
          {loading ? <>
              <svg className="w-5 h-5 mr-0 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {"Sending..."}
          </>: "Request"}
        </Button>
    }
    else if(user.requestStatus === "Remove"){
      return <Button className='rounded-full' variant={"destructive"}
      onClick={async(e) => {e.preventDefault(); await handleRemove()}} disabled={loading}
      >{loading ? <>
        <svg className="w-5 h-5 mr-0 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {"Removing..."}
    </>: "Remove"}</Button>
    }
    else if(user.requestStatus === "Accept") {
      return <Button className='rounded-full'
      onClick={async(e) => {e.preventDefault(); await handleAccept()}} disabled={loading} 
       >{loading ? <>
        <svg className="w-5 h-5 mr-0 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {"Accepting..."}
    </>: "Accept"}</Button>
    }
    else{
      return <Button className='rounded-full' variant={"secondary"}>{"Friends"}</Button>
    }
  }
  return (
    <Card key={user.userId} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                   <AvatarImage src={user.image} alt={user.username} />
                   <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.username}</span>
              </div>
              {getButton()}
            </CardContent>
          </Card>
  )
}
