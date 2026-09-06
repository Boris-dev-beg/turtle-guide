import { Skeleton } from "@/components/ui/skeleton"; 

export default function LoadingStep() { 
  return ( 
    <div className="space-y-0"> 
      {[1, 2, 3].map((step) => ( 
        <div key={step} className="flex gap-4"> 
          {/* Indicateur + ligne */} 
          <div className="flex flex-col items-center"> 
            <Skeleton className="size-8 rounded-full" /> 
            <Skeleton className="w-0.5 flex-1 mt-2" /> 
          </div> 

          {/* Contenu */} 
          <div className="flex-1 pb-6"> 
            <div className="rounded-xl border border-border bg-card p-4"> 
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"> 
                <div className="flex-1"> 
                  {/* Titre */} 
                  <Skeleton className="h-5 w-3/4 rounded-md" /> 

                  {/* Description */} 
                  <div className="mt-2 space-y-2"> 
                    <Skeleton className="h-4 w-full rounded-md" /> 
                    <Skeleton className="h-4 w-5/6 rounded-md" /> 
                  </div> 

                  {/* Localisation */} 
                  <div className="flex items-center gap-2 mt-3"> 
                    <Skeleton className="size-4 rounded-full" /> 
                    <Skeleton className="h-4 w-40 rounded-md" /> 
                  </div> 
                </div> 
              </div> 
            </div> 
          </div> 
        </div> 
      ))} 
    </div> 
  ); 
} 
