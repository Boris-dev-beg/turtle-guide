"use client";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ! Skeleton
export const CardLoading = () => {
  return (
    <Card className="w-full gap-2 rounded-sm">
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

export const FoundedProceduces = ({loading, length}: {loading: boolean, length: number}) => {
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
