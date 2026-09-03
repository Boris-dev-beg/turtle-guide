import { getAllQuestions, getAnswerOptions } from "@/lib/diagnostic";
import { useFolderStore } from "@/store/folder.store";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useQuestions() {
  const { procedure, category } = useFolderStore();
  const [questionId, setQuestionId] = useState("");

  // ! Get All Questions
  const {
    data: questions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["questions", procedure],
    queryFn: () => getAllQuestions(procedure),
    enabled: !!procedure && !!category,
  });

  // ! Get one
  const { data: answerOptions, isLoading: answerOptionsLoading } = useQuery({
    queryKey: ["answers Options", questionId],
    queryFn: () => getAnswerOptions(questionId),
    enabled: !!questionId,
  });
  const getOne = (questionId: string) => setQuestionId(questionId);

  return {
    questions,
    isLoading,
    isError,
    error,

    answerOptions,
    answerOptionsLoading,

    getOne
  };
}
