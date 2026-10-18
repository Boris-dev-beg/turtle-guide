"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { Procedures_infos } from "@/data/GlobalData";
import { useProcedures } from "@/hooks/useProcedures";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card_, Card_loader } from "./cards/popularProcedureCard";

export default function PopularProcedures() {
  const {
    PopularProcedures,
    popularLoading: isLoading,
    popularError,
  } = useProcedures();

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="wrapper flex flex-col gap-6">
          <div className="flex w-full items-end justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-wider text-brand-green-text">
              {Procedures_infos.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card_loader />
            <Card_loader />
            <Card_loader />
            <Card_loader />
          </div>
        </div>
      </section>
    );
  }

  if (popularError || !PopularProcedures) {
    return (
      <section className="py-10">
        <div className="wrapper">
          <EmptyState
            title="Informations indisponibles"
            description="Les démarches populaires n’ont pas pu être chargées pour le moment. Merci de réessayer plus tard."
            actionLabel="Réessayer"
            onAction={() => window.location.reload()}
          />
        </div>
      </section>
    );
  }

  if (PopularProcedures.length === 0) {
    return (
      <section className="py-10">
        <div className="wrapper flex flex-col gap-6">
          <div className="flex w-full items-end justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-wider text-brand-green-text">
              {Procedures_infos.title}
            </h2>
          </div>

          <EmptyState
            title="Aucune démarche populaire pour le moment"
            description="Les procédures les plus recherchées seront affichées ici dès qu’elles seront disponibles."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="wrapper flex flex-col gap-6">
        <div className="flex w-full items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-brand-ink sm:text-4xl">
            {Procedures_infos.title}
          </h2>

          <Link
            href={Procedures_infos.link.href}
            className="group flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-brand-green transition-colors hover:underline"
          >
            <span className="hidden sm:inline">{Procedures_infos.link.label}</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PopularProcedures.map((proc) => (
            <Card_
              key={proc.id}
              title={proc.title}
              image={proc.image}
              categoryName={proc.category.name}
              description={proc.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
