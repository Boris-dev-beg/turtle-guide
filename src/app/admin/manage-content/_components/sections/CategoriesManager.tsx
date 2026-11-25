"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import { useCategoryList } from "../../../../../hooks/useCategoryList";
import type { AdminCategoryRow, CategoryInput } from "@/types/type";
import { SubSectionHeaders } from "../common/SubSectionHeaders";
import DataFilters from "../common/DataFilters";
import CategoryTable from "../tables/CategoryTable";
import CategoryFormDialog from "../Dialogs/CategoryFormDialog";
import DeleteDialog from "../Dialogs/DeleteDialog";

function formatCount(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

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
  const { createCategory, updateCategory, deleteCategory, isSaving, isDeleting } =
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

  const openForm = (category: AdminCategoryRow | null) => {
    setEditingCategory(category);
    setFormError("");
    setFormKey((key) => key + 1);
    setFormOpen(true);
  };

  const saveCategory = async (input: CategoryInput) => {
    setFormError("");
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
      <SubSectionHeaders
        notice={notice}
        onCreate={() => openForm(null)}
        onDismissNotice={() => setNotice("")}
        label="catégorie"
        subLabel="Gérez les regroupements thématiques des procédures."
      />

      <Card className="overflow-hidden rounded-md gap-0 shadow-none ring-border">
        <DataFilters
          query={query}
          status={status}
          onQueryChange={setQuery}
          onStatusChange={setStatus}
          label="Rechercher une Catégorie"
        />
        <CategoryTable
          categories={filteredCategories}
          emptyMessage={categories.length === 0 ? "Aucune catégorie n'est enregistrée." : "Aucune catégorie ne correspond à ces filtres."}
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
        pending={isSaving}
        error={formError}
        onOpenChange={setFormOpen}
        onSubmit={saveCategory}
      />
      <DeleteDialog
        label="Catégorie"
        element={deletingCategory}
        name={deletingCategory?.name as string}
        pending={isDeleting}
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
