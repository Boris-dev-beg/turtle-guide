import { Button } from "@/components/ui/button";
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
import { FolderType } from "../../types/types";
import { Badge } from "@/components/ui/badge";
import { FolderStatus } from "@/generated/prisma/enums";
import Link from "next/link";

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
    label: "Commencer",
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
    label: "Fermé",
    className: "border-border bg-muted text-muted-foreground",
    icon: FolderOpen,
  },
};

function FolderStatusBadge({ status }: { status: FolderStatus }) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold ${config.className} h-6`}
    >
      {config.label}
    </Badge>
  );
}

export function FolderCard({ folder }: { folder: FolderType }) {
  const isFinished = folder.status === "ENDED" || folder.status === "CLOSED";

  const actionLabel =
    folder.status === "CREATED" ? "Reprendre la démarche" : "Voir le dossier";

  return (
    <Link href={`/folders/${folder.id}`}>
      <Card className="group rounded-sm border-border bg-card shadow-none transition-all hover:border-brand-green-light/40 hover:shadow-sm">
        <CardContent className="p-3">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Folder's Information */}
            <div className="flex min-w-0 gap-4">
              <div className="hidden sm:flex size-15 shrink-0 items-center justify-center rounded-full bg-brand-green-soft text-brand-green">
                <BriefcaseBusiness className="size-9" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-2xl font-semibold text-brand-ink">
                    {folder.name}
                  </h2>

                  <FolderStatusBadge status={folder.status} />
                </div>

                <p className="max-sm:mt-1 text-base text-brand-ink-muted">
                  {folder.procedure.title}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-brand-ink-muted leading-5">
                  <span>Créé le {formatDateTime(folder.createdAt)}</span>

                  <span aria-hidden="true" className="hidden sm:inline">
                    •
                  </span>

                  <span>Mis à jour le {formatDateTime(folder.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <Button
              variant="outline"
              className="shrink-0 gap-2 btn bg-card text-base font-semibold hover:border-brand-green-light/10 hover:bg-brand-green-soft/20 py-5 px-3 cursor-pointer"
            >
              {actionLabel}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>

          {isFinished && (
            <div className="mt-5 border-t border-border pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-ink-muted">Démarche terminée</span>

                <span className="font-semibold text-brand-green-text">
                  100%
                </span>
              </div>

              <div className="mt-2 turtle-progress-track">
                <div
                  className="turtle-progress-fill"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function EmptyFolders() {
  return (
    <div className="flex min-h-90 flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-12 text-center">
      <div className="mb-5 flex size-18 items-center justify-center rounded-full bg-brand-green-soft">
        <FolderPlus className="size-10 text-brand-green" strokeWidth={1.8} />
      </div>

      <h2 className="font-heading text-3xl font-semibold text-brand-ink">
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
