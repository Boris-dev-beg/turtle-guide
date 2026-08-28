"use client";
import Form_layout from "../components/form_layout";
import { ChevronLeft, MailCheck, RefreshCcw } from "lucide-react";
import { EntryOTPZone } from "../../../shared/entry";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CodeVerfication({ OnClick }: { OnClick: () => void }) {
  return (
    <Form_layout
      title="Code envoyé !"
      description={
        <>
          Nous vous avons envoyer un code à 6 chiffres à l&apos;addresse
          <br />
          <b className="text-primary font-semibold">example@email.com</b>,{" "}
          <br />
          Veuillez le saisir dans les cases ci-dessous pour continuer.
        </>
      }
      icon={MailCheck}
    >
      <>
        <>
          <EntryOTPZone
            Onchange={(value) => {
              if (value.length === 6) {
                setTimeout(() => {
                  OnClick();
                }, 1000);
              }
            }}
            label="Code de vérification"
          />
          <span className="flex flex-col">
            <p className="text-muted-foreground text-center">
              Vous n&apos;avez reçu le code ?
            </p>
            <Button
              type="button"
              variant="link"
              className="flex w-fit mx-auto items-center justify-center gap-2 text-base"
            >
              <RefreshCcw className="size-4" />
              Renvoyer le code
            </Button>
          </span>
        </>
        <Link
          href="/login"
          className="btn btn-outline flex h-12 w-full items-center justify-center gap-2"
        >
          <ChevronLeft />
          Retour à la connexion
        </Link>
      </>
    </Form_layout>
  );
}
