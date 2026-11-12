"use client";

import { useState } from "react";
import { CreditCard, Heart, LockKeyhole, Smartphone } from "lucide-react";
import { startDonation } from "@/lib/donations";

const amounts = [500, 1000, 2500, 5000];
const money = (amount: number) => new Intl.NumberFormat("fr-FR").format(amount);

export default function DonationForm() {
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [custom, setCustom] = useState(false);
  const [method, setMethod] = useState<"kpay" | "card">("kpay");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const donationAmount = custom ? Number(customAmount) : amount;

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (
      !Number.isSafeInteger(donationAmount) ||
      donationAmount < 100 ||
      donationAmount > 10_000_000
    ) {
      setError(
        "Entrez un montant entier compris entre 100 et 10 000 000 FCFA.",
      );
      return;
    }
    setPending(true);
    try {
      const result = await startDonation({
        amount: donationAmount,
        method,
        name,
        email,
        message,
      });
      window.location.assign(result.checkoutUrl);
    } catch {
      setError(
        "Impossible de démarrer le paiement. Vérifiez vos informations puis réessayez.",
      );
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-6">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-brand-ink">
          Montant du don
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {amounts.map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => {
                setAmount(value);
                setCustom(false);
              }}
              aria-pressed={!custom && amount === value}
              className={`min-h-12 rounded-lg border px-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${!custom && amount === value ? "border-brand-green bg-brand-green-soft text-brand-green" : "border-border text-brand-ink hover:border-brand-green"}`}
            >
              {money(value)} FCFA
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCustom(true)}
            aria-pressed={custom}
            className={`col-span-2 min-h-12 rounded-lg border px-3 text-sm font-semibold sm:col-span-4 ${custom ? "border-brand-green bg-brand-green-soft text-brand-green" : "border-border text-brand-ink hover:border-brand-green"}`}
          >
            Autre montant
          </button>
        </div>
        {custom && (
          <label className="mt-3 block text-sm font-medium text-brand-ink">
            Montant personnalisé (FCFA)
            <input
              type="number"
              min="100"
              max="10000000"
              step="1"
              inputMode="numeric"
              required
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Ex. 3 000"
              className="mt-2 min-h-12 w-full rounded-lg border border-input bg-white px-3 text-base"
            />
          </label>
        )}
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-brand-ink">
          Votre nom{" "}
          <span className="font-normal text-brand-ink-muted">(facultatif)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            autoComplete="name"
            placeholder="Nom ou organisation"
            className="mt-2 min-h-12 w-full rounded-lg border border-input bg-white px-3 text-base"
          />
        </label>
        <label className="text-sm font-medium text-brand-ink">
          E-mail{" "}
          <span className="font-normal text-brand-ink-muted">(facultatif)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="vous@exemple.com"
            className="mt-2 min-h-12 w-full rounded-lg border border-input bg-white px-3 text-base"
          />
        </label>
      </div>
      <label className="block text-sm font-medium text-brand-ink">
        Un mot pour l’équipe{" "}
        <span className="font-normal text-brand-ink-muted">(facultatif)</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
          rows={2}
          placeholder="Qu’est-ce qui vous a donné envie de contribuer ?"
          className="mt-2 w-full resize-y rounded-lg border border-input bg-white px-3 py-2.5 text-base"
        />
      </label>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-brand-ink">
          Moyen de paiement
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              {
                id: "kpay",
                title: "Mobile Money",
                text: "MTN ou Orange Money",
                Icon: Smartphone,
              },
              {
                id: "card",
                title: "Carte bancaire",
                text: "Visa, Mastercard et autres",
                Icon: CreditCard,
              },
            ] as const
          ).map(({ id, title, text, Icon }) => (
            <label
              key={id}
              className={`flex min-h-18 cursor-pointer items-center gap-3 rounded-lg border p-3 ${method === id ? "border-brand-green bg-brand-green-soft" : "border-border"}`}
            >
              <input
                type="radio"
                name="method"
                value={id}
                checked={method === id}
                onChange={() => setMethod(id)}
                className="accent-brand-green"
              />
              <Icon className="size-5 shrink-0 text-brand-green" aria-hidden />
              <span>
                <span className="block text-sm font-semibold text-brand-ink">
                  {title}
                </span>
                <span className="text-xs text-brand-ink-muted">{text}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="text-sm leading-6 text-destructive">
          {error}
        </p>
      )}
      <p className="flex items-start gap-2 text-xs leading-5 text-brand-ink-muted">
        <LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden />
        Vos informations de carte ou Mobile Money sont saisies directement chez
        le prestataire de paiement sécurisé.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary min-h-12 w-full justify-center"
      >
        {pending ? (
          "Préparation du paiement…"
        ) : (
          <>
            <Heart className="size-5" aria-hidden />
            Contribuer{" "}
            {money(Number.isFinite(donationAmount) ? donationAmount : 0)} FCFA
          </>
        )}
      </button>
    </form>
  );
}
