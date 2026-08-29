"use client";
import Form_layout from "../components/form_layout";
import { ArrowRight, Eye, LockKeyhole } from "lucide-react";
import { EntryZone } from "../../../shared/entry";
import { Controller, useForm } from "react-hook-form";
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/app/(auth)/_schema/forgotPassword.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useForgotPasswordStore } from "../../store/forgotPassword.store";

export default function NewPassword({ OnClick }: { OnClick: () => void }) {
  // ! States
  const email = useForgotPasswordStore((state) => state.email);
  const otp = useForgotPasswordStore((state) => state.otp);
  const setPassword = useForgotPasswordStore((state) => state.setPassword);

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // ! Functions
  const { resetPassword } = useAuth();

  const handleReset = async (data: ResetPasswordSchemaType) => {
    const password = data.password
    try {
      await resetPassword.mutateAsync({
        email,
        otp,
        password,
      });

      console.log("The new Password:", data.password);

      setPassword(data.password);
      OnClick();
    } catch (error) {
      console.error(error);
    }
  };

  // ! Render
  return (
    <Form_layout title="Nouveau mot de passe" icon={LockKeyhole}>
      <form onSubmit={form.handleSubmit(handleReset)} className="space-y-5">
        <Controller
          name="password"
          control={form.control}
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
          control={form.control}
          render={({ field, fieldState }) => (
            <EntryZone
              placeholder="********"
              label="Confirmer le mot de passe"
              field={field}
              fieldState={fieldState}
              icon={LockKeyhole}
              type="password"
              icon2={Eye}
            />
          )}
        />
        <button
          type="submit"
          disabled={resetPassword.isPending}
          className="btn btn-primary flex h-12 w-full items-center justify-center gap-2"
        >
          {resetPassword.isPending
            ? "Réinitialisation..."
            : "Réinitialiser le mot de passe"}
          <ArrowRight className="size-5" />
        </button>
      </form>
    </Form_layout>
  );
}
