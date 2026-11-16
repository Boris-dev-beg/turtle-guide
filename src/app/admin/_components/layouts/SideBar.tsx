"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { SidebarClose, SidebarOpen } from "lucide-react";
import ShortNavigation from "../shared/ShortNavigation";
import Navigation from "../shared/Navigation";

const STORAGE_KEY = "showFullNavigation";
const SIDEBAR_CHANGE_EVENT = "admin-sidebar-change";

function subscribeToSidebarPreference(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SIDEBAR_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SIDEBAR_CHANGE_EVENT, onChange);
  };
}

function getSidebarPreference() {
  return localStorage.getItem(STORAGE_KEY) !== "false";
}

function getServerSidebarPreference() {
  return true;
}

export default function SideBar() {
  const isOpen = useSyncExternalStore(
    subscribeToSidebarPreference,
    getSidebarPreference,
    getServerSidebarPreference,
  );

  const toggleSidebar = () => {
    localStorage.setItem(STORAGE_KEY, String(!isOpen));
    window.dispatchEvent(new Event(SIDEBAR_CHANGE_EVENT));
  };

  return (
    <aside
      aria-label="Barre latérale d'administration"
      className={`sticky top-0 flex h-screen shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm transition-[width] duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-18"
      }`}
    >
      <div
        className={`flex h-20 shrink-0 items-center border-b border-sidebar-border ${
          isOpen ? "justify-between px-4" : "justify-center px-2"
        }`}
      >
        {isOpen && (
          <Link
            href="/admin"
            aria-label="TurtleGuide — dashboard administrateur"
            className="min-w-0 transition-opacity hover:opacity-80"
          >
            <Image
              src="/brand/turtleguide-logo.svg"
              alt="TurtleGuide"
              width={210}
              height={44}
              priority
              className="h-10 w-44 object-contain object-left"
            />
          </Link>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={
            isOpen ? "Fermer la barre latérale" : "Ouvrir la barre latérale"
          }
          aria-expanded={isOpen}
          aria-controls="admin-sidebar-navigation"
          title={
            isOpen ? "Fermer la barre latérale" : "Ouvrir la barre latérale"
          }
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-brand-green transition-colors hover:bg-brand-green-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {isOpen ? (
            <SidebarClose className="size-6" strokeWidth={2.2} aria-hidden="true" />
          ) : (
            <SidebarOpen className="size-6" strokeWidth={2.2} aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        id="admin-sidebar-navigation"
        className="min-h-0 flex-1 overflow-y-auto py-5"
      >
        {isOpen ? <Navigation /> : <ShortNavigation />}
      </div>

      <div
        className={`shrink-0 border-t border-sidebar-border py-3 text-xs text-brand-ink-muted ${
          isOpen ? "px-4" : "text-center"
        }`}
      >
        {isOpen ? "Administration · TurtleGuide" : "TG"}
      </div>
    </aside>
  );
}
