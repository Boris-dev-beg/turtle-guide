import { BackToHome } from "@/components/shared/links";
import { ArrowRight, FilePlus2, Plus } from "lucide-react";
import Link from "next/link";

export default function EmptyFolders() {
  return (
    <main className="flex flex-col min-w-0 w-full">
      {/* Retour */}
      <div className="mb-2 mt-1">
        <BackToHome />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Mes dossiers</h1>

          <p className="text-muted-foreground mt-1 text-[16px]">
            Retrouvez ici tous vos dossiers administratifs.
          </p>
        </div>

        <Link href="/categories" className="btn btn-primary text-[16px] w-full sm:w-auto">
          <Plus className="size-6" />
          Nouveau dossier
        </Link>
      </div>

      {/* Empty state */}
      <section className="turtle-card flex flex-col items-center justify-center text-center min-h-105 sm:min-h-120">
        {/* Icon */}
        <div className="flex items-center justify-center size-20 rounded-2xl bg-accent text-primary mb-6">
          <FilePlus2 className="size-12" />
        </div>

        {/* Text */}
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold tracking-tight">
            Vous n&apos;avez pas encore créé de dossier
          </h2>

          <p className="text-muted-foreground leading-6 mt-3 text-[18px]">
            Commencez votre première démarche administrative en créant un
            dossier. Vous pourrez ensuite suivre son avancement, retrouver vos
            documents et consulter vos réponses.
          </p>
        </div>

        {/* CTA */}
        <Link href="/categories" className="btn btn-primary text-[16px] mt-6">
          <Plus className="size-6" />
          Créer mon premier dossier
          <ArrowRight className="size-5" />
        </Link>

      </section>
    </main>
  );
}
