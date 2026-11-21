"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import {
  acceptAdministratorInvitationSchema,
  administratorListSchema,
  inviteAdministratorSchema,
  removeAdministratorSchema,
  revokeAdministratorInvitationSchema,
} from "@/lib/schemas/admin-invitation.schema";
import { sendAdminInvitationEmail } from "@/lib/auth/email";
import {
  AdminAuthorizationError,
  requireAdmin,
} from "@/lib/admin/require-admin";
import {
  acceptAdministratorInvitation as acceptInvitation,
  AdminInvitationServiceError,
  ADMIN_INVITATION_TTL_MS,
  createAdministratorInvitation,
  getAdministratorManagementData,
  hashAdministratorInvitationToken,
  removeAdministrator,
  revokeAdministratorInvitation as revokeInvitation,
  revokeUndeliveredAdministratorInvitation,
} from "@/services/admin-invitations.service";

/** Crée une invitation protégée, n'enregistre que le hash du jeton et l'envoie par le transport SMTP existant. */
export async function inviteAdministrator(input: unknown) {
  const parsed = inviteAdministratorSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false as const,
      code: "INVALID_INPUT",
      message: parsed.error.issues[0]?.message ?? "Adresse e-mail invalide.",
    };
  }

  try {
    const { administrator, session } = await requireAdmin();
    const baseUrl = process.env.BETTER_AUTH_URL;
    if (!baseUrl) {
      return {
        success: false as const,
        code: "CONFIGURATION_ERROR",
        message: "BETTER_AUTH_URL doit être configurée pour créer le lien d'invitation.",
      };
    }

    const url = new URL(baseUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Invalid URL protocol");
    }
    const token = randomBytes(32).toString("base64url");
    const invitationUrl = new URL(
      `/invitation-admin/${token}`,
      url.origin,
    ).toString();

    const invitation = await createAdministratorInvitation({
      email: parsed.data.email,
      tokenHash: hashAdministratorInvitationToken(token),
      inviterId: administrator.id,
    });

    try {
      await sendAdminInvitationEmail(
        parsed.data.email,
        session.user.name,
        invitationUrl,
        ADMIN_INVITATION_TTL_MS / (60 * 60 * 1000),
      );
    } catch {
      await revokeUndeliveredAdministratorInvitation(invitation.id).catch((error) => {
        console.error("Impossible de révoquer l'invitation dont l'envoi a échoué.", error);
      });
      revalidatePath("/admin/administrators");
      return {
        success: false as const,
        code: "EMAIL_DELIVERY_FAILED",
        message: "L'e-mail n'a pas pu être envoyé; l'invitation a été annulée.",
      };
    }

    revalidatePath("/admin/administrators");
    return {
      success: true as const,
      message: "L'invitation a été envoyée.",
      invitationId: invitation.id,
    };
  } catch (error) {
    return adminActionError(error);
  }
}

/** Annule une invitation en attente et rend immédiatement son jeton inutilisable. */
export async function cancelAdministratorInvitation(input: unknown) {
  const parsed = revokeAdministratorInvitationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, code: "INVALID_INPUT", message: "Invitation invalide." };
  }

  try {
    const { administrator } = await requireAdmin();
    await revokeInvitation({
      invitationId: parsed.data.invitationId,
      inviterId: administrator.id,
    });
    revalidatePath("/admin/administrators");
    return { success: true as const, message: "L'invitation a été annulée." };
  } catch (error) {
    return adminActionError(error);
  }
}

/** Accepte l'invitation après un appel explicite de l'utilisateur connecté; ouvrir le lien ne consomme rien. */
export async function acceptAdministratorInvitation(input: unknown) {
  const parsed = acceptAdministratorInvitationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, code: "INVITATION_INVALID", message: "Invitation invalide." };
  }

  try {
    const session = await getSession();
    if (!session?.user) {
      return {
        success: false as const,
        code: "UNAUTHENTICATED",
        message: "Connectez-vous pour accepter cette invitation.",
      };
    }

    const result = await acceptInvitation({
      tokenHash: hashAdministratorInvitationToken(parsed.data.token),
      userId: session.user.id,
      sessionEmail: session.user.email,
      sessionEmailVerified: session.user.emailVerified,
    });
    revalidatePath("/admin");
    revalidatePath("/admin/administrators");
    return {
      success: true as const,
      alreadyAdministrator: result.alreadyAdministrator,
      message: result.alreadyAdministrator
        ? "Votre accès administrateur est déjà actif."
        : "L'invitation a été acceptée.",
    };
  } catch (error) {
    return adminActionError(error);
  }
}

/** Retire un autre administrateur sous isolation Serializable sans déconnecter son compte utilisateur. */
export async function removeAdministratorAccess(input: unknown) {
  const parsed = removeAdministratorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, code: "INVALID_INPUT", message: "Administrateur invalide." };
  }

  try {
    const { administrator, session } = await requireAdmin();
    await removeAdministrator({
      targetUserId: parsed.data.userId,
      actingUserId: session.user.id,
      actingAdministratorId: administrator.id,
    });
    revalidatePath("/admin/manage-users");
    revalidatePath("/admin");
    return { success: true as const, message: "L'accès administrateur a été retiré." };
  } catch (error) {
    return adminActionError(error);
  }
}

/** Fournit les listes autorisées pour la page d'administration sans jamais retourner les jetons ou leurs empreintes. */
export async function getAdminManagementData(input: unknown = {}) {
  if (!administratorListSchema.safeParse(input).success) {
    return { success: false as const, code: "INVALID_INPUT", message: "Requête invalide." };
  }

  try {
    const { administrator } = await requireAdmin();
    return {
      success: true as const,
      data: await getAdministratorManagementData(administrator.id),
    };
  } catch (error) {
    return adminActionError(error);
  }
}

/** Convertit les refus d'accès et erreurs métier en réponses stables sans divulguer de données sensibles. */
function adminActionError(error: unknown) {
  if (error instanceof AdminAuthorizationError) {
    return {
      success: false as const,
      code: error.code,
      message: error.message,
    };
  }
  if (error instanceof AdminInvitationServiceError) {
    return {
      success: false as const,
      code: error.code,
      message: error.message,
    };
  }

  console.error("Échec d'une action d'administration des comptes.", error);
  return {
    success: false as const,
    code: "UNEXPECTED_ERROR",
    message: "L'action n'a pas pu aboutir. Réessayez.",
  };
}
