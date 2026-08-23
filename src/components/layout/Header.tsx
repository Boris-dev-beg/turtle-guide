import { Turtle } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex p-4 border border-turtle-border sticky top-0 z-50 bg-turtle-bg/70 backdrop-blur-md">
      <div className="wrapper w-full flex justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex gap-1 items-center text-turtle-primary text-[26px] font-bold"
        >
          <Turtle className="size-9" />
          <span className="flex *:font-body">
            <h1>Turtle</h1>
            <h1 className="text-turtle-accent">Guide</h1>
          </span>
        </Link>

        {/* Nav bar */}
        <div className="flex gap-4 items-center">
          <nav className="hidden md:flex items-center gap-5 px-5 *:hover:text-turtle-accent-hover text-primary">
            <Link_ href="/" label="Mes dossiers" />
            <Link_ href="/" label="Alertes" />
            <Link_ href="/" label="À propos" />
          </nav>

          <button className="btn btn-primary">Se connecter</button>
        </div>
      </div>
    </header>
  );
}

const Link_ = ({ href, label }: { href: string; label: string }) => {
  return (
    <Link href={href} className="font-semibold">
      {label}
    </Link>
  );
};
