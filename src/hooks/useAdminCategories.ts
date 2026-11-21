"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/categories";
import type { CategoryInput } from "@/lib/schemas/category.schema";

/** Coordonne les mutations des catégories et rafraîchit les données serveur après chaque succès. */
export function useAdminCategories() {
  const router = useRouter();
  const refreshPage = () => router.refresh();

  const createMutation = useMutation({
    mutationFn: async (input: CategoryInput) => {
      const result = await createCategory(input);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: refreshPage,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: CategoryInput }) => {
      const result = await updateCategory(id, input);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: refreshPage,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCategory(id);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: refreshPage,
  });

  return {
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}
