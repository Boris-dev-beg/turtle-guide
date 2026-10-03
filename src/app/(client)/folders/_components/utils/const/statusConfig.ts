import { FolderStatus } from "@/generated/prisma/enums";

export const statusConfig: Record<
  FolderStatus,
  {
    label: string;
    className: string;
  }
> = {
  CREATED: {
    label: "Créé",
    className: "border-brand-info/20 bg-brand-info-bg text-brand-info",
  },

  PENDING: {
    label: "En cours",
    className:
      "border-brand-green/20 bg-brand-green-soft text-brand-green-dark",
  },

  ENDED: {
    label: "Terminé",
    className:
      "border-brand-green/20 bg-brand-green-soft text-brand-green-dark",
  },

  CLOSED: {
    label: "Archivé",
    className: "border-border bg-muted text-brand-ink-muted",
  },
};
