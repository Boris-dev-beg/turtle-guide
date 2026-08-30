"use client";

import { useCategories } from "@/hooks/useCategories";
import { Category_card, Loader } from "../_components/cards.tsx/category.card";

export function Categories() {
  const { categories, loading } = useCategories();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 py-5">
      {loading ? (
        <Loader />
      ) : (
        categories.map((category) => (
          <Category_card
            key={category.id}
            title={category.name}
            description={category.description}
          />
        ))
      )}
    </div>
  );
}
