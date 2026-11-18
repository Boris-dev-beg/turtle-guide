import { CalendarDays, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActivityChart from "./ActivityChart";
import ActivityTable from "./ActivityTable";
import RankedList from "./RankedList";
import CityDistribution from "./CityDistribution";
import MetricCards from "../Cards/MetricCards";
import { AdminDashboardData, DashboardPeriod } from "../../types/types";


export default function Dashboard({
  data,
  period,
}: {
  data: AdminDashboardData;
  period: DashboardPeriod;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-ink">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-brand-ink-muted sm:text-base">
            Vue d&apos;ensemble de l&apos;activité de la plateforme
          </p>
        </div>

        <form
          action="/admin"
          method="get"
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <label className="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-brand-ink shadow-sm">
            <CalendarDays
              className="size-4 shrink-0 text-brand-ink-muted"
              aria-hidden="true"
            />
            <span className="sr-only">Période des statistiques</span>
            <select
              name="period"
              defaultValue={String(period)}
              className="max-w-40 cursor-pointer bg-transparent outline-none"
            >
              <option value="30">30 derniers jours</option>
              <option value="60">60 derniers jours</option>
              <option value="90">90 derniers jours</option>
            </select>
          </label>
          <Button type="submit" variant="outline" className="h-10 px-3">
            Appliquer
          </Button>
        </form>
      </div>

      <MetricCards metrics={data.metrics} />

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.9fr)]">
        <ActivityChart points={data.activity} periodDays={period} />
        <CityDistribution items={data.topCities} />
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(19rem,0.9fr)_minmax(0,1.45fr)]">
        <RankedList
          title="Démarches les plus suivies"
          items={data.topProcedures}
          Icon={FileText}
          emptyMessage="Aucun dossier créé sur cette période."
          showShare
        />
        <ActivityTable items={data.recentActivity} />
      </div>
    </div>
  );
}
