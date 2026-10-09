import { Button } from "@/components/ui/button";
import { FolderStatus } from "@/generated/prisma/enums";

export default function ProgressSummary({
  answerCount,
  currentQuestion,
  status,
  diagnosticComplete,
  setShowAnswers,
  showAnswers,
}: {
  answerCount: number;
  currentQuestion?: {
    title: string;
    description: string | null;
  };
  status: FolderStatus;
  diagnosticComplete: boolean;
  setShowAnswers: (val: boolean) => void;
  showAnswers: boolean;
}) {
  const isFinished = status === "ENDED" || status === "CLOSED";

  return (
    <section className="border-y border-border px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="font-display text-2xl text-brand-ink">
          Votre progression
        </h2>
        <p className="text-base text-brand-ink-muted">
          {isFinished
            ? "Démarche terminée"
            : `${answerCount} réponse${answerCount > 1 ? "s" : ""} enregistrée${answerCount > 1 ? "s" : ""}`}
        </p>
      </div>

      {currentQuestion && !isFinished && !diagnosticComplete ? (
        <div className="mt-4 rounded-sm border border-brand-green/20 bg-brand-green-soft/30 p-4">
          <p className="text-sm font-semibold text-brand-green-dark">
            Question en cours
          </p>
          <p className="mt-1 text-lg font-semibold text-brand-ink">
            {currentQuestion.title}
          </p>
          {currentQuestion.description && (
            <p className="mt-1 leading-6 text-brand-ink-muted">
              {currentQuestion.description}
            </p>
          )}
        </div>
      ) : (
        <>
          <p className="mt-3 leading-6 text-brand-ink-muted">
            {diagnosticComplete
              ? "Diagnostic terminé. Votre dossier est prêt pour la suite de la démarche."
              : isFinished
                ? "Toutes les informations disponibles pour cette démarche sont présentées ci-dessous."
                : "Votre prochaine question apparaîtra ici lorsque le diagnostic sera commencé."}
          </p>
          {!isFinished && !diagnosticComplete && (
            <Button
              onClick={setShowAnswers.bind(null, !showAnswers)}
              className="mt-4 btn-primary btn w-full justify-between text-base rounded-sm p-5 sm:w-auto"
            >
              {showAnswers ? "Masquer les réponses" : "Voir les réponses"}
            </Button>
          )}
        </>
      )}
    </section>
  );
}
