import { ArrowLeft } from "lucide-react"; 
import Link from "next/link"; 

export default function Layout({ children }: { children: React.ReactNode }) { 
  return ( 
    <section className="relative flex min-h-screen w-full flex-col bg-secondary/30"> 
      {/* Header */} 
      <header className="flex h-16 w-full items-center border-b border-border/60 bg-background"> 
        <div className="wrapper w-full"> 
          <Link 
            href="/" 
            className="group flex w-fit items-center gap-2 font-semibold text-muted-foreground transition-colors hover:text-foreground" 
          > 
            <span className="flex size-9 items-center justify-center rounded-lg border border-border/60 bg-background transition-all group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary"> 
              <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-0.5" /> 
            </span> 

            <span className="hidden sm:inline">Retour à l&apos;accueil</span> 
          </Link> 
        </div> 
      </header> 

      <main className="wrapper flex flex-1 items-center justify-center py-6 sm:py-4"> 
        {children} 
      </main> 
    </section> 
  ); 
} 
