"use client";

import { links } from "@/data/GlobalData";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

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
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
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
      <nav
        aria-label="Navigation principale"
        className="hidden items-center gap-1 px-6 md:flex lg:gap-2"
      >
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
            className="flex min-h-12 items-center gap-2.5 rounded-sm px-2 py-1.5 transition-colors hover:bg-muted cursor-pointer"
          >
            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-muted">
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
          </button>

          {/* Popup */}
          {showProfile && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 overflow-hidden rounded-sm border border-border bg-background shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 space-y-4">
              <div className="border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-secondary">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={50}
                        height={50}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold uppercase text-brand-green">
                        {user.name.slice(0, 2)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-brand-ink text-lg">
                      {user.name}
                    </p>

                    <p className="text-muted-foreground text-sm">
                      Votre espace personnel
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2 flex flex-col gap-3">
                <Link
                  href="/profile"
                  onClick={() => setShowProfile(false)}
                  className="flex min-h-12 items-center justify-between rounded-xs p-3 text-base text-brand-ink-muted transition-colors hover:bg-muted"
                >
                  <span>Mon profil</span>
                  <User className="text-muted-foreground size-5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setShowLogoutConfirmation(true)}
                  className="flex min-h-12 w-full items-center justify-between rounded-xs p-3 text-base text-destructive transition-colors hover:bg-brand-danger-bg"
                >
                  <span>Déconnexion</span>
                  <LogOut className="size-5" />
                </button>
              </div>

              {showLogoutConfirmation && (
                <div
                  className="border-t border-border bg-muted p-4"
                  role="alertdialog"
                  aria-modal="true"
                  aria-labelledby="logout-title"
                >
                  <p id="logout-title" className="font-semibold text-brand-ink">
                    Confirmer la déconnexion ?
                  </p>
                  <p className="mt-1 text-sm text-brand-ink-muted">
                    Votre session sera fermée sur cet appareil.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLogoutConfirmation(false)}
                      className="min-h-12 flex-1 rounded-sm border border-border bg-background px-3 text-sm text-brand-ink"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        toast.loading("Déconnexion en cours...", {
                          id: "logout",
                        });
                        try {
                          await logout();
                          toast.success("Vous êtes déconnecté.", {
                            id: "logout",
                          });
                        } catch (error) {
                          toast.error("La déconnexion a échoué. Réessayez.", {
                            id: "logout",
                          });
                          console.error(error);
                        }
                      }}
                      className="min-h-12 flex-1 rounded-sm bg-destructive px-3 text-sm text-destructive-foreground"
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="ml-1 flex min-h-12 items-center rounded-xs border border-brand-green px-3 py-2 font-medium text-brand-green transition-colors hover:bg-brand-green hover:text-primary-foreground sm:px-4 active:scale-95"
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
      className={`relative flex min-h-12 items-center gap-0.5 px-2.5 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 lg:px-3 ${isActive ? "text-brand-green" : "text-brand-ink-muted hover:text-brand-ink"}`}
    >
      <span>{label}</span>

      {isActive && (
        <span className="absolute inset-x-2 bottom-0 h-px bg-brand-green" />
      )}
    </Link>
  );
};
