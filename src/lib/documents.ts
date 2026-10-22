"use server";

import { z } from "zod";
import { requireSession } from "@/lib/session";
import { stripe } from "@/lib/payment/stripe";
import { documentServices } from "@/services/documents.service";

// AJOUTÉ - Valide strictement les seules données permises depuis le navigateur.
const checkoutRequestSchema = z.object({
  documentId: z.string().min(1),
  method: z.literal("card"),
});

/**
 * Crée une commande depuis le document en base, initialise son paiement Stripe
 * et redirige le navigateur vers Checkout. Le prix et la devise sont décidés
 * côté serveur; le formulaire ne transmet qu'un identifiant et la méthode.
 */
export async function startDocumentPurchase(input: unknown) {
  const { documentId, method } = checkoutRequestSchema.parse(input);
  const session = await requireSession(`/documents/${documentId}`);
  const { document, purchase, payment } =
    await documentServices.createPendingPurchase(documentId, session.user.id);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL n'est pas configurée.");
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: [method],
    client_reference_id: payment.reference,
    customer_email: session.user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "xaf",
          // XAF is zero-decimal: the FCFA integer is sent unchanged.
          unit_amount: Number(document.price),
          product_data: {
            name: document.name,
            metadata: { documentPurchaseId: purchase.id },
          },
        },
      },
    ],
    metadata: {
      documentPurchaseId: purchase.id,
      transactionId: payment.id,
      userId: session.user.id,
      method,
    },
    success_url: `${appUrl}/documents/${document.id}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/documents/${document.id}?payment=cancelled`,
  });

  if (!checkout.url) {
    await documentServices.updatePurchaseTransactionStatus(
      payment.id,
      "FAILED",
    );
    throw new Error("Stripe n'a pas retourné d'URL Checkout.");
  }

  await documentServices.attachCheckoutSession(payment.id, checkout.id);
  return { checkoutUrl: checkout.url };
}

/**
 * Retourne vrai uniquement lorsqu'une transaction SUCCESS existe pour cet
 * utilisateur et ce document; cette fonction pilote l'accès au document.
 */
export async function findPurchase(userId: string, docId: string) {
  return documentServices.findFirstPurchase(userId, docId);
}
