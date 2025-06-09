"use client"
import { SocketState } from "@/atoms/SocketState";
import { SessionUser } from "@/hooks/useAddFriend";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const setSocket = useSetRecoilState(SocketState);
    const session = useSession();
    const router = useRouter()
    
    useEffect(() => {
        if(!session){
            router.push('/login')
            return
        }
        const user = session.data?.user as SessionUser;
        const userId = user?.id;
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
            setSocket(ws);
            ws.send(
                JSON.stringify({
                  action: 'add-user',
                  payload: {
                    userId,
                  },
            })
        );
        };
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close()
        }
    })
    return (
        <SocketContext.Provider value={null}>
            {children}
        </SocketContext.Provider>
    )
}