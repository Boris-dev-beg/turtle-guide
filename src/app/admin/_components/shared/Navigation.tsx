"use client";

import { LinksDashboard } from "@/data/GlobalData";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Navigation() {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  return (
    <nav aria-label="Navigation Dashboard" className="flex flex-col gap-1 px-3">
      {LinksDashboard.map((link) => (
        <Link_
          key={link.href}
          href={link.href}
          label={link.label}
          icon={link.icon}
          icon2={link.icon2}
          subItems={link.children}
          pathName={pathName}
          queryString={searchParams.toString()}
        />
      ))}
    </nav>
  );
}

const Link_ = ({
  href,
  label,
  icon: Icon,
  icon2: Icon2,
  subItems,
  pathName,
  queryString,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  icon2?: LucideIcon;
  subItems?: { label: string; href: string }[];
  pathName: string;
  queryString: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const isActive =
    pathName === href || (href !== "/admin" && pathName.startsWith(`${href}/`));
  const hasActiveChild =
    subItems?.some((item) =>
      isSubItemActive(item.href, pathName, queryString),
    ) ?? false;
  const isExpanded = expanded || hasActiveChild;

  return (
    <div>
      <div
        className={`group relative flex min-h-11 items-center gap-3 rounded-r-md text-base font-medium transition-colors duration-200 ${
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-brand-ink-muted hover:bg-muted hover:text-brand-ink"
        }`}
      >
        <Link
          href={href}
          aria-current={isActive ? "page" : undefined}
          className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2"
        >
          <Icon
            className="size-6 shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="flex-1 text-nowrap">{label}</span>
        </Link>

        {Icon2 && subItems && subItems.length > 0 && (
          <button
            type="button"
            aria-label={`${isExpanded ? "Masquer" : "Afficher"} les sous-onglets ${label}`}
            aria-expanded={isExpanded}
            onClick={() => setExpanded((value) => !value)}
            className="mr-2 inline-flex size-9 shrink-0 items-center justify-center rounded-sm hover:bg-brand-green-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring cursor-pointer"
          >
            <Icon2
              className={`size-5 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        )}

        {isActive && (
          <span className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-brand-green" />
        )}
      </div>

      {subItems && subItems.length > 0 && isExpanded && (
        <ul className="ml-6 mt-1 space-y-0.5 border-l border-border py-1 pl-3">
          {subItems.map((child) => {
            const isChildActive = isSubItemActive(
              child.href,
              pathName,
              queryString,
            );
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  aria-current={isChildActive ? "page" : undefined}
                  className={`block rounded-sm px-3 py-2 text-sm transition-colors ${
                    isChildActive
                      ? "font-semibold text-brand-green-dark"
                      : "text-brand-ink-muted hover:bg-muted hover:text-brand-ink"
                  }`}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

/** Compare un sous-lien configuré avec le chemin et la query courants pour marquer le bon onglet. */
function isSubItemActive(href: string, pathname: string, queryString: string) {
  const [childPath, childQuery = ""] = href.split("?");
  if (pathname !== childPath) return false;

  const expectedParams = new URLSearchParams(childQuery);
  const currentParams = new URLSearchParams(queryString);
  return [...expectedParams].every(
    ([key, value]) => currentParams.get(key) === value,
  );
}
