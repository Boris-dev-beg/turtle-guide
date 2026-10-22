"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { startDocumentPurchase } from "@/lib/documents";
import { checkoutRequestSchema, type CheckoutRequest } from "@/lib/payment/checkout-schema";

/** Affiche l'achat du document et valide le choix de paiement avant redirection Stripe. */
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
  const form = useForm<CheckoutRequest>({
    resolver: zodResolver(checkoutRequestSchema),
    defaultValues: { documentId: document.id, method: "card" },
  });
  const pending = form.formState.isSubmitting;

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

  /** Valide le choix avant de demander au serveur une session Stripe Checkout. */
  const handlePay = form.handleSubmit(async (values) => {
    try {
      const result = await startDocumentPurchase(values);
      window.location.assign(result.checkoutUrl);
    } catch {
      form.setError("root", {
        message: "Impossible de démarrer le paiement. Réessayez dans un instant.",
      });
    }
  });

  /** Empêche la fermeture de la fenêtre pendant la création/redirection Checkout. */
  const handleDialogChange = (value: boolean) => {
    if (!pending) setOpen(value);
  };

  /** Ouvre le dialogue de confirmation du paiement. */
  const openPayment = () => setOpen(true);

  /** Annule le dialogue avant la soumission. */
  const cancelPayment = () => {
    if (!pending) setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={openPayment}
        className="mt-4 h-12 w-full rounded-md bg-brand-green font-medium text-white"
      >
        Acheter ce document
      </button>

      {/* On ne ferme pas la popup pendant la redirection vers le paiement */}
      <Dialog open={open} onOpenChange={handleDialogChange}>
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

          {/* Le formulaire ne collecte aucune donnée sensible de carte. */}
          <form onSubmit={handlePay} className="space-y-3">
            <input type="hidden" {...form.register("documentId")} />
            <input type="hidden" {...form.register("method")} />
            <div className="flex items-start gap-3 rounded-md border border-brand-green bg-brand-green-soft p-3">
              <CreditCard className="mt-0.5 size-6 shrink-0 text-brand-green" aria-hidden />
              <span>
                <span className="block text-base font-medium text-brand-ink">Carte bancaire</span>
                <span className="block text-sm leading-5 text-brand-ink-muted">Paiement sécurisé via Stripe Checkout.</span>
              </span>
            </div>
            {form.formState.errors.root && (
              <p role="alert" className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}

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
              onClick={cancelPayment}
              disabled={pending}
              className="h-12 rounded-md border border-border px-5 font-medium text-brand-ink hover:bg-muted disabled:opacity-60"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={pending}
              className="h-12 rounded-md bg-brand-green px-5 font-medium text-white disabled:opacity-60"
            >
              {pending ? "Redirection vers le paiement…" : `Payer ${price}`}
            </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
