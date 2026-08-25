"use client";
import { useEffect, useState } from "react";

export function useProcedures() {
  // ! States
  // ? All Procedures
  const [procedures, setProcedures] = useState<
    {
      title: string;
      description: string;
      category: {
        name: string;
      };
    }[]
  >([]);
  // ? Popular procedures
  const [Popularprocedures, setPopularProcedures] = useState<
    {
      id: string;
      title: string;
      description: string;
      category: {
        name: string;
      };
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // ! Functions
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/procedures");
        const response_popular = await fetch("api/procedures/populars");

        const data: {
          title: string;
          description: string;
          category: {
            name: string;
          };
        }[] = await response.json();

        const data_popular: {
          id: string;
          title: string;
          description: string;
          category: {
            name: string;
          };
        }[] = await response_popular.json();

        setProcedures(data);
        setPopularProcedures(data_popular);
      } catch (err) {
        console.error("Erreur lors de la récupération des Procedures:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);
  
  // ! Render
  return {
    procedures,
    Popularprocedures,

    loading,
  };
}
