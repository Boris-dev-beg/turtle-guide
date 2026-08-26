import {
  PrismaClient,
  FolderStatus,
  TransactionStatus,
} from "../generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});
async function main() {
  console.log("🌱 Starting seed...");

  // ============================================================
  // CLEAN DATABASE
  // ============================================================

  await prisma.fraudAlert.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.documentPurchase.deleteMany();
  await prisma.document.deleteMany();

  await prisma.answer.deleteMany();
  await prisma.progression.deleteMany();
  await prisma.answerOption.deleteMany();
  await prisma.question.deleteMany();

  await prisma.step.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.process.deleteMany();

  await prisma.areaServed.deleteMany();
  await prisma.administrativeUnit.deleteMany();
  await prisma.administrativeBody.deleteMany();

  await prisma.procedure.deleteMany();
  await prisma.category.deleteMany();

  await prisma.donation.deleteMany();
  await prisma.administrator.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();

  // ============================================================
  // USERS
  // ============================================================

  const user = await prisma.user.create({
    data: {
      phone: "+237690000001",
      name: "Boris Mangwa",
      email: "boris@example.com",
      hashedPassword:
        "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUV",
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      phone: "+237690000002",
      name: "Admin Turtle Guide",
      email: "admin@example.com",
      hashedPassword:
        "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUV",

      administrator: {
        create: {
          accessLevel: "ADMIN",
        },
      },
    },
  });

  console.log("✅ Users created");

  // ============================================================
  // LOCATIONS
  // ============================================================

  const bamegoum = await prisma.location.create({
    data: {
      address: "Centre-ville de Bamegoum",
      city: "Bamegoum",
      latitude: -5.1234,
      longitude: 10.4567,
    },
  });

  const bafoussam = await prisma.location.create({
    data: {
      address: "Centre administratif de Bafoussam",
      city: "Bafoussam",
      latitude: 5.4781,
      longitude: 10.4178,
    },
  });

  const bamenda = await prisma.location.create({
    data: {
      address: "Centre administratif de Bamenda",
      city: "Bamenda",
      latitude: 5.9597,
      longitude: 10.1459,
    },
  });

  console.log("✅ Locations created");

  // ============================================================
  // ADMINISTRATIVE BODIES
  // ============================================================

  const mairie = await prisma.administrativeBody.create({
    data: {
      name: "Mairie",
    },
  });

  const tribunal = await prisma.administrativeBody.create({
    data: {
      name: "Tribunal de Première Instance",
    },
  });

  const prefecture = await prisma.administrativeBody.create({
    data: {
      name: "Préfecture",
    },
  });

  console.log("✅ Administrative bodies created");

  // ============================================================
  // ADMINISTRATIVE UNITS
  // ============================================================

  const tribunalBafoussam = await prisma.administrativeUnit.create({
    data: {
      name: "Tribunal de Première Instance de Bafoussam",
      administrativeBodyId: tribunal.id,
      locationId: bafoussam.id,
    },
  });

  const mairieBafoussam = await prisma.administrativeUnit.create({
    data: {
      name: "Mairie de Bafoussam",
      administrativeBodyId: mairie.id,
      locationId: bafoussam.id,
    },
  });

  const prefectureBafoussam = await prisma.administrativeUnit.create({
    data: {
      name: "Préfecture de Bafoussam",
      administrativeBodyId: prefecture.id,
      locationId: bafoussam.id,
    },
  });

  const tribunalBamenda = await prisma.administrativeUnit.create({
    data: {
      name: "Tribunal de Première Instance de Bamenda",
      administrativeBodyId: tribunal.id,
      locationId: bamenda.id,
    },
  });

  console.log("✅ Administrative units created");

  // ============================================================
  // AREAS SERVED
  // ============================================================

  await prisma.areaServed.create({
    data: {
      name: "Bamegoum",
      locationId: bamegoum.id,
      administrativeUnitId: tribunalBafoussam.id,
    },
  });

  await prisma.areaServed.create({
    data: {
      name: "Bafoussam",
      locationId: bafoussam.id,
      administrativeUnitId: tribunalBafoussam.id,
    },
  });

  await prisma.areaServed.create({
    data: {
      name: "Bafoussam",
      locationId: bafoussam.id,
      administrativeUnitId: mairieBafoussam.id,
    },
  });

  await prisma.areaServed.create({
    data: {
      name: "Bafoussam",
      locationId: bafoussam.id,
      administrativeUnitId: prefectureBafoussam.id,
    },
  });

  await prisma.areaServed.create({
    data: {
      name: "Bamenda",
      locationId: bamenda.id,
      administrativeUnitId: tribunalBamenda.id,
    },
  });

  console.log("✅ Areas served created");

  // ============================================================
  // CATEGORY
  // ============================================================

  const civilStatusCategory = await prisma.category.create({
    data: {
      name: "État civil",
      slug: "etat-civil",
      description:
        "Démarches administratives relatives aux actes d'état civil.",
      isActive: true,
    },
  });

  const identityCategory = await prisma.category.create({
    data: {
      name: "Identité",
      slug: "identite",
      description:
        "Démarches relatives aux documents et justificatifs d'identité.",
      isActive: true,
    },
  });

  console.log("✅ Categories created");

  // ============================================================
  // PROCESSES
  // ============================================================

  const birthCertificateProcess = await prisma.process.create({
    data: {
      title: "Certification d'un acte de naissance",
      description:
        "Démarche permettant de faire certifier un acte de naissance.",
    },
  });

  const birthRegistrationProcess = await prisma.process.create({
    data: {
      title: "Obtention d'un acte de naissance",
      description:
        "Démarche permettant d'obtenir une copie ou un extrait d'acte de naissance.",
    },
  });

  const identityDocumentProcess = await prisma.process.create({
    data: {
      title: "Demande de document d'identité",
      description:
        "Démarche permettant d'effectuer une demande de document d'identité.",
    },
  });

  console.log("✅ Processes created");

  // ============================================================
  // PROCEDURE
  // ============================================================

  const birthProcedure = await prisma.procedure.create({
    data: {
      title: "Je souhaite effectuer une démarche concernant mon acte de naissance",
      description:
        "Répondez aux questions suivantes afin d'identifier la démarche adaptée.",
      legalBasis: "Législation camerounaise relative à l'état civil.",
      categoryId: civilStatusCategory.id,
      isActive: true,
    },
  });

  const identityProcedure = await prisma.procedure.create({
    data: {
      title: "Je souhaite obtenir un document d'identité",
      description:
        "Ce questionnaire permet d'identifier la démarche correspondant à votre situation.",
      legalBasis: "Législation camerounaise relative aux documents d'identité.",
      categoryId: identityCategory.id,
      isActive: true,
    },
  });

  console.log("✅ Procedures created");

  // ============================================================
  // QUESTIONS - BIRTH PROCEDURE
  // ============================================================

  const birthQuestion = await prisma.question.create({
    data: {
      title: "Quel est votre besoin concernant votre acte de naissance ?",
      description: "Sélectionnez la situation qui correspond à votre besoin.",
      procedureId: birthProcedure.id,
    },
  });

  const certificationQuestion = await prisma.question.create({
    data: {
      title: "L'acte de naissance est-il déjà disponible ?",
      description:
        "Cette information permet de déterminer la démarche à effectuer.",
      procedureId: birthProcedure.id,
    },
  });

  // ============================================================
  // ANSWER OPTIONS
  // ============================================================

  await prisma.answerOption.createMany({
    data: [
      {
        label: "Je veux faire certifier mon acte",
        questionId: birthQuestion.id,
        processId: birthCertificateProcess.id,
      },
      {
        label: "Je n'ai pas encore d'acte de naissance",
        questionId: birthQuestion.id,
        nextQuestionId: certificationQuestion.id,
      },
      {
        label: "Oui",
        questionId: certificationQuestion.id,
        processId: birthCertificateProcess.id,
      },
      {
        label: "Non",
        questionId: certificationQuestion.id,
        processId: birthRegistrationProcess.id,
      },
    ],
  });

  // ============================================================
  // IDENTITY QUESTIONS
  // ============================================================

  const identityQuestion = await prisma.question.create({
    data: {
      title: "Pourquoi souhaitez-vous obtenir un document d'identité ?",
      description: "Choisissez la situation qui vous correspond.",
      procedureId: identityProcedure.id,
    },
  });

  await prisma.answerOption.createMany({
    data: [
      {
        label: "Première demande",
        questionId: identityQuestion.id,
        processId: identityDocumentProcess.id,
      },
      {
        label: "Renouvellement",
        questionId: identityQuestion.id,
        processId: identityDocumentProcess.id,
      },
    ],
  });

  console.log("✅ Questions and answer options created");

  // ============================================================
  // DOCUMENTS
  // ============================================================

  const certifiedCopyDocument = await prisma.document.create({
    data: {
      name: "Formulaire de demande de certification",
      price: 1500,
      customizable: true,
      legalWarning:
        "Vérifiez les informations avant toute utilisation du document.",
    },
  });

  const birthCertificateForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande d'acte de naissance",
      price: 1000,
      customizable: true,
    },
  });

  const identityForm = await prisma.document.create({
    data: {
      name: "Formulaire de demande de document d'identité",
      price: 2000,
      customizable: true,
    },
  });

  console.log("✅ Documents created");

  // ============================================================
  // STEPS
  // ============================================================

  const certificationStep = await prisma.step.create({
    data: {
      title: "Préparer votre dossier",
      description:
        "Préparez les documents nécessaires avant de vous rendre au service compétent.",
      processId: birthCertificateProcess.id,
      administrativeBodyId: tribunal.id,
      documents: {
        connect: [{ id: certifiedCopyDocument.id }],
      },
    },
  });

  await prisma.step.create({
    data: {
      title: "Se rendre au service compétent",
      description:
        "Présentez-vous auprès du service administratif compétent.",
      processId: birthCertificateProcess.id,
      administrativeBodyId: tribunal.id,
    },
  });

  await prisma.step.create({
    data: {
      title: "Déposer la demande",
      description:
        "Déposez votre demande auprès du service administratif.",
      processId: birthRegistrationProcess.id,
      administrativeBodyId: mairie.id,
      documents: {
        connect: [{ id: birthCertificateForm.id }],
      },
    },
  });

  await prisma.step.create({
    data: {
      title: "Effectuer la demande",
      description:
        "Présentez les documents requis pour votre demande.",
      processId: identityDocumentProcess.id,
      administrativeBodyId: prefecture.id,
      documents: {
        connect: [{ id: identityForm.id }],
      },
    },
  });

  console.log("✅ Steps created");

  // ============================================================
  // FRAUD ALERT
  // ============================================================

  await prisma.fraudAlert.create({
    data: {
      title: "Attention aux intermédiaires non officiels",
      description:
        "Ne versez pas d'argent à une personne prétendant pouvoir accélérer votre démarche sans justificatif officiel.",
      stepId: certificationStep.id,
    },
  });

  console.log("✅ Fraud alerts created");

  // ============================================================
  // FOLDER
  // ============================================================

  const folder = await prisma.folder.create({
    data: {
      name: "Dossier - Certification acte de naissance",
      status: FolderStatus.PENDING,
      userId: user.id,
      procedureId: birthProcedure.id,
      processId: birthCertificateProcess.id,
      locationId: bamegoum.id,
    },
  });

  // ============================================================
  // ANSWER / PROGRESSION
  // ============================================================

  const certificationOption = await prisma.answerOption.findFirst({
    where: {
      questionId: birthQuestion.id,
      processId: birthCertificateProcess.id,
    },
  });

  if (!certificationOption) {
    throw new Error("Certification answer option not found");
  }

  await prisma.answer.create({
    data: {
      folderId: folder.id,
      optionId: certificationOption.id,
    },
  });

  await prisma.progression.create({
    data: {
      folderId: folder.id,
      currentQuestionId: birthQuestion.id,
    },
  });

  console.log("✅ Folder, answer and progression created");

  // ============================================================
  // DOCUMENT PURCHASE
  // ============================================================

  const purchase = await prisma.documentPurchase.create({
    data: {
      purchaseDate: new Date(),
      amount: certifiedCopyDocument.price,
      userId: user.id,
      documentId: certifiedCopyDocument.id,
    },
  });

  // ============================================================
  // TRANSACTION
  // ============================================================

  await prisma.transaction.create({
    data: {
      reference: `TX-${Date.now()}`,
      amount: purchase.amount,
      paymentMethod: "MOBILE_MONEY",
      date: new Date(),
      status: TransactionStatus.SUCCESS,
      documentPurchaseId: purchase.id,
    },
  });

  console.log("✅ Purchase and transaction created");

  // ============================================================
  // DONATION
  // ============================================================

  const donation = await prisma.donation.create({
    data: {
      amount: 500,
      userId: user.id,
    },
  });

  await prisma.transaction.create({
    data: {
      reference: `DON-${Date.now()}`,
      amount: donation.amount,
      paymentMethod: "MOBILE_MONEY",
      date: new Date(),
      status: TransactionStatus.SUCCESS,
      donationId: donation.id,
    },
  });

  console.log("✅ Donation created");

  console.log("\n🎉 Seed completed successfully!");
  console.log(`👤 User: ${user.email}`);
  console.log(`👤 Admin: ${adminUser.email}`);
  console.log(`📁 Folder: ${folder.id}`);
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