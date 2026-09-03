"use client";

import { HelpBox } from "@/app/(client)/_components/cards.tsx/HelpBox";
import { Back } from "@/components/shared/links";
import { FolderStatus } from "@/generated/prisma/enums";
// import { CreateFolder } from "@/lib/folder";
import { createOrGetFolderAction } from "@/lib/folder.action";
import { useFolderStore } from "@/store/folder.store";
import {
  ArrowUpRightFromSquare,
  FileText,
  Lightbulb,
  Link2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DiagnosticSkeleton from "../cards/DiagnosticSkeleton";
import { QuestionsSide } from "../Questions/questionSide";

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
};
type Result = {
  name: string;
  userId: string;
  id: string;
  status: FolderStatus;
  createdAt: Date;
  updatedAt: Date;
  procedureId: string;
  processId: string | null;
  locationId: string | null;
};

const TakenSteps = [
  {
    id: 1,
    question: "Votre situation",
    answer: "Déclarer une naissance",
  },
  {
    id: 2,
    question: "Lieu de naissance",
    answer: "Au cameroun",
  },
  {
    id: 3,
    question: "Délai de déclaration",
    answer: "Moins de 30 jours",
  },
  {
    id: 4,
    question: "Lieu de naissance détaillé",
    answer: "Dans une formation sanitaire",
  },
  {
    id: 5,
    question: "Qui fait la déclaration ?",
  },
];


export default function Diagnostic({ user }: { user: User }) {
  // ! states
  const { procedure, category } = useFolderStore();

  const [folder, setFolder] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  // ! Functions
  useEffect(() => {
    if (!procedure || !category || !user.id) return;

    const initializeFolder = async () => {
      try {
        setLoading(true);

        const result = await createOrGetFolderAction({
          procedureName: procedure,
          userId: user.id,
          category,
        });

        setFolder(result);
      } catch (error) {
        console.error("Erreur lors de l'initialisation du dossier :", error);
      } finally {
        setLoading(false);
      }
    };

    initializeFolder();
  }, [procedure, category, user.id]);

  // ! Render
  if (loading) {
    return <DiagnosticSkeleton />;
  }

  console.log("New Folder in diagnostic page:", folder);
  return (
    <>
      {/* First Side */}
      <FirstSide procedure={procedure} />

      {/* Question side */}
      <QuestionsSide />

      {/* Great to know */}
      <div className="turtle-alert-info max-[1200px]:hidden flex-col items-start h-fit w-full lg:w-100 shadow-sm">
        <span className="flex gap-2 items-center">
          <Lightbulb className="p-2 size-7 rounded-full bg-primary/10 text-primary" />
          <h2 className="font-bold text-lg"> Bon à savoir </h2>
        </span>
        <p className="text-muted-foreground text-sm leading-6">
          La déclaration doit être faite dans les 90 jours suivant la naissance
          pour éviter les démarches plus complexes.
        </p>
        <Link
          href={"/"}
          className="hover:underline text-primary font-semibold flex items-center gap-2 text-sm transition-colors"
        >
          Lire la loi n°2024/016
          <ArrowUpRightFromSquare className="size-4" />
        </Link>
      </div>
    </>
  );
}

const FirstSide = ({ procedure }: { procedure: string }) => {
  return (
    <div className="h-fit lg:h-full w-full md:w-120 flex flex-col gap-4 py-4 px-2 border-r border-border bg-secondary/20 rounded-xl">
      {/* Back to home */}
      <Back href="/categories" />

      {/* Selected Procedure */}
      <div className="flex gap-3 items-start py-3 px-2 rounded-xl bg-background shadow-xs">
        <span className="flex items-center justify-center size-10 shrink-0 bg-primary/10 text-primary rounded-lg">
          <FileText className="size-5" />
        </span>
        <span className="w-full leading-4">
          <h1 className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-1">
            Procédure sélectionnée
          </h1>
          <h2 className="font-bold line-clamp-2 leading-6">{procedure}</h2>
        </span>
      </div>

      {/* Steps Taken */}
      <div className="flex flex-col gap-3">
        <h1 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
          <Link2 className="size-4 text-primary" /> Étapes parcourues
        </h1>
        {/* Steps */}
        <div className="flex flex-col gap-1 pl-1">
          {TakenSteps.map((step, index) => (
            <div className="flex gap-3 w-full" key={index}>
              <span className="flex flex-col items-center gap-2 text-muted-foreground justify-start">
                <span
                  className={`turtle-step ${step.answer ? "turtle-step-active" : "turtle-step-inactive"} w-5 h-5 ring-2 ring-background`}
                />
                {step.answer && <p className="h-6 border-l-2 border-border" />}
              </span>
              <div className="flex flex-col mb-auto pb-2">
                <h1
                  className={`font-semibold ${step.answer ? "text-foreground" : "text-primary"}`}
                >
                  {step.id}. {step.question}
                </h1>
                {step.answer && (
                  <p className="text-muted-foreground text-sm mt-0.5 leading-5">
                    {step.answer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Box */}
      <HelpBox />
    </div>
  );
};


