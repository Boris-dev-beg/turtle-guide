"use client"
import { Eye, LockKeyhole, LogIn, Mail } from "lucide-react";
import { EntryZone } from "../shared/entry";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginForm() {
  return (
    <form action="/" className="flex flex-col gap-4">
      <EntryZone
        type="email"
        icon={Mail}
        placeholder="exemple@email.com"
        label="Email"
      />

      <EntryZone
        type="password"
        icon={LockKeyhole}
        placeholder="Votre mot de passe"
        label="Mot de passe"
        icon2={Eye}
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
          className="btn btn-primary flex h-12 w-full items-center justify-center gap-2"
        >
          <LogIn className="size-5" />
          Se connecter
        </button>
      </div>
    </form>
  );
}
