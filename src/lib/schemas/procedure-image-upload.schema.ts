import { z } from "zod";

export const PROCEDURE_IMAGE_MAX_SIZE = 5 * 1024 * 1024;
export const PROCEDURE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

export const procedureImageUploadRequestSchema = z.object({
  contentType: z.enum(PROCEDURE_IMAGE_TYPES),
  size: z.number().int().positive().max(PROCEDURE_IMAGE_MAX_SIZE),
});

export const procedureImageUploadConfirmationSchema = procedureImageUploadRequestSchema.extend({
  key: z.string().regex(/^procedures\/[a-f\d-]+\.(jpg|png|webp|avif)$/i, "Clé d'image invalide."),
});

export const procedureImageExtensions: Record<(typeof PROCEDURE_IMAGE_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
