"use client";

import { LayoutDashboard, ShieldAlert, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ShortNavigation() {
  const pathName = usePathname();
  return (
    <nav
      aria-label="Navigation Dashboard"
      className="flex flex-col items-center gap-2 px-2"
    >
      {[
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        {
          icon: ShieldAlert,
          label: "Alertes de fraude",
          href: "/admin/fraud-alerts",
        },
      ].map((link) => (
        <Link_
          key={link.href}
          href={link.href}
          label={link.label}
          icon={link.icon}
          pathName={pathName}
        />
      ))}
    </nav>
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
    pathName === href || (href !== "/admin" && pathName.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      title={label}
      className={`group relative flex size-11 items-center justify-center rounded-sm transition-colors duration-200 ${
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-brand-ink-muted hover:bg-muted hover:text-brand-ink"
      }`}
    >
      <Icon className="size-6 shrink-0" strokeWidth={2} aria-hidden="true" />

      {isActive && (
        <span className="absolute inset-y-0 left-0 w-1 bg-brand-green" />
      )}
    </Link>
  );
};
