import { generatePDF } from "@/lib/pdf-generation/pdf";
import { requireSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { getFolder } from "@/lib/folder.action";
import {
  escapeHtml,
  formatDate,
  getPurpose,
  requestSchema,
} from "@/utils/functions";

export async function POST(req: NextRequest) {
  // ? Exige une session active; requireSession redirige/refuse aussi les appels anonymes.
  const session = await requireSession();

  // ? Le schéma partagé normalise la date puis vérifie tous les champs reçus avant leur usage.
  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    const firstValidationError = Object.values(
      parsed.error.flatten().fieldErrors,
    )
      .flat()
      .find(Boolean);

    console.log(parsed.error.issues);
    return NextResponse.json(
      {
        error:
          firstValidationError ??
          "Les informations de personnalisation sont invalides.",
      },
      { status: 400 },
    );
  }

  const { docId, folderId, data } = parsed.data;
  // ? un client ne peut pas générer un PDF à partir du dossier d'un autre compte.
  const folder = await getFolder(folderId, session.user.id);

  if (!folder) {
    return NextResponse.json(
      { error: "Dossier introuvable." },
      { status: 404 },
    );
  }

  if (!folder.process) {
    return NextResponse.json(
      { error: "Terminez le diagnostic avant de personnaliser ce document." },
      { status: 400 },
    );
  }

  // ? Le document doit réellement apparaître dans les étapes de ce dossier et être personnalisable.
  const document = folder.process.steps
    .flatMap((step) => step.documents)
    .find((item) => item.id === docId && item.customizable);

  if (!document) {
    return NextResponse.json(
      { error: "Ce document personnalisable n'appartient pas à ce dossier." },
      { status: 403 },
    );
  }

  // ? Les questions/réponses enregistrées sont la source du motif et du résumé de contexte de la lettre.
  const answers = folder.answers.map(({ option }) => ({
    question: option.question.title,
    answer: option.label,
  }));
  const purpose = getPurpose(answers);
  const location =
    folder.location?.city || folder.location?.address || "________________";
  // ? Le modèle de casier ajoute destinataire judiciaire et filiation; les autres lettres restent génériques.
  const isCriminalRecord = /casier judiciaire/i.test(
    `${folder.procedure.title} ${folder.process.title} ${document.name}`,
  );
  if (
    isCriminalRecord &&
    (!data.fatherName.trim() || !data.motherName.trim())
  ) {
    return NextResponse.json(
      { error: "Les noms des deux parents sont requis pour ce document." },
      { status: 400 },
    );
  }
  const authority = folder.process.steps
    .map((step) => step.administrativeBody?.name)
    .find(Boolean);
  const recipient = isCriminalRecord
    ? "Monsieur le Procureur de la République près le Tribunal de Première Instance du lieu de naissance"
    : authority
      ? `À l'attention de ${authority}`
      : "À l'attention de l'autorité administrative compétente";
  const subject = isCriminalRecord
    ? "Demande d'extrait de casier judiciaire (bulletin n° 3)"
    : `Demande de ${document.name}`;
  const currentDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Douala",
  }).format(new Date());
  const contextSummary = answers
    .map(({ question, answer }) => `${question} : ${answer}`)
    .join(" ; ");
  const filiation = isCriminalRecord
    ? `, enfant de ${escapeHtml(data.fatherName)} et de ${escapeHtml(data.motherName)}`
    : "";

  // ? Le HTML définit la mise en page de la lettre; toutes les valeurs dynamiques sont échappées ci-dessus.
  const html = `<!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <style>
          @page { size: A4; margin: 22mm 24mm; }
          * { box-sizing: border-box; }
          body { color: #172923; font: 12pt/1.65 Georgia, "Times New Roman", serif; }
          .brand { color: #17624f; font: 700 10pt/1.3 Arial, sans-serif; letter-spacing: .08em; }
          .place-date { margin-top: 40px; text-align: right; }
          .recipient { margin: 34px 0 24px auto; max-width: 75%; text-align: right; font-weight: 700; }
          .subject { margin: 22px 0; font-weight: 700; }
          p { margin: 16px 0; text-align: justify; }
          .signature { margin: 48px 0 0 auto; width: 42%; text-align: center; }
          .signature-line { margin-top: 58px; border-top: 1px solid #53675f; padding-top: 8px; }
          .notice { margin-top: 44px; border-top: 1px solid #c8d6cf; padding-top: 10px; color: #63736d; font: 9pt/1.45 Arial, sans-serif; }
        </style>
      </head>
      <body>
        <div class="brand">TURTLEGUIDE · VOTRE GUIDE ADMINISTRATIF</div>
        <div class="place-date">Fait à ${escapeHtml(location)}, le ${escapeHtml(currentDate)}</div>
        <div class="recipient">${escapeHtml(recipient)}</div>
        <div class="subject">Objet : ${escapeHtml(subject)}</div>
        <p>Madame, Monsieur,</p>
        <p>
          Je soussigné(e) <strong>${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</strong>,
          né(e) le ${escapeHtml(formatDate(data.birthDate))} à ${escapeHtml(data.birthPlace)},
          ${filiation} sollicite la délivrance de <strong>${escapeHtml(document.name)}</strong>.
        </p>
        <p>
          Cette demande est présentée dans le cadre de la démarche
          « ${escapeHtml(folder.procedure.title)} », étape « ${escapeHtml(folder.process.title)} »${purpose ? `, pour le motif suivant : ${escapeHtml(purpose)}` : ""}.
        </p>
        ${contextSummary ? `<p>Éléments précisés dans mon dossier : ${escapeHtml(contextSummary)}.</p>` : ""}
        <p>
          Je vous prie de bien vouloir donner une suite favorable à ma demande et vous prie
          d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.
        </p>
        <div class="signature">
          <div>Le / La demandeur(euse)</div>
          <div class="signature-line">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</div>
        </div>
        <div class="notice">
          Projet de lettre préparé à partir des informations de votre dossier. Vérifiez les
          pièces requises, le timbre éventuel et les consignes auprès de l'administration compétente avant dépôt.
        </div>
      </body>
    </html>`;

  try {
    // ? Puppeteer imprime le HTML en PDF A4; la réponse HTTP transporte ensuite le fichier au formulaire.
    const pdf = await generatePDF(html);
    const filename = `lettre-administrative-${docId.replace(/[^a-zA-Z0-9_-]/g, "")}.pdf`;
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF generation failed", error);
    return NextResponse.json(
      { error: "Erreur génération PDF" },
      { status: 500 },
    );
  }
}
