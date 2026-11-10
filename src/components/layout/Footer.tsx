import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-auto mb-17 border-t border-border bg-secondary md:mb-0">
      <div className="wrapper flex flex-col gap-6 py-8 text-sm text-brand-ink-muted">
        {/* top */}
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            aria-label="TurtleGuide — accueil"
            className="w-fit transition-opacity hover:opacity-80"
          >
            <Image
              src="/brand/turtleguide-logo.svg"
              alt="TurtleGuide — Vos démarches, pas à pas"
              width={288}
              height={61}
              className="h-14 w-64 object-contain object-left"
            />
          </Link>

          <p className="max-w-md text-sm leading-5 sm:text-base">
            Votre guide pour comprendre et effectuer plus facilement vos
            démarches administratives au Cameroun.
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 border-t border-border pt-3 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-brand-ink-muted">
            © 2026 TurtleGuide. Tous droits réservés.
          </p>

          <nav
            aria-label="Informations légales"
            className="flex flex-wrap gap-x-4 gap-y-2"
          >
            <a href="">Mentions légales</a>
            <a href="">Politique de confidentialité</a>
            <a href="">Conditions d&apos;utilisation</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
