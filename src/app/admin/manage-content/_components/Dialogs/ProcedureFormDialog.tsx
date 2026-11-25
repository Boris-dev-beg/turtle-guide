"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { procedureSchema, type ProcedureInput, type AdminProcedureRow } from "@/lib/schemas/procedure.schema";
import ProcedureFields, { type ProcedureCategoryOption } from "./ProcedureFields";

export default function ProcedureFormDialog({
  open,
  procedure,
  categories,
  pending,
  error,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  procedure: AdminProcedureRow | null;
  categories: ProcedureCategoryOption[];
  pending: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: ProcedureInput) => Promise<void>;
}) {
  const form = useForm<ProcedureInput>({
    resolver: zodResolver(procedureSchema),
    defaultValues: procedure
      ? { title: procedure.title, legalBasis: procedure.legalBasis, description: procedure.description, isActive: procedure.isActive, image: procedure.image, categoryId: procedure.categoryId }
      : { title: "", legalBasis: "", description: "", isActive: true, image: "", categoryId: "" },
  });
  const isActive = useWatch({ control: form.control, name: "isActive" });

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !pending && onOpenChange(nextOpen)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-5! scrollbar-thin sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl! font-bold! text-brand-ink">{procedure ? "Modifier la procédure" : "Nouvelle procédure"}</DialogTitle>
          <DialogDescription>Renseignez les informations affichées dans le parcours public. Les champs sont vérifiés avant enregistrement.</DialogDescription>
        </DialogHeader>

        {categories.length === 0 ? (
          <div className="space-y-4">
            <p role="status" className="rounded-sm border border-border bg-muted p-4 text-sm leading-6 text-brand-ink-muted">Créez d&apos;abord une catégorie pour pouvoir rattacher cette procédure.</p>
            <Link href="/admin/manage-content/categories" className="btn btn-primary inline-flex min-h-11 items-center">Gérer les catégories</Link>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <ProcedureFields
              register={form.register}
              errors={form.formState.errors}
              categories={categories}
              isActive={isActive}
              onActiveChange={(value) => form.setValue("isActive", value, { shouldDirty: true, shouldValidate: true })}
            />
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit" disabled={pending} className="bg-brand-green text-white hover:bg-brand-green-dark">
                {pending ? "Enregistrement…" : procedure ? "Enregistrer les modifications" : "Créer la procédure"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
