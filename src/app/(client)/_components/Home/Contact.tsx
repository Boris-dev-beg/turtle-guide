import Image from "next/image"; 
import contact_img from "../../../../assets/images/contact.png"; 
import { Contact_infos } from "@/data/GlobalData"; 
import { ArrowRight, Headphones } from "lucide-react"; 

export default function Contact() { 
  return ( 
    <section> 
      <div className="wrapper relative overflow-hidden rounded-2xl border border-border/60 bg-secondary shadow-sm"> 
        <Image 
          src={contact_img} 
          alt="Contact image" 
          width={1200} 
          height={600} 
          loading="lazy" 
          className="h-70 w-full object-cover sm:h-60 lg:h-45" 
        /> 

        <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/10 lg:bg-linear-to-r lg:from-background lg:via-background/80 lg:to-transparent" /> 

        <div className="absolute inset-0 flex items-end p-5 sm:p-8 lg:items-center lg:p-12 w-full"> 
          <div className="w-full space-y-4 flex flex-col lg:flex-row gap-3 items-center"> 

            <div className="space-y-2 w-full"> 
              <h2 className="text-3xl font-bold tracking-tight"> 
                {Contact_infos.title} 
              </h2> 

              <p className="max-w-lg text-base leading-6 text-muted-foreground sm:text-lg backdrop-blur-sm font-medium"> 
                {Contact_infos.description} 
              </p> 
            </div> 

            <div className="flex flex-col gap-3 pt-2 sm:flex-row *:text-lg w-full"> 
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