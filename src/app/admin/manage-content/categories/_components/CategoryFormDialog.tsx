"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryFields from "./CategoryFields";
import type { AdminCategoryRow, CategoryInput } from "../_types";

/** Génère un slug initial depuis le nom de catégorie, sans remplacer un slug modifié manuellement. */
function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Affiche le formulaire shadcn de création ou modification d'une catégorie. */
export default function CategoryFormDialog({
  open,
  category,
  pending,
  error,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  category: AdminCategoryRow | null;
  pending: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CategoryInput) => Promise<void>;
}) {
  const [values, setValues] = useState<CategoryInput>(() =>
    category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description,
          isActive: category.isActive,
        }
      : { name: "", slug: "", description: "", isActive: true },
  );
  const [slugEdited, setSlugEdited] = useState(Boolean(category));

  /** Met à jour un champ et synchronise automatiquement le slug avant sa première édition manuelle. */
  const updateField = <K extends keyof CategoryInput>(
    key: K,
    value: CategoryInput[K],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
      ...(key === "name" && !slugEdited
        ? { slug: slugify(String(value)) }
        : {}),
    }));
    if (key === "slug") setSlugEdited(true);
  };

  /** Empêche la soumission HTML standard et délègue les valeurs validées au hook CRUD. */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !pending && onOpenChange(nextOpen)}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-brand-ink">
            {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </DialogTitle>
          <DialogDescription>
            Le nom et le slug sont visibles dans l&apos;espace public. Le slug
            doit rester unique.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CategoryFields values={values} onChange={updateField} />

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="bg-brand-green text-white hover:bg-brand-green-dark"
            >
              {pending
                ? "Enregistrement…"
                : category
                  ? "Enregistrer les modifications"
                  : "Créer la catégorie"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
