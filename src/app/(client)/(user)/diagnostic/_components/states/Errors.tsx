"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

type DiagnosticErrorProps = {
  onRetry: () => void;
  isRetrying?: boolean;
};

export function DiagnosticError({
  onRetry,
  isRetrying = false,
}: DiagnosticErrorProps) {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center rounded-sm border border-border border-l-4 border-l-brand-danger bg-card px-4 py-12 text-center">
      {/* Icon */}
      <div className="mb-5 flex size-14 items-center justify-center rounded-sm bg-brand-danger-bg">
        <AlertCircle className="size-8 text-destructive" />
      </div>

      {/* Message */}
      <h1 className="font-display text-2xl font-semibold text-brand-ink sm:text-3xl">
        Impossible de préparer votre dossier
      </h1>

      <p className="mt-2 max-w-lg max-md:text-sm leading-6 text-muted-foreground">
        Nous n’avons pas pu récupérer ou créer votre dossier pour le moment.
        Vous pouvez réessayer.
      </p>

      {/* Action */}
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="btn btn-primary mt-6"
      >
        <RefreshCw className={`size-5 ${isRetrying ? "animate-spin" : ""}`} />

        {isRetrying ? "Nouvelle tentative..." : "Réessayer"}
      </button>
    </section>
  );
}
