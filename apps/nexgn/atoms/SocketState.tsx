import { create } from "zustand";

type SocketState = {
    socket: WebSocket | null;
    setSocket: (data: WebSocket | null) => void;
};

export const useSocketState = create<SocketState>((set) => ({
    socket: null,
    setSocket: (data: WebSocket | null) => set({ socket: data }),
}));
