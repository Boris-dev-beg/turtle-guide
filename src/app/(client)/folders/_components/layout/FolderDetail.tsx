"use client";
import { Back } from "@/components/shared/links";
import { FolderStatus } from "@/generated/prisma/enums";
import {
  ChevronRight,
  FileText,
  Info,
  MapPin,
  MoreVertical,
  Play,
  RefreshCcw,
} from "lucide-react";
import { FolderType } from "../../types/types";
import { useState } from "react";
import { deleteFolder } from "@/lib/folder.action";
import { useRouter } from "next/navigation";
import Link from "next/link";

const getStatusLabel = (status: FolderStatus) => {
  switch (status) {
    case "CREATED":
      return "En cours";

    case "PENDING":
      return "En attente";

    case "ENDED":
      return "Terminé";

    case "CLOSED":
      return "Archivé";
  }
};
const mockAnswers = [
  {
    id: 1,
    question: "Quelle est votre situation ?",
    answer: "Je veux déclarer une naissance",
    completed: true,
  },
  {
    id: 2,
    question: "La naissance a-t-elle eu lieu au Cameroun ?",
    answer: "Oui, au Cameroun",
    completed: true,
  },
  {
    id: 3,
    question: "Combien de temps s’est écoulé depuis la naissance ?",
    answer: "Moins de 30 jours",
    completed: true,
  },
  {
    id: 4,
    question: "Qui peut effectuer la déclaration de naissance ?",
    answer: null,
    completed: false,
  },
];
const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
export default function FolderDetail({
  folder,
  userId,
}: {
  folder: FolderType;
  userId: string;
}) {
  // ! States
  const [wantToDelete, setWantToDelete] = useState(false);
  const router = useRouter();

  // ! Functions
  const handleDelete = async () => {
    const folderDeleted = await deleteFolder(folder.id, userId);
    console.log("Folder deleted:", folderDeleted);

    router.push("/folders");
  };

  // ! Render
  return (
    <div className="w-full ">
      <Back href="/folders" />

      <div className="grid grid-cols-1 gap-2 w-full">
        <div className="flex flex-col gap-2 ">
          <section className="turtle-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative">
              <div className="absolute top-0 right-0 flex flex-col gap-2">
                <MoreVertical
                  onClick={() => setWantToDelete(!wantToDelete)}
                  className="hover:bg-secondary active:scale-95 active:shadow p-1 rounded-sm size-7 cursor-pointer"
                />
                <span
                  className={
                    wantToDelete
                      ? "absolute top-full -left-77 bg-secondary w-80 p-2 flex flex-col gap-2 rounded-sm rounded-tr-none shadow-sm"
                      : "hidden"
                  }
                >
                  <p className="text-muted-foreground font-semibold">
                    Cet Action est irreversible
                  </p>
                  <button
                    onClick={handleDelete}
                    className="btn btn-destructive "
                  >
                    Supprimer ce dossier
                  </button>
                </span>
              </div>

              <div className="flex items-start gap-4 ">
                <span className="hidden md:flex items-center justify-center size-15 rounded-xl bg-accent text-primary">
                  <FileText className="size-8 md:size-10" />
                </span>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 rounded-md bg-accent text-brand-green-text text-xs md:text-sm font-semibold">
                      {getStatusLabel(folder.status)}
                    </span>
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">
                    {folder.name}
                  </h1>

                  <p className="text-muted-foreground mt-1">
                    {folder.procedure.title}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    {folder?.location?.city && (
                      <>
                        <MapPin className="size-4" />
                        {folder.location.city}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 text-base shrink-0">
                <div>
                  <p className="text-muted-foreground">Dossier créé le</p>

                  <p className="font-medium">
                    {formatDateTime(folder.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Dernière mise à jour</p>

                  <p className="font-medium">
                    {formatDateTime(folder.updatedAt)}
                  </p>
                </div>

                <Link href="/diagnostic" className="btn btn-primary w-fit">
                  <Play className="size-4" />
                  Reprendre le diagnostic
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-5 p-3 rounded-lg bg-brand-blue-bg border border-brand-blue-border text-brand-blue">
              <Info className="size-5 shrink-0" />

              <p className="text-sm sm:text-base">
                Votre diagnostic est en cours. Répondez aux questions pour
                identifier la démarche adaptée à votre situation.
              </p>
            </div>
          </section>

          <section className="turtle-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Résumé de vos réponses</h2>

              <button className="text-sm text-brand-green-text font-semibold hover:underline">
                Voir toutes les réponses
              </button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              {mockAnswers.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors"
                >
                  {/* Step */}
                  <span
                    className={`turtle-step ${
                      item.completed
                        ? "turtle-step-active"
                        : "turtle-step-inactive"
                    }`}
                  ></span>

                  <div className="flex-1 ">
                    <p className="font-semibold text-sm">{item.question}</p>

                    <p
                      className={`text-sm ${
                        item.completed
                          ? "text-muted-foreground"
                          : "text-brand-green-text font-medium"
                      }`}
                    >
                      {item.answer ?? "Question en cours"}
                    </p>
                  </div>

                  <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>

            <button className="btn btn-outline mt-4">
              <RefreshCcw className="size-4" />
              Recommencer le diagnostic
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
