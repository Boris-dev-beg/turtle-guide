import { FileText } from "lucide-react";
import ActivityChart from "../charts/ActivityChart";
import ActivityTable from "../charts/ActivityTable";
import RankedList from "../charts/RankedList";
import CityDistribution from "../charts/CityDistribution";
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
    <>
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
    </>
  );
}
