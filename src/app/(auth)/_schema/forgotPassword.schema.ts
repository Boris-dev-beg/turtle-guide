import { z } from "zod";

export const ForgotPasswordSchema = z
  .object({
    email: z.email("Adresse email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe devrait avoir au moins 8 caractéres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne sont pas identiquent",
    path: ["confirmPassword"],
  });

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;
