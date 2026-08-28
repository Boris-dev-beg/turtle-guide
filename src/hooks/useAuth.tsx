"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, signUp } from "@/lib/auth-client";

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

  return {
    login,
    signup,
  };
}
