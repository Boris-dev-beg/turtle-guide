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
};

export function DiagnosticExisting({
  folder,
  onContinue,
}: DiagnosticExistingProps) {
  return (
    <DiagnocticLayout
      folder={folder}
      title="Votre diagnostic est en cours"
      description="Nous avons retrouvé un dossier existant. Vous pouvez reprendre votre diagnostic là où vous vous êtes arrêté."
    >
      {/* Action */}
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={onContinue} className="btn btn-primary">
          Continuer le diagnostic
          <ArrowRight className="size-4" />
        </button>
      </div>
    </DiagnocticLayout>
  );
}
