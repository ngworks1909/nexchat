"use client"

import { useContactState } from "@/atoms/ContactState";
import { useEffect, useState } from "react"

export const useContacts = () => {
    const [loading, setLoading] = useState(true)
    const {setState} = useContactState()

    useEffect(() => {
        async function fetchContacts(){
            try {
                const response = await fetch('/api/chat/fetch-chats', {
                    method: "GET"
                });
                const data = await response.json();
                if(data.success){
                    setState({chats: data.friends})
                }
            } catch (error) {
                console.log(error)
            }
            finally{
                setLoading(false)
            }
        }

        fetchContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return {loading}


}