import { z } from "zod";

/**
 * Décrit les seules données autorisées depuis le formulaire d'achat. Le serveur
 * revalide ce schéma avant de créer une session chez le prestataire; aucun prix n'est accepté.
 */
export const checkoutRequestSchema = z.object({
  documentId: z.string().min(1, "Document invalide."),
  method: z.enum(["card", "kpay"]),
});

/** Fournit le type des valeurs de formulaire déduit du schéma partagé. */
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
