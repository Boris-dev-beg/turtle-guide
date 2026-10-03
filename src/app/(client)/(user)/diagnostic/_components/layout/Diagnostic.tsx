"use client";

import { QuestionsSide } from "../Questions/questionSide";
import { useFolderStore } from "@/store/folder.store";
import { DiagnosticLoading } from "../states/Loaders";
import { useFolder } from "@/hooks/useFolder";
import { DiagnosticError } from "../states/Errors";
import { DiagnosticCreated } from "../Pages/DiagnosticCreated";
import { DiagnosticExisting } from "../Pages/DiagnosticExisting";
import { DiagnosticCompleted } from "../Pages/DiagnosticCompleted";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EmptyState } from "@/components/shared/EmptyState";

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
  const [showQuestions, setShowQuestions] = useState(false);
  const initializedSelection = useRef("");

  const { useCreateOrGetFolder, delFolder } = useFolder(user.id);

  // ! Functions
  // ? Initialisation of the folder
  const folderInitialization = useCreateOrGetFolder({
    procedureName: procedure,
    category,
  });
  const { data: result, isPending, isError, error } = folderInitialization;

  const selectionKey = `${user.id}:${category}:${procedure}`;

  console.log("Folder progression:", result?.folder.progression)

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

  if (showQuestions && result?.folder) {
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
    return (
      <DiagnosticExisting
        folder={result.folder}
        onContinue={() => setShowQuestions(true)}
        onChooseAnother={() => router.push("/categories")}
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
        onRestart={async () => {
          await delFolder.mutateAsync({
            userId: user.id,
            id: result.folder.id,
          });
          initializedSelection.current = "";
          folderInitialization.reset();
          folderInitialization.mutate();
        }}
        isRestarting={delFolder.isPending || folderInitialization.isPending}
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
