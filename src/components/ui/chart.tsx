"use client";

import {
  createContext,
  useContext,
  useId,
  type CSSProperties,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ChartConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;

type ChartContextValue = {
  config: ChartConfig;
};

type ChartTooltipEntry = {
  dataKey?: string | number;
  name?: string | number;
  value?: string | number;
  color?: string;
  payload?: {
    chartKey?: string;
  };
};

type ChartTooltipContentProps = {
  active?: boolean;
  label?: ReactNode;
  payload?: ChartTooltipEntry[];
};

const ChartContext = createContext<ChartContextValue | null>(null);

/** Fournit le contexte de couleur et le conteneur responsive partagé par les graphiques shadcn du projet. */
export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  config: ChartConfig;
}) {
  const generatedId = useId().replace(/:/g, "");
  const chartId = `chart-${generatedId}`;
  const chartStyles = Object.fromEntries(
    Object.entries(config).map(([key, item]) => [`--color-${key}`, item.color]),
  ) as CSSProperties;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        style={chartStyles}
        className={cn("w-full [&_.recharts-surface]:outline-none", className)}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

/** Rend le tooltip Recharts avec les libellés, couleurs et formats du thème shadcn local. */
export function ChartTooltipContent({
  active,
  label,
  payload,
}: ChartTooltipContentProps) {
  const context = useContext(ChartContext);
  if (!active || !payload?.length || !context) return null;

  return (
    <div className="min-w-32 rounded-md border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md">
      {label !== undefined && (
        <p className="mb-1.5 font-medium text-brand-ink">{label}</p>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          const key = String(
            entry.payload?.chartKey ?? entry.dataKey ?? entry.name ?? index,
          );
          const series = context.config[key];
          return (
            <div key={`${key}-${index}`} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ backgroundColor: series?.color ?? entry.color }}
                aria-hidden="true"
              />
              <span className="flex-1 text-brand-ink-muted">
                {series?.label ?? entry.name ?? key}
              </span>
              <span className="font-medium tabular-nums text-brand-ink">
                {new Intl.NumberFormat("fr-FR").format(
                  Number(entry.value ?? 0),
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
