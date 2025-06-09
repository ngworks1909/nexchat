"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"


type RequestStatus = "Sent" | "Accepted" | "Rejected"

type SearchFriendResponse = {
    image: string,
    userId: string,
    username: string,
    sentRequests: {
        requestId: string
        requestStatus: RequestStatus,
    }[];
    receivedRequests: {
        requestId: string,
        requestStatus: RequestStatus,
    }[];
}

export type ClientRequestStatus = "Accept" | "Remove" | "Friends" | "Request"

export type SearchFriend = {
    userId: string,
    username: string,
    image: string,
    requestId: string | null,
    requestStatus: ClientRequestStatus
}

export type SessionUser = {
    name?: string | null,
    email?: string | null,
    image?: string | null,
    id?: string | null,
} | null

export const useAddFriend = (data: string, timeout: number) => {
    const [users, setUsers] = useState<SearchFriend[]>([]);
    const [loading, setLoading] = useState(false)
    const session = useSession();
    const user = session.data?.user as SessionUser
    const userId = user?.id
    useEffect(() => {
        if(!userId) return
        let timeOutNumber = setTimeout(async() => {
            if(data){
                setLoading(true)
                fetch(`/api/requests/search-users/${data}`, {
                    method: 'GET',
                }).then((response) => {
                    response.json().then((json) => {
                        const users: SearchFriendResponse[] = json.users;
                        console.log(users);
                        const filteredUsers: SearchFriend[] = []
                        for(const user of  users){
                            if(user.userId === userId) continue;
                            if(user.sentRequests.length > 0){
                                filteredUsers.push({userId: user.userId, username: user.username, image: user.image, requestId: user.sentRequests[0].requestId, requestStatus: user.sentRequests[0].requestStatus === "Accepted"? "Friends": "Accept"});
                                continue
                            }
                            if(user.receivedRequests.length > 0){
                                filteredUsers.push({userId: user.userId, username: user.username, image: user.image, requestId: user.receivedRequests[0].requestId, requestStatus: user.receivedRequests[0].requestStatus === "Accepted"? "Friends": "Remove"});
                                continue
                            }
                            filteredUsers.push({userId: user.userId, username: user.username, image: user.image, requestId: null, requestStatus: "Request"})
                        }
                        setUsers(filteredUsers)
                        setLoading(false)
                    })
                })
            }
            else{
                setUsers([])
            }
        }, timeout);
        return () => {
            clearTimeout(timeOutNumber);
        }
    }, [data, timeout, userId]);

    return {loading, users, setUsers}
}
