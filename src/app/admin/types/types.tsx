import { metricPresentation } from "../_components/Cards/ContentCard";
import { metricPresentationDashboard } from "../_components/Cards/MetricCards";

export type DashboardPeriod = 30 | 60 | 90;
export type DashboardMetricKey = keyof typeof metricPresentationDashboard;
export type ContentMetricKey = keyof typeof metricPresentation;

export type DashboardMetric = {
  key: DashboardMetricKey;
  label: string;
  value: number;
  periodChange: number;
  previousPeriodValue: number;
};
export type Metric = {
  key: ContentMetricKey;
  label: string;
  value: number;
  subLabel: string;
  href: string;
};
export type ContentMetric = {
  metrics: Metric[];
  RecentActivities: RecentContentActivity[];
};

export type AdminContentAction = "CREATE" | "UPDATE" | "DELETE";

export type RecentContentActivity = {
  id: string;
  action: AdminContentAction;
  entityType: string;
  entityName: string;
  summary: string | null;
  actorName: string;
  occurredAt: Date;
};

export type DashboardActivityPoint = {
  date: string;
  label: string;
  users: number;
  folders: number;
};

export type DashboardBreakdownItem = {
  label: string;
  count: number;
};

export type DashboardActivity = {
  id: string;
  kind: "folder" | "purchase" | "fraud";
  title: string;
  detail: string;
  occurredAt: string;
};

export type AdminDashboardData = {
  metrics: DashboardMetric[];
  activity: DashboardActivityPoint[];
  topProcedures: DashboardBreakdownItem[];
  topCities: DashboardBreakdownItem[];
  recentActivity: DashboardActivity[];
};
