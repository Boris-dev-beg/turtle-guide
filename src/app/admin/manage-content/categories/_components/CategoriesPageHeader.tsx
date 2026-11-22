"use client";

import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CategoriesPageHeader({
  notice,
  onCreate,
  onDismissNotice,
}: {
  notice: string;
  onCreate: () => void;
  onDismissNotice: () => void;
}) {
  return (
    <>
      <nav
        aria-label="Fil d'Ariane"
        className="flex items-center gap-2 text-brand-ink-muted"
      >
        <Link
          href="/admin/manage-content"
          className="inline-flex items-center gap-1 hover:text-brand-green"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
          Gestion du contenu
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="font-medium text-brand-ink">
          Catégories
        </span>
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="mt-1 text-sm text-brand-ink-muted">
            Gérez les regroupements thématiques des procédures.
          </p>
        <Button
          type="button"
          onClick={onCreate}
          className="min-h-11 font-semibold gap-2 bg-brand-green text-white hover:bg-brand-green-dark"
        >
          <Plus className="size-5" aria-hidden="true" />
          Nouvelle catégorie
        </Button>
      </div>

      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-sm border border-brand-green/20 bg-brand-green-soft px-4 py-3 text-sm text-brand-green-dark"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={onDismissNotice}
            aria-label="Fermer la notification"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}
