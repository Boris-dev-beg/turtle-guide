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
};

export function DiagnosticCompleted({
  folder,
  onViewFolder,
  onRestart,
}: DiagnosticCompletedProps) {
  return (
    <DiagnocticLayout
      folder={folder}
      title="Un dossier existe déjà"
      description="Nous avons retrouvé un ancien dossier pour cette démarche. Vous pouvez consulter ce dossier ou le supprimer et commencer un nouveau diagnostic."
    >
      {/* Action */}
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
    </DiagnocticLayout>
  );
}
