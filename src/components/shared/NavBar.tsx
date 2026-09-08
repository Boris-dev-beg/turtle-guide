"use client";

import { links } from "@/data/GlobalData";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, ChevronDown, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const NavBar = ({
  user,
}: {
  user:
    | { id: string; name: string; image?: string | undefined | null }
    | undefined;
}) => {
  // ! States
  const profileRef = useRef<HTMLDivElement>(null);
  const [showProfile, setShowProfile] = useState(false);
  const pathName = usePathname();
  const { logout } = useAuth();

  // ! Functions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    }

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);
  // ! Render
  return (
    <div className="flex items-center gap-2">
      <nav className="hidden items-center gap-1 md:flex lg:gap-2 px-10">
        {links.map((link, index) => (
          <Link_
            key={index}
            href={link.href}
            label={link.label}
            pathName={pathName}
          />
        ))}
      </nav>

      {user ? (
        <div ref={profileRef} className="relative">
          {/* Avatar */}
          <button
            type="button"
            onClick={() => setShowProfile((prev) => !prev)}
            aria-label="Ouvrir le menu du profil"
            aria-expanded={showProfile}
            className="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/70 cursor-pointer"
          >
            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold uppercase text-foreground">
                  {user.name.slice(0, 2)}
                </span>
              )}
            </div>

            <span className="hidden text-sm font-semibold text-foreground sm:block">
              {user.name}
            </span>

            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform duration-200 ${
                showProfile ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Popup */}
          {showProfile && (
            <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-64 overflow-hidden rounded-lg border border-border bg-background shadow-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
              <div className="border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={50}
                        height={50}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-black uppercase text-primary">
                        {user.name.slice(0, 2)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-primary text-lg">
                      {user.name}
                    </p>

                    <p className="text-muted-foreground">
                      Votre espace personnel
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2 flex flex-col gap-2">
                <Link
                  href="/profile"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted btn text-muted-foreground text-base"
                >
                  <span>Mon profil</span>
                  <User className="text-muted-foreground size-5" />
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center justify-between p-3 text-base btn btn-destructive"
                >
                  <span>Déconnexion</span>
                  <LogOut className="size-5" />
                </button>
              </div>
            </div>
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
      className={`relative flex items-center gap-1.5 px-2.5 py-1 font-semibold whitespace-nowrap transition-all duration-200 lg:px-3 ${isActive ? "text-primary" : "hover:text-primary"}`}
    >
      <span>{label}</span>

      {isActive && (
        <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary" />
      )}
    </Link>
  );
};
