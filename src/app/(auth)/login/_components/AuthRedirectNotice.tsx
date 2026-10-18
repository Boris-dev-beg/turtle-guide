"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AuthRedirectNotice() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const signup = searchParams.get("signup");
    const oauth = searchParams.get("oauth");
    const authError = searchParams.get("authError");
    const verified = searchParams.get("verified");

    if (signup === "success") {
      toast.info("Vérifiez votre email pour activer votre compte.");
    } else if (signup === "resume") {
      toast.info(
        "Cette inscription existe déjà. Un nouveau lien de vérification vient d'être envoyé à votre adresse.",
      );
    } else if (oauth === "signup") {
      toast.info(
        "Votre compte Google est prêt. Vérifiez votre email pour continuer.",
      );
    } else if (oauth === "login") {
      toast.success("Connexion Google réussie.");
    } else if (verified === "success") {
      toast.success("Votre email est vérifié. Vous pouvez vous connecter.");
    } else if (authError === "oauth") {
      toast.error("La connexion Google n'a pas abouti. Réessayez.");
    }
  }, [searchParams]);

  return null;
}
