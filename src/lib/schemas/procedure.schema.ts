import { z } from "zod";

export const procedureSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(100, "Le nom ne peut pas dépasser 100 caractères."),
  image: z
    .string()
    .trim()
    .min(2, "L'image est requise.")
    .max(500, "Le chemin de l'image ne peut pas dépasser 500 caractères."),
  categoryId: z
    .string()
    .trim()
    .min(2, "La catégorie est requise."),
  legalBasis: z
    .string()
    .trim()
    .min(2, "La base legal doit contenir au moins 2 caractères.")
    .max(100, "La base legal ne peut pas dépasser 100 caractères."),
  description: z
    .string()
    .trim()
    .min(5, "La description doit contenir au moins 5 caractères.")
    .max(500, "La description ne peut pas dépasser 500 caractères."),
  isActive: z.boolean(),
});

export type ProcedureInput = z.infer<typeof procedureSchema>;

export type AdminProcedureRow = ProcedureInput & {
  id: string;
  _count: { questions: number };
};
