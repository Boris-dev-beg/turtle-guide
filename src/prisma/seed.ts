/**
 * TurtleGuide — seed.ts (v2 — 5 catégories × 5 procédures)
 * ============================================================
 * Aucun compte créé (ni utilisateur, ni administrateur).
 *
 * NOTE D'ARCHITECTURE IMPORTANTE — LOCALISATION :
 * Le schéma ne définit aucune relation entre AnswerOption et Location.
 * La question "Où vous trouvez-vous actuellement ?" ajoutée en première
 * question de chaque procédure est donc une question à choix fermé
 * (ville parmi celles seedées + "Autre"), utile pour informer l'UX,
 * mais SA RÉPONSE N'EST PAS RELIÉE PROGRAMMATIQUEMENT à Folder.locationId.
 * La résolution dynamique de l'unité administrative la plus proche doit
 * continuer à s'appuyer sur Folder.locationId (collecté séparément),
 * conformément au CDC. Si vous voulez vraiment relier la réponse à cette
 * question à Folder.locationId, il faudra soit faire correspondre le
 * label choisi à une Location côté application, soit migrer le schéma
 * (ex: ajouter un champ locationId optionnel sur AnswerOption).
 *
 * SOURCES VÉRIFIÉES (résumé — détail dans les commentaires de chaque
 * procédure) :
 * - Ordonnance n°81/02 du 29 juin 1981 portant organisation de l'état
 *   civil, modifiée par la Loi n°2011/011 du 6 mai 2011, et Loi
 *   n°2024/016 du 23 décembre 2024 (état civil : naissance, mariage,
 *   décès, reconnaissance, transcription).
 * - Décret présidentiel du 4 août 2016 (CNI) ; portail passcam.cm /
 *   DGSN (passeport biométrique) ; Campost/MINT (permis de conduire
 *   international) ; plateforme teledeclaration-dgi.cm / DGI (NIU) ;
 *   procédure devant le Tribunal de Première Instance (certificat de
 *   nationalité camerounaise).
 * - Loi n°2019/024 du 24 décembre 2019 (CGCTD, attributions communes) ;
 *   Loi n°2004/003 du 21 avril 2004 régissant l'urbanisme (permis de
 *   bâtir, certificat d'urbanisme, articles 99/107/111/112) et son
 *   décret d'application n°2008/0739 (délai de 45 jours) ; patente :
 *   fiscalité locale / DGI.
 * - Formulaire officiel MINESUP "DCAA" (certification, duplicata,
 *   correction, attestation de réussite — diplômes et relevés de
 *   notes).
 * - Code de Procédure Pénale, articles 573 à 583 (casier judiciaire,
 *   bulletin n°3, Tribunal de Première Instance du lieu de naissance).
 * - Loi n°90/053 du 19 décembre 1990 relative à la liberté
 *   d'association, articles 1, 5, 7, 8 (déclaration en préfecture).
 * - Légalisation de documents, certificat de célibat, certificat
 *   d'hébergement, déclaration de perte : pratiques administratives
 *   courantes et largement documentées, mais sans numéro de loi unique
 *   et précis identifié — indiqué explicitement dans legalBasis.
 *
 * NOTE SUR LES IMAGES : picsum.photos (voir v1 du seed pour le détail
 * du choix). NOTE SUR LES PRIX (Document.price) : tarifs de SERVICE
 * TurtleGuide, pas des frais administratifs officiels.
 * ============================================================
 */

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

function img(seed: string) {
  return `https://picsum.photos/seed/turtleguide-${seed}/900/600`;
}

async function main() {
  console.log("🌱 Starting seed v2 (5 catégories × 5 procédures)...");

  // ============================================================
  // CLEAN DATABASE
  // ============================================================

  await prisma.transaction.deleteMany();
  await prisma.documentPurchase.deleteMany();
  await prisma.donation.deleteMany();

  await prisma.fraudAlert.deleteMany();
  await prisma.step.deleteMany();
  await prisma.document.deleteMany();

  await prisma.answer.deleteMany();
  await prisma.progression.deleteMany();
  await prisma.folder.deleteMany();

  await prisma.answerOption.deleteMany();
  await prisma.question.deleteMany();

  await prisma.process.deleteMany();
  await prisma.procedure.deleteMany();
  await prisma.category.deleteMany();

  await prisma.areaServed.deleteMany();
  await prisma.administrativeUnit.deleteMany();
  await prisma.administrativeBody.deleteMany();
  await prisma.location.deleteMany();

  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.administrator.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Database cleaned");

  // ============================================================
  // LOCATIONS
  // ============================================================

  const cities = [
    {
      key: "yaounde",
      city: "Yaoundé",
      address: "Centre-ville de Yaoundé",
      latitude: 3.848,
      longitude: 11.5021,
    },
    {
      key: "douala",
      city: "Douala",
      address: "Centre-ville de Douala",
      latitude: 4.0511,
      longitude: 9.7679,
    },
    {
      key: "bafoussam",
      city: "Bafoussam",
      address: "Centre administratif de Bafoussam",
      latitude: 5.4781,
      longitude: 10.4176,
    },
    {
      key: "bamenda",
      city: "Bamenda",
      address: "Centre administratif de Bamenda",
      latitude: 5.9631,
      longitude: 10.1591,
    },
  ] as const;

  const locations: Record<string, { id: string }> = {};
  for (const c of cities) {
    locations[c.key] = await prisma.location.create({
      data: {
        address: c.address,
        city: c.city,
        latitude: c.latitude,
        longitude: c.longitude,
      },
    });
  }

  console.log("✅ Locations created");

  // ============================================================
  // ADMINISTRATIVE BODIES
  // ============================================================

  const mairie = await prisma.administrativeBody.create({
    data: { name: "Mairie (Centre d'état civil)" },
  });
  const tribunal = await prisma.administrativeBody.create({
    data: { name: "Tribunal de Première Instance" },
  });
  const dgsn = await prisma.administrativeBody.create({
    data: { name: "Délégation Générale à la Sûreté Nationale (DGSN)" },
  });
  const commissariat = await prisma.administrativeBody.create({
    data: { name: "Commissariat de Police" },
  });
  const prefecture = await prisma.administrativeBody.create({
    data: { name: "Préfecture" },
  });
  const dgi = await prisma.administrativeBody.create({
    data: { name: "Direction Générale des Impôts (DGI) / Centre des Impôts" },
  });
  const minesup = await prisma.administrativeBody.create({
    data: { name: "Ministère de l'Enseignement Supérieur (MINESUP)" },
  });
  const campost = await prisma.administrativeBody.create({
    data: { name: "Campost / Délégation MINT" },
  });

  console.log("✅ Administrative bodies created");

  // ============================================================
  // ADMINISTRATIVE UNITS + AREAS SERVED
  // ============================================================

  const bodies = [
    { body: mairie, label: "Mairie" },
    { body: tribunal, label: "Tribunal de Première Instance" },
    { body: dgsn, label: "Centre d'enrôlement DGSN" },
    { body: commissariat, label: "Commissariat de Police" },
    { body: prefecture, label: "Préfecture" },
    { body: dgi, label: "Centre des Impôts" },
    { body: minesup, label: "Antenne MINESUP" },
    { body: campost, label: "Agence Campost" },
  ];

  for (const { body, label } of bodies) {
    for (const c of cities) {
      const unit = await prisma.administrativeUnit.create({
        data: {
          name: `${label} de ${c.city}`,
          administrativeBodyId: body.id,
          locationId: locations[c.key].id,
        },
      });
      await prisma.areaServed.create({
        data: {
          name: c.city,
          locationId: locations[c.key].id,
          administrativeUnitId: unit.id,
        },
      });
    }
  }

  console.log("✅ Administrative units and areas served created");

  // ============================================================
  // CATEGORIES (5)
  // ============================================================

  const civilStatusCategory = await prisma.category.create({
    data: {
      name: "État civil",
      slug: "etat-civil",
      description:
        "Démarches relatives aux actes et documents d'état civil : naissance, mariage, décès, reconnaissance, transcription.",
      isActive: true,
    },
  });

  const identityCategory = await prisma.category.create({
    data: {
      name: "Identité",
      slug: "identite",
      description:
        "Démarches relatives aux documents d'identité : CNI, passeport, permis de conduire international, NIU, nationalité.",
      isActive: true,
    },
  });

  const residenceCategory = await prisma.category.create({
    data: {
      name: "Résidence et administration",
      slug: "residence-administration",
      description:
        "Démarches liées à la résidence, à l'urbanisme et aux formalités administratives locales.",
      isActive: true,
    },
  });

  const academicCategory = await prisma.category.create({
    data: {
      name: "Académique",
      slug: "academique",
      description:
        "Démarches relatives à la certification, la correction et le duplicata de diplômes et relevés de notes auprès du MINESUP.",
      isActive: true,
    },
  });

  const justiceCategory = await prisma.category.create({
    data: {
      name: "Justice et formalités légales",
      slug: "justice",
      description:
        "Démarches à caractère légal : casier judiciaire, légalisation de documents, certificat de célibat, déclaration d'association, déclaration de perte.",
      isActive: true,
    },
  });

  console.log("✅ Categories created");

  // ============================================================
  // HELPER — question de localisation (voir note en tête de fichier)
  // ============================================================

  async function addLocationQuestion(
    procedureId: string,
    nextQuestionId: string,
  ) {
    const q = await prisma.question.create({
      data: {
        title: "Où vous trouvez-vous actuellement ?",
        description:
          "Cette information aide à orienter vers l'unité administrative la plus proche. Note développeur : voir l'en-tête du fichier seed — cette réponse n'est pas automatiquement reliée à Folder.locationId.",
        procedureId,
      },
    });

    const options = [...cities.map((c) => c.city), "Autre ville / zone rurale"];
    for (const label of options) {
      await prisma.answerOption.create({
        data: { label, questionId: q.id, nextQuestionId },
      });
    }
    return q;
  }

  // ============================================================
  // CATÉGORIE 1 — ÉTAT CIVIL (5 procédures)
  // ============================================================

  // --- 1.1 Acte de naissance ---
  // Sources : Ordonnance n°81/02 (art. 30-33, 41-44), Loi n°2011/011,
  // Loi n°2024/016. Confiance : forte (textes de loi identifiés).

  const birthProcedure = await prisma.procedure.create({
    data: {
      title: "Acte de naissance",
      description:
        "Identifie la démarche exacte selon votre situation : naissance jamais déclarée, copie d'un acte existant, ou correction d'une erreur.",
      image: img("acte-naissance"),
      legalBasis:
        "Loi n°2024/016 du 23 décembre 2024 ; Ordonnance n°81/02 du 29 juin 1981 portant organisation de l'état civil, modifiée par la Loi n°2011/011 du 6 mai 2011 (articles 30 à 33).",
      categoryId: civilStatusCategory.id,
      isActive: true,
    },
  });

  const normalDeclarationProcess = await prisma.process.create({
    data: {
      title: "Déclaration normale de naissance",
      description:
        "Déclaration dans le délai légal de 90 jours suivant l'accouchement, gratuite dans ce délai.",
    },
  });
  const lateDeclarationProcess = await prisma.process.create({
    data: {
      title: "Déclaration tardive par réquisition du Procureur",
      description:
        "Naissance non déclarée dans les 90 jours mais ayant moins de six mois : enregistrement sur réquisition du Procureur de la République.",
    },
  });
  const suppletiveJudgmentProcess = await prisma.process.create({
    data: {
      title: "Jugement supplétif d'acte de naissance",
      description:
        "Naissance non déclarée au-delà de six mois : l'acte ne peut être établi que par jugement du Tribunal de Première Instance.",
    },
  });
  const birthCopyProcess = await prisma.process.create({
    data: {
      title: "Copie d'un acte de naissance existant",
      description:
        "Obtenir une copie ou un extrait certifié conforme d'un acte déjà dressé.",
    },
  });
  const birthRectificationProcess = await prisma.process.create({
    data: {
      title: "Rectification d'un acte de naissance",
      description:
        "Correction d'une erreur matérielle par jugement supplétif de rectification.",
    },
  });

  const birthDeclarationForm = await prisma.document.create({
    data: {
      name: "Fiche de déclaration de naissance pré-remplie",
      price: 500,
      customizable: true,
      legalWarning:
        "Aide à la préparation du dossier. La déclaration elle-même reste gratuite dans le délai légal.",
    },
  });
  const requisitionRequestForm = await prisma.document.create({
    data: {
      name: "Modèle de demande de réquisition au Procureur de la République",
      price: 1500,
      customizable: true,
      legalWarning:
        "Ne remplace ni le certificat de non-inscription, ni la décision du Procureur.",
    },
  });
  const suppletiveRequestForm = await prisma.document.create({
    data: {
      name: "Modèle de requête en jugement supplétif d'acte de naissance",
      price: 2000,
      customizable: true,
      legalWarning:
        "Aide à la rédaction, ne garantit pas l'issue devant le tribunal.",
    },
  });
  const birthCopyRequestForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande de copie d'acte de naissance",
      price: 500,
      customizable: true,
      legalWarning: "Des frais de timbre restent dus directement à la mairie.",
    },
  });
  const rectificationRequestForm = await prisma.document.create({
    data: {
      name: "Modèle de requête en rectification d'acte de naissance",
      price: 2000,
      customizable: true,
      legalWarning: "Ne remplace pas une assistance juridique.",
    },
  });

  const birthQuestion = await prisma.question.create({
    data: {
      title: "Quelle est votre situation concernant l'acte de naissance ?",
      procedureId: birthProcedure.id,
    },
  });
  const birthNeverDeclaredQuestion = await prisma.question.create({
    data: {
      title:
        "Depuis combien de temps la naissance n'a-t-elle pas été déclarée ?",
      procedureId: birthProcedure.id,
    },
  });

  await prisma.answerOption.create({
    data: {
      label: "La naissance n'a jamais été déclarée à l'état civil",
      questionId: birthQuestion.id,
      nextQuestionId: birthNeverDeclaredQuestion.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "L'acte existe déjà et je souhaite en obtenir une copie",
      questionId: birthQuestion.id,
      processId: birthCopyProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "L'acte existe mais contient une erreur à corriger",
      questionId: birthQuestion.id,
      processId: birthRectificationProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Moins de 90 jours",
      questionId: birthNeverDeclaredQuestion.id,
      processId: normalDeclarationProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Entre 90 jours et 6 mois",
      questionId: birthNeverDeclaredQuestion.id,
      processId: lateDeclarationProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Plus de 6 mois",
      questionId: birthNeverDeclaredQuestion.id,
      processId: suppletiveJudgmentProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Réunir les pièces justificatives de la naissance",
      processId: normalDeclarationProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: birthDeclarationForm.id }] },
      description: "Préparez lieu, date de naissance et identité des parents.",
    },
  });
  await prisma.step.create({
    data: {
      title:
        "Déclarer la naissance au centre d'état civil du lieu de naissance",
      processId: normalDeclarationProcess.id,
      administrativeBodyId: mairie.id,
      description: "Dans les 90 jours ; gratuit dans ce délai.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Retirer le premier exemplaire de l'acte",
      processId: normalDeclarationProcess.id,
      administrativeBodyId: mairie.id,
      description: "Récupérez l'acte délivré par l'officier d'état civil.",
    },
  });

  const requisitionStep = await prisma.step.create({
    data: {
      title: "Obtenir un certificat de non-inscription",
      processId: lateDeclarationProcess.id,
      administrativeBodyId: mairie.id,
      description: "Délivré par la mairie du lieu de naissance.",
    },
  });
  await prisma.step.create({
    data: {
      title:
        "Saisir le Procureur de la République pour obtenir une réquisition",
      processId: lateDeclarationProcess.id,
      administrativeBodyId: tribunal.id,
      documents: { connect: [{ id: requisitionRequestForm.id }] },
      description:
        "Adressée au Procureur près le Tribunal de Première Instance compétent.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Présenter la réquisition à l'officier d'état civil",
      processId: lateDeclarationProcess.id,
      administrativeBodyId: mairie.id,
      description: "Permet l'enregistrement de la naissance.",
    },
  });

  await prisma.step.create({
    data: {
      title: "Obtenir un certificat de non-inscription",
      processId: suppletiveJudgmentProcess.id,
      administrativeBodyId: mairie.id,
      description: "Pièce obligatoire du dossier de jugement supplétif.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Obtenir un certificat d'âge apparent",
      processId: suppletiveJudgmentProcess.id,
      description: "Certificat médical requis si la date exacte est inconnue.",
    },
  });
  const suppletiveTribunalStep = await prisma.step.create({
    data: {
      title: "Déposer la requête en jugement supplétif",
      processId: suppletiveJudgmentProcess.id,
      administrativeBodyId: tribunal.id,
      documents: { connect: [{ id: suppletiveRequestForm.id }] },
      description:
        "Devant le Tribunal de Première Instance du ressort du centre d'état civil.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Assister à l'audience et obtenir le jugement",
      processId: suppletiveJudgmentProcess.id,
      administrativeBodyId: tribunal.id,
      description: "Le tribunal rend le jugement supplétif.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Faire transcrire le jugement à la mairie",
      processId: suppletiveJudgmentProcess.id,
      administrativeBodyId: mairie.id,
      description: "Transcription dans les registres d'état civil.",
    },
  });

  await prisma.step.create({
    data: {
      title:
        "Se présenter au centre d'état civil avec les références de l'acte",
      processId: birthCopyProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: birthCopyRequestForm.id }] },
      description: "Nom, date de naissance, numéro d'acte si possible.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Payer les frais de timbre et retirer la copie",
      processId: birthCopyProcess.id,
      administrativeBodyId: mairie.id,
      description: "Timbre fiscal et communal réglés à la mairie.",
    },
  });

  await prisma.step.create({
    data: {
      title: "Constituer le dossier de demande de rectification",
      processId: birthRectificationProcess.id,
      documents: { connect: [{ id: rectificationRequestForm.id }] },
      description: "Identité du requérant, filiation, motifs détaillés.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Déposer la requête devant le Tribunal de Première Instance",
      processId: birthRectificationProcess.id,
      administrativeBodyId: tribunal.id,
      description: "Juridiction du ressort du centre d'état civil concerné.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Faire transcrire la mention rectificative",
      processId: birthRectificationProcess.id,
      administrativeBodyId: mairie.id,
      description: "Une fois le jugement de rectification obtenu.",
    },
  });

  await addLocationQuestion(birthProcedure.id, birthQuestion.id);

  console.log("✅ 1.1 Acte de naissance");

  // --- 1.2 Acte de mariage ---
  // Sources : Ordonnance n°81/02, articles 48 (lieu de célébration), 53-54
  // (publication des bans, un mois avant). Confiance : forte.

  const marriageProcedure = await prisma.procedure.create({
    data: {
      title: "Acte de mariage",
      description:
        "Démarche de célébration d'un mariage civil, ou d'obtention d'une copie d'un acte de mariage déjà célébré.",
      image: img("acte-mariage"),
      legalBasis:
        "Ordonnance n°81/02 du 29 juin 1981 portant organisation de l'état civil, articles 48, 53 et 54 (célébration et publication des bans).",
      categoryId: civilStatusCategory.id,
      isActive: true,
    },
  });

  const marriageCelebrationProcess = await prisma.process.create({
    data: {
      title: "Célébration d'un mariage civil",
      description:
        "Constitution du dossier, publication des bans un mois avant la date, puis célébration par l'officier d'état civil.",
    },
  });
  const marriageCopyProcess = await prisma.process.create({
    data: {
      title: "Copie d'un acte de mariage existant",
      description:
        "Obtenir un extrait de l'acte de mariage déjà célébré et enregistré.",
    },
  });

  const marriageFileForm = await prisma.document.create({
    data: {
      name: "Fiche de constitution du dossier de mariage",
      price: 1000,
      customizable: true,
      legalWarning:
        "Aide à rassembler les pièces (certificat de célibat, certificat de domicile...) ; ne remplace aucune pièce officielle.",
    },
  });
  const marriageCopyForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande de copie d'acte de mariage",
      price: 500,
      customizable: true,
    },
  });

  const marriageQuestion = await prisma.question.create({
    data: {
      title: "Quelle est votre situation concernant l'acte de mariage ?",
      procedureId: marriageProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Je souhaite célébrer un mariage civil",
      questionId: marriageQuestion.id,
      processId: marriageCelebrationProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Le mariage a déjà été célébré, je veux une copie de l'acte",
      questionId: marriageQuestion.id,
      processId: marriageCopyProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Constituer le dossier de mariage",
      processId: marriageCelebrationProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: marriageFileForm.id }] },
      description:
        "Pièces d'identité des futurs époux, certificat de célibat, certificat de domicile.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Déposer la déclaration et attendre la publication des bans",
      processId: marriageCelebrationProcess.id,
      administrativeBodyId: mairie.id,
      description:
        "Un mois au moins avant la célébration, affichage au centre d'état civil (article 53-54).",
    },
  });
  await prisma.step.create({
    data: {
      title: "Assister à la célébration et recevoir le livret de famille",
      processId: marriageCelebrationProcess.id,
      administrativeBodyId: mairie.id,
      description: "En présence de deux témoins majeurs au moins.",
    },
  });

  await prisma.step.create({
    data: {
      title: "Se présenter à la mairie où le mariage a été célébré",
      processId: marriageCopyProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: marriageCopyForm.id }] },
      description:
        "Munissez-vous d'une pièce d'identité et du livret de famille.",
    },
  });

  await addLocationQuestion(marriageProcedure.id, marriageQuestion.id);

  console.log("✅ 1.2 Acte de mariage");

  // --- 1.3 Acte de décès ---
  // Source : Ordonnance n°81/02, article 78 ; pratique administrative
  // actuelle des mairies (délai de 90 jours). Confiance : forte sur le
  // principe, le délai exact variant selon les sources secondaires.

  const deathProcedure = await prisma.procedure.create({
    data: {
      title: "Acte de décès",
      description:
        "Démarche de déclaration d'un décès, ou d'obtention d'une copie d'un acte de décès déjà établi.",
      image: img("acte-deces"),
      legalBasis:
        "Ordonnance n°81/02 du 29 juin 1981 portant organisation de l'état civil, article 78 (déclaration par le chef de famille ou un proche, dans un délai de 90 jours selon la pratique administrative actuelle des centres d'état civil).",
      categoryId: civilStatusCategory.id,
      isActive: true,
    },
  });

  const deathDeclarationProcess = await prisma.process.create({
    data: {
      title: "Déclaration de décès",
      description:
        "Déclaration auprès de l'officier d'état civil du lieu de survenance, d'inhumation, de résidence ou de naissance du défunt.",
    },
  });
  const deathCopyProcess = await prisma.process.create({
    data: {
      title: "Copie d'un acte de décès existant",
      description: "Obtenir une copie d'un acte de décès déjà enregistré.",
    },
  });

  const deathDeclarationForm = await prisma.document.create({
    data: {
      name: "Fiche de déclaration de décès pré-remplie",
      price: 500,
      customizable: true,
      legalWarning:
        "Le certificat du genre de mort doit être obtenu séparément auprès d'un médecin ou de l'autorité compétente.",
    },
  });
  const deathCopyForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande de copie d'acte de décès",
      price: 500,
      customizable: true,
    },
  });

  const deathQuestion = await prisma.question.create({
    data: {
      title: "Quelle est votre situation concernant l'acte de décès ?",
      procedureId: deathProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Je dois déclarer un décès récent",
      questionId: deathQuestion.id,
      processId: deathDeclarationProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Le décès est déjà enregistré, je veux une copie de l'acte",
      questionId: deathQuestion.id,
      processId: deathCopyProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Obtenir un certificat du genre de mort",
      processId: deathDeclarationProcess.id,
      description:
        "Délivré par un médecin ou, en établissement hospitalier, par le chef d'établissement.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Déclarer le décès au centre d'état civil compétent",
      processId: deathDeclarationProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: deathDeclarationForm.id }] },
      description:
        "Dans les meilleurs délais, par le chef de famille ou un proche.",
    },
  });

  await prisma.step.create({
    data: {
      title: "Se présenter à la mairie où le décès a été enregistré",
      processId: deathCopyProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: deathCopyForm.id }] },
      description:
        "Présentez le formulaire de demande pour obtenir une copie de l'acte de décès.",
    },
  });

  await addLocationQuestion(deathProcedure.id, deathQuestion.id);

  console.log("✅ 1.3 Acte de décès");

  // --- 1.4 Reconnaissance d'un enfant né hors mariage ---
  // Source : Ordonnance n°81/02, articles 41, 43, 44. Confiance : forte.

  const recognitionProcedure = await prisma.procedure.create({
    data: {
      title: "Reconnaissance d'un enfant né hors mariage",
      description:
        "Identifie la voie applicable selon que la reconnaissance intervient au moment de la déclaration de naissance ou après.",
      image: img("reconnaissance-enfant"),
      legalBasis:
        "Ordonnance n°81/02 du 29 juin 1981 portant organisation de l'état civil, articles 41, 43 et 44.",
      categoryId: civilStatusCategory.id,
      isActive: true,
    },
  });

  const adminRecognitionProcess = await prisma.process.create({
    data: {
      title:
        "Reconnaissance administrative au moment de la déclaration de naissance",
      description:
        "Déclaration du père prétendu reçue par l'officier d'état civil, après consentement de la mère et en présence de deux témoins (article 44).",
    },
  });
  const judicialRecognitionProcess = await prisma.process.create({
    data: {
      title: "Reconnaissance judiciaire après la déclaration de naissance",
      description:
        "Lorsque la reconnaissance n'est pas intervenue à la déclaration de naissance, elle s'effectue par jugement devant le Tribunal compétent (article 41).",
    },
  });

  const recognitionDeclarationForm = await prisma.document.create({
    data: {
      name: "Fiche de déclaration de reconnaissance (devant l'officier d'état civil)",
      price: 500,
      customizable: true,
    },
  });
  const recognitionRequestForm = await prisma.document.create({
    data: {
      name: "Modèle de requête en reconnaissance judiciaire",
      price: 2000,
      customizable: true,
      legalWarning:
        "Aide à la rédaction, ne garantit pas l'issue devant le tribunal.",
    },
  });

  const recognitionQuestion = await prisma.question.create({
    data: {
      title: "À quel moment souhaitez-vous reconnaître l'enfant ?",
      procedureId: recognitionProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Au moment de la déclaration de naissance",
      questionId: recognitionQuestion.id,
      processId: adminRecognitionProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Après la déclaration de naissance",
      questionId: recognitionQuestion.id,
      processId: judicialRecognitionProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Obtenir le consentement de la mère",
      processId: adminRecognitionProcess.id,
      description:
        "Le consentement est donné verbalement devant l'officier d'état civil ou par écrit légalisé.",
    },
  });
  await prisma.step.create({
    data: {
      title:
        "Faire la déclaration devant l'officier d'état civil avec deux témoins",
      processId: adminRecognitionProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: recognitionDeclarationForm.id }] },
      description:
        "Présentez la déclaration à l'officier d'état civil avec les deux témoins requis.",
    },
  });

  await prisma.step.create({
    data: {
      title: "Constituer le dossier de requête en reconnaissance",
      processId: judicialRecognitionProcess.id,
      documents: { connect: [{ id: recognitionRequestForm.id }] },
      description:
        "Réunissez les pièces justificatives nécessaires à la demande judiciaire.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Déposer la requête devant le Tribunal de Première Instance",
      processId: judicialRecognitionProcess.id,
      administrativeBodyId: tribunal.id,
      description: "Déposez la requête auprès du greffe du tribunal compétent.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Faire transcrire le jugement à la mairie",
      processId: judicialRecognitionProcess.id,
      administrativeBodyId: mairie.id,
      description:
        "Faites inscrire le jugement dans les registres d'état civil.",
    },
  });

  await addLocationQuestion(recognitionProcedure.id, recognitionQuestion.id);

  console.log("✅ 1.4 Reconnaissance d'enfant");

  // --- 1.5 Transcription d'un acte d'état civil établi hors du Cameroun ---
  // Source : Ordonnance n°81/02, article 4 (délai de 6 mois à compter du
  // retour au Cameroun). Confiance : forte.

  const transcriptionProcedure = await prisma.procedure.create({
    data: {
      title: "Transcription d'un acte d'état civil établi hors du Cameroun",
      description:
        "Démarche permettant de faire transcrire, dans les registres camerounais, un acte de naissance, de mariage ou de décès dressé à l'étranger.",
      image: img("transcription-acte"),
      legalBasis:
        "Ordonnance n°81/02 du 29 juin 1981 portant organisation de l'état civil, article 4 : délai de six mois à compter du retour au Cameroun pour faire transcrire un acte établi à l'étranger.",
      categoryId: civilStatusCategory.id,
      isActive: true,
    },
  });

  const transcriptionProcess = await prisma.process.create({
    data: {
      title: "Transcription d'un acte étranger",
      description:
        "Transcription de l'acte étranger dans les registres d'état civil camerounais, dans les six mois suivant le retour au Cameroun (article 4).",
    },
  });

  const transcriptionForm = await prisma.document.create({
    data: {
      name: "Fiche de demande de transcription d'acte",
      price: 1000,
      customizable: true,
      legalWarning:
        "L'acte étranger doit généralement être légalisé avant transcription.",
    },
  });

  const transcriptionQuestion = await prisma.question.create({
    data: {
      title: "Quel type d'acte souhaitez-vous faire transcrire ?",
      procedureId: transcriptionProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Un acte de naissance établi à l'étranger",
      questionId: transcriptionQuestion.id,
      processId: transcriptionProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Un acte de mariage ou de décès établi à l'étranger",
      questionId: transcriptionQuestion.id,
      processId: transcriptionProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Faire légaliser l'acte étranger",
      processId: transcriptionProcess.id,
      description:
        "Légalisation préalable généralement requise avant toute transcription.",
    },
  });
  await prisma.step.create({
    data: {
      title:
        "Déposer la demande de transcription au centre d'état civil de résidence",
      processId: transcriptionProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: transcriptionForm.id }] },
      description:
        "Dans les six mois suivant le retour au Cameroun (article 4).",
    },
  });

  await addLocationQuestion(
    transcriptionProcedure.id,
    transcriptionQuestion.id,
  );

  console.log(
    "✅ 1.5 Transcription d'acte étranger — Catégorie État civil complète",
  );

  // ============================================================
  // CATÉGORIE 2 — IDENTITÉ (5 procédures)
  // ============================================================

  // --- 2.1 Carte Nationale d'Identité ---
  const identityProcedure = await prisma.procedure.create({
    data: {
      title: "Carte Nationale d'Identité",
      description:
        "Première demande, première demande tardive, renouvellement, ou perte/vol de la CNI.",
      image: img("carte-identite"),
      legalBasis:
        "Décret présidentiel du 4 août 2016 fixant les caractéristiques et modalités d'établissement et de délivrance de la CNI ; décret portant régime des titres identitaires (demande tardive = première demande après 30 ans).",
      categoryId: identityCategory.id,
      isActive: true,
    },
  });

  const firstRequestProcess = await prisma.process.create({
    data: {
      title: "Première demande de Carte Nationale d'Identité",
      description: "Pour un citoyen n'ayant jamais possédé de CNI.",
    },
  });
  const lateFirstRequestProcess = await prisma.process.create({
    data: {
      title: "Première demande tardive de Carte Nationale d'Identité",
      description:
        "Première demande introduite après 30 ans, au sens du décret relatif au régime des titres identitaires.",
    },
  });
  const renewalProcess = await prisma.process.create({
    data: {
      title: "Renouvellement de la Carte Nationale d'Identité",
      description:
        "Pour un titulaire possédant déjà une CNI (validité : 10 ans).",
    },
  });
  const lostStolenProcess = await prisma.process.create({
    data: {
      title: "Déclaration de perte ou de vol et nouvelle demande de CNI",
      description: "Nécessite une déclaration préalable auprès de la police.",
    },
  });

  const preEnrollmentForm = await prisma.document.create({
    data: {
      name: "Fiche de pré-enrôlement CNI pré-remplie",
      price: 500,
      customizable: true,
      legalWarning:
        "Le pré-enrôlement officiel s'effectue exclusivement sur idcam.cm.",
    },
  });

  const identityQuestion = await prisma.question.create({
    data: {
      title: "Quelle est votre situation concernant la CNI ?",
      procedureId: identityProcedure.id,
    },
  });
  const identityAgeQuestion = await prisma.question.create({
    data: { title: "Quel est votre âge ?", procedureId: identityProcedure.id },
  });

  await prisma.answerOption.create({
    data: {
      label: "C'est ma première demande",
      questionId: identityQuestion.id,
      nextQuestionId: identityAgeQuestion.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Je dois renouveler ma carte actuelle",
      questionId: identityQuestion.id,
      processId: renewalProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Ma carte a été perdue ou volée",
      questionId: identityQuestion.id,
      processId: lostStolenProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "J'ai moins de 30 ans",
      questionId: identityAgeQuestion.id,
      processId: firstRequestProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "J'ai plus de 30 ans",
      questionId: identityAgeQuestion.id,
      processId: lateFirstRequestProcess.id,
    },
  });

  for (const process of [firstRequestProcess, lateFirstRequestProcess]) {
    await prisma.step.create({
      data: {
        title: "Effectuer le pré-enrôlement en ligne sur idcam.cm",
        processId: process.id,
        documents: { connect: [{ id: preEnrollmentForm.id }] },
        description:
          "Remplissez le formulaire de pré-enrôlement et préparez les pièces demandées.",
      },
    });
    await prisma.step.create({
      data: {
        title: "Se présenter au poste d'enrôlement de la DGSN",
        processId: process.id,
        administrativeBodyId: dgsn.id,
        description:
          "Présentez-vous au centre choisi avec les originaux et les justificatifs requis.",
      },
    });
    await prisma.step.create({
      data: {
        title: "Effectuer l'enrôlement biométrique",
        processId: process.id,
        administrativeBodyId: dgsn.id,
        description:
          "Faites enregistrer votre photo, vos empreintes et votre signature.",
      },
    });
    await prisma.step.create({
      data: {
        title: "Retirer la Carte Nationale d'Identité",
        processId: process.id,
        administrativeBodyId: dgsn.id,
        description:
          "Retirez la carte lorsque le centre vous confirme qu'elle est disponible.",
      },
    });
  }

  await prisma.step.create({
    data: {
      title: "Effectuer le pré-enrôlement en précisant un renouvellement",
      processId: renewalProcess.id,
      documents: { connect: [{ id: preEnrollmentForm.id }] },
      description:
        "Indiquez qu'il s'agit d'un renouvellement et complétez le pré-enrôlement.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Se présenter avec l'ancienne carte",
      processId: renewalProcess.id,
      administrativeBodyId: dgsn.id,
      description:
        "Présentez l'ancienne carte et les pièces demandées au centre d'enrôlement.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Retirer la nouvelle carte",
      processId: renewalProcess.id,
      administrativeBodyId: dgsn.id,
      description: "Retirez la nouvelle carte auprès du centre d'enrôlement.",
    },
  });

  const lossDeclarationStep = await prisma.step.create({
    data: {
      title: "Faire une déclaration de perte ou de vol",
      processId: lostStolenProcess.id,
      administrativeBodyId: commissariat.id,
      description:
        "Signalez la perte ou le vol au commissariat et conservez le récépissé.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Effectuer un nouveau pré-enrôlement",
      processId: lostStolenProcess.id,
      documents: { connect: [{ id: preEnrollmentForm.id }] },
      description:
        "Effectuez un nouveau pré-enrôlement en joignant les justificatifs nécessaires.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Retirer la nouvelle carte avec le récépissé",
      processId: lostStolenProcess.id,
      administrativeBodyId: dgsn.id,
      description:
        "Présentez le récépissé de déclaration pour retirer la nouvelle carte.",
    },
  });

  await addLocationQuestion(identityProcedure.id, identityQuestion.id);

  console.log("✅ 2.1 Carte Nationale d'Identité");

  // --- 2.2 Passeport biométrique ---
  // Source : portail officiel passcam.cm / DGSN. Confiance : forte
  // (procédure et tarif largement documentés par des guides récents 2026).

  const passportProcedure = await prisma.procedure.create({
    data: {
      title: "Passeport biométrique",
      description:
        "Démarche de première demande ou de renouvellement du passeport biométrique camerounais.",
      image: img("passeport"),
      legalBasis:
        "Procédure de pré-enrôlement en ligne via le portail officiel passcam.cm, opéré pour le compte de la Délégation Générale à la Sûreté Nationale (DGSN).",
      categoryId: identityCategory.id,
      isActive: true,
    },
  });

  const passportProcess = await prisma.process.create({
    data: {
      title: "Obtenir un passeport biométrique",
      description:
        "Pré-enrôlement en ligne, puis enrôlement physique (biométrie), puis production et retrait (délai technique d'environ 48 heures une fois le dossier validé).",
    },
  });

  const passportPreEnrollForm = await prisma.document.create({
    data: {
      name: "Fiche de pré-enrôlement passeport pré-remplie",
      price: 500,
      customizable: true,
      legalWarning:
        "Le pré-enrôlement officiel se fait exclusivement sur passcam.cm ou dgsn.cm.",
    },
  });

  const passportQuestion = await prisma.question.create({
    data: {
      title:
        "S'agit-il d'une première demande ou d'un renouvellement de passeport ?",
      procedureId: passportProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Première demande",
      questionId: passportQuestion.id,
      processId: passportProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Renouvellement",
      questionId: passportQuestion.id,
      processId: passportProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Créer un compte et pré-enrôler en ligne sur passcam.cm",
      processId: passportProcess.id,
      documents: { connect: [{ id: passportPreEnrollForm.id }] },
      description:
        "Remplir le formulaire numérique et payer le droit de timbre en ligne.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Se présenter au centre d'enrôlement avec les documents originaux",
      processId: passportProcess.id,
      administrativeBodyId: dgsn.id,
      description:
        "CNI, acte de naissance, certificat de nationalité, ancien passeport le cas échéant.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Capture biométrique (photo, empreintes, signature)",
      processId: passportProcess.id,
      administrativeBodyId: dgsn.id,
      description:
        "Faites enregistrer votre photo, vos empreintes et votre signature au centre.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Retirer le passeport au centre indiqué",
      processId: passportProcess.id,
      administrativeBodyId: dgsn.id,
      description:
        "Délai technique d'environ 48 heures après validation du dossier par la DGSN.",
    },
  });

  await addLocationQuestion(passportProcedure.id, passportQuestion.id);

  console.log("✅ 2.2 Passeport biométrique");

  // --- 2.3 Permis de Conduire International (PCI) ---
  // Source : Campost / délégations MINT. Confiance : moyenne (procédure
  // documentée par des guides pratiques récents, pas de décret identifié
  // avec certitude).

  const pciProcedure = await prisma.procedure.create({
    data: {
      title: "Permis de Conduire International",
      description:
        "Démarche d'obtention du Permis de Conduire International (PCI) à partir d'un permis camerounais existant.",
      image: img("permis-conduire-international"),
      legalBasis:
        "Délivré par Campost ou les délégations du Ministère des Transports (MINT), sur présentation du permis national. Confiance moyenne : procédure documentée par des guides pratiques récents, numéro de décret non confirmé avec certitude dans les sources consultées.",
      categoryId: identityCategory.id,
      isActive: true,
    },
  });

  const pciProcess = await prisma.process.create({
    data: {
      title: "Obtenir un Permis de Conduire International",
      description:
        "Démarche à partir d'un permis de conduire camerounais en cours de validité.",
    },
  });

  const pciForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande de Permis de Conduire International",
      price: 500,
      customizable: true,
    },
  });

  const pciQuestion = await prisma.question.create({
    data: {
      title:
        "Possédez-vous déjà un permis de conduire camerounais en cours de validité ?",
      procedureId: pciProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Oui",
      questionId: pciQuestion.id,
      processId: pciProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Non, je dois d'abord obtenir mon permis national",
      questionId: pciQuestion.id,
      processId: pciProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Constituer le dossier (permis original + copie, CNI, 2 photos)",
      processId: pciProcess.id,
      documents: { connect: [{ id: pciForm.id }] },
      description:
        "Rassemblez le permis camerounais, sa copie, votre CNI et deux photos.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Déposer le dossier à Campost ou à la délégation MINT",
      processId: pciProcess.id,
      administrativeBodyId: campost.id,
      description: "Délai indicatif de 7 à 15 jours ouvrés.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Retirer le Permis de Conduire International",
      processId: pciProcess.id,
      administrativeBodyId: campost.id,
      description: "Validité de 3 ans à compter de l'émission.",
    },
  });

  await addLocationQuestion(pciProcedure.id, pciQuestion.id);

  console.log("✅ 2.3 Permis de Conduire International");

  // --- 2.4 Numéro d'Identifiant Unique (NIU) ---
  // Source : teledeclaration-dgi.cm, DGI. Confiance : forte.

  const niuProcedure = await prisma.procedure.create({
    data: {
      title: "Numéro d'Identifiant Unique (NIU)",
      description:
        "Démarche d'immatriculation fiscale auprès de la Direction Générale des Impôts pour obtenir un NIU.",
      image: img("niu"),
      legalBasis:
        "Immatriculation en ligne sur la plateforme officielle de la Direction Générale des Impôts (teledeclaration-dgi.cm), obligatoire pour toute transaction économique majeure.",
      categoryId: identityCategory.id,
      isActive: true,
    },
  });

  const niuProcess = await prisma.process.create({
    data: {
      title: "Obtenir un Numéro d'Identifiant Unique",
      description:
        "Immatriculation en ligne auprès de la DGI, pour un contribuable non professionnel ou professionnel.",
    },
  });

  const niuForm = await prisma.document.create({
    data: {
      name: "Fiche d'immatriculation NIU pré-remplie",
      price: 500,
      customizable: true,
      legalWarning:
        "L'immatriculation officielle se fait exclusivement sur teledeclaration-dgi.cm.",
    },
  });

  const niuQuestion = await prisma.question.create({
    data: {
      title: "À quel titre demandez-vous votre NIU ?",
      procedureId: niuProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Contribuable non professionnel (particulier)",
      questionId: niuQuestion.id,
      processId: niuProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Contribuable professionnel (activité commerciale)",
      questionId: niuQuestion.id,
      processId: niuProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Accéder à la plateforme de télédéclaration de la DGI",
      processId: niuProcess.id,
      documents: { connect: [{ id: niuForm.id }] },
      description: "Rubrique « je ne suis pas encore immatriculé(e) ».",
    },
  });
  await prisma.step.create({
    data: {
      title: "Renseigner les informations d'identification et valider",
      processId: niuProcess.id,
      administrativeBodyId: dgi.id,
      description: "État civil, adresse, et activité pour les professionnels.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Télécharger l'attestation d'immatriculation",
      processId: niuProcess.id,
      administrativeBodyId: dgi.id,
      description: "Le NIU est généré automatiquement après validation.",
    },
  });

  await addLocationQuestion(niuProcedure.id, niuQuestion.id);

  console.log("✅ 2.4 NIU");

  // --- 2.5 Certificat de nationalité camerounaise ---
  // Source : procédure devant le Tribunal de Première Instance. Confiance : forte.

  const nationalityProcedure = await prisma.procedure.create({
    data: {
      title: "Certificat de nationalité camerounaise",
      description:
        "Démarche d'obtention du certificat attestant de la nationalité camerounaise, auprès du Tribunal de Première Instance.",
      image: img("certificat-nationalite"),
      legalBasis:
        "Demande déposée auprès du Tribunal de Première Instance du lieu de naissance ou de résidence du demandeur ; certificat signé par le président du tribunal après examen du dossier.",
      categoryId: identityCategory.id,
      isActive: true,
    },
  });

  const nationalityProcess = await prisma.process.create({
    data: {
      title: "Obtenir un certificat de nationalité camerounaise",
      description:
        "Pour toute personne née de parents camerounais ou ayant acquis la nationalité camerounaise.",
    },
  });

  const nationalityForm = await prisma.document.create({
    data: {
      name: "Modèle de demande manuscrite de certificat de nationalité",
      price: 1000,
      customizable: true,
      legalWarning:
        "Le certificat reste délivré exclusivement par le président du tribunal après examen du dossier.",
    },
  });

  const nationalityQuestion = await prisma.question.create({
    data: {
      title: "Sur quelle base demandez-vous le certificat de nationalité ?",
      procedureId: nationalityProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Je suis né(e) de parents camerounais",
      questionId: nationalityQuestion.id,
      processId: nationalityProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "J'ai acquis la nationalité (naturalisation, mariage, autre)",
      questionId: nationalityQuestion.id,
      processId: nationalityProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title:
        "Constituer le dossier (acte de naissance, CNI des parents, timbre fiscal)",
      processId: nationalityProcess.id,
      documents: { connect: [{ id: nationalityForm.id }] },
      description:
        "Préparez les justificatifs d'identité et le timbre fiscal demandés.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Déposer la demande manuscrite au Tribunal de Première Instance",
      processId: nationalityProcess.id,
      administrativeBodyId: tribunal.id,
      description: "Lieu de naissance ou de résidence du demandeur.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Retirer le certificat signé par le président du tribunal",
      processId: nationalityProcess.id,
      administrativeBodyId: tribunal.id,
      description:
        "Retirez le certificat auprès du tribunal après validation de la demande.",
    },
  });

  await addLocationQuestion(nationalityProcedure.id, nationalityQuestion.id);

  console.log("✅ 2.5 Certificat de nationalité — Catégorie Identité complète");

  // ============================================================
  // CATÉGORIE 3 — RÉSIDENCE ET ADMINISTRATION (5 procédures)
  // ============================================================

  // --- 3.1 Attestation de résidence ---
  const residenceProcedure = await prisma.procedure.create({
    data: {
      title: "Attestation de résidence",
      description:
        "Démarche permettant d'obtenir une attestation de résidence auprès de la mairie de son lieu de résidence.",
      image: img("attestation-residence"),
      legalBasis:
        "Loi n°2019/024 du 24 décembre 2019 portant Code Général des Collectivités Territoriales Décentralisées, relative aux attributions des communes.",
      categoryId: residenceCategory.id,
      isActive: true,
    },
  });

  const residenceCertificateProcess = await prisma.process.create({
    data: {
      title: "Obtenir une attestation de résidence",
      description: "Démarche auprès de la mairie du lieu de résidence.",
    },
  });
  const residenceForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande d'attestation de résidence",
      price: 500,
      customizable: true,
      legalWarning:
        "Le formulaire ne dispense pas du visa usuel du chef de quartier avant présentation à la mairie.",
    },
  });

  const residenceQuestion = await prisma.question.create({
    data: {
      title: "Résidez-vous actuellement dans la commune concernée ?",
      procedureId: residenceProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Oui, j'y réside actuellement",
      questionId: residenceQuestion.id,
      processId: residenceCertificateProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Non, mais j'y ai résidé récemment",
      questionId: residenceQuestion.id,
      processId: residenceCertificateProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Faire viser la demande par le chef de quartier",
      processId: residenceCertificateProcess.id,
      description:
        "Pratique administrative courante avant présentation à la mairie.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Se présenter à la mairie avec une pièce d'identité",
      processId: residenceCertificateProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: residenceForm.id }] },
      description:
        "Déposez le formulaire et présentez une pièce d'identité à la mairie.",
    },
  });

  await addLocationQuestion(residenceProcedure.id, residenceQuestion.id);

  console.log("✅ 3.1 Attestation de résidence");

  // --- 3.2 Certificat d'hébergement ---
  // Source : missions des mairies (pratique administrative documentée,
  // pas de loi numérotée précise identifiée). Confiance : moyenne.

  const hostingProcedure = await prisma.procedure.create({
    data: {
      title: "Certificat d'hébergement",
      description:
        "Démarche permettant d'obtenir un certificat attestant qu'une personne héberge un tiers à son domicile.",
      image: img("certificat-hebergement"),
      legalBasis:
        "Délivré par les mairies camerounaises dans le cadre de leurs missions courantes de service au citoyen. Confiance moyenne : pratique administrative largement documentée, sans loi numérotée précise identifiée pour ce document spécifique.",
      categoryId: residenceCategory.id,
      isActive: true,
    },
  });

  const hostingProcess = await prisma.process.create({
    data: {
      title: "Obtenir un certificat d'hébergement",
      description:
        "L'hébergeant atteste héberger la personne concernée à son domicile.",
    },
  });
  const hostingForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande de certificat d'hébergement",
      price: 500,
      customizable: true,
    },
  });

  const hostingQuestion = await prisma.question.create({
    data: {
      title: "Qui doit figurer comme hébergeant sur le certificat ?",
      procedureId: hostingProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Moi-même, pour héberger un tiers",
      questionId: hostingQuestion.id,
      processId: hostingProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Un proche qui m'héberge",
      questionId: hostingQuestion.id,
      processId: hostingProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Réunir les pièces de l'hébergeant et de l'hébergé",
      processId: hostingProcess.id,
      documents: { connect: [{ id: hostingForm.id }] },
      description:
        "Pièce d'identité de l'hébergeant, justificatif de domicile.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Se présenter à la mairie du lieu d'hébergement",
      processId: hostingProcess.id,
      administrativeBodyId: mairie.id,
      description:
        "Déposez la demande à la mairie de la commune où se trouve le logement.",
    },
  });

  await addLocationQuestion(hostingProcedure.id, hostingQuestion.id);

  console.log("✅ 3.2 Certificat d'hébergement");

  // --- 3.3 Permis de bâtir (permis de construire) ---
  // Source : Loi n°2004/003 du 21 avril 2004, articles 99, 107, 111, 112 ;
  // décret d'application n°2008/0739 (délai de 45 jours). Confiance : forte.

  const buildingPermitProcedure = await prisma.procedure.create({
    data: {
      title: "Permis de bâtir",
      description:
        "Démarche obligatoire avant toute construction, même sans fondation, auprès de la mairie ou de la communauté urbaine compétente.",
      image: img("permis-de-batir"),
      legalBasis:
        "Loi n°2004/003 du 21 avril 2004 régissant l'urbanisme au Cameroun, articles 107, 111 et 112 ; décret n°2008/0739/PM du 23 avril 2008 (délai maximal de 45 jours après dépôt du dossier).",
      categoryId: residenceCategory.id,
      isActive: true,
    },
  });

  const buildingPermitProcess = await prisma.process.create({
    data: {
      title: "Obtenir un permis de bâtir",
      description:
        "Délivré par le maire de la commune concernée (article 107), ou le délégué du gouvernement dans les communautés urbaines.",
    },
  });
  const buildingPermitForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande de permis de bâtir",
      price: 1500,
      customizable: true,
      legalWarning:
        "Le certificat d'urbanisme et les plans d'architecte restent à obtenir séparément.",
    },
  });

  const buildingPermitQuestion = await prisma.question.create({
    data: {
      title: "Votre projet comporte-t-il des fondations ?",
      procedureId: buildingPermitProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Oui",
      questionId: buildingPermitQuestion.id,
      processId: buildingPermitProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Non, mais le permis reste obligatoire (article 107)",
      questionId: buildingPermitQuestion.id,
      processId: buildingPermitProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title:
        "Obtenir un certificat d'urbanisme et un certificat de propriété récent",
      processId: buildingPermitProcess.id,
      administrativeBodyId: mairie.id,
      description: "Le certificat de propriété doit dater de moins de 6 mois.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Faire établir les plans par un architecte agréé",
      processId: buildingPermitProcess.id,
      description:
        "Plans de masse et de situation, conformes à l'article 109 de la loi n°2004/003.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Déposer le dossier au guichet unique de la commune",
      processId: buildingPermitProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: buildingPermitForm.id }] },
      description:
        "Délai maximal de 45 jours pour la réponse de l'administration.",
    },
  });

  await addLocationQuestion(
    buildingPermitProcedure.id,
    buildingPermitQuestion.id,
  );

  console.log("✅ 3.3 Permis de bâtir");

  // --- 3.4 Certificat d'urbanisme ---
  // Source : Loi n°2004/003, article 99. Confiance : forte sur le
  // principe, délais/tarifs variables selon les communes.

  const urbanismCertProcedure = await prisma.procedure.create({
    data: {
      title: "Certificat d'urbanisme",
      description:
        "Document préalable indiquant ce qu'il est possible de construire sur une parcelle donnée.",
      image: img("certificat-urbanisme"),
      legalBasis:
        "Loi n°2004/003 du 21 avril 2004 régissant l'urbanisme au Cameroun, article 99 (actes administratifs relatifs à l'utilisation du sol et à la construction).",
      categoryId: residenceCategory.id,
      isActive: true,
    },
  });

  const urbanismCertProcess = await prisma.process.create({
    data: {
      title: "Obtenir un certificat d'urbanisme",
      description:
        "Indique l'affectation de la zone, les servitudes et reculs applicables à la parcelle.",
    },
  });
  const urbanismCertForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande de certificat d'urbanisme",
      price: 1000,
      customizable: true,
    },
  });

  const urbanismCertQuestion = await prisma.question.create({
    data: {
      title: "Pourquoi avez-vous besoin de ce certificat ?",
      procedureId: urbanismCertProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour un futur permis de bâtir",
      questionId: urbanismCertQuestion.id,
      processId: urbanismCertProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour vérifier la constructibilité d'un terrain avant achat",
      questionId: urbanismCertQuestion.id,
      processId: urbanismCertProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Déposer la demande à la mairie ou à la communauté urbaine",
      processId: urbanismCertProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: urbanismCertForm.id }] },
      description: "Plan de localisation de la parcelle à joindre.",
    },
  });

  await addLocationQuestion(urbanismCertProcedure.id, urbanismCertQuestion.id);

  console.log("✅ 3.4 Certificat d'urbanisme");

  // --- 3.5 Déclaration/immatriculation de patente ---
  // Source : fiscalité locale, DGI/CFCE. Confiance : moyenne (principe
  // bien établi, détails procéduraux précis par activité non vérifiés
  // un par un).

  const patenteProcedure = await prisma.procedure.create({
    data: {
      title: "Déclaration de patente",
      description:
        "Démarche d'immatriculation à la contribution des patentes pour l'exercice d'une activité commerciale.",
      image: img("patente"),
      legalBasis:
        "Contribution des patentes relevant de la fiscalité locale (Direction Générale des Impôts). Confiance moyenne : principe bien établi et documenté via les Centres de Formalités de Création d'Entreprises (CFCE), détails procéduraux précis non vérifiés activité par activité.",
      categoryId: residenceCategory.id,
      isActive: true,
    },
  });

  const patenteProcess = await prisma.process.create({
    data: {
      title: "Obtenir sa patente",
      description:
        "Immatriculation auprès du Centre des Impôts, généralement en même temps que le NIU lors de la création d'une activité.",
    },
  });
  const patenteForm = await prisma.document.create({
    data: {
      name: "Fiche de déclaration d'activité commerciale",
      price: 1000,
      customizable: true,
    },
  });

  const patenteQuestion = await prisma.question.create({
    data: {
      title: "Avez-vous déjà un Numéro d'Identifiant Unique (NIU) ?",
      procedureId: patenteProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Oui, je l'ai déjà",
      questionId: patenteQuestion.id,
      processId: patenteProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Non, pas encore",
      questionId: patenteQuestion.id,
      processId: patenteProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title:
        "Déclarer l'activité et obtenir le NIU professionnel si nécessaire",
      processId: patenteProcess.id,
      administrativeBodyId: dgi.id,
      documents: { connect: [{ id: patenteForm.id }] },
      description:
        "Déclarez votre activité auprès du centre des impôts et obtenez un NIU si nécessaire.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Payer la contribution des patentes correspondant à l'activité",
      processId: patenteProcess.id,
      administrativeBodyId: dgi.id,
      description:
        "Montant fonction de la valeur locative des locaux professionnels.",
    },
  });

  await addLocationQuestion(patenteProcedure.id, patenteQuestion.id);

  console.log(
    "✅ 3.5 Patente — Catégorie Résidence et administration complète",
  );

  // ============================================================
  // CATÉGORIE 4 — ACADÉMIQUE (5 procédures)
  // ============================================================
  // Source pour les 5 procédures : formulaire officiel MINESUP "DCAA"
  // (Direction des Certifications, Accréditations et Authentifications) —
  // demande de certification/authentification, duplicata, correction,
  // attestation de réussite. Confiance : forte (formulaire officiel
  // identifié, listant précisément ces catégories de demande).

  const academicForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande MINESUP pré-rempli",
      price: 1000,
      customizable: true,
      legalWarning:
        "Le formulaire officiel (DCAA) reste à faire valider par le MINESUP ou l'établissement concerné.",
    },
  });
  const lossDeclarationForm = await prisma.document.create({
    data: {
      name: "Déclaration de perte pré-remplie (pour duplicata)",
      price: 500,
      customizable: true,
    },
  });

  const minesupLegalBasis =
    "Formulaire officiel de demande du MINESUP (Direction des Certifications, Accréditations et Authentifications).";

  // --- 4.1 Certification d'un relevé de notes ---
  const transcriptCertProcedure = await prisma.procedure.create({
    data: {
      title: "Certification d'un relevé de notes",
      description:
        "Démarche permettant de faire certifier ou authentifier un relevé de notes existant auprès du MINESUP.",
      image: img("certification-releve-notes"),
      legalBasis: minesupLegalBasis,
      categoryId: academicCategory.id,
      isActive: true,
    },
  });
  const transcriptCertProcess = await prisma.process.create({
    data: {
      title: "Certifier un relevé de notes",
      description:
        "Confirme l'authenticité du document auprès d'un tiers (employeur, établissement étranger).",
    },
  });
  const transcriptCertQuestion = await prisma.question.create({
    data: {
      title: "Pour quel usage le relevé de notes doit-il être certifié ?",
      procedureId: transcriptCertProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour une inscription ou candidature au Cameroun",
      questionId: transcriptCertQuestion.id,
      processId: transcriptCertProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour une candidature à l'étranger",
      questionId: transcriptCertQuestion.id,
      processId: transcriptCertProcess.id,
    },
  });
  await prisma.step.create({
    data: {
      title: "Réunir la photocopie certifiée conforme du relevé et de la CNI",
      processId: transcriptCertProcess.id,
      documents: { connect: [{ id: academicForm.id }] },
      description:
        "Préparez une copie certifiée du relevé ainsi qu'une copie de votre CNI.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Déposer la demande auprès du MINESUP ou de l'établissement",
      processId: transcriptCertProcess.id,
      administrativeBodyId: minesup.id,
      description:
        "Déposez le formulaire et les pièces auprès du MINESUP ou de l'établissement concerné.",
    },
  });
  await addLocationQuestion(
    transcriptCertProcedure.id,
    transcriptCertQuestion.id,
  );
  console.log("✅ 4.1 Certification d'un relevé de notes");

  // --- 4.2 Certification d'un diplôme ---
  const diplomaCertProcedure = await prisma.procedure.create({
    data: {
      title: "Certification d'un diplôme",
      description:
        "Démarche permettant de faire certifier ou authentifier un diplôme existant auprès du MINESUP.",
      image: img("certification-diplome"),
      legalBasis: minesupLegalBasis,
      categoryId: academicCategory.id,
      isActive: true,
    },
  });
  const diplomaCertProcess = await prisma.process.create({
    data: {
      title: "Certifier un diplôme",
      description: "Confirme l'authenticité du diplôme auprès d'un tiers.",
    },
  });
  const diplomaCertQuestion = await prisma.question.create({
    data: {
      title: "Pour quel usage le diplôme doit-il être certifié ?",
      procedureId: diplomaCertProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour un emploi ou un concours",
      questionId: diplomaCertQuestion.id,
      processId: diplomaCertProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour une candidature à l'étranger",
      questionId: diplomaCertQuestion.id,
      processId: diplomaCertProcess.id,
    },
  });
  await prisma.step.create({
    data: {
      title: "Réunir la photocopie certifiée conforme du diplôme et de la CNI",
      processId: diplomaCertProcess.id,
      documents: { connect: [{ id: academicForm.id }] },
      description:
        "Préparez une copie certifiée du diplôme et une copie de votre CNI.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Déposer la demande auprès du MINESUP ou de l'établissement",
      processId: diplomaCertProcess.id,
      administrativeBodyId: minesup.id,
      description:
        "Déposez le formulaire et les pièces auprès du MINESUP ou de l'établissement concerné.",
    },
  });
  await addLocationQuestion(diplomaCertProcedure.id, diplomaCertQuestion.id);
  console.log("✅ 4.2 Certification d'un diplôme");

  // --- 4.3 Duplicata d'un diplôme ou relevé de notes ---
  const duplicateProcedure = await prisma.procedure.create({
    data: {
      title: "Duplicata d'un diplôme ou relevé de notes",
      description:
        "Démarche de délivrance d'un duplicata en cas de perte ou de détérioration du document original.",
      image: img("duplicata-diplome"),
      legalBasis: minesupLegalBasis,
      categoryId: academicCategory.id,
      isActive: true,
    },
  });
  const duplicateProcess = await prisma.process.create({
    data: {
      title: "Obtenir un duplicata",
      description:
        "Délivrance d'un duplicata en cas de perte du document original.",
    },
  });
  const duplicateQuestion = await prisma.question.create({
    data: {
      title: "Quel document a été perdu ?",
      procedureId: duplicateProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Un diplôme",
      questionId: duplicateQuestion.id,
      processId: duplicateProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Un relevé de notes",
      questionId: duplicateQuestion.id,
      processId: duplicateProcess.id,
    },
  });
  await prisma.step.create({
    data: {
      title: "Faire une déclaration de perte",
      processId: duplicateProcess.id,
      administrativeBodyId: commissariat.id,
      documents: { connect: [{ id: lossDeclarationForm.id }] },
      description:
        "Déclarez la perte au commissariat et conservez le récépissé pour le dossier.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Déposer la demande de duplicata au MINESUP",
      processId: duplicateProcess.id,
      administrativeBodyId: minesup.id,
      documents: { connect: [{ id: academicForm.id }] },
      description:
        "Déposez le formulaire et le récépissé de perte auprès du MINESUP.",
    },
  });
  await addLocationQuestion(duplicateProcedure.id, duplicateQuestion.id);
  console.log("✅ 4.3 Duplicata de diplôme/relevé");

  // --- 4.4 Correction d'un diplôme ou relevé de notes ---
  const correctionProcedure = await prisma.procedure.create({
    data: {
      title: "Correction d'un diplôme ou relevé de notes",
      description:
        "Démarche de correction d'une erreur matérielle figurant sur un diplôme ou un relevé de notes délivré.",
      image: img("correction-diplome"),
      legalBasis: minesupLegalBasis,
      categoryId: academicCategory.id,
      isActive: true,
    },
  });
  const correctionProcess = await prisma.process.create({
    data: {
      title: "Faire corriger le document",
      description: "Correction d'une erreur figurant sur le document délivré.",
    },
  });
  const correctionQuestion = await prisma.question.create({
    data: {
      title: "Quel type d'erreur souhaitez-vous faire corriger ?",
      procedureId: correctionProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Une erreur sur l'état civil (nom, date de naissance...)",
      questionId: correctionQuestion.id,
      processId: correctionProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Une erreur sur les résultats ou la mention",
      questionId: correctionQuestion.id,
      processId: correctionProcess.id,
    },
  });
  await prisma.step.create({
    data: {
      title: "Joindre l'original du document à corriger et préciser l'erreur",
      processId: correctionProcess.id,
      documents: { connect: [{ id: academicForm.id }] },
      description:
        "Identifiez précisément l'erreur et joignez le document original au dossier.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Déposer la demande de correction au MINESUP",
      processId: correctionProcess.id,
      administrativeBodyId: minesup.id,
      description:
        "Déposez le dossier complet au MINESUP ou auprès de l'établissement émetteur.",
    },
  });
  await addLocationQuestion(correctionProcedure.id, correctionQuestion.id);
  console.log("✅ 4.4 Correction de diplôme/relevé");

  // --- 4.5 Attestation de réussite (diplôme non encore édité) ---
  const successCertProcedure = await prisma.procedure.create({
    data: {
      title: "Attestation de réussite",
      description:
        "Démarche d'obtention d'une attestation de réussite lorsque le diplôme officiel n'est pas encore disponible.",
      image: img("attestation-reussite"),
      legalBasis: minesupLegalBasis,
      categoryId: academicCategory.id,
      isActive: true,
    },
  });
  const successCertProcess = await prisma.process.create({
    data: {
      title: "Obtenir une attestation de réussite",
      description:
        "Délivrée lorsque le diplôme officiel n'est pas encore disponible.",
    },
  });
  const successCertQuestion = await prisma.question.create({
    data: {
      title: "Pourquoi avez-vous besoin de cette attestation ?",
      procedureId: successCertProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Le diplôme officiel n'est pas encore édité",
      questionId: successCertQuestion.id,
      processId: successCertProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "J'ai besoin d'un justificatif en attendant le diplôme",
      questionId: successCertQuestion.id,
      processId: successCertProcess.id,
    },
  });
  await prisma.step.create({
    data: {
      title: "Déposer la demande d'attestation de réussite",
      processId: successCertProcess.id,
      administrativeBodyId: minesup.id,
      documents: { connect: [{ id: academicForm.id }] },
      description:
        "Déposez le formulaire auprès du MINESUP ou de l'établissement concerné.",
    },
  });
  await addLocationQuestion(successCertProcedure.id, successCertQuestion.id);
  console.log(
    "✅ 4.5 Attestation de réussite — Catégorie Académique complète (5 procédures)",
  );

  // ============================================================
  // CATÉGORIE 5 — JUSTICE ET FORMALITÉS LÉGALES (5 procédures)
  // ============================================================

  // --- 5.1 Extrait de casier judiciaire (Bulletin n°3) ---
  // Source : Code de Procédure Pénale, articles 573 à 583. Confiance : forte.

  const criminalRecordProcedure = await prisma.procedure.create({
    data: {
      title: "Extrait de casier judiciaire (Bulletin n°3)",
      description:
        "Démarche d'obtention de l'extrait de casier judiciaire, souvent exigé pour un emploi, un concours ou un visa.",
      image: img("casier-judiciaire"),
      legalBasis:
        "Code de Procédure Pénale, articles 573 à 583 ; délivré par le Tribunal de Première Instance du lieu de naissance du demandeur.",
      categoryId: justiceCategory.id,
      isActive: true,
    },
  });

  const criminalRecordProcess = await prisma.process.create({
    data: {
      title: "Obtenir un extrait de casier judiciaire",
      description:
        "Document signé conjointement par le Procureur de la République et le greffier en chef.",
    },
  });
  const criminalRecordForm = await prisma.document.create({
    data: {
      name: "Demande timbrée d'extrait de casier judiciaire pré-remplie",
      price: 500,
      customizable: true,
      legalWarning:
        "Le timbre fiscal et les frais de recherche restent dus directement au tribunal.",
    },
  });

  const criminalRecordQuestion = await prisma.question.create({
    data: {
      title: "Pour quel usage avez-vous besoin de ce document ?",
      procedureId: criminalRecordProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour un emploi ou un concours",
      questionId: criminalRecordQuestion.id,
      processId: criminalRecordProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour une démarche de visa ou à l'étranger",
      questionId: criminalRecordQuestion.id,
      processId: criminalRecordProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Préparer une photocopie d'acte de naissance ou de CNI",
      processId: criminalRecordProcess.id,
      documents: { connect: [{ id: criminalRecordForm.id }] },
      description:
        "Préparez une copie de votre acte de naissance ou de votre CNI avec la demande timbrée.",
    },
  });
  await prisma.step.create({
    data: {
      title:
        "Déposer la demande au greffe du Tribunal de Première Instance du lieu de naissance",
      processId: criminalRecordProcess.id,
      administrativeBodyId: tribunal.id,
      description: "Récépissé de dépôt remis au demandeur.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Retirer l'extrait signé par le Procureur et le greffier en chef",
      processId: criminalRecordProcess.id,
      administrativeBodyId: tribunal.id,
      description:
        "Délai officiel de 24 heures, jusqu'à 72 heures en période d'affluence.",
    },
  });

  await addLocationQuestion(
    criminalRecordProcedure.id,
    criminalRecordQuestion.id,
  );

  console.log("✅ 5.1 Casier judiciaire");

  // --- 5.2 Légalisation de documents (certification conforme) ---
  // Source : pratique administrative courante (mairies/sous-préfectures).
  // Confiance : moyenne (pas de loi numérotée précise identifiée pour cet
  // acte spécifique, mais pratique très largement documentée).

  const legalizationProcedure = await prisma.procedure.create({
    data: {
      title: "Légalisation de documents",
      description:
        "Démarche permettant de faire certifier conforme une copie de document, ou de faire légaliser une signature.",
      image: img("legalisation-documents"),
      legalBasis:
        "Certification conforme et légalisation de signature réalisées par les mairies et sous-préfectures dans le cadre de leurs missions courantes. Confiance moyenne : pratique administrative très largement documentée, sans loi numérotée précise identifiée pour cet acte spécifique.",
      categoryId: justiceCategory.id,
      isActive: true,
    },
  });

  const legalizationProcess = await prisma.process.create({
    data: {
      title: "Faire légaliser un document ou une signature",
      description:
        "Certification conforme d'une copie, ou légalisation d'une signature, pour un usage local ou national.",
    },
  });
  const legalizationForm = await prisma.document.create({
    data: {
      name: "Fiche récapitulative des documents à légaliser",
      price: 500,
      customizable: true,
      legalWarning:
        "Pour un usage à l'étranger, une légalisation complémentaire au MINREX peut être requise, hors périmètre de cette démarche.",
    },
  });

  const legalizationQuestion = await prisma.question.create({
    data: {
      title: "Que souhaitez-vous faire légaliser ?",
      procedureId: legalizationProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Une copie de document (certification conforme)",
      questionId: legalizationQuestion.id,
      processId: legalizationProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Une signature ou une déclaration sur l'honneur",
      questionId: legalizationQuestion.id,
      processId: legalizationProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Préparer l'original et la copie du document",
      processId: legalizationProcess.id,
      documents: { connect: [{ id: legalizationForm.id }] },
      description:
        "Apportez l'original et une copie lisible du document à certifier.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Se présenter à la mairie ou à la sous-préfecture",
      processId: legalizationProcess.id,
      administrativeBodyId: mairie.id,
      description:
        "Certification conforme généralement délivrée immédiatement à 24 heures.",
    },
  });

  await addLocationQuestion(legalizationProcedure.id, legalizationQuestion.id);

  console.log("✅ 5.2 Légalisation de documents");

  // --- 5.3 Certificat de célibat ---
  // Source : pratique des mairies (délivré sur déclaration de deux
  // témoins). Confiance : moyenne.

  const celibacyProcedure = await prisma.procedure.create({
    data: {
      title: "Certificat de célibat",
      description:
        "Démarche permettant d'obtenir un certificat attestant qu'une personne n'est pas mariée, notamment en vue d'un mariage.",
      image: img("certificat-celibat"),
      legalBasis:
        "Délivré par la mairie du lieu de naissance ou de résidence, sur déclaration de l'intéressé appuyée par deux témoins. Confiance moyenne : pratique administrative bien documentée, sans loi numérotée précise identifiée pour ce document spécifique.",
      categoryId: justiceCategory.id,
      isActive: true,
    },
  });

  const celibacyProcess = await prisma.process.create({
    data: {
      title: "Obtenir un certificat de célibat",
      description: "Souvent requis dans le cadre d'un dossier de mariage.",
    },
  });
  const celibacyForm = await prisma.document.create({
    data: {
      name: "Fiche de déclaration de célibat pré-remplie",
      price: 500,
      customizable: true,
    },
  });

  const celibacyQuestion = await prisma.question.create({
    data: {
      title: "Pour quel usage avez-vous besoin de ce certificat ?",
      procedureId: celibacyProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Dans le cadre d'un dossier de mariage",
      questionId: celibacyQuestion.id,
      processId: celibacyProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour une autre démarche administrative",
      questionId: celibacyQuestion.id,
      processId: celibacyProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Réunir deux témoins majeurs munis de leur CNI",
      processId: celibacyProcess.id,
      documents: { connect: [{ id: celibacyForm.id }] },
      description:
        "Demandez à deux témoins majeurs de vous accompagner avec leur CNI.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Se présenter à la mairie du lieu de naissance ou de résidence",
      processId: celibacyProcess.id,
      administrativeBodyId: mairie.id,
      description:
        "Déposez la demande à la mairie compétente avec les deux témoins.",
    },
  });

  await addLocationQuestion(celibacyProcedure.id, celibacyQuestion.id);

  console.log("✅ 5.3 Certificat de célibat");

  // --- 5.4 Déclaration de création d'une association ---
  // Source : Loi n°90/053 du 19 décembre 1990, articles 1, 5, 7, 8. Confiance : forte.

  const associationProcedure = await prisma.procedure.create({
    data: {
      title: "Déclaration de création d'une association",
      description:
        "Démarche de déclaration d'une association à but non lucratif auprès de la préfecture du département de son siège.",
      image: img("creation-association"),
      legalBasis:
        "Loi n°90/053 du 19 décembre 1990 relative à la liberté d'association, articles 1, 5, 7 et 8 : régime de la déclaration, faite par les fondateurs à la préfecture du département du siège.",
      categoryId: justiceCategory.id,
      isActive: true,
    },
  });

  const associationProcess = await prisma.process.create({
    data: {
      title: "Déclarer une association ordinaire",
      description:
        "Les associations ordinaires relèvent du régime de la déclaration (article 5), contrairement aux associations religieuses soumises à autorisation (article 23).",
    },
  });
  const associationForm = await prisma.document.create({
    data: {
      name: "Modèle de lettre de déclaration et de statuts d'association",
      price: 2000,
      customizable: true,
      legalWarning:
        "Les statuts doivent être déposés en deux exemplaires signés par au moins deux dirigeants.",
    },
  });

  const associationQuestion = await prisma.question.create({
    data: {
      title: "Quel type d'association souhaitez-vous créer ?",
      procedureId: associationProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Une association ordinaire (régime de la déclaration)",
      questionId: associationQuestion.id,
      processId: associationProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label:
        "Une association religieuse (régime de l'autorisation — démarche distincte, non couverte ici)",
      questionId: associationQuestion.id,
      processId: associationProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Rédiger les statuts et la lettre de déclaration",
      processId: associationProcess.id,
      documents: { connect: [{ id: associationForm.id }] },
      description:
        "Titre, objet, siège, et identité des dirigeants (article 7).",
    },
  });
  await prisma.step.create({
    data: {
      title:
        "Déposer le dossier timbré à la préfecture du département du siège",
      processId: associationProcess.id,
      administrativeBodyId: prefecture.id,
      description: "Timbre fiscal à apposer sur la lettre de déclaration.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Retirer le récépissé de déclaration",
      processId: associationProcess.id,
      administrativeBodyId: prefecture.id,
      description:
        "Le récépissé confère la personnalité juridique à l'association (article 5).",
    },
  });

  await addLocationQuestion(associationProcedure.id, associationQuestion.id);

  console.log("✅ 5.4 Déclaration de création d'association");

  // --- 5.5 Déclaration de perte ou de vol d'un document administratif ---
  // Source : pratique constante observée en préalable de nombreuses
  // démarches de duplicata (CNI, passeport, diplômes) dans ce même seed.
  // Confiance : moyenne (pratique bien établie, pas de loi unique dédiée).

  const lossProcedure = await prisma.procedure.create({
    data: {
      title: "Déclaration de perte ou de vol d'un document administratif",
      description:
        "Démarche préalable, souvent nécessaire avant d'obtenir un duplicata de CNI, de passeport ou de diplôme.",
      image: img("declaration-perte"),
      legalBasis:
        "Déclaration faite au commissariat de police, pratique administrative constante préalable à la plupart des démarches de duplicata. Confiance moyenne : pas de loi unique dédiée identifiée, mais exigence observée de façon constante dans les procédures de CNI, passeport et diplômes de ce même référentiel.",
      categoryId: justiceCategory.id,
      isActive: true,
    },
  });

  const lossProcess = await prisma.process.create({
    data: {
      title: "Déclarer la perte ou le vol d'un document",
      description:
        "Délivrance d'un récépissé de déclaration, pièce généralement exigée pour toute demande de duplicata.",
    },
  });
  const lossForm = await prisma.document.create({
    data: {
      name: "Fiche de déclaration de perte ou de vol pré-remplie",
      price: 500,
      customizable: true,
    },
  });

  const lossQuestion = await prisma.question.create({
    data: {
      title: "Quel document a été perdu ou volé ?",
      procedureId: lossProcedure.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Une pièce d'identité (CNI, passeport)",
      questionId: lossQuestion.id,
      processId: lossProcess.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Un autre document administratif (diplôme, permis...)",
      questionId: lossQuestion.id,
      processId: lossProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Se présenter au commissariat de police le plus proche",
      processId: lossProcess.id,
      administrativeBodyId: commissariat.id,
      documents: { connect: [{ id: lossForm.id }] },
      description: "Décrire les circonstances de la perte ou du vol.",
    },
  });
  await prisma.step.create({
    data: {
      title: "Conserver le récépissé pour la démarche de duplicata",
      processId: lossProcess.id,
      administrativeBodyId: commissariat.id,
      description:
        "Ce récépissé est généralement exigé par l'administration émettrice du duplicata.",
    },
  });

  await addLocationQuestion(lossProcedure.id, lossQuestion.id);

  console.log("✅ 5.5 Déclaration de perte — Catégorie Justice complète");

  // ============================================================
  // FRAUD ALERTS (mises en garde génériques, sans statistique inventée)
  // ============================================================

  await prisma.fraudAlert.create({
    data: {
      title: "Attention aux intermédiaires non officiels",
      description:
        "Ne versez jamais d'argent à une personne qui prétend pouvoir accélérer ou garantir l'obtention d'une réquisition, d'un jugement supplétif ou d'un titre identitaire en dehors des services officiels.",
      stepId: requisitionStep.id,
    },
  });

  await prisma.fraudAlert.create({
    data: {
      title: "Aucun paiement en dehors des guichets officiels",
      description:
        "Le dépôt d'une requête devant le Tribunal de Première Instance ne nécessite aucun paiement à un tiers en dehors des frais de greffe officiels.",
      stepId: suppletiveTribunalStep.id,
    },
  });

  await prisma.fraudAlert.create({
    data: {
      title: "Le pré-enrôlement CNI est gratuit sur idcam.cm",
      description:
        "Méfiez-vous de toute personne proposant, contre paiement, de réaliser à votre place un pré-enrôlement accessible directement sur idcam.cm (hors droit de timbre officiel).",
      stepId: lossDeclarationStep.id,
    },
  });

  console.log("✅ Fraud alerts created");

  console.log("\n🎉 Seed v2 completed successfully!");
  console.log(
    "📂 5 catégories : État civil, Identité, Résidence et administration, Académique, Justice et formalités légales",
  );
  console.log(
    "📄 25 procédures créées, chacune menant à au moins une démarche précise",
  );
  console.log("📍 4 villes, 8 corps administratifs");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
