"use client";

import { links } from "@/data/GlobalData";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const pathName = usePathname();

  return (
    <div className="flex items-center gap-2">
      <nav className="hidden items-center gap-1 md:flex lg:gap-2">
        {links.map((link, index) => (
          <Link_
            key={index}
            icon={link.icon}
            href={link.href}
            label={link.label}
            pathName={pathName}
          />
        ))}
      </nav>

      <Link
        href="/login"
        className="ml-1 rounded-lg border-2 border-white/30 bg-white/10 px-3 py-2 font-semibold text-primary-foreground backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-primary sm:px-4"
      >
        Se connecter
      </Link>
    </div>
  );
};

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
      className={`relative flex items-center gap-1.5 px-2.5 py-1 font-semibold whitespace-nowrap transition-all duration-200 lg:px-3 ${isActive ? "text-white" : "text-primary-foreground/90  hover:text-white"}`}
    >
      <Icon
        className={`size-5 transition-transform duration-200 ${isActive ? "scale-105" : ""}`}
        strokeWidth={isActive ? 2.5 : 2}
      />

      <span>{label}</span>

      {isActive && (
        <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-white" />
      )}
    </Link>
  );
};
