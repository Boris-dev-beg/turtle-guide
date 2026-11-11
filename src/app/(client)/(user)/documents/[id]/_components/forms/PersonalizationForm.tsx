import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { ArrowRight } from "lucide-react";
import {
  PersonalizationFormValues,
  personalizationSchema,
} from "../../_schema/personalization.schema";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalizationSteps } from "../Constantes/Globalconsts";
import { toast } from "sonner";

export default function PersonalizationForm({
  customizationOpen,
  setCustomizationOpen,
  docId,
  folderId,
  requiresFiliation,
}: {
  docId: string;
  folderId: string;
  requiresFiliation: boolean;
  setCustomizationOpen: (val: boolean) => void;
  customizationOpen: boolean;
}) {
  // ! State pour suivre l'étape actuelle du formulaire de personnalisation.
  const [stepIndex, setStepIndex] = useState(0);

  // ? Gestion des formulaires avec React Hook Form et validation Zod.
  const { handleSubmit, trigger, formState, control, setError } =
    useForm<PersonalizationFormValues>({
      resolver: zodResolver(personalizationSchema),
      mode: "onChange",
      defaultValues: {
        firstName: "",
        lastName: "",
        birthDate: "",
        birthPlace: "",
        fatherName: "",
        motherName: "",
      },
    });

  // ! Function to handle form submission and PDF generation
  // ? La filiation n'est requise que pour le modèle de demande de casier judiciaire.
  const handleCustomize = handleSubmit(async (values) => {
    if (
      requiresFiliation &&
      (!values.fatherName?.trim() || !values.motherName?.trim())
    ) {
      if (!values.fatherName?.trim()) {
        setError("fatherName", { message: "Le nom du père est requis." });
      }
      if (!values.motherName?.trim()) {
        setError("motherName", { message: "Le nom de la mère est requis." });
      }
      return;
    }

    try {
      // ! Permet de générer le PDF personnalisé.
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId, folderId, data: values }),
      });

      if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.error ?? "La génération du PDF a échoué.");
      }

      // ! La réponse est le fichier PDF binaire généré par l'API, téléchargé sans navigation.
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lettre-administrative-${docId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Votre lettre personnalisée a été téléchargée.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Impossible de générer le document. Réessayez dans quelques instants.";
      setError("root", {
        message,
      });
      toast.error(message);
    } finally {
      setCustomizationOpen(false);
    }
  });

  const handleCustomizationDialogChange = (value: boolean) => {
    if (!formState.isSubmitting) {
      setCustomizationOpen(value);
      if (!value) setStepIndex(0);
    }
  };

  const formSteps = requiresFiliation
    ? personalizationSteps
    : [personalizationSteps[0]];

  const nextStep = async () => {
    const stepFields = formSteps[stepIndex];
    const isValid = await trigger(stepFields);
    if (isValid && stepIndex < formSteps.length - 1) {
      setStepIndex((current) => current + 1);
    }
  };

  const previousStep = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const totalSteps = formSteps.length;
  const currentStepFields = formSteps[stepIndex];

  const fieldMap: Record<
    keyof PersonalizationFormValues,
    { label: string; type?: string }
  > = {
    firstName: { label: "Prénom" },
    lastName: { label: "Nom" },
    birthDate: { label: "Date de naissance", type: "date" },
    birthPlace: { label: "Lieu de naissance" },
    fatherName: { label: "Nom complet du père" },
    motherName: { label: "Nom complet de la mère" },
  };

  return (
    <Dialog
      open={customizationOpen}
      onOpenChange={handleCustomizationDialogChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl p-5">
        <DialogHeader>
          <DialogTitle className="text-xl text-brand-ink">
            Personnaliser le document
          </DialogTitle>
          <DialogDescription className="text-lg text-brand-ink-muted">
            Les informations de votre dossier complètent automatiquement la
            lettre. Renseignez uniquement les données personnelles manquantes.
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
                  control={control}
                  name={fieldName}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="gap-1.5"
                    >
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

          {formState.errors.root && (
            <p className="text-sm text-destructive">
              {String(formState.errors.root.message)}
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

            {requiresFiliation && stepIndex < totalSteps - 1 ? (
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
                disabled={formState.isSubmitting}
                className="btn btn-primary min-h-12 text-lg"
              >
                {formState.isSubmitting
                  ? "Préparation de la personalisation…"
                  : "Personnaliser le document"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
