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

export function InputDemo({ className }: { className?: string }) {
  return (
    <InputGroup
      className={`${className ? className : ""} py-5 focus-within:ring-turtle-primary-border! focus-within:border-none!`}
    >
      <InputGroupAddon>
        <Search className="size-5" />
      </InputGroupAddon>
      <InputGroupInput
        placeholder="Rechercher une procedure..."
        className="turtle-radio"
      />
    </InputGroup>
  );
}
