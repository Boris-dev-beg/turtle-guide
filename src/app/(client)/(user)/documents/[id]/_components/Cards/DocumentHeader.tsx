import { Document } from "@/generated/prisma/client";
import { formtaPrice, STATUT_LABEL } from "../Constantes/Globalconsts";
import { DocumentCTAs } from "../DocumentCTAs";

type SessionType = {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
};

export default function DocumentHeader({
  content,
  doc,
  alreadyPurchased,
  session,
}: {
  content: {
    statut: string | null;
    markdown: string;
  } | null;
  doc: Document;
  alreadyPurchased: boolean;
  session: SessionType | null;
}) {
  return (
    <aside className="order-first lg:order-last">
      <div className="rounded-lg border border-border bg-card p-4 lg:sticky lg:top-24">
        <p className="text-base font-semibold text-brand-ink">{doc.name}</p>
        {content?.statut && (
          <p className="mt-1 text-sm text-brand-ink-muted">
            {STATUT_LABEL[content.statut] ?? content.statut}
          </p>
        )}
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
  );
}
