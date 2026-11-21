import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(100, "Le nom ne peut pas dépasser 100 caractères."),
  slug: z
    .string()
    .trim()
    .min(2, "L'identifiant doit contenir au moins 2 caractères.")
    .max(100, "L'identifiant ne peut pas dépasser 100 caractères.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Utilisez des minuscules, chiffres et tirets.",
    ),
  description: z
    .string()
    .trim()
    .min(5, "La description doit contenir au moins 5 caractères.")
    .max(500, "La description ne peut pas dépasser 500 caractères."),
  isActive: z.boolean(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export type AdminCategoryRow = CategoryInput & {
  id: string;
  _count: { procedures: number };
};
