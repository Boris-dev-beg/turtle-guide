"use client";

import { useSteps } from "@/hooks/useSteps";
import FraudReportForm from "./FraudReportForm";

export const FrautAlert = ({ stepId }: { stepId: string | undefined }) => {
  const steps = useSteps().AllSteps || [];

  return (
    <div className="rounded-sm border border-border bg-card p-5 sm:p-8">
      {steps.length ? (
        <FraudReportForm steps={steps} initialStepId={stepId} />
      ) : (
        <p className="text-base text-brand-ink-muted">
          Aucune étape n’est disponible pour le moment.
        </p>
      )}
    </div>
  );
};
