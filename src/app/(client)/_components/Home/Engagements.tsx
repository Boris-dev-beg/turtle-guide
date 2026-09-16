import { Card, CardDescription, CardTitle } from "@/components/ui/card"; 
import { OurEngagements_infos } from "@/data/GlobalData"; 
import { LucideIcon } from "lucide-react"; 

export default function OurEngagements() { 
  return ( 
    <section className="wrapper flex flex-col gap-6 w-full"> 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-0"> 
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
    <Card className="flex h-full flex-row items-start px-5 sm:px-12 lg:px-6 py-6 sm:py-13 sm:pb-15 rounded-none sm:turtle-engagment-card bg-muted/50"> 
      <span className="flex"> 
        <Icon className="size-10" /> 
      </span> 

      <div className="space-y-2"> 
        <CardTitle className="text-base font-semibold leading-tight"> 
          {title} 
        </CardTitle> 

        <CardDescription className="line-clamp-3 text-sm leading-5"> 
          {description} 
        </CardDescription> 
      </div> 
    </Card> 
  ); 
}; 
