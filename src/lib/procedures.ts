"use server"
import { ProcedureServiceError, proceduresServices } from "@/services/procedure.service";
import { categoriesServices } from "@/services/categories.service";
import { revalidatePath } from "next/cache";
import type { ProcedureInput } from "./schemas/procedure.schema";
import { AdminAuthorizationError, requireAdmin } from "@/lib/admin/require-admin";

export async function getAllProcedures() {
    return await proceduresServices.getAll()
}

export async function getPopular() {
    return await proceduresServices.getFew(); 
}

export async function getByCategory(categoryName: string) {
    return await proceduresServices.getByCategory(categoryName); 
}

export async function getAdminProcedures() {
  const user = await getAuthorizedUser();
  if (!user) return { authorized: false as const, procedures: [], categories: [] };
  const [procedures, categories] = await Promise.all([
    proceduresServices.getAllForAdmin(),
    categoriesServices.getAllForAdmin(),
  ]);
  return {
    authorized: true as const,
    procedures,
    categories: categories.map(({ id, name, isActive }) => ({ id, name, isActive })),
  };
}

export async function createProcedure(input: ProcedureInput) {
  const user = await getAuthorizedUser();
  if (!user) return { success: false, message: "Accès administrateur requis." };

  try {
    const values = proceduresServices.validateInput(input);
    const created = await proceduresServices.create(values, {
      id: user.id,
      name: user.name,
    });
    revalidateProcedureRoutes();
    return {
      success: true,
      message: `La procédure « ${created.title} » a été créée.`,
    };
  } catch (error) {
    return { success: false, message: procedureErrorMessage(error) };
  }
}

export async function updateProcedure(id: string, input: ProcedureInput) {
  const user = await getAuthorizedUser();
  if (!user) return { success: false, message: "Accès administrateur requis." };

  try {
    const values = proceduresServices.validateInput(input);
    const updated = await proceduresServices.update(id, values, {
      id: user.id,
      name: user.name,
    });
    revalidateProcedureRoutes();
    return {
      success: true,
      message: `La procédure « ${updated.title} » a été modifiée.`,
    };
  } catch (error) {
    return { success: false, message: procedureErrorMessage(error) };
  }
}

export async function deleteProcedure(id: string) {
  const user = await getAuthorizedUser();
  if (!user) return { success: false, message: "Accès administrateur requis." };

  try {
    await proceduresServices.delete(id, { id: user.id, name: user.name });
    revalidateProcedureRoutes();
    return { success: true, message: "La procédure a été supprimée." };
  } catch (error) {
    return { success: false, message: procedureErrorMessage(error) };
  }
}

async function getAuthorizedUser() {
  try {
    return (await requireAdmin()).session.user;
  } catch (error) {
    if (error instanceof AdminAuthorizationError) return null;
    throw error;
  }
}

function revalidateProcedureRoutes() {
  revalidatePath("/admin/manage-content");
  revalidatePath("/admin/manage-content/procedures");
  revalidatePath("/categories", "layout");
  revalidatePath("/categories/[slug]", "page");
}

function procedureErrorMessage(error: unknown) {
  if (error instanceof ProcedureServiceError) return error.message;
  return "L'opération sur la procédure a échoué. Réessayez.";
}
