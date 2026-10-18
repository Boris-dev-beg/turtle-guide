import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderType } from "../../types/types";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Flag,
  type LucideIcon,
  MapPin,
  X,
} from "lucide-react";
import { formatDate } from "../utils/functions/functions";

export default function FolderInfos({
  folder,
  setWantToSeeDetails,
}: {
  folder: FolderType;
  setWantToSeeDetails: (value: boolean) => void;
}) {
  return (
    <section className="flex flex-col items-center justify-center fixed inset-0 z-50 bg-black/30 backdrop-blur-sm w-full h-full">
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-border bg-card py-5 px-1 shadow-[0_8px_22px_rgba(34,32,27,0.04)] sm:p-8 lg:p-10 max-h-[96vh] overflow-y-auto w-[90vw] sm:w-150 relative">
        <span
          className="absolute top-4 right-4 cursor-pointer"
          onClick={() => setWantToSeeDetails(false)}
        >
          <X className="size-7 text-muted-foreground hover:text-foreground" />
        </span>
        <CardHeader className="px-5 pb-3 pt-5 sm:px-6 sm:pt-6 w-full">
          <CardTitle className="text-2xl sm:text-3xl text-brand-ink w-full">
            Informations sur la démarche
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 px-2 pb-5 grid-cols-2 sm:px-4 sm:pb-6">
          <InfoItem
            icon={FileText}
            label="Procédure"
            value={folder.procedure.title}
          />

          <InfoItem
            icon={Flag}
            label="Catégorie"
            value={folder.procedure.category.name}
          />

          {folder.process && (
            <InfoItem
              icon={ArrowRight}
              label="Processus"
              value={folder.process.title}
            />
          )}

          {folder.location && (
            <InfoItem
              icon={MapPin}
              label="Lieu"
              value={[folder.location.city, folder.location.address]
                .filter(Boolean)
                .join(", ")}
            />
          )}

          <InfoItem
            icon={CalendarDays}
            label="Démarré le"
            value={formatDate(folder.createdAt)}
          />

          <InfoItem
            icon={Clock3}
            label="Dernière activité"
            value={formatDate(folder.updatedAt)}
          />

          <InfoItem
            icon={FileText}
            label="Base légale"
            value={folder.procedure.legalBasis}
          />
        </CardContent>
      </div>
    </section>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 gap-1">
      <div className="flex size-12 shrink-0 items-center justify-center">
        <Icon className="size-6 text-brand-green" />
      </div>

      <div className="min-w-0 leading-4">
        <p className="text-brand-ink-muted uppercase text-xs">{label}</p>

        <p className="mt-0.5 wrap-break-word lg:text-base text-sm font-medium text-brand-ink leading-6 line-clamp-3">
          {value}
        </p>
      </div>
    </div>
  );
}
