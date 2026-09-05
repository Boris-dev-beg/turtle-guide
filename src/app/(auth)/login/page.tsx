import Link from "next/link";
import LoginForm from "./_components/form";
import SocialNetwork from "./_components/SocialNetwork";

export default function page() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-8">
      {/* Header */}
      <div className="space-y-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-center">
            Connexion
          </h1>

          <p className="mt-1 text-[17px] leading-6 text-muted-foreground">
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
      {/* Login with social network */}
      <SocialNetwork />

      <p className="text-center text-muted-foreground">
        Vous n&apos;avez pas encore de compte ?{" "}
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
