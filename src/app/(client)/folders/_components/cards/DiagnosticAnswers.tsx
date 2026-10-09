import { CheckCircle2, Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "../utils/functions/functions";

export type DiagnosticAnswer = {
  id: string;
  answeredAt: Date;
  option: {
    label: string;
    question: {
      title: string;
    };
  };
};

export function DiagnosticAnswers({
  answers,
}: {
  answers: DiagnosticAnswer[];
}) {
  return (
    <Card className="relative overflow-hidden rounded-lg border border-border border-l-4 border-l-brand-yellow bg-card shadow-sm">
      <CardHeader className="gap-2 px-5 pb-5 pt-6 sm:px-7">
        <CardTitle className="font-display text-xl font-semibold tracking-tight text-brand-ink sm:text-2xl">
          Réponses à votre diagnostic
        </CardTitle>
        <p className="max-w-2xl text-sm leading-6 text-brand-ink-muted sm:text-base">
          Voici les réponses que vous avez fournies lors de votre diagnostic.
        </p>
      </CardHeader>

      <CardContent className="px-5 pb-6 sm:px-7 sm:pb-7">
        {answers.length === 0 ? (
          <p className="border-t border-border pt-5 text-sm leading-6 text-brand-ink-muted sm:text-base">
            Aucune réponse n&apos;a encore été enregistrée.
          </p>
        ) : (
          <>
            <ol className="divide-y divide-border border-y border-border">
              {answers.map((answer, index) => (
                <li
                  key={answer.id}
                  className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:gap-5 sm:py-6"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-sm font-semibold text-brand-green sm:size-10 sm:text-base">
                    {index + 1}
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold leading-6 text-brand-ink sm:text-lg">
                        {answer.option.question.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-ink-muted">
                        Réponse sélectionnée
                      </p>
                      <p className="mt-2 inline-flex max-w-full items-start gap-2 rounded-md border border-brand-green/15 bg-brand-green-soft/70 px-3 py-2.5 text-sm leading-6 text-brand-ink sm:text-base">
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0 text-brand-green"
                          aria-hidden="true"
                        />
                        <span className="wrap-break-word">
                          {answer.option.label}
                        </span>
                      </p>
                    </div>

                    <time
                      dateTime={answer.answeredAt.toISOString()}
                      className="flex shrink-0 items-center gap-2 text-xs text-brand-ink-muted sm:pt-1 sm:text-sm"
                    >
                      <Clock3 className="size-4 shrink-0" aria-hidden="true" />
                      {formatDate(answer.answeredAt)}
                    </time>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-5 flex items-center gap-3 rounded-md border border-brand-green/15 bg-brand-green-soft/50 px-4 py-3.5">
              <CheckCircle2
                className="size-6 shrink-0 text-brand-green"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-brand-green-dark">
                  {answers.length} réponse{answers.length === 1 ? "" : "s"} au
                  total
                </p>
                <p className="text-sm text-brand-ink-muted">
                  Réponses enregistrées pour ce dossier.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
