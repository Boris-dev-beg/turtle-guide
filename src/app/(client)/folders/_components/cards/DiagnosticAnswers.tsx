import { CheckCircle2, Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="relative overflow-hidden rounded-sm border-border border-l-4 border-l-brand-yellow bg-card shadow-none">
      <CardHeader className="gap-1 px-5 pb-4 pt-5 sm:px-6">
        <CardTitle className="font-display text-2xl text-brand-ink">
          Réponses à votre diagnostic
        </CardTitle>
        <p className="text-base leading-6 text-brand-ink-muted">
          Voici les réponses que vous avez fournies lors de votre diagnostic.
        </p>
      </CardHeader>

      <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
        {answers.length === 0 ? (
          <p className="border-t border-border pt-4 leading-6 text-brand-ink-muted">
            Aucune réponse n&apos;a encore été enregistrée.
          </p>
        ) : (
          <>
            <ol className="divide-y divide-border border-y border-border">
              {answers.map((answer, index) => (
                <li
                  key={answer.id}
                  className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:gap-4"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-brand-green text-base font-semibold text-primary-foreground">
                    {index + 1}
                  </span>

                  <div className="flex flex-1 flex-col gap-2 justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold leading-6 text-brand-ink">
                        {answer.option.question.title}
                      </h3>
                      <p className="mt-1 text-sm text-brand-ink-muted">
                        Réponse sélectionnée
                      </p>
                      <p className="mt-2 inline-flex max-w-full items-start gap-2 rounded-sm bg-brand-green-soft px-3 py-2 text-base leading-5 text-brand-ink">
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
                      className="flex items-center gap-2 text-sm text-brand-ink-muted sm:justify-end"
                    >
                      <Clock3 className="size-4 shrink-0" aria-hidden="true" />
                      {new Intl.DateTimeFormat("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(answer.answeredAt)}
                    </time>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4 flex items-center gap-3 rounded-sm bg-brand-green-soft/60 px-4 py-3">
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
