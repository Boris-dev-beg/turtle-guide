"use client";
import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { Back } from "@/components/shared/links";
import { FolderType } from "../types/types";
import { useSteps } from "@/hooks/useSteps";
import { useEffect } from "react";
import LoadingStep from "../_components/cards/loadingStep";

export default function PendingFolder({
  folder,
  userId,
}: {
  folder: FolderType;
  userId: string;
}) {
  const { steps, isLoading, setProcessId } = useSteps();

  useEffect(() => {
    const setID = () => {
      if (!!folder.processId) setProcessId(folder.processId || "");
    };
    setID();
  }, [setProcessId, folder.processId]);

  console.log("steps:", steps);
  console.log("userID:", userId);

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Retour */}
      <Back href="/folders" />

      {/* Titre */}
      <div className="mb-6">
        <div className="flex flex-col gap-2">
          <span className="text-muted-foreground">{folder.name}</span>

          <h1 className="text-3xl font-bold tracking-tight">
            Étapes de votre dossier
          </h1>

          <p className="text-muted-foreground leading-6">
            Suivez les différentes étapes de votre démarche administrative.
          </p>
        </div>
      </div>

      {/* Étapes */}
      <section className="turtle-card">
        <div className="mb-6">
          <h2 className="text-lg font-bold">Votre parcours</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Retrouvez les étapes de votre démarche et leur état
            d&apos;avancement.
          </p>
        </div>

        <div className="flex flex-col">
          {isLoading || !steps ? (
            <LoadingStep />
          ) : (
            <>
              {steps.map((step) => (
                <div key={step.id} className="flex gap-4">
                  {/* Indicateur + ligne */}

                  {/* Contenu */}
                  <div className={`flex-1 pb-6`}>
                    <div
                      className={`rounded-xl border p-4 border-border bg-card `}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-base">
                              {step.title}
                            </h3>
                          </div>

                          <p className="text-sm text-muted-foreground leading-5 mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Bon à savoir */}
      <div className="turtle-alert-info mt-6 flex-col items-start sm:flex-row sm:items-center">
        <span className="flex gap-3 items-start">
          <Lightbulb className="size-7 shrink-0 p-1.5 rounded-full bg-primary/10 text-primary" />

          <span>
            <h2 className="font-bold">Bon à savoir</h2>

            <p className="text-muted-foreground text-sm leading-5 mt-1">
              Vous pouvez revenir à tout moment à votre dossier pour consulter
              vos documents et suivre son avancement.
            </p>
          </span>
        </span>

        <Link
          href="/a-propos"
          className="text-primary hover:underline font-semibold text-sm whitespace-nowrap"
        >
          En savoir plus
        </Link>
      </div>
    </main>
  );
}
