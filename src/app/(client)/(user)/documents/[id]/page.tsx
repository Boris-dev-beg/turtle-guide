import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DocumentCTAs } from "./_components/DocumentCTAs";
import { getSession } from "@/lib/session";
import { findPurchase } from "@/lib/documents";
import { formtaPrice } from "./_components/Constantes/Globalconsts";

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

  const session = await getSession();
  const alreadyPurchased = session
    ? !!(await findPurchase(session.user.id, doc.id))
    : false;

  const backHref =
    from?.startsWith("/") && !from.startsWith("//") ? from : "/folders";

  // contentUrl = /documents/<slug>.pdf (servi depuis public/)
  const pdfSrc = `${doc.contentUrl}#toolbar=0&navpanes=0&view=FitH`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Link
        href={backHref}
        className="text-sm font-medium text-brand-green underline"
      >
        Retour à mon dossier
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <aside className="order-first lg:order-last">
          <div className="rounded-lg border border-border bg-card p-4 lg:sticky lg:top-24">
            <p className="text-base font-semibold text-brand-ink">{doc.name}</p>
            <p className="mt-3 text-2xl font-semibold text-brand-ink">
              {formtaPrice(Number(doc.price))}
            </p>

            <DocumentCTAs
              documentId={doc.id}
              isAuthenticated={!!session}
              alreadyPurchased={alreadyPurchased}
            />

            {doc.legalWarning && (
              <p className="mt-3 text-sm leading-5 text-brand-ink-muted">
                {doc.legalWarning}
              </p>
            )}
          </div>
        </aside>

        <section aria-label={`Aperçu de ${doc.name}`}>
          {/* Desktop */}
          <iframe
            src={pdfSrc}
            title={`Aperçu du document : ${doc.name}`}
            className="hidden h-[80vh] w-full rounded-lg border border-border bg-white md:block"
          />

          {/* Mobile */}
          <div className="rounded-lg border border-border bg-card p-4 md:hidden">
            <p className="text-base text-brand-ink">
              Ouvrez l&apos;aperçu pour lire le contenu complet de ce document.
            </p>
            <a
              href={doc.contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex h-12 items-center justify-center gap-2 rounded-md border border-brand-green font-medium text-brand-green"
            >
              <ExternalLink className="size-4" />
              Ouvrir l&apos;aperçu PDF
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
