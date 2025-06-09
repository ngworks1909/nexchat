import { Friend } from "@/interfaces/AppInterface";
import { create } from "zustand";

interface ContactInterface {
  selected: string | null;
  chats: Friend[];
}

export const useContactState = create<ContactInterface & { setState: (state: Partial<ContactInterface>) => void }>((set) => ({
  selected: null,
  chats: [],
  setState: (state) => set((prevState) => ({ ...prevState, ...state })),
}));
