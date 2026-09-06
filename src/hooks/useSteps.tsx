"use client"; 

import { getAllSteps } from "@/lib/step.action"; 
import { useQuery } from "@tanstack/react-query"; 
import { useState } from "react"; 

export function useSteps() { 
  const [processId, setProcessId] = useState(""); 
  const { data: steps, isLoading } = useQuery({ 
    queryKey: ["steps", processId], 
    queryFn: () => getAllSteps(processId), 
    enabled: !!processId, 
  }); 

  return { steps, isLoading, setProcessId }; 
} 
