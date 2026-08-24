import { ArrowRight } from "lucide-react";
import Image from "next/image";
import hero_img from "../../../../assets/images/hero.png";
import Link from "next/link";
import HowDoesItWork from "./HowDoesItWork";
import { Hero_infos } from "@/data/GlobalData";

export default function Hero() {
  return (
    <div className="flex w-full">
      <div className="wrapper min-h-screen p-2 flex flex-col gap-4">
        {/* Image */}
        <div className="relative w-full flex flex-col md:flex-row">
          {/* Text */}
          <div className="flex flex-col gap-5 items-start w-full lg:max-w-md h-full lg:ml-15 justify-center max-md:absolute z-20 md:bg-transparent bg-turtle-bg/85">
            <span className="mb-1 text-4xl">
              <h1 className="font-semibold text-5xl">{Hero_infos.title}</h1>
              <h2 className="text-turtle-accent font-semibold">
                {Hero_infos.subtitle}
              </h2>
            </span>
            <p className="text-base max-w-md">{Hero_infos.description}</p>
            <Link
              href={Hero_infos.link.href}
              className="btn btn-accent w-40 gap-3 text-base"
            >
              {Hero_infos.link.label} <ArrowRight className="size-5" />
            </Link>
          </div>
          {/* Image */}
          <div className="relative w-full h-100">
            <Image
              src={hero_img}
              alt="Hero image"
              loading="eager"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* How does it work */}
        <HowDoesItWork />
      </div>
    </div>
  );
}
