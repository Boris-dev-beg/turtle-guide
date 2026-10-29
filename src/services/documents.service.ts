import { prisma } from "@/lib/prisma";
import { randomUUID } from "node:crypto";

export const documentServices = {
  /**
   * Crée un achat et une transaction en attente à partir du prix stocké en base.
   * Le client ne fournit jamais de montant ni de référence de transaction.
   */
  async createPendingPurchase(documentId: string, userId: string) {
    // ? Finding document to buy
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: { id: true, name: true, price: true },
    });

    if (!document) {
      throw new Error("Document introuvable");
    }

    return prisma.$transaction(async (transaction) => {
      // ? Create document purchase
      const purchase = await transaction.documentPurchase.create({
        data: {
          userId,
          documentId: document.id,
          amount: document.price,
        },
      });

      // ? Create transaction
      const payment = await transaction.transaction.create({
        data: {
          reference: randomUUID(),
          amount: document.price,
          paymentMethod: "stripe",
          status: "INITIATED",
          documentPurchaseId: purchase.id,
        },
      });

      return { document, purchase, payment };
    });
  },

  /**
   * Attache l'identifiant de Stripe Checkout à la transaction créée pour l'achat.
   * Le paiement reste INITIATED jusqu'à la confirmation du webhook signé.
   */
  async attachCheckoutSession(paymentId: string, sessionId: string) {
    return prisma.transaction.update({
      where: { id: paymentId },
      data: { reference: sessionId },
    });
  },

  /**
   * Cherche une transaction de document par la référence Stripe pour traiter
   * les événements de Checkout sans accepter un identifiant de document client.
   */
  async findPurchaseTransactionByReference(reference: string) {
    return prisma.transaction.findFirst({
      where: { reference, documentPurchaseId: { not: null } },
      include: { documentPurchase: true },
    });
  },

  /**
   * Met à jour l'état du paiement; les transitions sont monotones pour qu'un
   * webhook tardif d'échec ne puisse pas annuler un paiement déjà réussi.
   */
  async updatePurchaseTransactionStatus(
    transactionId: string,
    status: "PENDING" | "SUCCESS" | "FAILED",
  ) {
    return prisma.$transaction(async (db) => {
      const current = await db.transaction.findUnique({
        where: { id: transactionId },
        select: { status: true },
      });

      if (!current || current.status === "SUCCESS") {
        return current;
      }

      return db.transaction.update({
        where: { id: transactionId },
        data: { status },
      });
    });
  },

  /**
   * Finalizes a Checkout webhook only when its transaction, purchase, amount,
   * currency and Stripe session all match the records created by our server.
   */
  async finalizeCheckoutPayment({
    transactionId,
    sessionId,
    purchaseId,
    amount,
    currency,
    status,
  }: {
    transactionId: string;
    sessionId: string;
    purchaseId: string;
    amount: number;
    currency: string;
    status: "PENDING" | "SUCCESS" | "FAILED";
  }) {
    return prisma.$transaction(async (db) => {
      // ? Find transaction
      const payment = await db.transaction.findUnique({
        where: { id: transactionId },
        include: { documentPurchase: true },
      });

      if (
        !payment ||
        !payment.documentPurchase ||
        payment.reference !== sessionId ||
        payment.documentPurchase.id !== purchaseId ||
        !payment.documentPurchase.amount.equals(amount) ||
        currency.toLowerCase() !== "xaf"
      ) {
        throw new Error(
          "Les données du paiement Stripe ne correspondent pas à l'achat.",
        );
      }

      if (payment.status === "SUCCESS") {
        return payment;
      }

      // ? Update transaction status
      return db.transaction.update({
        where: { id: payment.id },
        data: { status },
      });
    });
  },

  /**
   * Vérifie que l'utilisateur a payé le document et retourne son URL de stockage.
   * Les documents non achetés ne révèlent jamais leur contentUrl.
   */
  async getPurchasedDocumentUrl(documentId: string, userId: string) {
    const purchase = await prisma.documentPurchase.findFirst({
      where: {
        documentId,
        userId,
        transactions: { some: { status: "SUCCESS" } },
      },
      select: { document: { select: { contentUrl: true } } },
    });

    return purchase?.document.contentUrl ?? null;
  },

  /**
   * Lit un statut d'achat pour afficher un retour de checkout exact; cette
   * lecture n'accorde jamais l'accès, qui dépend de findFirstPurchase.
   */
  async findPurchaseStatus(userId: string, documentId: string) {
    return prisma.documentPurchase.findFirst({
      where: { userId, documentId },
      orderBy: { purchaseDate: "desc" },
      select: {
        transactions: {
          select: { status: true },
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    });
  },

  async getOne(documentId: string) {
    return await prisma.document.findUniqueOrThrow({
      where: { id: documentId },
    });
  },
  async findFirstPurchase(userID: string, docId: string) {
    return await prisma.documentPurchase.findFirst({
      where: {
        userId: userID,
        documentId: docId,
        transactions: { some: { status: "SUCCESS" } },
      },
      select: { id: true },
    });
  },
};
