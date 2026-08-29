"use client";
import Link from "next/link";
import { EntryZone } from "../../../shared/entry";
import Form_layout from "../components/form_layout";
import { ArrowRight, ChevronLeft, Mail } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  AccountVerificationSchema,
  AccountVerificationSchemaType,
} from "@/app/(auth)/_schema/forgotPassword.schema";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPasswordStore } from "../../store/forgotPassword.store";

export default function AccountVerification({
  OnClick,
}: {
  OnClick: () => void;
}) {
  // ! States
  const setEmail = useForgotPasswordStore((state) => state.setEmail);
  const form = useForm<AccountVerificationSchemaType>({
    resolver: zodResolver(AccountVerificationSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  // ! Functions
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (data: AccountVerificationSchemaType) => {
    try {
      await requestPasswordReset.mutateAsync(data.email);

      setEmail(data.email);
      OnClick()
    } catch (error) {
      console.error(error);
    }
  };

  // ! Render
  return (
    <Form_layout
      title="Vérification de votre compte"
      description="Entrez votre email ou votre numéro de téléphone pour recevoir un lien
          de réinitialisation."
      icon={Mail}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5" >
        <Controller
          name="email"
          control={form.control}
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
                type="submit"
                disabled={
                  !field.value ||
                  fieldState.invalid ||
                  requestPasswordReset.isPending
                }
                className="btn btn-primary flex h-12 w-full items-center justify-center gap-2 disabled:cursor-not-allowed!"
              >
                {requestPasswordReset.isPending
                  ? "Envoie..."
                  : "Envoyer le lien de réinitialisation"}
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
      </form>
    </Form_layout>
  );
}
