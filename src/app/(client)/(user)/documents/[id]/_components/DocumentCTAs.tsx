"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startDocumentPurchase } from "@/lib/documents";
import {
  checkoutRequestSchema,
  type CheckoutRequest,
} from "@/lib/payment/checkout-schema";
import {
  PersonalizationFormValues,
  personalizationSchema,
} from "../_schema/personalization.schema";
import { formtaPrice, personalizationSteps } from "./Constantes/Globalconsts";
import PurchaseForm from "./forms/PurchaseForm";
import PersonalizationForm from "./forms/PersonalizationForm";

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
  const price = formtaPrice(document.price);

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
        handleDialogChange={handleDialogChange}
        document={document}
        price={price}
        method={method}
        form={form}
        handlePay={handlePay}
        pending={pending}
      />

      <PersonalizationForm
        customizationOpen={customizationOpen}
        handleCustomizationDialogChange={handleCustomizationDialogChange}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        currentStepFields={currentStepFields}
        personalizationForm={personalizationForm}
        setCustomizationOpen={setCustomizationOpen}
        handleCustomize={handleCustomize}
        nextStep={nextStep}
        previousStep={previousStep}
      />
    </>
  );
}
