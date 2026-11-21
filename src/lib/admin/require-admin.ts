import "server-only";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

/** Représente un refus de session ou de rôle renvoyable proprement par les actions serveur. */
export class AdminAuthorizationError extends Error {
  constructor(public readonly code: "UNAUTHENTICATED" | "NOT_ADMIN") {
    super(code === "UNAUTHENTICATED" ? "Connexion requise." : "Accès administrateur requis.");
    this.name = "AdminAuthorizationError";
  }
}

/** Recharge le rôle depuis la base à chaque appel pour que le retrait d'accès prenne effet immédiatement. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) throw new AdminAuthorizationError("UNAUTHENTICATED");

  const administrator = await prisma.administrator.findUnique({
    where: { userId: session.user.id },
    select: { id: true, accessLevel: true },
  });

  if (!administrator || administrator.accessLevel !== "all") {
    throw new AdminAuthorizationError("NOT_ADMIN");
  }

  return { session, administrator };
}
