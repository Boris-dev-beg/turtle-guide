"use client";

import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminProcedureRow, ProcedureSortKey } from "@/types/type";

function formatCount(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

export default function ProcedureTable({
  procedures,
  emptyMessage,
  sortKey,
  sortDescending,
  onSort,
  onEdit,
  onDelete,
}: {
  procedures: AdminProcedureRow[];
  emptyMessage: string;
  sortKey: ProcedureSortKey;
  sortDescending: boolean;
  onSort: (key: ProcedureSortKey) => void;
  onEdit: (procedure: AdminProcedureRow) => void;
  onDelete: (procedure: AdminProcedureRow) => void;
}) {
  const columns: { key: ProcedureSortKey; label: string }[] = [
    { key: "title", label: "Titre" },
    { key: "legalBasis", label: "Base légal" },
    { key: "questionCount", label: "Questions" },
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
              className="border-b border-r border-border px-3 py-3 text-base text-left font-semibold sm:px-4"
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
          {procedures.map((procedure) => (
            <tr
              key={procedure.id}
              className="transition-colors hover:bg-muted/40"
            >
              <td className="border-r border-border px-3 py-3 text-base font-semibold text-brand-ink sm:px-4 max-w-3xs">
                {procedure.title}
              </td>
              <td className="border-r border-border px-3 py-3 font-mono text-sm text-brand-ink-muted sm:px-4 max-w-2xs">
                {procedure.legalBasis.split("—")[0]}
              </td>
              <td className="max-w-100 text-base border-r border-border px-3 py-3 text-brand-ink-muted sm:px-4">
                <span className="line-clamp-3">{procedure.description}</span>
              </td>
              <td className="border-r border-border px-3 py-3 text-center text-base font-semibold tabular-nums text-brand-ink sm:px-4">
                {formatCount(procedure._count.questions)}
              </td>
              <td className="border-r border-border px-3 py-3 sm:px-4">
                <span
                  className={`inline-flex rounded-sm px-2.5 py-1 text-sm font-semibold ${procedure.isActive ? "bg-emerald-100 text-emerald-800" : "bg-muted text-brand-ink-muted"}`}
                >
                  {procedure.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-3 py-3 text-right sm:px-4">
                <div className="inline-flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(procedure)}
                    className="gap-1.5 text-base cursor-pointer text-brand-green hover:text-brand-green-dark"
                  >
                    <Pencil className="size-5" aria-hidden="true" />
                    Modifier
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Supprimer ${procedure.title}`}
                    onClick={() => onDelete(procedure)}
                    className="text-brand-ink-muted cursor-pointer hover:bg-brand-danger-bg hover:text-brand-danger"
                  >
                    <Trash2 className="size-5" aria-hidden="true" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {procedures.length === 0 && (
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
  columnKey: ProcedureSortKey;
  label: string;
  sortKey: ProcedureSortKey;
  sortDescending: boolean;
  onSort: (key: ProcedureSortKey) => void;
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
        className="inline-flex items-center gap-1.5 text-base font-semibold hover:text-brand-green"
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
