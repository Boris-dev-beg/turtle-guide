import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe devrait avoir au moins 8 caractéres"),
});

export type LoginFormType = z.infer<typeof loginSchema>;
