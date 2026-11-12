import z from "zod";

export const personalizationSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis."),
  lastName: z.string().min(2, "Le nom est requis."),
  birthDate: z.string().min(1, "La date de naissance est requise."),
  birthPlace: z.string().min(2, "Le lieu de naissance est requis."),
  fatherName: z.string().optional().or(z.literal("")),
  motherName: z.string().optional().or(z.literal("")),
});

export type PersonalizationFormValues = z.infer<typeof personalizationSchema>;
