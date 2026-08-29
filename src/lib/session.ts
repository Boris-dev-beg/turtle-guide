import { redirect } from "next/navigation";
import { auth } from "./auth"; // path to your Better Auth server instance
import { headers } from "next/headers";

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireSession() {
  const session = await getSession();

  console.log("User Session", session);
  if (!session?.user) {
    redirect("/login");
  }

  return session;
}
