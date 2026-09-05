import Link from "next/link";
import Image from "next/image";

import Turtle from "../../assets/images/logo.png";
import { NavBar } from "../shared/NavBar";

export default function Header({
  user,
}: {
  user: { id: string; name: string; image?: string | undefined | null } | undefined;
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary/95 text-primary-foreground shadow-sm backdrop-blur-xl">
      <div className="wrapper flex h-16 w-full items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 p-1.5 shadow-sm sm:size-11">
            <Image
              src={Turtle}
              alt="Logo TurtleGuide"
              className="size-full object-contain"
              priority
            />
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight sm:text-2xl">
              TurtleGuide
            </span>

            <span className="mt-1 hidden text-[12px] font-medium text-primary-foreground/90 sm:block sm:text-sm">
              Votre guide administratif
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <NavBar user={user} />
      </div>
    </header>
  );
}
