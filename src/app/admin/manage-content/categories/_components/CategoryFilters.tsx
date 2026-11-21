"use client";

import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CategoryStatusFilter } from "../_types";

/** Affiche les champs de recherche et de filtrage du tableau des catégories. */
export default function CategoryFilters({
  query,
  status,
  onQueryChange,
  onStatusChange,
}: {
  query: string;
  status: CategoryStatusFilter;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: CategoryStatusFilter) => void;
}) {
  return (
    <div className="grid gap-3 border-b border-border bg-card p-4 md:grid-cols-[minmax(14rem,1fr)_12rem]">
      <label className="relative block">
        <span className="sr-only">Rechercher une catégorie</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-ink-muted"
          aria-hidden="true"
        />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Rechercher une catégorie"
          className="h-10 pl-9"
        />
      </label>
      <label className="relative block">
        <span className="sr-only">Filtrer par statut</span>
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as CategoryStatusFilter)
          }
          className="h-10 w-full appearance-none rounded-md border border-input bg-background px-3 pr-9 text-sm text-brand-ink outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actives</option>
          <option value="inactive">Inactives</option>
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand-ink-muted"
          aria-hidden="true"
        />
      </label>
    </div>
  );
}
