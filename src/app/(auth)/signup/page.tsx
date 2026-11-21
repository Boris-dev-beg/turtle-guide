import SingUpForm from "./_components/form";
import Link from "next/link";
import SocialNetwork from "../login/_components/SocialNetwork";
import { getSafeCallbackUrl } from "@/lib/auth/callback-url";

/** Conserve une destination interne validée pendant l'inscription afin de reprendre le parcours demandé. */
export default async function page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const rawCallback = Array.isArray(params.callbackUrl) ? params.callbackUrl[0] : params.callbackUrl;
  const callbackUrl = rawCallback ? getSafeCallbackUrl(rawCallback, "/profile") : undefined;
  return (
    <div className="mx-auto flex w-full max-w-md flex-col rounded-sm border border-border bg-card p-5 sm:p-8">
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

      <SingUpForm callbackUrl={callbackUrl} />

      <div className="flex items-center gap-3 mt-4">
        <span className="h-0.5 flex-1 bg-border" />
        <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          ou
        </span>
        <span className="h-0.5 flex-1 bg-border" />
      </div>

      {/* Login with social network */}
      <SocialNetwork mode="signup" callbackUrl={callbackUrl} />

      <p className="text-center text-muted-foreground">
        Vous avez déjà un compte ?{" "}
        <Link
          href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"}
          className="font-semibold text-primary hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
