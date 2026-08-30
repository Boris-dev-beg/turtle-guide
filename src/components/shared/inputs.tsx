"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";

export function SelectDemo({
  filter,
}: {
  filter: (searchElt: string) => void;
}) {
  const { categories } = useCategories();

  const defaultCategory = "Toutes les procédures";

  const filteredCategories = categories.filter(
    (cat) => cat.name !== defaultCategory,
  );

  // ! Render
  return (
    <Select
      defaultValue={defaultCategory}
      onValueChange={(value) => {
        filter(value ?? "");
      }}
    >
      <SelectTrigger className="h-11 w-full border-0 bg-transparent px-3 shadow-none focus:ring-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-5 text-muted-foreground" />
          <SelectValue placeholder="Choisir une catégorie" />
        </div>
      </SelectTrigger>

      <SelectContent className="w-64 rounded-xs border-border/60 p-1.5 shadow-lg">
        <SelectGroup>
          <SelectLabel className="px-2 py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Filtrer par catégorie
          </SelectLabel>

          <SelectItem
            value={defaultCategory}
            className="text-lg! cursor-pointer rounded-xs px-3 py-2.5"
          >
            Toutes les procédures
          </SelectItem>

          {filteredCategories.map((cat) => (
            <SelectItem
              key={cat.id}
              value={cat.name}
              className="cursor-pointer rounded-xs px-3 py-2.5"
            >
              {cat.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function InputDemo({
  className,
  filter,
}: {
  className?: string;
  filter: (searchElt: string) => void;
}) {
  // ! States
  const [searchValue, setSearchValue] = useState("");

  // ! Functions
  const handleChange = (value: string) => {
    setSearchValue(value);
    filter(value);
  };

  // ! Render
  return (
    <InputGroup
      className={`
        ${className ?? ""}
        h-11 rounded-sm border-border/60 bg-card shadow-sm
        transition-all duration-200
        focus-within:border-primary/20!
        focus-within:ring-primary/40!
      `}
    >
      <InputGroupAddon className="px-3 text-muted-foreground">
        <Search className="size-5" />
      </InputGroupAddon>

      <InputGroupInput
        type="search"
        value={searchValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Rechercher ..."
        className="h-full placeholder:text-muted-foreground/70 focus-visible:ring-0"
      />
    </InputGroup>
  );
}
