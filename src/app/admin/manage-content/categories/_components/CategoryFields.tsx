"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryInput } from "../_types";

export default function CategoryFields({
  values,
  onChange,
}: {
  values: CategoryInput;
  onChange: <K extends keyof CategoryInput>(
    key: K,
    value: CategoryInput[K],
  ) => void;
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="category-name">Nom</Label>
        <Input
          id="category-name"
          required
          minLength={2}
          maxLength={100}
          value={values.name}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder="Ex. État civil"
          className="rounded-md py-5"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category-slug">Identifiant (slug)</Label>
        <Input
          id="category-slug"
          required
          minLength={2}
          maxLength={100}
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          value={values.slug}
          onChange={(event) => onChange("slug", event.target.value)}
          placeholder="etat-civil"
          className="font-mono rounded-md py-5"
        />
        <p className="text-xs text-brand-ink-muted">
          Minuscules, chiffres et tirets; sans espace ni accent.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="category-description">Description</Label>
        <Textarea
          id="category-description"
          required
          minLength={5}
          maxLength={500}
          rows={4}
          value={values.description}
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="Décrivez les démarches regroupées dans cette catégorie."
          className="rounded-md"
        />
      </div>
      <label className="flex items-start gap-3 rounded-md border border-border p-3">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(event) => onChange("isActive", event.target.checked)}
          className="mt-0.5 size-4 accent-brand-green"
        />
        <span>
          <span className="block text-sm font-medium text-brand-ink">
            Catégorie active
          </span>
          <span className="mt-0.5 block text-xs text-brand-ink-muted">
            Les catégories inactives ne sont pas proposées dans les parcours
            publics.
          </span>
        </span>
      </label>
    </>
  );
}
