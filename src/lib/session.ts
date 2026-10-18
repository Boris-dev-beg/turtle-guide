import { redirect } from "next/navigation"; 
import { auth } from "./auth/auth"; // path to your Better Auth server instance 
import { headers } from "next/headers"; 

export async function getSession() { 
  return await auth.api.getSession({ 
    headers: await headers(), 
  }); 
} 

export async function requireSession(uriComponent?: string) { 
  const session = await getSession(); 

  if (!session?.user) { 
    redirect(`/login?callbackUrl=${encodeURIComponent(uriComponent || window.location.href)}`); 
  } 

  return session; 
} 
