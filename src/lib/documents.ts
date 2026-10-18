"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { documentServices } from "@/services/documents.service";

export async function startDocumentPurchase(documentId: string) {
  const session = await requireSession(`/documents/${documentId}`);

  const purchase = await documentServices.createPurchase(
    documentId,
    session.user.id,
  );

  // TODO : créer la Transaction (statut INITIATED) puis rediriger vers le paiement
  redirect(`/checkout/${purchase.id}`);
}

export async function findPurchase(userId: string, docId: string) {
  return await documentServices.findFirstPurchase(userId, docId);
}
