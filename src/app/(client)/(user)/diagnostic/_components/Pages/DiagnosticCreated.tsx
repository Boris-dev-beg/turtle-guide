"use client";

import { CheckCircle2, FileText, ArrowRight } from "lucide-react";

type DiagnosticCreatedProps = {
  folder: {
    id: string;
    name: string;
    createdAt: Date;
  };
  onStart: () => void;
};

export function DiagnosticCreated({
  folder,
  onStart,
}: DiagnosticCreatedProps) {
  return (
    <section className="mx-auto w-full max-w-2xl">
      {/* Confirmation */}
      <div className="mb-6 flex items-start gap-4">

        <div>
          <h1 className="font-body text-2xl font-semibold text-brand-ink">
            Votre dossier a été créé
          </h1>

          <p className="mt-1 text-sm leading-6 text-brand-ink-muted">
            Votre dossier est prêt. Vous pouvez maintenant commencer le
            diagnostic pour déterminer les démarches à suivre.
          </p>
        </div>
      </div>

      {/* Dossier */}
      <div className="turtle-card">
        <div className="flex items-center gap-3 border-b border-border pb-5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-brand-green-soft">
            <FileText className="size-5 text-brand-green" />
          </div>

          <div>
            <p className="text-sm font-medium text-brand-ink">
              {folder.name}
            </p>

            <p className="text-xs text-brand-ink-muted">
              Dossier créé le{" "}
              {new Intl.DateTimeFormat("fr-FR", {
                dateStyle: "medium",
              }).format(new Date(folder.createdAt))}
            </p>
          </div>
        </div>

        {/* Informations */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between gap-6">
            <span className="text-sm text-brand-ink-muted">
              Statut
            </span>

            <span className="inline-flex rounded-full bg-brand-green-soft px-3 py-1 text-xs font-medium text-brand-green">
              Nouveau
            </span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <span className="text-sm text-brand-ink-muted">
              Dossier
            </span>

            <span className="font-mono text-xs text-brand-ink">
              #{folder.id}
            </span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onStart}
          className="btn btn-primary"
        >
          Commencer le diagnostic
          <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
}