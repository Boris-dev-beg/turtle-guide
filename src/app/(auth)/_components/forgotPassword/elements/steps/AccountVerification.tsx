"use client"
import Link from "next/link";
import { EntryZone } from "../../../shared/entry";
import Form_layout from "../components/form_layout";
import { ArrowRight, ChevronLeft, Mail } from "lucide-react";

export default function AccountVerification({
  OnClick,
}: {
  OnClick: () => void;
}) {
  return (
    <Form_layout
      title="Vérification de votre compte"
      description="Entrez votre email ou votre numéro de téléphone pour recevoir un lien
          de réinitialisation."
      icon={Mail}
    >
      <>
        <EntryZone
          placeholder="example@emai.com"
          label="Email"
          icon={Mail}
          type="email"
        />
        <button
          type="button"
          onClick={OnClick}
          className="btn btn-primary flex h-12 w-full items-center justify-center gap-2"
        >
          Envoyer le lien de réinitialisation
          <ArrowRight className="size-5" />
        </button>
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
