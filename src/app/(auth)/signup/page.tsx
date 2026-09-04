import SingUpForm from "./_components/form";
import google_icon from "../../../assets/images/Google_icon.png";
import Link from "next/link";
import Image from "next/image";

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

      <button
        type="button"
        className="flex text-base h-11 w-full items-center justify-center gap-2 btn btn-outline my-2"
      >
        <Image
          src={google_icon}
          alt="Google Icon"
          width={50}
          height={50}
          className="size-5"
        />
        S&apos;inscrire avec Google
      </button>

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
