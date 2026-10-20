"use client";

import { Document } from "@/generated/prisma/client";
import { startDocumentPurchase } from "@/lib/documents";
import Link from "next/link";
import { useState, useTransition } from "react";

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
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [showChoices, setShowchoices] = useState(false);

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
      {showChoices && (
        <div className="fixed bg-secondary/95 flex items-center justify-center flex-col gap-4 z-50 inset-25">
          <h1>Acheter ce Document:</h1>
          <p>{document.name}</p>

          <div className="flex gap-10">
            <MethodButton
              label="Stripe"
              isSelected={paymentMethod}
              setIsSelected={setPaymentMethod}
              start={() =>
                startTransition(() => startDocumentPurchase(document.id))
              }
              pending={pending}
              setShowChoices={setShowchoices}
            />
            <MethodButton
              label="Mobile Money"
              isSelected={paymentMethod}
              setIsSelected={setPaymentMethod}
              start={() =>
                startTransition(() => startDocumentPurchase(document.id))
              }
              pending={pending}
              setShowChoices={setShowchoices}
            />
            <MethodButton
              label="MTN Momo"
              isSelected={paymentMethod}
              setIsSelected={setPaymentMethod}
              start={() =>
                startTransition(() => startDocumentPurchase(document.id))
              }
              pending={pending}
              setShowChoices={setShowchoices}
            />
          </div>
        </div>
      )}
      <button
        onClick={() => setShowchoices(true)}
        className="mt-4 h-12 w-full rounded-md bg-brand-green font-medium text-white disabled:opacity-60"
      >
        Acheter ce document
      </button>
    </>
  );
}

const MethodButton = ({
  label,
  isSelected,
  setIsSelected,
  start,
  pending,
  setShowChoices,
}: {
  label: string;
  isSelected: string;
  setIsSelected: (val: string) => void;
  start: () => void;
  pending: boolean;
  setShowChoices: (val: boolean) => void;
}) => {
  const handleClick = (label: string) => {
    setIsSelected(label);

    setTimeout(() => {
      start();

      setShowChoices(false);
    }, 1000);
  };
  
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => handleClick(label)}
      className={`turtle-radio ${isSelected.toLowerCase() === label.toLocaleLowerCase() ? "turtle-radio-active" : "hover:border-primary/30 hover:bg-accent/40"} justify-start gap-3 items-start hover:border-primary/30 hover:bg-accent/40`}
    >
      {label}
    </button>
  );
};
