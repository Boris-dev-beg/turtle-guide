import { z } from "zod"; 

export const signupSchema = z 
  .object({ 
    name: z.string().min(2, "Le nom est requis"), 
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

export type SignUpType = z.infer<typeof signupSchema>; 
