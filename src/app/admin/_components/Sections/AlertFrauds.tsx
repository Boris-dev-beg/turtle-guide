"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function AlertFrauds({
  alerts,
}: {
  alerts: ({
    step: {
      title: string;
      process: {
        title: string;
      };
    };
  } & {
    id: string;
    title: string;
    description: string;
    publicationDate: Date;
  })[];
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  return (
    <>
      {/* Filtres */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="h-15! gap-3 rounded-sm border border-border bg-card p-3">
              <TabsTrigger
                value="all"
                className={`p-2 text-base ${statusFilter == "all" ? "turtle-radio-active font-semibold " : "turtle-radio"}`}
              >
                Tous ({alerts ? alerts.length : 0})
              </TabsTrigger>

              <TabsTrigger
                value="pending"
                className={`p-2 text-base ${statusFilter == "pending" ? "turtle-radio-active font-semibold " : "turtle-radio"}`}
              >
                En attente (0)
              </TabsTrigger>

              <TabsTrigger
                value="approved"
                className={`p-2 text-base ${statusFilter == "approved" ? "turtle-radio-active font-semibold " : "turtle-radio"}`}
              >
                Approuvées (0)
              </TabsTrigger>

              <TabsTrigger
                value="rejected"
                className={`p-2 text-base ${statusFilter == "rejected" ? "turtle-radio-active font-semibold " : "turtle-radio"}`}
              >
                Rejetées (0)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <table className="w-full m-2 p-4 border-2 border-border">
        <thead className="*:h-15 *:border-b-2 *:border-border font-black text-lg">
          <tr>
            <th>Titre & Description</th>
            <th>Contexte</th>
            <th>Date de signalement</th>
          </tr>
        </thead>
        {alerts.length === 0 ? (
          <p className="rounded-sm border border-border bg-card p-6 text-base text-brand-ink-muted">
            Aucun signalement pour le moment.
          </p>
        ) : (
          <tbody>
            <>
              {alerts.map((alert) => (
                <tr key={alert.id} className="border-b border-border">
                  <td>
                    <span className="bg-card p-2 sm:p-4 max-w-md flex flex-col">
                      <h2 className="mt-2 font-display text-2xl font-semibold text-brand-ink">
                        {alert.title}
                      </h2>
                      <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-brand-ink-muted">
                        {alert.description}
                      </p>
                    </span>
                  </td>
                  <td>
                    <span className="border-l-2 border-border max-w-md flex flex-col p-2 gap-2">
                      <p>{alert.step.process.title}</p>
                      <p>Etape: {alert.step.title}</p>
                    </span>
                  </td>
                  <td>
                    {new Intl.DateTimeFormat("fr-FR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(alert.publicationDate)}
                  </td>
                </tr>
              ))}
            </>
          </tbody>
        )}
      </table>
    </>
  );
}
