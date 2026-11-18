import Link from "next/link";
import { ArrowRight, FileCheck2, FolderPlus, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DashboardActivity } from "../../types/types";

const activityIcons = {
  folder: FolderPlus,
  purchase: FileCheck2,
  fraud: ShieldAlert,
} as const;

const activityColors = {
  folder: "bg-emerald-500",
  purchase: "bg-sky-500",
  fraud: "bg-orange-500",
} as const;

/** Formate un horodatage d'activité en temps relatif français, puis en date courte pour les événements anciens. */
function formatRelativeTime(isoDate: string) {
  const elapsedSeconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000),
  );
  const formatter = new Intl.RelativeTimeFormat("fr-FR", {
    numeric: "auto",
    style: "short",
  });

  if (elapsedSeconds < 60) return formatter.format(-elapsedSeconds, "second");
  if (elapsedSeconds < 3600) {
    return formatter.format(-Math.floor(elapsedSeconds / 60), "minute");
  }
  if (elapsedSeconds < 86_400) {
    return formatter.format(-Math.floor(elapsedSeconds / 3600), "hour");
  }
  if (elapsedSeconds < 604_800) {
    return formatter.format(-Math.floor(elapsedSeconds / 86_400), "day");
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(new Date(isoDate));
}

/** Affiche le flux récent issu des créations de dossiers, achats confirmés et signalements. */
export default function RecentActivity({
  items,
}: {
  items: DashboardActivity[];
}) {
  return (
    <Card className="min-w-0 gap-4 rounded-md p-4 shadow-none ring-border sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-brand-ink">
          <FolderPlus className="size-5 text-brand-green" aria-hidden="true" />
          Activité récente
        </h2>
        <Link
          href="/admin/fraud-alerts"
          className="inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-brand-green hover:text-brand-green-dark"
        >
          Alertes
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="py-4 text-sm text-brand-ink-muted">
          Aucune activité enregistrée pour le moment.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => {
            const Icon = activityIcons[item.kind];
            return (
              <li
                key={item.id}
                className="flex min-w-0 items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span
                  className={`size-2 shrink-0 rounded-full ${activityColors[item.kind]}`}
                  aria-hidden="true"
                />
                <Icon
                  className="hidden size-4 shrink-0 text-brand-ink-muted sm:block"
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-brand-ink">
                    {item.title}
                  </span>
                  <span className="block truncate text-xs text-brand-ink-muted">
                    {item.detail}
                  </span>
                </span>
                <time
                  dateTime={item.occurredAt}
                  className="shrink-0 text-xs text-brand-ink-muted"
                >
                  {formatRelativeTime(item.occurredAt)}
                </time>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
