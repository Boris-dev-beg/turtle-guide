"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Procedures_infos } from "@/data/GlobalData";
import { useProcedures } from "@/hooks/useProcedures";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PopularProcedures() {
  const { Popularprocedures, loading } = useProcedures();

  return (
    <section className="py-10">
      <div className="wrapper flex flex-col gap-6">
        {/* Header */}
        <div className="flex w-full items-end justify-between gap-4">
          <h2 className="uppercase tracking-wider text-brand-green-text text-2xl font-bold">
            {Procedures_infos.title}
          </h2>

          <Link
            href={Procedures_infos.link.href}
            className="group flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-semibold text-primary transition-colors hover:underline"
          >
            <span className="hidden sm:inline">
              {Procedures_infos.link.label}
            </span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <>
              <Card_loader />
              <Card_loader />
              <Card_loader />
              <Card_loader />
            </>
          ) : (
            Popularprocedures.map((proc) => (
              <Card_
                key={proc.id}
                title={proc.title}
                categoryName={proc.category.name}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

const Card_ = ({
  title,
  categoryName,
}: {
  title: string;
  categoryName: string;
}) => {
  return (
    <Card className="group flex min-h-30 items-center gap-4 rounded-xl border-border/60 bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      {/* Content */}
        <CardTitle className="line-clamp-2 text-lg font-semibold leading-snug w-full">
          {title}
        </CardTitle>

        <CardDescription className="flex items-center mt-auto gap-1 text-base w-full">
          <span className="truncate font-semibold">{categoryName}</span>

          <ChevronRight className="ml-auto size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
        </CardDescription>
    </Card>
  );
};

const Card_loader = () => {
  return (
    <Card className="flex min-h-30 flex-row items-center gap-4 rounded-xl border-border/60 p-4">

      <CardHeader className="w-full space-y-2 p-0">
        <Skeleton className="h-5 w-4/5" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="size-4 rounded-full" />
        </div>
      </CardHeader>
    </Card>
  );
};
