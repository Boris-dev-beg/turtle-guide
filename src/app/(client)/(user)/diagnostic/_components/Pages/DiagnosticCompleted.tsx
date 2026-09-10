"use client";

import { FolderStatus } from "@/generated/prisma/enums";
import { ArrowRight, FileText, RotateCcw } from "lucide-react";

type DiagnosticCompletedProps = {
  folder: {
    id: string;
    name: string;
    status: FolderStatus;
    createdAt: Date;
  };
  onViewFolder: () => void;
  onRestart: () => void;
};

export function DiagnosticCompleted({
  folder,
  onViewFolder,
  onRestart,
}: DiagnosticCompletedProps) {
  const statusLabel = folder.status === "ENDED" ? "Terminé" : "Clôturé";

  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="mb-6 flex items-start gap-2 md:gap-4">
        <div>
          <h1 className="font-body text-3xl md:text-4xl font-semibold text-brand-ink">
            Un dossier existe déjà
          </h1>

          <p className="mt-1 text-sm md:text-base leading-5 md:leading-6 text-brand-ink-muted">
            Nous avons retrouvé un ancien dossier pour cette démarche. Vous
            pouvez consulter ce dossier ou le supprimer et commencer un nouveau diagnostic.
          </p>
        </div>
      </div>

      {/* Folder details */}
      <div className="turtle-card">
        <div className="flex items-center gap-3 border-b border-border pb-5">
          <div className="flex items-center justify-center">
            <FileText className="size-8 text-brand-green" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-brand-ink">
              {folder.name}
            </p>

            <p className="text-xs text-brand-ink-muted">
              Créé le{" "}
              {new Intl.DateTimeFormat("fr-FR", {
                dateStyle: "medium",
              }).format(new Date(folder.createdAt))}
            </p>
          </div>
        </div>

        {/* Informations */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between gap-6">
            <span className="text-brand-ink font-medium">Statut</span>

            <span className="inline-flex rounded-full bg-brand-green-soft px-3 py-1 text-sm font-medium text-brand-green">
              {statusLabel}
            </span>
          </div>

          <div className="flex items-center justify-between gap-6">
            <span className="text-brand-ink font-medium">Dossier</span>

            <span className="font-mono text-sm text-brand-ink">
              #{folder.id}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onRestart} className="btn btn-outline">
          <RotateCcw className="size-4" />
          Recommencer
        </button>

        <button
          type="button"
          onClick={onViewFolder}
          className="btn btn-primary"
        >
          Voir mon dossier
          <ArrowRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
