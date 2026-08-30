import { prisma } from "@/lib/prisma";

export const FolderServices = {
  async getAll() {
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
