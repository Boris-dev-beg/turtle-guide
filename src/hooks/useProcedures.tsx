"use client";
import { useEffect, useState } from "react";

export function useProcedures() {
  const [procedures, setProcedures] = useState<
    {
      title: string;
      description: string;
      category: {
        name: string;
      };
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/procedures");

        const data: {
          title: string;
          description: string;
          category: {
            name: string;
          };
        }[] = await response.json();

        setProcedures(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des Procedures:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return {
    procedures,
    loading,
  };
}
