import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpenCheck,
  ClipboardList,
  FileText,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import cityImage from "@/assets/images/hero.jpg";

const principles = [
  {
    number: "01",
    title: "Comprendre votre situation",
    description:
      "Un diagnostic par questions aide à repérer la démarche qui correspond à votre besoin.",
  },
  {
    number: "02",
    title: "Savoir quoi préparer",
    description:
      "Chaque parcours présente les étapes, les documents associés et le service administratif compétent lorsqu'il est renseigné.",
  },
  {
    number: "03",
    title: "Retrouver vos démarches",
    description:
      "Vos dossiers vous permettent de consulter vos réponses et de reprendre un diagnostic en cours.",
  },
];

const resources = [
  {
    icon: ClipboardList,
    title: "Des parcours guidés",
    description:
      "Des questions simples orientent vers une procédure adaptée à votre situation.",
  },
  {
    icon: FileText,
    title: "Les pièces à préparer",
    description:
      "Les documents associés aux étapes sont présentés avec leurs avertissements utiles.",
  },
  {
    icon: MapPin,
    title: "Les services compétents",
    description:
      "Quand les informations sont disponibles, le dossier indique l'administration et l'unité qui couvre votre localité.",
  },
  {
    icon: ShieldAlert,
    title: "Des repères contre les arnaques",
    description:
      "Les alertes liées à une étape sont signalées pour vous aider à rester vigilant.",
  },
];

export default function AboutPage() {
  return (
    <main className="w-full">
      <section className="relative isolate flex min-h-88 items-end overflow-hidden bg-brand-ink sm:min-h-104 lg:min-h-116">
        <Image
          src={cityImage}
          alt="Carrefour urbain animé avec taxis et bâtiments"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-brand-ink/65" />

        <div className="wrapper w-full py-10 sm:py-14 lg:py-16">
          <p className="mb-4 text-sm font-semibold text-primary-foreground/80">
            À propos de TurtleGuide
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Les démarches, expliquées pas à pas.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-primary-foreground/90 sm:text-xl">
            TurtleGuide aide les citoyens au Cameroun à comprendre les démarches
            administratives et judiciaires, à préparer les pièces utiles et à
            retrouver leurs dossiers.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/categories"
              className="btn btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-5 text-base"
            >
              Trouver une démarche
              <ArrowRight className="size-5" />
            </Link>
            <a
              href="#notre-approche"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-primary-foreground/60 px-5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Découvrir notre approche
              <ArrowDown className="size-5" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="notre-approche"
        className="wrapper grid gap-8 border-b border-border py-12 sm:py-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:py-20"
      >
        <div>
          <p className="mb-3 text-sm font-semibold text-brand-green">
            Notre approche
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl">
            Une information plus facile à suivre.
          </h2>
        </div>
        <div className="space-y-5 text-lg leading-7 text-brand-ink-muted">
          <p>
            Une démarche peut comporter plusieurs étapes, des documents à réunir
            et différents services à contacter. TurtleGuide rassemble ces
            repères dans un parcours clair, adapté aux réponses de chaque
            personne.
          </p>
          <p>
            Le but est simple : vous aider à comprendre ce qui vous attend avant
            de vous déplacer et à garder une trace de votre démarche.
          </p>
        </div>
      </section>

      <section className="wrapper py-12 sm:py-16 lg:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-sm font-semibold text-brand-green">
            Comment ça fonctionne
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl">
            De votre situation aux prochaines étapes.
          </h2>
        </div>

        <ol className="divide-y divide-border border-y border-border">
          {principles.map((principle) => (
            <li
              key={principle.number}
              className="grid gap-3 py-6 sm:grid-cols-[4rem_minmax(12rem,0.8fr)_minmax(0,1.2fr)] sm:items-baseline sm:gap-6"
            >
              <span className="font-display text-2xl text-brand-green">
                {principle.number}
              </span>
              <h3 className="text-xl font-semibold text-brand-ink">
                {principle.title}
              </h3>
              <p className="text-lg leading-7 text-brand-ink-muted">
                {principle.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-secondary/70">
        <div className="wrapper grid gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:py-20">
          <div>
            <p className="mb-3 text-sm font-semibold text-brand-green">
              Ce que vous trouverez
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl">
              Des repères utiles, au même endroit.
            </h2>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {resources.map((resource) => {
              const Icon = resource.icon;

              return (
                <article key={resource.title} className="flex gap-4 py-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-border bg-background text-brand-green">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-brand-ink">
                      {resource.title}
                    </h3>
                    <p className="mt-1 text-lg leading-7 text-brand-ink-muted">
                      {resource.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="wrapper grid gap-6 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)] lg:items-start lg:gap-16 lg:py-20">
        <div>
          <p className="mb-3 text-sm font-semibold text-brand-green">
            Un guide indépendant
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl">
            Comprendre la démarche avant de la faire.
          </h2>
        </div>
        <div className="border-l-4 border-brand-yellow bg-brand-yellow-bg p-5 sm:p-6">
          <BookOpenCheck
            className="mb-3 size-7 text-brand-ink"
            aria-hidden="true"
          />
          <p className="text-lg leading-7 text-brand-ink">
            TurtleGuide est un outil d&apos;orientation. Il vous aide à préparer
            votre démarche, mais ne remplace pas la décision ni les instructions
            de l&apos;administration compétente.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-brand-green-dark text-primary-foreground">
        <div className="wrapper flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:py-12">
          <div>
            <h2 className="font-display text-3xl font-semibold">
              Vous avez une démarche à faire ?
            </h2>
            <p className="mt-2 text-lg leading-7 text-primary-foreground/80">
              Commencez par décrire votre situation.
            </p>
          </div>
          <Link
            href="/categories"
            className="btn inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-primary-foreground/70 px-5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            Parcourir les démarches
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
