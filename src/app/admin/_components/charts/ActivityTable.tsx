"use client";

import {
  createColumnHelper,
  columnFilteringFeature,
  createCoreRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowDownUp,
  ArrowUp,
  FileCheck2,
  FolderPlus,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DashboardActivity } from "../../types/types";

const dashboardTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  coreRowModel: createCoreRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
});
const columnHelper = createColumnHelper<
  typeof dashboardTableFeatures,
  DashboardActivity
>();
const activityTypeLabels = {
  folder: "Dossier",
  purchase: "Achat",
  fraud: "Signalement",
} as const;
const activityTypeStyles = {
  folder: "bg-emerald-50 text-emerald-800",
  purchase: "bg-sky-50 text-sky-800",
  fraud: "bg-orange-50 text-orange-800",
} as const;
const activityTypeIcons = {
  folder: FolderPlus,
  purchase: FileCheck2,
  fraud: ShieldAlert,
} as const;

/** Formate une date d'activité dans le fuseau local du navigateur de l'administrateur. */
function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

/** Affiche les événements récents dans un tableau filtrable et triable via TanStack Table. */
export default function ActivityTable({
  items,
}: {
  items: DashboardActivity[];
}) {
  "use no memo";

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "occurredAt", desc: true },
  ]);

  const columns = columnHelper.columns([
    columnHelper.accessor("kind", {
      header: "Type",
      cell: (context) => {
        const kind = context.getValue();
        const Icon = activityTypeIcons[kind];
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium ${activityTypeStyles[kind]}`}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {activityTypeLabels[kind]}
          </span>
        );
      },
    }),
    columnHelper.accessor("title", {
      header: "Activité",
      cell: (context) => (
        <span className="font-medium text-brand-ink">{context.getValue()}</span>
      ),
    }),
    columnHelper.accessor("detail", {
      header: "Détail",
      cell: (context) => (
        <span
          className="block max-w-64 truncate text-brand-ink-muted"
          title={context.getValue()}
        >
          {context.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("occurredAt", {
      header: "Date",
      cell: (context) => (
        <time
          dateTime={context.getValue()}
          className="whitespace-nowrap text-xs text-brand-ink-muted"
        >
          {formatActivityDate(context.getValue())}
        </time>
      ),
    }),
  ]);

  const table = useTable({
    features: dashboardTableFeatures,
    data: items,
    columns,
    state: { globalFilter, sorting },
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  });

  return (
    <Card className="min-w-0 gap-4 rounded-md p-4 shadow-none ring-border sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-brand-ink">
            Activité récente
          </h2>
          <p className="mt-1 text-xs text-brand-ink-muted">
            Dossiers créés, achats confirmés et alertes reçues
          </p>
        </div>
        <label className="relative block w-full sm:max-w-56">
          <span className="sr-only">Rechercher dans les activités</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-ink-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={globalFilter}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Rechercher une activité"
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-brand-green/50 focus:ring-2 focus:ring-brand-green/10"
          />
        </label>
      </div>

      {items.length === 0 ? (
        <p className="py-5 text-sm text-brand-ink-muted">
          Aucune activité enregistrée pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-152 border-collapse text-left text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="pb-3 pr-4 text-xs font-semibold uppercase text-brand-ink-muted last:pr-0"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex items-center gap-1.5 hover:text-brand-ink"
                        >
                          <table.FlexRender header={header} />
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="size-3.5" aria-hidden="true" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown
                              className="size-3.5"
                              aria-hidden="true"
                            />
                          ) : (
                            <ArrowDownUp
                              className="size-3.5 opacity-50"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="align-middle">
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="py-3 pr-4 last:pr-0">
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length > 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <p className="text-xs text-brand-ink-muted">
            {table.getFilteredRowModel().rows.length} activité(s)
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="btn btn-outline min-h-8 px-3 py-1 text-xs"
            >
              Précédent
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="btn btn-outline min-h-8 px-3 py-1 text-xs"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
