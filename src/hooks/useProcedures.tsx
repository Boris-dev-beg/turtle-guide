"use client";
import { getAllProcedures, getByCategory, getPopular } from "@/lib/procedures";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useProcedures() {
  const {
    data: procedures,
    isLoading: proceduresLoading,
    isError: proceduresError,
  } = useQuery({
    queryKey: ["procedures"],
    queryFn: async () => await getAllProcedures(),
  });

  const {
    data: PopularProcedures,
    isLoading: popularLoading,
    isError: popularError,
  } = useQuery({
    queryKey: ["Popular Procedures"],
    queryFn: async () => await getPopular(),
  });

  const [category, setCategory] = useState<string>("");
  const { data: proceduresByCategory, isLoading: proceduresByCategoryLoading } =
    useQuery({
      queryKey: ["Procedure by category", category],
      queryFn: async () => await getByCategory(category),
      enabled: !!category,
    });

  return {
    procedures,
    PopularProcedures,
    isLoading: proceduresLoading,
    proceduresByCategory,
    proceduresByCategoryLoading,
    popularLoading,
    popularError,
    proceduresError,
    setCategory,
  };
}
