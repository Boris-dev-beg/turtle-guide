import "server-only";

import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

/** Centralise la durée d'une invitation pour son expiration et le texte de l'e-mail. */
export const ADMIN_INVITATION_TTL_MS = 48 * 60 * 60 * 1000;

/** Fournit une erreur métier sans inclure d'adresse ou de secret dans les messages. */
export class AdminInvitationServiceError extends Error {
  constructor(
    public readonly code:
      | "NOT_ADMIN"
      | "ALREADY_ADMIN"
      | "INVITATION_NOT_PENDING"
      | "INVITATION_INVALID"
      | "INVITATION_EXPIRED"
      | "INVITATION_USED"
      | "EMAIL_MISMATCH"
      | "EMAIL_UNVERIFIED"
      | "SELF_REMOVAL"
      | "LAST_ADMIN"
      | "ADMIN_NOT_FOUND"
      | "CONCURRENT_CHANGE",
  ) {
    super(adminInvitationErrorMessage(code));
    this.name = "AdminInvitationServiceError";
  }
}

/** Convertit un code métier en message français destiné à l'interface d'administration. */
function adminInvitationErrorMessage(code: AdminInvitationServiceError["code"]) {
  const messages: Record<AdminInvitationServiceError["code"], string> = {
    NOT_ADMIN: "Accès administrateur requis.",
    ALREADY_ADMIN: "Cette personne est déjà administratrice.",
    INVITATION_NOT_PENDING: "Cette invitation n'est plus en cours.",
    INVITATION_INVALID: "Invitation invalide.",
    INVITATION_EXPIRED: "Cette invitation a expiré.",
    INVITATION_USED: "Cette invitation a déjà été utilisée.",
    EMAIL_MISMATCH: "Cette invitation est destinée à une autre adresse.",
    EMAIL_UNVERIFIED: "Vérifiez votre adresse e-mail avant d'accepter l'invitation.",
    SELF_REMOVAL: "Vous ne pouvez pas retirer votre propre accès administrateur.",
    LAST_ADMIN: "Le dernier administrateur ne peut pas être retiré.",
    ADMIN_NOT_FOUND: "Administrateur introuvable.",
    CONCURRENT_CHANGE: "Les administrateurs ont changé pendant cette action. Réessayez.",
  };
  return messages[code];
}

/** Calcule l'empreinte SHA-256 stockée en base afin que le jeton d'e-mail reste secret. */
export function hashAdministratorInvitationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** Crée une invitation après avoir revalidé l'administrateur et remplacé les invitations en attente de cette adresse. */
export async function createAdministratorInvitation({
  email,
  tokenHash,
  inviterId,
}: {
  email: string;
  tokenHash: string;
  inviterId: string;
}) {
  const now = new Date();

  try {
    return await prisma.$transaction(
      async (transaction) => {
        const inviter = await transaction.administrator.findUnique({
          where: { id: inviterId },
          select: { id: true },
        });
        if (!inviter) throw new AdminInvitationServiceError("NOT_ADMIN");

        const existingUser = await transaction.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
          select: { administrator: { select: { id: true } } },
        });
        if (existingUser?.administrator) {
          throw new AdminInvitationServiceError("ALREADY_ADMIN");
        }

        await transaction.adminInvitation.updateMany({
          where: {
            email: { equals: email, mode: "insensitive" },
            status: "PENDING",
          },
          data: { status: "REVOKED" },
        });

        return transaction.adminInvitation.create({
          data: {
            email,
            tokenHash,
            status: "PENDING",
            expiresAt: new Date(now.getTime() + ADMIN_INVITATION_TTL_MS),
            invitedById: inviter.id,
          },
          select: { id: true, expiresAt: true },
        });
      },
      { isolationLevel: "Serializable" },
    );
  } catch (error) {
    if (isPrismaCode(error, "P2034") || isPrismaCode(error, "P2002")) {
      throw new AdminInvitationServiceError("CONCURRENT_CHANGE");
    }
    throw error;
  }
}

/** Révoque une invitation encore en attente après avoir revérifié l'administrateur dans la transaction. */
export async function revokeAdministratorInvitation({
  invitationId,
  inviterId,
}: {
  invitationId: string;
  inviterId: string;
}) {
  return prisma.$transaction(async (transaction) => {
    const inviter = await transaction.administrator.findUnique({
      where: { id: inviterId },
      select: { id: true },
    });
    if (!inviter) throw new AdminInvitationServiceError("NOT_ADMIN");

    const revoked = await transaction.adminInvitation.updateMany({
      where: { id: invitationId, status: "PENDING" },
      data: { status: "REVOKED" },
    });
    if (revoked.count !== 1) {
      throw new AdminInvitationServiceError("INVITATION_NOT_PENDING");
    }
  });
}

