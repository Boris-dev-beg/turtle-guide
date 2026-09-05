import { proceduresServices } from "@/services/procedure.service"; 
import { NextResponse } from "next/server"; 

export async function GET() { 
  const response = await proceduresServices.getFew(); 

  return NextResponse.json(response); 
} 
