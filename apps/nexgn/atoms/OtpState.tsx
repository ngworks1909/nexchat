import { create } from "zustand";

type OtpState = {
    status: boolean;
    setStatus: (status: boolean) => void;
};

export const useOtpState = create<OtpState>((set) => ({
    status: false,
    setStatus: (status: boolean) => set({ status }),
}));
