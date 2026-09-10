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
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-12 text-center">
      {/* Icon */}
      <div className="mb-5 flex size-18 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-14 text-destructive" />
      </div>

      {/* Message */}
      <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">
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
        <RefreshCw
          className={`size-5 ${isRetrying ? "animate-spin" : ""}`}
        />

        {isRetrying ? "Nouvelle tentative..." : "Réessayer"}
      </button>
    </section>
  );
}