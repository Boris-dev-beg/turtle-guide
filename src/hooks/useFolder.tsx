import { updateFolderStatus } from "@/lib/folder.action"; 
import { useMutation } from "@tanstack/react-query"; 

export function useFolder() { 

  const updateStatus = useMutation({ 
    mutationFn: async (data: { 
      id: string; 
      userId: string; 
      processId: string; 
      status: "CREATED" | "PENDING" | "CLOSED" | "ENDED"; 
    }) => { 
      return await updateFolderStatus(data); 
    }, 
  }); 

  return { 
    updateStatus, 
  }; 
} 
