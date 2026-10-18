import { prisma } from "@/lib/prisma";

export const documentServices = {
  async getOne(documentId: string) {
    return await prisma.document.findUniqueOrThrow({
      where: { id: documentId },
    });
  },
  async createPurchase(documentId: string, userId: string) {
    const doc = await this.getOne(documentId);
    return await prisma.documentPurchase.create({
      data: { userId, documentId: doc.id, amount: doc.price },
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
