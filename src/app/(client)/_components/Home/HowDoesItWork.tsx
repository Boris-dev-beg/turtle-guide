import { Card, CardDescription, CardTitle } from "@/components/ui/card"; 
import { HowDoesItWork_infos } from "@/data/GlobalData"; 
import { AlertTriangle } from "lucide-react"; 

export default function HowDoesItWork() { 
  return ( 
    <section className="wrapper flex flex-col gap-4 relative"> 
      <h2 className="text-2xl font-bold uppercase tracking-wider text-brand-green-text"> 
        {HowDoesItWork_infos.title} 
      </h2> 
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
      <div className="turtle-alert-info border-0 rounded-none bg-orange-100 max-md:*:flex-col *:items-center flex gap-2 justify-center"> 
        <span className="flex flex-col items-center gap-2.5"> 
          <AlertTriangle className="size-10 text-orange-400" /> 
          <span className="flex flex-col items-center max-md:*:text-center"> 
            <h3 className="font-semibold text-[20px]"> 
              {HowDoesItWork_infos.alert.title} 
            </h3> 
            <p>{HowDoesItWork_infos.alert.description}</p> 
          </span> 
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
    <Card className="flex flex-row items-start gap-3 px-4"> 
      <span className="py-2 px-3 bg-brand-green-text rounded-full text-primary-foreground text-xl font-black"> 
        0{id} 
      </span> 
      <span className="flex flex-col"> 
        <CardTitle className="font-bold text-[20px]">{title}</CardTitle> 
        <CardDescription className="text-base">{description}</CardDescription> 
      </span> 
    </Card> 
  ); 
}; 
