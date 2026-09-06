import { proceduresServices } from "@/services/procedure.service"; 
import { NextResponse } from "next/server"; 

export async function GET() { 
  const responses = await proceduresServices.getAll(); 

return NextResponse.json(responses); 
} 
