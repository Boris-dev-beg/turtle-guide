"use client";

import { AdminCategoryRow, CategorySortKey, CategoryStatusFilter } from "@/types/type";
import { useMemo, useState } from "react";

/** Gère recherche, statut et tri de la liste de catégories pour garder la vue de présentation compacte. */
export function useCategoryList(categories: AdminCategoryRow[]) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CategoryStatusFilter>("all");
  const [sortKey, setSortKey] = useState<CategorySortKey>("name");
  const [sortDescending, setSortDescending] = useState(false);

  const filteredCategories = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("fr-FR");
    return categories
      .filter((category) => {
        const searchableText =
          `${category.name} ${category.slug} ${category.description}`.toLocaleLowerCase(
            "fr-FR",
          );
        const matchesStatus =
          status === "all" ||
          (status === "active" ? category.isActive : !category.isActive);
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
  }, [categories, query, sortDescending, sortKey, status]);

  /** Change la colonne de tri et inverse le sens lorsqu'elle est déjà sélectionnée. */
  const toggleSort = (key: CategorySortKey) => {
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
    filteredCategories,
    setQuery,
    setStatus,
    toggleSort,
  };
}

/** Fournit une valeur comparable pour chaque colonne du tableau, y compris les champs calculés. */
function getSortValue(category: AdminCategoryRow, key: CategorySortKey) {
  if (key === "procedureCount") return category._count.procedures;
  if (key === "status") return Number(category.isActive);
  return category[key].toLocaleLowerCase("fr-FR");
}
