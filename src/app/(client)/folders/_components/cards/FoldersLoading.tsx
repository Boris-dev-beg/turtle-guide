import { Skeleton } from "@/components/ui/skeleton"

export function FoldersLoading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-border bg-card/80 p-5"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Informations du dossier */}
            <div className="flex min-w-0 gap-4">
              <Skeleton className="size-12 shrink-0 rounded-full" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                <Skeleton className="h-4 w-64" />

                <Skeleton className="h-3 w-48" />
              </div>
            </div>

            {/* Action */}
            <Skeleton className="h-10 w-44 shrink-0 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}