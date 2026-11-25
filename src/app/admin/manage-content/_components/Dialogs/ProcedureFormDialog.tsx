"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { procedureSchema, type ProcedureInput, type AdminProcedureRow } from "@/lib/schemas/procedure.schema";
import { PROCEDURE_IMAGE_MAX_SIZE, PROCEDURE_IMAGE_TYPES } from "@/lib/schemas/procedure-image-upload.schema";
import ProcedureFields, { type ProcedureCategoryOption } from "./ProcedureFields";

export default function ProcedureFormDialog({
  open,
  procedure,
  categories,
  pending,
  error,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  procedure: AdminProcedureRow | null;
  categories: ProcedureCategoryOption[];
  pending: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: ProcedureInput) => Promise<void>;
}) {
  const [uploading, setUploading] = useState(false);
  const form = useForm<ProcedureInput>({
    resolver: zodResolver(procedureSchema),
    defaultValues: procedure
      ? { title: procedure.title, legalBasis: procedure.legalBasis, description: procedure.description, isActive: procedure.isActive, image: procedure.image, categoryId: procedure.categoryId }
      : { title: "", legalBasis: "", description: "", isActive: true, image: "", categoryId: "" },
  });
  const isActive = useWatch({ control: form.control, name: "isActive" });
  const imageUrl = useWatch({ control: form.control, name: "image" });
  const dialogPending = pending || uploading;

  const uploadImage = async (file: File | null) => {
    if (!file) return;
    form.clearErrors("image");

    if (!(PROCEDURE_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      form.setError("image", { message: "Choisissez une image JPG, PNG, WebP ou AVIF." });
      return;
    }
    if (file.size > PROCEDURE_IMAGE_MAX_SIZE) {
      form.setError("image", { message: "L'image ne peut pas dépasser 5 Mo." });
      return;
    }

    setUploading(true);
    try {
      const signedResponse = await fetch("/api/admin/procedure-images/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType: file.type, size: file.size }),
      });
      const signedPayload = await signedResponse.json() as {
        token?: string;
        expire?: number;
        signature?: string;
        publicKey?: string;
        folder?: string;
        fileName?: string;
        error?: string;
      };
      if (!signedResponse.ok || !signedPayload.token || !signedPayload.expire || !signedPayload.signature || !signedPayload.publicKey || !signedPayload.folder || !signedPayload.fileName) {
        throw new Error(signedPayload.error || "Impossible de préparer le téléversement.");
      }

      const uploadBody = new FormData();
      uploadBody.set("file", file);
      uploadBody.set("fileName", signedPayload.fileName);
      uploadBody.set("folder", signedPayload.folder);
      uploadBody.set("token", signedPayload.token);
      uploadBody.set("expire", String(signedPayload.expire));
      uploadBody.set("signature", signedPayload.signature);
      uploadBody.set("publicKey", signedPayload.publicKey);

      const uploadedResponse = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: uploadBody,
      });
      const uploadedPayload = await uploadedResponse.json() as { url?: string; message?: string; help?: string };
      if (!uploadedResponse.ok || !uploadedPayload.url) {
        throw new Error(uploadedPayload.message || "ImageKit n'a pas accepté l'image. Vérifiez les clés et les limites de votre compte.");
      }

      form.setValue("image", uploadedPayload.url, { shouldDirty: true, shouldValidate: true });
    } catch (error) {
      form.setError("image", { message: error instanceof Error ? error.message : "Le téléversement a échoué. Réessayez." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !dialogPending && onOpenChange(nextOpen)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-5! scrollbar-thin sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl! font-bold! text-brand-ink">{procedure ? "Modifier la procédure" : "Nouvelle procédure"}</DialogTitle>
          <DialogDescription>Renseignez les informations affichées dans le parcours public. Les champs sont vérifiés avant enregistrement.</DialogDescription>
        </DialogHeader>

        {categories.length === 0 ? (
          <div className="space-y-4">
            <p role="status" className="rounded-sm border border-border bg-muted p-4 text-sm leading-6 text-brand-ink-muted">Créez d&apos;abord une catégorie pour pouvoir rattacher cette procédure.</p>
            <Link href="/admin/manage-content/categories" className="btn btn-primary inline-flex min-h-11 items-center">Gérer les catégories</Link>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <ProcedureFields
              register={form.register}
              errors={form.formState.errors}
              categories={categories}
              isActive={isActive}
              onActiveChange={(value) => form.setValue("isActive", value, { shouldDirty: true, shouldValidate: true })}
              imageUrl={imageUrl}
              uploading={uploading}
              onImageFile={uploadImage}
            />
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" disabled={dialogPending} onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit" disabled={dialogPending} className="bg-brand-green text-white hover:bg-brand-green-dark">
                {uploading ? "Téléversement…" : pending ? "Enregistrement…" : procedure ? "Enregistrer les modifications" : "Créer la procédure"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
