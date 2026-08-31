import { prisma } from "@/lib/prisma";

export const FolderServices = {
  async getAll(userId: string) {
    return await prisma.folder.findMany({
      where: {
        userId: userId,
      },
      include: {
        procedure: true,
        location: true,
      },
    });
  },
};
