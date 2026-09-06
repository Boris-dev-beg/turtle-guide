import { prisma } from "@/lib/prisma"; 

export const FolderServices = { 
  // ! Get all folder 
  async getAll(userId: string) { 
    return await prisma.folder.findMany({ 
      where: { 
        userId: userId, 
      }, 
      include: { 
        procedure: true, 
        location: true, 
        progression: true, 
        process: true 
      }, 
    }); 
  }, 

  // ! Get one folder by name 
  async getOne({ name, userId }: { name: string; userId: string }) { 
    return await prisma.folder.findFirst({ 
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

  // ! Get one folder 
  async getOneFolder(id: string, userId: string) { 
    return await prisma.folder.findUnique({ 
      where: { 
        id, 
        userId, 
      }, 
      include: { 
        procedure: true, 
        location: true, 
        progression: true, 
        process: true 
      }, 
    }); 
  }, 

  // ! Create folder 
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
      }, 
    }); 
  }, 

  // ! Update folder status 
  async updateFolder(data: { 
    id: string; 
    userId: string; 
    processId: string; 
    status: "CREATED" | "PENDING" | "CLOSED" | "ENDED"; 
  }) { 
    return await prisma.folder.update({ 
      where: { 
        id: data.id, 
        userId: data.userId, 
      }, 
      data: { 
        status: data.status, 
        processId: data.processId, 
      }, 
    }); 
  }, 

  // ! Delete Folder 
  async deleteFolder(id: string, userId: string) { 
    return await prisma.folder.delete({ 
      where: { 
        id, 
        userId, 
      }, 
    }); 
  }, 
}; 
