"use client";
import { LucideIcon } from "lucide-react";

export default function Form_layout({
  children,
  title,
  description,
  icon: Icon,
}: {
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  icon: LucideIcon;
}) {
  return (
    <div className="w-full max-w-md rounded-sm border border-border bg-card p-5 sm:p-8">
      {/* Icône */}
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-sm border border-border bg-secondary text-brand-green">
        <Icon className="size-8" />
      </div>

      {/* Titre */}
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl text-brand-ink">{title}</h1>

        <p className="mt-3 leading-6 text-brand-ink-muted">{description}</p>
      </div>

      {/* Formulaire */}
      <>{children}</>
    </div>
  );
}
