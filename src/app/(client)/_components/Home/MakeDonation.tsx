import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

const REASSURANCES = [
  "Dès 100 FCFA",
  "Sans créer de compte",
  "Mobile Money ou carte bancaire",
];

export default function MakeDonation() {
  return (
    <section
      aria-labelledby="make-donation-title"
      className="rounded-sm border border-border bg-brand-beige p-6 sm:p-8 mx-4"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex items-start gap-4">
          <span className="turtle-feature-icon" aria-hidden="true">
            <Heart className="size-5" />
          </span>

          <div className="min-w-0">
            <h2
              id="make-donation-title"
              className="font-display text-2xl font-semibold leading-tight text-brand-ink sm:text-[1.75rem]"
            >
              Aidez-nous à garder l&apos;orientation gratuite
            </h2>

            <p className="mt-2 max-w-2xl text-base leading-7 text-brand-ink-muted">
              Identifier votre démarche et connaître ses étapes ne vous coûte
              rien. Si TurtleGuide vous a été utile, un don nous aide à
              maintenir ce service accessible à tous.
            </p>

            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-brand-ink-muted">
              {REASSURANCES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="shrink-0">
          <Link
            href="/donation"
            className="btn btn-primary w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:w-auto"
          >
            Faire un don
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}