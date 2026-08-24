import { prisma } from "@/lib/prisma";

export const categoriesServices = {
  async getAll() {
    return await prisma.category.findMany();
  },

  async getOne(id: string) {
    return await prisma.category.findUnique({
      where: { id: id },
    });
  },
};
