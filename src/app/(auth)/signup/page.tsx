import SingUpForm from "./_components/form";
import Link from "next/link";
import SocialNetwork from "../login/_components/SocialNetwork";

export default function page() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-8">
      {/* Header */}
      <div className="space-y-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-3xl">
            Créer un compte
          </h1>

          <p className="mt-1 text-base leading-6 text-muted-foreground">
            Remplissez les informations ci-dessous pour créer votre compte.
          </p>
        </div>
      </div>

      <SingUpForm />

      <div className="flex items-center gap-3 mt-4">
        <span className="h-0.5 flex-1 bg-border" />
        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          ou
        </span>
        <span className="h-0.5 flex-1 bg-border" />
      </div>

      {/* Login with social network */}
      <SocialNetwork />

      <p className="text-center text-muted-foreground">
        Vous avez déjà un compte ?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
