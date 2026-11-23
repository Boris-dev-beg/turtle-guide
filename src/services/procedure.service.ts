import { prisma } from "@/lib/prisma";
import { procedureSchema } from "@/lib/schemas/procedure.schema";
import { ProcedureInput } from "@/types/type";

export class ProcedureServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "NOT_FOUND" | "HAS_QUESTIONS" | "INVALID_INPUT",
  ) {
    super(message);
    this.name = "ProcedureServiceError";
  }
}

export const proceduresServices = {
  async getAdministrator(userId: string) {
    return prisma.administrator.findUnique({
      where: { userId },
      select: { id: true },
    });
  },
  // ! Get All
  async getAll() {
    return await prisma.procedure.findMany({
      include: {
        category: true,
      },
      orderBy: {
        title: "asc",
      },
    });
  },
  async getAllForAdmin() {
    return prisma.procedure.findMany({
      include: {
        _count: { select: { questions: true } },
      },
      orderBy: { title: "asc" },
    });
  },
  validateInput(input: unknown): ProcedureInput {
    const parsed = procedureSchema.safeParse(input);
    if (!parsed.success) {
      throw new ProcedureServiceError(
        parsed.error.issues[0]?.message ??
          "Informations de procédure invalides.",
        "INVALID_INPUT",
      );
    }
    return parsed.data;
  },

  async create(input: ProcedureInput, actor: { id: string; name: string }) {
    try {
      return await prisma.$transaction(async (transaction) => {
        const procedure = await transaction.procedure.create({ data: input });
        await transaction.adminContentActivity.create({
          data: {
            action: "CREATE",
            entityType: "procedure",
            entityId: procedure.id,
            entityName: procedure.title,
            summary: "Procédure créée",
            actorId: actor.id,
            actorName: actor.name,
          },
        });
        return procedure;
      });
    } catch (error) {
      throw error;
    }
  },

  async update(
    id: string,
    input: ProcedureInput,
    actor: { id: string; name: string },
  ) {
    try {
      return await prisma.$transaction(async (transaction) => {
        const procedure = await transaction.procedure.update({
          where: { id },
          data: input,
        });
        await transaction.adminContentActivity.create({
          data: {
            action: "UPDATE",
            entityType: "procedure",
            entityId: procedure.id,
            entityName: procedure.title,
            summary: "Procédure modifiée",
            actorId: actor.id,
            actorName: actor.name,
          },
        });
        return procedure;
      });
    } catch (error) {
      if (isMissingRecordError(error)) {
        throw new ProcedureServiceError(
          "Cette procédure n'existe plus.",
          "NOT_FOUND",
        );
      }
      throw error;
    }
  },

  async delete(id: string, actor: { id: string; name: string }) {
    return prisma.$transaction(async (transaction) => {
      const procedure = await transaction.procedure.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          _count: { select: { questions: true } },
        },
      });

      if (!procedure) {
        throw new ProcedureServiceError(
          "Cette procédure n'existe plus.",
          "NOT_FOUND",
        );
      }
      if (procedure._count.questions > 0) {
        throw new ProcedureServiceError(
          "Cette procédure contient des procédures. Déplacez-les avant de la supprimer.",
          "HAS_QUESTIONS",
        );
      }

      await transaction.procedure.delete({ where: { id } });
      await transaction.adminContentActivity.create({
        data: {
          action: "DELETE",
          entityType: "procedure",
          entityId: procedure.id,
          entityName: procedure.name,
          summary: "procédure supprimée",
          actorId: actor.id,
          actorName: actor.name,
        },
      });
      return procedure;
    });
  },

  // ! Get One
  async getOne(title: string) {
    return await prisma.procedure.findFirst({
      where: {
        title,
      },
    });
  },

  // ! Get Procedure By procedure
  async getByCategory(name: string) {
    return await prisma.procedure.findMany({
      where: {
        category: {
          name: name,
        },
      },
      include: {
        category: true,
      },
    });
  },

  // ! Get few
  async getFew() {
    return await prisma.procedure.findMany({
      include: {
        category: true,
      },
      take: 4,
    });
  },
};

/** Reconnaît une erreur Prisma indiquant qu'un enregistrement à modifier est absent. */
function isMissingRecordError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}
