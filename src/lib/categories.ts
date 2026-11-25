"use server";

import { revalidatePath } from "next/cache";
import { AdminAuthorizationError, requireAdmin } from "@/lib/admin/require-admin";
import {
  CategoryServiceError,
  categoriesServices,
} from "@/services/categories.service";
import type { CategoryInput } from "@/lib/schemas/category.schema";

export async function getAll() {
  return categoriesServices.getAll();
}

export async function getAdminCategories() {
  const user = await getAuthorizedUser();
  if (!user) return { authorized: false as const, categories: [] };
  return {
    authorized: true as const,
    categories: await categoriesServices.getAllForAdmin(),
  };
}

export async function createCategory(input: CategoryInput) {
  const user = await getAuthorizedUser();
  if (!user) return { success: false, message: "Accès administrateur requis." };

  try {
    const values = categoriesServices.validateInput(input);
    const created = await categoriesServices.create(values, {
      id: user.id,
      name: user.name,
    });
    revalidateCategoryRoutes();
    return {
      success: true,
      message: `La catégorie « ${created.name} » a été créée.`,
    };
  } catch (error) {
    return { success: false, message: categoryErrorMessage(error) };
  }
}

export async function updateCategory(id: string, input: CategoryInput) {
  const user = await getAuthorizedUser();
  if (!user) return { success: false, message: "Accès administrateur requis." };

  try {
    const values = categoriesServices.validateInput(input);
    const updated = await categoriesServices.update(id, values, {
      id: user.id,
      name: user.name,
    });
    revalidateCategoryRoutes();
    return {
      success: true,
      message: `La catégorie « ${updated.name} » a été modifiée.`,
    };
  } catch (error) {
    return { success: false, message: categoryErrorMessage(error) };
  }
}

export async function deleteCategory(id: string) {
  const user = await getAuthorizedUser();
  if (!user) return { success: false, message: "Accès administrateur requis." };

  try {
    await categoriesServices.delete(id, { id: user.id, name: user.name });
    revalidateCategoryRoutes();
    return { success: true, message: "La catégorie a été supprimée." };
  } catch (error) {
    return { success: false, message: categoryErrorMessage(error) };
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

function revalidateCategoryRoutes() {
  revalidatePath("/admin/manage-content");
  revalidatePath("/admin/manage-content/categories");
  revalidatePath("/categories", "layout");
  revalidatePath("/categories/[slug]", "page");
}

function categoryErrorMessage(error: unknown) {
  if (error instanceof CategoryServiceError) return error.message;
  return "L'opération sur la catégorie a échoué. Réessayez.";
}
