"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import CategoriesPageHeader from "./CategoriesPageHeader";
import CategoryFilters from "./CategoryFilters";
import CategoryTable from "./CategoryTable";
import CategoryFormDialog from "./CategoryFormDialog";
import CategoryDeleteDialog from "./CategoryDeleteDialog";
import { useCategoryList } from "../../../../../hooks/useCategoryList";
import type { AdminCategoryRow, CategoryInput } from "../_types";

/** Formate un compteur en français pour le résumé des résultats. */
function formatCount(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

/** Coordonne filtres, tri, mutations et composants spécialisés de la gestion des catégories. */
export default function CategoriesManager({
  categories,
}: {
  categories: AdminCategoryRow[];
}) {
  const [editingCategory, setEditingCategory] =
    useState<AdminCategoryRow | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<AdminCategoryRow | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [notice, setNotice] = useState("");
  const { createCategory, updateCategory, deleteCategory, isPending } =
    useAdminCategories();
  const {
    query,
    status,
    sortKey,
    sortDescending,
    filteredCategories,
    setQuery,
    setStatus,
    toggleSort,
  } = useCategoryList(categories);

  /** Ouvre le formulaire de création ou modification en le réinitialisant à chaque ouverture. */
  const openForm = (category: AdminCategoryRow | null) => {
    setEditingCategory(category);
    setFormError("");
    setFormKey((key) => key + 1);
    setFormOpen(true);
  };

  /** Enregistre une catégorie via le hook et publie le résultat dans la page. */
  const saveCategory = async (input: CategoryInput) => {
    try {
      const message = editingCategory
        ? await updateCategory({ id: editingCategory.id, input })
        : await createCategory(input);
      setFormOpen(false);
      setNotice(message);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "L'enregistrement a échoué.",
      );
    }
  };

  /** Supprime l'élément confirmé via le hook et conserve les erreurs métier dans le dialogue. */
  const removeCategory = async () => {
    if (!deletingCategory) return;
    try {
      setNotice(await deleteCategory(deletingCategory.id));
      setDeletingCategory(null);
      setDeleteError("");
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "La suppression a échoué.",
      );
    }
  };

  return (
    <div className="space-y-5">
      <CategoriesPageHeader
        notice={notice}
        onCreate={() => openForm(null)}
        onDismissNotice={() => setNotice("")}
      />

      <Card className="overflow-hidden rounded-md gap-0 shadow-none ring-border">
        <CategoryFilters
          query={query}
          status={status}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
        />
        <CategoryTable
          categories={filteredCategories}
          sortKey={sortKey}
          sortDescending={sortDescending}
          onSort={toggleSort}
          onEdit={openForm}
          onDelete={(category) => {
            setDeletingCategory(category);
            setDeleteError("");
          }}
        />
        <div className="border-t border-border px-4 py-3 text-sm text-brand-ink-muted">
          {formatCount(filteredCategories.length)} résultat
          {filteredCategories.length === 1 ? "" : "s"} sur{" "}
          {formatCount(categories.length)}
        </div>
      </Card>

      <CategoryFormDialog
        key={formKey}
        open={formOpen}
        category={editingCategory}
        pending={isPending}
        error={formError}
        onOpenChange={setFormOpen}
        onSubmit={saveCategory}
      />
      <CategoryDeleteDialog
        category={deletingCategory}
        pending={isPending}
        error={deleteError}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingCategory(null);
            setDeleteError("");
          }
        }}
        onConfirm={removeCategory}
      />
    </div>
  );
}
