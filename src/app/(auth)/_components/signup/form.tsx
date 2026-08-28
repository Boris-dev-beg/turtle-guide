"use client"
import { Eye, LockKeyhole, Mail, Phone, User2, UserPlus2 } from "lucide-react";
import { EntryZone } from "../shared/entry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SingUpForm() {
  return (
    <form action="/" className="flex flex-col gap-4">
      <EntryZone
        type="text"
        icon={User2}
        placeholder="Entrez votre nom complet"
        label="Nom complet"
      />

      <EntryZone
        type="email"
        icon={Mail}
        placeholder="Entrez votre email"
        label="Email"
      />

      <EntryZone
        type="tel"
        icon={Phone}
        placeholder="Ex : 6XX XXX XXX"
        label="Téléphone"
      />

      <EntryZone
        type="password"
        icon={LockKeyhole}
        placeholder="Créer un mot de passe"
        label="Mot de passe"
        icon2={Eye}
      />

      <EntryZone
        type="password"
        icon={LockKeyhole}
        placeholder="Confirmez votre mot de passe"
        label="Confirmer le mot de passe"
        icon2={Eye}
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
            className="cursor-pointer text-base font-normal leading-5 text-muted-foreground flex gap-1"
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
          className="btn btn-primary flex h-12 w-full items-center justify-center gap-2"
        >
          <UserPlus2 className="size-5" />
          Créer mon compte
        </button>
      </div>
    </form>
  );
}