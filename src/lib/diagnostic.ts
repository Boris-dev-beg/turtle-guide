"use server";
import { proceduresServices } from "@/services/procedure.service";
import { questionServices } from "@/services/question.service";

export async function getFirstQuestion(procedureName: string) {
  const procedure = await proceduresServices.getOne(procedureName);

  if (!procedure) {
    throw new Error("Procédure introuvable");
  }

  return await questionServices.getFirst(procedure.id);
}

export async function getNextQuestion(questionId: string) {
  return await questionServices.getOne(questionId);
}

export async function getAnswerOptions(questionId: string) {
  const answerOptions = await questionServices.getAllAnswerOptions(questionId);

  console.log("AnswerOptions:", answerOptions);
  return answerOptions;
}
