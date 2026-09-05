import { ArrowRight } from "lucide-react"; 
import Image from "next/image"; 
import hero_img from "../../../../assets/images/hero.png"; 
import Link from "next/link"; 
import { Hero_infos } from "@/data/GlobalData"; 

export default function Hero() { 
  return ( 
    <section className="relative flex min-h-[90vh] w-full flex-col overflow-hidden bg-background lg:min-h-[80vh] lg:grid lg:grid-cols-2"> 
      {/* Image */} 
      <div className="absolute inset-0 -z-10 h-full w-full lg:relative lg:inset-auto lg:z-0 lg:flex lg:items-center lg:justify-center"> 
        <Image 
          src={hero_img} 
          alt="Hero image" 
          loading="eager" 
          className="h-full w-full object-cover lg:h-128 lg:w-[90%] lg:rounded-xl" 
        /> 

        {/* Overlay */} 
        <div className="absolute inset-0 hidden lg:block lg:bg-[radial-gradient(circle,transparent_30%,var(--color-background)_100%)]" /> 
      </div> 

      {/* Content */} 
      <div className="wrapper relative z-10 flex min-h-[85vh] w-full items-center lg:min-h-[80vh] py-12"> 
        <div className="flex w-full max-w-xl flex-col items-start gap-5"> 
          <span className="rounded-full border border-brand-green-text/20 bg-brand-green-text/10 px-4 py-2 font-medium text-brand-green-text"> 
            Administration & services publics 
          </span> 

          <div className="space-y-3"> 
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"> 
              {Hero_infos.title} 
            </h1> 

            <h2 className="max-w-lg text-xl font-semibold leading-relaxed text-brand-green-text sm:text-2xl"> 
              {Hero_infos.subtitle} 
            </h2> 
          </div> 

          <p className="max-w-lg leading-7 text-muted-foreground text-lg sm:text-xl"> 
            {Hero_infos.description} 
          </p> 

          <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row"> 
            <Link 
              href={Hero_infos.link.href} 
              className="btn btn-primary h-12 w-full gap-3 px-6 text-lg sm:w-auto" 
            > 
              {Hero_infos.link.label} 
              <ArrowRight className="size-6" /> 
            </Link> 
          </div> 

          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-lg text-muted-foreground"> 
            <span>✓ Services accessibles</span> 
            <span>✓ Informations officielles</span> 
          </div> 
        </div> 
      </div> 
    </section> 
  ); 
} 
