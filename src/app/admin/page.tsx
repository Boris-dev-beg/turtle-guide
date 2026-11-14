import Image from "next/image";
import Link from "next/link";
import Navigation from "./_components/shared/Navigation";

export default function page() {
  return (
    <div>
      <aside className="flex flex-col gap-3 w-50 max-w-100 min-w-0 bg-sidebar border-r border-r-sidebar-border fixed inset-y-0">
        <div className="border-b-2 border-border p-3">
          {/* Logo */}
          <Link
            href="/"
            aria-label="TurtleGuide — accueil"
            className="group flex h-12 w-12 shrink-0 items-center justify-start transition-opacity hover:opacity-80 md:h-13 md:w-60"
          >
            {/* <Image
              src="/brand/turtleguide-mark.svg"
              alt=""
              width={48}
              height={48}
              className="size-11 md:hidden"
              priority
            /> */}

            <Image
              src="/brand/turtleguide-logo.svg"
              alt=""
              width={360}
              height={76}
              className="h-13 w-60 object-contain object-left md:block"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 p-5">
          <h1 className="text-sm text-ink font-semibold border-l-2 border-accent pl-2">Navigation</h1>
          <Navigation />
        </div>
      </aside>
    </div>
  );
}
