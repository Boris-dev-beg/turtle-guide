export type DashboardPeriod = 30 | 60 | 90;
export type DashboardMetricKey = "users" | "folders" | "purchases" | "fraud";

export type DashboardMetric = {
  key: DashboardMetricKey;
  label: string;
  value: number;
  periodChange: number;
  previousPeriodValue: number;
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
