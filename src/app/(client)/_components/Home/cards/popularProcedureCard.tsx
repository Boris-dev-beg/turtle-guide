"use client";

import { Card, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// import { useProcedures } from "@/hooks/useProcedures";
import { useFolderStore } from "@/store/folder.store";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Card_({
  title,
  categoryName,
  image,
  description,
}: {
  title: string;
  categoryName: string;
  description: string;
  image: string;
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
      className="group turtle-procedure-card py-0 rounded-sm"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-t-sm">
        <Image
          src={image}
          alt={title}
          width={800}
          height={450}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <p className="text-sm leading-5 text-brand-ink-muted">{categoryName}</p>

        <div className="space-y-2">
          <h1 className="font-display line-clamp-2 text-[1.4rem] leading-[1.2] text-brand-ink">
            {title}
          </h1>

          <CardDescription className="line-clamp-2 text-[0.98rem] leading-6 text-brand-ink-muted">
            {description.split(":")[1] || description}
          </CardDescription>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-brand-line pt-3">
          <p className="text-[0.9rem] leading-6 text-brand-ink-muted">
            Commencer le diagnostic
          </p>

          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-brand-ink-muted transition-colors duration-200 group-hover:border-brand-green group-hover:bg-brand-green group-hover:text-white">
            <ChevronRight className="size-4" />
          </span>
        </div>
      </div>
    </Card>
  );
}

export function Card_loader() {
  return (
    <Card className="group flex animate-pulse cursor-pointer flex-col overflow-hidden rounded-[1.125rem] border border-border bg-card border-l-[3px] border-l-brand-yellow">
      <Skeleton className="aspect-video w-full rounded-none" />

      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-4 w-24 rounded-md" />

        <div className="space-y-2">
          <Skeleton className="h-7 w-3/5 rounded-md" />
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
