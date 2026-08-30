"use client";

import { HelpBox } from "@/app/(client)/_components/cards.tsx/HelpBox";
import { Back } from "@/components/shared/links";
import { useFolderStore } from "@/store/folder.store";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRightFromSquare,
  FileText,
  Lightbulb,
  Link2,
} from "lucide-react";
import Link from "next/link";

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
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

const CurrentQuestion = {
  id: 5,
  title: "Qui peut effectuer la déclaration de naissance ?",
  description:
    "Selon la loi camerounaise sur l'enregistrement des faits d'etat civil, la déclaration doit être faite par les parents ou, à défaut, par certaines personnes habilitées.",

  legalBasisLink: {
    href: "/",
    label: "En savoir plus",
  },

  answer_options: [
    {
      id: 5,
      title: "Les parents (père et/ou mère)",
      description:
        "La déclaration est faite par le père, la mère ou les deux parents.",
    },
    {
      id: 2,
      title: "Le personnel de la formation sanitaire",
      description:
        "Si les parents ne peuvent pas se déplacer, le responsable du centre de santé peut faire la déclaration.",
    },
    {
      id: 3,
      title: "Un proche de la famille",
      description:
        "Grand-parent, onclem tante ou toute personne majeure présente lors de la naissance.",
    },
    {
      id: 4,
      title: "Une autorité administrative",
      description:
        "Maire, chef traditionnel ou toutes autre autorité compétente.",
    },
    {
      id: 5,
      title: "Je ne suis pas sûr(e)",
      description: "Je préfère obtenir plus d'informations avant de continuer.",
    },
  ],
};

export default function Diagnostic({ user }: { user: User }) {
  const { procedure } = useFolderStore();
  console.log("User:", user);
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

const QuestionsSide = () => {
  return (
    <div className="flex flex-col gap-5 p-5 rounded-xl border border-border bg-background w-full shadow-xs">
      {/* Indication */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold">
            Question {CurrentQuestion.id}
          </span>
          <span className="h-4 w-px bg-border" />
          <h2 className="text-muted-foreground text-sm font-medium">
            Diagnostic en cours
          </h2>
        </div>
      </div>
      {/* Question description */}
      <div className="flex flex-col gap-3 pb-2">
        <h1 className="text-3xl font-bold tracking-tight leading-tight">
          {CurrentQuestion.title}
        </h1>
        <p className="text-muted-foreground leading-6 max-w-3xl">
          {CurrentQuestion.description}{" "}
          <Link
            className="text-primary hover:underline inline-flex items-center gap-1 font-semibold transition-colors"
            href={CurrentQuestion.legalBasisLink.href}
          >
            {CurrentQuestion.legalBasisLink.label}
            <ArrowUpRightFromSquare className="size-3.5" />
          </Link>
        </p>
      </div>
      {/* Answer options */}
      <div className="grid gap-3 w-full px-1">
        {CurrentQuestion.answer_options.map((answer, index) => (
          <div
            key={index}
            className={`turtle-radio ${answer.id === 2 ? "turtle-radio-active shadow-sm" : "hover:border-primary/30 hover:bg-accent/40"} justify-start gap-3 items-start`}
          >
            <span
              className={`turtle-step ${answer.id === 2 ? "turtle-step-active" : "turtle-step-inactive"}`}
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold"> {answer.title} </h2>
              <p className="text-muted-foreground leading-5">
                {answer.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Actions */}
      <div className="flex flex-col sm:flex-row w-full items-center justify-between border-t border-border pt-4 mt-1 gap-3">
        <button className="btn btn-outline text-base rounded-lg w-full sm:w-auto">
          <ArrowLeft className="size-5" /> Question précédente
        </button>
        <Link href="/folders" className="btn btn-primary text-base rounded-lg px-5 w-full sm:w-auto">
          Voir mon resultat <ArrowRight className="size-5" />
        </Link>
      </div>
    </div>
  );
};
