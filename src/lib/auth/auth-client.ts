"use client";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const {
  signIn,
  signUp,
  signOut,
  emailOtp,
  sendVerificationEmail,
  useSession,
} = createAuthClient({
  plugins: [emailOTPClient()],
});
