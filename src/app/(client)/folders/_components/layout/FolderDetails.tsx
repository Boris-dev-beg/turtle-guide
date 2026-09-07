"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  Flag,
  Info,
  LucideIcon,
  MapPin,
  Play,
  RefreshCcw,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFolder } from "@/hooks/useFolder";
import { FolderDetailsLoading } from "../cards/FoldersLoading";
import { FolderDetailsError } from "../cards/FoldersError";
import { FolderType, Step } from "../../types/types";
import { FolderStatus } from "@/generated/prisma/enums";
import { ProcesSteps } from "../cards/Steps";

const statusConfig: Record<
  FolderStatus,
  {
    label: string;
    className: string;
  }
> = {
  CREATED: {
    label: "Créé",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },

  PENDING: {
    label: "En cours",
    className:
      "border-brand-green/20 bg-brand-green-soft text-brand-green-dark",
  },

  ENDED: {
    label: "Terminé",
    className:
      "border-brand-green/20 bg-brand-green-soft text-brand-green-dark",
  },

  CLOSED: {
    label: "Fermé",
    className: "border-border bg-muted text-brand-ink-muted",
  },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function FolderStatusBadge({ status }: { status: FolderStatus }) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={`rounded-full p-3 font-medium text-sm ${config.className}`}
    >
      <span className="mr-1.5 size-2 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}

export default function FolderDetailsPage({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const { folder, folderIsLoading, folderIsError, folderRefetch } = useFolder(
    userId,
    id,
  );

  // ! Loading
  if (folderIsLoading) {
    return <FolderDetailsLoading />;
  }

  // ! Error
  if (folderIsError) {
    return <FolderDetailsError onRetry={folderRefetch} />;
  }

  // ! Folder introuvable
  if (!folder) {
    return <FolderDetailsError />;
  }
  const currentStep = folder.process?.steps[1];

  return (
    <main className="wrapper w-full py-6 sm:py-8 lg:py-10">
      <div className="mb-6">
        <Link
          href="/folders"
          className="mb-5 inline-flex items-center gap-2 font-medium text-brand-green transition-colors hover:text-brand-green-dark hover:underline"
        >
          <ArrowLeft className="size-5" />
          Retour à la liste
        </Link>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="hidden size-16 shrink-0 items-center justify-center rounded-full bg-brand-green-soft sm:flex">
              <FileText className="size-8 text-brand-green" />
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
                  {folder.name}
                </h1>

                <FolderStatusBadge status={folder.status} />
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-brand-ink-muted">
                <span>Créé le {formatDate(folder.createdAt)}</span>

                <span>•</span>

                <span>Mis à jour le {formatDate(folder.updatedAt)}</span>
              </div>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-ink-muted sm:text-base">
                {folder.procedure.description}
              </p>
            </div>
          </div>

          {/* Actions */}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className="w-full shrink-0 justify-between rounded-sm sm:w-auto text-base"
              >
                Actions
                <ChevronDown className="size-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 *:text-base">
              {folder.status === "PENDING" && (
                <DropdownMenuItem className="gap-2">
                  <RefreshCcw className="size-5" />
                  Reprendre la démarche
                </DropdownMenuItem>
              )}

              {folder.status === "CREATED" && (
                <DropdownMenuItem className="gap-2">
                  <Play className="size-5" />
                  Continuer le diagnostic
                </DropdownMenuItem>
              )}

              <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive font-medium">
                <Trash2 className="size-5" />
                Supprimer le dossier
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          {/*  Steps */}
          <ProcesSteps process={folder.process} currentStep={currentStep} />

          {/* Infos */}
          <ProcessInfos folder={folder} currentStep={currentStep} />

          <div className="turtle-alert-info w-fit">
            <Info className="size-7 shrink-0 text-brand-info" />

            <div>
              <p className="font-semibold text-brand-ink">Bon à savoir</p>

              <p className="mt-1 text-sm leading-5 text-brand-ink-muted sm:text-sm">
                Vérifiez toujours les informations et les documents demandés
                avant de vous déplacer auprès de l&apos;administration.
              </p>
            </div>
          </div>
        </div>

        <aside className="min-w-0 space-y-5">
          {currentStep && (
            <Card className="turtle-card">
              <CardHeader className="px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
                <CardTitle className="flex items-center gap-3 text-lg text-brand-ink">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-green-soft">
                    <Play className="size-6 text-brand-green" />
                  </span>
                  Prochaine étape
                </CardTitle>
              </CardHeader>

              <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
                <h3 className="text-base font-semibold text-brand-ink">
                  {currentStep.title}
                </h3>

                <p className="mt-1 text-sm leading-5 text-brand-ink-muted">
                  {currentStep.description}
                </p>

                <Button className="btn btn-primary mt-4 w-full justify-between text-base rounded-sm p-5">
                  Voir les détails
                  <ArrowRight className="size-5" />
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="turtle-card">
            <CardHeader className="px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
              <CardTitle className="flex items-center justify-between gap-3 text-base text-brand-ink">
                <span className="flex items-center gap-3 text-lg">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-green-soft">
                    <FileText className="size-6 text-brand-green" />
                  </span>
                  Documents requis
                </span>

                <span className="text-sm font-medium text-brand-green">
                  {folder.process?.steps.reduce(
                    (total, step) => total + step.documents.length,
                    0,
                  ) ?? 0}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 px-2 pb-5 sm:px-3 sm:pb-6">
              {folder?.process?.steps
                .flatMap((step) => step.documents)
                .map((document) => (
                  <div
                    key={document.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-brand-green bg-brand-green">
                      <Check className="size-5 text-white" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-base font-medium leading-5 text-brand-ink">
                        {document.name}
                      </p>

                      <p className="mt-0.5 text-sm text-brand-ink-muted">
                        {document.price.toString()}
                      </p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card className="border-brand-green/20 bg-brand-green-soft/40 shadow-none">
            <CardContent className="p-5">
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card">
                  <Info className="size-6 text-brand-green" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-brand-green-dark">
                    Besoin d&apos;aide ?
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-brand-ink-muted">
                    Consultez notre centre d&apos;aide ou contactez notre équipe
                    si vous avez besoin d&apos;assistance.
                  </p>

                  <Button
                    variant="outline"
                    className="mt-3 h-9 rounded-sm border-brand-green/30 bg-card text-sm text-brand-green hover:bg-brand-green-soft"
                  >
                    Voir l&apos;aide et le support
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}



const ProcessInfos = ({
  folder,
  currentStep,
}: {
  folder: FolderType;
  currentStep?: Step;
}) => {
  return (
    <Card className="turtle-card">
      <CardHeader className="px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="text-xl sm:text-2xl text-brand-ink">
          Informations sur la démarche
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-5 px-5 pb-5 sm:grid-cols-2 sm:px-6 sm:pb-6">
        <InfoItem
          icon={FileText}
          label="Procédure"
          value={folder.procedure.title}
        />

        <InfoItem
          icon={Flag}
          label="Catégorie"
          value={folder.procedure.category.name}
        />

        {folder.process && (
          <InfoItem
            icon={ArrowRight}
            label="Processus"
            value={folder.process.title}
          />
        )}

        {folder.location && (
          <InfoItem
            icon={MapPin}
            label="Lieu"
            value={[folder.location.city, folder.location.address]
              .filter(Boolean)
              .join(", ")}
          />
        )}

        <InfoItem
          icon={CalendarDays}
          label="Démarré le"
          value={formatDate(folder.createdAt)}
        />

        <InfoItem
          icon={Clock3}
          label="Dernière activité"
          value={formatDate(folder.updatedAt)}
        />

        <InfoItem
          icon={Building2}
          label="Administration compétente"
          value={
            currentStep?.administrativeBody?.name ??
            "Voir les étapes de la démarche"
          }
        />

        <InfoItem
          icon={FileText}
          label="Base légale"
          value={folder.procedure.legalBasis}
        />
      </CardContent>
    </Card>
  );
};

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-green-soft">
        <Icon className="size-5 text-brand-green" />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-brand-ink-muted">{label}</p>

        <p className="mt-0.5 wrap-break-word text-base font-medium text-brand-ink">
          {value}
        </p>
      </div>
    </div>
  );
}
