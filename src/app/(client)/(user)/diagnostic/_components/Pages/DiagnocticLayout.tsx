import { FolderStatus } from "@/generated/prisma/enums";
import { FileText } from "lucide-react";
import React from "react";

type Folder = {
  folder: {
    id: string;
    name: string;
    status: FolderStatus;
    createdAt: Date;
  };
};

const DicFolder = {
  CREATED: "Nouveau",
  PENDING: "En cours",
  ENDED: "Terminé",
  CLOSED: "Clôturé",
};
export default function DiagnocticLayout({
  folder,
  children,
  title,
  description,
}: Folder & { children: React.ReactNode; title: string; description: string }) {
  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="mb-6 flex items-start gap-2 md:gap-4">
        <div>
          <h1 className="font-body text-3xl md:text-4xl font-semibold text-brand-ink">
            {title}
          </h1>

          <p className="mt-1 text-sm md:text-base leading-5 md:leading-6 text-brand-ink-muted">
            {description}
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
            <span className="text-brand-ink font-medium">Nom</span>

            <span className="font-semibold text-base text-brand-ink">
              {folder.name}
            </span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-brand-ink font-medium">Statut</span>

            <span className="inline-flex rounded-full bg-brand-green-soft px-3 py-1 text-sm font-medium text-brand-green">
              {DicFolder[folder.status]}
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
      {children}
    </section>
  );
}
