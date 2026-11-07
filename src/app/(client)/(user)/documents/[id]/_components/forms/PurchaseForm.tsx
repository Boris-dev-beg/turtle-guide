import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PAYMENT_METHODS } from "../Constantes/Globalconsts";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PurchaseFormProps } from "../../_types/types";

export default function PurchaseForm({
  open,
  setOpen,
  handleDialogChange,
  document,
  price,
  method,
  form,
  handlePay,
  pending,
}: PurchaseFormProps) {
  return (
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
              Les informations de paiement sont saisies sur la page sécurisée du
              prestataire choisi, pas sur TurtleGuide.
            </span>
          </p>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              disabled={pending}
              className="btn btn-outline min-h-12 text-lg"
            >
              Annuler
            </Button>
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
  );
}
