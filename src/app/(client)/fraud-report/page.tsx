import { ShieldAlert } from "lucide-react";
import FraudReportForm from "./_components/FraudReportForm";
import { useSteps } from "@/hooks/useSteps";

export default async function FraudReportPage({
  searchParams,
}: {
  searchParams: Promise<{ stepId?: string }>;
}) {
  const { stepId } = await searchParams;

  return (
    <main className="wrapper w-full py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-7 flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-sm bg-brand-danger/10 text-brand-danger">
            <ShieldAlert className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
              Signaler une fraude
            </h1>
            <p className="mt-2 text-base leading-7 text-brand-ink-muted">
              Vous avez rencontré une tentative d’arnaque liée à une démarche ?
              Décrivez-la pour aider notre équipe à informer les citoyens
              concernés.
            </p>
          </div>
        </div>
        <FrautAlert stepId={stepId} />
        <p className="mt-4 text-sm leading-6 text-brand-ink-muted">
          Ne partagez pas de mots de passe, de coordonnées bancaires ni d’autres
          données personnelles dans votre signalement.
        </p>
      </div>
    </main>
  );
}

const FrautAlert = ({ stepId }: { stepId: string | undefined }) => {
  const steps = useSteps().AllSteps || [];

  return (
    <div className="rounded-sm border border-border bg-card p-5 sm:p-8">
      {steps.length ? (
        <FraudReportForm steps={steps} initialStepId={stepId} />
      ) : (
        <p className="text-base text-brand-ink-muted">
          Aucune étape n’est disponible pour le moment.
        </p>
      )}
    </div>
  );
};
