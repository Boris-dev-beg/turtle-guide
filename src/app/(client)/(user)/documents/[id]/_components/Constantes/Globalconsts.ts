import { CreditCard, Smartphone } from "lucide-react";
import path from "node:path";

export const DOCS_DIR = path.join(process.cwd(), "public", "documents");

export const STATUT_LABEL: Record<string, string> = {
  OFFICIEL: "Formulaire officiel",
  MODELE_SOURCE: "Modèle basé sur un texte de loi",
  MODELE_A_VALIDER:
    "Aide à la préparation, à confirmer auprès de l'administration",
};

export function formtaPrice(price: number) {
  return `${new Intl.NumberFormat("fr-FR").format(Number(price))} FCFA`;
}

export const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Carte bancaire avec Stripe",
    description: "Paiement par carte sur la page sécurisée Stripe.",
    Icon: CreditCard,
  },
  {
    id: "kpay",
    label: "Mobile Money avec KPay",
    description:
      "Choisissez MTN Mobile Money ou Orange Money sur la page sécurisée KPay.",
    Icon: Smartphone,
  },
] as const;

export const personalizationSteps = [
  ["firstName", "lastName", "birthDate", "age"],
  ["phone", "email", "city", "address"],
  ["purpose", "notes"],
] as const;
