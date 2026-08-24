import { prisma } from "@/lib/prisma";

export const proceduresServices = {
  // ! Get All
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

  // ! Get few
  async getFew() {
    return await prisma.procedure.findMany({
      include: {
        category: true,
      },
      orderBy: {
        title: "asc",
      },
      take: 4,
    });
  },
};
