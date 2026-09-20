import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export const Card_ = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => {
  return (
    <Card className="p-4 turtle-card rounded-sm">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-green-soft text-brand-green">
        <Icon className="size-5" />
      </span>

      <div className="space-y-2">
        <CardTitle className="font-display text-[1.15rem] leading-tight text-brand-ink">
          {title}
        </CardTitle>

        <CardDescription className="line-clamp-3 text-sm leading-6 text-brand-ink-muted">
          {description}
        </CardDescription>
      </div>
    </Card>
  );
};
