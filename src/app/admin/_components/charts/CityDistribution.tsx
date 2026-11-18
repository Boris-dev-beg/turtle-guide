"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { DashboardBreakdownItem } from "../../types/types";

const cityColors = ["#08735a", "#3982c6", "#e0862e", "#c9674b", "#55a99a"];
const cityDotClasses = [
  "bg-brand-green",
  "bg-sky-600",
  "bg-amber-600",
  "bg-orange-700",
  "bg-teal-600",
];

/** Formate un nombre en français pour la légende et les valeurs du graphique. */
function formatCityCount(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

/** Présente la répartition des dossiers par ville avec les composants shadcn et le graphique Recharts. */
export default function CityDistribution({
  items,
}: {
  items: DashboardBreakdownItem[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const chartData = items.map((item, index) => ({
    ...item,
    chartKey: `city-${index}`,
  }));
  const chartConfig = Object.fromEntries(
    chartData.map((item, index) => [
      item.chartKey,
      {
        label: item.label,
        color: cityColors[index % cityColors.length],
      },
    ]),
  );

  return (
    <Card className="min-w-0 gap-4 rounded-md p-4 shadow-none ring-border sm:p-5">
      <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-brand-ink">
        <MapPin className="size-7 text-brand-green" aria-hidden="true" />
        Répartition par ville
      </h2>

      {items.length === 0 ? (
        <p className="py-8 text-xl text-brand-ink-muted">
          Aucun dossier localisé sur cette période.
        </p>
      ) : (
        <div className="grid min-h-56 grid-cols-1 items-center gap-5 sm:grid-cols-[minmax(9rem,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative mx-auto h-48 w-full max-w-56">
            <ChartContainer config={chartConfig} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="chartKey"
                    innerRadius="66%"
                    outerRadius="92%"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {chartData.map((item) => (
                      <Cell
                        key={item.chartKey}
                        fill={`var(--color-${item.chartKey})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-semibold tabular-nums text-brand-ink">
                {formatCityCount(total)}
              </span>
              <span className="text-base text-brand-ink-muted">dossiers</span>
            </div>
          </div>

          <ul className="space-y-3">
            {items.map((item, index) => {
              const share = total ? Math.round((item.count / total) * 100) : 0;
              return (
                <li
                  key={`${item.label}-${index}`}
                  className="flex min-w-0 items-center gap-2 text-lg text-brand-ink"
                >
                  <span
                    className={`size-5 shrink-0 rounded-full ${cityDotClasses[index % cityDotClasses.length]}`}
                    aria-hidden="true"
                  />
                  <span
                    className="min-w-0 flex-1 truncate text-brand-ink"
                    title={item.label}
                  >
                    {item.label}
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-brand-ink">
                    {share}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
}