/** Révoque le nouvel enregistrement uniquement après un échec d'envoi SMTP, même si l'invitant vient d'être retiré. */
export async function revokeUndeliveredAdministratorInvitation(invitationId: string) {
  return prisma.adminInvitation.updateMany({
    where: { id: invitationId, status: "PENDING" },
    data: { status: "REVOKED" },
  });
}

/** Accepte une invitation une seule fois après vérification de l'invitant, du compte et de son e-mail vérifié. */
export async function acceptAdministratorInvitation({
  tokenHash,
  userId,
  sessionEmail,
  sessionEmailVerified,
}: {
  tokenHash: string;
  userId: string;
  sessionEmail: string;
  sessionEmailVerified: boolean;
}): Promise<{ alreadyAdministrator: boolean }> {
  const now = new Date();

  try {
    return await prisma.$transaction(
      async (transaction) => {
        const invitation = await transaction.adminInvitation.findUnique({
          where: { tokenHash },
          select: {
            id: true,
            email: true,
            status: true,
            expiresAt: true,
            invitedById: true,
          },
        });
        if (!invitation || !invitation.invitedById) {
          throw new AdminInvitationServiceError("INVITATION_INVALID");
        }

        const inviter = await transaction.administrator.findUnique({
          where: { id: invitation.invitedById },
          select: { id: true },
        });
        if (!inviter) throw new AdminInvitationServiceError("INVITATION_INVALID");

        if (invitation.status === "REVOKED") {
          throw new AdminInvitationServiceError("INVITATION_INVALID");
        }
        if (invitation.status === "ACCEPTED") {
          const existingUser = await transaction.user.findUnique({
            where: { id: userId },
            select: { email: true, emailVerified: true },
          });
          const normalizedInvitationEmail = invitation.email.trim().toLowerCase();
          if (
            sessionEmail.trim().toLowerCase() !== normalizedInvitationEmail ||
            existingUser?.email.trim().toLowerCase() !== normalizedInvitationEmail
          ) {
            throw new AdminInvitationServiceError("EMAIL_MISMATCH");
          }
          if (!sessionEmailVerified || !existingUser.emailVerified) {
            throw new AdminInvitationServiceError("EMAIL_UNVERIFIED");
          }

          const existingAdmin = await transaction.administrator.findUnique({
            where: { userId },
            select: { id: true },
          });
          if (existingAdmin) return { alreadyAdministrator: true };
          throw new AdminInvitationServiceError("INVITATION_USED");
        }
        if (invitation.status !== "PENDING") {
          throw new AdminInvitationServiceError("INVITATION_INVALID");
        }
        if (invitation.expiresAt <= now) {
          throw new AdminInvitationServiceError("INVITATION_EXPIRED");
        }

        const normalizedInvitationEmail = invitation.email.trim().toLowerCase();
        const normalizedSessionEmail = sessionEmail.trim().toLowerCase();
        if (normalizedSessionEmail !== normalizedInvitationEmail) {
          throw new AdminInvitationServiceError("EMAIL_MISMATCH");
        }
        if (!sessionEmailVerified) {
          throw new AdminInvitationServiceError("EMAIL_UNVERIFIED");
        }

        const currentUser = await transaction.user.findUnique({
          where: { id: userId },
          select: { email: true, emailVerified: true },
        });
        if (!currentUser || currentUser.email.trim().toLowerCase() !== normalizedInvitationEmail) {
          throw new AdminInvitationServiceError("EMAIL_MISMATCH");
        }
        if (!currentUser.emailVerified) {
          throw new AdminInvitationServiceError("EMAIL_UNVERIFIED");
        }

        const consumed = await transaction.adminInvitation.updateMany({
          where: {
            id: invitation.id,
            status: "PENDING",
            expiresAt: { gt: now },
            invitedById: inviter.id,
          },
          data: { status: "ACCEPTED", acceptedAt: now },
        });
        if (consumed.count !== 1) {
          throw new AdminInvitationServiceError("CONCURRENT_CHANGE");
        }

        const existingAdmin = await transaction.administrator.findUnique({
          where: { userId },
          select: { id: true },
        });
        if (!existingAdmin) {
          await transaction.administrator.create({
            data: { userId, accessLevel: "ADMIN" },
          });
        }

        await transaction.adminInvitation.updateMany({
          where: {
            email: { equals: normalizedInvitationEmail, mode: "insensitive" },
            status: "PENDING",
            id: { not: invitation.id },
          },
          data: { status: "REVOKED" },
        });

        return { alreadyAdministrator: Boolean(existingAdmin) };
      },
      { isolationLevel: "Serializable" },
    );
  } catch (error) {
    if (isPrismaCode(error, "P2034")) {
      throw new AdminInvitationServiceError("CONCURRENT_CHANGE");
    }
    if (isPrismaCode(error, "P2002")) {
      const existingAdmin = await prisma.administrator.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (existingAdmin) {
        return acceptAdministratorInvitation({
          tokenHash,
          userId,
          sessionEmail,
          sessionEmailVerified,
        });
      }
    }
    throw error;
  }
}

