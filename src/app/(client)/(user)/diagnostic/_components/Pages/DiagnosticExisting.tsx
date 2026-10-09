"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import DiagnocticLayout from "./DiagnocticLayout";
import { FolderStatus } from "@/generated/prisma/enums";

type DiagnosticExistingProps = {
  folder: {
    id: string;
    name: string;
    status: FolderStatus;
    createdAt: Date;
  };
  onContinue: () => void;
  onChooseAnother: () => void;
  diagnosticComplete: boolean;
  onViewFolder: () => void;
  onRestart: () => void;
  isRestarting: boolean;
};

export function DiagnosticExisting({
  folder,
  onContinue,
  onChooseAnother,
  diagnosticComplete,
  onViewFolder,
  onRestart,
  isRestarting,
}: DiagnosticExistingProps) {
  return (
    <DiagnocticLayout
      folder={folder}
      title={
        diagnosticComplete
          ? "Votre diagnostic est terminé."
          : "Votre dossier a été récupéré."
      }
      description={
        diagnosticComplete
          ? "Vos réponses ont été enregistrées. Vous pouvez consulter votre dossier ou recommencer le diagnostic sans supprimer ce dossier."
          : "Ce dossier est toujours en cours. Vous pouvez reprendre votre diagnostic là où vous vous êtes arrêté ou choisir une autre démarche."
      }
    >
      {/* Action */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        {diagnosticComplete ? (
          <>
            <button
              type="button"
              onClick={onRestart}
              disabled={isRestarting}
              className="btn btn-outline disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw className="size-4" />
              {isRestarting
                ? "Réinitialisation..."
                : "Recommencer le diagnostic"}
            </button>
            <button
              type="button"
              onClick={onViewFolder}
              className="btn btn-primary"
            >
              Voir mon dossier
              <ArrowRight className="size-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onContinue}
            className="btn btn-primary"
          >
            Continuer le diagnostic
            <ArrowRight className="size-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onChooseAnother}
          className="btn btn-outline"
        >
          Choisir une autre démarche
        </button>
      </div>
    </DiagnocticLayout>
  );
}
