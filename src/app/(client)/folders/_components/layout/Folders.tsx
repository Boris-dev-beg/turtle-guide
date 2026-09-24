"use client";
import { Plus, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { EmptyFolders, FolderCard } from "../cards/folderCard";
import { useFolder } from "@/hooks/useFolder";
import { FoldersLoading } from "../cards/FoldersLoading";
import { FoldersError } from "../cards/FoldersError";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function Folders({ userId }: { userId: string }) {
  // ! States
  const { folders, isLoading, isError, refetch } = useFolder(userId);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const visibleFolders = useMemo(() => {
    if (!folders) return [];

    const normalizedSearch = search.trim().toLocaleLowerCase();

    return folders.filter((folder) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          (folder.status === "CREATED" || folder.status === "PENDING")) ||
        (statusFilter === "finished" &&
          (folder.status === "ENDED" || folder.status === "CLOSED"));

      const searchableText = [
        folder.name,
        folder.procedure.title,
        folder.procedure.category.name,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return matchesStatus && searchableText.includes(normalizedSearch);
    });
  }, [folders, search, statusFilter]);

  // ! Functions

  // ! Render
  return (
    <main className="wrapper w-full py-8 lg:py-10">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-brand-ink sm:text-5xl">
          Mes dossiers
        </h1>

        <p className="mt-2 max-w-2xl leading-6 text-brand-ink-muted sm:text-lg">
          Suivez l&apos;état de vos démarches et accédez à tous vos dossiers en
          un seul endroit.
        </p>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList className="h-12! rounded-sm border border-border bg-card p-2">
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
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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
        ) : folders.length === 0 ? (
          <EmptyFolders />
        ) : visibleFolders.length > 0 ? (
          visibleFolders.map((folder) => (
            <FolderCard key={folder.id} folder={folder} />
          ))
        ) : (
          <EmptyFilteredFolders />
        )}
      </div>

      {/* Footer de liste */}
      <div className="flex w-full justify-between mt-6 items-center">
        <p className="text-base text-brand-ink-muted">
          {visibleFolders.length} dossier{visibleFolders.length > 1 ? "s" : ""}{" "}
          affiché{visibleFolders.length > 1 ? "s" : ""}
        </p>

        {/* CTA */}
        <Link
          href="/categories"
          className="rounded-sm gap-2 bg-card text-sm md:text-base btn btn-outline py-3 px-5 cursor-pointer"
        >
          Nouveau dossier
          <Plus className="size-5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </main>
  );
}

function EmptyFilteredFolders() {
  return (
    <div className="rounded-sm border border-border bg-card px-6 py-12 text-center">
      <h2 className="font-display text-2xl text-brand-ink">
        Aucun dossier ne correspond à votre recherche
      </h2>
      <p className="mx-auto mt-2 max-w-md leading-6 text-brand-ink-muted">
        Modifiez le terme recherché ou choisissez un autre statut.
      </p>
    </div>
  );
}
