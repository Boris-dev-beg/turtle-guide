"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { useCategories } from "@/hooks/useCategories";
import { Category_card, Loader } from "./_components/cards/category.card";

export function Categories() {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
        <Loader />
      </div>
    );
  }

  if (error || !categories) {
    return (
      <EmptyState
        title="Données indisponibles"
        description="Les catégories de démarches ne sont pas disponibles pour le moment. Merci de réessayer un peu plus tard."
        actionLabel="Réessayer"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        title="Aucune catégorie disponible"
        description="Aucune démarche n’est actuellement proposée dans cette liste."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 py-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Category_card
          key={category.id}
          title={category.name}
          description={category.description}
          procedureCount={category._count?.procedures ?? 0}
        />
      ))}
    </div>
  );
}
