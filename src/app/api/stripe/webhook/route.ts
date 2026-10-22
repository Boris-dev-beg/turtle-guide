import { stripe } from "@/lib/payment/stripe";
import { documentServices } from "@/services/documents.service";
import type Stripe from "stripe";

/**
 * Vérifie la signature Stripe sur le corps brut puis synchronise uniquement
 * les achats de documents dont la session correspond aux données enregistrées.
 */
export async function POST(request: Request) {
  // À compléter : ajouter STRIPE_WEBHOOK_SECRET (whsec_...) fourni par Stripe.
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signingSecret) {
    return Response.json(
      { error: "STRIPE_WEBHOOK_SECRET doit être configurée." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Signature Stripe manquante." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, signingSecret);
  } catch {
    return Response.json({ error: "Signature Stripe invalide." }, { status: 400 });
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded" ||
      event.type === "checkout.session.async_payment_failed" ||
      event.type === "checkout.session.expired"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      await applyCheckoutEvent(event.type, session);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Échec du traitement du webhook Stripe:", error);
    return Response.json({ error: "Échec du traitement du paiement." }, { status: 500 });
  }
}

/**
 * Traduit un événement Checkout vérifié en statut interne, en contrôlant les
 * métadonnées et le montant via le service avant d'accorder l'accès au document.
 */
async function applyCheckoutEvent(
  eventType: string,
  session: Stripe.Checkout.Session,
) {
  const transactionId = session.metadata?.transactionId;
  const purchaseId = session.metadata?.documentPurchaseId;
  if (!transactionId || !purchaseId || !session.amount_total || !session.currency) {
    throw new Error("Métadonnées ou montant Checkout manquants.");
  }

  const status =
    eventType === "checkout.session.async_payment_succeeded" ||
    (eventType === "checkout.session.completed" && session.payment_status === "paid")
      ? "SUCCESS"
      : eventType === "checkout.session.completed"
        ? "PENDING"
        : "FAILED";

  await documentServices.finalizeCheckoutPayment({
    transactionId,
    sessionId: session.id,
    purchaseId,
    amount: session.amount_total,
    currency: session.currency,
    status,
  });
}
