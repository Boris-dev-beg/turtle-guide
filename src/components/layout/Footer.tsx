import Link from "next/link"; 

export default function Footer() { 
  return ( 
    <footer className="mt-auto border-t border-border/60 bg-secondary md:mb-0 mb-17"> 
      <div className="wrapper flex flex-col gap-6 py-8 text-sm text-muted-foreground"> 
        {/* top */} 
        <div className="flex flex-col gap-2"> 
          <Link 
            href="/" 
            className="w-fit text-xl font-bold tracking-tight text-foreground transition-colors hover:text-primary" 
          > 
            TurtleGuide 
          </Link> 

          <p className="max-w-md text-sm leading-5 sm:text-base"> 
            Votre guide pour comprendre et effectuer plus facilement vos 
            démarches administratives au Cameroun. 
          </p> 
        </div> 

        {/* Bottom */} 
        <div className="flex flex-col gap-3 border-t border-border/50 pt-3 text-sm sm:flex-row sm:items-center sm:justify-between"> 
          <p className="text-muted-foreground"> 
            © 2026 TurtleGuide. Tous droits réservés. 
          </p> 

          <nav className="flex flex-wrap gap-x-4 gap-y-2"> 
            <Link 
              href="/" 
              className="transition-colors hover:text-foreground hover:underline" 
            > 
              Mentions légales 
            </Link> 

            <Link 
              href="/" 
              className="transition-colors hover:text-foreground hover:underline" 
            > 
              Politique de confidentialité 
            </Link> 

            <Link 
              href="/" 
              className="transition-colors hover:text-foreground hover:underline" 
            > 
              Conditions d&apos;utilisation 
            </Link> 
          </nav> 
        </div> 
      </div> 
    </footer> 
  ); 
} 
