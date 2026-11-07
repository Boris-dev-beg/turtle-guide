import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { RenderField } from "../common/Fields";
import { PersonalizationFormValues } from "../../_schema/personalization.schema";
import { PersanalizeFormTypeProps } from "../../_types/types";

export default function PersonalizationForm({
  customizationOpen,
  handleCustomizationDialogChange,
  stepIndex,
  totalSteps,
  currentStepFields,
  handleCustomize,
  nextStep,
  previousStep,
  setCustomizationOpen,
  personalizationForm,
}: PersanalizeFormTypeProps) {
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

              return (
                <RenderField
                  key={fieldName}
                  name={fieldName}
                  label={fieldConfig.label}
                  type={fieldConfig.type}
                  error={
                    personalizationForm.formState.errors[fieldName]?.message
                  }
                  register={personalizationForm.register(fieldName)}
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
