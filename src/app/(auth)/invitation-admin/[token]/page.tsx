import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { hashAdministratorInvitationToken, getPublicAdministratorInvitation } from "@/services/admin-invitations.service";
import { prisma } from "@/lib/prisma";
import InvitationActions from "./_components/InvitationActions";

/** Applique dans l'ordre les états de sécurité d'une invitation sans jamais l'accepter pendant le rendu GET. */
export default async function AdministratorInvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const validToken = /^[A-Za-z0-9_-]{43}$/.test(token);
  const callbackUrl = `/invitation-admin/${token}`;
  let invitation: Awaited<ReturnType<typeof getPublicAdministratorInvitation>>;

  try {
    invitation = validToken
      ? await getPublicAdministratorInvitation(hashAdministratorInvitationToken(token))
      : { status: "INVALID" };
  } catch (error) {
    console.error("Échec de lecture d'une invitation administrateur.", error);
    return <InvitationMessage title="Impossible de vérifier l’invitation" description="Un problème temporaire empêche de vérifier ce lien. Réessayez dans un instant." retry />;
  }

  if (invitation.status === "INVALID") return <InvitationMessage title="Invitation invalide" description="Ce lien d’invitation n’est pas valide." />;
  if (invitation.status === "ACCEPTED") return <InvitationMessage title="Invitation déjà utilisée" description="Cette invitation a déjà été acceptée." />;
  if (invitation.status === "EXPIRED") return <InvitationMessage title="Invitation expirée" description="Demandez-en une nouvelle à l’administrateur qui vous a invité." />;

  const session = await getSession();
  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);

  const sessionEmail = session.user.email.trim().toLowerCase();
  if (sessionEmail !== invitation.email.trim().toLowerCase()) {
    return <InvitationMessage title="Cette invitation est destinée à une autre adresse" description="Connectez-vous avec l’adresse e-mail qui a reçu cette invitation." logoutCallbackUrl={callbackUrl} />;
  }
  if (!session.user.emailVerified) {
    return <InvitationMessage title="Vérifiez votre adresse e-mail" description="Votre adresse doit être vérifiée avant de pouvoir accepter l’invitation." resendEmail={session.user.email} callbackUrl={callbackUrl} />;
  }

  const administrator = await prisma.administrator.findUnique({ where: { userId: session.user.id }, select: { id: true } });
  if (administrator) redirect("/admin");

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-5 rounded-sm border border-border bg-card p-5 sm:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-brand-ink">Invitation administrateur</h1>
        <p className="text-brand-ink-muted">Vous avez été invité à rejoindre l’équipe d’administration de TurtleGuide. En acceptant, vous obtiendrez un accès complet au back-office.</p>
      </div>
      <InvitationActions token={token} />
    </section>
  );
}

/** Présente les états non confirmables du lien et délègue les actions qui nécessitent une interaction explicite. */
function InvitationMessage({ title, description, retry = false, logoutCallbackUrl, resendEmail, callbackUrl }: {
  title: string;
  description: string;
  retry?: boolean;
  logoutCallbackUrl?: string;
  resendEmail?: string;
  callbackUrl?: string;
}) {
  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-4 rounded-sm border border-border bg-card p-5 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-brand-ink">{title}</h1>
      <p className="text-brand-ink-muted">{description}</p>
      {retry && <Link href="." className="btn btn-outline flex h-10 items-center justify-center">Réessayer</Link>}
      {logoutCallbackUrl && <InvitationActions logoutCallbackUrl={logoutCallbackUrl} />}
      {resendEmail && callbackUrl && <InvitationActions resendEmail={resendEmail} callbackUrl={callbackUrl} />}
      {!retry && !logoutCallbackUrl && !resendEmail && <Link href="/" className="btn btn-outline flex h-10 items-center justify-center">Retour à l’accueil</Link>}
    </section>
  );
}
