import { Card, CardDescription, CardFooter } from "@/components/ui/card";
import { Metric } from "../../types/types";
import {
  FileText,
  Folder,
  ListChecks,
  MoveRight,
  Newspaper,
} from "lucide-react";
import Link from "next/link";

export const metricPresentation = {
  list: {
    icon: ListChecks,
    iconStyle: "bg-emerald-100 text-emerald-800",
  },
  folder: {
    icon: Folder,
    iconStyle: "bg-amber-100 text-amber-800",
  },
  news: {
    icon: Newspaper,
    iconStyle: "bg-sky-100 text-sky-800",
  },
  file: {
    icon: FileText,
    iconStyle: "bg-orange-100 text-orange-800",
  },
} as const;

/** Affiche un indicateur principal avec son évolution par rapport à la période précédente. */
export default function ContentCard({ metric }: { metric: Metric }) {
  const presentation = metricPresentation[metric.key];
  const Icon = presentation.icon;

  return (
    <Card className="min-w-0 gap-4 rounded-md p-4 shadow-none ring-border sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="min-w-0 text-xl font-semibold leading-5 text-brand-ink">
          {metric.label}
        </h1>
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-full ${presentation.iconStyle}`}
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>
      </div>
      <CardDescription>
        <>
          <p className="font-display text-4xl font-semibold tabular-nums text-brand-ink">
            {new Intl.NumberFormat("fr-FR").format(metric.value)}
          </p>
          <p className="mt-2 flex min-h-5 items-center gap-1 text-base">
            {metric.subLabel}
          </p>
        </>
      </CardDescription>
      <CardFooter className="bg-card mt-auto">
        <Link
          href={metric.href}
          className="flex gap-2 text-base font-semibold hover:underline text-brand-green hover:text-brand-green-light"
        >
          <span>Gérer</span>
          <MoveRight />
        </Link>
      </CardFooter>
    </Card>
  );
}
