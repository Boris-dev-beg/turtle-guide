"use client";

import { FolderStatus } from "@/generated/prisma/enums";
import { ArrowRight } from "lucide-react";
import DiagnocticLayout from "./DiagnocticLayout";

type DiagnosticCreatedProps = {
  folder: {
    id: string;
    name: string;
    status: FolderStatus;
    createdAt: Date;
  };
  onStart: () => void;
};

export function DiagnosticCreated({ folder, onStart }: DiagnosticCreatedProps) {
  return (
    <DiagnocticLayout
      folder={folder}
      title="Votre dossier a été créé"
      description="Votre dossier est prêt. Vous pouvez maintenant commencer le diagnostic pour déterminer les démarches à suivre."
    >
      {/* Action */}
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={onStart} className="btn btn-primary">
          Commencer le diagnostic
          <ArrowRight className="size-4" />
        </button>
      </div>
    </DiagnocticLayout>
  );
}
