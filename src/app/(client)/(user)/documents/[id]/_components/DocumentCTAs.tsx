"use client";

import Link from "next/link";
import { useTransition } from "react";
import { startDocumentPurchase } from "../actions";

export function DocumentCTAs({
  documentId,
  isAuthenticated,
  alreadyPurchased,
}: {
  documentId: string;
  isAuthenticated: boolean;
  alreadyPurchased: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (alreadyPurchased) {
    return (
      <p className="mt-4 rounded-md bg-brand-green-soft p-3 text-sm font-medium text-brand-green">
        Vous avez déjà acheté ce document. Retrouvez-le dans votre dossier.
      </p>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(`/documents/${documentId}`)}`}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-md bg-brand-green font-medium text-white"
      >
        Se connecter pour acheter
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => startDocumentPurchase(documentId))}
      className="mt-4 h-12 w-full rounded-md bg-brand-green font-medium text-white disabled:opacity-60"
    >
      {pending ? "Redirection…" : "Acheter ce document"}
    </button>
  );
}