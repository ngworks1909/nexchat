import { Message } from "@/interfaces/ChatInterface";
import { atom } from "recoil";

export const UnSeenMessagesState = atom<Message[]>({
    key: 'UnSeenMessagesState',
    default: []
})