import {
  ArrowRight,
  Building2,
  Check,
  FileText,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { Step } from "../../types/types";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderStatus } from "@/generated/prisma/enums";

export function ProcesSteps({
  process,
  status,
  folderLocationId,
  diagnosticComplete,
  onResumeDiagnostic,
}: {
  process?: {
    id: string;
    title: string;
    description: string;
    steps: Step[];
  } | null;
  status: FolderStatus;
  folderLocationId: string | null;
  diagnosticComplete: boolean;
  onResumeDiagnostic: () => void;
}) {
  return (
    <div>
      <CardHeader className="px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="text-2xl md:text-3xl font-semibold text-brand-ink">
          Étapes de la démarche
        </CardTitle>

        <p className="mt-1 text-base leading-5 text-brand-ink-muted">
          Voici les différentes étapes à suivre pour effectuer cette démarche.
        </p>
      </CardHeader>

      <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
        {!process?.steps?.length ? (
          <DiagnosticIncomplete
            onResume={onResumeDiagnostic}
            diagnosticComplete={diagnosticComplete}
          />
        ) : (
          <div className="space-y-0">
            {process.steps.map((step, index) => {
              const isCompleted = status === "ENDED" || status === "CLOSED";
              const isLast = index === process.steps.length - 1;

              const coveringUnit = folderLocationId
                ? step.administrativeBody?.administrativeUnits.find((unit) =>
                    unit.areaServed.some(
                      (area) => area.locationId === folderLocationId,
                    ),
                  )
                : undefined;

              return (
                <div key={step.id} className="relative flex gap-4">
                  {/* Vertical ligne */}

                  {!isLast && (
                    <div className="absolute left-5 top-8 h-[calc(100%-8px)] w-px bg-border" />
                  )}

                  {/* Digit */}

                  <div
                    className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold ${
                      isCompleted
                        ? "border-primary bg-brand-green-soft text-brand-green"
                        : "border-border bg-card text-brand-ink-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="size-5" strokeWidth={3} />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Content */}

                  <div className="min-w-0 flex-1 pb-7">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-semibold text-brand-ink">
                            {step.title}
                          </h3>
                        </div>

                        <p className="mt-1 text-base leading-6 text-brand-ink-muted">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Administrative Body */}

                    {step.administrativeBody && (
                      <div className="mt-3 flex items-center gap-2 text-base text-brand-ink-muted font-medium">
                        <Building2 className="size-7 shrink-0 text-brand-green mb-auto" />
                        <span>
                          {step.administrativeBody.name}
                          {coveringUnit ? (
                            <span className="mt-1 flex flex-col items-start gap-2 text-sm font-normal sm:flex-row sm:items-center">
                              <span>
                                Unité compétente : {coveringUnit.name}
                              </span>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  coveringUnit.location.latitude != null &&
                                    coveringUnit.location.longitude != null
                                    ? `${coveringUnit.location.latitude.toString()},${coveringUnit.location.longitude.toString()}`
                                    : [
                                        coveringUnit.name,
                                        coveringUnit.location.city,
                                        coveringUnit.location.address,
                                      ]
                                        .filter(Boolean)
                                        .join(", "),
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Localiser ${coveringUnit.name} sur Google Maps`}
                                className="inline-flex min-h-12 items-center gap-2 rounded-sm border border-border bg-card px-3 font-medium text-brand-green transition-colors hover:bg-brand-green-soft"
                              >
                                <MapPin className="size-4" aria-hidden="true" />
                                Localiser
                              </a>
                            </span>
                          ) : !folderLocationId ? (
                            <span className="block text-sm font-normal">
                              L&apos;unité compétente dépend de votre ville.
                            </span>
                          ) : (
                            <span className="block text-sm font-normal">
                              Aucune unité locale n&apos;est renseignée pour
                              votre ville.
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Step's Documents */}

                    {step.documents.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-ink-muted">
                          Documents nécessaires
                        </p>

                        <div className="space-y-2">
                          {step.documents.map((document) => (
                            <div
                              key={document.id}
                              className="flex items-start gap-3 rounded-lg border border-brand-green/30 bg-brand-green-soft p-3"
                            >
                              <FileText className="mt-0.5 size-6 shrink-0 text-brand-green" />

                              <div className="min-w-0 flex-1">
                                <p className="text-base font-medium text-brand-ink">
                                  {document.name}
                                </p>

                                {document.legalWarning && (
                                  <p className="mt-1 text-sm leading-5 text-brand-ink-muted line-clamp-3">
                                    {document.legalWarning}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fraud Alets */}

                    {step.fraudAlerts.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {step.fraudAlerts.map((alert) => (
                          <div
                            key={alert.id}
                            className="flex gap-3 rounded-lg border border-brand-yellow/30 bg-brand-yellow-bg p-3"
                          >
                            <ShieldAlert className="mt-0.5 size-6 shrink-0 text-brand-yellow" />

                            <div>
                              <p className="text-base font-semibold text-brand-ink">
                                {alert.title}
                              </p>

                              <p className="mt-1 text-sm leading-5 text-brand-ink-muted">
                                {alert.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </div>
  );
}

export function DiagnosticIncomplete({
  onResume,
  diagnosticComplete,
}: {
  onResume: () => void;
  diagnosticComplete: boolean;
}) {
  return (
    <div className="mb-6 rounded-sm border border-brand-green/10 bg-brand-green-soft/20 p-5 sm:p-6">
      <div className="flex flex-col gap-5 items-center justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold text-brand-ink text-center md:text-2xl">
            {diagnosticComplete
              ? "Votre diagnostic est terminé"
              : "Votre diagnostic n'est pas terminé"}
          </h2>

          <p className="mt-1 max-w-2xl text-base leading-6 text-brand-ink-muted text-center">
            {diagnosticComplete
              ? "Vos réponses ont été enregistrées. Les étapes détaillées de cette démarche ne sont pas disponibles pour le moment."
              : "Il reste quelques questions à compléter avant de pouvoir déterminer précisément les étapes de votre démarche."}
          </p>
        </div>

        {!diagnosticComplete && (
          <button
            type="button"
            onClick={onResume}
            className="btn btn-primary rounded-sm py-3 text-base shrink-0"
          >
            Reprendre le diagnostic
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
