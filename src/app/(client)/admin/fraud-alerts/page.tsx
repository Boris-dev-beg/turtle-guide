import { notFound, redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function AdminFraudAlertsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=%2Fadmin%2Ffraud-alerts");

  const administrator = await prisma.administrator.findUnique({ where: { userId: session.user.id }, select: { id: true } });
  if (!administrator) notFound();

  const alerts = await prisma.fraudAlert.findMany({
    include: { step: { select: { title: true, process: { select: { title: true } } } } },
    orderBy: { publicationDate: "desc" },
  });

  return (
    <main className="wrapper w-full py-10 sm:py-14">
      <div className="mb-7 flex items-start gap-4">
        <ShieldAlert className="mt-1 size-7 shrink-0 text-brand-danger" aria-hidden="true" />
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">Signalements de fraude</h1>
          <p className="mt-2 text-base leading-7 text-brand-ink-muted">Consultation des signalements liés aux étapes des démarches.</p>
        </div>
      </div>
      {alerts.length === 0 ? (
        <p className="rounded-sm border border-border bg-card p-6 text-base text-brand-ink-muted">Aucun signalement pour le moment.</p>
      ) : (
        <ul className="space-y-4">{alerts.map((alert) => (
          <li key={alert.id} className="border-l-4 border-brand-danger bg-card p-5 sm:p-6">
            <p className="text-sm text-brand-ink-muted">{alert.step.process.title} · {alert.step.title} · {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(alert.publicationDate)}</p>
            <h2 className="mt-2 font-display text-xl font-semibold text-brand-ink">{alert.title}</h2>
            <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-brand-ink-muted">{alert.description}</p>
          </li>
        ))}</ul>
      )}
    </main>
  );
}
