import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { documentServices } from "@/services/documents.service";

const kpayCallbackSchema = z.object({
  event: z.enum([
    "payment.completed",
    "payment.failed",
    "payment.cancelled",
  ]),
  paymentId: z.string().min(1),
  externalId: z.string().min(1),
  status: z.enum(["COMPLETED", "FAILED", "CANCELLED"]),
  amount: z.number().int().positive(),
  currency: z.string().optional(),
});

/**
 * Vérifie la signature HMAC du corps brut KPay en temps constant afin de ne
 * traiter que les callbacks authentiques du prestataire.
 */
function isValidKpaySignature(rawBody: Buffer, signature: string, secret: string) {
  if (!/^[a-f\d]{64}$/i.test(signature)) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const received = Buffer.from(signature, "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

/**
 * Reçoit les changements d'état KPay, vérifie leur signature puis synchronise
 * la transaction seulement si référence et montant concordent avec la base.
 */
export async function POST(request: Request) {
  // À compléter dans l'environnement : secret webhook généré/configuré dans KPAY-NOW.
  const webhookSecret = process.env.KPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Webhook KPay désactivé : KPAY_WEBHOOK_SECRET est absente.");
    return Response.json({ error: "KPAY_WEBHOOK_SECRET doit être configurée." }, { status: 500 });
  }

  const signature = request.headers.get("x-kpay-signature");
  if (!signature) {
    return Response.json({ error: "Signature KPay manquante." }, { status: 400 });
  }

  const rawBody = Buffer.from(await request.arrayBuffer());
  if (!isValidKpaySignature(rawBody, signature, webhookSecret)) {
    return Response.json({ error: "Signature KPay invalide." }, { status: 400 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return Response.json({ error: "Corps KPay invalide." }, { status: 400 });
  }

  const parsed = kpayCallbackSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Événement KPay invalide." }, { status: 400 });
  }

  const callback = parsed.data;
  const expectedEvent = `payment.${callback.status.toLowerCase()}`;
  if (
    callback.event !== expectedEvent ||
    (callback.currency && callback.currency.toUpperCase() !== "XAF")
  ) {
    return Response.json({ error: "Statut ou devise KPay incohérent." }, { status: 400 });
  }

  try {
    await documentServices.finalizeKpayPayment({
      externalId: callback.externalId,
      amount: callback.amount,
      status: callback.status === "COMPLETED" ? "SUCCESS" : "FAILED",
    });

    return Response.json({ reply: "OK" });
  } catch (error) {
    console.error("Échec du traitement du webhook KPay:", error);
    return Response.json({ error: "Échec du traitement du paiement KPay." }, { status: 500 });
  }
}
