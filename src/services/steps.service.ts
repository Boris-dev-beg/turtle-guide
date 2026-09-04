import { prisma } from "@/lib/prisma";

export const stepServices = {
  // ! Getting all steps
  async getAllSteps(processId: string) {
    return await prisma.step.findMany({
      where: {
        processId,
      },
      include: {
        administrativeBody: true,
      }
    });
  },
};
