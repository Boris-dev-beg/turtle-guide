"use server"; 

import { stepServices } from "@/services/steps.service"; 

export async function getAllSteps(processId: string) { 
  return await stepServices.getAllSteps(processId); 
} 

export async function getAllStep() { 
  return await stepServices.getAllStep(); 
} 
