"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function startDocumentPurchase(documentId: string) {
  const session = await getSession();
  if (!session)
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/documents/${documentId}`)}`,
    );

  const doc = await prisma.document.findUniqueOrThrow({
    where: { id: documentId },
  });

  const purchase = await prisma.documentPurchase.create({
    data: { userId: session.user.id, documentId: doc.id, amount: doc.price },
  });

  // TODO : créer la Transaction (statut INITIATED) puis rediriger vers le paiement
  redirect(`/checkout/${purchase.id}`);
}
