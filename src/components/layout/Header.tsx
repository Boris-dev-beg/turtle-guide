import Link from "next/link";
import Image from "next/image";

import Turtle from "../../assets/images/logo.png";
import logo_mobile from "../../assets/images/logos/mobile.png";
import logo_tablet from "../../assets/images/logos/tablet.png";
import logo_descktop from "../../assets/images/logos/desktop.png";
import { NavBar } from "../shared/NavBar";

export default function Header({
  user,
}: {
  user:
    | { id: string; name: string; image?: string | undefined | null }
    | undefined;
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary-foreground text-brand-ink shadow-sm backdrop-blur-xl">
      <div className="wrapper flex h-16 w-full items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center justify-center w-15 md:w-55 gap-2 transition-opacity hover:opacity-90"
        >
          <Image
            src={logo_mobile}
            alt="Logo TurtleGuide"
            className="md:hidden size-full object-contain"
            priority
          />

          <Image
            src={logo_tablet}
            alt="Logo TurtleGuide"
            className="hidden md:flex lg:hidden size-full object-contain"
            priority
          />

          <Image
            src={logo_descktop}
            alt="Logo TurtleGuide"
            className="hidden lg:flex size-full object-contain"
            priority
          />
        </Link>

        {/* Navigation */}
        <NavBar user={user} />
      </div>
    </header>
  );
}
