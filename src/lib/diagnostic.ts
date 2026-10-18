"use server";
import { proceduresServices } from "@/services/procedure.service";
import { questionServices } from "@/services/question.service";
import { requireSession } from "@/lib/session";
import { FolderServices } from "@/services/folders.service";

// ! Get First Question
export async function getFirstQuestion(
  procedureName: string,
  userId: string,
  folderId: string,
) {
  const procedure = await proceduresServices.getOne(procedureName);
  const folder = await FolderServices.getOneFolder(folderId, userId);

  if (!procedure) {
    throw new Error("Procédure introuvable");
  }
  if (!folder) {
    throw new Error("Dossier introuvable");
  }

  const currentQuestionId = folder.progression?.currentQuestionId;

  if (currentQuestionId)
    return await questionServices.getOne(currentQuestionId);
  
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

// ! Submit Question with the ID of the user's session.
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
