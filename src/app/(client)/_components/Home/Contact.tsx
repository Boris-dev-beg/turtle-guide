import { Contact_infos } from "@/data/GlobalData";
import { ArrowRight, Headphones } from "lucide-react";

export default function Contact() {
  return (
    <section className="wrapper pb-10">
      <div className="overflow-hidden rounded-[1.25rem] border border-border bg-card p-5 shadow-[0_8px_22px_rgba(34,32,27,0.04)] sm:p-8 lg:p-10">
        <div className="flex w-full flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-2xl space-y-2">
            <h2 className="font-display text-3xl leading-tight text-brand-ink">
              {Contact_infos.title}
            </h2>

            <p className="max-w-lg text-base leading-7 text-brand-ink-muted">
              {Contact_infos.description}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <button className="btn btn-primary w-full gap-2 text-nowrap">
              Consulter les guides
              <ArrowRight className="size-5" />
            </button>

            <button className="btn btn-outline w-full gap-2 text-nowrap">
              <Headphones className="size-5" />
              Contacter le support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
