import { ContactState } from "@/atoms/ContactState"
import { useEffect, useState } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"

export const useContacts = () => {
    const [loading, setLoading] = useState(true)
    const contacts = useRecoilValue(ContactState);
    const setContacts = useSetRecoilState(ContactState);

    useEffect(() => {
        async function fetchContacts(){
            try {
                const response = await fetch('/api/friends/fetch-friends', {
                    method: "GET"
                });
                const data = await response.json();
                if(data.success){
                    setContacts(data.friends)
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


    return {loading, contacts}


}