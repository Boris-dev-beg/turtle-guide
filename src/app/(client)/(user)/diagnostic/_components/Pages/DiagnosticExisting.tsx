"use client";

import { ArrowRight } from "lucide-react";
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
};

export function DiagnosticExisting({
  folder,
  onContinue,
  onChooseAnother,
}: DiagnosticExistingProps) {
  return (
    <DiagnocticLayout
      folder={folder}
      title="Votre dossier a été récupéré."
      description="Ce dossier est toujours en cours. Vous pouvez reprendre votre diagnostic là où vous vous êtes arrêté ou choisir une autre démarche."
    >
      {/* Action */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onContinue} className="btn btn-primary">
          Continuer le diagnostic
          <ArrowRight className="size-4" />
        </button>
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
