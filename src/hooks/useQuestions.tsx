import {
  getFirstQuestion,
  getNextQuestion,
  submitDiagnosticAnswer,
} from "@/lib/diagnostic";
import { useFolderStore } from "@/store/folder.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useQuestions(userId: string, folderId: string) {
  // ! State
  const { procedure, category } = useFolderStore();
  const [nextQuestionId, setNextQuestionId] = useState<string | null>(null);
  const [questionHistory, setQuestionHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(questionHistory.length);
  const queryClient = useQueryClient();

  // ! Get First Question
  const {
    data: firstQuestion,
    isLoading: firstQuestionLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["questions", procedure],
    queryFn: () => getFirstQuestion(procedure, userId, folderId),
    enabled: !!procedure && !!category,
  });

  const submitAnswer = useMutation({
    mutationFn: submitDiagnosticAnswer,
    onSuccess: async (result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["folder", userId, variables.folderId],
        }),
        queryClient.invalidateQueries({ queryKey: ["folders", userId] }),
      ]);

      return result;
    },
  });

  // ! Get one
  const { data: nextQuestion, isLoading: nextQuestionLoading } = useQuery({
    queryKey: ["question", nextQuestionId],
    queryFn: () => getNextQuestion(nextQuestionId!),
    enabled: !!nextQuestionId,
  });

  // ! Go to next question
  const goToQuestion = (questionId: string) => {
    setNextQuestionId(questionId);
    setQuestionHistory((prev) => [...prev, questionId]);
  };

  // ! Go to previous question
  const goToPreviousQuestion = () => {
    setQuestionHistory((prev) => {
      if (prev.length === 0) return prev;

      const history = [...prev];

      history.pop();

      const currentQuestionId = history.at(-1);
      setNextQuestionId(currentQuestionId || null);

      return history;
    });
  };

  // ! The actual displayed question
  const question = nextQuestion ?? firstQuestion;

  // ! History Length
  useEffect(() => {
    const updateLength = () => {
      setCurrentIndex(questionHistory.length);
    };
    updateLength();
  }, [questionHistory.length]);

  // ! Render
  return {
    question,
    isLoading: firstQuestionLoading || nextQuestionLoading,
    isError,
    error,
    goToQuestion,
    goToPreviousQuestion,
    submitAnswer,

    canGoBack: questionHistory.length > 0,
    currentIndex,
  };
}
