"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import {
  CategoryServiceError,
  categoriesServices,
} from "@/services/categories.service";
import type { CategoryInput } from "@/lib/schemas/category.schema";

/** Retourne les catégories publiques actives en déléguant la lecture au service. */
export async function getAll() {
  return categoriesServices.getAll();
}

/** Charge les catégories administratives et indique si la session a le rôle requis. */
export async function getAdminCategories() {
  const user = await getAuthorizedUser();
  if (!user) return { authorized: false as const, categories: [] };
  return {
    authorized: true as const,
    categories: await categoriesServices.getAllForAdmin(),
  };
}

/** Appelle le service de création après authentification puis rafraîchit les routes concernées. */
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

/** Appelle le service de modification après authentification puis rafraîchit les routes concernées. */
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

/** Appelle le service de suppression protégée après authentification puis rafraîchit les routes. */
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

/** Retourne l'utilisateur courant uniquement si sa session et son rôle administrateur sont valides. */
async function getAuthorizedUser() {
  const session = await getSession();
  if (!session?.user) return null;
  const administrator = await categoriesServices.getAdministrator(
    session.user.id,
  );
  return administrator ? session.user : null;
}

/** Rafraîchit les pages de contenu dont les listes ou compteurs peuvent avoir changé. */
function revalidateCategoryRoutes() {
  revalidatePath("/admin/manage-content");
  revalidatePath("/admin/manage-content/categories");
}

/** Convertit une erreur métier du service en message destiné à l'interface d'administration. */
function categoryErrorMessage(error: unknown) {
  if (error instanceof CategoryServiceError) return error.message;
  return "L'opération sur la catégorie a échoué. Réessayez.";
}
