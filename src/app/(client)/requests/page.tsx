import { Check, ListFilter, LucideIcon, Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function page() {
  return (
    <section className="flex flex-col h-full">
      <div className="wrapper h-full flex flex-col py-5 gap-5 items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-turtle-primary">
            Quelle démarche souhaitez-vous effectuer ?
          </h1>
          <p className="text-turtle-slate">
            Choississez la procédure qui correspond à votre besoin.
          </p>
          <div className="flex flex-col gap-3">
            <InputGroup className="py-5">
              <InputGroupAddon>
                <Search className="size-5" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Rechercher une procedure..."
                className="turtle-radio"
              />
            </InputGroup>

            <InputGroup className="py-5 w-fit">
              <InputGroupAddon>
                <ListFilter className="size-5" />
              </InputGroupAddon>
              <SelectDemo />
            </InputGroup>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3"></div>
      </div>
    </section>
  );
}

const Card_Request = ({}: {
  icon: LucideIcon;
  title: string;
  modules: string[];
  description: string;
}) => {
  return;
};

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
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
