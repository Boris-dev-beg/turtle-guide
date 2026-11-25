"use client";

import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminCategoryRow, CategorySortKey } from "@/types/type";

function formatCount(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export default function CategoryTable({
  categories,
  emptyMessage,
  sortKey,
  sortDescending,
  onSort,
  onEdit,
  onDelete,
}: {
  categories: AdminCategoryRow[];
  emptyMessage: string;
  sortKey: CategorySortKey;
  sortDescending: boolean;
  onSort: (key: CategorySortKey) => void;
  onEdit: (category: AdminCategoryRow) => void;
  onDelete: (category: AdminCategoryRow) => void;
}) {
  const columns: { key: CategorySortKey; label: string }[] = [
    { key: "name", label: "Nom" },
    { key: "slug", label: "Identifiant (slug)" },
    { key: "procedureCount", label: "Procédures" },
    { key: "status", label: "Statut" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-220 border-collapse text-left text-sm">
        <thead className="bg-secondary/60 text-brand-ink">
          <tr>
            {columns.slice(0, 2).map((column) => (
              <SortableHeader
                key={column.key}
                columnKey={column.key}
                label={column.label}
                sortKey={sortKey}
                sortDescending={sortDescending}
                onSort={onSort}
              />
            ))}
            <th
              scope="col"
              className="border-b border-r border-border px-3 py-3 text-left font-semibold sm:px-4"
            >
              Description
            </th>
            {columns.slice(2).map((column) => (
              <SortableHeader
                key={column.key}
                columnKey={column.key}
                label={column.label}
                sortKey={sortKey}
                sortDescending={sortDescending}
                onSort={onSort}
              />
            ))}
            <th
              scope="col"
              className="border-b border-border px-3 py-3 text-right font-semibold sm:px-4"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {categories.map((category) => (
            <tr
              key={category.id}
              className="transition-colors hover:bg-muted/40"
            >
              <td className="border-r border-border px-3 py-3 font-semibold text-brand-ink sm:px-4">
                {category.name}
              </td>
              <td className="border-r border-border px-3 py-3 font-mono text-xs text-brand-ink-muted sm:px-4">
                {category.slug}
              </td>
              <td className="max-w-96 border-r border-border px-3 py-3 text-brand-ink-muted sm:px-4">
                <span className="line-clamp-2">{category.description}</span>
              </td>
              <td className="border-r border-border px-3 py-3 text-center font-semibold tabular-nums text-brand-ink sm:px-4">
                {formatCount(category._count.procedures)}
              </td>
              <td className="border-r border-border px-3 py-3 sm:px-4">
                <span
                  className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-semibold ${category.isActive ? "bg-emerald-100 text-emerald-800" : "bg-muted text-brand-ink-muted"}`}
                >
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-3 py-3 text-right sm:px-4">
                <div className="inline-flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                    className="gap-1.5 text-base cursor-pointer text-brand-green hover:text-brand-green-dark"
                  >
                    <Pencil className="size-5" aria-hidden="true" />
                    Modifier
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Supprimer ${category.name}`}
                    onClick={() => onDelete(category)}
                    className="text-brand-ink-muted cursor-pointer hover:bg-brand-danger-bg hover:text-brand-danger"
                  >
                    <Trash2 className="size-5" aria-hidden="true" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-12 text-center text-lg text-brand-ink-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortableHeader({
  columnKey,
  label,
  sortKey,
  sortDescending,
  onSort,
}: {
  columnKey: CategorySortKey;
  label: string;
  sortKey: CategorySortKey;
  sortDescending: boolean;
  onSort: (key: CategorySortKey) => void;
}) {
  const isSelected = sortKey === columnKey;
  return (
    <th
      scope="col"
      aria-sort={
        isSelected ? (sortDescending ? "descending" : "ascending") : "none"
      }
      className="border-b border-r border-border px-3 py-3 last:border-r-0 sm:px-4"
    >
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className="inline-flex items-center gap-1.5 font-semibold hover:text-brand-green"
      >
        {label}
        <ArrowUpDown
          className={`size-4 ${isSelected ? "text-brand-green" : "text-brand-ink-muted"}`}
          aria-hidden="true"
        />
      </button>
    </th>
  );
}
