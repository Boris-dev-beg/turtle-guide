import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Back } from "@/components/shared/links";
import { findPurchase } from "@/lib/documents";
import {
  DOCS_DIR,
  highlightFields,
  parseDocFile,
} from "./_components/Constantes/Globalconsts";
import DocumentHeader from "./_components/Cards/DocumentHeader";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

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

  let content: { statut: string | null; markdown: string } | null = null;
  try {
    const raw = await readFile(
      path.join(DOCS_DIR, path.basename(doc.contentUrl)),
      "utf8",
    );
    content = parseDocFile(raw);
  } catch {
    content = null;
  }

  const session = await getSession();
  const alreadyPurchased = session
    ? !!(await findPurchase(session.user.id, doc.id))
    : false;

  const backHref =
    from?.startsWith("/") && !from.startsWith("//") ? from : "/folders";

  const handleRefresh = () => window.location.reload();

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <Back href={backHref} />

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* HEADER */}
        <DocumentHeader
          content={content}
          doc={doc}
          session={session}
          alreadyPurchased={alreadyPurchased}
        />

        {/* BODY */}
        <article className="prose prose-neutral max-w-2xl min-w-0.5 border-2 p-2 border-border">
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {highlightFields(content.markdown)}
            </ReactMarkdown>
          ) : (
            <>
              <p>
                Le contenu de ce document n&apos;est pas disponible pour le
                moment.
              </p>
              <Button
                className="flex items-center gap-4"
                variant="secondary"
                onClick={handleRefresh}
              >
                Ressayer
                <RotateCw />
              </Button>
            </>
          )}
        </article>
      </div>
    </main>
  );
}
