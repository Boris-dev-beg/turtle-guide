"use client";
import Form_layout from "../layout/form_layout";
import { ChevronLeft, MailCheck, RefreshCcw } from "lucide-react";
import { EntryOTPZone } from "../../../_components/shared/entry";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useForgotPasswordStore } from "../../_store/forgotPassword.store";
import {
  CodeOTPSchema,
  CodeOTPSchemaType,
} from "@/app/(auth)/forgotPassword/schema/forgotPassword.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export default function CodeVerfication({ OnClick }: { OnClick: () => void }) {
  // ! States
  const { requestPasswordReset, verifyPasswordOtp } = useAuth();
  const email = useForgotPasswordStore((state) => state.email);
  const setOtp = useForgotPasswordStore((state) => state.setOtp);
  const form = useForm<CodeOTPSchemaType>({
    resolver: zodResolver(CodeOTPSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  // ! Functions
  const handleVerify = async (data: CodeOTPSchemaType) => {
    toast.loading("Vérification du code...", { id: "password-reset" });
    try {
      const otp = data.code;
      await verifyPasswordOtp.mutateAsync({
        email,
        otp,
      });

      setOtp(otp);
      toast.success("Code vérifié. Choisissez votre nouveau mot de passe.", {
        id: "password-reset",
      });
      OnClick();
    } catch (error) {
      toast.error("Code invalide ou expiré. Demandez un nouveau code.", {
        id: "password-reset",
      });
      console.error(error);
    }
  };
  // ! Render

  return (
    <Form_layout
      title="Code envoyé !"
      description={
        <>
          Nous vous avons envoyer un code à 6 chiffres à l&apos;addresse
          <br />
          <b className="text-primary font-semibold">{email}</b>, <br />
          Veuillez le saisir dans les cases ci-dessous pour continuer.
        </>
      }
      icon={MailCheck}
    >
      <>
        <form className="space-y-5">
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <EntryOTPZone
                field={field}
                fieldState={fieldState}
                label="Code de vérification"
                onComplete={() =>
                  form.handleSubmit(handleVerify, (e) => console.log(e))()
                }
              />
            )}
          />
          <span className="flex flex-col">
            <p className="text-muted-foreground text-center">
              Vous n&apos;avez reçu le code ?
            </p>
            <Button
              type="button"
              variant="link"
              disabled={requestPasswordReset.isPending}
              onClick={async () => {
                toast.loading("Envoi d'un nouveau code...", {
                  id: "password-reset",
                });
                try {
                  await requestPasswordReset.mutateAsync(email);
                  toast.success("Un nouveau code vient d'être envoyé.", {
                    id: "password-reset",
                  });
                } catch (error) {
                  toast.error("Impossible de renvoyer le code. Réessayez.", {
                    id: "password-reset",
                  });
                  console.error(error);
                }
              }}
              className="flex w-fit mx-auto items-center justify-center gap-2 text-base"
            >
              <RefreshCcw className="size-4" />
              Renvoyer le code
            </Button>
          </span>
        </form>
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
