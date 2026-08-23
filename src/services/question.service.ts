import { prisma } from "@/lib/prisma";

export const questionServices = {
  async getOne(id: string) {
    return await prisma.question.findUnique({
      where: {
        id: id,
      },
    });
  },
};
