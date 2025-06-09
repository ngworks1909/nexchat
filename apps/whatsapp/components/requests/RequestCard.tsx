import { UserRequest } from '@/actions/fetchRequests'
import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RequestCard({request, removeRequest}: {request: UserRequest, removeRequest: (requestId: string) => void}) {
  const [loading, setLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(true);
  const {toast} = useToast();
  const handleAccept = async() =>{
    setLoading(true);
    const response = await fetch(`/api/requests/accept-request/${request.requestId}`, {
        method: "PUT"
    });
    const json = await response.json();
    if(json.success){
        //handle accept
        toast({
            title: "Success!",
            description: json.message,
            className: "bg-emerald-500 text-white"
        })
        removeRequest(request.requestId)
    } else {
        toast({
            title: "Failed!",
            description: json.message,
            variant: "destructive"
        })
    }
    setLoading(false);
  }
  const handleReject = async() => {
    setIsAccepting(!isAccepting);
    setLoading(true);
    const response = await fetch(`/api/requests/delete-request/${request.requestId}`, {
        method: "DELETE"
    });
    const json = await response.json();
    if(json.success){
        toast({
            title: "Success!",
            description: json.message,
            className: "bg-emerald-500 text-white"
        })
        removeRequest(request.requestId);
    }
    else{
        toast({
            title: "Failed!",
            description: json.message,
            variant: "destructive"
        })
    }
    setLoading(false);
  }
  return (
    <Card className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                   <AvatarImage src={request.sender.image} alt={request.sender.username} />
                   <AvatarFallback>{request.sender.username[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{request.sender.username}</span>
              </div>
              <div className='flex gap-2 items-center'>
              <Button className={`rounded-full ${isAccepting ? 'bg-emerald-500': 'bg-red-500'}`}
                    onClick={async(e) => { e.preventDefault(); await handleAccept()}} disabled={loading}
                    >{loading ? <>
                      <svg className="w-5 h-5 mr-0 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isAccepting? "Accepting...": "Rejecting..."}
                    </>: "Accept"}
               </Button>
               {!loading && <X className="h-4 w-4" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {e.preventDefault(); handleReject()}} />}
              </div>
        </CardContent>
    </Card>
  )
}
