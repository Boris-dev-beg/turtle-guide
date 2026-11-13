import { z } from "zod";

export const fraudAlertSchema = z.object({
  stepId: z.string().min(1, "Choisissez l’étape concernée."),
  title: z
    .string()
    .trim()
    .min(5, "Le titre doit contenir au moins 5 caractères.")
    .max(120, "Le titre ne peut pas dépasser 120 caractères."),
  description: z
    .string()
    .trim()
    .min(20, "Ajoutez quelques détails (20 caractères minimum).")
    .max(3000, "La description ne peut pas dépasser 3 000 caractères."),
});

export type FraudAlertInput = z.infer<typeof fraudAlertSchema>;
