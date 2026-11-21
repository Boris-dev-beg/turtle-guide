import type { ContentMetric } from "@/app/admin/types/types";
import { prisma } from "@/lib/prisma";

export async function getcontentData(): Promise<ContentMetric> {
  const [
    totalCategories,
    totalProceduces,
    totalProcess,
    totalDocuments,
    auditEvents,
  ] = await Promise.all([
    prisma.category.count(),
    prisma.procedure.count(),
    prisma.process.count(),
    prisma.document.count(),
    prisma.adminContentActivity.findMany({
      orderBy: { occurredAt: "desc" },
      take: 8,
      select: {
        id: true,
        action: true,
        entityType: true,
        entityName: true,
        summary: true,
        actorName: true,
        occurredAt: true,
      },
    }),
  ]);

  const RecentActivities = auditEvents;

  return {
    metrics: [
      {
        key: "folder",
        label: "Catégories",
        value: totalCategories,
        subLabel: "Regroupement thématique de procédures",
        href: "/admin/manage-content/categories",
      },
      {
        key: "list",
        label: "Procédures",
        value: totalProceduces,
        subLabel: "Questionnaires de diagnostic",
        href: "/admin/manage-content?tab=procedures",
      },
      {
        key: "news",
        label: "Démarches & étapes",
        value: totalProcess,
        subLabel: "Démarches identifiées et leurs étapes ordonnées",
        href: "/admin/manage-content?tab=processes",
      },
      {
        key: "file",
        label: "Documents",
        value: totalDocuments,
        subLabel: "Modéles d'aide et leurs fichiers PDF",
        href: "/admin/manage-content?tab=documents",
      },
    ],
    RecentActivities,
  };
}
