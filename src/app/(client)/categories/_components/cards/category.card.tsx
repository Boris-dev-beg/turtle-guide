"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProcedures } from "@/hooks/useProcedures";
import { useFolderStore } from "@/store/folder.store";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function Category_card({
  title,
  description,
  procedureCount,
}: {
  title: string;
  description: string;
  procedureCount: number;
}) {
  const router = useRouter();
  const { setCategory: setCat } = useProcedures();
  const { setCategory } = useFolderStore();

  const handleClick = () => {
    setCat(title);
    setCategory(title);
    router.push(`/categories/${title}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="group p-4 pl-4 rounded-sm"
    >
      <div className="flex min-h-12 items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 h-1.5 w-12 rounded-full bg-brand-yellow/30" />
          <CardTitle className="font-display text-[1.4rem] leading-[1.2] text-brand-ink">
            {title}
          </CardTitle>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-3 pt-4">
        <CardHeader className="space-y-1 p-0">
          <CardDescription className="line-clamp-3 text-[0.98rem] leading-6 text-brand-ink-muted">
            {description}
          </CardDescription>
        </CardHeader>

        <div className="flex items-center justify-between gap-3 border-t border-brand-line pt-3">
          <p className="text-[0.9rem] leading-6 text-brand-ink-muted">
            {procedureCount} procédure{procedureCount > 1 ? "s" : ""}
          </p>

          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-brand-ink-muted transition-colors duration-200 group-hover:border-brand-green group-hover:bg-brand-green group-hover:text-white">
            <ChevronRight className="size-4" />
          </span>
        </div>
      </div>
    </Card>
  );
}

export function Loader() {
  return (
    <>
      <Category_Skeleton />
      <Category_Skeleton />
      <Category_Skeleton />
      <Category_Skeleton />
    </>
  );
}

function Category_Skeleton() {
  return (
    <Card className="flex min-h-48 animate-pulse flex-col justify-between rounded-sm border border-border bg-card p-4">
      <div className="flex min-h-12 items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 h-1.5 w-12 rounded-full bg-brand-yellow/30" />
          <Skeleton className="h-7 w-3/5 rounded-md" />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-3 pt-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-brand-line pt-3">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>
    </Card>
  );
}
