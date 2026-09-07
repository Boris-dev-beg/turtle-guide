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


export function FolderDetailsLoading() {
  return (
    <main className="wrapper w-full py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="mb-5 h-5 w-40" />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-72" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>

            <Skeleton className="h-4 w-96 max-w-full" />
            <Skeleton className="h-4 w-125 max-w-full" />
          </div>

          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left */}
        <div className="min-w-0 space-y-5">
          {/* Steps */}
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-2 h-4 w-80 max-w-full" />

            <div className="mt-6 space-y-7">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex gap-4">
                  <Skeleton className="size-8 shrink-0 rounded-full" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-64 max-w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informations */}
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <Skeleton className="h-6 w-56" />

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="size-9 shrink-0 rounded-full" />

                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-40 max-w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <aside className="min-w-0 space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-5 h-20 w-full rounded-lg" />
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <Skeleton className="h-5 w-40" />

            <div className="mt-5 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </div>

          <Skeleton className="h-32 w-full rounded-xl" />
        </aside>
      </div>
    </main>
  );
}