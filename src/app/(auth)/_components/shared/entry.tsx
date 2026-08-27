import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LucideIcon } from "lucide-react";

export function EntryZone({
  label,
  placeholder,
  icon: Icon,
  type = "text",
  icon2: Icon2,
}: {
  label: string;
  placeholder: string;
  icon: LucideIcon;
  type?: string;
  icon2?: LucideIcon;
}) {
  return (
    <Field className="gap-1.5">
      <FieldLabel
        htmlFor={label}
        className="text-base font-semibold text-foreground"
      >
        {label}
      </FieldLabel>

      <InputGroup className="h-11 rounded-lg border-border/70 bg-background transition-all focus-within:border-primary/50! focus-within:ring-4 focus-within:ring-primary/50!">
        <InputGroupAddon className="px-3 text-muted-foreground">
          <Icon className="size-5" />
        </InputGroupAddon>

        <InputGroupInput
          id={label}
          type={type}
          placeholder={placeholder}
          className="text-base focus-visible:ring-0"
        />

        {Icon2 && (
          <InputGroupAddon
            align="inline-end"
            className="cursor-pointer px-3 text-muted-foreground hover:text-foreground"
          >
            <Icon2 className="size-5" />
          </InputGroupAddon>
        )}
      </InputGroup>
    </Field>
  );
}
