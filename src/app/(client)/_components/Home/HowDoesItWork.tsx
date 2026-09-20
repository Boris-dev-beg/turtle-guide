
import { HowDoesItWork_infos } from "@/data/GlobalData";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card_ } from "./cards/HowDoesItWork.card";

export default function HowDoesItWork() {
  return (
    <section className="wrapper relative space-y-6 py-6">
      <div className="space-y-2">
        <h2 className="font-display text-3xl text-brand-ink sm:text-4xl">
          {HowDoesItWork_infos.title}
        </h2>
        <p className="max-w-xl text-base leading-7 text-brand-ink-muted">
          {HowDoesItWork_infos.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {HowDoesItWork_infos.element.map((elt) => (
          <Card_
            key={elt.id}
            id={elt.id}
            title={elt.title}
            description={elt.description}
          />
        ))}
      </div>

      <div className="flex items-start justify-start gap-4 rounded-[1.125rem] border border-brand-yellow/30 bg-brand-yellow-bg p-5 sm:items-center">
        <AlertTriangle className="size-8 shrink-0 text-brand-yellow" />

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="space-y-1">
            <h3 className="font-display text-[1.4rem] leading-tight text-brand-yellow">
              {HowDoesItWork_infos.alert.title}
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-brand-ink-muted md:text-base">
              {HowDoesItWork_infos.alert.description}
            </p>
          </div>

          <Link
            href=""
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-yellow transition-colors hover:underline"
          >
            En savoir plus
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

