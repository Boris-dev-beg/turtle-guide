/**
 * TurtleGuide — seed.ts
 * ============================================================
 * Ce seed ne crée AUCUN compte (ni utilisateur, ni administrateur).
 * Il ne peuple que le référentiel "métier" : catégories, procédures,
 * questions/options, démarches (processes), étapes, documents,
 * corps administratifs, unités administratives, localisations et
 * zones desservies.
 *
 * SOURCES UTILISÉES (aucune donnée juridique inventée) :
 * - Loi n°2024/016 du 23 décembre 2024 portant organisation du système
 *   d'enregistrement des faits d'état civil au Cameroun.
 * - Ordonnance n°81/02 du 29 juin 1981 portant organisation de l'état
 *   civil, modifiée et complétée par la Loi n°2011/011 du 6 mai 2011.
 * - Décret présidentiel du 4 août 2016 fixant les caractéristiques et
 *   modalités d'établissement et de délivrance de la Carte Nationale
 *   d'Identité (CNI), et décret portant régime des titres identitaires
 *   (définition de la "demande tardive" de CNI : première demande
 *   introduite après 30 ans).
 * - Loi n°2019/024 du 24 décembre 2019 portant Code Général des
 *   Collectivités Territoriales Décentralisées (attributions des
 *   communes).
 *
 * NOTE SUR LES IMAGES : les liens utilisent picsum.photos (CDN public,
 * gratuit, sans clé API, garanti disponible) plutôt que des IDs de
 * photos Unsplash devinés à la main — je n'ai pas pu vérifier
 * individuellement que des IDs Unsplash choisis "à l'aveugle"
 * résolvent réellement. Remplacez `image` par de vraies URLs
 * `https://images.unsplash.com/photo-...` si vous en sélectionnez
 * vous-même depuis unsplash.com.
 *
 * NOTE SUR LES PRIX (Document.price) : ce sont des tarifs de SERVICE
 * proposés par la plateforme TurtleGuide pour la préparation d'un
 * document (formulaire pré-rempli, modèle de requête, etc.) — ce ne
 * sont PAS les frais administratifs officiels (timbres, greffe...),
 * qui restent dus séparément par l'utilisateur auprès de l'administration.
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
  console.log("🌱 Starting seed (procedures only — no accounts)...");

  // ============================================================
  // CLEAN DATABASE
  // ============================================================
  // Ordre inverse des dépendances, y compris les tables liées aux
  // comptes : on nettoie tout pour garantir un état reproductible,
  // même si ce seed ne recrée ensuite aucun compte.

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
  // LOCATIONS — villes réelles du Cameroun (coordonnées approximatives
  // des centres-villes)
  // ============================================================

  const cities = [
    { key: "yaounde", city: "Yaoundé", address: "Centre-ville de Yaoundé", latitude: 3.848, longitude: 11.5021 },
    { key: "douala", city: "Douala", address: "Centre-ville de Douala", latitude: 4.0511, longitude: 9.7679 },
    { key: "bafoussam", city: "Bafoussam", address: "Centre administratif de Bafoussam", latitude: 5.4781, longitude: 10.4176 },
    { key: "bamenda", city: "Bamenda", address: "Centre administratif de Bamenda", latitude: 5.9631, longitude: 10.1591 },
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
  // ADMINISTRATIVE BODIES (corps administratifs génériques)
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

  console.log("✅ Administrative bodies created");

  // ============================================================
  // ADMINISTRATIVE UNITS + AREAS SERVED
  // (une antenne par corps administratif et par ville, desservant
  // sa propre ville — permet la résolution dynamique par localisation)
  // ============================================================

  const bodies = [
    { body: mairie, label: "Mairie" },
    { body: tribunal, label: "Tribunal de Première Instance" },
    { body: dgsn, label: "Centre d'enrôlement DGSN" },
    { body: commissariat, label: "Commissariat de Police" },
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
  // CATEGORIES
  // ============================================================

  const civilStatusCategory = await prisma.category.create({
    data: {
      name: "État civil",
      slug: "etat-civil",
      description:
        "Démarches relatives aux actes et documents d'état civil : naissance, déclaration, jugement supplétif, rectification.",
      isActive: true,
    },
  });

  const identityCategory = await prisma.category.create({
    data: {
      name: "Identité",
      slug: "identite",
      description:
        "Démarches relatives à la Carte Nationale d'Identité (première demande, renouvellement, perte ou vol).",
      isActive: true,
    },
  });

  const residenceCategory = await prisma.category.create({
    data: {
      name: "Résidence et administration",
      slug: "residence-administration",
      description:
        "Démarches liées à la résidence et aux formalités administratives locales.",
      isActive: true,
    },
  });

  console.log("✅ Categories created");

  // ============================================================
  // PROCEDURE 1 — ÉTAT CIVIL / ACTE DE NAISSANCE
  // ============================================================

  const birthProcedure = await prisma.procedure.create({
    data: {
      title: "Acte de naissance",
      description:
        "Ce questionnaire identifie la démarche exacte à suivre selon votre situation : naissance jamais déclarée, copie d'un acte existant, ou correction d'un acte comportant une erreur.",
      image: img("acte-naissance"),
      legalBasis:
        "Loi n°2024/016 du 23 décembre 2024 portant organisation du système d'enregistrement des faits d'état civil au Cameroun ; Ordonnance n°81/02 du 29 juin 1981 portant organisation de l'état civil, modifiée et complétée par la Loi n°2011/011 du 6 mai 2011.",
      categoryId: civilStatusCategory.id,
      isActive: true,
    },
  });

  // --- Processes (démarches identifiées à l'issue du diagnostic) ---

  const normalDeclarationProcess = await prisma.process.create({
    data: {
      title: "Déclaration normale de naissance",
      description:
        "La naissance est déclarée dans le délai légal de quatre-vingt-dix (90) jours suivant l'accouchement. La déclaration et la première délivrance de l'acte sont gratuites dans ce délai.",
    },
  });

  const lateDeclarationProcess = await prisma.process.create({
    data: {
      title: "Déclaration tardive par réquisition du Procureur",
      description:
        "La naissance n'a pas été déclarée dans le délai légal de 90 jours mais a moins de six (6) mois. L'enregistrement se fait sur réquisition du Procureur de la République, conformément à la loi.",
    },
  });

  const suppletiveJudgmentProcess = await prisma.process.create({
    data: {
      title: "Jugement supplétif d'acte de naissance",
      description:
        "La naissance n'a pas été déclarée dans les six (6) mois suivant l'accouchement : passé ce délai, l'acte ne peut être établi que par un jugement rendu par le Tribunal de Première Instance compétent.",
    },
  });

  const birthCopyProcess = await prisma.process.create({
    data: {
      title: "Copie d'un acte de naissance existant",
      description:
        "Un acte de naissance a déjà été dressé pour la personne concernée : il s'agit d'obtenir une copie ou un extrait certifié conforme auprès du centre d'état civil où l'acte a été enregistré.",
    },
  });

  const birthRectificationProcess = await prisma.process.create({
    data: {
      title: "Rectification d'un acte de naissance",
      description:
        "L'acte de naissance existe mais comporte une erreur matérielle (nom, filiation, date...) qui doit être corrigée par un jugement supplétif de rectification.",
    },
  });

  // --- Documents ---

  const birthDeclarationForm = await prisma.document.create({
    data: {
      name: "Fiche de déclaration de naissance pré-remplie",
      price: 500,
      customizable: true,
      legalWarning:
        "Ce document est une aide à la préparation de votre dossier. La déclaration de naissance elle-même reste gratuite et doit être faite en personne auprès de l'officier d'état civil.",
    },
  });

  const requisitionRequestForm = await prisma.document.create({
    data: {
      name: "Modèle de demande de réquisition au Procureur de la République",
      price: 1500,
      customizable: true,
      legalWarning:
        "Ce modèle facilite la constitution du dossier. Il ne remplace ni le certificat de non-inscription délivré par la mairie, ni la décision du Procureur de la République.",
    },
  });

  const suppletiveRequestForm = await prisma.document.create({
    data: {
      name: "Modèle de requête en jugement supplétif d'acte de naissance",
      price: 2000,
      customizable: true,
      legalWarning:
        "Ce modèle de requête est une aide à la rédaction. Il ne se substitue pas à une consultation juridique et ne garantit pas l'issue de la procédure devant le tribunal.",
    },
  });

  const birthCopyRequestForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande de copie d'acte de naissance",
      price: 500,
      customizable: true,
      legalWarning:
        "Des frais de timbre (fiscal et communal) restent dus directement à la mairie, en plus du tarif de préparation de ce formulaire.",
    },
  });

  const rectificationRequestForm = await prisma.document.create({
    data: {
      name: "Modèle de requête en rectification d'acte de naissance",
      price: 2000,
      customizable: true,
      legalWarning:
        "Ce modèle reprend les mentions habituellement exigées (identité du requérant, filiation, motifs détaillés) mais ne remplace pas une assistance juridique.",
    },
  });

  // --- Question tree ---

  const birthQuestion = await prisma.question.create({
    data: {
      title: "Quelle est votre situation concernant l'acte de naissance ?",
      description: "Sélectionnez la situation qui correspond le mieux à votre besoin.",
      procedureId: birthProcedure.id,
    },
  });

  const birthNeverDeclaredQuestion = await prisma.question.create({
    data: {
      title: "Depuis combien de temps la naissance n'a-t-elle pas été déclarée ?",
      description:
        "Cette durée détermine la procédure applicable (déclaration normale, déclaration tardive ou jugement supplétif).",
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

  // --- Steps ---

  await prisma.step.create({
    data: {
      title: "Réunir les pièces justificatives de la naissance",
      description:
        "Préparez les informations relatives à la naissance (lieu, date, identité des parents) nécessaires à la déclaration.",
      processId: normalDeclarationProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: birthDeclarationForm.id }] },
    },
  });

  await prisma.step.create({
    data: {
      title: "Déclarer la naissance au centre d'état civil du lieu de naissance",
      description:
        "La déclaration doit être faite dans les 90 jours suivant l'accouchement ; elle est gratuite dans ce délai.",
      processId: normalDeclarationProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Retirer le premier exemplaire de l'acte de naissance",
      description: "Récupérez l'acte de naissance délivré par l'officier d'état civil.",
      processId: normalDeclarationProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  const requisitionStep = await prisma.step.create({
    data: {
      title: "Obtenir un certificat de non-inscription",
      description:
        "Ce certificat, délivré par la mairie du lieu de naissance, atteste que la naissance n'a pas encore été enregistrée.",
      processId: lateDeclarationProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Saisir le Procureur de la République pour obtenir une réquisition",
      description:
        "La demande est adressée au Procureur de la République près le Tribunal de Première Instance compétent.",
      processId: lateDeclarationProcess.id,
      administrativeBodyId: tribunal.id,
      documents: { connect: [{ id: requisitionRequestForm.id }] },
    },
  });

  await prisma.step.create({
    data: {
      title: "Présenter la réquisition à l'officier d'état civil",
      description:
        "Une fois la réquisition obtenue, elle permet à l'officier d'état civil d'enregistrer la naissance.",
      processId: lateDeclarationProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Obtenir un certificat de non-inscription",
      description:
        "Ce certificat, délivré par la mairie du lieu de naissance, est une pièce obligatoire du dossier de jugement supplétif.",
      processId: suppletiveJudgmentProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Obtenir un certificat d'âge apparent",
      description:
        "Ce certificat médical, établi par un médecin, est requis lorsque la date de naissance exacte n'est pas connue avec certitude.",
      processId: suppletiveJudgmentProcess.id,
    },
  });

  const suppletiveTribunalStep = await prisma.step.create({
    data: {
      title: "Déposer la requête en jugement supplétif",
      description:
        "La requête est déposée devant le Tribunal de Première Instance du ressort du centre d'état civil où l'acte aurait dû être dressé.",
      processId: suppletiveJudgmentProcess.id,
      administrativeBodyId: tribunal.id,
      documents: { connect: [{ id: suppletiveRequestForm.id }] },
    },
  });

  await prisma.step.create({
    data: {
      title: "Assister à l'audience et obtenir le jugement",
      description: "Le tribunal statue et rend le jugement supplétif d'acte de naissance.",
      processId: suppletiveJudgmentProcess.id,
      administrativeBodyId: tribunal.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Faire transcrire le jugement à la mairie",
      description:
        "Le jugement rendu doit être transcrit dans les registres d'état civil de la mairie concernée pour donner lieu à un acte de naissance.",
      processId: suppletiveJudgmentProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Se présenter au centre d'état civil avec les références de l'acte",
      description:
        "Munissez-vous du nom, de la date de naissance et, si possible, du numéro de l'acte déjà enregistré.",
      processId: birthCopyProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: birthCopyRequestForm.id }] },
    },
  });

  await prisma.step.create({
    data: {
      title: "Payer les frais de timbre et retirer la copie",
      description:
        "Les frais de timbre fiscal et communal sont réglés directement à la mairie avant la remise de la copie certifiée conforme.",
      processId: birthCopyProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Constituer le dossier de demande de rectification",
      description:
        "Le dossier doit préciser l'identité du requérant, la filiation de la personne concernée par la rectification, et les motifs détaillés de la demande.",
      processId: birthRectificationProcess.id,
      documents: { connect: [{ id: rectificationRequestForm.id }] },
    },
  });

  await prisma.step.create({
    data: {
      title: "Déposer la requête devant le Tribunal de Première Instance",
      description:
        "La requête est déposée devant la juridiction du ressort du centre d'état civil où l'acte a été dressé.",
      processId: birthRectificationProcess.id,
      administrativeBodyId: tribunal.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Faire transcrire la mention rectificative",
      description:
        "Une fois le jugement supplétif de rectification obtenu, la mention rectificative est transcrite sur l'acte à la mairie.",
      processId: birthRectificationProcess.id,
      administrativeBodyId: mairie.id,
    },
  });

  console.log("✅ Procedure 1 (Acte de naissance) created");

  // ============================================================
  // PROCEDURE 2 — IDENTITÉ / CARTE NATIONALE D'IDENTITÉ
  // ============================================================

  const identityProcedure = await prisma.procedure.create({
    data: {
      title: "Carte Nationale d'Identité",
      description:
        "Ce questionnaire identifie la démarche correspondant à votre situation : première demande, renouvellement, ou perte/vol de votre Carte Nationale d'Identité (CNI).",
      image: img("carte-identite"),
      legalBasis:
        "Décret présidentiel du 4 août 2016 fixant les caractéristiques et modalités d'établissement et de délivrance de la Carte Nationale d'Identité ; décret portant régime des titres identitaires (pré-enrôlement en ligne et enrôlement biométrique par la Délégation Générale à la Sûreté Nationale).",
      categoryId: identityCategory.id,
      isActive: true,
    },
  });

  const firstRequestProcess = await prisma.process.create({
    data: {
      title: "Première demande de Carte Nationale d'Identité",
      description:
        "Démarche de première demande pour un citoyen n'ayant jamais possédé de Carte Nationale d'Identité.",
    },
  });

  const lateFirstRequestProcess = await prisma.process.create({
    data: {
      title: "Première demande tardive de Carte Nationale d'Identité",
      description:
        "Au sens du décret présidentiel relatif au régime des titres identitaires, est qualifiée de « demande tardive » toute première demande de Carte Nationale d'Identité introduite au-delà de trente (30) ans. La procédure d'enrôlement reste identique, avec un suivi spécifique du dossier.",
    },
  });

  const renewalProcess = await prisma.process.create({
    data: {
      title: "Renouvellement de la Carte Nationale d'Identité",
      description:
        "Démarche de renouvellement pour un titulaire possédant déjà une Carte Nationale d'Identité (durée de validité : 10 ans).",
    },
  });

  const lostStolenProcess = await prisma.process.create({
    data: {
      title: "Déclaration de perte ou de vol et nouvelle demande de CNI",
      description:
        "Démarche à suivre lorsque la Carte Nationale d'Identité a été perdue ou volée, nécessitant une déclaration préalable auprès de la police avant tout nouvel enrôlement.",
    },
  });

  const preEnrollmentForm = await prisma.document.create({
    data: {
      name: "Fiche de pré-enrôlement CNI pré-remplie",
      price: 500,
      customizable: true,
      legalWarning:
        "Le pré-enrôlement officiel s'effectue exclusivement sur la plateforme idcam.cm ; ce document est une aide à la préparation des informations à y renseigner.",
    },
  });

  const identityQuestion = await prisma.question.create({
    data: {
      title: "Quelle est votre situation concernant la Carte Nationale d'Identité ?",
      description: "Sélectionnez la situation qui correspond à votre besoin.",
      procedureId: identityProcedure.id,
    },
  });

  const identityAgeQuestion = await prisma.question.create({
    data: {
      title: "Quel est votre âge ?",
      description:
        "Une première demande introduite après 30 ans est administrativement qualifiée de « demande tardive ».",
      procedureId: identityProcedure.id,
    },
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
        description:
          "Le pré-enrôlement se fait au moyen d'une adresse électronique, avec prise de rendez-vous à un poste d'enrôlement après paiement du droit de timbre correspondant.",
        processId: process.id,
        documents: { connect: [{ id: preEnrollmentForm.id }] },
      },
    });

    await prisma.step.create({
      data: {
        title: "Se présenter au poste d'enrôlement de la DGSN",
        description:
          "Présentez-vous avec les pièces requises (acte de naissance, et le cas échéant certificat de nationalité).",
        processId: process.id,
        administrativeBodyId: dgsn.id,
      },
    });

    await prisma.step.create({
      data: {
        title: "Effectuer l'enrôlement biométrique",
        description: "Vos données biométriques et d'identité sont enregistrées au poste d'enrôlement.",
        processId: process.id,
        administrativeBodyId: dgsn.id,
      },
    });

    await prisma.step.create({
      data: {
        title: "Retirer la Carte Nationale d'Identité",
        description: "Retirez votre carte au centre indiqué lors de l'enrôlement.",
        processId: process.id,
        administrativeBodyId: dgsn.id,
      },
    });
  }

  await prisma.step.create({
    data: {
      title: "Effectuer le pré-enrôlement en ligne en précisant un renouvellement",
      description: "Indiquez sur idcam.cm qu'il s'agit d'un renouvellement et non d'une première demande.",
      processId: renewalProcess.id,
      documents: { connect: [{ id: preEnrollmentForm.id }] },
    },
  });

  await prisma.step.create({
    data: {
      title: "Se présenter au poste d'enrôlement avec l'ancienne carte",
      description: "L'ancienne carte doit être restituée lors du dépôt du dossier de renouvellement.",
      processId: renewalProcess.id,
      administrativeBodyId: dgsn.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Effectuer le nouvel enrôlement biométrique",
      description: "Vos données biométriques sont mises à jour.",
      processId: renewalProcess.id,
      administrativeBodyId: dgsn.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Retirer la nouvelle carte",
      description: "Retirez la nouvelle Carte Nationale d'Identité au centre indiqué.",
      processId: renewalProcess.id,
      administrativeBodyId: dgsn.id,
    },
  });

  const lossDeclarationStep = await prisma.step.create({
    data: {
      title: "Faire une déclaration de perte ou de vol",
      description:
        "Rendez-vous au commissariat de police le plus proche pour obtenir un récépissé de déclaration de perte ou de vol.",
      processId: lostStolenProcess.id,
      administrativeBodyId: commissariat.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Effectuer un nouveau pré-enrôlement sur idcam.cm",
      description: "Renseignez les informations de votre nouvelle demande en ligne.",
      processId: lostStolenProcess.id,
      documents: { connect: [{ id: preEnrollmentForm.id }] },
    },
  });

  await prisma.step.create({
    data: {
      title: "Se présenter au poste d'enrôlement de la DGSN avec le récépissé",
      description: "Le récépissé de déclaration de perte ou de vol est indispensable au dépôt du dossier.",
      processId: lostStolenProcess.id,
      administrativeBodyId: dgsn.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Retirer la nouvelle carte",
      description: "Retirez votre nouvelle Carte Nationale d'Identité au centre indiqué.",
      processId: lostStolenProcess.id,
      administrativeBodyId: dgsn.id,
    },
  });

  console.log("✅ Procedure 2 (Carte Nationale d'Identité) created");

  // ============================================================
  // PROCEDURE 3 — RÉSIDENCE / ATTESTATION DE RÉSIDENCE
  // ============================================================

  const residenceProcedure = await prisma.procedure.create({
    data: {
      title: "Attestation de résidence",
      description:
        "Démarche permettant d'obtenir une attestation de résidence auprès de la mairie de son lieu de résidence.",
      image: img("attestation-residence"),
      legalBasis:
        "Loi n°2019/024 du 24 décembre 2019 portant Code Général des Collectivités Territoriales Décentralisées, relative notamment aux attributions des communes en matière de services à la population.",
      categoryId: residenceCategory.id,
      isActive: true,
    },
  });

  const residenceCertificateProcess = await prisma.process.create({
    data: {
      title: "Obtenir une attestation de résidence",
      description:
        "Démarche à suivre auprès de la mairie du lieu de résidence pour obtenir une attestation de résidence.",
    },
  });

  const residenceForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande d'attestation de résidence",
      price: 500,
      customizable: true,
      legalWarning:
        "Le formulaire ne dispense pas des démarches préalables usuellement requises (visa du chef de quartier) avant présentation à la mairie.",
    },
  });

  const residenceQuestion = await prisma.question.create({
    data: {
      title: "Résidez-vous actuellement dans la commune concernée ?",
      description: "Cette information permet de confirmer la mairie compétente pour votre demande.",
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
      description:
        "Dans la pratique administrative courante, la demande d'attestation de résidence est habituellement visée par l'autorité du quartier avant d'être présentée à la mairie.",
      processId: residenceCertificateProcess.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Se présenter à la mairie avec une pièce d'identité",
      description:
        "Présentez la demande visée, accompagnée d'une pièce d'identité, au service compétent de la mairie de votre lieu de résidence.",
      processId: residenceCertificateProcess.id,
      administrativeBodyId: mairie.id,
      documents: { connect: [{ id: residenceForm.id }] },
    },
  });

  console.log("✅ Procedure 3 (Attestation de résidence) created");

  // ============================================================
  // FRAUD ALERTS
  // (mises en garde génériques, cohérentes avec le CDC, sans
  // statistique inventée)
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
        "Méfiez-vous de toute personne proposant, contre paiement, de réaliser à votre place un pré-enrôlement qui reste accessible directement et gratuitement sur idcam.cm (hors droit de timbre officiel).",
      stepId: lossDeclarationStep.id,
    },
  });

  console.log("✅ Fraud alerts created");

  console.log("\n🎉 Seed completed successfully!");
  console.log(`📂 Categories: État civil, Identité, Résidence et administration`);
  console.log(`📄 Procedures: Acte de naissance, Carte Nationale d'Identité, Attestation de résidence`);
  console.log(`🏛️  Administrative bodies: Mairie, Tribunal de Première Instance, DGSN, Commissariat`);
  console.log(`📍 Locations: Yaoundé, Douala, Bafoussam, Bamenda`);
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