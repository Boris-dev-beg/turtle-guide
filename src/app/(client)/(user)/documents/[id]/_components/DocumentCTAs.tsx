"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CreditCard, Lock, Smartphone } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const personalizationSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis."),
  lastName: z.string().min(2, "Le nom est requis."),
  birthDate: z.string().min(1, "La date de naissance est requise."),
  age: z
    .string()
    .trim()
    .min(1, "L'âge est requis.")
    .refine((value) => {
      const num = Number(value);
      return Number.isInteger(num) && num >= 0 && num <= 120;
    }, "L'âge doit être un nombre valide entre 0 et 120."),
  phone: z.string().min(8, "Le téléphone est requis."),
  email: z
    .string()
    .email("L'adresse e-mail est invalide.")
    .optional()
    .or(z.literal("")),
  city: z.string().min(2, "La ville est requise."),
  address: z.string().min(3, "L'adresse est requise."),
  purpose: z.string().min(3, "Le besoin est requis."),
  notes: z
    .string()
    .max(250, "Le message est trop long.")
    .optional()
    .or(z.literal("")),
});

type PersonalizationFormValues = z.infer<typeof personalizationSchema>;

const personalizationSteps = [
  ["firstName", "lastName", "birthDate", "age"],
  ["phone", "email", "city", "address"],
  ["purpose", "notes"],
] as const;

/** Affiche l'achat du document et valide le mode choisi avant la redirection prestataire. */
export function DocumentCTAs({
  document,
  isAuthenticated,
  alreadyPurchased,
}: {
  document: { id: string; name: string; price: number; customizable?: boolean };
  isAuthenticated: boolean;
  alreadyPurchased: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const form = useForm<CheckoutRequest>({
    resolver: zodResolver(checkoutRequestSchema),
    defaultValues: { documentId: document.id, method: "card" },
  });

  const personalizationForm = useForm<PersonalizationFormValues>({
    resolver: zodResolver(personalizationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      age: "",
      phone: "",
      email: "",
      city: "",
      address: "",
      purpose: "",
      notes: "",
    },
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

  const handlePay = form.handleSubmit(async (values) => {
    try {
      const result = await startDocumentPurchase(values);
      window.location.assign(result.checkoutUrl);
    } catch {
      form.setError("root", {
        message:
          "Impossible de démarrer le paiement. Vérifiez la configuration puis réessayez.",
      });
    }
  });

  const handleCustomize = personalizationForm.handleSubmit(async (values) => {
    try {
      window.sessionStorage.setItem(
        `document-personalization:${document.id}`,
        JSON.stringify(values),
      );
      const result = await startDocumentPurchase({
        documentId: document.id,
        method: "card",
      });
      window.location.assign(result.checkoutUrl);
    } catch {
      personalizationForm.setError("root", {
        message:
          "Impossible de lancer la personnalisation et le paiement. Réessayez dans quelques instants.",
      });
    }
  });

  const openPayment = () => setOpen(true);

  const handleDialogChange = (value: boolean) => {
    if (!pending) setOpen(value);
  };

  const handleCustomizationDialogChange = (value: boolean) => {
    if (!personalizationForm.formState.isSubmitting) {
      setCustomizationOpen(value);
      if (!value) setStepIndex(0);
    }
  };

  const nextStep = async () => {
    const stepFields = personalizationSteps[stepIndex];
    const isValid = await personalizationForm.trigger(stepFields);
    if (isValid && stepIndex < personalizationSteps.length - 1) {
      setStepIndex((current) => current + 1);
    }
  };

  const previousStep = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const totalSteps = personalizationSteps.length;
  const currentStepFields = personalizationSteps[stepIndex];

  const renderField = (
    name: keyof PersonalizationFormValues,
    label: string,
    type?: string,
  ) => {
    const error = personalizationForm.formState.errors[name]?.message;
    return (
      <div key={name} className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Input
          id={name}
          type={type ?? "text"}
          {...personalizationForm.register(name)}
          aria-invalid={!!error}
          placeholder={label}
          className={error ? "border-destructive" : ""}
        />
        {error && <p className="text-sm text-destructive">{String(error)}</p>}
      </div>
    );
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

      {document.customizable && (
        <button
          type="button"
          onClick={() => setCustomizationOpen(true)}
          className="btn btn-outline mt-3 min-h-12 w-full text-lg"
        >
          Personnaliser ce document
        </button>
      )}

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
            <p className="min-w-0 font-medium text-brand-ink">
              {document.name}
            </p>
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
                onClick={() => setOpen(false)}
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

      <Dialog
        open={customizationOpen}
        onOpenChange={handleCustomizationDialogChange}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-brand-ink">
              Personnaliser le document
            </DialogTitle>
            <DialogDescription className="text-lg text-brand-ink-muted">
              Complétez vos informations pour continuer vers le paiement.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border border-border bg-muted p-3 text-sm text-brand-ink-muted">
            Étape {stepIndex + 1} / {totalSteps}
          </div>

          <form onSubmit={handleCustomize} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              {currentStepFields.map((fieldName) => {
                const fieldMap: Record<
                  keyof PersonalizationFormValues,
                  { label: string; type?: string }
                > = {
                  firstName: { label: "Prénom" },
                  lastName: { label: "Nom" },
                  birthDate: { label: "Date de naissance", type: "date" },
                  age: { label: "Âge", type: "number" },
                  phone: { label: "Téléphone" },
                  email: { label: "E-mail", type: "email" },
                  city: { label: "Ville" },
                  address: { label: "Adresse" },
                  purpose: { label: "Objet de la demande" },
                  notes: { label: "Informations utiles" },
                };

                const fieldConfig = fieldMap[fieldName];
                if (!fieldConfig) return null;

                return renderField(
                  fieldName,
                  fieldConfig.label,
                  fieldConfig.type,
                );
              })}
            </div>

            {personalizationForm.formState.errors.root && (
              <p className="text-sm text-destructive">
                {String(personalizationForm.formState.errors.root.message)}
              </p>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (stepIndex === 0) {
                    setCustomizationOpen(false);
                    return;
                  }
                  previousStep();
                }}
                className="btn btn-outline min-h-12 text-lg"
              >
                {stepIndex === 0 ? "Fermer" : "Retour"}
              </button>

              {stepIndex < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary min-h-12 text-lg"
                >
                  Suivant
                  <ArrowRight className="size-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={personalizationForm.formState.isSubmitting}
                  className="btn btn-primary min-h-12 text-lg"
                >
                  {personalizationForm.formState.isSubmitting
                    ? "Préparation du paiement…"
                    : "Continuer vers le paiement"}
                </button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
