"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryInput } from "@/lib/schemas/category.schema";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

function RequiredMark() {
  return <span aria-hidden="true" className="ml-1 text-red-600">*</span>;
}

export default function CategoryFields({
  register,
  errors,
  isActive,
  onActiveChange,
  onNameChange,
  onSlugEdit,
}: {
  register: UseFormRegister<CategoryInput>;
  errors: FieldErrors<CategoryInput>;
  isActive: boolean;
  onActiveChange: (isActive: boolean) => void;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSlugEdit: () => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-brand-ink-muted">Les champs marqués d&apos;un <span className="font-semibold text-red-600">*</span> sont obligatoires.</p>

      <div className="space-y-2">
        <Label htmlFor="category-name" className="font-semibold">Nom de la catégorie<RequiredMark /></Label>
        <Input
          id="category-name"
          required
          maxLength={100}
          {...register("name", { onChange: onNameChange })}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "category-name-error" : "category-name-help"}
          placeholder="Ex. État civil"
          className="min-h-11 rounded-md"
        />
        <p id="category-name-help" className="text-xs text-brand-ink-muted">Affiché aux citoyens sur la page des catégories.</p>
        {errors.name && <p id="category-name-error" role="alert" className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-slug" className="font-semibold">Identifiant dans l&apos;adresse web (slug)<RequiredMark /></Label>
        <Input
          id="category-slug"
          required
          maxLength={100}
          {...register("slug", { onChange: onSlugEdit })}
          aria-invalid={Boolean(errors.slug)}
          aria-describedby={errors.slug ? "category-slug-error" : "category-slug-help"}
          placeholder="Ex. etat-civil"
          className="min-h-11 rounded-md font-mono"
        />
        <p id="category-slug-help" className="text-xs text-brand-ink-muted">Généré à partir du nom, vous pouvez le modifier. Minuscules, chiffres et tirets uniquement.</p>
        {errors.slug && <p id="category-slug-error" role="alert" className="text-sm text-destructive">{errors.slug.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-description" className="font-semibold">Description<RequiredMark /></Label>
        <Textarea
          id="category-description"
          required
          maxLength={500}
          rows={3}
          {...register("description")}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "category-description-error" : "category-description-help"}
          placeholder="Ex. Démarches relatives aux actes et documents d'état civil : naissance, mariage, décès."
          className="rounded-md"
        />
        <p id="category-description-help" className="text-xs text-brand-ink-muted">Une phrase qui présente les démarches regroupées ici. Elle apparaît sous le nom.</p>
        {errors.description && <p id="category-description-error" role="alert" className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <input
            id="category-active"
            type="checkbox"
            checked={isActive}
            onChange={(event) => onActiveChange(event.target.checked)}
            className="peer sr-only"
          />
          <Label htmlFor="category-active" className="flex cursor-pointer items-center gap-3 font-semibold">
            <span aria-hidden="true" className={`relative h-6 w-11 rounded-full transition-colors ${isActive ? "bg-brand-green" : "bg-slate-300"}`}>
              <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${isActive ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </span>
            Visibilité <span className="font-normal">{isActive ? "Active" : "Désactivée"}</span>
          </Label>
        </div>
        <p className="mt-2 text-xs leading-5 text-brand-ink-muted">Active : la catégorie est visible par les citoyens. Désactivée : elle est masquée, les dossiers déjà ouverts ne sont pas supprimés.</p>
      </div>
    </div>
  );
}
