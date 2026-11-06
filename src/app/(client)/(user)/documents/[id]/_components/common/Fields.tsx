import { Label } from "@/components/ui/label";
import { PersonalizationFormValues } from "../../_schema/personalization.schema";
import { Input } from "@/components/ui/input";
import { ChangeHandler, RefCallBack } from "react-hook-form";

export const RenderField = ({
  name,
  label,
  type,
  error,
  register,
}: {
  name: keyof PersonalizationFormValues;
  label: string;
  type?: string;
  error: string | undefined;
  register: {
    onChange: ChangeHandler;
    onBlur: ChangeHandler;
    ref: RefCallBack;
    name:
      | "firstName"
      | "lastName"
      | "birthDate"
      | "age"
      | "phone"
      | "email"
      | "city"
      | "address"
      | "purpose"
      | "notes";
    min?: string | number;
    max?: string | number;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    required?: boolean;
    disabled?: boolean;
  };
}) => {
  return (
    <div key={name} className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type ?? "text"}
        {...register}
        aria-invalid={!!error}
        placeholder={label}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{String(error)}</p>}
    </div>
  );
};
