import { GoalIcon } from "lucide-react";
import Link from "next/link";
import LoginForm from "../_components/login/form";

export default function page() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-8">
      {/* Header */}
      <div className="space-y-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-3xl">
            Bon retour parmis nous !
          </h1>

          <p className="mt-1 text-base leading-6 text-muted-foreground">
            Connectez-vous pour accéder à votre espace personnel.
          </p>
        </div>
      </div>

      <LoginForm />

      <div className="flex items-center gap-3">
        <span className="h-0.5 flex-1 bg-border" />
        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          ou
        </span>
        <span className="h-0.5 flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 font-semibold transition-colors hover:bg-muted"
        >
          <GoalIcon className="size-4" />
          Continuer avec Google
        </button>

        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <GoalIcon className="size-4" />
          Continuer avec Facebook
        </button>
      </div>

      <p className="text-center text-muted-foreground">
        Vous n&apso;avez pas encore de compte ?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary hover:underline"
        >
          Creer un compte
        </Link>
      </p>
    </div>
  );
}
