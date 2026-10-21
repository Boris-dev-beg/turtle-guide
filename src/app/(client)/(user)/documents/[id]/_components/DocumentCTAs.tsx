"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CreditCard, Lock, Smartphone, type LucideIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { startDocumentPurchase } from "@/lib/documents";

type PaymentMethod = "mobile-money" | "card";

const METHODS: {
  id: PaymentMethod;
  label: string;
  description: string;
  provider: string;
  icon: LucideIcon;
}[] = [
  {
    id: "mobile-money",
    label: "Mobile Money",
    description: "Payez avec votre numéro de téléphone mobile.",
    provider: "Paiement sécurisé via KPay",
    icon: Smartphone,
  },
  {
    id: "card",
    label: "Carte bancaire",
    description: "Utile si vous payez depuis l'étranger.",
    provider: "Paiement sécurisé via Stripe",
    icon: CreditCard,
  },
];

export function DocumentCTAs({
  document,
  isAuthenticated,
  alreadyPurchased,
}: {
  document: { id: string; name: string; price: number };
  isAuthenticated: boolean;
  alreadyPurchased: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>("mobile-money");
  const [pending, startTransition] = useTransition();

  const price = `${new Intl.NumberFormat("fr-FR").format(document.price)} FCFA`;

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

  const handlePay = () => {
    // TODO : transmettez `method` à votre fonction de paiement
    startTransition(() => startDocumentPurchase(document.id));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 h-12 w-full rounded-md bg-brand-green font-medium text-white"
      >
        Acheter ce document
      </button>

      {/* On ne ferme pas la popup pendant la redirection vers le paiement */}
      <Dialog open={open} onOpenChange={(value) => !pending && setOpen(value)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-brand-ink">
              Acheter ce document
            </DialogTitle>
            <DialogDescription className="sr-only">
              Choisissez votre moyen de paiement puis confirmez l&apos;achat.
            </DialogDescription>
          </DialogHeader>

          {/* Récapitulatif */}
          <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-muted p-3">
            <p className="min-w-0 text-base font-medium text-brand-ink">
              {document.name}
            </p>
            <p className="shrink-0 text-base font-semibold text-brand-ink">
              {price}
            </p>
          </div>

          {/* Choix du moyen de paiement */}
          <fieldset disabled={pending}>
            <legend className="mb-2 text-base font-semibold text-brand-ink">
              Comment souhaitez-vous payer ?
            </legend>

            <div className="space-y-2">
              {METHODS.map(
                ({ id, label, description, provider, icon: Icon }) => {
                  const selected = method === id;
                  return (
                    <label
                      key={id}
                      className={cn(
                        "flex min-h-16 cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
                        "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-green",
                        selected
                          ? "border-brand-green bg-brand-green-soft"
                          : "border-border bg-card hover:border-brand-green/50",
                      )}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={id}
                        checked={selected}
                        onChange={() => setMethod(id)}
                        className="sr-only"
                      />
                      <Icon
                        className="mt-0.5 size-6 shrink-0 text-brand-green"
                        aria-hidden
                      />

                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-medium text-brand-ink">
                          {label}
                        </span>
                        <span className="block text-sm leading-5 text-brand-ink-muted">
                          {description}
                        </span>
                        <span className="mt-1 block text-sm text-brand-ink-muted">
                          {provider}
                        </span>
                      </span>

                      {/* Indicateur de sélection : forme + couleur, pas la couleur seule */}
                      <span
                        aria-hidden
                        className={cn(
                          "mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2",
                          selected ? "border-brand-green" : "border-border",
                        )}
                      >
                        {selected && (
                          <span className="size-2.5 rounded-full bg-brand-green" />
                        )}
                      </span>
                    </label>
                  );
                },
              )}
            </div>
          </fieldset>

          {/* Réassurance */}
          <p className="flex items-start gap-2 text-sm leading-5 text-brand-ink-muted">
            <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              TurtleGuide ne conserve aucune donnée de carte ni de compte Mobile
              Money. Une fois le paiement confirmé, le document est disponible
              dans votre dossier.
            </span>
          </p>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={pending}
              className="h-12 rounded-md border border-border px-5 font-medium text-brand-ink hover:bg-muted disabled:opacity-60"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handlePay}
              disabled={pending}
              className="h-12 rounded-md bg-brand-green px-5 font-medium text-white disabled:opacity-60"
            >
              {pending ? "Redirection vers le paiement…" : `Payer ${price}`}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
