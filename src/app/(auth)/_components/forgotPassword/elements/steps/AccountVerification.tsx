"use client";
import Link from "next/link";
import { EntryZone } from "../../../shared/entry";
import Form_layout from "../components/form_layout";
import { ArrowRight, ChevronLeft, Mail } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { ForgotPasswordType } from "@/app/(auth)/_schema/forgotPassword.schema";

export default function AccountVerification({
  OnClick,
}: {
  OnClick: () => void;
}) {
  const {
    control
  } = useFormContext<ForgotPasswordType>();
  return (
    <Form_layout
      title="Vérification de votre compte"
      description="Entrez votre email ou votre numéro de téléphone pour recevoir un lien
          de réinitialisation."
      icon={Mail}
    >
      <>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <EntryZone
                placeholder="example@emai.com"
                label="Email"
                field={field}
                fieldState={fieldState}
                icon={Mail}
                type="email"
              />
              <button
                type="button"
                onClick={OnClick}
                disabled={!field.value || fieldState.invalid}
                className="btn btn-primary flex h-12 w-full items-center justify-center gap-2 disabled:cursor-not-allowed!"
              >
                Envoyer le lien de réinitialisation
                <ArrowRight className="size-5" />
              </button>
            </>
          )}
        />
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
