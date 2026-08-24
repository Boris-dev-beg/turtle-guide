"use client";
import { Category } from "@/generated/prisma/client";
import { useEffect, useState } from "react";

export function useCategories() {
  // ! States
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  // ! Functions
  useEffect(() => {

    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data: Category[] = await response.json();

        setCategories(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des Categories:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);


  return {
    categories,
    loading,

  };
}
