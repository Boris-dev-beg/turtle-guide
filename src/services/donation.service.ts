import { prisma } from "@/lib/prisma";

export const donationServices = {
  async finalizeDonationPayment({
    transactionId,
    donationId,
    sessionId,
    amount,
    currency,
    status,
  }: {
    transactionId: string;
    donationId: string;
    sessionId: string;
    amount: number;
    currency: string;
    status: "PENDING" | "SUCCESS" | "FAILED";
  }) {
    return prisma.$transaction(async (db) => {
      const payment = await db.transaction.findUnique({
        where: { id: transactionId },
        include: { donation: true },
      });
      if (
        !payment ||
        !payment.donation ||
        payment.donation.id !== donationId ||
        payment.reference !== sessionId ||
        !payment.amount.equals(amount) ||
        !payment.donation.amount.equals(amount) ||
        currency.toLowerCase() !== "xaf"
      )
        throw new Error(
          "Les données du paiement Stripe ne correspondent pas au don.",
        );
      if (payment.status === "SUCCESS") return payment;
      return db.transaction.update({
        where: { id: payment.id },
        data: { status },
      });
    });
  },

  async finalizeKpayDonation({
    externalId,
    amount,
    status,
  }: {
    externalId: string;
    amount: number;
    status: "SUCCESS" | "FAILED";
  }) {
    return prisma.$transaction(async (db) => {
      const payment = await db.transaction.findUnique({
        where: { reference: externalId },
        include: { donation: true },
      });
      if (
        !payment ||
        payment.paymentMethod !== "kpay" ||
        !payment.donation ||
        !payment.amount.equals(amount) ||
        !payment.donation.amount.equals(amount)
      )
        throw new Error(
          "Les données du paiement KPay ne correspondent pas au don.",
        );
      if (payment.status === "SUCCESS") return payment;
      return db.transaction.update({
        where: { id: payment.id },
        data: { status },
      });
    });
  },
};
