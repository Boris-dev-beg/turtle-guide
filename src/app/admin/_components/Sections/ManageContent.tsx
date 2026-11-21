import type { ContentMetric } from "../../types/types";
import ContentCard from "../Cards/ContentCard";
import { CalendarClock, FilePlus2, Pencil, Trash2 } from "lucide-react";

const actionPresentation = {
  CREATE: {
    label: "Ajout",
    Icon: FilePlus2,
    style: "bg-emerald-100 text-emerald-800",
  },
  UPDATE: {
    label: "Modification",
    Icon: Pencil,
    style: "bg-sky-100 text-sky-800",
  },
  DELETE: {
    label: "Suppression",
    Icon: Trash2,
    style: "bg-rose-100 text-rose-800",
  },
} as const;

const contentTypeLabels: Record<string, string> = {
  category: "Catégorie",
  procedure: "Procédure",
  process: "Démarche",
  step: "Étape",
  question: "Question",
  answerOption: "Option de réponse",
  document: "Document",
};

const tabEntityTypes: Record<string, string[]> = {
  categories: ["category"],
  procedures: ["procedure"],
  processes: ["process", "step", "question", "answerOption"],
  documents: ["document"],
};

/** Formate la date d'une entrée de journal dans le fuseau local français. */
function formatActivityDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/** Affiche les indicateurs de contenu et le journal vérifiable des opérations administratives. */
export default function ManageContent({
  data,
  selectedTab = "all",
}: {
  data: ContentMetric;
  selectedTab?: string;
}) {
  const metrics = data.metrics;
  const selectedEntityTypes = tabEntityTypes[selectedTab] ?? [];
  const recentActivities = data.RecentActivities.filter(
    (activity) =>
      selectedTab === "all" ||
      selectedTab === "quality" ||
      selectedEntityTypes.includes(activity.entityType),
  );

  return (
    <div className="space-y-6">
      <section
        aria-label="Indicateurs clés"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => (
          <ContentCard key={metric.key} metric={metric} />
        ))}
      </section>

      <section
        aria-labelledby="content-activity-title"
        className="overflow-hidden rounded-md border border-border bg-card"
      >
        <div className="border-b border-border px-4 py-4 sm:px-5">
          <div className="flex items-start gap-3">
            <CalendarClock
              className="mt-1 size-7 shrink-0 text-brand-green"
              aria-hidden="true"
            />
            <div>
              <h2
                id="content-activity-title"
                className="font-display text-2xl font-semibold text-brand-ink"
              >
                Activités récentes des administrateurs
              </h2>
              <p className="mt-1 text-base text-brand-ink-muted">
                Ajouts, modifications et suppressions du contenu enregistrés
                dans le journal d&apos;audit.
              </p>
            </div>
          </div>
        </div>

        {recentActivities.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-xl font-medium text-brand-ink">
              Aucune activité enregistrée pour ce filtre.
            </p>
            <p className="mx-auto mt-2 max-w-xl text-base leading-6 text-brand-ink-muted">
              Le journal commence à enregistrer les actions après son
              activation. Les changements effectués avant cette date ne peuvent
              pas être reconstruits à partir des seules dates de modification.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recentActivities.map((activity) => {
              const presentation = actionPresentation[activity.action];
              const Icon = presentation.Icon;

              return (
                <li
                  key={activity.id}
                  className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${presentation.style}`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brand-ink">
                        {presentation.label} ·{" "}
                        {contentTypeLabels[activity.entityType] ??
                          activity.entityType}{" "}
                        <span className="font-medium">
                          {activity.entityName}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-brand-ink-muted">
                        Par {activity.actorName}
                        {activity.summary ? ` · ${activity.summary}` : ""}
                      </p>
                    </div>
                  </div>
                  <time
                    dateTime={activity.occurredAt.toISOString()}
                    className="pl-12 text-xs text-brand-ink-muted sm:pl-0 sm:text-right"
                  >
                    {formatActivityDate(activity.occurredAt)}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
