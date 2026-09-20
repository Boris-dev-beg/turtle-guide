import { prisma } from "@/lib/prisma";

export const categoriesServices = {
  async getAll() {
    return await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { procedures: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  async getOne(id: string) {
    return await prisma.category.findUnique({
      where: { id },
    });
  },
};
