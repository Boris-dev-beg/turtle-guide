"use client";

import { useMutation } from "@tanstack/react-query";
import { emailOtp, signIn, signUp } from "@/lib/auth-client";

export function useAuth() {
  const login = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  const signup = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
    }) => {
      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  // Envoie l'OTP
  const requestPasswordReset = useMutation({
    mutationFn: async (email: string) => {
      const { data, error } = await emailOtp.requestPasswordReset({
        email,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  // Vérifie l'OTP
  const verifyPasswordOtp = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const { data, error } = await emailOtp.checkVerificationOtp({
        email,
        otp,
        type: "forget-password",
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  // Change le mot de passe
  const resetPassword = useMutation({
    mutationFn: async ({
      email,
      otp,
      password,
    }: {
      email: string;
      otp: string;
      password: string;
    }) => {
      const { data, error } = await emailOtp.resetPassword({
        email,
        otp,
        password,
      });

      console.log("Password:", password);
      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  return {
    login,
    signup,
    requestPasswordReset,
    verifyPasswordOtp,
    resetPassword,
  };
}
