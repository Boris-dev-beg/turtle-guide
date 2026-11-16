"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, ChevronDown, LogOut, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [search, setSearch] = useState("");
  const { logout } = useAuth();
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-30 flex min-h-20 w-full items-center gap-3 border-b border-border bg-card/95 px-3 shadow-sm backdrop-blur sm:gap-5 sm:px-6">
      <div
        aria-label="TurtleGuide — administration"
        className="flex flex-col min-w-0 shrink-0"
      >
        <h1 className="font-bold text-xl">Trutle Guide</h1>
        <span className="hidden border-l border-border pl-2 text-sm font-medium text-brand-ink-muted lg:block">
          Administration
        </span>
      </div>

      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="ml-auto hidden min-w-40 max-w-xl flex-1 md:block"
      >
        <label className="relative block">
          <span className="sr-only">Rechercher dans l’administration</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand-ink-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une procédure, un utilisateur…"
            className="h-12 w-full rounded-full border border-transparent bg-secondary/80 pl-12 pr-4 text-sm text-brand-ink outline-none transition focus:border-brand-green/30 focus:bg-card focus:ring-4 focus:ring-brand-green/10"
          />
        </label>
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0 md:gap-4">
        <Link
          href="/admin/fraud-alerts"
          aria-label="Consulter les alertes de fraude"
          title="Alertes de fraude"
          className="relative inline-flex size-10 items-center justify-center rounded-full text-brand-ink-muted transition-colors hover:bg-muted hover:text-brand-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Bell className="size-5" aria-hidden="true" />
        </Link>

        <div className="hidden h-10 w-px bg-border sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label="Ouvrir le menu du compte"
                className="flex min-w-0 items-center gap-2 rounded-full p-1 pr-1.5 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-3 sm:pr-2"
              />
            }
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-green-soft text-sm font-semibold text-brand-green-dark">
              {initials || "AD"}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block max-w-36 truncate text-sm font-semibold text-brand-ink">
                {name}
              </span>
              <span className="block text-xs text-brand-ink-muted">
                Administrateur
              </span>
            </span>
            <ChevronDown
              className="hidden size-4 text-brand-ink-muted sm:block"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-65 p-5 gap-4 flex flex-col">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <h2 className="block truncate font-medium text-brand-ink text-base">
                  {name}
                </h2>
                <p className="block truncate text-sm text-brand-ink-muted">
                  {email}
                </p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <button
              onClick={() => void logout()}
              className="cursor-pointer btn-destructive btn p-2 rounded-sm flex-nowrap"
            >
              <LogOut aria-hidden="true" />
              Se déconnecter
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
