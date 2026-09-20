import { ArrowRight } from "lucide-react";
import Image from "next/image";
import hero_img from "../../../../assets/images/hero.jpg";
import Link from "next/link";
import { Hero_infos } from "@/data/GlobalData";

export default function Hero() {
  return (
    <section className="wrapper relative flex w-full flex-col overflow-hidden bg-background lg:grid lg:grid-cols-2 lg:items-stretch pb-6">
      <div className="relative z-10 flex w-full items-center py-12 lg:py-18">
        <div className="flex w-full max-w-xl flex-col items-start gap-4">
          <p className="text-sm font-medium tracking-[0.08em] text-brand-green">
            {Hero_infos.eyebrow}
          </p>

          <h1 className="font-display text-4xl leading-[1.05] text-brand-ink sm:text-5xl">
            {Hero_infos.title}
          </h1>

          <p className="max-w-md text-base leading-7 text-brand-ink-muted sm:text-lg">
            {Hero_infos.description}
          </p>

          <Link
            href={Hero_infos.link.href}
            className="btn btn-primary mt-2 text-nowrap gap-2"
          >
            {Hero_infos.link.label}
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>

      <div className="relative h-72 w-full sm:h-112 lg:h-full">
        <div className="absolute inset-0 hidden bg-brand-green lg:block" />

        <div className="relative h-full w-full overflow-hidden lg:absolute lg:inset-0">
          <Image
            src={hero_img}
            alt="Ministère des Affaires Étrangères du Cameroun"
            fill
            priority
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
