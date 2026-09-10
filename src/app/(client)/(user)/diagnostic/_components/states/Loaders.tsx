import { Skeleton } from "@/components/ui/skeleton"; 


export function DiagnosticLoading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="mx-auto w-full max-w-3xl py-5"
    >

      <div className="mb-6 flex items-start gap-4">

        <div>
          <h1 className="font-body text-3xl md:text-4xl font-semibold text-brand-ink">
            Préparation de votre dossier
          </h1>

          <p className="mt-1 text-sm md:text-base leading-5 md:leading-6 text-brand-ink-muted">
            Nous préparons votre diagnostic et vérifions votre dossier.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-border bg-card p-7 sm:p-8">

        <div className="flex items-center gap-3 border-b border-border pb-5">
          <Skeleton className="size-12 md:size-15 rounded-lg" />

          <div className="flex-1 space-y-2">
            {/* Folder's Name */}
            <Skeleton className="h-5 w-40" />

            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Folder infos */}

        <div className="mt-5 space-y-5">
          <div className="flex items-center justify-between gap-6">
            <span className="text-brand-ink-muted">
              Nom
            </span>

            <Skeleton className="h-5 w-36" />
          </div>

          <div className="flex items-center justify-between gap-6">
            <span className="text-brand-ink-muted">
              Statut
            </span>

            <Skeleton className="h-7 w-24 rounded-full" />
          </div>

          <div className="flex items-center justify-between gap-6">
            <span className="text-brand-ink-muted">
              Créé le
            </span>

            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </div>
    </section>
  );
}