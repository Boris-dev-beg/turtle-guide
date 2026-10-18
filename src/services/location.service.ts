import { prisma } from "@/lib/prisma";

export const LocationServices = {
  // ! Get all locations
  async getAll() {
    return await prisma.location.findMany();
  },

  // ! Get one location
  async getOne(id: string) {
    return await prisma.location.findUnique({
      where: {
        id: id,
      },
    });
  },
  
  // ! Get one location by name
  async getOneByName(name: string) {
    return await prisma.location.findFirstOrThrow({
      where: {
        city: name,
      },
    });
  }
};