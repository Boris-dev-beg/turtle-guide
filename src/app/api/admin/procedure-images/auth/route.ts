import { NextResponse } from "next/server";
import { AdminAuthorizationError, requireAdmin } from "@/lib/admin/require-admin";
import { procedureImageUploadRequestSchema } from "@/lib/schemas/procedure-image-upload.schema";
import { createProcedureImageUploadAuth } from "@/lib/storage/imagekit";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AdminAuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.code === "UNAUTHENTICATED" ? 401 : 403 });
    }
    return NextResponse.json({ error: "Vérification des droits impossible." }, { status: 500 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = procedureImageUploadRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Image invalide." }, { status: 400 });
  }

  try {
    const uploadAuth = createProcedureImageUploadAuth(parsed.data);
    return NextResponse.json(uploadAuth, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Impossible de créer les paramètres d'upload ImageKit:", error);
    return NextResponse.json({ error: "Stockage d'images non configuré ou indisponible." }, { status: 503 });
  }
}
