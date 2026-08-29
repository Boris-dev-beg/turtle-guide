"use client";
import Form_layout from "../components/form_layout";
import { ChevronLeft, MailCheck, RefreshCcw } from "lucide-react";
import { EntryOTPZone } from "../../../shared/entry";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useForgotPasswordStore } from "../../store/forgotPassword.store";
import {
  CodeOTPSchema,
  CodeOTPSchemaType,
} from "@/app/(auth)/_schema/forgotPassword.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CodeVerfication({ OnClick }: { OnClick: () => void }) {
  // ! States
  const { verifyPasswordOtp } = useAuth();
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
    console.log("Complete OPT", data);
    try {
      const otp = data.code;
      await verifyPasswordOtp.mutateAsync({
        email,
        otp,
      });

      console.log("Code OTP:", otp);
      setOtp(otp);
      OnClick();
    } catch (error) {
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
