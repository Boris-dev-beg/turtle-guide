"use client";
import { links } from "@/data/GlobalData";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathName = usePathname();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 md:hidden">
      <nav className="mx-auto grid h-16 max-w-md grid-cols-3 items-center rounded-2xl bg-secondary/95 p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.15)] backdrop-blur-xl">
        {links.map((link, index) => (
          <Link_
            key={index}
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
      className={`relative flex h-full flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200 ease-out
        ${isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-background/60 hover:text-foreground"}
      `}
    >
      <Icon
        className={`size-6 transition-transform duration-200 ${
          isActive ? "scale-105" : ""
        }`}
        strokeWidth={isActive ? 2.5 : 2}
      />

      <span className="max-w-full truncate">{label}</span>
    </Link>
  );
};
