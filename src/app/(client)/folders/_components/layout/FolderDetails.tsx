"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFolder } from "@/hooks/useFolder";
import { FolderDetailsLoading } from "../cards/FoldersLoading";
import { FolderDetailsError } from "../cards/FoldersError";
import { ProcesSteps } from "../cards/Steps";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useFolderStore } from "@/store/folder.store";
import ConfirmDelete from "../cards/ConfirmDelete";
import { DiagnosticAnswers } from "../cards/DiagnosticAnswers";
import { FolderStatusBadge, formatDate } from "../utils/functions/functions";
import FolderInfos from "../sections/FolderInfos";
import { GreatToKnow, HelpBox } from "../cards/SimpleCard";
import ProgressSummary from "../sections/ProgressSummary";

export default function FolderDetailsPage({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  // ! STATES
  const router = useRouter();

  const [wantToDelete, setWantToDelete] = useState(false);
  const [wantToSeeDetails, setWantToSeeDetails] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { setCategory, setProcedure } = useFolderStore();
  const {
    folder,
    folderIsLoading,
    folderIsError,
    folderRefetch,
    delFolder,
    restartDiagnostic,
  } = useFolder(userId, id);

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

  // ! FUNCTIONS

  const openDiagnostic = () => {
    setCategory(folder.procedure.category.name);
    setProcedure(folder.procedure.title);
    router.push("/diagnostic");
  };

  // ? Restart Folder
  const handleRestartDiagnostic = async () => {
    try {
      await restartDiagnostic.mutateAsync(folder.id);
      setCategory(folder.procedure.category.name);
      setProcedure(folder.procedure.title);
      toast.success("Diagnostic réinitialisé", {
        description: "Vous pouvez recommencer depuis la première question.",
      });
      router.push("/diagnostic?restart=1");
    } catch (error) {
      toast.error("Impossible de recommencer le diagnostic", {
        description: "Vos réponses et votre dossier n'ont pas été modifiés.",
      });
      console.error("Erreur lors de la réinitialisation du diagnostic:", error);
    }
  };

  // ! Delete folder
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

  // ! RENDER
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
                {folder.process?.description}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto">
            {(folder.status === "CREATED" || folder.status === "PENDING") &&
              !folder.processId && (
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
            {(folder.processId ||
              folder.status === "ENDED" ||
              folder.status === "CLOSED") && (
              <button
                type="button"
                onClick={handleRestartDiagnostic}
                disabled={restartDiagnostic.isPending}
                className="btn btn-primary min-h-12 text-base"
              >
                <RotateCcw className="size-5" />
                {restartDiagnostic.isPending
                  ? "Réinitialisation..."
                  : "Recommencer le diagnostic"}
              </button>
            )}
            <button
              type="button"
              onClick={setWantToDelete.bind(null, true)}
              disabled={wantToDelete}
              className="btn btn-destructive min-h-12 text-base disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="size-5" />
              Supprimer le dossier
            </button>
          </div>
        </div>
      </div>

      {wantToDelete && (
        <ConfirmDelete
          isDeleting={isDeleting}
          handleDelete={handleDelete}
          setIsDeleting={setIsDeleting}
          setWantToDelete={setWantToDelete}
        />
      )}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          {/*  Steps */}
          <ProcesSteps
            process={folder.process}
            status={folder.status}
            folderLocationId={folder.locationId}
            diagnosticComplete={Boolean(folder.processId)}
            onResumeDiagnostic={openDiagnostic}
          />

          <ProgressSummary
            answerCount={answerCount}
            currentQuestion={currentQuestion}
            status={folder.status}
            diagnosticComplete={Boolean(folder.processId)}
            setShowAnswers={setShowAnswers}
            showAnswers={showAnswers}
          />

          {showAnswers && <DiagnosticAnswers answers={folder.answers} />}
          {/* Infos */}
          <div className="flex items-center justify-between rounded-sm border border-border bg-card p-5">
            <h2 className="text-lg font-semibold text-brand-ink">
              Informations sur la démarche
            </h2>

            <Button
              variant="outline"
              size="lg"
              onClick={setWantToSeeDetails.bind(null, true)}
            >
              Voir les détails
            </Button>
          </div>

          {folder.process?.steps && wantToSeeDetails && (
            <FolderInfos
              folder={folder}
              setWantToSeeDetails={setWantToSeeDetails}
            />
          )}

          <GreatToKnow />
        </div>

        <aside className="min-w-0 space-y-5">
          {currentQuestion && !folder.processId && (
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

          <HelpBox />
        </aside>
      </div>
    </main>
  );
}
