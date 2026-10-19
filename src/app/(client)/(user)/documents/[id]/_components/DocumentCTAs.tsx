"use client";

import { Document } from "@/generated/prisma/client";
import { startDocumentPurchase } from "@/lib/documents";
import Link from "next/link";
import { useTransition } from "react";

export function DocumentCTAs({
  document,
  isAuthenticated,
  alreadyPurchased,
}: {
  document: Document;
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
        href={`/login?callbackUrl=${encodeURIComponent(`/documents/${document.id}`)}`}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-md bg-brand-green font-medium text-white"
      >
        Se connecter pour acheter
      </Link>
    );
  }

  return (
    <>
      <div className="absolute bg-accent top-17 right-1 left-1 bottom-17 flex items-center justify-center flex-col gap-4">
        <h1>Acheter ce Document:</h1>
        <p>{document.name}</p>

        <div>
          <span className={`turtle-radio justify-start gap-3 items-start hover:border-primary/30 hover:bg-accent/40`}>
            <b className="turtle-radio"></b>
            <p>Stripe</p>
          </span>
        </div>
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => startDocumentPurchase(document.id))}
        className="mt-4 h-12 w-full rounded-md bg-brand-green font-medium text-white disabled:opacity-60"
      >
        {pending ? "Redirection…" : "Acheter ce document"}
      </button>
    </>
  );
}
