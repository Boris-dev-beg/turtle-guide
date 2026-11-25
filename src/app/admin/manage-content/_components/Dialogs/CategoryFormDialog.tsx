"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { categorySchema, type CategoryInput } from "@/lib/schemas/category.schema";
import type { AdminCategoryRow } from "@/types/type";
import CategoryFields from "./CategoryFields";

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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
  const [slugEdited, setSlugEdited] = useState(Boolean(category));
  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? { name: category.name, slug: category.slug, description: category.description, isActive: category.isActive }
      : { name: "", slug: "", description: "", isActive: true },
  });
  const isActive = useWatch({ control: form.control, name: "isActive" });

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!slugEdited) form.setValue("slug", slugify(event.target.value), { shouldDirty: true });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !pending && onOpenChange(nextOpen)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-5! scrollbar-thin sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl! font-bold! text-brand-ink">{category ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
          <DialogDescription>Le nom et le slug sont visibles dans l&apos;espace public. Le slug doit rester unique.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
          <CategoryFields
            register={form.register}
            errors={form.formState.errors}
            isActive={isActive}
            onActiveChange={(value) => form.setValue("isActive", value, { shouldDirty: true, shouldValidate: true })}
            onNameChange={handleNameChange}
            onSlugEdit={() => setSlugEdited(true)}
          />
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit" disabled={pending} className="bg-brand-green text-white hover:bg-brand-green-dark">
              {pending ? "Enregistrement…" : category ? "Enregistrer les modifications" : "Créer la catégorie"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
