import { Skeleton } from "@/components/ui/skeleton";

export const QuestionsSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-5 rounded-sm border border-border border-l-4 border-l-brand-green-soft bg-card p-5 sm:p-6">
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
            className="flex items-start gap-3 rounded-sm border border-border bg-background p-4"
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
  );
};