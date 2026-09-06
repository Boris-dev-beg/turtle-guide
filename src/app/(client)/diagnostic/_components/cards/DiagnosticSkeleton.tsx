import { Skeleton } from "@/components/ui/skeleton"; 

const DiagnosticSkeleton = () => { 
  return ( 
    <> 
      {/* First Side */} 
      <div className="h-fit lg:h-full w-full md:w-120 flex flex-col gap-4 py-4 px-2 border-r border-border bg-secondary/20 rounded-xl"> 
        {/* Back */} 
        <div className="flex items-center gap-2 px-2 py-2"> 
          <Skeleton className="size-4 rounded" /> 
          <Skeleton className="h-4 w-28" /> 
        </div> 

        {/* Selected Procedure */} 
        <div className="flex gap-3 items-start py-3 px-2 rounded-xl bg-background shadow-xs"> 
          <Skeleton className="size-10 shrink-0 rounded-lg" /> 

          <div className="w-full flex flex-col gap-2"> 
            <Skeleton className="h-3 w-36" /> 
            <Skeleton className="h-5 w-4/5" /> 
            <Skeleton className="h-5 w-3/5" /> 
          </div> 
        </div> 

        {/* Steps Taken */} 
        <div className="flex flex-col gap-3"> 
          <div className="flex items-center gap-2"> 
            <Skeleton className="size-4 rounded" /> 
            <Skeleton className="h-4 w-32" /> 
          </div> 

          <div className="flex flex-col gap-1 pl-1"> 
            {Array.from({ length: 4 }).map((_, index) => ( 
              <div className="flex gap-3 w-full" key={index}> 
                <div className="flex flex-col items-center gap-2"> 
                  <Skeleton className="size-5 rounded-full" /> 

                  {index < 3 && <Skeleton className="h-6 w-0.5" />} 
                </div> 

                <div className="flex flex-col gap-2 mb-auto pb-2 w-full"> 
                  <Skeleton className="h-4 w-4/5" /> 
                  <Skeleton className="h-3 w-3/5" /> 
                </div> 
              </div> 
            ))} 
          </div> 
        </div> 

        {/* Help Box */} 
        <div className="mt-auto rounded-xl border border-border bg-background p-4 flex flex-col gap-3"> 
          <div className="flex items-center gap-2"> 
            <Skeleton className="size-7 rounded-lg" /> 
            <Skeleton className="h-4 w-28" /> 
          </div> 

          <Skeleton className="h-3 w-full" /> 
          <Skeleton className="h-3 w-4/5" /> 

          <Skeleton className="h-9 w-full rounded-lg" /> 
        </div> 
      </div> 

      {/* Questions Side */} 
      <div className="flex flex-col gap-5 p-5 rounded-xl border border-border bg-background w-full shadow-xs"> 
        {/* Indication */} 
        <div className="flex items-center justify-between"> 
          <div className="flex items-center gap-3"> 
            <Skeleton className="h-9 w-28 rounded-lg" /> 
            <span className="h-4 w-px bg-border" /> 
            <Skeleton className="h-4 w-32" /> 
          </div> 
        </div> 

        {/* Question description */} 
        <div className="flex flex-col gap-3 pb-2"> 
          <Skeleton className="h-9 w-4/5" /> 
          <Skeleton className="h-4 w-full max-w-3xl" /> 
          <Skeleton className="h-4 w-3/5 max-w-3xl" /> 
        </div> 

        {/* Answer options */} 
        <div className="grid gap-3 w-full px-1"> 
          {Array.from({ length: 3 }).map((_, index) => ( 
            <div 
              key={index} 
              className="flex items-start gap-3 p-4 border border-border rounded-lg bg-card" 
            > 
              <Skeleton className="size-6 shrink-0 rounded-full" /> 

              <div className="flex flex-col gap-2 w-full"> 
                <Skeleton className="h-5 w-1/3" /> 
                <Skeleton className="h-4 w-4/5" /> 
                <Skeleton className="h-4 w-3/5" /> 
              </div> 
            </div> 
          ))} 
        </div> 

        {/* Actions */} 
        <div className="flex flex-col sm:flex-row w-full items-center justify-between border-t border-border pt-4 mt-1 gap-3"> 
          <Skeleton className="h-11 w-full sm:w-52 rounded-lg" /> 
          <Skeleton className="h-11 w-full sm:w-40 rounded-lg" /> 
        </div> 
      </div> 

      {/* Great to know */} 
      <div className="mb-auto rounded-xl border border-border bg-background p-4 flex flex-col gap-3"> 
        <div className="flex items-center gap-2"> 
          <Skeleton className="size-7 rounded-lg" /> 
          <Skeleton className="h-4 w-28" /> 
        </div> 

        <Skeleton className="h-3 w-full" /> 
        <Skeleton className="h-3 w-4/5" /> 

        <Skeleton className="h-9 w-full rounded-lg" /> 
      </div> 
    </> 
  ); 
}; 

export default DiagnosticSkeleton; 
