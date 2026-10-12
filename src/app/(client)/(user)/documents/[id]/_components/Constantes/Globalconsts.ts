
import path from "node:path";

export const DOCS_DIR = path.join(process.cwd(), "public", "documents");

export const STATUT_LABEL: Record<string, string> = {
  OFFICIEL: "Formulaire officiel",
  MODELE_SOURCE: "Modèle basé sur un texte de loi",
  MODELE_A_VALIDER:
    "Aide à la préparation, à confirmer auprès de l'administration",
};

// ? Sépare l'en-tête (---...---) du corps Markdown
export function parseDocFile(raw: string) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const header = m?.[1] ?? "";
  return {
    statut: header.match(/^statut:\s*(.+)$/m)?.[1]?.trim() ?? null,
    markdown: m ? raw.slice(m[0].length) : raw,
  };
}

// ? {{nom_complet}} -> **[nom complet]** pour faire ressortir les champs à remplir
export const highlightFields = (md: string) =>
  md.replace(
    /\{\{(\w+)\}\}/g,
    (_, k: string) => `**[${k.replace(/_/g, " ")}]**`,
  );

export function formtaPrice(price: number){
    return `${new Intl.NumberFormat("fr-FR").format(Number(price))} FCFA`
}
