import { redirect } from "next/navigation"; 
import { auth } from "./auth/auth";
import { headers } from "next/headers"; 

export async function getSession() { 
  return await auth.api.getSession({ 
    headers: await headers(), 
  }); 
} 

export async function requireSession(uriComponent?: string) { 
  const session = await getSession(); 

  if (!session?.user) { 
    redirect(`/login?callbackUrl=${encodeURIComponent(uriComponent || "")}`); 
  } 

  return session; 
} 
