"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { useFolder } from "@/hooks/useFolder";
import { useQuestions } from "@/hooks/useQuestions";
import { ArrowLeft, ArrowRight, ArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    questionId: string;
    nextQuestionId: string | null;
    processId: string | null;
  }[];
};

export const QuestionsSide = ({
  userId,
  folderId,
}: {
  userId: string;
  folderId: string;
}) => {
  // ! states
  const router = useRouter();
  const { updateStatus } = useFolder(userId);
  const {
    question,
    isLoading,
    isError,
    error,
    goToQuestion,
    goToPreviousQuestion,
    setData,
    currentIndex,
    canGoBack,
  } = useQuestions();

  const [currentQuestion, setCurrentQuestion] =
    useState<CurrentQuestionType | null>(null);

  const [selectedOption, setSelectedOption] = useState<{
    id: string;
    nextQuestionId: string | null;
    processId: string | null;
  } | null>(null);

  // ! Functions
  // ? Update current Question
  useEffect(() => {
    if (!question) return;

    const updateCurrentQuestion = () => {
      setCurrentQuestion({
        id: question.id,
        title: question.title,
        description: question.description,
        legalBasisLink: {
          href: "/",
          label: "En savoir plus",
        },
        answer_options: question.options.map((option) => ({
          id: option.id,
          title: option.label,
          description: "",

          questionId: option.questionId,
          nextQuestionId: option.nextQuestionId,
          processId: option.processId,
        })),
      });
    };
    updateCurrentQuestion();
  }, [question]);

  // ? Go to the next Question in the tree
  const handleNextQuestion = (option: {
    id: string;
    nextQuestionId: string | null;
    processId: string | null;
  }) => {
    setData({ folderId, optionId: option.id });
    if (option.nextQuestionId) {
      goToQuestion(option.nextQuestionId);
      setSelectedOption(null);
      return;
    }

    // ! If it's the final question
    if (option.processId) {
      updateStatus.mutate({
        id: folderId,
        userId,
        processId: option.processId,
        status: "PENDING",
      });
      router.push("/folders");
    }
  };

  // ! Render
  if (isLoading || !currentQuestion) {
    return <QuestionsSkeleton />;
  }

  if (isError) {
    console.error("Erreur lors de la récupération des questions :", error);

    return (
      <EmptyState
        title="Questions indisponibles"
        description="Nous n'avons pas pu récupérer les questions de cette démarche. Revenez à la sélection des procédures et réessayez."
        actionLabel="Choisir une autre démarche"
        actionHref="/categories"
      />
    );
  }

  // ! Render
  return (
    <div className="relative flex w-full flex-col gap-5 overflow-hidden rounded-sm border border-border border-l-4 border-l-brand-yellow bg-card p-5 sm:p-6">
      {/* Indication */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center rounded-sm bg-brand-yellow-bg px-3 py-1.5 text-sm font-semibold text-brand-ink">
            Question {currentIndex + 1}
          </span>
          <span className="h-4 w-px bg-border" />
          <h2 className="text-muted-foreground text-sm font-medium">
            Diagnostic en cours
          </h2>
        </div>
      </div>

      {/* Question description */}
      <div className="flex flex-col gap-3 pb-2">
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-brand-ink">
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
            onClick={() => setSelectedOption(answer)}
            className={`turtle-radio ${answer.id === selectedOption?.id ? "turtle-radio-active shadow-sm" : "hover:border-primary/30 hover:bg-accent/40"} justify-start gap-3 items-start`}
          >
            <span
              className={`turtle-step ${answer.id === selectedOption?.id ? "turtle-step-active" : "turtle-step-inactive"}`}
            />
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-brand-ink">
                {" "}
                {answer.title}{" "}
              </h2>
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
          disabled={!canGoBack}
          onClick={goToPreviousQuestion}
          className="btn btn-outline w-full rounded-sm text-base sm:w-auto"
        >
          <ArrowLeft className="size-5" /> Question précédente
        </button>
        {!selectedOption || selectedOption?.nextQuestionId ? (
          <button
            disabled={!selectedOption}
            onClick={
              !selectedOption
                ? () => null
                : () => handleNextQuestion(selectedOption)
            }
            className="btn btn-outline w-full rounded-sm text-base disabled:cursor-not-allowed sm:w-auto"
          >
            Question suivante
            <ArrowRight className="size-5" />
          </button>
        ) : (
          <button
            onClick={() => handleNextQuestion(selectedOption)}
            className="btn btn-primary w-full rounded-sm px-5 text-base sm:w-auto"
          >
            Voir mon resultat <ArrowRight className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
};

const QuestionsSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-5 rounded-sm border border-border border-l-4 border-l-brand-yellow bg-card p-5 sm:p-6">
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
            className="flex items-start gap-3 rounded-sm border border-border bg-background p-4"
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
