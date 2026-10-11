import { notFound } from "next/navigation";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";
import { DocumentCTAs } from "./_components/DocumentCTAs";
import { getSession } from "@/lib/session";

const DOCS_DIR = path.join(process.cwd(), "public", "documents");

const STATUT_LABEL: Record<string, string> = {
  OFFICIEL: "Formulaire officiel",
  MODELE_SOURCE: "Modèle basé sur un texte de loi",
  MODELE_A_VALIDER: "Aide à la préparation, à confirmer auprès de l'administration",
};

// Sépare l'en-tête (---...---) du corps Markdown
function parseDocFile(raw: string) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const header = m?.[1] ?? "";
  return {
    statut: header.match(/^statut:\s*(.+)$/m)?.[1]?.trim() ?? null,
    markdown: m ? raw.slice(m[0].length) : raw,
  };
}

// {{nom_complet}} -> **[nom complet]** pour faire ressortir les champs à remplir
const highlightFields = (md: string) =>
  md.replace(/\{\{(\w+)\}\}/g, (_, k: string) => `**[${k.replace(/_/g, " ")}]**`);

export default async function DocumentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;

  const doc = await prisma.document.findUnique({ where: { id } });
  if (!doc) notFound();

  // path.basename empêche toute sortie du dossier public/documents
  let content: { statut: string | null; markdown: string } | null = null;
  try {
    const raw = await readFile(path.join(DOCS_DIR, path.basename(doc.contentUrl)), "utf8");
    content = parseDocFile(raw);
  } catch {
    content = null;
  }

  const session = await getSession();
  const alreadyPurchased = session
    ? !!(await prisma.documentPurchase.findFirst({
        where: {
          userId: session.user.id,
          documentId: doc.id,
          transactions: { some: { status: "SUCCESS" } },
        },
        select: { id: true },
      }))
    : false;

  // Évite qu'un paramètre `from` externe serve de redirection ouverte
  const backHref = from?.startsWith("/") && !from.startsWith("//") ? from : "/folders";

  const price = `${new Intl.NumberFormat("fr-FR").format(Number(doc.price))} FCFA`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <Link href={backHref} className="text-sm font-medium text-brand-green underline">
        Retour à mon dossier
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Boutons d'achat en premier sur mobile, colonne fixe sur desktop */}
        <aside className="order-first lg:order-last">
          <div className="rounded-lg border border-border bg-card p-4 lg:sticky lg:top-24">
            <p className="text-base font-semibold text-brand-ink">{doc.name}</p>
            {content?.statut && (
              <p className="mt-1 text-sm text-brand-ink-muted">
                {STATUT_LABEL[content.statut] ?? content.statut}
              </p>
            )}
            <p className="mt-3 text-2xl font-semibold text-brand-ink">{price}</p>

            <DocumentCTAs
              documentId={doc.id}
              isAuthenticated={!!session}
              alreadyPurchased={alreadyPurchased}
            />

            {doc.legalWarning && (
              <p className="mt-3 text-sm leading-5 text-brand-ink-muted">{doc.legalWarning}</p>
            )}
          </div>
        </aside>

        <article className="prose prose-neutral max-w-none">
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {highlightFields(content.markdown)}
            </ReactMarkdown>
          ) : (
            <p>Le contenu de ce document n&apos;est pas disponible pour le moment.</p>
          )}
        </article>
      </div>
    </main>
  );
}