/** Retire un autre administrateur tout en sérialisant le contrôle du dernier accès restant. */
export async function removeAdministrator({
  targetUserId,
  actingUserId,
  actingAdministratorId,
}: {
  targetUserId: string;
  actingUserId: string;
  actingAdministratorId: string;
}) {
  if (targetUserId === actingUserId) {
    throw new AdminInvitationServiceError("SELF_REMOVAL");
  }

  try {
    await prisma.$transaction(
      async (transaction) => {
        const actingAdmin = await transaction.administrator.findUnique({
          where: { id: actingAdministratorId },
          select: { id: true },
        });
        if (!actingAdmin) throw new AdminInvitationServiceError("NOT_ADMIN");

        const targetAdmin = await transaction.administrator.findUnique({
          where: { userId: targetUserId },
          select: { id: true },
        });
        if (!targetAdmin) throw new AdminInvitationServiceError("ADMIN_NOT_FOUND");

        const administratorCount = await transaction.administrator.count({
          where: { accessLevel: "ADMIN" },
        });
        if (administratorCount <= 1) {
          throw new AdminInvitationServiceError("LAST_ADMIN");
        }

        const removed = await transaction.administrator.deleteMany({
          where: { id: targetAdmin.id, accessLevel: "ADMIN" },
        });
        if (removed.count !== 1) {
          throw new AdminInvitationServiceError("CONCURRENT_CHANGE");
        }
      },
      { isolationLevel: "Serializable" },
    );
  } catch (error) {
    if (isPrismaCode(error, "P2034")) {
      throw new AdminInvitationServiceError("CONCURRENT_CHANGE");
    }
    throw error;
  }
}

/** Retourne les comptes et invitations nécessaires à l'écran admin sans exposer de jeton ni de hash. */
export async function getAdministratorManagementData(currentAdministratorId: string) {
  const [administrators, invitations] = await Promise.all([
    prisma.administrator.findMany({
      where: { accessLevel: "ADMIN" },
      select: {
        id: true,
        userId: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { id: "asc" },
    }),
    prisma.adminInvitation.findMany({
      where: { status: "PENDING" },
      select: {
        id: true,
        email: true,
        createdAt: true,
        expiresAt: true,
        invitedBy: { select: { user: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const now = new Date();
  return {
    administrators: administrators.map((administrator) => ({
      id: administrator.id,
      userId: administrator.userId,
      name: administrator.user.name,
      email: administrator.user.email,
      isCurrent: administrator.id === currentAdministratorId,
    })),
    invitations: invitations.map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      invitedBy: invitation.invitedBy?.user.name ?? "Administrateur retiré",
      createdAt: invitation.createdAt.toISOString(),
      expiresAt: invitation.expiresAt.toISOString(),
      status: invitation.expiresAt <= now ? ("EXPIRED" as const) : ("PENDING" as const),
    })),
    administratorCount: administrators.length,
  };
}

/** Lit l'état public d'une invitation sans retourner son hash; l'adresse reste côté serveur pour comparer la session sans la dévoiler. */
export async function getPublicAdministratorInvitation(tokenHash: string) {
  const invitation = await prisma.adminInvitation.findUnique({
    where: { tokenHash },
    select: { email: true, status: true, expiresAt: true, invitedBy: { select: { id: true } } },
  });
  if (!invitation || !invitation.invitedBy || invitation.status === "REVOKED") {
    return { status: "INVALID" as const };
  }
  if (invitation.status === "ACCEPTED") return { status: "ACCEPTED" as const };
  if (invitation.expiresAt <= new Date()) return { status: "EXPIRED" as const };
  return { status: "PENDING" as const, email: invitation.email };
}

/** Identifie les erreurs connues du client Prisma sans dépendre d'un import généré absent du dépôt. */
function isPrismaCode(error: unknown, code: string): error is { code: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}
