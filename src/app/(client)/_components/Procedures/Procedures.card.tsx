"use client";

import { ChevronRight } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { RightIcon } from "./icons";
import { NeededProcedure } from "@/app/api/procedures/_types/type";
import { useRouter } from "next/navigation";

export const Procedure_card = ({
  procedure,
}: {
  procedure:NeededProcedure;
}) => {
  const category = procedure.category?.name?.toLocaleLowerCase() || "";
  const title = procedure.title.toLocaleLowerCase();
  const  router = useRouter()

  return (
    <Card onClick={()=> router.push("/login")} className="group flex min-h-55 w-full cursor-pointer flex-col overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-3 p-5 pb-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <RightIcon
            title={title}
            category={category}
            className="size-6 transition-transform duration-300 group-hover:scale-110"
          />
        </span>

        <CardTitle className="line-clamp-2 text-base font-bold leading-snug sm:text-lg">
          {procedure.title}
        </CardTitle>
      </CardHeader>

      {/* Description */}
      <CardDescription className="px-5 text-base leading-6 text-muted-foreground">
        {procedure.description}
      </CardDescription>

      {/* Footer */}
      <CardFooter className="mt-auto flex items-center gap-3 p-5 pt-4">
        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {procedure.category?.name}
        </span>

        <span className="ml-auto flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
          <ChevronRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </CardFooter>
    </Card>
  );
};
