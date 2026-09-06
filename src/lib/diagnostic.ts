"use server"; 
import { proceduresServices } from "@/services/procedure.service"; 
import { questionServices } from "@/services/question.service"; 

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

// ! Create Answer 
export async function saveAnswer(data: { folderId: string; optionId: string }) { 
  const answerExist = await questionServices.getAnswer(data); 

  if (answerExist) { 
    return answerExist; 
  } 

  return await questionServices.saveAnswer(data); 
} 
