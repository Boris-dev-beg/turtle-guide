import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { RightIcon } from "../Procedures/icons";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function Category_card({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Link href={`/categories/${title}`}>
      <Card className="group relative flex min-h-45 flex-col justify-between overflow-hidden rounded-2xl border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
        <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

        <span className="relative flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <RightIcon
            category={title}
            className="size-7 transition-transform duration-300 group-hover:scale-110"
          />
        </span>

        <div className="flex items-end gap-3 pt-4">
          <CardHeader className="min-w-0 flex-1 space-y-1 p-0">
            <CardTitle className="text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
              {title}
            </CardTitle>

            <CardDescription className="line-clamp-2 text-base ms:text-lg leading-5">
              {description}
            </CardDescription>
          </CardHeader>

          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
            <ChevronRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Card>
    </Link>
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
    <Card className="flex min-h-45 flex-col justify-between rounded-2xl border-border/60 p-5">
      <Skeleton className="size-12 rounded-xl" />

      <div className="flex items-end gap-3 pt-6">
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        <Skeleton className="size-9 shrink-0 rounded-full" />
      </div>
    </Card>
  );
}
