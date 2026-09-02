"use client";

import { HelpBox } from "@/app/(client)/_components/cards.tsx/HelpBox";
import { InputDemo } from "@/components/shared/inputs";
import { BackToHome } from "@/components/shared/links";

import { FileText, Plus, PlusCircle } from "lucide-react";
import FolderCard from "../cards/folderCard";
import { FolderType } from "../../types/types";
// import { useFolderStore } from "@/store/folder.store";


export default function Folder({ folders }: { folders: FolderType[] }) {
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
            {folders.map((folder) => (
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
