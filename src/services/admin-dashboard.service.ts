import { AdminDashboardData, DashboardActivity, DashboardPeriod } from "@/app/admin/types/types";
import { prisma } from "@/lib/prisma";

/** Retourne minuit UTC pour agréger les événements sur des journées cohérentes entre serveurs. */
function utcStartOfDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

/** Décale une date d'un nombre entier de jours sans dépendre du fuseau horaire du serveur. */
function addUtcDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

/** Calcule l'évolution relative de la période sélectionnée par rapport à la période précédente. */
function calculateChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 100);
}

/** Produit les indicateurs, tendances et listes agrégées du tableau de bord sans charger de données personnelles. */
export async function getAdminDashboardData(
  period: DashboardPeriod,
  referenceDate = new Date(),
): Promise<AdminDashboardData> {
  const today = utcStartOfDay(referenceDate);
  const periodStart = addUtcDays(today, -(period - 1));
  const previousPeriodStart = addUtcDays(periodStart, -period);
  const previousPeriodEnd = periodStart;
  const currentPeriodEnd = new Date(referenceDate);

  const currentDateFilter = { gte: periodStart, lt: currentPeriodEnd };
  const previousDateFilter = {
    gte: previousPeriodStart,
    lt: previousPeriodEnd,
  };
  const successfulPurchaseFilter = {
    transactions: { some: { status: "SUCCESS" as const } },
  };

  const [
    totalUsers,
    currentUsers,
    previousUsers,
    totalFolders,
    currentFolders,
    previousFolders,
    totalPurchases,
    currentPurchases,
    previousPurchases,
    totalFraudAlerts,
    currentFraudAlerts,
    previousFraudAlerts,
    periodUsers,
    periodFolders,
    procedureGroups,
    cityGroups,
    latestFolders,
    latestFraudAlerts,
    latestPurchases,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: currentDateFilter } }),
    prisma.user.count({ where: { createdAt: previousDateFilter } }),
    prisma.folder.count(),
    prisma.folder.count({ where: { createdAt: currentDateFilter } }),
    prisma.folder.count({ where: { createdAt: previousDateFilter } }),
    prisma.documentPurchase.count({ where: successfulPurchaseFilter }),
    prisma.documentPurchase.count({
      where: {
        ...successfulPurchaseFilter,
        purchaseDate: currentDateFilter,
      },
    }),
    prisma.documentPurchase.count({
      where: {
        ...successfulPurchaseFilter,
        purchaseDate: previousDateFilter,
      },
    }),
    prisma.fraudAlert.count(),
    prisma.fraudAlert.count({ where: { publicationDate: currentDateFilter } }),
    prisma.fraudAlert.count({ where: { publicationDate: previousDateFilter } }),
    prisma.user.findMany({
      where: { createdAt: currentDateFilter },
      select: { createdAt: true },
    }),
    prisma.folder.findMany({
      where: { createdAt: currentDateFilter },
      select: { createdAt: true },
    }),
    prisma.folder.groupBy({
      by: ["procedureId"],
      where: { createdAt: currentDateFilter },
      _count: { _all: true },
      orderBy: { _count: { procedureId: "desc" } },
      take: 5,
    }),
    prisma.folder.groupBy({
      by: ["locationId"],
      where: { createdAt: currentDateFilter, locationId: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { locationId: "desc" } },
      take: 5,
    }),
    prisma.folder.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        createdAt: true,
        procedure: { select: { title: true } },
      },
    }),
    prisma.fraudAlert.findMany({
      orderBy: { publicationDate: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        publicationDate: true,
        step: { select: { title: true } },
      },
    }),
    prisma.documentPurchase.findMany({
      where: successfulPurchaseFilter,
      orderBy: { purchaseDate: "desc" },
      take: 4,
      select: {
        id: true,
        purchaseDate: true,
        document: { select: { name: true } },
      },
    }),
  ]);

  const [locations, procedures] = await Promise.all([
    prisma.location.findMany({
      where: {
        id: {
          in: cityGroups
            .map((group) => group.locationId)
            .filter((id): id is string => id !== null),
        },
      },
      select: { id: true, city: true },
    }),
    prisma.procedure.findMany({
      where: { id: { in: procedureGroups.map((group) => group.procedureId) } },
      select: { id: true, title: true },
    }),
  ]);

  const procedureNameById = new Map(
    procedures.map((procedure) => [procedure.id, procedure.title]),
  );
  const locationNameById = new Map(
    locations.map((location) => [location.id, location.city]),
  );
  const topProcedures = procedureGroups.map((group) => ({
    label: procedureNameById.get(group.procedureId) ?? "Démarche inconnue",
    count: group._count._all,
  }));
  const topCities = cityGroups.map((group) => ({
    label: group.locationId
      ? locationNameById.get(group.locationId) || "Ville non renseignée"
      : "Ville non renseignée",
    count: group._count._all,
  }));

  const usersByDay = new Map<string, number>();
  for (const user of periodUsers) {
    const dateKey = user.createdAt.toISOString().slice(0, 10);
    usersByDay.set(dateKey, (usersByDay.get(dateKey) ?? 0) + 1);
  }

  const foldersByDay = new Map<string, number>();
  for (const folder of periodFolders) {
    const dateKey = folder.createdAt.toISOString().slice(0, 10);
    foldersByDay.set(dateKey, (foldersByDay.get(dateKey) ?? 0) + 1);
  }

  const activity = Array.from({ length: period }, (_, index) => {
    const date = addUtcDays(periodStart, index);
    const dateKey = date.toISOString().slice(0, 10);
    return {
      date: dateKey,
      label: new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }).format(date),
      users: usersByDay.get(dateKey) ?? 0,
      folders: foldersByDay.get(dateKey) ?? 0,
    };
  });

  const recentActivity: DashboardActivity[] = [
    ...latestFolders.map((folder) => ({
      id: `folder-${folder.id}`,
      kind: "folder" as const,
      title: "Nouveau dossier créé",
      detail: folder.procedure.title,
      occurredAt: folder.createdAt.toISOString(),
    })),
    ...latestFraudAlerts.map((alert) => ({
      id: `fraud-${alert.id}`,
      kind: "fraud" as const,
      title: "Signalement de fraude reçu",
      detail: `${alert.title} · ${alert.step.title}`,
      occurredAt: alert.publicationDate.toISOString(),
    })),
    ...latestPurchases.map((purchase) => ({
      id: `purchase-${purchase.id}`,
      kind: "purchase" as const,
      title: "Document acheté",
      detail: purchase.document.name,
      occurredAt: purchase.purchaseDate.toISOString(),
    })),
  ]
    .sort(
      (first, second) =>
        new Date(second.occurredAt).getTime() -
        new Date(first.occurredAt).getTime(),
    )
    .slice(0, 6);

  return {
    metrics: [
      {
        key: "users",
        label: "Utilisateurs inscrits",
        value: totalUsers,
        periodChange: calculateChange(currentUsers, previousUsers),
        previousPeriodValue: previousUsers,
      },
      {
        key: "folders",
        label: "Dossiers créés",
        value: totalFolders,
        periodChange: calculateChange(currentFolders, previousFolders),
        previousPeriodValue: previousFolders,
      },
      {
        key: "purchases",
        label: "Documents achetés",
        value: totalPurchases,
        periodChange: calculateChange(currentPurchases, previousPurchases),
        previousPeriodValue: previousPurchases,
      },
      {
        key: "fraud",
        label: "Alertes de fraude",
        value: totalFraudAlerts,
        periodChange: calculateChange(currentFraudAlerts, previousFraudAlerts),
        previousPeriodValue: previousFraudAlerts,
      },
    ],
    activity,
    topProcedures,
    topCities,
    recentActivity,
  };
}
