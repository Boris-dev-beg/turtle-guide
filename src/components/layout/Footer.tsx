import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex justify-center py-4 md:mb-0 mb-17 mt-auto border-t border-turtle-border bg-secondary">
      <div className="wrapper flex gap-2 flex-col justify-between items-center text-turtle-text-muted text-center text-xs">
        <p>
          TurtleGuide. vous guide pour chaque démarche administrative au
          cameroun.
        </p>
        <div className="flex gap-2 flex-col sm:flex-row justify-between items-center">
          <p>&copy; 2026 TurtleGuide. Tous droits réservés.</p>
          <span className="flex justify-between md:justify-center items-center *:hover:underline w-full md:w-1/2">
            <Link
              href="/"
              className="border-r md:border-r-0 max-[500px]:border-r-0  border-muted-foreground px-2"
            >
              Mentions légales
            </Link>
            <Link
              href="/"
              className="border-r max-[500px]:border-r-0 md:border-r-0 border-muted-foreground px-2"
            >
              Politique de confidentialité
            </Link>
            <Link href="/" className="pl-2">
              Conditions d&apos;utilisation
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
