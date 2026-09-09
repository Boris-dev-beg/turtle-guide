import { prisma } from "@/lib/prisma";

// ! Possibles situtation
export type DiagnosticFolderStatus =
  | "CREATED"
  | "EXISTING_ACTIVE"
  | "EXISTING_COMPLETED";

// ! Commun include
const diagnosticFolderInclude = {
  procedure: {
    include: {
      category: true,
    },
  },

  location: true,

  progression: true,

  process: {
    include: {
      steps: {
        include: {
          administrativeBody: true,
          documents: true,
          fraudAlerts: true,
        },
      },
    },
  },
} as const;

// ! Active folder status
const ACTIVE_FOLDER_STATUSES = ["CREATED", "PENDING"] as const;

export const FolderServices = {
  // ! Get all folder
  async getAll(userId: string) {
    return await prisma.folder.findMany({
      where: {
        userId: userId,
      },
      include: {
        procedure: {
          include: {
            category: true,
          },
        },
        location: true,
        progression: true,
        process: {
          include: {
            steps: {
              include: {
                administrativeBody: true,

                documents: true,

                fraudAlerts: true,
              },
            },
          },
        },
      },
    });
  },

  // ! Get or Create Folder
  async getOrCreateDiagnosticFolder({
    userId,
    procedureId,
    name,
  }: {
    userId: string;
    procedureId: string;
    name: string;
  }) {

    // ? Search active folder
    const activeFolder = await prisma.folder.findFirst({
      where: {
        userId,
        procedureId,
        status: {
          in: [...ACTIVE_FOLDER_STATUSES],
        },
      },

      include: diagnosticFolderInclude,
      orderBy: {
        updatedAt: "desc",
      },
    });

    // ? If active folder was found
    if (activeFolder) {
      return {
        status: "EXISTING_ACTIVE" as const,
        folder: activeFolder,
      };
    }

    // ? ELSE: Search previous folder
    const previousFolder = await prisma.folder.findFirst({
      where: {
        userId,
        procedureId,
        status: {
          in: ["ENDED", "CLOSED"],
        },
      },

      include: diagnosticFolderInclude,

      orderBy: {
        updatedAt: "desc",
      },
    });

    // ? Previous folder was found, return it.
    if (previousFolder) {
      return {
        status: "EXISTING_COMPLETED" as const,
        folder: previousFolder,
      };
    }

    // ? ELSE: Create one folder
    const newFolder = await prisma.folder.create({
      data: {
        userId,
        procedureId,
        name,
        status: "CREATED",
      },

      include: diagnosticFolderInclude,
    });

   // ? Then return it
    return {
      status: "CREATED" as const,
      folder: newFolder,
    };
  },

  // ! Get one folder
  async getOneFolder(id: string, userId: string) {
    return await prisma.folder.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        procedure: {
          include: {
            category: true,
          },
        },
        location: true,
        progression: true,
        process: {
          include: {
            steps: {
              include: {
                administrativeBody: true,

                documents: true,

                fraudAlerts: true,
              },
            },
          },
        },
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
