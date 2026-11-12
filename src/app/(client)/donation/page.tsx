import DonationForm from "./_components/DonationForm";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";

export default async function DonationPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const { payment } = await searchParams;
  const notice =
    payment === "success"
      ? "Merci pour votre générosité ! Votre paiement est en cours de confirmation."
      : payment === "pending"
        ? "Votre retour de paiement a bien été reçu. La confirmation peut prendre quelques instants."
        : payment === "cancelled"
          ? "Le paiement a été annulé. Vous pouvez reprendre votre don quand vous le souhaitez."
          : null;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
      <section className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div className="pt-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-green-soft px-3 py-1.5 text-sm font-semibold text-brand-green">
            <Heart className="size-4" aria-hidden /> Soutenir TurtleGuide
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-tight text-brand-ink sm:text-5xl">
            Votre don rend les démarches plus simples pour tous.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-brand-ink-muted">
            TurtleGuide aide chacun à comprendre ses démarches administratives
            gratuitement. Votre contribution finance la création de guides
            fiables et leur accès pour tous.
          </p>
          <div className="mt-8 space-y-4">
            {[
              "Maintenir les guides d’orientation gratuits",
              "Créer des contenus clairs et à jour",
              "Rendre le service accessible au plus grand nombre",
            ].map((item) => (
              <p
                key={item}
                className="flex items-center gap-3 text-base text-brand-ink"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-green-soft text-brand-green">
                  <Sparkles className="size-4" aria-hidden />
                </span>
                {item}
              </p>
            ))}
          </div>
          <p className="mt-10 flex items-center gap-2 text-sm text-brand-ink-muted">
            <ShieldCheck className="size-5 text-brand-green" aria-hidden />{" "}
            Paiement sécurisé par Stripe ou KPay.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
          {notice && (
            <p
              role="status"
              className="mb-5 rounded-lg border border-brand-green/20 bg-brand-green-soft p-4 text-sm leading-6 text-brand-green"
            >
              {notice}
            </p>
          )}
          <h2 className="font-display text-2xl font-semibold text-brand-ink">
            Faire un don
          </h2>
          <p className="mt-2 text-sm leading-6 text-brand-ink-muted">
            Choisissez un montant ou indiquez le vôtre. Chaque contribution
            compte.
          </p>
          <DonationForm />
        </div>
      </section>
    </div>
  );
}
