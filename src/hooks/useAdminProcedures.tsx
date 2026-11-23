"use client";

import { createProcedure, deleteProcedure, updateProcedure } from "@/lib/procedures";
import { ProcedureInput } from "@/types/type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useAdminProcedures() {
  const router = useRouter();
  const refreshPage = () => router.refresh();

  const createMutation = useMutation({
    mutationFn: async (input: ProcedureInput) => {
      const result = await createProcedure(input);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: refreshPage,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: ProcedureInput }) => {
      const result = await updateProcedure(id, input);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: refreshPage,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteProcedure(id);
      if (!result.success) throw new Error(result.message);
      return result.message;
    },
    onSuccess: refreshPage,
  });

  return {
    createProcedure: createMutation.mutateAsync,
    updateProcedure: updateMutation.mutateAsync,
    deleteProcedure: deleteMutation.mutateAsync,
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}
