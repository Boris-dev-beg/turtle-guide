"use client";
import { useAuth } from "@/hooks/useAuth";
import google_icon from "../../../../assets/images/Google_icon.png";
import Image from "next/image";
import { toast } from "sonner";

export default function SocialNetwork({
  mode = "login",
}: {
  mode?: "login" | "signup";
}) {
  const { signInWithSocial } = useAuth();

  const handleGoogle = () => {
    toast.info(
      mode === "signup"
        ? "Redirection vers Google pour créer votre compte."
        : "Redirection vers Google pour vous connecter.",
    );
    signInWithSocial.mutate({
      provider: "google",
      requestSignUp: mode === "signup",
    });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={handleGoogle}
        type="button"
        className="flex text-base h-11 w-full items-center justify-center gap-2 btn btn-outline"
      >
        <Image
          src={google_icon}
          alt="Google Icon"
          width={50}
          height={50}
          className="size-5"
        />
        {mode === "signup"
          ? "Créer un compte avec Google"
          : "Continuer avec Google"}
      </button>
    </div>
  );
}
