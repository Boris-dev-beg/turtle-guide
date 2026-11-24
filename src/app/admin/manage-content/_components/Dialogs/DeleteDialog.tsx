"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminCategoryRow, AdminProcedureRow } from "@/types/type";

export default function DeleteDialog({
  label,
  name,
  element,
  pending,
  error,
  onOpenChange,
  onConfirm,
}: {
  element: (AdminCategoryRow | null) | (AdminProcedureRow | null);
  label: string;
  name: string;
  pending: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}) {
  return (
    <Dialog
      open={Boolean(element)}
      onOpenChange={(open) => !pending && onOpenChange(open)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-brand-ink">
            Supprimer la {label} ?
          </DialogTitle>
          <DialogDescription>
            La {label} « {name} » sera supprimée. Les {label}s qui contiennent
            des {label === "categorie" ? "procédures" : "questions"} ne peuvent
            pas être supprimées.
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
