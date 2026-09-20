import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const Card_ = ({
  title,
  description,
  id,
}: {
  title: string;
  description: string;
  id: number;
}) => {
  return (
    <Card className="p-4 trutle-card rounded-sm">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-green text-sm font-semibold text-white">
        0{id}
      </span>

      <div className="space-y-2">
        <CardTitle className="font-display text-[1.25rem] leading-tight text-brand-ink">
          {title}
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-brand-ink-muted">
          {description}
        </CardDescription>
      </div>
    </Card>
  );
};
