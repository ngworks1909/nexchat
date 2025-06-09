import { atom } from "recoil";

export const SocketState = atom<WebSocket | null>({
    key: 'SocketState',
    default: null
})