"use client";

import { Procedures_infos } from "@/data/GlobalData";
import { useProcedures } from "@/hooks/useProcedures";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card_, Card_loader } from "./cards/popularProcedureCard";

export default function PopularProcedures() {
  const { PopularProcedures, popularLoading: isLoading } = useProcedures();

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
          {isLoading ? (
            <>
              <Card_loader />
              <Card_loader />
              <Card_loader />
              <Card_loader />
            </>
          ) : !PopularProcedures ? (
            <p>Pas encore de procedure populaire</p>
          ) : (
            PopularProcedures.map((proc) => (
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
