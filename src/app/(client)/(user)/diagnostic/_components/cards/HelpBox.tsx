import { ArrowUpRightFromSquare, Headset } from "lucide-react"; 

export function HelpBox() { 
  return ( 
    <div className="hidden md:flex flex-col items-start gap-3 border border-border bg-background rounded-xl p-4 shadow-xs mt-auto"> 
      <span className="text-primary bg-primary/10 p-2.5 rounded-lg"> 
        <Headset className="size-5.5" /> 
      </span> 
      <div> 
        <h2 className="text-lg font-bold"> Besoin d&apos;aide ? </h2> 
        <p className="text-muted-foreground text-sm leading-5 mt-1"> 
          Notre équipe est là pour vous accompagner dans vos démarches. 
        </p> 
      </div> 
      <button className="btn btn-outline w-full text-sm"> 
        Contacter le support 
        <ArrowUpRightFromSquare className="size-4" /> 
      </button> 
    </div> 
  ); 
} 
