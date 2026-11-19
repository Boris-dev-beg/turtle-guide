import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AlertFrauds from "../_components/Sections/AlertFrauds";

export default async function page() {
  const alerts = await prisma.fraudAlert.findMany({
    include: {
      step: { select: { title: true, process: { select: { title: true } } } },
    },
    orderBy: { publicationDate: "desc" },
  });

  return (
    <section className="w-full p-4 sm:p-6">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-brand-ink">
              Alertes de fraudes
            </h1>
            <p className="mt-1 text-sm text-brand-ink-muted sm:text-base">
              Modérez les alertes signalées par les utilisateurs ou détectées
              par l&apos;équipe
            </p>
          </div>

          <button className="h-10 gap-1 px-3 text-sm text-brand-ink shadow-sm max-w-40 outline-none turtle-radio">
            <Plus
              className="size-4 shrink-0 text-brand-ink-muted"
              aria-hidden="true"
            />{" "}
            Créer une alerte
          </button>
        </div>
        <AlertFrauds alerts={alerts} />
      </div>
    </section>
  );
}
