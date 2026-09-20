"use client";
import { Eye, EyeClosed, LockKeyhole, LogIn, Mail } from "lucide-react";
import { EntryZone } from "../../_components/shared/entry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormType, loginSchema } from "../_schema/login.schema";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
  // ! States
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();
  const { login } = useAuth();
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // ! Functions
  const onSubmit = async (data: LoginFormType) => {
    toast.loading("Vérification de vos identifiants...", { id: "login" });
    try {
      const result = await login.mutateAsync({ ...data, rememberMe });

      if (result.error) {
        if (result.error.status === 403) {
          toast.info(
            "Votre email n'est pas encore vérifié. Un nouveau lien de vérification vient d'être envoyé à votre adresse.",
            { id: "login" },
          );
          setError("root", {
            message: "Vérifiez votre email avant de vous connecter.",
          });
        } else {
          toast.error(
            "Connexion impossible. Vérifiez vos informations ou créez un compte.",
            { id: "login" },
          );
          setError("root", {
            message:
              "Connexion impossible. Vérifiez vos informations ou créez un compte.",
          });
        }
        return;
      }

      toast.success("Connexion réussie.", { id: "login" });
      router.push("/");
    } catch (error) {
      toast.error("Une erreur est survenue pendant la connexion.", {
        id: "login",
      });
      console.error("Erreur lors de l'inscription :", error);
    }
  };

  // ! Render
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      {errors.root && <p className="text-red-500">{errors.root.message}</p>}
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <EntryZone
            type="email"
            fieldState={fieldState}
            field={field}
            icon={Mail}
            placeholder="exemple@email.com"
            label="Email"
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <EntryZone
            type={showPassword ? "text" : "password"}
            icon={LockKeyhole}
            fieldState={fieldState}
            field={field}
            placeholder="Votre mot de passe"
            label="Mot de passe"
            icon2={
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye className="size-5" />
                ) : (
                  <EyeClosed className="size-5" />
                )}
              </span>
            }
          />
        )}
      />
      <div className="space-y-4 pt-1">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-start gap-3">
            <Input
              id="check"
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />

            <Label
              htmlFor="check"
              className="cursor-pointer text-base font-normal leading-5 text-muted-foreground flex gap-1"
            >
              Se souvenir de moi
            </Label>
          </div>
          <Link
            href="/forgotPassword"
            className="font-medium text-primary hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={login.isPending}
          className="btn btn-primary flex h-12 w-full items-center justify-center gap-2"
        >
          <LogIn className="size-5" />
          {login.isPending ? "Connexion" : "Se connecter"}
        </button>
      </div>
    </form>
  );
}
