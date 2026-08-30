import { FolderStatus } from '@/generated/prisma/enums';
import { ChevronRight, FileText, MapPin } from 'lucide-react';
import Link from 'next/link';

type Folder = {
  id: string;
  name: string;

  status: FolderStatus;

  createdAt: Date;
  updatedAt: Date;

  procedure: {
    id: string;
    title: string;
  };

  location: {
    id: string;
    city: string | null;
  };
};

export default function FolderCard ({ folder }: { folder: Folder }) {
  const status = folder.status;
  const { label, dateLabel } = getFolderStatus(folder);
  return (
    <Link
      href={`/folders/${folder.id}`}
      className="group flex gap-4 p-2 items-center turtle-radio active:scale-95"
    >
      <span className="p-2 bg-primary/10 rounded-sm text-primary">
        <FileText className="size-7" />
      </span>
      <span className="w-full">
        <h1 className="text-lg font-bold">{folder.name}</h1>
        <p className="text-muted-foreground">{folder.procedure.title}</p>
        <p className="text-muted-foreground flex gap-1 items-center text-sm">
          <MapPin className="size-4" />
          {folder.location.city}
        </p>
      </span>
      <span className="w-fit flex flex-col text-nowrap md:mr-4">
        <p
          className={`px-2.5 py-1.5 text-sm rounded-full w-fit ${status === "CREATED" ? "bg-orange-500/10 text-orange-400" : status === "PENDING" ? "bg-brand-blue-bg text-brand-blue" : status === "ENDED" ? "bg-primary/10 text-primary" : "text-gray-500 bg-gray-100"}`}
        >
          {label}
        </p>
        <p className="text-sm text-muted-foreground">
          {dateLabel}{" "}
          {folder.updatedAt.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </span>
      <span className="group-hover:bg-muted-foreground/10 text-muted-foreground p-1 rounded-full">
        <ChevronRight className="sieze-5" />
      </span>
    </Link>
  );
};


const getFolderStatus = (folder: Folder) => {
  switch (folder.status) {
    case "CREATED":
      return {
        label: "En cours",
        dateLabel: "Mis à jour le",
      };

    case "PENDING":
      return {
        label: "En attente",
        dateLabel: "Mis à jour le",
      };

    case "ENDED":
      return {
        label: "Terminé",
        dateLabel: "Terminé le",
      };

    case "CLOSED":
      return {
        label: "Archivé",
        dateLabel: "Archivé le",
      };

    default:
      return {
        label: folder.status,
        dateLabel: "Mis à jour le",
      };
  }
};
