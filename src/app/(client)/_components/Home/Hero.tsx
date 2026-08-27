import { ArrowRight } from "lucide-react";
import Image from "next/image";
import hero_img from "../../../../assets/images/hero.png";
import Link from "next/link";
import { Hero_infos } from "@/data/GlobalData";

export default function Hero() {
  return (
    <section className="flex relative w-full max-h-screen min-[500px]:h-[80vh] h-[70vh]">
      <div className="wrapper flex w-full h-full py-5 bg-linear-360 from-secondary to-transparent">
        {/* Text */}
        <div className="flex flex-col gap-5 items-start w-full lg:max-w-md h-full justify-center max-w-sm">
          <span className="mb-1 text-[32px] min-[500px]:text-[40px] md:text-4xl">
            <h1 className="font-semibold text-5xl min-[500px]:text-6xl">{Hero_infos.title}</h1>
            <h2 className="text-brand-green-text font-semibold">
              {Hero_infos.subtitle}
            </h2>
          </span>
          <p className="min-[500px]:text-lg max-w-sm sm:max-w-md">{Hero_infos.description}</p>
          <Link
            href={Hero_infos.link.href}
            className="btn btn-primary w-40 gap-3 text-base"
          >
            {Hero_infos.link.label} <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
        {/* Image */}
        <div className="absolute -z-10 w-full h-full">
          <Image
            src={hero_img}
            alt="Hero image"
            loading="eager"
            className="object-cover w-full h-full"
          />
        </div>
    </section>
  );
}
