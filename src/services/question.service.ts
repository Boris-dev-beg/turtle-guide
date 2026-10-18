import { prisma } from "@/lib/prisma";

export const questionServices = {
  // ! Get All
  async getAll(procedureId: string) {
    return await prisma.question.findMany({
      where: {
        procedureId,
      },
      include: {
        options: true,
      },
    });
  },

  // ! Get All
  async getFirst(procedureId: string) {
    return await prisma.question.findFirst({
      where: {
        procedureId,
      },
      include: {
        options: true,
      },
    });
  },

  // ! Get One
  async getOne(id: string) {
    return await prisma.question.findUnique({
      where: {
        id,
      },
      include: {
        options: true,
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

  // ! Get Answers
  async getAnswers(folderId: string) {
    return await prisma.answer.findMany({
      where: {
        folderId,
      },
    });
  },
  // MODIFIÉ - Les anciennes écritures directes Answer sont retirées; toutes passent par submitDiagnosticAnswer.
  // AJOUTÉ - Enregistre une réponse et synchronise la progression et l'état terminal en une transaction.
  async submitDiagnosticAnswer({
    folderId,
    userId,
    optionId,
  }: {
    folderId: string;
    userId: string;
    optionId: string;
  }) {
    return prisma.$transaction(async (transaction) => {
      const folder = await transaction.folder.findFirst({
        where: { id: folderId, userId },
        select: { id: true, procedureId: true, locationId: true },
      });

      if (!folder) {
        throw new Error("Dossier introuvable");
      }

      const option = await transaction.answerOption.findUnique({
        where: { id: optionId },
        include: {
          question: { select: { id: true, title: true, procedureId: true } },
          process: { select: { id: true } },
        },
      });

      if (!option || option.question.procedureId !== folder.procedureId) {
        throw new Error("Réponse invalide pour cette démarche");
      }

      const priorLocationAnswers = option.processId
        ? await transaction.answer.findMany({
            where: { folderId },
            include: { option: { include: { question: true } } },
            orderBy: { answeredAt: "asc" },
          })
        : [];

      // MODIFIÉ - Une réponse par question; un nouvel essai remplace l'ancienne sélection.
      await transaction.answer.deleteMany({
        where: {
          folderId,
          optionId: { not: optionId },
          option: { questionId: option.question.id },
        },
      });

      // MODIFIÉ - Answer n'a pas de contrainte composite; vérifier l'existence avant la création dans la transaction.
      const existingAnswer = await transaction.answer.findFirst({
        where: { folderId, optionId },
      });
      const savedAnswer =
        existingAnswer ??
        (await transaction.answer.create({ data: { folderId, optionId } }));

      // AJOUTÉ - La progression pointe vers la prochaine question, ou la question terminale répondue.
      await transaction.progression.upsert({
        where: { folderId },
        create: {
          folderId,
          currentQuestionId: option.nextQuestionId ?? option.question.id,
        },
        update: {
          currentQuestionId: option.nextQuestionId ?? option.question.id,
        },
      });

      let locationUpdated = false;

      // AJOUTÉ - Seule une option terminale finalise le diagnostic et tente de résoudre la ville choisie.
      if (option.processId) {
        const priorCityAnswer = priorLocationAnswers.find((answer) =>
          /^Dans quelle ville de la région .+ vous trouvez-vous \?$/.test(
            answer.option.question.title,
          ),
        );
        const currentIsCityAnswer =
          /^Dans quelle ville de la région .+ vous trouvez-vous \?$/.test(
            option.question.title,
          );
        const cityAnswer = currentIsCityAnswer
          ? { label: option.label, questionTitle: option.question.title }
          : priorCityAnswer
            ? {
                label: priorCityAnswer.option.label,
                questionTitle: priorCityAnswer.option.question.title,
              }
            : null;

        let locationId = folder.locationId;
        if (cityAnswer) {
          const region = cityAnswer.questionTitle.match(
            /^Dans quelle ville de la région (.+) vous trouvez-vous \?$/,
          )?.[1];

          if (region) {
            const location = await transaction.location.findFirst({
              where: { city: cityAnswer.label, address: region },
              select: { id: true },
            });

            if (location) {
              locationId = location.id;
              locationUpdated = location.id !== folder.locationId;
            }
          }
        }

        await transaction.folder.update({
          where: { id: folderId, userId },
          data: {
            processId: option.processId,
            status: "PENDING",
            ...(locationUpdated && locationId ? { locationId } : {}),
          },
        });
      }

      return {
        answer: savedAnswer,
        nextQuestionId: option.nextQuestionId,
        processId: option.processId,
        isDiagnosticComplete: Boolean(option.processId),
        locationUpdated,
      };
    });
  },
};
