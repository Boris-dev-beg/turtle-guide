"use client";

import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// import { useProcedures } from "@/hooks/useProcedures";
import { useFolderStore } from "@/store/folder.store";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export function Card_({
  title,
  categoryName,
}: {
  title: string;
  categoryName: string;
}) {
  // ! States
  const router = useRouter();
  // const { getByCategory } = useProcedures();
  const { setCategory, setProcedure } = useFolderStore();

  // ! Functions
  const handleClick = () => {
    // getByCategory(title);
    setCategory(categoryName);
    setProcedure(title);

    router.push(`/diagnostic`);
  };

  // ! Render
  return (
    <Card
      onClick={handleClick}
      className="group flex min-h-30 items-center gap-4 rounded-xs border-border/60 bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md cursor-pointer"
    >
      <CardDescription className="flex flex-col mt-auto w-full gap-2">
        <span className="truncate font-semibold text-brand-green bg-brand-green-soft py-1 px-2 border-2 border-brand-green-light rounded-full text-sm w-fit">
          {categoryName}
        </span>
        <span className="flex items-center">
          <h1 className="line-clamp-2 text-lg font-semibold leading-snug w-full text-foreground">
            {title}
          </h1>

          <ChevronRight className="ml-auto size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </CardDescription>
    </Card>
  );
}

export function Card_loader() {
  return (
    <Card className="flex min-h-30 flex-row items-center gap-4 rounded-xs border-border/60 p-4">
      <CardHeader className="w-full space-y-2 p-0">
        <Skeleton className="h-5 w-4/5" />

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="size-4 rounded-full" />
        </div>
      </CardHeader>
    </Card>
  );
}
