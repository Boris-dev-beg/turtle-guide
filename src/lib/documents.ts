"use server";

import { requireSession } from "@/lib/session";
import { checkoutRequestSchema } from "@/lib/payment/checkout-schema";
import {
  createKpayGatewayPayment,
  getKpayCredentials,
} from "@/lib/payment/kpay";
import { documentServices } from "@/services/documents.service";

/**
 * Crée une commande depuis le document en base, puis redirige vers Stripe
 * Checkout ou le portail hébergé KPAY-NOW. Le prix est décidé côté serveur;
 * le formulaire ne transmet qu'un identifiant et la méthode.
 */
export async function startDocumentPurchase(input: unknown) {
  const { documentId, method } = checkoutRequestSchema.parse(input);
  const session = await requireSession(`/documents/${documentId}`);

  // Vérifie les secrets KPay avant de créer une commande incomplète en base.
  const kpayCredentials = method === "kpay" ? getKpayCredentials() : undefined;

  // Détermine l'URL de retour depuis la configuration serveur, jamais depuis le navigateur.
  let appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl && process.env.VERCEL_URL) {
    appUrl = `https://${process.env.VERCEL_URL}`;
  }
  if (!appUrl && process.env.NODE_ENV === "development") {
    appUrl = "http://localhost:3000";
  }
  if (!appUrl) {
    throw new Error("Impossible de déterminer l'URL de l'application.");
  }

  const { document, purchase, payment } =
    await documentServices.createPendingPurchase(
      documentId,
      session.user.id,
      method === "card" ? "stripe" : "kpay",
    );

  if (method === "kpay") {
    try {
      const checkoutUrl = await createKpayGatewayPayment({
        amount: Number(document.price),
        externalId: payment.reference,
        returnUrl: `${appUrl}/documents/${document.id}?payment=kpay_pending`,
        description: `Achat du document : ${document.name}`,
        credentials: kpayCredentials!,
      });
      return { checkoutUrl };
    } catch (error) {
      await documentServices.updatePurchaseTransactionStatus(payment.id, "FAILED");
      throw error;
    }
  }

  // Stripe n'est chargé que pour la méthode carte, afin que KPay reste autonome.
  const { stripe } = await import("@/lib/payment/stripe");
  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
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

    if (!checkout.url) throw new Error("Stripe n'a pas retourné d'URL Checkout.");
    await documentServices.attachCheckoutSession(payment.id, checkout.id);
    return { checkoutUrl: checkout.url };
  } catch (error) {
    await documentServices.updatePurchaseTransactionStatus(payment.id, "FAILED");
    throw error;
  }
}

/**
 * Retourne vrai uniquement lorsqu'une transaction SUCCESS existe pour cet
 * utilisateur et ce document; cette fonction pilote l'accès au document.
 */
export async function findPurchase(userId: string, docId: string) {
  return documentServices.findFirstPurchase(userId, docId);
}
