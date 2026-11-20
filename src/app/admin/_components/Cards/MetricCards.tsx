import {
  ArrowDownRight,
  ArrowUpRight,
  FileCheck2,
  FolderOpen,
  Minus,
  TriangleAlert,
  UsersRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { DashboardMetric } from "../../types/types";

export const metricPresentationDashboard = {
  users: {
    icon: UsersRound,
    iconStyle: "bg-emerald-100 text-emerald-800",
    trendStyle: "text-emerald-700",
  },
  folders: {
    icon: FolderOpen,
    iconStyle: "bg-amber-100 text-amber-800",
    trendStyle: "text-emerald-700",
  },
  purchases: {
    icon: FileCheck2,
    iconStyle: "bg-sky-100 text-sky-800",
    trendStyle: "text-sky-700",
  },
  fraud: {
    icon: TriangleAlert,
    iconStyle: "bg-orange-100 text-orange-800",
    trendStyle: "text-rose-700",
  },
} as const;

/** Affiche un indicateur principal avec son évolution par rapport à la période précédente. */
function MetricCard({ metric }: { metric: DashboardMetric }) {
  const presentation = metricPresentationDashboard[metric.key];
  const Icon = presentation.icon;
  const increaseIsPositive = metric.key !== "fraud";
  const isPositiveChange =
    metric.periodChange !== 0 && metric.periodChange > 0 === increaseIsPositive;
  const TrendIcon =
    metric.periodChange > 0
      ? ArrowUpRight
      : metric.periodChange < 0
        ? ArrowDownRight
        : Minus;
  const trendLabel =
    metric.previousPeriodValue === 0 && metric.periodChange > 0
      ? "Première activité sur la période"
      : `${metric.periodChange > 0 ? "+" : ""}${metric.periodChange}% vs période précédente`;

  return (
    <Card className="min-w-0 gap-4 rounded-md p-4 shadow-none ring-border sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="min-w-0 text-xl font-semibold leading-5 text-brand-ink">
          {metric.label}
        </h1>
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-full ${presentation.iconStyle}`}
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>
      </div>
      <div>
        <p className="font-display text-4xl font-semibold tabular-nums text-brand-ink">
          {new Intl.NumberFormat("fr-FR").format(metric.value)}
        </p>
        <p
          className={`mt-2 flex min-h-5 items-center gap-1 text-xs ${
            metric.periodChange === 0
              ? "text-brand-ink-muted"
              : isPositiveChange
                ? presentation.trendStyle
                : "text-rose-700"
          }`}
        >
          <TrendIcon className="size-5 shrink-0" aria-hidden="true" />
          <span className="text-sm">{trendLabel}</span>
        </p>
      </div>
    </Card>
  );
}

/** Dispose les indicateurs du dashboard dans une grille qui s'adapte aux petits écrans. */
export default function MetricCards({
  metrics,
}: {
  metrics: DashboardMetric[];
}) {
  return (
    <section
      aria-label="Indicateurs clés"
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {metrics.map((metric) => (
        <MetricCard key={metric.key} metric={metric} />
      ))}
    </section>
  );
}
