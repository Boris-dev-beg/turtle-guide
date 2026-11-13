"use server";

import { fraudAlertSchema } from "@/app/(client)/fraud-report/_schema/fraudReport.schema";
import { prisma } from "@/lib/prisma";

export async function submitFraudAlert(input: unknown) {
  const values = fraudAlertSchema.parse(input);
  const stepExists = await prisma.step.findUnique({
    where: { id: values.stepId },
    select: { id: true },
  });
  if (!stepExists) throw new Error("L’étape choisie n’existe plus.");

  return prisma.fraudAlert.create({
    data: {
      stepId: values.stepId,
      title: values.title,
      description: values.description,
    },
    select: { id: true },
  });
}
