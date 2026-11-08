import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ArrowRight } from "lucide-react";
import {
  PersonalizationFormValues,
  personalizationSchema,
} from "../../_schema/personalization.schema";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { startDocumentPurchase } from "@/lib/documents";
import { personalizationSteps } from "../Constantes/Globalconsts";

export default function PersonalizationForm({
  customizationOpen,
  setCustomizationOpen,
  docId,
}: {
  docId: string;
  setCustomizationOpen: (val: boolean) => void;
  customizationOpen: boolean;
}) {
  const [stepIndex, setStepIndex] = useState(0);

  const personalizationForm = useForm<PersonalizationFormValues>({
    resolver: zodResolver(personalizationSchema),
    mode:"onChange",
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

  const handleCustomize = personalizationForm.handleSubmit(async (values) => {
    try {
      window.sessionStorage.setItem(
        `document-personalization:${docId}`,
        JSON.stringify(values),
      );
      const result = await startDocumentPurchase({
        documentId: docId,
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

  return (
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
              const fieldConfig = fieldMap[fieldName];
              if (!fieldConfig) return null;

              return (
                <Controller
                  key={fieldName}
                  control={personalizationForm.control}
                  name={fieldName}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1.5">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-base font-semibold text-foreground"
                      >
                        {fieldConfig.label}
                      </FieldLabel>

                      <InputGroup
                        aria-invalid={fieldState.invalid}
                        className={`${
                          fieldState.invalid
                            ? "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
                            : "border-border/70 focus-within:border-primary/50 focus-within:ring-primary/50 focus-within:ring-4"
                        } h-11 rounded-lg bg-background transition-all`}
                      >
                        <InputGroupInput
                          id={field.name}
                          type={fieldConfig.type ?? "text"}
                          placeholder={fieldConfig.label}
                          {...field}
                          value={field.value ?? ""}
                          className="text-base! focus-visible:ring-0"
                          aria-invalid={fieldState.invalid}
                        />
                      </InputGroup>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              );
            })}
          </div>

          {personalizationForm.formState.errors.root && (
            <p className="text-sm text-destructive">
              {String(personalizationForm.formState.errors.root.message)}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
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
            </Button>

            {stepIndex < totalSteps - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="btn btn-primary min-h-12 text-lg"
              >
                Suivant
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={personalizationForm.formState.isSubmitting}
                className="btn btn-primary min-h-12 text-lg"
              >
                {personalizationForm.formState.isSubmitting
                  ? "Préparation du paiement…"
                  : "Continuer vers le paiement"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
