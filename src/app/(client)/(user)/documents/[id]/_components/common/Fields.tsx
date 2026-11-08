import { Label } from "@/components/ui/label";
import { PersonalizationFormValues } from "../../_schema/personalization.schema";
import { Input } from "@/components/ui/input";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

interface GenericInputProps<T extends FieldValues, N extends FieldPath<T>> {
  field: ControllerRenderProps<T, N>;
}

export const RenderField = <T extends FieldValues, N extends FieldPath<T>>({
  name,
  label,
  type,
  error,
  field,
}: GenericInputProps<T, N> & {
  name: keyof PersonalizationFormValues;
  label: string;
  type?: string;
  error: string | undefined;
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type ?? "text"}
        {...field}
        aria-invalid={!!error}
        placeholder={label}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{String(error)}</p>}
    </div>
  );
};
