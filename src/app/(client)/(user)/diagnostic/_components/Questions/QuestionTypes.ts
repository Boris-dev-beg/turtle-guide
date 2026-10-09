export type CurrentQuestionType = {
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
