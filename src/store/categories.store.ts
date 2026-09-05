import { create } from "zustand"; 

type proceducesState = { 
  loading: boolean; 
  length: number; 
}; 
type proceducesActions = { 
  setLoading: (a: boolean) => void; 
  setLength: (a: number) => void; 
}; 

export const useProceducesStore = create<proceducesState & proceducesActions>()( 
  (set) => ({ 
    loading: true, 
    length: 0, 
    setLoading: (loading) => set(() => ({ loading: loading })), 
    setLength: (length) => set(() => ({ length: length })), 
  }), 
); 
