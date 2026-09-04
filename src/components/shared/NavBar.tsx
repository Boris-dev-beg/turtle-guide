"use client";

import { links } from "@/data/GlobalData";
import { useAuth } from "@/hooks/useAuth";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const NavBar = ({ name }: { name?: string }) => {
  // ! States
  const [showProfile, setShowProfile] = useState(false);
  const pathName = usePathname();
  const { logout } = useAuth();

  // ! Functions
  // ! Render
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

      {name ? (
        <div className="flex flex-col rounded-full bg-primary/10 p-1 border-2 border-white/30 relative">
          <h1
            onClick={() => setShowProfile(!showProfile)}
            className="text-primary-foreground/70 font-black uppercase cursor-pointer"
          >
            {name[0] + name[1]}
          </h1>
          {showProfile && (
            <span className="absolute top-full right-full w-40 flex flex-col gap-2 p-2 rounded-sm bg-muted-foreground/90">
              <h1 className="font-semibold">Mon profil</h1>
              <button onClick={logout} className="btn btn-destructive text-base">
                Déconnexion
              </button>
            </span>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="ml-1 rounded-lg border-2 border-white/30 bg-white/10 px-3 py-2 font-semibold text-primary-foreground backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-primary sm:px-4"
        >
          Se connecter
        </Link>
      )}
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
