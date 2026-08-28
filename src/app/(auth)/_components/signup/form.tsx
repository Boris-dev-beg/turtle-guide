"use client";
import { Eye, LockKeyhole, Mail, User2, UserPlus2 } from "lucide-react";
import { EntryZone } from "../shared/entry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { signupSchema, SignUpType } from "../../_schema/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SingUpForm() {
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<SignUpType>({
    resolver: zodResolver(signupSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: SignUpType) => {
    // Handle submission
    console.log(data);
  };
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
            type="password"
            icon={LockKeyhole}
            placeholder="Créer un mot de passe"
            label="Mot de passe"
            fieldState={fieldState}
            field={field}
            icon2={Eye}
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field, fieldState }) => (
          <EntryZone
            type="password"
            icon={LockKeyhole}
            placeholder="Confirmez votre mot de passe"
            label="Confirmer le mot de passe"
            fieldState={fieldState}
            field={field}
            icon2={Eye}
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
          disabled={isSubmitting}
          className="btn btn-primary flex h-12 w-full items-center justify-center gap-2"
        >
          <UserPlus2 className="size-5" />
          {isSubmitting ? "Creeation..." : "Créer mon compte"}
        </button>
      </div>
    </form>
  );
}
