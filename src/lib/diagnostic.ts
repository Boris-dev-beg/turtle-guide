"use server";
import { proceduresServices } from "@/services/procedure.service";
import { questionServices } from "@/services/question.service";
import { requireSession } from "@/lib/session";

// ! Get First Question
export async function getFirstQuestion(procedureName: string) {
  const procedure = await proceduresServices.getOne(procedureName);

  if (!procedure) {
    throw new Error("Procédure introuvable");
  }

  return await questionServices.getFirst(procedure.id);
}

// ! Get Next Question
export async function getNextQuestion(questionId: string) {
  return await questionServices.getOne(questionId);
}

// ! Get Answer Options
export async function getAnswerOptions(questionId: string) {
  const answerOptions = await questionServices.getAllAnswerOptions(questionId);

  console.log("AnswerOptions:", answerOptions);
  return answerOptions;
}

// MODIFIÉ - L'ancien endpoint saveAnswer est retiré pour empêcher les réponses sans progression.

// AJOUTÉ - Soumet une réponse en utilisant l'identité de session côté serveur.
export async function submitDiagnosticAnswer(data: {
  folderId: string;
  optionId: string;
}) {
  const session = await requireSession();

  return await questionServices.submitDiagnosticAnswer({
    ...data,
    userId: session.user.id,
  });
}
