import { Check, Home, LogIn } from "lucide-react";
import Link from "next/link";

export default function Done() {
  return (
    <div className="w-full max-w-md rounded-sm border border-border bg-card p-5 sm:p-8">
      {/* Icône */}
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-sm border border-border bg-secondary text-brand-green">
        <Check className="size-8" />
      </div>

      {/* Titre */}
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl text-brand-ink">
          C&apos;est fait !
        </h1>

        <p className="mt-3 leading-6 text-slate-500">
          Votre mot de passe a été mis à jour avec succès.
        </p>
      </div>

      <div className="space-y-5">
        <Link
          href="/login"
          className="btn btn-primary flex h-12 w-full items-center justify-center gap-2 text-base"
        >
          <LogIn className="size-5" strokeWidth={2} />
          Se connecter
        </Link>
        <Link
          href="/"
          className="btn btn-outline text-base flex h-12 w-full items-center justify-center gap-2"
        >
          <Home className="size-5" strokeWidth={2} />
          Retour à l&apos;acceuil
        </Link>
      </div>
    </div>
  );
}
