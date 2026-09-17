"use client";
import { getAllProcedures, getByCategory, getPopular } from "@/lib/procedures";
import { useQuery } from "@tanstack/react-query";

export function useProcedures() {
  // ! States
  // ? All Procedures
  const { data: procedures, isLoading: proceduresLoading } = useQuery({
    queryKey: ["procedures"],
    queryFn: async () => await getAllProcedures(),
  });
  
  // ? Popular procedures
  const { data: PopularProcedures, isLoading: popularLoading } = useQuery({
    queryKey: ["Popular Procedures"],
    queryFn: async () => await getPopular(),
  });

  // ? Getting By Category
  const { data: proceduresByCategory } = useQuery({
    queryKey: ["Procedure by category"],
    queryFn: async () => await getByCategory(""),
  });

  // ! Functions
  // ! Render
  return {
    procedures,
    PopularProcedures,
    isLoading: proceduresLoading ,
    proceduresByCategory,
    popularLoading,

    getByCategory,
  };
}
