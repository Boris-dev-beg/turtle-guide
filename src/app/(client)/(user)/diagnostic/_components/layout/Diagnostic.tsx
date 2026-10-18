"use client";

import { QuestionsSide } from "../Questions/questionSide";
import { useFolderStore } from "@/store/folder.store";
import { DiagnosticLoading } from "../states/Loaders";
import { useFolder } from "@/hooks/useFolder";
import { DiagnosticError } from "../states/Errors";
import { DiagnosticCreated } from "../Pages/DiagnosticCreated";
import { DiagnosticExisting } from "../Pages/DiagnosticExisting";
import { DiagnosticCompleted } from "../Pages/DiagnosticCompleted";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { toast } from "sonner";

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
};

export default function Diagnostic({ user }: { user: User }) {
  // ! states
  const router = useRouter();
  const { procedure, category } = useFolderStore();
  const searchParams = useSearchParams();
  const [showQuestions, setShowQuestions] = useState(false);
  const initializedSelection = useRef("");

  const { useCreateOrGetFolder, restartDiagnostic } = useFolder(user.id);

  // ! Functions
  // ? Initialisation of the folder
  const folderInitialization = useCreateOrGetFolder({
    procedureName: procedure,
    category,
  });
  const { data: result, isPending, isError, error } = folderInitialization;

  const selectionKey = `${user.id}:${category}:${procedure}`;

  useEffect(() => {
    if (
      !user.id ||
      !category ||
      !procedure ||
      initializedSelection.current === selectionKey
    ) {
      return;
    }

    initializedSelection.current = selectionKey;
    folderInitialization.mutate();
  }, [category, folderInitialization, procedure, selectionKey, user.id]);

  // ? Restart existing folder
  const handleRestartDiagnostic = async (folderId: string) => {
    try {
      await restartDiagnostic.mutateAsync(folderId);
      toast.success("Diagnostic réinitialisé", {
        description: "Vous recommencez avec la première question.",
      });
      setShowQuestions(true);
    } catch (error) {
      toast.error("Impossible de recommencer le diagnostic", {
        description: "Le dossier et ses réponses n'ont pas été modifiés.",
      });
      console.error("Erreur lors de la réinitialisation du diagnostic:", error);
    }
  };

  // MODIFIÉ - Le paramètre de redémarrage ouvre les questions directement après reset depuis le détail.
  if (
    result?.folder &&
    (showQuestions || searchParams.get("restart") === "1")
  ) {
    return <QuestionsSide userId={user.id} folderId={result.folder.id} />;
  }

  // ? Loading
  if (isPending) return <DiagnosticLoading />;

  // ? Error
  if (isError || error)
    return (
      <DiagnosticError
        onRetry={() => {
          initializedSelection.current = "";
          folderInitialization.reset();
          folderInitialization.mutate();
        }}
        isRetrying={folderInitialization.isPending}
      />
    );

  // ? Everything is OK
  if (result?.status === "CREATED") {
    return (
      <DiagnosticCreated
        folder={result.folder}
        onStart={() => setShowQuestions(true)}
      />
    );
  }

  if (result?.status === "EXISTING_ACTIVE") {
    if (result.folder.processId) {
      return (
        <DiagnosticExisting
          folder={result.folder}
          diagnosticComplete
          onContinue={() => setShowQuestions(true)}
          onChooseAnother={() => router.push("/categories")}
          onViewFolder={() => router.push(`/folders/${result.folder.id}`)}
          onRestart={() => handleRestartDiagnostic(result.folder.id)}
          isRestarting={restartDiagnostic.isPending}
        />
      );
    }

    return (
      <DiagnosticExisting
        folder={result.folder}
        diagnosticComplete={false}
        onContinue={() => setShowQuestions(true)}
        onChooseAnother={() => router.push("/categories")}
        onViewFolder={() => router.push(`/folders/${result.folder.id}`)}
        onRestart={() => handleRestartDiagnostic(result.folder.id)}
        isRestarting={restartDiagnostic.isPending}
      />
    );
  }

  if (result?.status === "EXISTING_COMPLETED") {
    return (
      <DiagnosticCompleted
        folder={result.folder}
        onViewFolder={() => {
          router.push(`/folders/${result.folder.id}`);
        }}
        onRestart={() => handleRestartDiagnostic(result.folder.id)}
        isRestarting={restartDiagnostic.isPending}
      />
    );
  }
  return (
    <EmptyState
      title="Dossier indisponible"
      description="Nous n'avons pas reçu un état valide pour ce dossier. Réessayez ou choisissez une autre démarche."
      actionLabel="Choisir une autre démarche"
      actionHref="/categories"
    />
  );
}
