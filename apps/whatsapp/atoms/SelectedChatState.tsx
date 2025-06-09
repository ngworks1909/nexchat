import { SideChat } from "@/interfaces/ChatInterface";
import { atom } from "recoil";

export const SelectedChatState = atom<SideChat | null>({
    key: 'SelectedChatState',
    default: null
})