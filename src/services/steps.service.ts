import { prisma } from "@/lib/prisma";

export const stepServices = {
  // ! Getting all steps ny processId
  async getAllSteps(processId: string) {
    return await prisma.step.findMany({
      where: {
        processId,
      },
      include: {
        administrativeBody: true,
      },
    });
  },

  // ! Getting All step
  async getAllStep() {
    return await prisma.step.findMany({
      select: { id: true, title: true, process: { select: { title: true } } },
      orderBy: { title: "asc" },
    });
  },
};
