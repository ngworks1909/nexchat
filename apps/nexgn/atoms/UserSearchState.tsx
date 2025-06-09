import { create } from "zustand";

type SearchInterface = {
  search: string;
  setSearch: (search: string) => void;
};

export const useUserSearchState = create<SearchInterface>((set) => ({
  search: '',
  setSearch: (search: string) => set({ search }),
}));
