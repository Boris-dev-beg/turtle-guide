import { ArrowRight } from "lucide-react";
import Image from "next/image";
import hero_img from "../../../../assets/images/hero.jpg";
import Link from "next/link";
import { Hero_infos } from "@/data/GlobalData";


export default function Hero() {
  return (
   <section className="relative flex w-full flex-col overflow-hidden bg-background lg:grid lg:grid-cols-2 lg:items-stretch wrapper">
      {/* Colonne texte */}
      <div className="wrapper relative z-10 flex w-full items-center py-16 lg:py-24">
        <div className="flex w-full max-w-xl flex-col items-start gap-4">
          <span className="text-sm font-semibold text-brand-green-text">
            {Hero_infos.eyebrow}
          </span>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            {Hero_infos.title}
          </h1>

          <p className="max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
            {Hero_infos.description}
          </p>

          <Link
            href={Hero_infos.link.href}
            className="btn btn-primary mt-2 gap-2"
          >
            {Hero_infos.link.label}
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>

      {/* Colonne image */}
      <div className="relative h-72 w-full sm:h-100 lg:h-120">
        <div className="hidden lg:flex turtle-hero-image relative h-full w-full lg:bg-ring lg:-left-20 lg:-top-10 lg:absolute lg:inset-0" />

        <div className="lg:turtle-hero-image relative h-full w-full lg:absolute lg:inset-0 overflow-hidden">
          <Image
            src={hero_img}
            alt="Ministère des Affaires Étrangères du Cameroun"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
