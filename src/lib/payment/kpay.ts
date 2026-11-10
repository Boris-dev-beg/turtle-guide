import "server-only";

import { z } from "zod";

const KPAY_API_URL = "https://admin.kpay.site/api/v1/payments/init";

const kpayGatewayResponseSchema = z.object({
  mode: z.literal("GATEWAY"),
  gatewayUrl: z.string().url(),
});

/**
 * Lit les identifiants privés KPay et échoue avant la création d'une transaction
 * si la configuration serveur n'est pas complète.
 */
export function getKpayCredentials() {
  const apiKey = process.env.KPAY_API_KEY;
  const secretKey = process.env.KPAY_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error("KPAY_API_KEY et KPAY_SECRET_KEY doivent être configurées.");
  }

  return { apiKey, secretKey };
}

/**
 * Crée une session de paiement hébergée KPAY-NOW en XAF et retourne son URL;
 * la page KPay collecte le numéro et laisse le client choisir son opérateur.
 */
export async function createKpayGatewayPayment({
  amount,
  externalId,
  returnUrl,
  description,
  credentials,
}: {
  amount: number;
  externalId: string;
  returnUrl: string;
  description: string;
  credentials: ReturnType<typeof getKpayCredentials>;
}) {
  if (!Number.isSafeInteger(amount) || amount < 50) {
    throw new Error("Le montant KPay doit être un entier d'au moins 50 XAF.");
  }

  const response = await fetch(KPAY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": credentials.apiKey,
      "X-Secret-Key": credentials.secretKey,
    },
    body: JSON.stringify({
      amount,
      currency: "XAF",
      externalId,
      returnUrl,
      description,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  const body: unknown = await response.json().catch(() => null);
  const gateway = kpayGatewayResponseSchema.safeParse(body);
  if (!response.ok || !gateway.success) {
    throw new Error("KPay n'a pas pu créer la page de paiement.");
  }

  return gateway.data.gatewayUrl;
}
