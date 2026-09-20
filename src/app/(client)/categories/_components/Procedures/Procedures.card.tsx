"use client";

import { ChevronRight } from "lucide-react";
import { Card, CardDescription } from "../../../../../components/ui/card";
import { useRouter } from "next/navigation";
import { useFolderStore } from "@/store/folder.store";
import Image from "next/image";

export const Procedure_card = ({
  procedure,
}: {
  procedure: {
    title: string;
    category: { name: string };
    description: string;
    image: string;
  };
}) => {
  // ! States
  const category = procedure.category?.name?.toLocaleLowerCase() || "";
  const title = procedure.title.toLocaleLowerCase();
  const router = useRouter();
  const { setProcedure } = useFolderStore();

  // ! Functions
  const handleClick = () => {
    setProcedure(procedure.title);
    router.push("/diagnostic");
  };

  // ! Render
  return (
    <Card
      onClick={handleClick}
      className="group turtle-procedure-card py-0 rounded-sm"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-t-sm">
        <Image
          src={procedure.image}
          alt={title}
          width={800}
          height={450}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <p className="text-sm leading-5 text-brand-ink-muted uppercase">
          {category}
        </p>

        <div className="space-y-2">
          <h1 className="font-display line-clamp-2 text-[1.4rem] leading-[1.2] text-brand-ink">
            {title}
          </h1>

          <CardDescription className="line-clamp-2 text-[0.98rem] leading-6 text-brand-ink-muted">
            {procedure.description.split(":")[1] || procedure.description}
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
};
