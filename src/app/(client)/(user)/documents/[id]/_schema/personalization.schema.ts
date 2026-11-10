import z from "zod";

export const personalizationSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis."),
  lastName: z.string().min(2, "Le nom est requis."),
  birthDate: z.string().min(1, "La date de naissance est requise."),
  age: z
    .string()
    .trim()
    .min(1, "L'âge est requis.")
    .refine((value) => {
      const num = Number(value);
      return Number.isInteger(num) && num >= 0 && num <= 120;
    }, "L'âge doit être un nombre valide entre 0 et 120."),
  phone: z.string().min(8, "Le téléphone est requis."),
  email: z
    .email("L'adresse e-mail est invalide.")
    .optional()
    .or(z.literal("")),
  city: z.string().min(2, "La ville est requise."),
  address: z.string().min(3, "L'adresse est requise."),
  purpose: z.string().min(3, "Le besoin est requis."),
  notes: z
    .string()
    .max(250, "Le message est trop long.")
    .optional()
    .or(z.literal("")),
});

export type PersonalizationFormValues = z.infer<typeof personalizationSchema>;
