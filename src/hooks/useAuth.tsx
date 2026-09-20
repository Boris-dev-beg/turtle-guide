"use client";

import { useMutation } from "@tanstack/react-query";
import {
  emailOtp,
  sendVerificationEmail,
  signIn,
  signOut,
  signUp,
} from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  // ! Log In
  const login = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      return result;
    },
  });

  // ! Log In with Social
  const signInWithSocial = useMutation({
    mutationFn: async ({
      provider,
      requestSignUp = false,
    }: {
      provider: "google";
      requestSignUp?: boolean;
    }) => {
      const result = await signIn.social({
        provider,
        requestSignUp,
        callbackURL: requestSignUp ? "/login?oauth=login" : "/",
        newUserCallbackURL: "/login?oauth=signup",
        errorCallbackURL: "/login?authError=oauth",
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  // ! Log Out
  const logout = async () => {
    return await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  // ! Sing Up
  const signup = useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      password: string;
    }) => {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/profile",
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      const verification = await sendVerificationEmail({
        email: data.email,
        callbackURL: "/login?verified=success",
      });

      if (verification.error) {
        throw new Error(verification.error.message);
      }

      return result.data;
    },
  });

  const resendVerificationEmail = useMutation({
    mutationFn: async (email: string) => {
      const result = await sendVerificationEmail({
        email,
        callbackURL: "/login?verified=success",
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
  });

  // ! Envoie l'OTP
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

  // ! Vérifie l'OTP
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

  // ! Change le mot de passe
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

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  return {
    login,
    signInWithSocial,
    logout,
    signup,
    resendVerificationEmail,
    requestPasswordReset,
    verifyPasswordOtp,
    resetPassword,
  };
}
