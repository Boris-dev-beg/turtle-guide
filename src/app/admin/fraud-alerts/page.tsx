import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AlertFrauds from "../_components/Sections/AlertFrauds";
import SectionLayout from "../_components/shared/SectionLayout";

export default async function page() {
  const alerts = await prisma.fraudAlert.findMany({
    include: {
      step: { select: { title: true, process: { select: { title: true } } } },
    },
    orderBy: { publicationDate: "desc" },
  });

  return (
    <SectionLayout
      title="Alertes de fraudes"
      subtitle="Modérez les alertes signalées par les utilisateurs ou détectées par l'équipe"
      action={
        <button className="h-10 gap-1 px-3 text-sm text-brand-ink shadow-sm max-w-40 outline-none turtle-radio">
          <Plus
            className="size-4 shrink-0 text-brand-ink-muted"
            aria-hidden="true"
          />
          s Créer une alerte
        </button>
      }
    >
      <AlertFrauds alerts={alerts} />
    </SectionLayout>
  );
}
