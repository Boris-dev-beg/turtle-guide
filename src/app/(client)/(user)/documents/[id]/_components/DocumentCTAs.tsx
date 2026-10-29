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
import {
  checkoutRequestSchema,
  type CheckoutRequest,
} from "@/lib/payment/checkout-schema";

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

  /** Valide le choix avant de demander au serveur une session Stripe Checkout. */
  const handlePay = form.handleSubmit(async (values) => {
    try {
      const result = await startDocumentPurchase(values);
      window.location.assign(result.checkoutUrl);
    } catch {
      form.setError("root", {
        message:
          "Impossible de démarrer le paiement. Réessayez dans un instant.",
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
        className="btn btn-primary"
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
            <p className="min-w-0 text-lg font-medium text-brand-ink">
              {document.name}
            </p>
            <p className="shrink-0 text-lg font-semibold text-brand-ink">
              {price}
            </p>
          </div>

          {/* Le formulaire ne collecte aucune donnée sensible de carte. */}
          <form onSubmit={handlePay} className="space-y-3">
            <input type="hidden" {...form.register("documentId")} />
            <input type="hidden" {...form.register("method")} />
            <div className="flex items-start gap-3 rounded-md border border-brand-green bg-brand-green-soft p-3 text-lg">
              <CreditCard
                className="mt-0.5 size-6 shrink-0 text-brand-green"
                aria-hidden
              />
              <span>
                <span className="block font-medium text-brand-ink">
                  Carte bancaire
                </span>
                <span className="block leading-6 text-brand-ink-muted">
                  Paiement sécurisé via Stripe Checkout.
                </span>
              </span>
            </div>
            {form.formState.errors.root && (
              <p role="alert" className="text-lg text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            {/* Réassurance */}
            <p className="flex items-start gap-2 text-lg leading-6 text-brand-ink-muted">
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                TurtleGuide ne conserve aucune donnée de carte. Après confirmation
                Stripe, votre achat sera indiqué sur cette page.
              </span>
            </p>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cancelPayment}
                disabled={pending}
                className="btn btn-outline min-h-12 text-lg"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={pending}
                className="btn btn-primary min-h-12 text-lg"
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
