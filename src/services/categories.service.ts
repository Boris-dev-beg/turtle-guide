import { prisma } from "@/lib/prisma";
import {
  categorySchema,
  type CategoryInput,
} from "@/lib/schemas/category.schema";

export class CategoryServiceError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "NOT_FOUND"
      | "DUPLICATE_SLUG"
      | "HAS_PROCEDURES"
      | "INVALID_INPUT",
  ) {
    super(message);
    this.name = "CategoryServiceError";
  }
}

export const categoriesServices = {
  async getAllForAdmin() {
    return prisma.category.findMany({
      include: {
        _count: { select: { procedures: true } },
      },
      orderBy: { name: "asc" },
    });
  },

  validateInput(input: unknown): CategoryInput {
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) {
      throw new CategoryServiceError(
        parsed.error.issues[0]?.message ??
          "Informations de catégorie invalides.",
        "INVALID_INPUT",
      );
    }
    return parsed.data;
  },

  async create(input: CategoryInput, actor: { id: string; name: string }) {
    try {
      return await prisma.$transaction(async (transaction) => {
        const category = await transaction.category.create({ data: input });
        await transaction.adminContentActivity.create({
          data: {
            action: "CREATE",
            entityType: "category",
            entityId: category.id,
            entityName: category.name,
            summary: "Catégorie créée",
            actorId: actor.id,
            actorName: actor.name,
          },
        });
        return category;
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new CategoryServiceError(
          "Cet identifiant est déjà utilisé.",
          "DUPLICATE_SLUG",
        );
      }
      throw error;
    }
  },

  async update(
    id: string,
    input: CategoryInput,
    actor: { id: string; name: string },
  ) {
    try {
      return await prisma.$transaction(async (transaction) => {
        const category = await transaction.category.update({
          where: { id },
          data: input,
        });
        await transaction.adminContentActivity.create({
          data: {
            action: "UPDATE",
            entityType: "category",
            entityId: category.id,
            entityName: category.name,
            summary: "Catégorie modifiée",
            actorId: actor.id,
            actorName: actor.name,
          },
        });
        return category;
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new CategoryServiceError(
          "Cet identifiant est déjà utilisé.",
          "DUPLICATE_SLUG",
        );
      }
      if (isMissingRecordError(error)) {
        throw new CategoryServiceError(
          "Cette catégorie n'existe plus.",
          "NOT_FOUND",
        );
      }
      throw error;
    }
  },

  async delete(id: string, actor: { id: string; name: string }) {
    return prisma.$transaction(async (transaction) => {
      const category = await transaction.category.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          _count: { select: { procedures: true } },
        },
      });

      if (!category) {
        throw new CategoryServiceError(
          "Cette catégorie n'existe plus.",
          "NOT_FOUND",
        );
      }
      if (category._count.procedures > 0) {
        throw new CategoryServiceError(
          "Cette catégorie contient des procédures. Déplacez-les avant de la supprimer.",
          "HAS_PROCEDURES",
        );
      }

      await transaction.category.delete({ where: { id } });
      await transaction.adminContentActivity.create({
        data: {
          action: "DELETE",
          entityType: "category",
          entityId: category.id,
          entityName: category.name,
          summary: "Catégorie supprimée",
          actorId: actor.id,
          actorName: actor.name,
        },
      });
      return category;
    });
  },

  async getAll() {
    return await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { procedures: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  async getOne(id: string) {
    return await prisma.category.findUnique({
      where: { id },
    });
  },
};

/** Reconnaît une erreur Prisma d'unicité sans exposer de détails base de données au client. */
function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

/** Reconnaît une erreur Prisma indiquant qu'un enregistrement à modifier est absent. */
function isMissingRecordError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}
