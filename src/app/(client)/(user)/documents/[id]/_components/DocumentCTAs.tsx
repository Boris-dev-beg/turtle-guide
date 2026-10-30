"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Lock, Smartphone } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
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

const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Carte bancaire avec Stripe",
    description: "Paiement par carte sur la page sécurisée Stripe.",
    Icon: CreditCard,
  },
  {
    id: "kpay",
    label: "Mobile Money avec KPay",
    description:
      "Choisissez MTN Mobile Money ou Orange Money sur la page sécurisée KPay.",
    Icon: Smartphone,
  },
] as const;

/** Affiche l'achat du document et valide le mode choisi avant la redirection prestataire. */
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
  const method = useWatch({ control: form.control, name: "method" });
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

  /** Valide les champs avec Zod puis redirige vers l'URL créée côté serveur. */
  const handlePay = form.handleSubmit(async (values) => {
    try {
      const result = await startDocumentPurchase(values);
      window.location.assign(result.checkoutUrl);
    } catch {
      form.setError("root", {
        message: "Impossible de démarrer le paiement. Vérifiez la configuration puis réessayez.",
      });
    }
  });

  /** Conserve la boîte de dialogue ouverte tant qu'une session de paiement se prépare. */
  const handleDialogChange = (value: boolean) => {
    if (!pending) setOpen(value);
  };

  /** Ouvre la boîte de dialogue de choix du moyen de paiement. */
  const openPayment = () => setOpen(true);

  /** Ferme la boîte de dialogue uniquement si aucun paiement n'est en cours. */
  const cancelPayment = () => {
    if (!pending) setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={openPayment}
        className="btn btn-primary mt-4 min-h-12 w-full text-lg"
      >
        Acheter ce document
      </button>

      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-brand-ink">
              Acheter ce document
            </DialogTitle>
            <DialogDescription className="text-lg text-brand-ink-muted">
              Choisissez un mode de paiement pour continuer.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-muted p-3 text-lg">
            <p className="min-w-0 font-medium text-brand-ink">{document.name}</p>
            <p className="shrink-0 font-semibold text-brand-ink">{price}</p>
          </div>

          <form onSubmit={handlePay} className="space-y-4">
            <input type="hidden" {...form.register("documentId")} />

            <fieldset disabled={pending} className="space-y-3">
              <legend className="mb-2 text-lg font-semibold text-brand-ink">
                Moyen de paiement
              </legend>
              {PAYMENT_METHODS.map(({ id, label, description, Icon }) => {
                const selected = method === id;
                return (
                  <label
                    key={id}
                    className={`turtle-radio has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring ${
                      selected ? "turtle-radio-active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      value={id}
                      {...form.register("method")}
                      className="sr-only"
                    />
                    <Icon
                      className="size-6 shrink-0 text-brand-green"
                      aria-hidden
                    />
                    <span className="flex-1">
                      <span className="block text-lg font-medium text-brand-ink">
                        {label}
                      </span>
                      <span className="block text-lg leading-6 text-brand-ink-muted">
                        {description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </fieldset>

            {form.formState.errors.root && (
              <p role="alert" className="text-lg text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <p className="flex items-start gap-2 text-lg leading-6 text-brand-ink-muted">
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>
                Les informations de paiement sont saisies sur la page sécurisée
                du prestataire choisi, pas sur TurtleGuide.
              </span>
            </p>

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
                {pending
                  ? "Préparation du paiement…"
                  : `Payer ${price} avec ${method === "kpay" ? "KPay" : "Stripe"}`}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
