"use client";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

interface GenericInputProps<T extends FieldValues, N extends FieldPath<T>> {
  field: ControllerRenderProps<T, N>;
}

export function EntryZone<T extends FieldValues, N extends FieldPath<T>>({
  label,
  placeholder,
  icon: Icon,
  type = "text",
  icon2,
  fieldState,
  field,
}: GenericInputProps<T, N> & {
  label: string;
  placeholder: string;
  icon: LucideIcon;
  type?: string;
  icon2?: React.ReactNode;
  fieldState: ControllerFieldState;
}) {
  return (
    <Field data-invalid={fieldState.invalid} className="gap-1.5">
      <FieldLabel
        htmlFor={field.name}
        className="text-base font-semibold text-foreground"
      >
        {label}
      </FieldLabel>

      <InputGroup
        {...field}
        aria-invalid={fieldState.invalid}
        className={`${fieldState.invalid ? "border-destructive focus-within:border-destructive focus-within:ring-destructive/20" : "border-border/70 focus-within:border-primary/50 focus-within:ring-primary/50 focus-within:ring-4"} h-11 rounded-lg  bg-background transition-all`}
      >
        <InputGroupAddon
          className={`${fieldState.invalid ? "text-destructive" : " text-muted-foreground"} px-3`}
        >
          <Icon className="size-5" />
        </InputGroupAddon>

        <InputGroupInput
          id={label}
          type={type}
          placeholder={placeholder}
          className="text-base! focus-visible:ring-0"
        />

        {icon2 && (
          <InputGroupAddon
            align="inline-end"
            className={`${fieldState.invalid ? "text-destructive" : " text-muted-foreground hover:text-foreground"} cursor-pointer px-3`}
          >
            {icon2}
          </InputGroupAddon>
        )}
      </InputGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

export function EntryOTPZone<T extends FieldValues, N extends FieldPath<T>>({
  label,
  field,
  onComplete,
}: GenericInputProps<T, N> & {
  label: string;
  fieldState: ControllerFieldState;

  onComplete: () => void;
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
        {...field}
        onComplete={onComplete}
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
