"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity as ActivityIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { DashboardActivityPoint } from "../../types/types";

const activityChartConfig = {
  users: { label: "Utilisateurs", color: "#08735a" },
  folders: { label: "Dossiers", color: "#55c9a5" },
};

/** Formate les graduations de l'axe vertical avec une notation compacte française. */
function formatAxisNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Affiche les créations quotidiennes de comptes et de dossiers sur la période choisie. */
export default function ActivityChart({
  points,
  periodDays,
}: {
  points: DashboardActivityPoint[];
  periodDays: number;
}) {
  return (
    <Card className="min-w-0 gap-4 rounded-md p-4 shadow-none ring-border sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-brand-ink">
          <ActivityIcon
            className="size-5 text-brand-green"
            aria-hidden="true"
          />
          Activité sur {periodDays} jours
        </h2>
      </div>

      <ChartContainer
        config={activityChartConfig}
        role="img"
        aria-label={`Évolution quotidienne des utilisateurs et dossiers sur ${periodDays} jours`}
        className="h-60"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={points}
            margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="dashboard-users-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#08735a" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#08735a" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="dashboard-folders-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#55c9a5" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#55c9a5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#e3e9e5"
              strokeDasharray="3 5"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#5c6f7f", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#d8e1db" }}
              minTickGap={28}
            />
            <YAxis
              tickFormatter={formatAxisNumber}
              tick={{ fill: "#5c6f7f", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="users"
              name="Utilisateurs"
              stroke="#08735a"
              strokeWidth={2.5}
              fill="url(#dashboard-users-gradient)"
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="folders"
              name="Dossiers"
              stroke="#55c9a5"
              strokeWidth={2.5}
              fill="url(#dashboard-folders-gradient)"
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-brand-ink-muted">
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-brand-green" />
          Utilisateurs
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-emerald-300" />
          Dossiers
        </span>
      </div>
    </Card>
  );
}
