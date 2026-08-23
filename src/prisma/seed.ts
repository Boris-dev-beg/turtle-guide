import {
  PrismaClient,
  Prisma,
  ProcedureDomain,
  FolderStatus,
  OrderStatus,
  TransactionStatus,
} from "../generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const money = (value: number) => new Prisma.Decimal(value);

async function main() {
  console.log("🌱 Seeding TurtleGuide...");

  // ============================================================
  // 1. CLEAN DATABASE
  // ============================================================

  await prisma.fraudAlert.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.step.deleteMany();
  await prisma.document.deleteMany();
  await prisma.progression.deleteMany();
  await prisma.answerOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.request.deleteMany();
  await prisma.administrativeBody.deleteMany();
  await prisma.location.deleteMany();
  await prisma.procedure.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.administrator.deleteMany();
  await prisma.user.deleteMany();

  // ============================================================
  // 2. LOCATIONS
  // ============================================================

  const yaounde = await prisma.location.create({
    data: {
      region: "Centre",
      department: "Mfoundi",
      district: "Yaoundé I",
      city: "Yaoundé",
    },
  });

  const douala = await prisma.location.create({
    data: {
      region: "Littoral",
      department: "Wouri",
      district: "Douala I",
      city: "Douala",
    },
  });

  const bafoussam = await prisma.location.create({
    data: {
      region: "Ouest",
      department: "Mifi",
      district: "Bafoussam I",
      city: "Bafoussam",
    },
  });

  const dschang = await prisma.location.create({
    data: {
      region: "Ouest",
      department: "Menoua",
      district: "Dschang",
      city: "Dschang",
    },
  });

  // ============================================================
  // 3. ADMINISTRATIVE BODIES
  // ============================================================

  const centreEtatCivilYaounde =
    await prisma.administrativeBody.create({
      data: {
        name: "Centre d'état civil de Yaoundé",
        type: "CENTRE_ETAT_CIVIL",
        contact: "+237 222 20 00 00",
        locationId: yaounde.id,
      },
    });

  const centreEtatCivilDouala =
    await prisma.administrativeBody.create({
      data: {
        name: "Centre d'état civil de Douala",
        type: "CENTRE_ETAT_CIVIL",
        contact: "+237 233 40 00 00",
        locationId: douala.id,
      },
    });

  const tribunalPremiereInstanceYaounde =
    await prisma.administrativeBody.create({
      data: {
        name: "Tribunal de première instance de Yaoundé",
        type: "TRIBUNAL_PREMIERE_INSTANCE",
        contact: "+237 222 23 00 00",
        locationId: yaounde.id,
      },
    });

  const universiteYaounde =
    await prisma.administrativeBody.create({
      data: {
        name: "Université de Yaoundé I — service compétent",
        type: "ETABLISSEMENT_ACADEMIQUE",
        contact: "+237 222 23 44 66",
        locationId: yaounde.id,
      },
    });

  const delegationMinesup =
    await prisma.administrativeBody.create({
      data: {
        name: "Délégation compétente du MINESUP",
        type: "ADMINISTRATION_ACADEMIQUE",
        contact: "+237 222 22 91 51",
        locationId: yaounde.id,
      },
    });

  const idcam =
    await prisma.administrativeBody.create({
      data: {
        name: "Service d'identification — pré-enrôlement CNI",
        type: "IDENTITE",
        contact: null,
        locationId: yaounde.id,
      },
    });

  const centreEtatCivilBafoussam =
    await prisma.administrativeBody.create({
      data: {
        name: "Centre d'état civil de Bafoussam",
        type: "CENTRE_ETAT_CIVIL",
        contact: null,
        locationId: bafoussam.id,
      },
    });

  const centreEtatCivilDschang =
    await prisma.administrativeBody.create({
      data: {
        name: "Centre d'état civil de Dschang",
        type: "CENTRE_ETAT_CIVIL",
        contact: null,
        locationId: dschang.id,
      },
    });

  // ============================================================
  // 4. DOCUMENTS VENDUS PAR TURTLEGUIDE
  // ============================================================

  // IMPORTANT :
  // price = prix du document TurtleGuide.
  // Ce n'est PAS un frais administratif.

  const modeleRequeteJugementNaissance =
    await prisma.document.create({
      data: {
        name: "Requête aux fins de jugement supplétif d'acte de naissance",
        price: money(500),
        isCustomizable: true,
        customizationFields: [
          "nom",
          "prenoms",
          "dateNaissance",
          "lieuNaissance",
          "nomsParents",
          "residence",
        ],
        legalWarning:
          "Ce document est un modèle préparé à partir des informations fournies par l'utilisateur. Il ne constitue pas une décision judiciaire et ne garantit pas l'issue de la procédure.",
      },
    });

  const modeleDeclarationDeces =
    await prisma.document.create({
      data: {
        name: "Modèle de déclaration de décès",
        price: money(300),
        isCustomizable: true,
        customizationFields: [
          "nomDefunt",
          "prenomsDefunt",
          "dateDeces",
          "lieuDeces",
          "nomDeclarant",
          "lienAvecDefunt",
        ],
        legalWarning:
          "Ce document facilite la préparation de la démarche. Il ne constitue pas un acte de décès officiel.",
      },
    });

  const formulaireAcademique =
    await prisma.document.create({
      data: {
        name: "Dossier de demande de certification académique",
        price: money(500),
        isCustomizable: true,
        customizationFields: [
          "nom",
          "prenoms",
          "matricule",
          "etablissement",
          "diplome",
          "anneeObtention",
        ],
        legalWarning:
          "Ce document facilite la préparation de la demande. La certification est effectuée par l'autorité académique compétente.",
      },
    });

  // ============================================================
  // 5. PROCEDURES
  // ============================================================

  const naissanceCertification =
    await prisma.procedure.create({
      data: {
        title: "Faire certifier un acte de naissance",
        domain: ProcedureDomain.CIVIL_STATUS,
        legalBasis:
          "Loi n°2024/016 du 23 décembre 2024 portant organisation du système d'enregistrement des faits d'état civil au Cameroun",
        description:
          "Parcours d'orientation pour une personne qui possède déjà un acte de naissance et souhaite effectuer une démarche de certification.",
      },
    });

  const jugementSuppletifNaissance =
    await prisma.procedure.create({
      data: {
        title: "Obtenir un jugement supplétif d'acte de naissance",
        domain: ProcedureDomain.JUSTICE,
        legalBasis:
          "Loi n°2024/016 du 23 décembre 2024 et dispositions relatives à la reconstitution des actes d'état civil",
        description:
          "Parcours destiné aux personnes dont la naissance n'a pas été régulièrement enregistrée et qui doivent identifier la procédure judiciaire appropriée.",
      },
    });

  const certificationAcademique =
    await prisma.procedure.create({
      data: {
        title: "Faire certifier un diplôme ou un relevé de notes",
        domain: ProcedureDomain.ACADEMIC,
        legalBasis:
          "Procédures internes des établissements et autorités académiques compétentes",
        description:
          "Parcours permettant d'identifier l'autorité compétente pour faire certifier un document académique.",
      },
    });

  const carteIdentite =
    await prisma.procedure.create({
      data: {
        title: "Préparer une demande de Carte Nationale d'Identité",
        domain: ProcedureDomain.IDENTITY,
        legalBasis:
          "Procédure officielle de pré-enrôlement de la Carte Nationale d'Identité",
        description:
          "Parcours d'orientation permettant de préparer une démarche de demande ou de renouvellement de CNI.",
      },
    });

  const declarationDeces =
    await prisma.procedure.create({
      data: {
        title: "Déclarer un décès",
        domain: ProcedureDomain.CIVIL_STATUS,
        legalBasis:
          "Loi n°2024/016 du 23 décembre 2024 et dispositions relatives à l'enregistrement des décès",
        description:
          "Parcours d'orientation pour déclarer un décès et identifier le centre d'état civil compétent selon les circonstances.",
      },
    });

  // ============================================================
  // 6. STEPS — NAISSANCE / CERTIFICATION
  // ============================================================

  await prisma.step.createMany({
    data: [
      {
        title: "Vérifier l'acte de naissance",
        order: 1,
        description:
          "Vérifier que vous disposez bien de l'acte de naissance concerné et que les informations qu'il contient correspondent à votre situation.",
        estimatedFees: null,
        procedureId: naissanceCertification.id,
        administrativeBodyId: centreEtatCivilYaounde.id,
      },
      {
        title: "Se rendre auprès de l'autorité compétente",
        order: 2,
        description:
          "Présenter l'acte et les éléments demandés par l'autorité compétente.",
        estimatedFees: money(1000),
        procedureId: naissanceCertification.id,
        administrativeBodyId: centreEtatCivilYaounde.id,
      },
      {
        title: "Récupérer l'acte certifié",
        order: 3,
        description:
          "Récupérer le document après traitement de la demande.",
        estimatedFees: null,
        procedureId: naissanceCertification.id,
        administrativeBodyId: centreEtatCivilYaounde.id,
      },
    ],
  });

  // ============================================================
  // 7. STEPS — JUGEMENT SUPPLETIF
  // ============================================================

  await prisma.step.createMany({
    data: [
      {
        title: "Réunir les informations sur la naissance",
        order: 1,
        description:
          "Réunir les informations relatives à la naissance : identité, date et lieu de naissance, filiation et éléments permettant d'établir la situation.",
        estimatedFees: null,
        procedureId: jugementSuppletifNaissance.id,
        administrativeBodyId: centreEtatCivilYaounde.id,
      },
      {
        title: "Préparer la requête",
        order: 2,
        description:
          "Préparer la requête destinée à saisir la juridiction compétente.",
        estimatedFees: null,
        procedureId: jugementSuppletifNaissance.id,
        administrativeBodyId: tribunalPremiereInstanceYaounde.id,
        documentId: modeleRequeteJugementNaissance.id,
      },
      {
        title: "Déposer la requête auprès du tribunal",
        order: 3,
        description:
          "Déposer la requête et les pièces utiles auprès de la juridiction compétente.",
        estimatedFees: money(5000),
        procedureId: jugementSuppletifNaissance.id,
        administrativeBodyId: tribunalPremiereInstanceYaounde.id,
      },
      {
        title: "Suivre la procédure judiciaire",
        order: 4,
        description:
          "Suivre les suites données à la requête et répondre aux éventuelles demandes de la juridiction.",
        estimatedFees: null,
        procedureId: jugementSuppletifNaissance.id,
        administrativeBodyId: tribunalPremiereInstanceYaounde.id,
      },
      {
        title: "Faire établir l'acte après décision",
        order: 5,
        description:
          "Après la décision, effectuer les démarches nécessaires auprès de l'état civil pour l'établissement ou la transcription de l'acte.",
        estimatedFees: null,
        procedureId: jugementSuppletifNaissance.id,
        administrativeBodyId: centreEtatCivilYaounde.id,
      },
    ],
  });

  // ============================================================
  // 8. STEPS — ACADEMIQUE
  // ============================================================

  await prisma.step.createMany({
    data: [
      {
        title: "Identifier l'établissement compétent",
        order: 1,
        description:
          "Identifier l'établissement ou l'autorité académique qui doit traiter la demande.",
        estimatedFees: null,
        procedureId: certificationAcademique.id,
        administrativeBodyId: universiteYaounde.id,
      },
      {
        title: "Préparer le dossier académique",
        order: 2,
        description:
          "Réunir le diplôme ou relevé de notes ainsi que les informations nécessaires au traitement de la demande.",
        estimatedFees: null,
        procedureId: certificationAcademique.id,
        administrativeBodyId: universiteYaounde.id,
        documentId: formulaireAcademique.id,
      },
      {
        title: "Déposer la demande de certification",
        order: 3,
        description:
          "Déposer la demande auprès du service académique compétent.",
        estimatedFees: money(2000),
        procedureId: certificationAcademique.id,
        administrativeBodyId: universiteYaounde.id,
      },
      {
        title: "Récupérer le document certifié",
        order: 4,
        description:
          "Récupérer le document après traitement de la demande.",
        estimatedFees: null,
        procedureId: certificationAcademique.id,
        administrativeBodyId: universiteYaounde.id,
      },
    ],
  });

  // ============================================================
  // 9. STEPS — CNI
  // ============================================================

  await prisma.step.createMany({
    data: [
      {
        title: "Préparer les informations nécessaires",
        order: 1,
        description:
          "Préparer les informations et pièces demandées pour votre situation avant le pré-enrôlement.",
        estimatedFees: null,
        procedureId: carteIdentite.id,
        administrativeBodyId: idcam.id,
      },
      {
        title: "Effectuer le pré-enrôlement",
        order: 2,
        description:
          "Effectuer le pré-enrôlement sur le service officiel prévu à cet effet.",
        estimatedFees: null,
        procedureId: carteIdentite.id,
        administrativeBodyId: idcam.id,
      },
      {
        title: "Se présenter pour l'enrôlement",
        order: 3,
        description:
          "Se présenter auprès du service compétent pour les opérations qui nécessitent une présence physique.",
        estimatedFees: money(10000),
        procedureId: carteIdentite.id,
        administrativeBodyId: idcam.id,
      },
      {
        title: "Suivre la délivrance de la CNI",
        order: 4,
        description:
          "Suivre l'état d'avancement et récupérer la carte selon les modalités communiquées.",
        estimatedFees: null,
        procedureId: carteIdentite.id,
        administrativeBodyId: idcam.id,
      },
    ],
  });

  // ============================================================
  // 10. STEPS — DECES
  // ============================================================

  await prisma.step.createMany({
    data: [
      {
        title: "Identifier les circonstances du décès",
        order: 1,
        description:
          "Identifier le lieu du décès et la personne qui doit effectuer la déclaration.",
        estimatedFees: null,
        procedureId: declarationDeces.id,
        administrativeBodyId: centreEtatCivilYaounde.id,
        documentId: modeleDeclarationDeces.id,
      },
      {
        title: "Réunir les informations sur le défunt",
        order: 2,
        description:
          "Préparer les informations nécessaires concernant le défunt et le déclarant.",
        estimatedFees: null,
        procedureId: declarationDeces.id,
        administrativeBodyId: centreEtatCivilYaounde.id,
      },
      {
        title: "Effectuer la déclaration",
        order: 3,
        description:
          "Effectuer la déclaration auprès de l'officier d'état civil compétent. La déclaration doit notamment être certifiée par deux témoins lorsque le cas général s'applique.",
        estimatedFees: null,
        procedureId: declarationDeces.id,
        administrativeBodyId: centreEtatCivilYaounde.id,
      },
      {
        title: "Obtenir l'acte de décès",
        order: 4,
        description:
          "L'officier d'état civil établit l'acte de décès lorsque les conditions prévues sont réunies.",
        estimatedFees: null,
        procedureId: declarationDeces.id,
        administrativeBodyId: centreEtatCivilYaounde.id,
      },
    ],
  });

  // ============================================================
  // 11. QUESTIONS — NAISSANCE CERTIFICATION
  // ============================================================

  const qNC1 = await prisma.question.create({
    data: {
      label: "Avez-vous déjà un acte de naissance ?",
      order: 1,
      procedureId: naissanceCertification.id,
    },
  });

  const qNC2 = await prisma.question.create({
    data: {
      label: "Que souhaitez-vous faire avec cet acte ?",
      order: 2,
      procedureId: naissanceCertification.id,
    },
  });

  const qNC3 = await prisma.question.create({
    data: {
      label: "Dans quelle ville souhaitez-vous effectuer la démarche ?",
      order: 3,
      procedureId: naissanceCertification.id,
    },
  });

  await prisma.answerOption.createMany({
    data: [
      {
        label: "Oui",
        questionId: qNC1.id,
        nextQuestionId: qNC2.id,
      },
      {
        label: "Non",
        questionId: qNC1.id,
        identifiedProcedureId: jugementSuppletifNaissance.id,
      },
      {
        label: "Le faire certifier",
        questionId: qNC2.id,
        nextQuestionId: qNC3.id,
      },
      {
        label: "Corriger une erreur",
        questionId: qNC2.id,
        identifiedProcedureId: jugementSuppletifNaissance.id,
      },
      {
        label: "Yaoundé",
        questionId: qNC3.id,
        identifiedProcedureId: naissanceCertification.id,
      },
      {
        label: "Douala",
        questionId: qNC3.id,
        identifiedProcedureId: naissanceCertification.id,
      },
      {
        label: "Bafoussam",
        questionId: qNC3.id,
        identifiedProcedureId: naissanceCertification.id,
      },
    ],
  });

  // ============================================================
  // 12. QUESTIONS — JUGEMENT SUPPLETIF
  // ============================================================

  const qJS1 = await prisma.question.create({
    data: {
      label: "La naissance a-t-elle déjà été déclarée à l'état civil ?",
      order: 1,
      procedureId: jugementSuppletifNaissance.id,
    },
  });

  const qJS2 = await prisma.question.create({
    data: {
      label: "Avez-vous un document ou une preuve permettant d'établir la naissance ?",
      order: 2,
      procedureId: jugementSuppletifNaissance.id,
    },
  });

  const qJS3 = await prisma.question.create({
    data: {
      label: "Quel est l'âge de la personne concernée ?",
      order: 3,
      procedureId: jugementSuppletifNaissance.id,
    },
  });

  await prisma.answerOption.createMany({
    data: [
      {
        label: "Non",
        questionId: qJS1.id,
        nextQuestionId: qJS2.id,
      },
      {
        label: "Oui, mais l'acte est introuvable",
        questionId: qJS1.id,
        identifiedProcedureId: naissanceCertification.id,
      },
      {
        label: "Oui",
        questionId: qJS2.id,
        nextQuestionId: qJS3.id,
      },
      {
        label: "Non",
        questionId: qJS2.id,
        nextQuestionId: qJS3.id,
      },
      {
        label: "Moins de 15 ans",
        questionId: qJS3.id,
        identifiedProcedureId: jugementSuppletifNaissance.id,
      },
      {
        label: "15 ans ou plus",
        questionId: qJS3.id,
        identifiedProcedureId: jugementSuppletifNaissance.id,
      },
    ],
  });

  // ============================================================
  // 13. QUESTIONS — ACADEMIQUE
  // ============================================================

  const qAC1 = await prisma.question.create({
    data: {
      label: "Quel document souhaitez-vous faire certifier ?",
      order: 1,
      procedureId: certificationAcademique.id,
    },
  });

  const qAC2 = await prisma.question.create({
    data: {
      label: "Avez-vous encore le document original ?",
      order: 2,
      procedureId: certificationAcademique.id,
    },
  });

  const qAC3 = await prisma.question.create({
    data: {
      label: "Dans quelle ville se trouve l'établissement concerné ?",
      order: 3,
      procedureId: certificationAcademique.id,
    },
  });

  await prisma.answerOption.createMany({
    data: [
      {
        label: "Diplôme",
        questionId: qAC1.id,
        nextQuestionId: qAC2.id,
      },
      {
        label: "Relevé de notes",
        questionId: qAC1.id,
        nextQuestionId: qAC2.id,
      },
      {
        label: "Oui",
        questionId: qAC2.id,
        nextQuestionId: qAC3.id,
      },
      {
        label: "Non",
        questionId: qAC2.id,
        nextQuestionId: qAC3.id,
      },
      {
        label: "Yaoundé",
        questionId: qAC3.id,
        identifiedProcedureId: certificationAcademique.id,
      },
      {
        label: "Dschang",
        questionId: qAC3.id,
        identifiedProcedureId: certificationAcademique.id,
      },
      {
        label: "Bafoussam",
        questionId: qAC3.id,
        identifiedProcedureId: certificationAcademique.id,
      },
    ],
  });

  // ============================================================
  // 14. QUESTIONS — CNI
  // ============================================================

  const qCNI1 = await prisma.question.create({
    data: {
      label: "Que souhaitez-vous faire ?",
      order: 1,
      procedureId: carteIdentite.id,
    },
  });

  const qCNI2 = await prisma.question.create({
    data: {
      label: "Avez-vous déjà eu une Carte Nationale d'Identité ?",
      order: 2,
      procedureId: carteIdentite.id,
    },
  });

  const qCNI3 = await prisma.question.create({
    data: {
      label: "Dans quelle ville souhaitez-vous effectuer votre démarche ?",
      order: 3,
      procedureId: carteIdentite.id,
    },
  });

  await prisma.answerOption.createMany({
    data: [
      {
        label: "Première demande",
        questionId: qCNI1.id,
        nextQuestionId: qCNI2.id,
      },
      {
        label: "Renouvellement",
        questionId: qCNI1.id,
        nextQuestionId: qCNI2.id,
      },
      {
        label: "Oui",
        questionId: qCNI2.id,
        nextQuestionId: qCNI3.id,
      },
      {
        label: "Non",
        questionId: qCNI2.id,
        nextQuestionId: qCNI3.id,
      },
      {
        label: "Yaoundé",
        questionId: qCNI3.id,
        identifiedProcedureId: carteIdentite.id,
      },
      {
        label: "Douala",
        questionId: qCNI3.id,
        identifiedProcedureId: carteIdentite.id,
      },
    ],
  });

  // ============================================================
  // 15. QUESTIONS — DECES
  // ============================================================

  const qD1 = await prisma.question.create({
    data: {
      label: "Dans quelles circonstances le décès est-il survenu ?",
      order: 1,
      procedureId: declarationDeces.id,
    },
  });

  const qD2 = await prisma.question.create({
    data: {
      label: "Qui effectue la déclaration ?",
      order: 2,
      procedureId: declarationDeces.id,
    },
  });

  const qD3 = await prisma.question.create({
    data: {
      label: "Le corps a-t-il été retrouvé et peut-il être identifié ?",
      order: 3,
      procedureId: declarationDeces.id,
    },
  });

  await prisma.answerOption.createMany({
    data: [
      {
        label: "À domicile",
        questionId: qD1.id,
        nextQuestionId: qD2.id,
      },
      {
        label: "Dans un établissement hospitalier",
        questionId: qD1.id,
        nextQuestionId: qD2.id,
      },
      {
        label: "Dans un établissement pénitentiaire",
        questionId: qD1.id,
        nextQuestionId: qD2.id,
      },
      {
        label: "Par un parent ou proche",
        questionId: qD2.id,
        nextQuestionId: qD3.id,
      },
      {
        label: "Par une autre personne ayant connaissance certaine du décès",
        questionId: qD2.id,
        nextQuestionId: qD3.id,
      },
      {
        label: "Par le responsable de l'établissement",
        questionId: qD2.id,
        nextQuestionId: qD3.id,
      },
      {
        label: "Oui",
        questionId: qD3.id,
        identifiedProcedureId: declarationDeces.id,
      },
      {
        label: "Non",
        questionId: qD3.id,
        identifiedProcedureId: declarationDeces.id,
      },
    ],
  });

  // ============================================================
  // 16. REQUESTS = POINTS D'ENTREE DU DIAGNOSTIC
  // ============================================================

  const requestNaissance = await prisma.request.create({
    data: {
      title: "Je veux faire certifier un acte de naissance",
      description:
        "Je possède déjà un acte de naissance et je veux savoir comment le faire certifier.",
      procedureId: undefined,
    },
  });

  const requestJugement = await prisma.request.create({
    data: {
      title: "Je n'ai pas d'acte de naissance",
      description:
        "Je veux savoir quelle procédure suivre pour régulariser ma situation.",
    },
  });

  const requestAcademique = await prisma.request.create({
    data: {
      title: "Je veux faire certifier un document académique",
      description:
        "Je possède un diplôme ou un relevé de notes et je veux savoir comment le faire certifier.",
    },
  });

  const requestCNI = await prisma.request.create({
    data: {
      title: "Je veux faire une démarche pour ma CNI",
      description:
        "Je veux savoir comment préparer une première demande ou un renouvellement de Carte Nationale d'Identité.",
    },
  });

  const requestDeces = await prisma.request.create({
    data: {
      title: "Je dois déclarer un décès",
      description:
        "Je veux connaître les démarches à effectuer pour déclarer un décès.",
    },
  });

  // ============================================================
  // 17. RELIER REQUESTS AUX QUESTIONS
  // ============================================================

  await prisma.question.updateMany({
    where: {
      id: {
        in: [qNC1.id],
      },
    },
    data: {
      requestId: requestNaissance.id,
    },
  });

  await prisma.question.updateMany({
    where: {
      id: {
        in: [qJS1.id],
      },
    },
    data: {
      requestId: requestJugement.id,
    },
  });

  await prisma.question.updateMany({
    where: {
      id: {
        in: [qAC1.id],
      },
    },
    data: {
      requestId: requestAcademique.id,
    },
  });

  await prisma.question.updateMany({
    where: {
      id: {
        in: [qCNI1.id],
      },
    },
    data: {
      requestId: requestCNI.id,
    },
  });

  await prisma.question.updateMany({
    where: {
      id: {
        in: [qD1.id],
      },
    },
    data: {
      requestId: requestDeces.id,
    },
  });

  await prisma.request.update({
    where: { id: requestNaissance.id },
    data: {
      rootQuestionId: qNC1.id,
    },
  });

  await prisma.request.update({
    where: { id: requestJugement.id },
    data: {
      rootQuestionId: qJS1.id,
    },
  });

  await prisma.request.update({
    where: { id: requestAcademique.id },
    data: {
      rootQuestionId: qAC1.id,
    },
  });

  await prisma.request.update({
    where: { id: requestCNI.id },
    data: {
      rootQuestionId: qCNI1.id,
    },
  });

  await prisma.request.update({
    where: { id: requestDeces.id },
    data: {
      rootQuestionId: qD1.id,
    },
  });

  // ============================================================
  // 18. RELOAD STEPS TO GET IDS
  // ============================================================

  const stepsNaissance =
    await prisma.step.findMany({
      where: {
        procedureId: naissanceCertification.id,
      },
      orderBy: {
        order: "asc",
      },
    });

  const stepsJugement =
    await prisma.step.findMany({
      where: {
        procedureId: jugementSuppletifNaissance.id,
      },
      orderBy: {
        order: "asc",
      },
    });

  const stepsAcademique =
    await prisma.step.findMany({
      where: {
        procedureId: certificationAcademique.id,
      },
      orderBy: {
        order: "asc",
      },
    });

  const stepsCNI =
    await prisma.step.findMany({
      where: {
        procedureId: carteIdentite.id,
      },
      orderBy: {
        order: "asc",
      },
    });

  const stepsDeces =
    await prisma.step.findMany({
      where: {
        procedureId: declarationDeces.id,
      },
      orderBy: {
        order: "asc",
      },
    });

  // ============================================================
  // 19. TEST USER
  // ============================================================

  const testUser = await prisma.user.create({
    data: {
      phone: "+237690000001",
      name: "Utilisateur Test",
    },
  });

  const testUser2 = await prisma.user.create({
    data: {
      phone: "+237690000002",
      name: "Utilisateur Reprise",
    },
  });

  // ============================================================
  // 20. ADMINISTRATOR
  // ============================================================

  const adminUser = await prisma.user.create({
    data: {
      phone: "+237690000099",
      name: "Administrateur TurtleGuide",
    },
  });

  await prisma.administrator.create({
    data: {
      accessLevel: "SUPER_ADMIN",
      name: "Administrateur TurtleGuide",
      email: "admin@turtleguide.local",
      hashedPassword:
        "$2b$12$example-hash-to-replace-before-production",
      userId: adminUser.id,
    },
  });

  // ============================================================
  // 21. FOLDER TEST — PARCOURS TERMINE
  // ============================================================

  const folderCompleted =
    await prisma.folder.create({
      data: {
        status: FolderStatus.CLOSED,
        userId: testUser.id,
        procedureId: jugementSuppletifNaissance.id,
        requestId: requestJugement.id,
      },
    });

  // Progressions du diagnostic
  await prisma.progression.create({
    data: {
      requestId: requestJugement.id,
      folderId: folderCompleted.id,
      questionId: qJS1.id,
      selectedOptionId:
        (
          await prisma.answerOption.findFirstOrThrow({
            where: {
              questionId: qJS1.id,
              label: "Non",
            },
          })
        ).id,
    },
  });

  // ============================================================
  // 22. ORDER PAID / GENERATED / DOWNLOADED
  // ============================================================

  const stepDocument = stepsJugement.find(
    (step) =>
      step.documentId ===
      modeleRequeteJugementNaissance.id,
  );

  if (!stepDocument) {
    throw new Error(
      "Step du document jugement supplétif introuvable",
    );
  }

  const paidOrder = await prisma.order.create({
    data: {
      status: OrderStatus.DOWNLOADED,
      userId: testUser.id,
      folderId: folderCompleted.id,
      stepId: stepDocument.id,
      documentId: modeleRequeteJugementNaissance.id,
      customizationData: {
        nom: "Tchoumi",
        prenoms: "Jean",
        dateNaissance: "2002-04-15",
        lieuNaissance: "Bafang",
        nomsParents: "Tchoumi Paul / Fopa Marie",
        residence: "Yaoundé",
      },
    },
  });

  await prisma.transaction.create({
    data: {
      reference: "TG-TEST-PAY-0001",
      amount: money(500),
      paymentMethod: "MTN_MOMO",
      status: TransactionStatus.CONFIRMED,
      orderId: paidOrder.id,
    },
  });

  // ============================================================
  // 23. ORDER FAILED
  // ============================================================

  const failedOrder =
    await prisma.order.create({
      data: {
        status: OrderStatus.FAILED,
        userId: testUser.id,
        folderId: folderCompleted.id,
        stepId: stepDocument.id,
        documentId: modeleRequeteJugementNaissance.id,
        customizationData: {
          nom: "Tchoumi",
          prenoms: "Jean",
        },
      },
    });

  await prisma.transaction.create({
    data: {
      reference: "TG-TEST-PAY-0002",
      amount: money(500),
      paymentMethod: "ORANGE_MONEY",
      status: TransactionStatus.FAILED,
      orderId: failedOrder.id,
    },
  });

  // ============================================================
  // 24. FOLDER IN PROGRESS — REPRISE
  // ============================================================

  const folderInProgress =
    await prisma.folder.create({
      data: {
        status: FolderStatus.INITIATED,
        userId: testUser2.id,
        procedureId: certificationAcademique.id,
        requestId: requestAcademique.id,
      },
    });

  const academicOption =
    await prisma.answerOption.findFirstOrThrow({
      where: {
        questionId: qAC1.id,
        label: "Diplôme",
      },
    });

  await prisma.progression.create({
    data: {
      requestId: requestAcademique.id,
      folderId: folderInProgress.id,
      questionId: qAC1.id,
      selectedOptionId: academicOption.id,
    },
  });

  // ============================================================
  // 25. FOLDER DECES
  // ============================================================

  const deathFolder =
    await prisma.folder.create({
      data: {
        status: FolderStatus.INITIATED,
        userId: testUser2.id,
        procedureId: declarationDeces.id,
        requestId: requestDeces.id,
      },
    });

  const deathOption =
    await prisma.answerOption.findFirstOrThrow({
      where: {
        questionId: qD1.id,
        label: "Dans un établissement hospitalier",
      },
    });

  await prisma.progression.create({
    data: {
      requestId: requestDeces.id,
      folderId: deathFolder.id,
      questionId: qD1.id,
      selectedOptionId: deathOption.id,
    },
  });

  // ============================================================
  // 26. FRAUD ALERTS
  // ============================================================

  const deathStep =
    stepsDeces.find((step) => step.order === 3);

  const cniStep =
    stepsCNI.find((step) => step.order === 2);

  if (deathStep) {
    await prisma.fraudAlert.create({
      data: {
        title:
          "Attention aux intermédiaires qui prétendent pouvoir délivrer un acte de décès contre paiement",
        description:
          "TurtleGuide ne délivre pas les actes d'état civil officiels. Vérifiez toujours l'autorité compétente avant tout paiement.",
        stepId: deathStep.id,
      },
    });
  }

  if (cniStep) {
    await prisma.fraudAlert.create({
      data: {
        title:
          "Attention aux faux services de pré-enrôlement",
        description:
          "Utilisez uniquement les canaux officiels pour les opérations liées à la Carte Nationale d'Identité.",
        stepId: cniStep.id,
      },
    });
  }

  // ============================================================
  // 27. DONATION TEST
  // ============================================================

  await prisma.donation.create({
    data: {
      amount: money(1000),
      userId: testUser.id,
    },
  });

  // ============================================================
  // 28. SUMMARY
  // ============================================================

  console.log("");
  console.log("✅ TurtleGuide seed terminé");
  console.log("");

  console.log("Procedures:");
  console.log("  - Certification acte de naissance");
  console.log("  - Jugement supplétif acte de naissance");
  console.log("  - Certification académique");
  console.log("  - Préparation CNI");
  console.log("  - Déclaration de décès");

  console.log("");
  console.log("Utilisateurs de test:");
  console.log("  +237690000001 → parcours terminé + paiement");
  console.log("  +237690000002 → parcours interrompu/reprise");
  console.log("  +237690000099 → administrateur");

  console.log("");
  console.log("Tests disponibles:");
  console.log("  ✓ Diagnostic");
  console.log("  ✓ Questions avec embranchements");
  console.log("  ✓ Progression sauvegardée");
  console.log("  ✓ Folder");
  console.log("  ✓ Documents TurtleGuide");
  console.log("  ✓ Personnalisation");
  console.log("  ✓ Paiement réussi");
  console.log("  ✓ Paiement échoué");
  console.log("  ✓ Téléchargement");
  console.log("  ✓ Alertes fraude");
  console.log("  ✓ Donation");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });