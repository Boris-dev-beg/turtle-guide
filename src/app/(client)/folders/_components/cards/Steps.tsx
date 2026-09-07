import {
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { Step } from "../../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ProcesSteps({
  process,
  currentStep,
}: {
  process?: {
    id: string;
    title: string;
    description: string;
    steps: Step[];
  } | null;
  currentStep: Step | undefined;
}) {
    console.log("Steps:", process?.steps)
  return (
    <Card className="turtle-card">
      <CardHeader className="px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="text-2xl md:text-3xl font-semibold text-brand-ink">
          Étapes de la démarche
        </CardTitle>

        <p className="mt-1 text-base leading-5 text-brand-ink-muted">
          Voici les différentes étapes à suivre pour effectuer cette démarche.
        </p>
      </CardHeader>

      <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
        {!process?.steps ? (
          <DiagnosticIncomplete />
        ) : (
          <div className="space-y-0">
            {process?.steps.map((step, index) => {
              const isCurrent = step.id === currentStep?.id;
              const isLast = index === (process?.steps.length ?? 0) - 1;

              return (
                <div key={step.id} className="relative flex gap-4">
                  {/* Vertical ligne */}

                  {!isLast && (
                    <div className="absolute left-5 top-8 h-[calc(100%-8px)] w-px bg-border" />
                  )}

                  {/* Digit */}

                  <div
                    className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-base font-bold ${
                      isCurrent
                        ? "border-primary bg-primary text-primary-foreground"
                        : index < 1
                          ? "border-primary bg-brand-green-soft text-brand-green"
                          : "border-border bg-card text-brand-ink-muted"
                    }`}
                  >
                    {index < 1 ? (
                      <Check className="size-5" strokeWidth={3} />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Content */}

                  <div
                    className={`min-w-0 flex-1 pb-7 ${
                      isCurrent
                        ? "rounded-lg border border-brand-green/20 bg-brand-green-soft/30 p-4"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-semibold text-brand-ink">
                            {step.title}
                          </h3>

                          {isCurrent && (
                            <Badge className="rounded-full py-3 bg-primary text-primary-foreground hover:bg-primary text-sm">
                              Étape actuelle
                            </Badge>
                          )}
                        </div>

                        <p className="mt-1 text-base leading-6 text-brand-ink-muted">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Administrative Body */}

                    {step.administrativeBody && (
                      <div className="mt-3 flex items-center gap-2 text-base text-brand-ink-muted font-medium">
                        <Building2 className="size-6 shrink-0 text-brand-green" />
                        <span>{step.administrativeBody.name}</span>
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
                              className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
                            >
                              <FileText className="mt-0.5 size-6 shrink-0 text-brand-green" />

                              <div className="min-w-0 flex-1">
                                <p className="text-base font-medium text-brand-ink">
                                  {document.name}
                                </p>

                                {document.legalWarning && (
                                  <p className="mt-1 text-sm leading-5 text-brand-ink-muted">
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
    </Card>
  );
}

export function DiagnosticIncomplete() {
  return (
    <div className="mb-6 rounded-xl border border-brand-green/20 bg-brand-green-soft/30 p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-green-soft">
            <ClipboardCheck className="size-9 text-brand-green" />
          </div>

          <div className="min-w-0">
            <h2 className="font-heading text-lg md:text-xl font-semibold text-brand-ink">
              Votre diagnostic n&apos;est pas terminé
            </h2>

            <p className="mt-1 max-w-2xl text-base leading-6 text-brand-ink-muted">
              Il reste quelques questions à compléter avant de pouvoir
              déterminer précisément les étapes de votre démarche.
            </p>
          </div>
        </div>

        <button type="button" className="btn btn-primary rounded-sm py-3 text-base shrink-0">
          Reprendre le diagnostic
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
