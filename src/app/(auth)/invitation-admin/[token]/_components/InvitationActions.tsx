"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { acceptAdministratorInvitation } from "@/lib/admin-invitations";
import { useAuth } from "@/hooks/useAuth";

/** Accepte uniquement après clic explicite, et gère la déconnexion ou le renvoi de vérification sans exposer l’adresse invitée. */
export default function InvitationActions({ token, logoutCallbackUrl, resendEmail, callbackUrl }: {
  token?: string;
  logoutCallbackUrl?: string;
  resendEmail?: string;
  callbackUrl?: string;
}) {
  const router = useRouter();
  const { logoutTo, resendVerificationEmail } = useAuth();
  const [pending, setPending] = useState(false);

  /** Appelle l'action d'acceptation sécurisée et envoie vers l'espace admin uniquement après réussite. */
  const accept = async () => {
    if (!token || pending) return;
    setPending(true);
    const result = await acceptAdministratorInvitation({ token });
    if (!result.success) {
      setPending(false);
      toast.error(result.message);
      if (result.code === "INVITATION_INVALID" || result.code === "INVITATION_EXPIRED" || result.code === "INVITATION_USED") router.refresh();
      return;
    }
    toast.success(result.message);
    router.replace("/admin");
  };

  /** Termine la session courante avant de demander la connexion au compte associé à l'invitation. */
  const signOut = async () => {
    setPending(true);
    await logoutTo(logoutCallbackUrl);
  };

  /** Demande à BetterAuth de renvoyer le lien de vérification avec le retour vers cette invitation. */
  const resend = async () => {
    if (!resendEmail || !callbackUrl) return;
    setPending(true);
    try {
      await resendVerificationEmail.mutateAsync({ email: resendEmail, callbackUrl });
      toast.success("Un nouveau lien de vérification a été envoyé.");
    } catch {
      toast.error("Le lien de vérification n’a pas pu être envoyé. Réessayez.");
    } finally {
      setPending(false);
    }
  };

  if (logoutCallbackUrl) return <button type="button" disabled={pending} onClick={signOut} className="btn btn-primary flex h-11 items-center justify-center">{pending ? "Déconnexion…" : "Se déconnecter"}</button>;
  if (resendEmail) return <button type="button" disabled={pending} onClick={resend} className="btn btn-primary flex h-11 items-center justify-center">{pending ? "Envoi…" : "Renvoyer le lien de vérification"}</button>;
  return <button type="button" disabled={pending} onClick={accept} className="btn btn-primary flex h-11 items-center justify-center">{pending ? "Acceptation…" : "Accepter l’invitation"}</button>;
}
