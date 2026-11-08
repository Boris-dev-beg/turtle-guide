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
import { formtaPrice } from "./Constantes/Globalconsts";
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

  const form = useForm<CheckoutRequest>({
    resolver: zodResolver(checkoutRequestSchema),
    defaultValues: { documentId: document.id, method: "card" },
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

  const openPayment = () => setOpen(true);

  const handleDialogChange = (value: boolean) => {
    if (!pending) setOpen(value);
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
        docId={document.id}
        customizationOpen={customizationOpen}
        setCustomizationOpen={setCustomizationOpen}
        // handleCustomizationDialogChange={handleCustomizationDialogChange}
        // stepIndex={stepIndex}
        // totalSteps={totalSteps}
        // currentStepFields={currentStepFields}
        // personalizationForm={personalizationForm}
        // handleCustomize={handleCustomize}
        // nextStep={nextStep}
        // previousStep={previousStep}
      />
    </>
  );
}
