"use client";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
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
          className="text-base! focus-visible:ring-0"
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

export function EntryOTPZone({
  label,
  Onchange,
}: {
  label: string;
  Onchange: (value: string) => void;
}) {
  return (
    <Field className="gap-1.5">
      <FieldLabel
        htmlFor={label}
        className="text-lg font-semibold text-foreground"
      >
        {label}
      </FieldLabel>

      <InputOTP
        id={label}
        maxLength={6}
        onChange={Onchange}
        pattern={REGEXP_ONLY_DIGITS}
      >
        <InputOTPGroup className="flex gap-2 w-full items-center px-4">
          <InputOTPSlot className={OTPSlotClassName} index={0} />
          <InputOTPSlot className={OTPSlotClassName} index={1} />
          <InputOTPSlot className={OTPSlotClassName} index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup className="flex gap-2 w-full items-center px-4">
          <InputOTPSlot className={OTPSlotClassName} index={3} />
          <InputOTPSlot className={OTPSlotClassName} index={4} />
          <InputOTPSlot className={OTPSlotClassName} index={5} />
        </InputOTPGroup>
      </InputOTP>
    </Field>
  );
}

const OTPSlotClassName =
  "h-11 w-full rounded-lg border! border-muted-foreground bg-background transition-all focus-within:border-primary/50! focus-within:ring-4 focus-within:ring-primary/50! focus-visible:ring-0 text-base font-semibold";
