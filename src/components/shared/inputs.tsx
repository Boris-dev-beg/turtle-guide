"use client";
import { Search } from "lucide-react";
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

const items = [
  { label: "Toutes les categories", value: null },
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
];

export function SelectDemo() {
  return (
    <Select items={items}>
      <SelectTrigger className="w-full max-w-48 border-none!">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="p-3 w-60 shadow-sm shadow-turtle-card-bg">
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          {items.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="cursor-pointer hover:bg-turtle-primary-light px-2 py-1.5"
            >
              {item.label}
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
      className={`${className ? className : ""} py-5 focus-within:ring-turtle-primary-border! focus-within:border-none! rounded-sm`}
    >
      <InputGroupAddon>
        <Search className="size-5" />
      </InputGroupAddon>
      <InputGroupInput
      type="search"
        value={searchValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Rechercher une procedure..."
        className="turtle-radio"
      />
    </InputGroup>
  );
}
