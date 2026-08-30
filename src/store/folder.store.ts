import { create } from "zustand";

type Folder = {
  category: string;
  procedure: string;
  setCategory: (category: string) => void;
  setProcedure: (procedure: string) => void;
};

export const useFolderStore = create<Folder>()((set) => ({
  category: "",
  procedure: "",
  setCategory: (category) => set(() => ({ category })),
  setProcedure: (procedure) => set(() => ({ procedure })),
}));
