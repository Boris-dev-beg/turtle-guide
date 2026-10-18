
import path from "node:path";

export const DOCS_DIR = path.join(process.cwd(), "public", "documents");

export const STATUT_LABEL: Record<string, string> = {
  OFFICIEL: "Formulaire officiel",
  MODELE_SOURCE: "Modèle basé sur un texte de loi",
  MODELE_A_VALIDER:
    "Aide à la préparation, à confirmer auprès de l'administration",
};


export function formtaPrice(price: number){
    return `${new Intl.NumberFormat("fr-FR").format(Number(price))} FCFA`
}
