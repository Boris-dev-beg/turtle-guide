"use client";
import { getAll } from "@/lib/categories";
import { useQuery } from "@tanstack/react-query";

type CategoryWithProcedureCount = {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  _count: {
    procedures: number;
  };
};

export function useCategories() {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery<CategoryWithProcedureCount[]>({
    queryKey: ["categories"],
    queryFn: async () => await getAll(),
  });

  return {
    categories,
    loading: isLoading,
    error: isError,
  };
}
