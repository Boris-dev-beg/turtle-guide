import { z } from "zod";

export const donationRequestSchema = z.object({
  amount: z.number().int().min(100).max(10_000_000),
  method: z.enum(["card", "kpay"]),
  name: z.string().trim().max(100).optional(),
  email: z.email().trim().optional().or(z.literal("")),
  message: z.string().trim().max(500).optional(),
});

export type DonationRequest = z.infer<typeof donationRequestSchema>;
