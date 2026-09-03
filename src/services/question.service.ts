import { prisma } from "@/lib/prisma";

export const questionServices = {
  // ! Get All
  async getAll(procedureId: string) {
    return await prisma.question.findMany({
      where: {
        procedureId,
      },
      include:{
        options: true
      }
    });
  },

  // ! Get One
  async getOne(id: string) {
    return await prisma.question.findUnique({
      where: {
        id,
      },
    });
  },

  // ! Get Anwser Options
  async getAllAnswerOptions(questionId: string) {
    return await prisma.answerOption.findMany({
      where: {
        questionId,
      },
    });
  },
};
