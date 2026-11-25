"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryInput } from "@/lib/schemas/category.schema";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

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
    <>
      <div className="space-y-2">
        <Label htmlFor="category-name">Nom</Label>
        <Input
          id="category-name"
          maxLength={100}
          {...register("name", { onChange: onNameChange })}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "category-name-error" : undefined}
          placeholder="Ex. État civil"
          className="rounded-md py-5"
        />
        {errors.name && <p id="category-name-error" className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-slug">Identifiant (slug)</Label>
        <Input
          id="category-slug"
          maxLength={100}
          {...register("slug", { onChange: onSlugEdit })}
          aria-invalid={Boolean(errors.slug)}
          aria-describedby={errors.slug ? "category-slug-error" : "category-slug-help"}
          placeholder="etat-civil"
          className="rounded-md font-mono"
        />
        <p id="category-slug-help" className="text-xs text-brand-ink-muted">Minuscules, chiffres et tirets; sans espace ni accent.</p>
        {errors.slug && <p id="category-slug-error" className="text-sm text-destructive">{errors.slug.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-description">Description</Label>
        <Textarea
          id="category-description"
          maxLength={500}
          rows={4}
          {...register("description")}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? "category-description-error" : undefined}
          placeholder="Décrivez les démarches regroupées dans cette catégorie."
          className="rounded-md"
        />
        {errors.description && <p id="category-description-error" className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <label className="flex items-start gap-3 rounded-md border border-border p-3">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => onActiveChange(event.target.checked)}
          className="mt-0.5 size-4 accent-brand-green"
        />
        <span>
          <span className="block text-sm font-medium text-brand-ink">Catégorie active</span>
          <span className="mt-0.5 block text-xs text-brand-ink-muted">Les catégories inactives ne sont pas proposées dans les parcours publics.</span>
        </span>
      </label>
    </>
  );
}
