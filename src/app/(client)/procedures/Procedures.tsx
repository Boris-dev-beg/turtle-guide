"use client";
import { Procedure_card } from "@/components/card/Procedures.card";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProcedures } from "@/hooks/useProcedures";
import { useProceducesStore } from "@/store/categories.store";
import { useEffect } from "react";

export function Procedures() {
  // ! States
  const { procedures, loading } = useProcedures();
  const { setLoading, setLength } = useProceducesStore();

  // ! Functions
  // if (!loading) {
  //   setLoading(false);
  //   setLength(procedures.length);
  // }

  useEffect(() => {
    const handleChange = () => {
      setLoading(false);
      setLength(procedures.length);
    };
    handleChange();
  }, [loading, procedures, setLength, setLoading]);
  console.log("Procedures:", procedures);

  // ! Render
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-md:w-full gap-4">
      {loading ? (
        <>
          <CardLoading />
          <CardLoading />
          <CardLoading />
          <CardLoading />
        </>
      ) : (
        <>
          {procedures.map((proc, index) => (
            <Procedure_card key={index} procedure={proc} />
          ))}
        </>
      )}
    </div>
  );
}

// ! Skeleton
const CardLoading = () => {
  return (
    <Card className="w-full gap-2">
      <CardHeader className="flex items-center gap-2">
        <Skeleton className="size-12 min-w-12 p-2 rounded-md" />
        <Skeleton className="h-6 w-full" />
      </CardHeader>
      <CardDescription className="px-4">
        <Skeleton className="h-12 w-full" />
      </CardDescription>
      <div className="flex items-center px-4 h-10 mt-auto">
        <Skeleton className=" h-6 w-25 bg-turtle-primary-light py-1 px-3 rounded-full" />
        <Skeleton className="ml-auto h-6 w-8" />
      </div>
    </Card>
  );
};

// ! Categorie Length

export const FoundedProceduces = () => {
  const { loading, length } = useProceducesStore();
  return (
    <>
      {loading ? (
        <Skeleton className="h-6 w-30" />
      ) : (
        <p className="text-turtle-text-muted text-sm ml-4 hidden lg:block">
          {length} procédures disponibles
        </p>
      )}
    </>
  );
};
