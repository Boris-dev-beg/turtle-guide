"use client";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { EmptyFolders, FolderCard } from "../cards/folderCard";
import { useFolder } from "@/hooks/useFolder";
import { FoldersLoading } from "../cards/FoldersLoading";
import { FoldersError } from "../cards/FoldersError";

export default function Folders({ userId }: { userId: string }) {
  // ! States
  const { folders, isLoading, isError, refetch } = useFolder(userId);

  // ! Functions

  // ! Render
  return (
    <main className="wrapper w-full py-8 lg:py-10">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
          Mes dossiers
        </h1>

        <p className="mt-2 max-w-2xl leading-6 text-brand-ink-muted sm:text-lg">
          Suivez l&apos;état de vos démarches et accédez à tous vos dossiers en
          un seul endroit.
        </p>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs defaultValue="all">
          <TabsList className="h-10! rounded-sm border border-border bg-card p-2">
            <TabsTrigger value="all" className="rounded-sm px-4 text-base h-8">
              Tous ({folders ? folders.length : 0})
            </TabsTrigger>

            <TabsTrigger
              value="active"
              className="rounded-sm px-4 text-base h-8"
            >
              En cours (
              {folders
                ? folders.filter(
                    (folder) =>
                      folder.status === "CREATED" ||
                      folder.status === "PENDING",
                  ).length
                : 0}
              )
            </TabsTrigger>

            <TabsTrigger
              value="finished"
              className="rounded-sm px-4 text-base h-8"
            >
              Terminés (
              {folders
                ? folders.filter(
                    (folder) =>
                      folder.status === "ENDED" || folder.status === "CLOSED",
                  ).length
                : 0}
              )
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-brand-ink-muted" />

          <Input
            placeholder="Rechercher un dossier..."
            className="h-10 bg-card pl-9 text-base! rounded-sm"
          />
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {isLoading ? (
          <FoldersLoading />
        ) : isError || !folders ? (
          <FoldersError onRetry={refetch} />
        ) : folders.length > 0 ? (
          folders.map((folder) => (
            <FolderCard key={folder.id} folder={folder} />
          ))
        ) : (
          <EmptyFolders />
        )}
      </div>

      {/* Footer de liste */}
      <p className="mt-5 text-base text-brand-ink-muted">
        {folders ? folders.length : 0} dossiers au total
      </p>
    </main>
  );
}
