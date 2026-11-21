import { z } from "zod";

/** Valide et normalise l'adresse à inviter pour l'index unique insensible à la casse. */
export const inviteAdministratorSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254, "Adresse e-mail trop longue.")
    .pipe(z.email("Adresse e-mail invalide."))
    .transform((email) => email.toLowerCase()),
}).strict();

/** Valide l'identifiant d'une invitation lors de son annulation par un administrateur. */
export const revokeAdministratorInvitationSchema = z.object({
  invitationId: z.string().trim().min(1, "Invitation invalide.").max(191),
}).strict();

/** Valide le jeton base64url de 32 octets reçu dans le lien d'invitation. */
export const acceptAdministratorInvitationSchema = z.object({
  token: z.string().regex(/^[A-Za-z0-9_-]{43}$/, "Invitation invalide."),
}).strict();

/** Valide l'identifiant de l'administrateur à retirer sans accepter de données superflues. */
export const removeAdministratorSchema = z.object({
  userId: z.string().trim().min(1, "Administrateur invalide.").max(191),
}).strict();

/** Décrit l'entrée vide attendue par l'action de lecture des comptes administrateurs. */
export const administratorListSchema = z.object({}).strict();
