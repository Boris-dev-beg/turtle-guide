import Dashboard from "./_components/Sections/Dashboard";
import {
  getAdminDashboardData,
} from "@/services/admin-dashboard.service";
import { DashboardPeriod } from "./types/types";

/** Convertit le paramètre de période de l'URL en valeur autorisée par le service d'agrégation. */
function parsePeriod(value?: string): DashboardPeriod {
  if (value === "60") return 60;
  if (value === "90") return 90;
  return 30;
}

/** Charge les agrégats réels côté serveur puis rend le tableau de bord demandé. */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: requestedPeriod } = await searchParams;
  const period = parsePeriod(requestedPeriod);
  const data = await getAdminDashboardData(period);

  return (
    <section className="w-full p-4 sm:p-6">
      <Dashboard data={data} period={period} />
    </section>
  );
}
