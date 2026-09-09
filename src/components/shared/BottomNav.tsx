"use client";
import { links } from "@/data/GlobalData";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathName = usePathname();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background md:hidden">
      <nav className="mx-auto grid h-16 w-full max-w-lg grid-cols-4">
        {links.map((link) => (
          <Link_
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            pathName={pathName}
          />
        ))}
      </nav>
    </footer>
  );
}

const Link_ = ({
  href,
  label,
  icon: Icon,
  pathName,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  pathName: string;
}) => {
  const isActive =
    pathName === href || (href !== "/" && pathName.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex h-full min-w-0 w-full flex-col items-center justify-center gap-1 border-t-2 px-2 py-1.5 text-center transition-colors duration-200 ${
        isActive
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon
        className="size-6 shrink-0"
        strokeWidth={isActive ? 2.3 : 1.9}
      />

      <span className="w-full truncate text-sm font-medium leading-4">
        {label}
      </span>
    </Link>
  );
};