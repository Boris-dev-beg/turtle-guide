import { prisma } from "@/lib/prisma";

export const requestServices = {
    // ! Getting all requests
  async getRequests() {
    return await prisma.request.findMany({
      orderBy: {
        id: "desc",
      },
    });
  },
    
}