"use client"; 
import { NeededProcedure } from "@/app/api/procedures/_types/type"; 
import { useCallback, useEffect, useState } from "react"; 

export function useProcedures() { 
  // ! States 
  // ? All Procedures 
  const [procedures, setProcedures] = useState<NeededProcedure[]>([]); 
  // ? Popular procedures 
  const [Popularprocedures, setPopularProcedures] = useState<NeededProcedure[]>( 
    [], 
  ); 
  // ? All Procedures 
  const [proceduresByCategory, setProceduresByCategory] = useState< 
    NeededProcedure[] 
  >([]); 
  const [loading, setLoading] = useState(true); 

  // ! Functions 
  useEffect(() => { 
    async function fetchPosts() { 
      try { 
        const response = await fetch("/api/procedures"); 
        const response_popular = await fetch("/api/procedures/populars"); 

        const data: NeededProcedure[] = await response.json(); 

        const data_popular: NeededProcedure[] = await response_popular.json(); 

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

  // ? Getting By Category 
  const getByCategory = useCallback(async (category: string) => { 
  setLoading(true); 

  try { 
    const response = await fetch( 
      `/api/procedures/${encodeURIComponent(category)}` 
    ); 

    if (!response.ok) { 
      throw new Error("Erreur lors de la récupération des procédures"); 
    } 

    const data: NeededProcedure[] = await response.json(); 

    setProceduresByCategory(data); 
  } catch (err) { 
    console.error( 
      "Erreur lors de la récupération des procédures par catégorie:", 
      err 
    ); 
  } finally { 
    setLoading(false); 
  } 
}, []); 

  // ! Render 
  return { 
    procedures, 
    Popularprocedures, 
    proceduresByCategory, 

    loading, 

    getByCategory, 
  }; 
} 
