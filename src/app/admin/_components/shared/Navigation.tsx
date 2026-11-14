"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathName = usePathname();
  return (
    <nav
      aria-label="Navigation Dashboard"
      className="items-center gap-3 flex flex-col"
    >
      {[{ label: "Dashboard", href: "/admin" }].map((link, index) => (
        <Link_
          key={index}
          href={link.href}
          label={link.label}
          pathName={pathName}
        />
      ))}
    </nav>
  );
}

const Link_ = ({
  href,
  label,
  pathName,
}: {
  href: string;
  label: string;
  pathName: string;
}) => {
  const isActive =
    pathName === href || (href !== "/" && pathName.startsWith(href));

  return (
    <Link
      href={href}
      className={`relative flex min-h-12 items-center gap-0.5 px-2.5 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${isActive ? "text-brand-green" : "text-brand-ink-muted hover:text-brand-ink"} group`}
    >
      <span>{label}</span>

      {isActive && (
        <span className="absolute inset-y-2 left-0 group-hover:w-2 w-1 bg-brand-green transition-all duration-300" />
      )}
    </Link>
  );
};
