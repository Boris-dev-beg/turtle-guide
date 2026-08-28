"use client";
import Form_layout from "../components/form_layout";
import { ArrowRight, Eye, LockKeyhole } from "lucide-react";
import { EntryZone } from "../../../shared/entry";
import { Controller, useFormContext } from "react-hook-form";
import { ForgotPasswordType } from "@/app/(auth)/_schema/forgotPassword.schema";

export default function NewPassword() {
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useFormContext<ForgotPasswordType>();

  const submit = handleSubmit(async (data) => {
    // API reset password
    console.log("Datas:", data);
  });
  return (
    <Form_layout title="Nouveau mot de passe" icon={LockKeyhole}>
      <>
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <EntryZone
              placeholder="********"
              label="Nouveau mot de passe"
              fieldState={fieldState}
              field={field}
              icon={LockKeyhole}
              type="password"
              icon2={Eye}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <EntryZone
              placeholder="********"
              label="Confirmer le mot de passe"
              field={field}
              fieldState={fieldState}
              icon={LockKeyhole}
              type="passeword"
              icon2={Eye}
            />
          )}
        />
        <button
          type="button"
          onClick={submit}
          disabled={isSubmitting}
          className="btn btn-primary flex h-12 w-full items-center justify-center gap-2"
        >
          {isSubmitting
            ? "Réinitialisation..."
            : "Réinitialiser le mot de passe"}
          <ArrowRight className="size-5" />
        </button>
      </>
    </Form_layout>
  );
}
