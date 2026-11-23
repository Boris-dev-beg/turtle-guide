import { FolderTree } from "lucide-react";
import { getAdminCategories } from "@/lib/categories";
import SectionLayout from "@/app/admin/_components/shared/SectionLayout";
import CategoriesManager from "./_components/CategoriesManager";

export default async function CategoriesPage() {
  const result = await getAdminCategories();
  if (!result.authorized) {
    return (
      <p
        role="alert"
        className="rounded-md border border-border bg-card p-5 text-brand-ink"
      >
        Connectez-vous pour accéder à la gestion des catégories.
      </p>
    );
  }

  const categories = result.categories;

  return (
    <SectionLayout
      title="Catégories"
      subtitle="Regroupements thématiques des procédures administratives."
      action={
        <span className="hidden items-center gap-2 text-sm text-brand-ink-muted sm:inline-flex">
          <FolderTree className="size-4" aria-hidden="true" />
          {categories.length} catégorie{categories.length === 1 ? "" : "s"}
        </span>
      }
    >
      <CategoriesManager categories={categories} />
    </SectionLayout>
  );
}
