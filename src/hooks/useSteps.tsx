"use client"; 

import { getAllStep, getAllSteps } from "@/lib/step.action"; 
import { useQuery } from "@tanstack/react-query"; 
import { useState } from "react"; 

export function useSteps() { 
  const [processId, setProcessId] = useState(""); 
  const { data: steps, isLoading } = useQuery({ 
    queryKey: ["steps", processId], 
    queryFn: () => getAllSteps(processId), 
    enabled: !!processId, 
  }); 

  const {data: AllSteps, isLoading: isAllStepsLoading} = useQuery({
    queryKey: ["allSteps"], 
    queryFn: () => getAllStep(), 
  });

  return { steps, isLoading, setProcessId, AllSteps, isAllStepsLoading }; 
} 
