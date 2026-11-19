import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

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

          <span className="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-brand-ink shadow-sm">
            <button className="max-w-40 cursor-pointer bg-transparent outline-none flex gap-1">
              <Plus
                className="size-4 shrink-0 text-brand-ink-muted"
                aria-hidden="true"
              />{" "}
              Créer une alerte
            </button>
          </span>
        </div>
        {alerts.length === 0 ? (
          <p className="rounded-sm border border-border bg-card p-6 text-base text-brand-ink-muted">
            Aucun signalement pour le moment.
          </p>
        ) : (
          <ul className="space-y-4">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="border-l-4 border-brand-danger bg-card p-5 sm:p-6"
              >
                <p className="text-sm text-brand-ink-muted">
                  {alert.step.process.title} · {alert.step.title} ·{" "}
                  {new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(alert.publicationDate)}
                </p>
                <h2 className="mt-2 font-display text-xl font-semibold text-brand-ink">
                  {alert.title}
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-brand-ink-muted">
                  {alert.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
