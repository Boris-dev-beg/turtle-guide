import "server-only";

import { createHmac, randomUUID } from "node:crypto";
import type { z } from "zod";
import type { procedureImageUploadRequestSchema } from "@/lib/schemas/procedure-image-upload.schema";
import { procedureImageExtensions } from "@/lib/schemas/procedure-image-upload.schema";

type ProcedureImageUpload = z.infer<typeof procedureImageUploadRequestSchema>;

const IMAGEKIT_UPLOAD_FOLDER = "/turtleguide-images";

function getImageKitConfig() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    throw new Error("La configuration ImageKit est incomplète.");
  }

  return { publicKey, privateKey };
}

export function createProcedureImageUploadAuth(input: ProcedureImageUpload) {
  const { publicKey, privateKey } = getImageKitConfig();
  const token = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 5 * 60;
  const signature = createHmac("sha1", privateKey)
    .update(`${token}${expire}`)
    .digest("hex");

  return {
    token,
    expire,
    signature,
    publicKey,
    folder: IMAGEKIT_UPLOAD_FOLDER,
    fileName: `procedure-${randomUUID()}.${procedureImageExtensions[input.contentType]}`,
  };
}
