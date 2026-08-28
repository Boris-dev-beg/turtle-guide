"use client";
import { Eye, LockKeyhole, LogIn, Mail } from "lucide-react";
import { EntryZone } from "../shared/entry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormType, loginSchema } from "../../_schema/login.schema";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { handleSubmit, control } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      await login.mutateAsync(data);

      router.push("/");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
            type="password"
            icon={LockKeyhole}
            fieldState={fieldState}
            field={field}
            placeholder="Votre mot de passe"
            label="Mot de passe"
            icon2={Eye}
          />
        )}
      />

      <div className="space-y-4 pt-1">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-start gap-3">
            <Input
              id="check"
              type="checkbox"
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
