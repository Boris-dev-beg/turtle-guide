import { prisma } from "@/lib/prisma";

export const FolderServices = {
  async getAll(userId: string) {
    return await prisma.folder.findMany({
      where: {
        userId: "user_boris_001",
      },
      include: {
        procedure: true,
        location: true,
      },
    });
  },
};
