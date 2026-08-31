import {
  ArrowLeft,
  ArrowRight,
  FilePlus2,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function EmptyFolders() {
  return (
    <main className="flex flex-col min-w-0 w-full">
      {/* Retour */}
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Retour à l&apos;accueil
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mes dossiers
          </h1>

          <p className="text-muted-foreground mt-1">
            Retrouvez ici tous vos dossiers administratifs.
          </p>
        </div>

        <Link
          href="/categories"
          className="btn btn-primary w-full sm:w-auto"
        >
          <Plus className="size-5" />
          Nouveau dossier
        </Link>
      </div>

      {/* Empty state */}
      <section className="turtle-card flex flex-col items-center justify-center text-center min-h-105 sm:min-h-120">
        {/* Icon */}
        <div className="flex items-center justify-center size-20 rounded-2xl bg-accent text-primary mb-6">
          <FilePlus2 className="size-10" />
        </div>

        {/* Text */}
        <div className="max-w-lg">
          <h2 className="text-2xl font-bold tracking-tight">
            Vous n&apos;avez pas encore créé de dossier
          </h2>

          <p className="text-muted-foreground leading-6 mt-3">
            Commencez votre première démarche administrative en créant
            un dossier. Vous pourrez ensuite suivre son avancement,
            retrouver vos documents et consulter vos réponses.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/categories"
          className="btn btn-primary mt-6"
        >
          <Plus className="size-5" />
          Créer mon premier dossier
          <ArrowRight className="size-4" />
        </Link>

        {/* Hint */}
        <div className="flex items-center gap-2 mt-5 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          <span>
            Cela ne prend que quelques minutes.
          </span>
        </div>
      </section>
    </main>
  );
}