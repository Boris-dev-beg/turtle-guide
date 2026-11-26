"use client";

import { ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProcedureInput } from "@/lib/schemas/procedure.schema";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export type ProcedureCategoryOption = { id: string; name: string; isActive: boolean };

function RequiredMark() {
  return <span aria-hidden="true" className="ml-1 text-red-600">*</span>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="border-b border-border pb-1 font-display text-lg font-bold text-brand-ink">{children}</h3>;
}

export default function ProcedureFields({
  register,
  errors,
  categories,
  isActive,
  onActiveChange,
  imageUrl,
  uploading,
  onImageFile,
}: {
  register: UseFormRegister<ProcedureInput>;
  errors: FieldErrors<ProcedureInput>;
  categories: ProcedureCategoryOption[];
  isActive: boolean;
  onActiveChange: (isActive: boolean) => void;
  imageUrl: string;
  uploading: boolean;
  onImageFile: (file: File | null) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-brand-ink-muted">Les champs marqués d&apos;un <span className="font-semibold text-red-600">*</span> sont obligatoires.</p>

      <section className="space-y-4" aria-labelledby="procedure-identification-heading">
        <SectionHeading><span id="procedure-identification-heading">Identification</span></SectionHeading>

        <div className="space-y-2">
          <Label htmlFor="procedure-category" className="font-semibold">Catégorie<RequiredMark /></Label>
          <select id="procedure-category" required {...register("categoryId")} aria-invalid={Boolean(errors.categoryId)} aria-describedby={errors.categoryId ? "procedure-category-error" : "procedure-category-help"} className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-base text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <option value="">Choisir une catégorie</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.isActive ? "" : " (inactive)"}</option>)}
          </select>
          <p id="procedure-category-help" className="text-xs text-brand-ink-muted">La procédure sera classée dans cette catégorie.</p>
          {errors.categoryId && <p id="procedure-category-error" role="alert" className="text-sm text-destructive">{errors.categoryId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="procedure-title" className="font-semibold">Titre de la procédure<RequiredMark /></Label>
          <Input id="procedure-title" required maxLength={100} {...register("title")} aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? "procedure-title-error" : "procedure-title-help"} placeholder="Ex. Acte de naissance" className="min-h-11 rounded-md" />
          <p id="procedure-title-help" className="text-xs text-brand-ink-muted">Le nom que voit le citoyen. Commencez par une majuscule.</p>
          {errors.title && <p id="procedure-title-error" role="alert" className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="procedure-description" className="font-semibold">Description<RequiredMark /></Label>
          <Textarea id="procedure-description" required rows={3} maxLength={500} {...register("description")} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "procedure-description-error" : "procedure-description-help"} placeholder="Ex. Identifie la démarche exacte selon votre situation : naissance jamais déclarée, copie d'un acte existant ou correction d'une erreur." className="rounded-md" />
          <p id="procedure-description-help" className="text-xs text-brand-ink-muted">Une ou deux phrases : ce que ce questionnaire permet de trouver. Affichée sous le titre.</p>
          {errors.description && <p id="procedure-description-error" role="alert" className="text-sm text-destructive">{errors.description.message}</p>}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="procedure-presentation-heading">
        <SectionHeading><span id="procedure-presentation-heading">Présentation et référence légale</span></SectionHeading>

        <div className="space-y-2">
          <Label htmlFor="procedure-image" className="font-semibold">Image de la procédure<RequiredMark /></Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="min-w-0 flex-1 space-y-2">
              <Input
                id="procedure-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={uploading}
                aria-required="true"
                aria-invalid={Boolean(errors.image)}
                aria-describedby={errors.image ? "procedure-image-error" : "procedure-image-help"}
                className="min-h-11 rounded-md file:mr-3 file:rounded-sm file:border-0 file:bg-brand-green/10 file:px-3 file:py-1 file:font-medium file:text-brand-green"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  event.target.value = "";
                  onImageFile(file);
                }}
              />
              <p id="procedure-image-help" className="text-xs text-brand-ink-muted">JPG, PNG, WebP ou AVIF — 5 Mo maximum. Format paysage conseillé.</p>
            </div>
            <div aria-label={imageUrl ? "Aperçu de l'image sélectionnée" : "Aperçu de l'image"} className="flex h-16 w-full shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-muted sm:w-28">
              {imageUrl ? <div role="img" aria-label="Aperçu de l'image" className="h-full w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url("${imageUrl}")` }} /> : <ImagePlus aria-hidden="true" className="size-8 text-brand-ink-muted" />}
            </div>
          </div>
          {uploading && <p role="status" className="text-sm text-brand-ink-muted">Téléversement de l&apos;image…</p>}
          {!uploading && imageUrl && <p role="status" className="break-all text-xs text-brand-ink-muted">Image prête : <a href={imageUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">voir l&apos;image</a></p>}
          {errors.image && <p id="procedure-image-error" role="alert" className="text-sm text-destructive">{errors.image.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="procedure-legal-basis" className="font-semibold">Base légale<RequiredMark /></Label>
          <Input id="procedure-legal-basis" required maxLength={100} {...register("legalBasis")} aria-invalid={Boolean(errors.legalBasis)} aria-describedby={errors.legalBasis ? "procedure-legal-basis-error" : "procedure-legal-basis-help"} placeholder="Ex. Loi n°90/053 du 19 décembre 1990" className="min-h-11 rounded-md" />
          <p id="procedure-legal-basis-help" className="text-xs text-brand-ink-muted">Référence courte du texte de loi, suivie si possible du lien vers le texte en ligne.</p>
          {errors.legalBasis && <p id="procedure-legal-basis-error" role="alert" className="text-sm text-destructive">{errors.legalBasis.message}</p>}
        </div>
      </section>

      <section className="space-y-3 border-t border-border pt-4" aria-labelledby="procedure-publication-heading">
        <SectionHeading><span id="procedure-publication-heading">Publication</span></SectionHeading>
        <div className="flex items-center gap-3">
          <input id="procedure-active" type="checkbox" checked={isActive} onChange={(event) => onActiveChange(event.target.checked)} className="peer sr-only" />
          <Label htmlFor="procedure-active" className="flex cursor-pointer items-center gap-3 font-semibold">
            <span aria-hidden="true" className={`relative h-6 w-11 rounded-full transition-colors ${isActive ? "bg-brand-green" : "bg-slate-300"}`}>
              <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${isActive ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </span>
            Visibilité <span className="font-normal">{isActive ? "Activée" : "Désactivée"}</span>
          </Label>
        </div>
        <p className="text-xs leading-5 text-brand-ink-muted">Activez la procédure une fois son questionnaire terminé. Désactivée, elle est masquée aux citoyens.</p>
      </section>
    </div>
  );
}
