"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitFraudAlert } from "@/lib/fraud-alerts";
import { type FraudAlertInput, fraudAlertSchema } from "../_schema/fraudReport.schema";

type StepOption = { id: string; title: string; process: { title: string } };

export default function FraudReportForm({
  steps,
  initialStepId,
}: {
  steps: StepOption[];
  initialStepId?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<FraudAlertInput>({
    resolver: zodResolver(fraudAlertSchema),
    defaultValues: {
      stepId: steps.some((step) => step.id === initialStepId)
        ? initialStepId
        : "",
      title: "",
      description: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await submitFraudAlert(values);
      setSubmitted(true);
      form.reset({ stepId: values.stepId, title: "", description: "" });
    } catch {
      form.setError("root", {
        message:
          "Le signalement n’a pas pu être enregistré. Réessayez dans un instant.",
      });
    }
  });

  if (submitted)
    return (
      <div role="status" className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-brand-ink">
          Signalement transmis
        </h2>
        <p className="text-base leading-7 text-brand-ink-muted">
          Merci de nous avoir informés. Votre signalement a été ajouté à l’étape
          choisie.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn btn-outline min-h-12"
        >
          Faire un autre signalement
        </button>
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <label
        className="block text-base font-medium text-brand-ink"
        htmlFor="stepId"
      >
        Étape de la démarche concernée
        <select
          id="stepId"
          {...form.register("stepId")}
          aria-invalid={!!form.formState.errors.stepId}
          aria-describedby={
            form.formState.errors.stepId ? "stepId-error" : undefined
          }
          className="mt-2 min-h-12 w-full rounded-sm border border-input bg-background px-3 text-base"
        >
          <option value="">Sélectionnez une étape</option>
          {steps.map((step) => (
            <option key={step.id} value={step.id}>
              {step.process.title} — {step.title}
            </option>
          ))}
        </select>
        {form.formState.errors.stepId && (
          <span
            id="stepId-error"
            className="mt-1 block text-sm text-destructive"
          >
            {form.formState.errors.stepId.message}
          </span>
        )}
      </label>

      <label
        className="block text-base font-medium text-brand-ink"
        htmlFor="title"
      >
        Titre du signalement
        <input
          id="title"
          {...form.register("title")}
          maxLength={120}
          aria-invalid={!!form.formState.errors.title}
          aria-describedby={
            form.formState.errors.title ? "title-error" : undefined
          }
          placeholder="Ex. Demande de frais non officiels"
          className="mt-2 min-h-12 w-full rounded-sm border border-input bg-background px-3 text-base"
        />
        {form.formState.errors.title && (
          <span
            id="title-error"
            className="mt-1 block text-sm text-destructive"
          >
            {form.formState.errors.title.message}
          </span>
        )}
      </label>

      <label
        className="block text-base font-medium text-brand-ink"
        htmlFor="description"
      >
        Que s’est-il passé ?
        <textarea
          id="description"
          {...form.register("description")}
          rows={5}
          maxLength={3000}
          aria-invalid={!!form.formState.errors.description}
          aria-describedby={
            form.formState.errors.description
              ? "description-error"
              : "description-help"
          }
          placeholder="Décrivez les faits, le lieu ou le mode de contact. Évitez les informations personnelles."
          className="mt-2 w-full resize-y rounded-sm border border-input bg-background px-3 py-2.5 text-base leading-6"
        />
        <span
          id="description-help"
          className="mt-1 block text-sm font-normal text-brand-ink-muted"
        >
          20 à 3 000 caractères.
        </span>
        {form.formState.errors.description && (
          <span
            id="description-error"
            className="mt-1 block text-sm text-destructive"
          >
            {form.formState.errors.description.message}
          </span>
        )}
      </label>

      {form.formState.errors.root && (
        <p role="alert" className="text-sm text-destructive">
          {form.formState.errors.root.message}
        </p>
      )}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="btn btn-primary min-h-12 w-full justify-center sm:w-auto"
      >
        {form.formState.isSubmitting
          ? "Envoi du signalement…"
          : "Envoyer le signalement"}
      </button>
    </form>
  );
}
