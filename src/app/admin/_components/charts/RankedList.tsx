import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DashboardBreakdownItem } from "../../types/types";

/** Affiche une liste classée et réutilisable avec un indicateur proportionnel à l'élément dominant. */
export default function RankedList({
  title,
  items,
  Icon,
  accentClassName = "bg-brand-green",
  emptyMessage,
  showShare = false,
}: {
  title: string;
  items: DashboardBreakdownItem[];
  Icon: LucideIcon;
  accentClassName?: string;
  emptyMessage: string;
  showShare?: boolean;
}) {
  const maximum = Math.max(1, ...items.map((item) => item.count));
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="min-w-0 gap-4 rounded-md p-4 shadow-none ring-border sm:p-5">
      <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-brand-ink">
        <Icon className="size-7 text-brand-green" aria-hidden="true" />
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="py-4 text-lg text-brand-ink-muted">{emptyMessage}</p>
      ) : (
        <ol className="space-y-4">
          {items.map((item, index) => (
            <li
              key={`${item.label}-${index}`}
              className={`grid items-center gap-2 sm:gap-3 ${showShare ? "grid-cols-[1.5rem_minmax(0,1fr)_minmax(4rem,0.8fr)_2.5rem]" : "grid-cols-[1.5rem_minmax(0,1fr)_minmax(4rem,0.8fr)_3.5rem]"}`}
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-brand-green-soft text-sm font-semibold text-brand-green-dark">
                {index + 1}
              </span>
              <span
                className="truncate text-lg font-medium text-brand-ink"
                title={item.label}
              >
                {item.label}
              </span>
              <span
                className="h-2 overflow-hidden rounded-full bg-muted"
                aria-hidden="true"
              >
                <span
                  className={`block h-full rounded-full ${accentClassName}`}
                  style={{
                    width: `${Math.max(4, (item.count / maximum) * 100)}%`,
                  }}
                />
              </span>
              <span className="text-right text-sm font-semibold tabular-nums text-brand-ink-muted">
                {showShare
                  ? `${total ? Math.round((item.count / total) * 100) : 0} %`
                  : new Intl.NumberFormat("fr-FR").format(item.count)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
