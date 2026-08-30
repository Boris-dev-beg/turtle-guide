"use client";

import { HelpBox } from "@/app/(client)/_components/cards.tsx/HelpBox";
import { InputDemo } from "@/components/shared/inputs";
import { BackToHome } from "@/components/shared/links";
import type { FolderStatus } from "@/generated/prisma/client";
import { ChevronRight, FileText, MapPin, Plus, PlusCircle } from "lucide-react";
// import { useFolderStore } from "@/store/folder.store";

export type Folder = {
  id: string;
  name: string;

  status: FolderStatus;

  createdAt: Date;
  updatedAt: Date;

  procedure: {
    id: string;
    name: string;
  };

  location: {
    id: string;
    name: string;
  };
};

export const mockFolders: Folder[] = [
  {
    id: "folder_001",
    name: "Acte de naissance",
    status: "CREATED",
    createdAt: new Date("2025-05-01"),
    updatedAt: new Date("2025-05-12"),

    procedure: {
      id: "procedure_001",
      name: "Déclaration de naissance",
    },

    location: {
      id: "location_001",
      name: "Mairie de Bafoussam",
    },
  },

  {
    id: "folder_002",
    name: "Demande de CNI",
    status: "PENDING",
    createdAt: new Date("2025-05-03"),
    updatedAt: new Date("2025-05-08"),

    procedure: {
      id: "procedure_002",
      name: "Première demande",
    },

    location: {
      id: "location_002",
      name: "Préfecture de Bafoussam",
    },
  },

  {
    id: "folder_003",
    name: "Attestation de résidence",
    status: "ENDED",
    createdAt: new Date("2025-04-20"),
    updatedAt: new Date("2025-05-02"),

    procedure: {
      id: "procedure_003",
      name: "Demande d'attestation",
    },

    location: {
      id: "location_001",
      name: "Mairie de Bafoussam",
    },
  },

  {
    id: "folder_004",
    name: "Acte de mariage",
    status: "CLOSED",
    createdAt: new Date("2025-04-10"),
    updatedAt: new Date("2025-04-18"),

    procedure: {
      id: "procedure_004",
      name: "Transcription d'acte de mariage",
    },

    location: {
      id: "location_003",
      name: "Mairie de Douala",
    },
  },

  {
    id: "folder_005",
    name: "Extrait d'acte de naissance",
    status: "CREATED",
    createdAt: new Date("2025-05-05"),
    updatedAt: new Date("2025-05-15"),

    procedure: {
      id: "procedure_005",
      name: "Demande de copie intégrale",
    },

    location: {
      id: "location_001",
      name: "Mairie de Bafoussam",
    },
  },

  {
    id: "folder_006",
    name: "Passeport",
    status: "PENDING",
    createdAt: new Date("2025-05-06"),
    updatedAt: new Date("2025-05-10"),

    procedure: {
      id: "procedure_006",
      name: "Première demande",
    },

    location: {
      id: "location_004",
      name: "Gouvernorat de l'Ouest",
    },
  },
];
export default function Folder({
  folders,
}: {
  folders: {
    id: string;
    name: string;
    status: FolderStatus;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    procedureId: string;
    processId: string | null;
    locationId: string;
  }[];
}) {
  // const { procedure, category } = useFolderStore();
  console.log(folders);
  return (
    <div className="flex flex-col md:flex-row gap-4 py-2 w-full">
      {/* First Side */}
      <div className="h-fit lg:h-full min-w-70 w-full md:w-90 flex flex-col gap-4 py-4 px-2 border-x border-border bg-secondary/20 rounded-xl">
        <BackToHome />
        {/* Quick actions */}
        <div className="hidden md:flex flex-col gap-2 my-5">
          <h1 className="font-bold text-lg">Actions rapides</h1>
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1">
              <PlusCircle className="p-1 size-7 bg-primary/10 rounded-full text-primary" />
              Commencer une démarche
            </span>
            <span className="flex items-center gap-1">
              <FileText className="p-1 size-7 bg-muted rounded-full text-muted-foreground" />
              Voir les documens achetés
            </span>
          </div>
        </div>

        {/* Help Box */}
        <HelpBox />
      </div>
      {/* Second Side */}
      <div className="flex border-border md:p-2 flex-col gap-2 h-full w-full">
        {/* Header */}
        <div className="flex items-center w-full justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold">Mes dossiers</h1>
            <p className="text-muted-foreground">Retrouvez tous vos dossiers</p>
          </div>
          <button className="btn btn-primary py-2 text-base">
            <Plus className="size-6" />
            Nouveau dossier
          </button>
        </div>
        {/* Folder Zone */}
        <div className="flex flex-col gap-2">
          {/* Search Zone */}
          <div className="flex flex-col gap-4 border-b border-border">
            <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-100 lg:flex-row lg:items-center">
              <InputDemo
                filter={(str) => console.log(str)}
                className="w-full lg:w-100 text-base!"
              />
            </div>
            <div className="w-full flex gap-2">
              <StatusFilter status="Tous" number={12} />
              <StatusFilter status="En cours" number={5} />
              <StatusFilter status="En attente" number={3} />
              <StatusFilter status="Terminés" number={3} />
              <StatusFilter status="Archivés" number={1} />
            </div>
          </div>
          {/* Folders Zone */}
          <div className="grid gap-2 w-full py-2 md:px-4">
            {mockFolders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatusFilter = ({
  status,
  number,
}: {
  status: string;
  number: number;
}) => {
  return (
    <span
      className={`flex gap-1 items-center h-full hover:text-primary text-muted-foreground font-semibold px-2 cursor-pointer py-2 ${status == "Tous" ? "border-b-2 border-primary" : ""} text-sm sm:text-base`}
    >
      <p>{status}</p>
      <p className="rounded-full w-6 sm:w-8 text-xs sm:text-sm p-1 bg-primary/10 text-brand-green-text text-center">
        {number}
      </p>
    </span>
  );
};
const FolderCard = ({ folder }: { folder: Folder }) => {
  const status = folder.status;
  const { label, dateLabel } = getFolderStatus(folder);
  return (
    <div className="group flex gap-4 p-2 items-center turtle-radio">
      <span className="p-2 bg-primary/10 rounded-sm text-primary">
        <FileText className="size-7" />
      </span>
      <span className="w-full">
        <h1 className="text-lg font-bold">{folder.name}</h1>
        <p className="text-muted-foreground">{folder.procedure.name}</p>
        <p className="text-muted-foreground flex gap-1 items-center text-sm">
          <MapPin className="size-4" />
          {folder.location.name}
        </p>
      </span>
      <span className="w-fit flex flex-col text-nowrap md:mr-4">
        <p
          className={`px-2.5 py-1.5 text-sm rounded-full w-fit ${status === "CREATED" ? "bg-orange-500/10 text-orange-400" : status === "PENDING" ? "bg-brand-blue-bg text-brand-blue" : status === "ENDED" ? "bg-primary/10 text-primary" : "text-gray-500 bg-gray-100"}`}
        >
          {label}
        </p>
        <p className="text-sm text-muted-foreground">
          {dateLabel} {" "}
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
    </div>
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
