"use client";

import { useState } from "react";
import Link from "next/link";
import PurchaseForm from "./forms/PurchaseForm";
import PersonalizationForm from "./forms/PersonalizationForm";

export function DocumentCTAs({
  document,
  isAuthenticated,
  alreadyPurchased,
}: {
  document: { id: string; name: string; price: number; customizable?: boolean };
  isAuthenticated: boolean;
  alreadyPurchased: boolean;
}) {
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [open, setOpen] = useState(false);
  

  if (alreadyPurchased) {
    return (
      <div role="status" className="turtle-alert-info mt-4 text-lg">
        Vous avez déjà acheté ce document.
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(`/documents/${document.id}`)}`}
        className="btn btn-primary mt-4 min-h-12 w-full text-lg"
      >
        Se connecter pour acheter
      </Link>
    );
  }


  const openPayment = () => setOpen(true);

  return (
    <>
      <button
        type="button"
        onClick={openPayment}
        className="btn btn-primary mt-4 min-h-12 w-full text-lg"
      >
        Acheter ce document
      </button>

      {document.customizable && (
        <button
          type="button"
          onClick={() => setCustomizationOpen(true)}
          className="btn btn-outline mt-3 min-h-12 w-full text-lg"
        >
          Personnaliser ce document
        </button>
      )}

      <PurchaseForm
        open={open}
        setOpen={setOpen}
        document={document}
      />

      <PersonalizationForm
        docId={document.id}
        customizationOpen={customizationOpen}
        setCustomizationOpen={setCustomizationOpen}
      />
    </>
  );
}
