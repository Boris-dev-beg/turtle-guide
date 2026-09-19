import { Contact_infos } from "@/data/GlobalData";
import { ArrowRight, Headphones } from "lucide-react";

export default function Contact() {
  return (
    <section>
      <div className="wrapper overflow-hidden rounded-xs border border-border/60 bg-secondary shadow-sm">
        <div className="inset-0 flex items-end p-5 sm:p-8 lg:items-center lg:p-12 w-full">
          <div className="w-full space-y-4 flex flex-col lg:flex-row gap-3 items-center">
            <div className="space-y-2 w-full">
              <h2 className="text-2xl font-bold tracking-tight">
                {Contact_infos.title}
              </h2>

              <p className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-base backdrop-blur-sm font-medium">
                {Contact_infos.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row *:text-base w-full">
              <button className="btn btn-primary w-full gap-2 sm:w-auto">
                Consulter les guides
                <ArrowRight className="size-5" />
              </button>

              <button className="btn btn-outline w-full gap-2 sm:w-auto">
                <Headphones className="size-5" />
                Contacter le support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
