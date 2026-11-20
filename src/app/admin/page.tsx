import Dashboard from "./_components/Sections/Dashboard";
import { getAdminDashboardData } from "@/services/admin-dashboard.service";
import { DashboardPeriod } from "./types/types";
import SectionLayout from "./_components/shared/SectionLayout";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

function parsePeriod(value?: string): DashboardPeriod {
  if (value === "60") return 60;
  if (value === "90") return 90;
  return 30;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: requestedPeriod } = await searchParams;
  const period = parsePeriod(requestedPeriod);
  const data = await getAdminDashboardData(period);

  return (
    <>
      <SectionLayout
        title="Tableau de bord"
        subtitle="Vue d'ensemble de l'activité de la plateforme"
        action={
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
        }
      >
        <Dashboard data={data} period={period} />
      </SectionLayout>
    </>
  );
}
