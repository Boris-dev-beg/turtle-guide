"use client";

import { InputDemo } from "@/components/shared/inputs";
import { RightIcon } from "./icons";
import Link from "next/link";

export function FilterForm({
  filter,
  title,
}: {
  title: string;
  filter: (searchElt: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5 lg:flex-row lg:items-end lg:justify-between">
      <SelectedCategory title={title} />

      <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-100 lg:flex-row lg:items-center">
        <InputDemo
          filter={filter}
          className="w-full lg:w-100"
        />
      </div>
    </div>
  );
}

const SelectedCategory = ({ title }: { title: string }) => {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Catégorie sélectionnée
      </span>

      <div className="flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <RightIcon
            category={title}
            className="size-6"
          />
        </span>

        <div>
          <h2 className="truncate text-xl font-bold leading-tight">
            {title}
          </h2>

          <Link
            href="/categories"
            className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
          >
            Changer de catégorie
          </Link>
        </div>
      </div>
    </div>
  );
};