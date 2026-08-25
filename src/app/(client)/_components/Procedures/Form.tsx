"use client";
import { InputDemo, SelectDemo } from "@/components/shared/inputs";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { ListFilter } from "lucide-react";

export function FilterForm({
  filter,
}: {
  filter: (searchElt: string) => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-3">
      <p className="text-turtle-slate">
        Choississez la procédure qui correspond à votre besoin.
      </p>
      <InputDemo filter={filter} className="lg:w-100 lg:ml-auto" />

      <InputGroup className="lg:hidden py-5 w-fit focus-within:ring-turtle-primary-border! focus-within:border-none! rounded-sm">
        <InputGroupAddon>
          <ListFilter className="size-5" />
        </InputGroupAddon>
        <SelectDemo filter={filter} />
      </InputGroup>
    </div>
  );
}
