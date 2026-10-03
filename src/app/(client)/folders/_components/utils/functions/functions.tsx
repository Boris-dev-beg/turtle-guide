import { Badge } from "@/components/ui/badge";
import { statusConfig } from "../const/statusConfig";
import { FolderStatus } from "@/generated/prisma/enums";

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function FolderStatusBadge({ status }: { status: FolderStatus }) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={`rounded-sm px-3 py-1.5 font-medium text-sm ${config.className}`}
    >
      <span className="size-2 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}
