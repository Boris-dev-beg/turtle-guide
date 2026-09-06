import { Card, CardDescription, CardTitle } from "@/components/ui/card"; 
import { OurEngagements_infos } from "@/data/GlobalData"; 
import { LucideIcon } from "lucide-react"; 

export default function OurEngagements() { 
  return ( 
    <section className="wrapper flex flex-col gap-6"> 
      {/* Header */} 
      <h2 className="text-2xl font-semibold uppercase tracking-wider text-brand-green-text"> 
        {OurEngagements_infos.title} 
      </h2> 

      {/* Cards */} 
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"> 
        {OurEngagements_infos.elements.map((eng, index) => ( 
          <Card_ 
            key={index} 
            icon={eng.icon} 
            title={eng.title} 
            description={eng.description} 
          /> 
        ))} 
      </div> 
    </section> 
  ); 
} 

const Card_ = ({ 
  icon: Icon, 
  title, 
  description, 
}: { 
  icon: LucideIcon; 
  title: string; 
  description: string; 
}) => { 
  return ( 
    <Card className="group flex h-full flex-col items-start gap-4 rounded-xl border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-green-text/30 hover:shadow-md"> 
      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand-green-text/10 text-brand-green-text transition-colors duration-300 group-hover:bg-brand-green-text group-hover:text-white"> 
        <Icon className="size-7" /> 
      </span> 

      <div className="space-y-2"> 
        <CardTitle className="text-[20px] font-semibold leading-tight"> 
          {title} 
        </CardTitle> 

        <CardDescription className="line-clamp-3 text-base leading-6"> 
          {description} 
        </CardDescription> 
      </div> 
    </Card> 
  ); 
}; 
