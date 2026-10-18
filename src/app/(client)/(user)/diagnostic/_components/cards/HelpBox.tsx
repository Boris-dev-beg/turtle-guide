import { Headset } from "lucide-react";

export function HelpBox() {
  return (
    <div className="hidden md:flex flex-col items-start gap-3 rounded-sm border border-border border-l-4 border-l-brand-yellow bg-card p-4 mt-auto">
      <span className="rounded-sm bg-brand-yellow-bg p-2.5 text-brand-ink">
        <Headset className="size-5" />
      </span>
      <div>
        <h2 className="font-display text-lg text-brand-ink">
          Besoin d&apos;aide ?
        </h2>
        <p className="text-muted-foreground text-sm leading-5 mt-1">
          Notre équipe est là pour vous accompagner dans vos démarches.
        </p>
      </div>
    </div>
  );
}
