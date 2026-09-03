import { getFirstQuestion, getNextQuestion } from "@/lib/diagnostic";
import { useFolderStore } from "@/store/folder.store";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useQuestions() {
  const { procedure, category } = useFolderStore();
  const [nextQuestionId, setNextQuestionId] = useState<string | null>(null);

  // ! Get First Question
   const {
    data: firstQuestion,
    isLoading: firstQuestionLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["questions", procedure],
    queryFn: () => getFirstQuestion(procedure),
    enabled: !!procedure && !!category,
  });

  // ! Get one
  const {
    data: nextQuestion,
    isLoading: nextQuestionLoading,
  } = useQuery({
    queryKey: ["question", nextQuestionId],
    queryFn: () => getNextQuestion(nextQuestionId!),
    enabled: !!nextQuestionId,
  });

  const goToQuestion = (questionId: string | null) => {
    setNextQuestionId(questionId);
  };

  // ! The actual displayed question
  const question = nextQuestion ?? firstQuestion;

  return {
    question,
    isLoading: firstQuestionLoading || nextQuestionLoading,
    isError,
    error,


    goToQuestion,
  };
}
