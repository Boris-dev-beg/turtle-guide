"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuestions } from "@/hooks/useQuestions";
// import { getAllQuestions } from "@/lib/diagnostic";
// import { useFolderStore } from "@/store/folder.store";
import { ArrowLeft, ArrowRight, ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// type Result = {
//   title: string;
//   procedureId: string;
//   description: string | null;
// };
// type ResultAnswerOption = {
//   id: string;
//   label: string;
//   processId: string | null;
//   questionId: string;
//   nextQuestionId: string | null;
// };

// const CurrentQuestion = {
//   id: 5,
//   title: "Qui peut effectuer la déclaration de naissance ?",
//   description:
//     "Selon la loi camerounaise sur l'enregistrement des faits d'etat civil, la déclaration doit être faite par les parents ou, à défaut, par certaines personnes habilitées.",

//   legalBasisLink: {
//     href: "/",
//     label: "En savoir plus",
//   },

//   answer_options: [
//     {
//       id: 5,
//       title: "Les parents (père et/ou mère)",
//       description:
//         "La déclaration est faite par le père, la mère ou les deux parents.",
//     },
//     {
//       id: 2,
//       title: "Le personnel de la formation sanitaire",
//       description:
//         "Si les parents ne peuvent pas se déplacer, le responsable du centre de santé peut faire la déclaration.",
//     },
//     {
//       id: 3,
//       title: "Un proche de la famille",
//       description:
//         "Grand-parent, oncle, tante ou toute personne majeure présente lors de la naissance.",
//     },
//     {
//       id: 4,
//       title: "Une autorité administrative",
//       description:
//         "Maire, chef traditionnel ou toutes autre autorité compétente.",
//     },
//     {
//       id: 5,
//       title: "Je ne suis pas sûr(e)",
//       description: "Je préfère obtenir plus d'informations avant de continuer.",
//     },
//   ],
// };

type CurrentQuestionType = {
  id: string;
  title: string;
  description: string | null;

  legalBasisLink: {
    href: string;
    label: string;
  };

  answer_options: {
    id: string;
    title: string;
    description: string;
  }[];
};

export const QuestionsSide = () => {
  // ! states
  const { questions, isLoading, isError, error } = useQuestions();
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestionType>({
    id: "",
    title: "",
    description: "",

    legalBasisLink: {
      href: "/",
      label: "En savoir plus",
    },

    answer_options: [
      {
        id: "",
        title: "",
        description: "",
      },
    ],
  });
  const [currentAnswer, setCurrentAnswer] = useState("");

  // ! Functions
  useEffect(() => {
    const updatecurrentQuestion = () => {
      setCurrentQuestion({
        id: questions[currentQuestionId].id,
        title: questions[currentQuestionId].title,
        description: questions[currentQuestionId]?.description,

        legalBasisLink: {
          href: "/",
          label: "En savoir plus",
        },

        answer_options: questions[currentQuestionId].options.map((option) => ({
          id: option.id,
          title: option.label,
          description: "",
        })),
      });
    };
    if (questions.length > 0) updatecurrentQuestion();
  }, [currentQuestionId, questions]);

  // ! Render
  if (isLoading) {
    return <QuestionsSkeleton />;
  }
  if (isError) {
    console.error("Erreur lors de la récupération des questions :", error);

    return (
      <div className="turtle-alert-info">
        Impossible de récupérer les questions.
      </div>
    );
  }

  console.log("Questions Recuperer:", questions);
  // ! Render
  return (
    <div className="flex flex-col gap-5 p-5 rounded-xl border border-border bg-background w-full shadow-xs">
      {/* Indication */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold">
            Question {currentQuestionId + 1}
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
          {currentQuestion.title}
        </h1>
        <p className="text-muted-foreground leading-6 max-w-3xl">
          {currentQuestion.description}{" "}
          <Link
            className="text-primary hover:underline inline-flex items-center gap-1 font-semibold transition-colors"
            href={currentQuestion.legalBasisLink.href}
          >
            {currentQuestion.legalBasisLink.label}
            <ArrowUpRightFromSquare className="size-3.5" />
          </Link>
        </p>
      </div>

      {/* Answer options */}
      <div className="grid gap-3 w-full px-1">
        {currentQuestion.answer_options.map((answer, index) => (
          <div
            key={index}
            onClick={() => setCurrentAnswer(answer.id)}
            className={`turtle-radio ${answer.id === currentAnswer ? "turtle-radio-active shadow-sm" : "hover:border-primary/30 hover:bg-accent/40"} justify-start gap-3 items-start`}
          >
            <span
              className={`turtle-step ${answer.id === currentAnswer ? "turtle-step-active" : "turtle-step-inactive"}`}
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
        <button
          onClick={() =>
            setCurrentQuestionId((prev) =>
              prev > 0 ? currentQuestionId - 1 : 0,
            )
          }
          className="btn btn-outline text-base rounded-lg w-full sm:w-auto"
        >
          <ArrowLeft className="size-5" /> Question précédente
        </button>
        {currentQuestionId < questions.length ? (
          <button
            onClick={() => setCurrentQuestionId(currentQuestionId + 1)}
            className="btn btn-outline text-base rounded-lg w-full sm:w-auto"
          >
            Question suivante
            <ArrowRight className="size-5" />
          </button>
        ) : (
          <Link
            href="/folders"
            className="btn btn-primary text-base rounded-lg px-5 w-full sm:w-auto"
          >
            Voir mon resultat <ArrowRight className="size-5" />
          </Link>
        )}
      </div>
    </div>
  );
};

const QuestionsSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 p-5 rounded-xl border border-border bg-background w-full shadow-xs">
      {/* Indication */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <span className="h-4 w-px bg-border" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Question description */}
      <div className="flex flex-col gap-3 pb-2">
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-4 w-full max-w-3xl" />
        <Skeleton className="h-4 w-3/5 max-w-3xl" />
      </div>

      {/* Answer options */}
      <div className="grid gap-3 w-full px-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card"
          >
            <Skeleton className="size-6 shrink-0 rounded-full" />

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row w-full items-center justify-between border-t border-border pt-4 mt-1 gap-3">
        <Skeleton className="h-11 w-full sm:w-52 rounded-lg" />
        <Skeleton className="h-11 w-full sm:w-40 rounded-lg" />
      </div>
    </div>
  );
};
