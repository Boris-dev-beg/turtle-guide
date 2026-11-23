"use client";

import { AdminProcedureRow, ProcedireSortKey, ProcedureStatusFilter } from "@/types/type";
import { useMemo, useState } from "react";

export function useProcedureList(procedures: AdminProcedureRow[]) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProcedureStatusFilter>("all");
  const [sortKey, setSortKey] = useState<ProcedireSortKey>("title");
  const [sortDescending, setSortDescending] = useState(false);

  const filteredProcedure = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("fr-FR");
    return procedures
      .filter((procedure) => {
        const searchableText =
          `${procedure.title} ${procedure.description}`.toLocaleLowerCase(
            "fr-FR",
          );
        const matchesStatus =
          status === "all" ||
          (status === "active" ? procedure.isActive : !procedure.isActive);
        return searchableText.includes(search) && matchesStatus;
      })
      .sort((first, second) => {
        const firstValue = getSortValue(first, sortKey);
        const secondValue = getSortValue(second, sortKey);
        const comparison =
          typeof firstValue === "number" && typeof secondValue === "number"
            ? firstValue - secondValue
            : String(firstValue).localeCompare(String(secondValue), "fr");
        return sortDescending ? -comparison : comparison;
      });
  }, [procedures, query, sortDescending, sortKey, status]);

  const toggleSort = (key: ProcedireSortKey) => {
    if (sortKey === key) setSortDescending((descending) => !descending);
    else {
      setSortKey(key);
      setSortDescending(false);
    }
  };

  return {
    query,
    status,
    sortKey,
    sortDescending,
    filteredProcedure,
    setQuery,
    setStatus,
    toggleSort,
  };
}

function getSortValue(procedure: AdminProcedureRow, key: ProcedireSortKey) {
  if (key === "questionCount") return procedure._count.questions;
  if (key === "status") return Number(procedure.isActive);
  return procedure[key].toLocaleLowerCase("fr-FR");
}
