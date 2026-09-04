"use client";
import {
  Eye,
  EyeClosed,
  LockKeyhole,
  Mail,
  User2,
  UserPlus2,
} from "lucide-react";
import { EntryZone } from "../../_components/shared/entry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { signupSchema, SignUpType } from "../_schema/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SingUpForm() {
  // ! State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { signup } = useAuth();
  const { handleSubmit, control } = useForm<SignUpType>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  // ! Functions
  const onSubmit = async (data: SignUpType) => {
    try {
      await signup.mutateAsync(data);

      router.push("/");
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
    }
  };

  // ! Render
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <EntryZone
            type="text"
            icon={User2}
            fieldState={fieldState}
            field={field}
            placeholder="Entrez votre nom complet"
            label="Nom complet"
          />
        )}
      />

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
            placeholder="Créer un mot de passe"
            label="Mot de passe"
            fieldState={fieldState}
            field={field}
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

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <EntryZone
            type={showConfirmPassword ? "text" : "password"}
            icon={LockKeyhole}
            placeholder="Confirmez votre mot de passe"
            label="Confirmer le mot de passe"
            fieldState={fieldState}
            field={field}
            icon2={
              <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
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
        <div className="flex items-start gap-3">
          <Input
            id="check"
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />

          <Label
            htmlFor="check"
            className="cursor-pointer text-sm font-normal leading-5 text-muted-foreground flex gap-1"
          >
            <p>
              J&apos;accepte les{" "}
              <Link
                href="/"
                className="font-medium text-primary hover:underline"
              >
                conditions d&apos;utilisation
              </Link>{" "}
              et la{" "}
              <Link
                href="/"
                className="font-medium text-primary hover:underline"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </Label>
        </div>

        <button
          type="submit"
          disabled={signup.isPending}
          className="btn btn-primary flex h-12 w-full items-center justify-center gap-2"
        >
          <UserPlus2 className="size-5" />
          {signup.isPending ? "Creeation..." : "Créer mon compte"}
        </button>
      </div>
    </form>
  );
}
