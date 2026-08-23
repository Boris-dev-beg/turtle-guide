"use client";
import { Request } from "@/generated/prisma/client";
import { useEffect, useState } from "react";

export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/requests");

        // if (!response.ok) {
        //   throw new Error("Erreur lors de la récupération des Requetes");
        // }
        console.log("response in the fetch function:", response)

        const data: Request[] = await response.json();

        setRequests(data);
      }
      catch(err){
        console.error("Erreur lors de la récupération des Requetes:",err)
      }
       finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return {
    requests,
    loading,
  };
}
