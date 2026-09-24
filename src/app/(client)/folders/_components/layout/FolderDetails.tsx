"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Flag,
  Loader2,
  LucideIcon,
  MapPin,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFolder } from "@/hooks/useFolder";
import { FolderDetailsLoading } from "../cards/FoldersLoading";
import { FolderDetailsError } from "../cards/FoldersError";
import { FolderType } from "../../types/types";
import { FolderStatus } from "@/generated/prisma/enums";
import { ProcesSteps } from "../cards/Steps";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useFolderStore } from "@/store/folder.store";

const statusConfig: Record<
  FolderStatus,
  {
    label: string;
    className: string;
  }
> = {
  CREATED: {
    label: "Créé",
    className: "border-brand-info/20 bg-brand-info-bg text-brand-info",
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
    label: "Archivé",
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
      className={`rounded-sm px-3 py-1.5 font-medium text-sm ${config.className}`}
    >
      <span className="size-2 rounded-full bg-current" />
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
  // ! States
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { setCategory, setProcedure } = useFolderStore();
  const { folder, folderIsLoading, folderIsError, folderRefetch, delFolder } =
    useFolder(userId, id);

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
  const currentQuestion = folder.progression?.currentQuestion;
  const answerCount = folder.answers.length;

  // ! Functions

  const openDiagnostic = () => {
    setCategory(folder.procedure.category.name);
    setProcedure(folder.procedure.title);
    router.push("/diagnostic");
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);

      await delFolder.mutateAsync({ id: folder.id, userId });

      toast.success("Dossier supprimé", {
        description: "Votre dossier a été supprimé avec succès.",
      });

      router.push("/folders");
    } catch (error) {
      console.error("Erreur lors de la suppression du dossier:", error);

      toast.error("Impossible de supprimer le dossier", {
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestart = async () => {
    if (delFolder.isPending) return;

    try {
      await delFolder.mutateAsync({ id: folder.id, userId });
      setCategory(folder.procedure.category.name);
      setProcedure(folder.procedure.title);
      toast.success("Un nouveau dossier va être préparé.");
      router.push("/diagnostic");
    } catch (error) {
      toast.error("Impossible de recommencer le dossier", {
        description: "Le dossier existant n'a pas pu être supprimé.",
      });
      console.error("Erreur lors du redémarrage du dossier:", error);
    }
  };

  // ! Render
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
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="text-4xl font-semibold tracking-tight text-brand-ink">
                  {folder.name}
                </h1>

                <FolderStatusBadge status={folder.status} />
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-brand-ink-muted">
                <span className="font-medium text-brand-ink">
                  {folder.procedure.title}
                </span>

                <span aria-hidden="true">•</span>

                <span>{folder.procedure.category.name}</span>

                <span aria-hidden="true">•</span>

                <span>Créé le {formatDate(folder.createdAt)}</span>

                <span>•</span>

                <span>Mis à jour le {formatDate(folder.updatedAt)}</span>
              </div>

              <p className="mt-1 max-w-3xl leading-6 text-brand-ink-muted">
                {folder.procedure.description}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {(folder.status === "CREATED" || folder.status === "PENDING") && (
              <button
                type="button"
                onClick={openDiagnostic}
                className="btn btn-primary min-h-12 text-base"
              >
                <Play className="size-5" />
                {folder.status === "CREATED"
                  ? "Continuer le diagnostic"
                  : "Reprendre la démarche"}
              </button>
            )}
            {(folder.status === "ENDED" || folder.status === "CLOSED") && (
              <button
                type="button"
                onClick={handleRestart}
                disabled={delFolder.isPending}
                className="btn btn-primary min-h-12 text-base"
              >
                <RotateCcw className="size-5" />
                {delFolder.isPending
                  ? "Préparation..."
                  : "Recommencer le dossier"}
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-outline min-h-12 text-base disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Trash2 className="size-5" />
              )}
              {isDeleting ? "Suppression..." : "Supprimer le dossier"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          {/*  Steps */}
          <ProcesSteps process={folder.process} status={folder.status} />

          <ProgressSummary
            answerCount={answerCount}
            currentQuestion={currentQuestion}
            status={folder.status}
          />

          {/* Infos */}
          {folder.process?.steps && <ProcessInfos folder={folder} />}

          <div className="turtle-alert-info border-brand-info/50 w-fit">
            <div>
              <p className="font-semibold text-brand-ink text-lg">
                Bon à savoir
              </p>

              <p className="mt-1 leading-5 text-brand-ink-muted sm:text-sm">
                Vérifiez toujours les informations et les documents demandés
                avant de vous déplacer auprès de l&apos;administration.
              </p>
            </div>
          </div>
        </div>

        <aside className="min-w-0 space-y-5">
          {currentQuestion && (
            <Card className="border-none shadow-none ring-0">
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
                  {currentQuestion.title}
                </h3>

                <p className="mt-1 text-sm leading-5 text-brand-ink-muted">
                  {currentQuestion.description ||
                    "Répondez à cette question pour continuer votre démarche."}
                </p>

                <Button
                  onClick={openDiagnostic}
                  className="btn btn-primary mt-4 w-full justify-between text-base rounded-sm p-5"
                >
                  Continuer le diagnostic
                  <ArrowRight className="size-5" />
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="p-0 border-none shadow-none ring-0">
            <CardHeader className="px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
              <CardTitle className="flex items-center justify-between gap-3 text-base text-brand-ink">
                <h2 className="flex items-center gap-3 text-lg">
                  Documents requis
                </h2>

                <span className="text-base font-medium text-brand-green">
                  {folder.process?.steps.reduce(
                    (total, step) => total + step.documents.length,
                    0,
                  ) ?? 0}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 px-2 pb-5 sm:px-3 sm:pb-6">
              {(() => {
                const documents =
                  folder.process?.steps.flatMap((step) => step.documents) ?? [];

                if (documents.length === 0) {
                  return (
                    <p className="px-3 text-base font-medium text-brand-ink">
                      Aucun document n&apos;est associé à cette démarche.
                    </p>
                  );
                }

                return documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-start gap-3 rounded-sm border border-border p-3"
                  >
                    <div className="flex shrink-0 items-center justify-center">
                      <FileText className="size-8 text-brand-green" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-lg font-medium leading-5 text-brand-ink">
                        {document.name}
                      </p>

                      {document.customizable && (
                        <p className="mt-1 text-sm text-brand-ink-muted">
                          Document personnalisable
                        </p>
                      )}
                    </div>
                  </div>
                ));
              })()}
            </CardContent>
          </Card>

          <div className="border-brand-green/20 border bg-brand-green-soft/40 rounded-sm">
            <CardContent className="p-5">
              <div className="flex gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-brand-green-dark">
                    Besoin d&apos;aide ?
                  </h3>

                  <p className="mt-1 leading-5 text-brand-ink-muted text-base">
                    Consultez notre centre d&apos;aide ou contactez notre équipe
                    si vous avez besoin d&apos;assistance.
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        </aside>
      </div>
    </main>
  );
}

const ProcessInfos = ({ folder }: { folder: FolderType }) => {
  return (
    <div>
      <CardHeader className="px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="text-2xl sm:text-3xl text-brand-ink">
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
          icon={FileText}
          label="Base légale"
          value={folder.procedure.legalBasis}
        />
      </CardContent>
    </div>
  );
};

function ProgressSummary({
  answerCount,
  currentQuestion,
  status,
}: {
  answerCount: number;
  currentQuestion?: {
    title: string;
    description: string | null;
  };
  status: FolderStatus;
}) {
  const isFinished = status === "ENDED" || status === "CLOSED";

  return (
    <section className="border-y border-border px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="font-display text-2xl text-brand-ink">
          Votre progression
        </h2>
        <p className="text-base text-brand-ink-muted">
          {isFinished
            ? "Démarche terminée"
            : `${answerCount} réponse${answerCount > 1 ? "s" : ""} enregistrée${answerCount > 1 ? "s" : ""}`}
        </p>
      </div>

      {currentQuestion && !isFinished ? (
        <div className="mt-4 rounded-sm border border-brand-green/20 bg-brand-green-soft/30 p-4">
          <p className="text-sm font-semibold text-brand-green-dark">
            Question en cours
          </p>
          <p className="mt-1 text-lg font-semibold text-brand-ink">
            {currentQuestion.title}
          </p>
          {currentQuestion.description && (
            <p className="mt-1 leading-6 text-brand-ink-muted">
              {currentQuestion.description}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-3 leading-6 text-brand-ink-muted">
          {isFinished
            ? "Toutes les informations disponibles pour cette démarche sont présentées ci-dessous."
            : "Votre prochaine question apparaîtra ici lorsque le diagnostic sera commencé."}
        </p>
      )}
    </section>
  );
}

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
      <div className="flex size-12 shrink-0 items-center justify-center">
        <Icon className="size-8 text-brand-green" />
      </div>

      <div className="min-w-0 leading-4">
        <p className="text-brand-ink-muted">{label}</p>

        <p className="mt-0.5 wrap-break-word text-lg font-medium text-brand-ink leading-6">
          {value}
        </p>
      </div>
    </div>
  );
}
