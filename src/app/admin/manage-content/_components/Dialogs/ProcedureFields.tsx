"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProcedureInput } from "@/lib/schemas/procedure.schema";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export type ProcedureCategoryOption = { id: string; name: string; isActive: boolean };

export default function ProcedureFields({
  register,
  errors,
  categories,
  isActive,
  onActiveChange,
}: {
  register: UseFormRegister<ProcedureInput>;
  errors: FieldErrors<ProcedureInput>;
  categories: ProcedureCategoryOption[];
  isActive: boolean;
  onActiveChange: (isActive: boolean) => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="procedure-title">Titre</Label>
        <Input id="procedure-title" maxLength={100} {...register("title")} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "procedure-title-error" : undefined} placeholder="Ex. Demande d'acte de naissance" />
        {errors.title && <p id="procedure-title-error" className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="procedure-category">Catégorie</Label>
        <select id="procedure-category" {...register("categoryId")} aria-invalid={Boolean(errors.categoryId)} aria-describedby={errors.categoryId ? "procedure-category-error" : undefined} className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-base text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.isActive ? "" : " (inactive)"}</option>)}
        </select>
        {errors.categoryId && <p id="procedure-category-error" className="text-sm text-destructive">{errors.categoryId.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="procedure-description">Description</Label>
        <Textarea id="procedure-description" rows={4} maxLength={500} {...register("description")} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "procedure-description-error" : undefined} placeholder="Présentez brièvement l'objet de la démarche." />
        {errors.description && <p id="procedure-description-error" className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="procedure-legal-basis">Base légale</Label>
        <Input id="procedure-legal-basis" maxLength={100} {...register("legalBasis")} aria-invalid={Boolean(errors.legalBasis)} aria-describedby={errors.legalBasis ? "procedure-legal-basis-error" : undefined} placeholder="Ex. Loi n°… du …" />
        {errors.legalBasis && <p id="procedure-legal-basis-error" className="text-sm text-destructive">{errors.legalBasis.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="procedure-image">Chemin ou URL de l&apos;image</Label>
        <Input id="procedure-image" maxLength={500} {...register("image")} aria-invalid={Boolean(errors.image)} aria-describedby={errors.image ? "procedure-image-error" : "procedure-image-help"} placeholder="/images/procedures/acte-naissance.jpg" />
        <p id="procedure-image-help" className="text-xs text-brand-ink-muted">Indiquez un chemin d&apos;image déjà disponible dans le projet ou une URL.</p>
        {errors.image && <p id="procedure-image-error" className="text-sm text-destructive">{errors.image.message}</p>}
      </div>

      <label className="flex items-start gap-3 rounded-md border border-border p-3">
        <input type="checkbox" checked={isActive} onChange={(event) => onActiveChange(event.target.checked)} className="mt-0.5 size-4 accent-brand-green" />
        <span><span className="block text-sm font-medium text-brand-ink">Procédure active</span><span className="mt-0.5 block text-xs text-brand-ink-muted">Les procédures inactives ne sont pas proposées au public.</span></span>
      </label>
    </>
  );
}
