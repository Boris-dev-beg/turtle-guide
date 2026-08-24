import { prisma } from "@/lib/prisma";

export const proceduresServices = {
  async getAll() {
    return await prisma.procedure.findMany({
      include: {
        category: true,
      },
      orderBy: {
        title: "asc",
      },
    });
  },
};
