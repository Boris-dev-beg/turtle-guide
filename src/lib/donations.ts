"use server";

import { donationRequestSchema } from "@/lib/payment/donation-schema";
import { getSession } from "@/lib/session";
import { createKpayGatewayPayment, getKpayCredentials } from "@/lib/payment/kpay";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "node:crypto";

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NODE_ENV === "development" ? "http://localhost:3000" : null);
}

export async function startDonation(input: unknown) {
  const values = donationRequestSchema.parse(input);
  const session = await getSession();
  const kpayCredentials = values.method === "kpay" ? getKpayCredentials() : undefined;
  const appUrl = getAppUrl();
  if (!appUrl) throw new Error("Impossible de déterminer l’URL de l’application.");

  const donation = await prisma.donation.create({
    data: {
      amount: values.amount,
      userId: session?.user.id,
      transaction: { create: { reference: randomUUID(), amount: values.amount, paymentMethod: values.method === "card" ? "stripe" : "kpay", status: "INITIATED" } },
    },
    include: { transaction: true },
  });
  const payment = donation.transaction[0];

  if (values.method === "kpay") {
    try {
      const checkoutUrl = await createKpayGatewayPayment({ amount: values.amount, externalId: payment.reference, returnUrl: `${appUrl}/donation?payment=pending`, description: "Don à TurtleGuide", credentials: kpayCredentials! });
      return { checkoutUrl };
    } catch (error) {
      await prisma.transaction.update({ where: { id: payment.id }, data: { status: "FAILED" } });
      throw error;
    }
  }

  try {
    const { stripe } = await import("@/lib/payment/stripe");
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: payment.reference,
      customer_email: values.email || session?.user.email,
      line_items: [{ quantity: 1, price_data: { currency: "xaf", unit_amount: values.amount, product_data: { name: "Don à TurtleGuide", description: values.message || "Soutien au service d’orientation gratuit" } } }],
      metadata: { donationId: donation.id, transactionId: payment.id, method: "donation", donorName: values.name || "" },
      success_url: `${appUrl}/donation?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/donation?payment=cancelled`,
    });
    if (!checkout.url) throw new Error("Stripe n’a pas retourné d’URL Checkout.");
    await prisma.transaction.update({ where: { id: payment.id }, data: { reference: checkout.id } });
    return { checkoutUrl: checkout.url };
  } catch (error) {
    await prisma.transaction.update({ where: { id: payment.id }, data: { status: "FAILED" } });
    throw error;
  }
}
