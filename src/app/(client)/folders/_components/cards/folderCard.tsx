import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  FolderOpen,
  FolderPlus,
  Plus,
} from "lucide-react";
import { FolderListType } from "../../types/types";
import { Badge } from "@/components/ui/badge";
import { FolderStatus } from "@/generated/prisma/enums";
import Link from "next/link";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const statusConfig: Record<
  FolderStatus,
  {
    label: string;
    className: string;
    icon: typeof Clock3;
  }
> = {
  CREATED: {
    label: "Créé",
    className: "border-brand-info/20 bg-brand-info-bg text-brand-info",
    icon: FileText,
  },

  PENDING: {
    label: "En cours",
    className:
      "border-brand-green/20 bg-brand-green-soft text-brand-green-dark",
    icon: Clock3,
  },

  ENDED: {
    label: "Terminé",
    className:
      "border-brand-green/20 bg-brand-green-soft text-brand-green-dark",
    icon: CheckCircle2,
  },

  CLOSED: {
    label: "Archivé",
    className: "border-border bg-muted text-muted-foreground",
    icon: FolderOpen,
  },
};

function FolderStatusBadge({ status }: { status: FolderStatus }) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 rounded-sm px-2.5 py-1 text-sm font-semibold ${config.className} h-8`}
    >
      {config.label}
    </Badge>
  );
}

export function FolderCard({ folder }: { folder: FolderListType }) {
  const actionLabel =
    folder.status === "CREATED"
      ? "Continuer le diagnostic"
      : folder.status === "PENDING"
        ? "Consulter le dossier"
        : "Voir le dossier";

  return (
    <Link href={`/folders/${folder.id}`}>
      <Card className="group relative rounded-sm border-border border-l-4 border-l-brand-yellow bg-card shadow-none transition-colors hover:border-brand-green-light/40">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Folder's Information */}
            <div className="flex min-w-0 gap-4">
              <div className="hidden sm:flex size-12 shrink-0 items-center justify-center rounded-sm bg-brand-yellow-bg text-brand-ink">
                <BriefcaseBusiness className="size-6" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold text-brand-ink">
                    {folder.name}
                  </h2>

                  <FolderStatusBadge status={folder.status} />
                </div>

                <p className="max-sm:mt-1 text-base text-brand-ink-muted">
                  {folder.procedure.title}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-brand-ink-muted leading-5">
                  <span>Mis à jour le {formatDate(folder.updatedAt)}</span>

                  <span aria-hidden="true" className="hidden sm:inline">
                    •
                  </span>

                  <span>{folder.procedure.category.name}</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <span className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-sm border border-brand-green px-3 text-base font-semibold text-brand-green transition-colors group-hover:bg-brand-green group-hover:text-primary-foreground">
              {actionLabel}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function EmptyFolders() {
  return (
    <div className="flex min-h-90 flex-col items-center justify-center rounded-sm border border-border border-l-4 border-l-brand-yellow bg-card px-6 py-12 text-center">
      <div className="mb-5 flex size-14 items-center justify-center rounded-sm bg-brand-yellow-bg">
        <FolderPlus className="size-8 text-brand-ink" strokeWidth={1.8} />
      </div>

      <h2 className="font-display text-3xl font-semibold text-brand-ink">
        Aucun dossier pour le moment
      </h2>

      <p className="mt-2 max-w-md leading-6 text-brand-ink-muted">
        Vous n&apos;avez pas encore de dossier. Commencez une démarche pour
        créer votre premier dossier.
      </p>

      <Link href="/categories" className="btn btn-primary text-base mt-6">
        Créer un dossier
        <Plus className="size-5" />
      </Link>
    </div>
  );
}
