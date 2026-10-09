import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

function img(seed: string) {
  return `https://picsum.photos/seed/turtleguide-${seed}/900/600`;
}

// ============================================================
// ZONES DE LOCALISATION COUVERTES PAR LE RÉFÉRENTIEL ACTUEL
// IMPORTANT : le diagnostic ne doit jamais proposer une zone qui n'est
// couverte par aucune unité administrative.
// Les unités créées plus bas desservent uniquement 4 villes-pivots.
// ============================================================
const CAMEROON_REGIONS: Record<string, string[]> = {
  Centre: ["Yaoundé"],
  Littoral: ["Douala"],
  Ouest: ["Bafoussam"],
  "Nord-Ouest": ["Bamenda"],
};

async function main() {
  console.log("🌱 Starting seed v3 (localisation région → ville)...");

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
  // LOCATIONS — uniquement les 4 zones réellement couvertes
  // (la région est stockée dans `address`, faute de champ dédié sur Location)
  // Ces mêmes Location sont réutilisées par les unités administratives.
  // ============================================================

  const coveredLocations: Record<string, { id: string }> = {};
  for (const [region, citiesOfRegion] of Object.entries(CAMEROON_REGIONS)) {
    for (const city of citiesOfRegion) {
      coveredLocations[city] = await prisma.location.create({
        data: { city, address: region },
      });
    }
  }

  console.log("✅ 4 Locations créées : Yaoundé, Douala, Bafoussam, Bamenda");

  // ============================================================
  // ADMINISTRATIVE BODIES (inchangé par rapport à la v2)
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

  // Unités administratives : exactement les 4 villes-pivots couvertes par le diagnostic.
  // IMPORTANT : aucune question de localisation ne doit proposer une autre zone tant
  // qu'aucune unité administrative ne la dessert.
  const hubCities = [
    {
      city: "Yaoundé",
      address: "Centre-ville de Yaoundé",
      latitude: 3.848,
      longitude: 11.5021,
    },
    {
      city: "Douala",
      address: "Centre-ville de Douala",
      latitude: 4.0511,
      longitude: 9.7679,
    },
    {
      city: "Bafoussam",
      address: "Centre administratif de Bafoussam",
      latitude: 5.4781,
      longitude: 10.4176,
    },
    {
      city: "Bamenda",
      address: "Centre administratif de Bamenda",
      latitude: 5.9631,
      longitude: 10.1591,
    },
  ];
  // On réutilise les Location déjà créées pour éviter un second référentiel
  // de localisation identique uniquement pour les unités administratives.
  const hubLocations: Record<string, { id: string }> = coveredLocations;
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
    for (const c of hubCities) {
      const unit = await prisma.administrativeUnit.create({
        data: {
          name: `${label} de ${c.city}`,
          administrativeBodyId: body.id,
          locationId: hubLocations[c.city].id,
        },
      });
      await prisma.areaServed.create({
        data: {
          name: c.city,
          locationId: hubLocations[c.city].id,
          administrativeUnitId: unit.id,
        },
      });
    }
  }

  console.log("✅ Administrative bodies + units (4 zones couvertes) created");

  // ============================================================
  // HELPERS — localisation et questions de contexte
  // ============================================================
  // La localisation est volontairement placée en DERNIÈRE étape : le diagnostic
  // collecte d'abord le contexte nécessaire, puis seulement la zone couverte.
  // ============================================================

  async function buildLocationSubtree(procedureId: string, processId: string) {
    const regionQuestion = await prisma.question.create({
      data: {
        title: "Dans quelle région vous trouvez-vous ?",
        description:
          "Les quatre zones couvertes par les unités administratives actuellement référencées.",
        procedureId,
      },
    });

    const regionOptions: {
      label: string;
      questionId: string;
      nextQuestionId: string;
    }[] = [];

    for (const [region, citiesOfRegion] of Object.entries(CAMEROON_REGIONS)) {
      const cityQuestion = await prisma.question.create({
        data: {
          title: `Dans quelle ville de la région ${region} vous trouvez-vous ?`,
          procedureId,
        },
      });

      regionOptions.push({
        label: region,
        questionId: regionQuestion.id,
        nextQuestionId: cityQuestion.id,
      });

      await prisma.answerOption.createMany({
        data: citiesOfRegion.map((city) => ({
          label: city,
          questionId: cityQuestion.id,
          processId,
        })),
      });
    }

    await prisma.answerOption.createMany({ data: regionOptions });

    return regionQuestion;
  }

  // Construit les questions de contexte puis termine obligatoirement par
  // le sous-arbre de localisation. Chaque option mène à la question suivante
  // et chaque parcours finit donc sur le processId fourni.
  type DiagnosticQuestionSpec = {
    title: string;
    options: string[];
  };

  async function buildProcessContextSubtree(
    procedureId: string,
    processId: string,
    questions: DiagnosticQuestionSpec[],
  ) {
    let nextQuestionId = (await buildLocationSubtree(procedureId, processId))
      .id;

    for (let i = questions.length - 1; i >= 0; i--) {
      const spec = questions[i];
      const question = await prisma.question.create({
        data: { title: spec.title, procedureId },
      });

      await prisma.answerOption.createMany({
        data: spec.options.map((label) => ({
          label,
          questionId: question.id,
          nextQuestionId,
        })),
      });

      nextQuestionId = question.id;
    }

    return { id: nextQuestionId };
  }

  // ============================================================
  // CONTEXTE DES DIAGNOSTICS — questions uniquement
  // ============================================================
  // Les branches existantes continuent d'identifier le process. Ces questions
  // complètent ensuite le contexte avant la localisation finale.
  const DIAGNOSTIC_CONTEXTS: Record<string, DiagnosticQuestionSpec[]> = {
    normalDeclarationProcess: [
      {
        title:
          "La naissance a-t-elle eu lieu dans un établissement de santé ou au domicile ?",
        options: [
          "Dans un établissement de santé",
          "À domicile",
          "Autre situation",
        ],
      },
      {
        title:
          "Disposez-vous d'un justificatif ou d'une information permettant d'établir les circonstances de la naissance ?",
        options: ["Oui", "Non"],
      },
    ],
    lateDeclarationProcess: [
      {
        title:
          "Disposez-vous d'un justificatif permettant d'établir la naissance ?",
        options: ["Oui", "Non", "Partiellement"],
      },
      {
        title:
          "Avez-vous déjà obtenu un document attestant que la naissance n'est pas inscrite dans les registres ?",
        options: ["Oui", "Non", "Je ne sais pas"],
      },
    ],
    suppletiveJudgmentProcess: [
      {
        title:
          "Disposez-vous de documents permettant d'établir l'identité et la naissance de la personne concernée ?",
        options: ["Oui", "Non", "Partiellement"],
      },
      {
        title:
          "La personne concernée peut-elle fournir les informations nécessaires à la constitution de la requête ?",
        options: ["Oui", "Non"],
      },
    ],
    birthCopyProcess: [
      {
        title:
          "Connaissez-vous les références ou au moins les informations permettant de retrouver l'acte de naissance ?",
        options: ["Oui", "Non", "Partiellement"],
      },
      {
        title:
          "La demande concerne-t-elle votre propre acte ou celui d'une autre personne ?",
        options: ["Mon propre acte", "L'acte d'une autre personne"],
      },
    ],
    birthRectificationProcess: [
      {
        title: "Quelle information de l'acte comporte l'erreur ?",
        options: [
          "Nom ou prénom",
          "Date ou lieu de naissance",
          "Filiation",
          "Autre information",
        ],
      },
      {
        title:
          "Disposez-vous d'un document permettant de justifier la correction demandée ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    marriageCelebrationProcess: [
      {
        title:
          "Les futurs époux souhaitent-ils tous les deux célébrer un mariage civil ?",
        options: ["Oui", "Non ou situation à préciser"],
      },
      {
        title:
          "Les futurs époux disposent-ils des pièces d'identité et documents nécessaires à la constitution du dossier ?",
        options: ["Oui", "Non", "Partiellement"],
      },
      {
        title:
          "Les futurs époux ont-ils déjà réuni les informations d'état civil nécessaires au dossier ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    marriageCopyProcess: [
      {
        title:
          "Connaissez-vous la commune ou le centre d'état civil où le mariage a été célébré ?",
        options: ["Oui", "Non"],
      },
      {
        title:
          "Disposez-vous des informations permettant d'identifier les époux et la date approximative du mariage ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    deathDeclarationProcess: [
      {
        title:
          "Disposez-vous d'un certificat ou document médical constatant le décès ?",
        options: ["Oui", "Non", "En cours d'obtention"],
      },
      {
        title:
          "Le décès doit-il être déclaré pour la première fois à l'état civil ?",
        options: ["Oui", "Je ne suis pas certain"],
      },
    ],
    deathCopyProcess: [
      {
        title:
          "Connaissez-vous le centre d'état civil où le décès a été enregistré ?",
        options: ["Oui", "Non"],
      },
      {
        title:
          "Disposez-vous des informations d'identification de la personne décédée et de la date du décès ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    adminRecognitionProcess: [
      {
        title:
          "La naissance de l'enfant est-elle en cours de déclaration ou n'est-elle pas encore déclarée ?",
        options: [
          "La naissance est en cours de déclaration",
          "La situation doit être précisée",
        ],
      },
      {
        title:
          "La mère peut-elle fournir le consentement nécessaire à la reconnaissance ?",
        options: ["Oui", "Non", "Je ne sais pas"],
      },
      {
        title: "Deux témoins peuvent-ils être présents pour la déclaration ?",
        options: ["Oui", "Non"],
      },
    ],
    judicialRecognitionProcess: [
      {
        title:
          "La naissance de l'enfant est-elle déjà enregistrée à l'état civil ?",
        options: ["Oui", "Non", "Je ne sais pas"],
      },
      {
        title:
          "Disposez-vous de documents ou d'éléments permettant d'établir la filiation invoquée ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    transcriptionProcess: [
      {
        title:
          "L'acte étranger a-t-il été établi par une autorité étrangère compétente ?",
        options: ["Oui", "Je ne sais pas"],
      },
      {
        title:
          "Disposez-vous de l'original de l'acte et des formalités de légalisation ou d'authentification disponibles ?",
        options: ["Oui", "Non", "Partiellement"],
      },
      {
        title: "Êtes-vous revenu au Cameroun depuis moins de six mois ?",
        options: ["Oui", "Non", "Je ne sais pas"],
      },
    ],
    firstRequestProcess: [
      {
        title: "Avez-vous déjà été titulaire d'une CNI camerounaise ?",
        options: ["Non, jamais", "Je ne sais pas"],
      },
      {
        title:
          "Disposez-vous d'un acte de naissance ou d'un document d'état civil permettant d'établir votre identité ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    lateFirstRequestProcess: [
      {
        title: "S'agit-il bien de votre toute première demande de CNI ?",
        options: ["Oui", "Non ou situation à vérifier"],
      },
      {
        title:
          "Disposez-vous des documents d'état civil et d'identité nécessaires à l'enrôlement ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    renewalProcess: [
      {
        title:
          "Votre CNI actuelle est-elle expirée, proche de l'expiration ou détériorée ?",
        options: [
          "Expirée",
          "Bientôt expirée",
          "Détériorée",
          "Autre situation",
        ],
      },
      {
        title: "Vos informations d'état civil sont-elles restées inchangées ?",
        options: ["Oui", "Non"],
      },
    ],
    lostStolenProcess: [
      {
        title: "La CNI a-t-elle été perdue ou volée ?",
        options: ["Perdue", "Volée"],
      },
      {
        title:
          "Avez-vous déjà effectué la déclaration auprès d'un commissariat ou d'une autorité de police ?",
        options: ["Oui", "Non"],
      },
    ],
    passportProcess: [
      {
        title: "Le demandeur est-il majeur ou mineur ?",
        options: ["Majeur", "Mineur"],
      },
      {
        title:
          "Disposez-vous des documents d'état civil et de la pièce d'identité nécessaires au dossier ?",
        options: ["Oui", "Non", "Partiellement"],
      },
      {
        title: "Pour le renouvellement, disposez-vous de l'ancien passeport ?",
        options: ["Oui", "Non", "Première demande"],
      },
    ],
    pciProcess: [
      {
        title:
          "Votre permis de conduire camerounais est-il actuellement valide ?",
        options: ["Oui", "Non"],
      },
      {
        title:
          "Disposez-vous de l'original et d'une copie de votre permis ainsi que d'une pièce d'identité ?",
        options: ["Oui", "Non", "Partiellement"],
      },
      {
        title: "Avez-vous besoin du PCI pour une utilisation à l'étranger ?",
        options: ["Oui", "Non", "Je veux vérifier les conditions"],
      },
    ],
    niuProcess: [
      {
        title:
          "Votre demande de NIU concerne-t-elle une activité professionnelle ou une situation personnelle ?",
        options: ["Situation personnelle", "Activité professionnelle"],
      },
      {
        title:
          "Disposez-vous d'une pièce d'identité et des informations nécessaires à votre immatriculation ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    nationalityProcess: [
      {
        title: "Sur quel document fondez-vous principalement votre demande ?",
        options: [
          "Acte de naissance et filiation",
          "Document d'acquisition de la nationalité",
          "Autre justificatif",
        ],
      },
      {
        title:
          "Pouvez-vous fournir les pièces permettant d'établir le lien avec la nationalité camerounaise invoquée ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    residenceCertificateProcess: [
      {
        title:
          "L'adresse pour laquelle vous demandez l'attestation correspond-elle à votre résidence actuelle ?",
        options: ["Oui", "Non"],
      },
      {
        title:
          "Disposez-vous d'une pièce d'identité et d'un justificatif ou témoignage permettant d'établir votre résidence ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    hostingProcess: [
      {
        title:
          "Êtes-vous la personne qui héberge effectivement le bénéficiaire du certificat ?",
        options: ["Oui", "Non, je suis la personne hébergée"],
      },
      {
        title:
          "Disposez-vous des informations et pièces d'identité de l'hébergeant et de l'hébergé ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    buildingPermitProcess: [
      {
        title: "Quel type de projet souhaitez-vous réaliser ?",
        options: [
          "Construction d'un bâtiment",
          "Extension ou modification",
          "Autre projet soumis à autorisation",
        ],
      },
      {
        title:
          "Disposez-vous d'un document établissant vos droits sur le terrain ?",
        options: ["Oui", "Non", "En cours d'obtention"],
      },
      {
        title:
          "Les plans du projet sont-ils déjà préparés par un professionnel compétent ?",
        options: ["Oui", "Non", "En cours"],
      },
    ],
    urbanismCertProcess: [
      {
        title:
          "Disposez-vous d'informations permettant d'identifier précisément la parcelle concernée ?",
        options: ["Oui", "Non", "Partiellement"],
      },
      {
        title:
          "Pourquoi souhaitez-vous connaître les règles d'urbanisme applicables à la parcelle ?",
        options: [
          "Préparer une construction",
          "Avant une acquisition",
          "Autre projet",
        ],
      },
    ],
    patenteProcess: [
      {
        title: "Quelle activité souhaitez-vous exercer ou régulariser ?",
        options: ["Commerce", "Service", "Artisanat", "Autre activité"],
      },
      {
        title: "L'activité est-elle déjà effectivement exercée ?",
        options: [
          "Oui",
          "Non, lancement prochain",
          "Je suis en cours de création",
        ],
      },
      {
        title: "Disposez-vous déjà d'un NIU professionnel ?",
        options: ["Oui", "Non", "Je ne sais pas"],
      },
    ],
    transcriptCertProcess: [
      {
        title: "Quel établissement a délivré le relevé de notes ?",
        options: [
          "Université ou établissement public",
          "Établissement privé",
          "Autre établissement",
        ],
      },
      {
        title: "Le relevé de notes est-il complet et lisible ?",
        options: ["Oui", "Non", "Je dois obtenir une nouvelle copie"],
      },
      {
        title:
          "Le destinataire exige-t-il une certification officielle particulière ?",
        options: ["Oui", "Non", "Je ne sais pas"],
      },
    ],
    diplomaCertProcess: [
      {
        title: "Quel établissement a délivré le diplôme ?",
        options: [
          "Université ou établissement public",
          "Établissement privé",
          "Autre établissement",
        ],
      },
      {
        title:
          "Disposez-vous de l'original ou d'une copie exploitable du diplôme ?",
        options: ["Oui", "Non"],
      },
      {
        title:
          "La certification est-elle destinée à une autorité ou un organisme précis ?",
        options: ["Oui", "Non", "Je ne sais pas"],
      },
    ],
    duplicateProcess: [
      {
        title: "Le document a-t-il été perdu, volé ou détérioré ?",
        options: ["Perdu", "Volé", "Détérioré"],
      },
      {
        title:
          "Disposez-vous d'une copie, d'un numéro ou d'une référence permettant d'identifier le document ?",
        options: ["Oui", "Non", "Partiellement"],
      },
      {
        title:
          "Avez-vous déjà déclaré la perte ou le vol lorsque cette déclaration est nécessaire ?",
        options: ["Oui", "Non", "Non concerné"],
      },
    ],
    correctionProcess: [
      {
        title:
          "Le document à corriger est-il un diplôme ou un relevé de notes ?",
        options: ["Diplôme", "Relevé de notes"],
      },
      {
        title:
          "L'erreur porte-t-elle sur l'état civil ou sur les résultats académiques ?",
        options: [
          "État civil",
          "Résultats ou mention",
          "Autre erreur matérielle",
        ],
      },
      {
        title:
          "Disposez-vous du document original ou d'une copie permettant de constater l'erreur ?",
        options: ["Oui", "Non"],
      },
    ],
    successCertProcess: [
      {
        title: "Quel diplôme ou niveau de formation concerne l'attestation ?",
        options: ["Enseignement supérieur", "Autre formation académique"],
      },
      {
        title:
          "Avez-vous terminé la formation ou validé les conditions de réussite ?",
        options: ["Oui", "Je suis en attente de confirmation"],
      },
      {
        title: "Le diplôme officiel est-il déjà disponible ?",
        options: ["Non", "Oui", "Je ne sais pas"],
      },
    ],
    criminalRecordProcess: [
      {
        title: "Le casier judiciaire est-il demandé pour vous-même ?",
        options: ["Oui", "Non, pour une autre personne"],
      },
      {
        title:
          "Connaissez-vous le lieu de naissance de la personne concernée ?",
        options: ["Oui", "Non"],
      },
      {
        title:
          "Le document est-il destiné à une autorité camerounaise ou à une démarche internationale ?",
        options: [
          "Autorité camerounaise",
          "Démarche internationale",
          "Je ne sais pas",
        ],
      },
    ],
    legalizationProcess: [
      {
        title:
          "Le document à légaliser est-il un original, une copie ou une signature ?",
        options: ["Original", "Copie", "Signature ou déclaration"],
      },
      {
        title: "Le document sera-t-il utilisé au Cameroun ou à l'étranger ?",
        options: ["Au Cameroun", "À l'étranger", "Je ne sais pas"],
      },
      {
        title:
          "Disposez-vous déjà du document original et de la pièce d'identité nécessaire ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    celibacyProcess: [
      {
        title:
          "Le certificat est-il destiné à constituer un dossier de mariage ?",
        options: ["Oui", "Non"],
      },
      {
        title:
          "Pouvez-vous fournir les informations d'état civil nécessaires à l'établissement du certificat ?",
        options: ["Oui", "Non", "Partiellement"],
      },
      {
        title:
          "Disposez-vous de deux témoins majeurs pouvant confirmer votre situation ?",
        options: ["Oui", "Non"],
      },
    ],
    associationProcess: [
      {
        title: "Le siège de l'association sera-t-il situé au Cameroun ?",
        options: ["Oui", "Non"],
      },
      {
        title:
          "L'association relève-t-elle du régime ordinaire de déclaration ?",
        options: ["Oui", "Non", "Je ne sais pas"],
      },
      {
        title:
          "Disposez-vous déjà des statuts et des informations sur les dirigeants nécessaires à la déclaration ?",
        options: ["Oui", "Non", "Partiellement"],
      },
    ],
    lossProcess: [
      {
        title:
          "Quel type de document devez-vous déclarer comme perdu ou volé ?",
        options: [
          "CNI ou passeport",
          "Diplôme ou relevé",
          "Permis de conduire",
          "Autre document administratif",
        ],
      },
      {
        title: "La perte ou le vol a-t-il déjà été signalé à une autorité ?",
        options: ["Oui", "Non"],
      },
      {
        title:
          "Avez-vous besoin du récépissé pour demander ensuite un duplicata ou un remplacement ?",
        options: ["Oui", "Non", "Je veux seulement formaliser la déclaration"],
      },
    ],
  };

  // ============================================================
  // CATEGORIES (5) — inchangées
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

  const ETAT_CIVIL_SOURCE =
    "Ordonnance n°81/02 du 29 juin 1981 portant organisation de l'état civil (texte consolidé) — https://www.cvuc-uccc.com/minat/textes/34.pdf";

  // ============================================================
  // CATÉGORIE 1 — ÉTAT CIVIL (5 procédures)
  // ============================================================

  // --- 1.1 Acte de naissance (5 branches → 5 sous-arbres avec localisation finale) ---

  const birthProcedure = await prisma.procedure.create({
    data: {
      title: "Acte de naissance",
      description:
        "Identifie la démarche exacte selon votre situation : naissance jamais déclarée, copie d'un acte existant, ou correction d'une erreur.",
      image: img("acte-naissance"),
      legalBasis: ETAT_CIVIL_SOURCE + " (articles 30 à 33, 41 à 44).",
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
        "Naissance non déclarée dans les 90 jours mais ayant moins de six mois.",
    },
  });
  const suppletiveJudgmentProcess = await prisma.process.create({
    data: {
      title: "Jugement supplétif d'acte de naissance",
      description: "Naissance non déclarée au-delà de six mois.",
    },
  });
  const birthCopyProcess = await prisma.process.create({
    data: {
      title: "Copie d'un acte de naissance existant",
      description:
        "Obtenir une copie certifiée conforme d'un acte déjà dressé.",
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

  const birthCopySubtree = await buildProcessContextSubtree(
    birthProcedure.id,
    birthCopyProcess.id,
    DIAGNOSTIC_CONTEXTS.birthCopyProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "L'acte existe déjà et je souhaite en obtenir une copie",
      questionId: birthQuestion.id,
      nextQuestionId: birthCopySubtree.id,
    },
  });

  const birthRectificationSubtree = await buildProcessContextSubtree(
    birthProcedure.id,
    birthRectificationProcess.id,
    DIAGNOSTIC_CONTEXTS.birthRectificationProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "L'acte existe mais contient une erreur à corriger",
      questionId: birthQuestion.id,
      nextQuestionId: birthRectificationSubtree.id,
    },
  });

  const normalDeclarationSubtree = await buildProcessContextSubtree(
    birthProcedure.id,
    normalDeclarationProcess.id,
    DIAGNOSTIC_CONTEXTS.normalDeclarationProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Moins de 90 jours",
      questionId: birthNeverDeclaredQuestion.id,
      nextQuestionId: normalDeclarationSubtree.id,
    },
  });

  const lateDeclarationSubtree = await buildProcessContextSubtree(
    birthProcedure.id,
    lateDeclarationProcess.id,
    DIAGNOSTIC_CONTEXTS.lateDeclarationProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Entre 90 jours et 6 mois",
      questionId: birthNeverDeclaredQuestion.id,
      nextQuestionId: lateDeclarationSubtree.id,
    },
  });

  const suppletiveJudgmentSubtree = await buildProcessContextSubtree(
    birthProcedure.id,
    suppletiveJudgmentProcess.id,
    DIAGNOSTIC_CONTEXTS.suppletiveJudgmentProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Plus de 6 mois",
      questionId: birthNeverDeclaredQuestion.id,
      nextQuestionId: suppletiveJudgmentSubtree.id,
    },
  });

  await prisma.step.create({
    data: {
      description: "",
      title: "Réunir les pièces justificatives de la naissance",
      processId: normalDeclarationProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: birthDeclarationForm.id }] },
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
      description: "",
      title: "Retirer le premier exemplaire de l'acte",
      processId: normalDeclarationProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  const requisitionStep = await prisma.step.create({
    data: {
      description: "",
      title: "Obtenir un certificat de non-inscription",
      processId: lateDeclarationProcess.id,
      administrativeBodyId: mairie.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title:
        "Saisir le Procureur de la République pour obtenir une réquisition",
      processId: lateDeclarationProcess.id,
      administrativeBodyId: tribunal.id,
      documents: { connect: [{ id: requisitionRequestForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Présenter la réquisition à l'officier d'état civil",
      processId: lateDeclarationProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  await prisma.step.create({
    data: {
      description: "",
      title: "Obtenir un certificat de non-inscription",
      processId: suppletiveJudgmentProcess.id,
      administrativeBodyId: mairie.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Obtenir un certificat d'âge apparent",
      processId: suppletiveJudgmentProcess.id,
    },
  });
  const suppletiveTribunalStep = await prisma.step.create({
    data: {
      description: "",
      title: "Déposer la requête en jugement supplétif",
      processId: suppletiveJudgmentProcess.id,
      administrativeBodyId: tribunal.id,
      documents: { connect: [{ id: suppletiveRequestForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Assister à l'audience et obtenir le jugement",
      processId: suppletiveJudgmentProcess.id,
      administrativeBodyId: tribunal.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Faire transcrire le jugement à la mairie",
      processId: suppletiveJudgmentProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  await prisma.step.create({
    data: {
      description: "",
      title:
        "Se présenter au centre d'état civil avec les références de l'acte",
      processId: birthCopyProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: birthCopyRequestForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Payer les frais de timbre et retirer la copie",
      processId: birthCopyProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  await prisma.step.create({
    data: {
      description: "",
      title: "Constituer le dossier de demande de rectification",
      processId: birthRectificationProcess.id,
      documents: { connect: [{ id: rectificationRequestForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Déposer la requête devant le Tribunal de Première Instance",
      processId: birthRectificationProcess.id,
      administrativeBodyId: tribunal.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Faire transcrire la mention rectificative",
      processId: birthRectificationProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  console.log(
    "✅ 1.1 Acte de naissance (5 sous-arbres avec localisation finale)",
  );

  // --- 1.2 Acte de mariage (2 branches) ---

  const marriageProcedure = await prisma.procedure.create({
    data: {
      title: "Acte de mariage",
      description:
        "Démarche de célébration d'un mariage civil, ou d'obtention d'une copie d'un acte de mariage déjà célébré.",
      image: img("acte-mariage"),
      legalBasis: ETAT_CIVIL_SOURCE + " (articles 48, 53 et 54).",
      categoryId: civilStatusCategory.id,
      isActive: true,
    },
  });

  const marriageCelebrationProcess = await prisma.process.create({
    data: {
      title: "Célébration d'un mariage civil",
      description:
        "Constitution du dossier, publication des bans un mois avant, puis célébration.",
    },
  });
  const marriageCopyProcess = await prisma.process.create({
    data: {
      title: "Copie d'un acte de mariage existant",
      description: "Obtenir un extrait de l'acte de mariage déjà célébré.",
    },
  });

  const marriageFileForm = await prisma.document.create({
    data: {
      name: "Fiche de constitution du dossier de mariage",
      price: 1000,
      customizable: true,
      legalWarning: "Ne remplace aucune pièce officielle.",
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

  const marriageCelebrationSubtree = await buildProcessContextSubtree(
    marriageProcedure.id,
    marriageCelebrationProcess.id,
    DIAGNOSTIC_CONTEXTS.marriageCelebrationProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Je souhaite célébrer un mariage civil",
      questionId: marriageQuestion.id,
      nextQuestionId: marriageCelebrationSubtree.id,
    },
  });

  const marriageCopySubtree = await buildProcessContextSubtree(
    marriageProcedure.id,
    marriageCopyProcess.id,
    DIAGNOSTIC_CONTEXTS.marriageCopyProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Le mariage a déjà été célébré, je veux une copie de l'acte",
      questionId: marriageQuestion.id,
      nextQuestionId: marriageCopySubtree.id,
    },
  });

  await prisma.step.create({
    data: {
      description: "",
      title: "Constituer le dossier de mariage",
      processId: marriageCelebrationProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: marriageFileForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      title: "Déposer la déclaration et attendre la publication des bans",
      processId: marriageCelebrationProcess.id,
      administrativeBodyId: mairie.id,
      description: "Un mois au moins avant la célébration (articles 53-54).",
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Assister à la célébration et recevoir le livret de famille",
      processId: marriageCelebrationProcess.id,
      administrativeBodyId: mairie.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Se présenter à la mairie où le mariage a été célébré",
      processId: marriageCopyProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: marriageCopyForm.id }] },
    },
  });

  console.log("✅ 1.2 Acte de mariage (2 sous-arbres)");

  // --- 1.3 Acte de décès (2 branches) ---

  const deathProcedure = await prisma.procedure.create({
    data: {
      title: "Acte de décès",
      description:
        "Démarche de déclaration d'un décès, ou d'obtention d'une copie d'un acte de décès déjà établi.",
      image: img("acte-deces"),
      legalBasis:
        ETAT_CIVIL_SOURCE +
        " (article 78 ; délai de 90 jours selon la pratique administrative actuelle des centres d'état civil).",
      categoryId: civilStatusCategory.id,
      isActive: true,
    },
  });

  const deathDeclarationProcess = await prisma.process.create({
    data: {
      title: "Déclaration de décès",
      description: "Déclaration auprès de l'officier d'état civil compétent.",
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
        "Le certificat du genre de mort doit être obtenu séparément.",
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

  const deathDeclarationSubtree = await buildProcessContextSubtree(
    deathProcedure.id,
    deathDeclarationProcess.id,
    DIAGNOSTIC_CONTEXTS.deathDeclarationProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Je dois déclarer un décès récent",
      questionId: deathQuestion.id,
      nextQuestionId: deathDeclarationSubtree.id,
    },
  });

  const deathCopySubtree = await buildProcessContextSubtree(
    deathProcedure.id,
    deathCopyProcess.id,
    DIAGNOSTIC_CONTEXTS.deathCopyProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Le décès est déjà enregistré, je veux une copie de l'acte",
      questionId: deathQuestion.id,
      nextQuestionId: deathCopySubtree.id,
    },
  });

  await prisma.step.create({
    data: {
      description: "",
      title: "Obtenir un certificat du genre de mort",
      processId: deathDeclarationProcess.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Déclarer le décès au centre d'état civil compétent",
      processId: deathDeclarationProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: deathDeclarationForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Se présenter à la mairie où le décès a été enregistré",
      processId: deathCopyProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: deathCopyForm.id }] },
    },
  });

  console.log("✅ 1.3 Acte de décès (2 sous-arbres)");

  // --- 1.4 Reconnaissance d'un enfant né hors mariage (2 branches) ---

  const recognitionProcedure = await prisma.procedure.create({
    data: {
      title: "Reconnaissance d'un enfant né hors mariage",
      description:
        "Identifie la voie applicable selon que la reconnaissance intervient au moment de la déclaration de naissance ou après.",
      image: img("reconnaissance-enfant"),
      legalBasis: ETAT_CIVIL_SOURCE + " (articles 41, 43 et 44).",
      categoryId: civilStatusCategory.id,
      isActive: true,
    },
  });

  const adminRecognitionProcess = await prisma.process.create({
    data: {
      title:
        "Reconnaissance administrative au moment de la déclaration de naissance",
      description:
        "Déclaration reçue par l'officier d'état civil, consentement de la mère, deux témoins (article 44).",
    },
  });
  const judicialRecognitionProcess = await prisma.process.create({
    data: {
      title: "Reconnaissance judiciaire après la déclaration de naissance",
      description: "Par jugement devant le Tribunal compétent (article 41).",
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

  const adminRecognitionSubtree = await buildProcessContextSubtree(
    recognitionProcedure.id,
    adminRecognitionProcess.id,
    DIAGNOSTIC_CONTEXTS.adminRecognitionProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Au moment de la déclaration de naissance",
      questionId: recognitionQuestion.id,
      nextQuestionId: adminRecognitionSubtree.id,
    },
  });

  const judicialRecognitionSubtree = await buildProcessContextSubtree(
    recognitionProcedure.id,
    judicialRecognitionProcess.id,
    DIAGNOSTIC_CONTEXTS.judicialRecognitionProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Après la déclaration de naissance",
      questionId: recognitionQuestion.id,
      nextQuestionId: judicialRecognitionSubtree.id,
    },
  });

  await prisma.step.create({
    data: {
      description: "",
      title: "Obtenir le consentement de la mère",
      processId: adminRecognitionProcess.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title:
        "Faire la déclaration devant l'officier d'état civil avec deux témoins",
      processId: adminRecognitionProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: recognitionDeclarationForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Constituer le dossier de requête en reconnaissance",
      processId: judicialRecognitionProcess.id,
      documents: { connect: [{ id: recognitionRequestForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Déposer la requête devant le Tribunal de Première Instance",
      processId: judicialRecognitionProcess.id,
      administrativeBodyId: tribunal.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Faire transcrire le jugement à la mairie",
      processId: judicialRecognitionProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  console.log("✅ 1.4 Reconnaissance d'enfant (2 sous-arbres)");

  // --- 1.5 Transcription d'un acte d'état civil établi hors du Cameroun (1 branche partagée) ---

  const transcriptionProcedure = await prisma.procedure.create({
    data: {
      title: "Transcription d'un acte d'état civil établi hors du Cameroun",
      description:
        "Transcrire, dans les registres camerounais, un acte de naissance, de mariage ou de décès dressé à l'étranger.",
      image: img("transcription-acte"),
      legalBasis:
        ETAT_CIVIL_SOURCE +
        " (article 4 : délai de six mois à compter du retour au Cameroun).",
      categoryId: civilStatusCategory.id,
      isActive: true,
    },
  });

  const transcriptionProcess = await prisma.process.create({
    data: {
      title: "Transcription d'un acte étranger",
      description:
        "Transcription dans les six mois suivant le retour au Cameroun (article 4).",
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
  const transcriptionSubtree = await buildProcessContextSubtree(
    transcriptionProcedure.id,
    transcriptionProcess.id,
    DIAGNOSTIC_CONTEXTS.transcriptionProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Un acte de naissance établi à l'étranger",
      questionId: transcriptionQuestion.id,
      nextQuestionId: transcriptionSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Un acte de mariage ou de décès établi à l'étranger",
      questionId: transcriptionQuestion.id,
      nextQuestionId: transcriptionSubtree.id,
    },
  });

  await prisma.step.create({
    data: {
      description: "",
      title: "Faire légaliser l'acte étranger",
      processId: transcriptionProcess.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title:
        "Déposer la demande de transcription au centre d'état civil de résidence",
      processId: transcriptionProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: transcriptionForm.id }] },
    },
  });

  console.log(
    "✅ 1.5 Transcription (1 parcours partagé avec localisation finale) — État civil complet",
  );

  // ============================================================
  // CATÉGORIE 2 — IDENTITÉ (5 procédures)
  // ============================================================

  // --- 2.1 Carte Nationale d'Identité (4 branches) ---

  const identityProcedure = await prisma.procedure.create({
    data: {
      title: "Carte Nationale d'Identité",
      description:
        "Première demande, première demande tardive, renouvellement, ou perte/vol de la CNI.",
      image: img("carte-identite"),
      legalBasis:
        "Décret présidentiel du 4 août 2016 (CNI) ; décret portant régime des titres identitaires. Aucun PDF de décret primaire localisé avec certitude — portail officiel : https://www.dgsn.cm",
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
      description: "Première demande introduite après 30 ans.",
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

  const renewalSubtree = await buildProcessContextSubtree(
    identityProcedure.id,
    renewalProcess.id,
    DIAGNOSTIC_CONTEXTS.renewalProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Je dois renouveler ma carte actuelle",
      questionId: identityQuestion.id,
      nextQuestionId: renewalSubtree.id,
    },
  });

  const lostStolenSubtree = await buildProcessContextSubtree(
    identityProcedure.id,
    lostStolenProcess.id,
    DIAGNOSTIC_CONTEXTS.lostStolenProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Ma carte a été perdue ou volée",
      questionId: identityQuestion.id,
      nextQuestionId: lostStolenSubtree.id,
    },
  });

  const firstRequestSubtree = await buildProcessContextSubtree(
    identityProcedure.id,
    firstRequestProcess.id,
    DIAGNOSTIC_CONTEXTS.firstRequestProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "J'ai moins de 30 ans",
      questionId: identityAgeQuestion.id,
      nextQuestionId: firstRequestSubtree.id,
    },
  });

  const lateFirstRequestSubtree = await buildProcessContextSubtree(
    identityProcedure.id,
    lateFirstRequestProcess.id,
    DIAGNOSTIC_CONTEXTS.lateFirstRequestProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "J'ai 30 ans ou plus",
      questionId: identityAgeQuestion.id,
      nextQuestionId: lateFirstRequestSubtree.id,
    },
  });

  for (const process of [firstRequestProcess, lateFirstRequestProcess]) {
    await prisma.step.create({
      data: {
        description: "",
        title: "Effectuer le pré-enrôlement en ligne sur idcam.cm",
        processId: process.id,
        documents: { connect: [{ id: preEnrollmentForm.id }] },
      },
    });
    await prisma.step.create({
      data: {
        description: "",
        title: "Se présenter au poste d'enrôlement de la DGSN",
        processId: process.id,
        administrativeBodyId: dgsn.id,
      },
    });
    await prisma.step.create({
      data: {
        description: "",
        title: "Effectuer l'enrôlement biométrique",
        processId: process.id,
        administrativeBodyId: dgsn.id,
      },
    });
    await prisma.step.create({
      data: {
        description: "",
        title: "Retirer la Carte Nationale d'Identité",
        processId: process.id,
        administrativeBodyId: dgsn.id,
      },
    });
  }
  await prisma.step.create({
    data: {
      description: "",
      title: "Effectuer le pré-enrôlement en précisant un renouvellement",
      processId: renewalProcess.id,
      documents: { connect: [{ id: preEnrollmentForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Se présenter avec l'ancienne carte",
      processId: renewalProcess.id,
      administrativeBodyId: dgsn.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Retirer la nouvelle carte",
      processId: renewalProcess.id,
      administrativeBodyId: dgsn.id,
    },
  });

  const lossDeclarationStep = await prisma.step.create({
    data: {
      description: "",
      title: "Faire une déclaration de perte ou de vol",
      processId: lostStolenProcess.id,
      administrativeBodyId: commissariat.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Effectuer un nouveau pré-enrôlement",
      processId: lostStolenProcess.id,
      documents: { connect: [{ id: preEnrollmentForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Retirer la nouvelle carte avec le récépissé",
      processId: lostStolenProcess.id,
      administrativeBodyId: dgsn.id,
    },
  });

  console.log("✅ 2.1 CNI (4 sous-arbres)");

  // --- 2.2 Passeport biométrique (1 branche partagée) ---

  const passportProcedure = await prisma.procedure.create({
    data: {
      title: "Passeport biométrique",
      description:
        "Démarche de première demande ou de renouvellement du passeport biométrique camerounais.",
      image: img("passeport"),
      legalBasis:
        "Pré-enrôlement en ligne via le portail officiel https://www.passcam.cm, opéré pour le compte de la DGSN (https://www.dgsn.cm). Aucun décret primaire disponible en ligne avec certitude.",
      categoryId: identityCategory.id,
      isActive: true,
    },
  });
  const passportProcess = await prisma.process.create({
    data: {
      title: "Obtenir un passeport biométrique",
      description:
        "Pré-enrôlement, puis enrôlement physique, puis retrait (environ 48h après validation).",
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
  const passportSubtree = await buildProcessContextSubtree(
    passportProcedure.id,
    passportProcess.id,
    DIAGNOSTIC_CONTEXTS.passportProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Première demande",
      questionId: passportQuestion.id,
      nextQuestionId: passportSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Renouvellement",
      questionId: passportQuestion.id,
      nextQuestionId: passportSubtree.id,
    },
  });

  await prisma.step.create({
    data: {
      description: "",
      title: "Créer un compte et pré-enrôler en ligne sur passcam.cm",
      processId: passportProcess.id,
      documents: { connect: [{ id: passportPreEnrollForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Se présenter au centre d'enrôlement avec les documents originaux",
      processId: passportProcess.id,
      administrativeBodyId: dgsn.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Capture biométrique (photo, empreintes, signature)",
      processId: passportProcess.id,
      administrativeBodyId: dgsn.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Retirer le passeport au centre indiqué",
      processId: passportProcess.id,
      administrativeBodyId: dgsn.id,
    },
  });

  console.log("✅ 2.2 Passeport (1 sous-arbre)");

  // --- 2.3 Permis de Conduire International (1 branche partagée) ---

  const pciProcedure = await prisma.procedure.create({
    data: {
      title: "Permis de Conduire International",
      description:
        "Démarche d'obtention du Permis de Conduire International (PCI) à partir d'un permis camerounais existant.",
      image: img("permis-conduire-international"),
      legalBasis:
        "Délivré par Campost ou les délégations du Ministère des Transports (MINT). Aucune source primaire en ligne fiable identifiée pour ce document.",
      categoryId: identityCategory.id,
      isActive: true,
    },
  });
  const pciProcess = await prisma.process.create({
    data: {
      title: "Obtenir un Permis de Conduire International",
      description:
        "À partir d'un permis de conduire camerounais en cours de validité.",
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
        "Quelle est la situation de votre permis de conduire camerounais ?",
      procedureId: pciProcedure.id,
    },
  });
  const pciSubtree = await buildProcessContextSubtree(
    pciProcedure.id,
    pciProcess.id,
    DIAGNOSTIC_CONTEXTS.pciProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Il est en cours de validité",
      questionId: pciQuestion.id,
      nextQuestionId: pciSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Il est expiré ou n'est plus valide",
      questionId: pciQuestion.id,
      nextQuestionId: pciSubtree.id,
    },
  });

  await prisma.step.create({
    data: {
      description: "",
      title: "Constituer le dossier (permis original + copie, CNI, 2 photos)",
      processId: pciProcess.id,
      documents: { connect: [{ id: pciForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Déposer le dossier à Campost ou à la délégation MINT",
      processId: pciProcess.id,
      administrativeBodyId: campost.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Retirer le Permis de Conduire International",
      processId: pciProcess.id,
      administrativeBodyId: campost.id,
    },
  });

  console.log("✅ 2.3 PCI (1 sous-arbre)");

  // --- 2.4 Numéro d'Identifiant Unique (NIU) (1 branche partagée) ---

  const niuProcedure = await prisma.procedure.create({
    data: {
      title: "Numéro d'Identifiant Unique (NIU)",
      description:
        "Démarche d'immatriculation fiscale auprès de la DGI pour obtenir un NIU.",
      image: img("niu"),
      legalBasis:
        "Immatriculation en ligne sur la plateforme officielle de la Direction Générale des Impôts — https://teledeclaration-dgi.cm",
      categoryId: identityCategory.id,
      isActive: true,
    },
  });
  const niuProcess = await prisma.process.create({
    data: {
      title: "Obtenir un Numéro d'Identifiant Unique",
      description: "Immatriculation en ligne auprès de la DGI.",
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
  const niuSubtree = await buildProcessContextSubtree(
    niuProcedure.id,
    niuProcess.id,
    DIAGNOSTIC_CONTEXTS.niuProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Contribuable non professionnel (particulier)",
      questionId: niuQuestion.id,
      nextQuestionId: niuSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Contribuable professionnel (activité commerciale)",
      questionId: niuQuestion.id,
      nextQuestionId: niuSubtree.id,
    },
  });

  await prisma.step.create({
    data: {
      description: "",
      title: "Accéder à la plateforme de télédéclaration de la DGI",
      processId: niuProcess.id,
      documents: { connect: [{ id: niuForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Renseigner les informations d'identification et valider",
      processId: niuProcess.id,
      administrativeBodyId: dgi.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Télécharger l'attestation d'immatriculation",
      processId: niuProcess.id,
      administrativeBodyId: dgi.id,
    },
  });

  console.log("✅ 2.4 NIU (1 sous-arbre)");

  // --- 2.5 Certificat de nationalité camerounaise (1 branche partagée) ---

  const nationalityProcedure = await prisma.procedure.create({
    data: {
      title: "Certificat de nationalité camerounaise",
      description:
        "Démarche d'obtention du certificat de nationalité auprès du Tribunal de Première Instance.",
      image: img("certificat-nationalite"),
      legalBasis:
        "Demande déposée auprès du Tribunal de Première Instance. Aucune source primaire en ligne fiable identifiée.",
      categoryId: identityCategory.id,
      isActive: true,
    },
  });
  const nationalityProcess = await prisma.process.create({
    data: {
      title: "Obtenir un certificat de nationalité camerounaise",
      description:
        "Pour toute personne née de parents camerounais ou ayant acquis la nationalité.",
    },
  });
  const nationalityForm = await prisma.document.create({
    data: {
      name: "Modèle de demande manuscrite de certificat de nationalité",
      price: 1000,
      customizable: true,
    },
  });
  const nationalityQuestion = await prisma.question.create({
    data: {
      title: "Sur quelle base demandez-vous le certificat de nationalité ?",
      procedureId: nationalityProcedure.id,
    },
  });
  const nationalitySubtree = await buildProcessContextSubtree(
    nationalityProcedure.id,
    nationalityProcess.id,
    DIAGNOSTIC_CONTEXTS.nationalityProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Je suis né(e) de parents camerounais",
      questionId: nationalityQuestion.id,
      nextQuestionId: nationalitySubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "J'ai acquis la nationalité (naturalisation, mariage, autre)",
      questionId: nationalityQuestion.id,
      nextQuestionId: nationalitySubtree.id,
    },
  });

  await prisma.step.create({
    data: {
      description: "",
      title:
        "Constituer le dossier (acte de naissance, CNI des parents, timbre fiscal)",
      processId: nationalityProcess.id,
      documents: { connect: [{ id: nationalityForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Déposer la demande manuscrite au Tribunal de Première Instance",
      processId: nationalityProcess.id,
      administrativeBodyId: tribunal.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Retirer le certificat signé par le président du tribunal",
      processId: nationalityProcess.id,
      administrativeBodyId: tribunal.id,
    },
  });

  console.log("✅ 2.5 Nationalité (1 sous-arbre) — Identité complète");

  // ============================================================
  // CATÉGORIE 3 — RÉSIDENCE ET ADMINISTRATION (5 procédures, 1 sous-arbre chacune)
  // ============================================================

  const residenceProcedure = await prisma.procedure.create({
    data: {
      title: "Attestation de résidence",
      description:
        "Démarche permettant d'obtenir une attestation de résidence auprès de la mairie de son lieu de résidence.",
      image: img("attestation-residence"),
      legalBasis:
        "Loi n°2019/024 du 24 décembre 2019 portant Code Général des Collectivités Territoriales Décentralisées. Aucune source primaire en ligne fiable identifiée.",
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
      legalWarning: "Ne dispense pas du visa usuel du chef de quartier.",
    },
  });
  const residenceQuestion = await prisma.question.create({
    data: {
      title: "Résidez-vous actuellement dans la commune concernée ?",
      procedureId: residenceProcedure.id,
    },
  });
  const residenceSubtree = await buildProcessContextSubtree(
    residenceProcedure.id,
    residenceCertificateProcess.id,
    DIAGNOSTIC_CONTEXTS.residenceCertificateProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Oui, j'y réside actuellement",
      questionId: residenceQuestion.id,
      nextQuestionId: residenceSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label:
        "Je ne suis pas certain que ma situation corresponde à cette commune",
      questionId: residenceQuestion.id,
      nextQuestionId: residenceSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Faire viser la demande par le chef de quartier",
      processId: residenceCertificateProcess.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Se présenter à la mairie avec une pièce d'identité",
      processId: residenceCertificateProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: residenceForm.id }] },
    },
  });
  console.log("✅ 3.1 Attestation de résidence");

  const hostingProcedure = await prisma.procedure.create({
    data: {
      title: "Certificat d'hébergement",
      description:
        "Démarche permettant d'obtenir un certificat attestant qu'une personne héberge un tiers à son domicile.",
      image: img("certificat-hebergement"),
      legalBasis:
        "Délivré par les mairies dans le cadre de leurs missions courantes. Aucune source primaire en ligne fiable identifiée.",
      categoryId: residenceCategory.id,
      isActive: true,
    },
  });
  const hostingProcess = await prisma.process.create({
    data: {
      title: "Obtenir un certificat d'hébergement",
      description: "L'hébergeant atteste héberger la personne concernée.",
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
  const hostingSubtree = await buildProcessContextSubtree(
    hostingProcedure.id,
    hostingProcess.id,
    DIAGNOSTIC_CONTEXTS.hostingProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Moi-même, pour héberger un tiers",
      questionId: hostingQuestion.id,
      nextQuestionId: hostingSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Un proche qui m'héberge",
      questionId: hostingQuestion.id,
      nextQuestionId: hostingSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Réunir les pièces de l'hébergeant et de l'hébergé",
      processId: hostingProcess.id,
      documents: { connect: [{ id: hostingForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Se présenter à la mairie du lieu d'hébergement",
      processId: hostingProcess.id,
      administrativeBodyId: mairie.id,
    },
  });
  console.log("✅ 3.2 Certificat d'hébergement");

  const URBANISM_SOURCE =
    "Loi n°2004/003 du 21 avril 2004 régissant l'urbanisme au Cameroun — https://www.minhdu.gov.cm/wp-content/uploads/2023/08/loi-no-2004-003-du-21-04-2004-regissant-l-urbanisme-au-Cameroun.pdf";

  const buildingPermitProcedure = await prisma.procedure.create({
    data: {
      title: "Permis de bâtir",
      description:
        "Démarche obligatoire avant toute construction, même sans fondation.",
      image: img("permis-de-batir"),
      legalBasis:
        URBANISM_SOURCE +
        " (articles 107, 111, 112) ; décret n°2008/0739/PM (délai de 45 jours).",
      categoryId: residenceCategory.id,
      isActive: true,
    },
  });
  const buildingPermitProcess = await prisma.process.create({
    data: {
      title: "Obtenir un permis de bâtir",
      description:
        "Délivré par le maire de la commune concernée (article 107).",
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
  const buildingPermitSubtree = await buildProcessContextSubtree(
    buildingPermitProcedure.id,
    buildingPermitProcess.id,
    DIAGNOSTIC_CONTEXTS.buildingPermitProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Oui",
      questionId: buildingPermitQuestion.id,
      nextQuestionId: buildingPermitSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Non, mais le permis reste obligatoire (article 107)",
      questionId: buildingPermitQuestion.id,
      nextQuestionId: buildingPermitSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title:
        "Obtenir un certificat d'urbanisme et un certificat de propriété récent",
      processId: buildingPermitProcess.id,
      administrativeBodyId: mairie.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Faire établir les plans par un architecte agréé",
      processId: buildingPermitProcess.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Déposer le dossier au guichet unique de la commune",
      processId: buildingPermitProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: buildingPermitForm.id }] },
    },
  });
  console.log("✅ 3.3 Permis de bâtir");

  const urbanismCertProcedure = await prisma.procedure.create({
    data: {
      title: "Certificat d'urbanisme",
      description:
        "Document préalable indiquant ce qu'il est possible de construire sur une parcelle.",
      image: img("certificat-urbanisme"),
      legalBasis: URBANISM_SOURCE + " (article 99).",
      categoryId: residenceCategory.id,
      isActive: true,
    },
  });
  const urbanismCertProcess = await prisma.process.create({
    data: {
      title: "Obtenir un certificat d'urbanisme",
      description:
        "Indique l'affectation de la zone, les servitudes et reculs applicables.",
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
  const urbanismCertSubtree = await buildProcessContextSubtree(
    urbanismCertProcedure.id,
    urbanismCertProcess.id,
    DIAGNOSTIC_CONTEXTS.urbanismCertProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Pour un futur permis de bâtir",
      questionId: urbanismCertQuestion.id,
      nextQuestionId: urbanismCertSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour vérifier la constructibilité d'un terrain avant achat",
      questionId: urbanismCertQuestion.id,
      nextQuestionId: urbanismCertSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Déposer la demande à la mairie ou à la communauté urbaine",
      processId: urbanismCertProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: urbanismCertForm.id }] },
    },
  });
  console.log("✅ 3.4 Certificat d'urbanisme");

  const patenteProcedure = await prisma.procedure.create({
    data: {
      title: "Déclaration de patente",
      description:
        "Démarche d'immatriculation à la contribution des patentes pour l'exercice d'une activité commerciale.",
      image: img("patente"),
      legalBasis:
        "Contribution des patentes relevant de la fiscalité locale (DGI). Aucune source primaire en ligne fiable identifiée.",
      categoryId: residenceCategory.id,
      isActive: true,
    },
  });
  const patenteProcess = await prisma.process.create({
    data: {
      title: "Obtenir sa patente",
      description: "Immatriculation auprès du Centre des Impôts.",
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
  const patenteSubtree = await buildProcessContextSubtree(
    patenteProcedure.id,
    patenteProcess.id,
    DIAGNOSTIC_CONTEXTS.patenteProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Oui, je l'ai déjà",
      questionId: patenteQuestion.id,
      nextQuestionId: patenteSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Non, pas encore",
      questionId: patenteQuestion.id,
      nextQuestionId: patenteSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title:
        "Déclarer l'activité et obtenir le NIU professionnel si nécessaire",
      processId: patenteProcess.id,
      administrativeBodyId: dgi.id,
      documents: { connect: [{ id: patenteForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Payer la contribution des patentes correspondant à l'activité",
      processId: patenteProcess.id,
      administrativeBodyId: dgi.id,
    },
  });
  console.log("✅ 3.5 Patente — Résidence et administration complète");

  // ============================================================
  // CATÉGORIE 4 — ACADÉMIQUE (5 procédures, 1 sous-arbre chacune)
  // ============================================================

  const MINESUP_SOURCE =
    "Formulaire officiel MINESUP (DCAA) — https://www.minesup.gov.cm/site/DCAA/Formulaire%20de%20demande%20DCAA.pdf";
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

  const transcriptCertProcedure = await prisma.procedure.create({
    data: {
      title: "Certification d'un relevé de notes",
      description:
        "Faire certifier ou authentifier un relevé de notes existant auprès du MINESUP.",
      image: img("certification-releve-notes"),
      legalBasis: MINESUP_SOURCE,
      categoryId: academicCategory.id,
      isActive: true,
    },
  });
  const transcriptCertProcess = await prisma.process.create({
    data: {
      title: "Certifier un relevé de notes",
      description: "Confirme l'authenticité du document auprès d'un tiers.",
    },
  });
  const transcriptCertQuestion = await prisma.question.create({
    data: {
      title: "Pour quel usage le relevé de notes doit-il être certifié ?",
      procedureId: transcriptCertProcedure.id,
    },
  });
  const transcriptCertSubtree = await buildProcessContextSubtree(
    transcriptCertProcedure.id,
    transcriptCertProcess.id,
    DIAGNOSTIC_CONTEXTS.transcriptCertProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Pour une inscription ou candidature au Cameroun",
      questionId: transcriptCertQuestion.id,
      nextQuestionId: transcriptCertSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour une candidature à l'étranger",
      questionId: transcriptCertQuestion.id,
      nextQuestionId: transcriptCertSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Réunir la photocopie certifiée conforme du relevé et de la CNI",
      processId: transcriptCertProcess.id,
      documents: { connect: [{ id: academicForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Déposer la demande auprès du MINESUP ou de l'établissement",
      processId: transcriptCertProcess.id,
      administrativeBodyId: minesup.id,
    },
  });
  console.log("✅ 4.1 Certification relevé de notes");

  const diplomaCertProcedure = await prisma.procedure.create({
    data: {
      title: "Certification d'un diplôme",
      description:
        "Faire certifier ou authentifier un diplôme existant auprès du MINESUP.",
      image: img("certification-diplome"),
      legalBasis: MINESUP_SOURCE,
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
  const diplomaCertSubtree = await buildProcessContextSubtree(
    diplomaCertProcedure.id,
    diplomaCertProcess.id,
    DIAGNOSTIC_CONTEXTS.diplomaCertProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Pour un emploi ou un concours",
      questionId: diplomaCertQuestion.id,
      nextQuestionId: diplomaCertSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour une candidature à l'étranger",
      questionId: diplomaCertQuestion.id,
      nextQuestionId: diplomaCertSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Réunir la photocopie certifiée conforme du diplôme et de la CNI",
      processId: diplomaCertProcess.id,
      documents: { connect: [{ id: academicForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Déposer la demande auprès du MINESUP ou de l'établissement",
      processId: diplomaCertProcess.id,
      administrativeBodyId: minesup.id,
    },
  });
  console.log("✅ 4.2 Certification diplôme");

  const duplicateProcedure = await prisma.procedure.create({
    data: {
      title: "Duplicata d'un diplôme ou relevé de notes",
      description:
        "Délivrance d'un duplicata en cas de perte ou détérioration du document original.",
      image: img("duplicata-diplome"),
      legalBasis: MINESUP_SOURCE,
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
  const duplicateSubtree = await buildProcessContextSubtree(
    duplicateProcedure.id,
    duplicateProcess.id,
    DIAGNOSTIC_CONTEXTS.duplicateProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Un diplôme",
      questionId: duplicateQuestion.id,
      nextQuestionId: duplicateSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Un relevé de notes",
      questionId: duplicateQuestion.id,
      nextQuestionId: duplicateSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Faire une déclaration de perte",
      processId: duplicateProcess.id,
      administrativeBodyId: commissariat.id,
      documents: { connect: [{ id: lossDeclarationForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Déposer la demande de duplicata au MINESUP",
      processId: duplicateProcess.id,
      administrativeBodyId: minesup.id,
      documents: { connect: [{ id: academicForm.id }] },
    },
  });
  console.log("✅ 4.3 Duplicata");

  const correctionProcedure = await prisma.procedure.create({
    data: {
      title: "Correction d'un diplôme ou relevé de notes",
      description:
        "Correction d'une erreur matérielle figurant sur un document délivré.",
      image: img("correction-diplome"),
      legalBasis: MINESUP_SOURCE,
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
  const correctionSubtree = await buildProcessContextSubtree(
    correctionProcedure.id,
    correctionProcess.id,
    DIAGNOSTIC_CONTEXTS.correctionProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Une erreur sur l'état civil (nom, date de naissance...)",
      questionId: correctionQuestion.id,
      nextQuestionId: correctionSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Une erreur sur les résultats ou la mention",
      questionId: correctionQuestion.id,
      nextQuestionId: correctionSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Joindre l'original du document à corriger et préciser l'erreur",
      processId: correctionProcess.id,
      documents: { connect: [{ id: academicForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Déposer la demande de correction au MINESUP",
      processId: correctionProcess.id,
      administrativeBodyId: minesup.id,
    },
  });
  console.log("✅ 4.4 Correction");

  const successCertProcedure = await prisma.procedure.create({
    data: {
      title: "Attestation de réussite",
      description:
        "Obtenir une attestation de réussite lorsque le diplôme officiel n'est pas encore disponible.",
      image: img("attestation-reussite"),
      legalBasis: MINESUP_SOURCE,
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
  const successCertSubtree = await buildProcessContextSubtree(
    successCertProcedure.id,
    successCertProcess.id,
    DIAGNOSTIC_CONTEXTS.successCertProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Le diplôme officiel n'est pas encore édité",
      questionId: successCertQuestion.id,
      nextQuestionId: successCertSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "J'ai besoin d'un justificatif en attendant le diplôme",
      questionId: successCertQuestion.id,
      nextQuestionId: successCertSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Déposer la demande d'attestation de réussite",
      processId: successCertProcess.id,
      administrativeBodyId: minesup.id,
      documents: { connect: [{ id: academicForm.id }] },
    },
  });
  console.log("✅ 4.5 Attestation de réussite — Académique complète");

  // ============================================================
  // CATÉGORIE 5 — JUSTICE ET FORMALITÉS LÉGALES (5 procédures, 1 sous-arbre chacune)
  // ============================================================

  const criminalRecordProcedure = await prisma.procedure.create({
    data: {
      title: "Extrait de casier judiciaire (Bulletin n°3)",
      description:
        "Obtention de l'extrait de casier judiciaire, souvent exigé pour un emploi, un concours ou un visa.",
      image: img("casier-judiciaire"),
      legalBasis:
        "Code de Procédure Pénale, articles 573 à 583. Aucun lien en ligne vers le texte primaire localisé avec certitude.",
      categoryId: justiceCategory.id,
      isActive: true,
    },
  });
  const criminalRecordProcess = await prisma.process.create({
    data: {
      title: "Obtenir un extrait de casier judiciaire",
      description:
        "Signé conjointement par le Procureur de la République et le greffier en chef.",
    },
  });
  const criminalRecordForm = await prisma.document.create({
    data: {
      name: "Demande timbrée d'extrait de casier judiciaire pré-remplie",
      price: 500,
      customizable: true,
    },
  });
  const criminalRecordQuestion = await prisma.question.create({
    data: {
      title: "Pour quel usage avez-vous besoin de ce document ?",
      procedureId: criminalRecordProcedure.id,
    },
  });
  const criminalRecordSubtree = await buildProcessContextSubtree(
    criminalRecordProcedure.id,
    criminalRecordProcess.id,
    DIAGNOSTIC_CONTEXTS.criminalRecordProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Pour un emploi ou un concours",
      questionId: criminalRecordQuestion.id,
      nextQuestionId: criminalRecordSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour une démarche de visa ou à l'étranger",
      questionId: criminalRecordQuestion.id,
      nextQuestionId: criminalRecordSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Préparer une photocopie d'acte de naissance ou de CNI",
      processId: criminalRecordProcess.id,
      documents: { connect: [{ id: criminalRecordForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title:
        "Déposer la demande au greffe du Tribunal de Première Instance du lieu de naissance",
      processId: criminalRecordProcess.id,
      administrativeBodyId: tribunal.id,
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
  console.log("✅ 5.1 Casier judiciaire");

  const legalizationProcedure = await prisma.procedure.create({
    data: {
      title: "Légalisation de documents",
      description:
        "Faire certifier conforme une copie de document, ou légaliser une signature.",
      image: img("legalisation-documents"),
      legalBasis:
        "Certification conforme et légalisation réalisées par les mairies et sous-préfectures. Aucune source primaire en ligne fiable identifiée.",
      categoryId: justiceCategory.id,
      isActive: true,
    },
  });
  const legalizationProcess = await prisma.process.create({
    data: {
      title: "Faire légaliser un document ou une signature",
      description: "Pour un usage local ou national.",
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
  const legalizationSubtree = await buildProcessContextSubtree(
    legalizationProcedure.id,
    legalizationProcess.id,
    DIAGNOSTIC_CONTEXTS.legalizationProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Une copie de document (certification conforme)",
      questionId: legalizationQuestion.id,
      nextQuestionId: legalizationSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Une signature ou une déclaration sur l'honneur",
      questionId: legalizationQuestion.id,
      nextQuestionId: legalizationSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Préparer l'original et la copie du document",
      processId: legalizationProcess.id,
      documents: { connect: [{ id: legalizationForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Se présenter à la mairie ou à la sous-préfecture",
      processId: legalizationProcess.id,
      administrativeBodyId: mairie.id,
    },
  });
  console.log("✅ 5.2 Légalisation de documents");

  const celibacyProcedure = await prisma.procedure.create({
    data: {
      title: "Certificat de célibat",
      description:
        "Obtenir un certificat attestant qu'une personne n'est pas mariée, notamment en vue d'un mariage.",
      image: img("certificat-celibat"),
      legalBasis:
        "Délivré par la mairie sur déclaration appuyée par deux témoins. Aucune source primaire en ligne fiable identifiée.",
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
  const celibacySubtree = await buildProcessContextSubtree(
    celibacyProcedure.id,
    celibacyProcess.id,
    DIAGNOSTIC_CONTEXTS.celibacyProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Dans le cadre d'un dossier de mariage",
      questionId: celibacyQuestion.id,
      nextQuestionId: celibacySubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Pour une autre démarche administrative",
      questionId: celibacyQuestion.id,
      nextQuestionId: celibacySubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Réunir deux témoins majeurs munis de leur CNI",
      processId: celibacyProcess.id,
      documents: { connect: [{ id: celibacyForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Se présenter à la mairie du lieu de naissance ou de résidence",
      processId: celibacyProcess.id,
      administrativeBodyId: mairie.id,
    },
  });
  console.log("✅ 5.3 Certificat de célibat");

  const associationProcedure = await prisma.procedure.create({
    data: {
      title: "Déclaration de création d'une association",
      description:
        "Déclarer une association à but non lucratif auprès de la préfecture du département de son siège.",
      image: img("creation-association"),
      legalBasis:
        "Loi n°90/053 du 19 décembre 1990 relative à la liberté d'association (articles 1, 5, 7, 8) — https://app.maathis.com/droit/cameroun/loi/90-053-loi-n-90053-19-decembre-1990-relative-liberte-dassociation",
      categoryId: justiceCategory.id,
      isActive: true,
    },
  });
  const associationProcess = await prisma.process.create({
    data: {
      title: "Déclarer une association ordinaire",
      description: "Régime de la déclaration (article 5).",
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
  const associationSubtree = await buildProcessContextSubtree(
    associationProcedure.id,
    associationProcess.id,
    DIAGNOSTIC_CONTEXTS.associationProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Une association ordinaire (régime de la déclaration)",
      questionId: associationQuestion.id,
      nextQuestionId: associationSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label:
        "Une association dont le régime juridique doit être vérifié avant la déclaration",
      questionId: associationQuestion.id,
      nextQuestionId: associationSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Rédiger les statuts et la lettre de déclaration",
      processId: associationProcess.id,
      documents: { connect: [{ id: associationForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title:
        "Déposer le dossier timbré à la préfecture du département du siège",
      processId: associationProcess.id,
      administrativeBodyId: prefecture.id,
    },
  });
  await prisma.step.create({
    data: {
      title: "Retirer le récépissé de déclaration",
      processId: associationProcess.id,
      administrativeBodyId: prefecture.id,
      description:
        "Le récépissé confère la personnalité juridique (article 5).",
    },
  });
  console.log("✅ 5.4 Déclaration d'association");

  const lossProcedure = await prisma.procedure.create({
    data: {
      title: "Déclaration de perte ou de vol d'un document administratif",
      description:
        "Démarche préalable, souvent nécessaire avant d'obtenir un duplicata de CNI, de passeport ou de diplôme.",
      image: img("declaration-perte"),
      legalBasis:
        "Déclaration faite au commissariat de police, pratique administrative constante. Aucune source primaire en ligne fiable identifiée.",
      categoryId: justiceCategory.id,
      isActive: true,
    },
  });
  const lossProcess = await prisma.process.create({
    data: {
      title: "Déclarer la perte ou le vol d'un document",
      description:
        "Délivrance d'un récépissé, généralement exigé pour toute demande de duplicata.",
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
  const lossSubtree = await buildProcessContextSubtree(
    lossProcedure.id,
    lossProcess.id,
    DIAGNOSTIC_CONTEXTS.lossProcess,
  );
  await prisma.answerOption.create({
    data: {
      label: "Une pièce d'identité (CNI, passeport)",
      questionId: lossQuestion.id,
      nextQuestionId: lossSubtree.id,
    },
  });
  await prisma.answerOption.create({
    data: {
      label: "Un autre document administratif (diplôme, permis...)",
      questionId: lossQuestion.id,
      nextQuestionId: lossSubtree.id,
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Se présenter au commissariat de police le plus proche",
      processId: lossProcess.id,
      administrativeBodyId: commissariat.id,
      documents: { connect: [{ id: lossForm.id }] },
    },
  });
  await prisma.step.create({
    data: {
      description: "",
      title: "Conserver le récépissé pour la démarche de duplicata",
      processId: lossProcess.id,
      administrativeBodyId: commissariat.id,
    },
  });
  console.log("✅ 5.5 Déclaration de perte — Justice complète");

  // ============================================================
  // FRAUD ALERTS
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
        "Méfiez-vous de toute personne proposant, contre paiement, de réaliser à votre place un pré-enrôlement accessible directement sur idcam.cm.",
      stepId: lossDeclarationStep.id,
    },
  });

  console.log("✅ Fraud alerts created");

  console.log("\n🎉 Seed v3 completed successfully!");
  console.log(
    "📂 5 catégories, 25 procédures, 35 parcours complets avec localisation finale (4 zones couvertes)",
  );
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
