"use client";
import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const { signIn, signUp, emailOtp, useSession } = createAuthClient({
  plugins: [emailOTPClient()],
});
