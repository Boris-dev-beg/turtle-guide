import Link from "next/link";
import Image from "next/image";
import { NavBar } from "../shared/NavBar";

export default function Header({
  user,
}: {
  user:
    | { id: string; name: string; image?: string | undefined | null }
    | undefined;
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background text-brand-ink">
      <div className="wrapper flex min-h-16 w-full items-center justify-between py-2">
        {/* Logo */}
        <Link
          href="/"
          aria-label="TurtleGuide — accueil"
          className="group flex h-12 w-12 shrink-0 items-center justify-start transition-opacity hover:opacity-80 md:h-13 md:w-60"
        >
          <Image
            src="/brand/turtleguide-mark.svg"
            alt=""
            width={48}
            height={48}
            className="size-11 md:hidden"
            priority
          />

          <Image
            src="/brand/turtleguide-logo.svg"
            alt=""
            width={360}
            height={76}
            className="hidden h-13 w-60 object-contain object-left md:block"
            priority
          />
        </Link>

        {/* Navigation */}
        <NavBar user={user} />
      </div>
    </header>
  );
}
