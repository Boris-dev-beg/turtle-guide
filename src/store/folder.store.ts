import { create } from "zustand"; 
import { persist } from "zustand/middleware"; 

type Folder = { 
  category: string; 
  procedure: string; 
  setCategory: (category: string) => void; 
  setProcedure: (procedure: string) => void; 
}; 

export const useFolderStore = create<Folder>()( 
  persist( 
    (set) => ({ 
      category: "", 
      procedure: "", 
      setCategory: (category) => set({ category }), 
      setProcedure: (procedure) => set({ procedure }), 
    }), 
    { name: "folder-storage" }, 
  ), 
); 
