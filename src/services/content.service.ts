import { ContentMetric } from "@/app/admin/types/types";
import { prisma } from "@/lib/prisma";

export async function getcontentData(): Promise<ContentMetric[]> {
  const [totalCategories, totalProceduces, totalProcess, totalDocuments] =
    await Promise.all([
      prisma.category.count(),
      prisma.procedure.count(),
      prisma.process.count(),
      prisma.document.count(),
    ]);

  return [
    {
      key: "folder",
      label: "Catégories",
      value: totalCategories,
      subLabel: "Regroupement thématique de procédures",
      href: "",
    },
    {
      key: "list",
      label: "Procédures",
      value: totalProceduces,
      subLabel: "Questionnaires de diagnostic",
      href: "",
    },
    {
      key: "news",
      label: "Démarches & étapes",
      value: totalProcess,
      subLabel: "Démarches identifiées et leurs étapes ordonnées",
      href: "",
    },
    {
      key: "file",
      label: "Documents",
      value: totalDocuments,
      subLabel: "Modéles d'aide et leurs fichiers PDF",
      href: "",
    },
  ];
}
