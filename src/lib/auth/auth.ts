import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../prisma";
import { emailOTP } from "better-auth/plugins";
import { sendPasswordResetOTP } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300, // 5 minutes

      async sendVerificationOTP({ email, otp, type }) {
        if (type === "forget-password") {
          await sendPasswordResetOTP(email, otp);
        }
      },
    }),
  ],
});
