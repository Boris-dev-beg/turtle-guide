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

  // ! Get Procedure By Category
  async getByCategory(name: string) {
    return await prisma.procedure.findMany({
      where: {
        category: {
          name: name,
        },
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
