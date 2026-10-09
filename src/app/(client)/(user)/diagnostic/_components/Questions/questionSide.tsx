"use client";
import { EmptyState } from "@/components/shared/EmptyState";
import { useQuestions } from "@/hooks/useQuestions";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRightFromSquare,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { QuestionsSkeleton } from "../cards/Skeleton";
import { CurrentQuestionType } from "./QuestionTypes";
import QuestionsHeader from "../cards/QuestionsHeader";
import { toast } from "sonner";

export const QuestionsSide = ({
  userId,
  folderId,
}: {
  userId: string;
  folderId: string;
}) => {
  // ! states
  const router = useRouter();
  const {
    question,
    isLoading,
    isError,
    error,
    goToQuestion,
    goToPreviousQuestion,
    submitAnswer,
    currentIndex,
    canGoBack,
  } = useQuestions(userId, folderId);

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
  const handleNextQuestion = async (option: {
    id: string;
    nextQuestionId: string | null;
    processId: string | null;
  }) => {
    try {
      const result = await submitAnswer.mutateAsync({
        folderId,
        optionId: option.id,
      });

      if (result.isDiagnosticComplete && result.processId) {
        router.push(`/folders/${folderId}`);
        return;
      }

      if (result.nextQuestionId) {
        goToQuestion(result.nextQuestionId);
        setSelectedOption(null);
        return;
      }

      toast.error("La réponse n'a pas permis de poursuivre le diagnostic.");
    } catch (error) {
      toast.error("Impossible d'enregistrer votre réponse. Réessayez.");
      console.error("Erreur lors de l'enregistrement de la réponse:", error);
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
      <QuestionsHeader currentIndex={currentIndex} />
      {/* Question description */}
      <div className="flex flex-col gap-3 pb-2">
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-brand-ink">
          {currentQuestion.title}
        </h1>
        <p className="text-muted-foreground leading-6 max-w-3xl">
          {currentQuestion.description}
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
            >
              {answer.id === selectedOption?.id ? (
                <Check className="size-6" strokeWidth={3} />
              ) : null}
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-brand-ink">
                {answer.title}
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
            disabled={!selectedOption || submitAnswer.isPending}
            onClick={
              !selectedOption
                ? () => null
                : () => void handleNextQuestion(selectedOption)
            }
            className="btn btn-outline w-full rounded-sm text-base disabled:cursor-not-allowed sm:w-auto"
          >
            {submitAnswer.isPending ? "Enregistrement..." : "Question suivante"}
            <ArrowRight className="size-5" />
          </button>
        ) : (
          <button
            onClick={() => void handleNextQuestion(selectedOption)}
            disabled={submitAnswer.isPending}
            className="btn btn-primary w-full rounded-sm px-5 text-base sm:w-auto"
          >
            {submitAnswer.isPending ? "Enregistrement..." : "Voir mon résultat"}
            <ArrowRight className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
};
