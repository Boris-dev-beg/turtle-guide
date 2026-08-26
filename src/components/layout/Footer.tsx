import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex justify-center pt-4 px-2 md:mb-0 mb-5 mt-auto border-t border-turtle-border bg-turtle-card-bg">
      <div className="wrapper flex gap-2 flex-col sm:flex-row justify-between items-center text-turtle-text-muted text-xs text-nowrap">
        <p>&copy; 2026 TurtleGuide. Tous droits réservés.</p>
        <span className="flex flex-row max-[500px]:flex-col justify-between md:justify-center items-center *:hover:underline *:flex w-full md:w-1/2">
          <Link
            href="/"
            className="border-r md:border-r-0 max-[500px]:border-r-0  border-turtle-ink px-2"
          >
            Mentions légales
          </Link>
          <Link
            href="/"
            className="border-r max-[500px]:border-r-0 md:border-r-0 border-turtle-ink px-2"
          >
            Politique de confidentialité
          </Link>
          <Link href="/" className="pl-2">
            Conditions d&apos;utilisation
          </Link>
        </span>
      </div>
    </footer>
  );
}
