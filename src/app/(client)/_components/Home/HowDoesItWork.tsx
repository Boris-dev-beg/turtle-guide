import { Card, CardDescription, CardTitle } from "@/components/ui/card"; 
import { HowDoesItWork_infos } from "@/data/GlobalData"; 
import { AlertTriangle, ArrowRight } from "lucide-react"; 
import Link from "next/link";

export default function HowDoesItWork() { 
  return ( 
    <section className="wrapper relative space-y-5"> 
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider"> 
        {HowDoesItWork_infos.title} 
      </h2>
      <p className="text-muted-foreground max-w-md">
        {HowDoesItWork_infos.subtitle}
      </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
        {HowDoesItWork_infos.element.map((elt, index) => ( 
          <Card_ 
            key={index} 
            id={elt.id} 
            title={elt.title} 
            description={elt.description} 
          /> 
        ))} 
      </div> 
      <div className="py-6 px-5 border-0 rounded-none bg-brand-yellow-bg flex gap-4 items-start sm:items-center justify-start border-l-6 border-brand-yellow"> 
          <AlertTriangle className="size-10 min-w-10 text-brand-yellow" /> 
          <span className="flex flex-col md:flex-row gap-4"> 
            <span>
              <h3 className="font-semibold text-lg md:text-[20px] text-brand-yellow"> 
              {HowDoesItWork_infos.alert.title} 
            </h3> 
            <p className="line-clamp-2 text-sm md:text-base">{HowDoesItWork_infos.alert.description}</p> 
            </span>
            <Link href={""} className="text-brand-yellow flex gap-1 items-center text-sm hover:underline w-fit text-nowrap" >En savoir plus <ArrowRight className="size-5" /></Link>
          </span> 
      </div> 
    </section> 
  ); 
} 

const Card_ = ({ 
  title, 
  description, 
  id, 
}: { 
  title: string; 
  description: string; 
  id: number; 
}) => { 
  return ( 
    <Card className="flex flex-row items-start gap-3 px-4 rounded-xs sm:bg-muted bg-transparent border-0 ring-0"> 
      <span className="py-2 px-3 bg-brand-green-text rounded-full text-primary-foreground text-xl font-black"> 
        0{id} 
      </span> 
      <span className="flex flex-col"> 
        <CardTitle className="font-bold text-[20px]">{title}</CardTitle> 
        <CardDescription className="sm:text-base">{description}</CardDescription> 
      </span> 
    </Card> 
  ); 
}; 
