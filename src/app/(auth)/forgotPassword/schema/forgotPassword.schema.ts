import { z } from "zod"; 

export const ResetPasswordSchema = z 
  .object({ 
    password: z 
      .string() 
      .min(8, "Le mot de passe devrait avoir au moins 8 caractéres"), 
    confirmPassword: z.string(), 
  }) 
  .refine((data) => data.password === data.confirmPassword, { 
    message: "Les mots de passe ne sont pas identiquent", 
    path: ["confirmPassword"], 
  }); 

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>; 

export const AccountVerificationSchema = z.object({ 
  email: z.email("Adresse email invalide"), 
}); 

export type AccountVerificationSchemaType = z.infer< 
  typeof AccountVerificationSchema 
>; 

export const CodeOTPSchema = z.object({ 
  code: z.string().length(6), 
}); 

export type CodeOTPSchemaType = z.infer<typeof CodeOTPSchema>; 
