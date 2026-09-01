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
   async getOne({
    name,
    userId,
  }: {
    name: string;
    userId: string;
  }) {
    return prisma.folder.findFirst({
      where: {
        name,
        userId,
      },
      include: {
        procedure: true,
        location: true,
        progression: true,
      },
    });
  },


  async createFolder(data: {
    userId: string;
    name: string;
    procedureId: string;
  }) {
    return await prisma.folder.create({
      data: {
        userId: data.userId,
        name: data.name,
        procedureId: data.procedureId,
        status: "PENDING",
      },
    });
  },
};

