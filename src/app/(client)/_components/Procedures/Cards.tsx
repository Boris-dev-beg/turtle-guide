"use client"; 
import { Card, CardDescription, CardHeader } from "@/components/ui/card"; 
import { Skeleton } from "@/components/ui/skeleton"; 

export const CardLoading = () => { 
  return ( 
    <Card className="flex min-h-53 w-full flex-col overflow-hidden rounded-2xl border-border/60 bg-card p-5 shadow-sm"> 
      <CardHeader className="flex items-center gap-3 p-0"> 
        <Skeleton className="size-12 shrink-0 rounded-xl" /> 
        <Skeleton className="h-5 w-3/4 rounded-md" /> 
      </CardHeader> 

      <CardDescription className="mt-5 space-y-2 p-0"> 
        <Skeleton className="h-4 w-full rounded-md" /> 
        <Skeleton className="h-4 w-5/6 rounded-md" /> 
        <Skeleton className="h-4 w-2/3 rounded-md" /> 
      </CardDescription> 

      <div className="mt-auto flex items-center justify-between pt-5"> 
        <Skeleton className="h-7 w-24 rounded-full" /> 
        <Skeleton className="size-8 rounded-full" /> 
      </div> 
    </Card> 
  ); 
}; 

export const FoundedProceduces = ({ 
  loading, 
  length, 
}: { 
  loading: boolean; 
  length: number; 
}) => { 
  return loading ? ( 
    <Skeleton className="ml-4 h-5 w-36 rounded-md" /> 
  ) : ( 
    <div className="flex items-center gap-2 text-muted-foreground"> 
      <span className="font-semibold text-foreground">{length}</span> 
      <span>{length > 1 ? "procédures disponibles" : "procédure disponible"}</span> 
    </div> 
  ); 
}; 