import { create } from "zustand";

interface AuthInterface {
   username: string,
   email: string, 
   password: string
}

export const useAuthState = create<AuthInterface & { setState: (state: Partial<AuthInterface>) => void }>((set) => ({
  username: '',
  email: '', 
  password: '',
  setState: (state) => set((prevState) => ({ ...prevState, ...state })),
}));
