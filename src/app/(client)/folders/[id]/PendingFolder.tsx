import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  MapPin,
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Diagnostic",
    description: "Vous avez terminé cette étape.",
    status: "completed",
  },
  {
    id: 2,
    title: "Préparer les documents",
    description: "Réunissez les documents nécessaires à votre démarche.",
    status: "completed",
  },
  {
    id: 3,
    title: "Déposer la demande",
    description:
      "Rendez-vous auprès de l'administration compétente pour déposer votre dossier.",
    status: "current",
    location: "Mairie de Bafoussam",
  },
  {
    id: 4,
    title: "Suivre le traitement",
    description: "Votre demande sera traitée par l'administration.",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Récupérer le document",
    description:
      "Récupérez votre document une fois que celui-ci sera disponible.",
    status: "upcoming",
  },
];

export default function PendingFolder() {
  const completedSteps = steps.filter(
    (step) => step.status === "completed",
  ).length;

  const progress = Math.round((completedSteps / steps.length) * 100);

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Retour */}
      <Link
        href="/dossiers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="size-4" />
        Retour à la liste
      </Link>

      {/* Titre */}
      <div className="mb-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">
            Acte de naissance
          </span>

          <h1 className="text-3xl font-bold tracking-tight">
            Étapes de votre dossier
          </h1>

          <p className="text-muted-foreground leading-6">
            Suivez les différentes étapes de votre démarche administrative.
          </p>
        </div>
      </div>

      {/* Progression */}
      <section className="turtle-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold">Progression</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {completedSteps} étape{completedSteps > 1 ? "s" : ""} sur{" "}
              {steps.length} terminée{completedSteps > 1 ? "s" : ""}
            </p>
          </div>

          <span className="text-2xl font-bold text-primary">
            {progress}%
          </span>
        </div>

        <div className="turtle-progress-track">
          <div
            className="turtle-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Étapes */}
      <section className="turtle-card">
        <div className="mb-6">
          <h2 className="text-lg font-bold">Votre parcours</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Retrouvez les étapes de votre démarche et leur état d&apos;avancement.
          </p>
        </div>

        <div className="flex flex-col">
          {steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="flex gap-4">
                {/* Indicateur + ligne */}
                <div className="flex flex-col items-center">
                  <span
                    className={`flex items-center justify-center size-9 shrink-0 rounded-full ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-primary/10 text-primary ring-2 ring-primary"
                          : "bg-muted text-muted-foreground border-2 border-border"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="size-4" />
                    ) : (
                      <span className="text-sm font-bold">{step.id}</span>
                    )}
                  </span>

                  {!isLast && (
                    <span
                      className={`w-px flex-1 min-h-12 ${
                        isCompleted ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>

                {/* Contenu */}
                <div
                  className={`flex-1 pb-6 ${
                    isLast ? "pb-0" : ""
                  }`}
                >
                  <div
                    className={`rounded-xl border p-4 ${
                      isCurrent
                        ? "border-primary bg-accent/40 ring-1 ring-primary"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base">
                            {step.title}
                          </h3>

                          {isCompleted && (
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                              ✓ Terminé
                            </span>
                          )}

                          {isCurrent && (
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                              En cours
                            </span>
                          )}

                          {!isCompleted && !isCurrent && (
                            <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                              À venir
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground leading-5 mt-1">
                          {step.description}
                        </p>

                        {step.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                            <MapPin className="size-4 text-primary" />
                            {step.location}
                          </div>
                        )}
                      </div>

                      {isCurrent && (
                        <Link
                          href="/dossiers/1/steps/3"
                          className="btn btn-primary shrink-0"
                        >
                          Continuer
                          <ArrowRight className="size-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bon à savoir */}
      <div className="turtle-alert-info mt-6 flex-col items-start sm:flex-row sm:items-center">
        <span className="flex gap-3 items-start">
          <Lightbulb className="size-7 shrink-0 p-1.5 rounded-full bg-primary/10 text-primary" />

          <span>
            <h2 className="font-bold">Bon à savoir</h2>

            <p className="text-muted-foreground text-sm leading-5 mt-1">
              Vous pouvez revenir à tout moment à votre dossier pour
              consulter vos documents et suivre son avancement.
            </p>
          </span>
        </span>

        <Link
          href="/a-propos"
          className="text-primary hover:underline font-semibold text-sm whitespace-nowrap"
        >
          En savoir plus
        </Link>
      </div>
    </main>
  );
}