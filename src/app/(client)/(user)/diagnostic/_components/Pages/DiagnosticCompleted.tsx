"use client";

import { FolderStatus } from "@/generated/prisma/enums";
import { ArrowRight, RotateCcw } from "lucide-react";
import DiagnocticLayout from "./DiagnocticLayout";

type DiagnosticCompletedProps = {
  folder: {
    id: string;
    name: string;
    status: FolderStatus;
    createdAt: Date;
  };
  onViewFolder: () => void;
  onRestart: () => void;
  isRestarting?: boolean;
};

export function DiagnosticCompleted({
  folder,
  onViewFolder,
  onRestart,
  isRestarting = false,
}: DiagnosticCompletedProps) {
  return (
    <DiagnocticLayout
      folder={folder}
      title="Votre dossier a déjà été terminé ou archivé."
      description="Ce dossier ne peut plus être repris. Vous pouvez consulter son contenu ou recommencer cette démarche avec un nouveau dossier."
    >
      {/* Action */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onRestart}
          disabled={isRestarting}
          className="btn btn-outline disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RotateCcw className="size-4" />
          {isRestarting ? "Préparation..." : "Recommencer le dossier"}
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
    </DiagnocticLayout>
  );
}
