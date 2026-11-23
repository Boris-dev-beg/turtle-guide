"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminProcedureRow, ProcedureInput } from "@/types/type";

/** A coder concretement plutard */
export default function ProcedureFormDialog({
  open,
  procedure,
  pending,
  error,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  procedure: AdminProcedureRow | null;
  pending: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: ProcedureInput) => Promise<void>;
}) {
  const [values, setValues] = useState<ProcedureInput>(() =>
    procedure
      ? {
          title: procedure.title,
          legalBasis: procedure.legalBasis,
          description: procedure.description,
          isActive: procedure.isActive,
          image: procedure.image,
          categoryId: procedure.categoryId,
        }
      : {
          title: "",
          legalBasis: "",
          description: "",
          isActive: true,
          image: "",
          categoryId: "",
        },
  );

  const updateField = <K extends keyof ProcedureInput>(
    key: K,
    value: ProcedureInput[K],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => !pending && onOpenChange(nextOpen)}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg scrollbar-thin p-5!">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl! text-brand-ink font-bold!">
            {procedure ? "Modifier la procedure" : "Nouvelle procedure"}
          </DialogTitle>
          <DialogDescription>
            Le nom et le slug sont visibles dans l&apos;espace public. Le slug
            doit rester unique.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={async () => await onSubmit(values)}
          className="space-y-4"
        >
          {/* <CategoryFields values={values} onChange={updateField} /> */}

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="bg-brand-green text-white hover:bg-brand-green-dark"
            >
              {pending
                ? "Enregistrement…"
                : procedure
                  ? "Enregistrer les modifications"
                  : "Créer la procédure"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
