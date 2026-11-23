"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminCategoryRow } from "@/types/type";

/** Demande confirmation avant suppression et affiche les erreurs métier renvoyées par le service. */
export default function CategoryDeleteDialog({
  category,
  pending,
  error,
  onOpenChange,
  onConfirm,
}: {
  category: AdminCategoryRow | null;
  pending: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}) {
  return (
    <Dialog
      open={Boolean(category)}
      onOpenChange={(open) => !pending && onOpenChange(open)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-brand-ink">
            Supprimer la catégorie ?
          </DialogTitle>
          <DialogDescription>
            La catégorie « {category?.name} » sera supprimée. Les catégories qui
            contiennent des procédures ne peuvent pas être supprimées.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? "Suppression…" : "Supprimer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
