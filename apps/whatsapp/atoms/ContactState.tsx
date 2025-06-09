import { SideChat } from "@/interfaces/ChatInterface";
import { atom } from "recoil";

export const ContactState = atom<SideChat[]>({
    key: 'ContactState',
    default: []
})