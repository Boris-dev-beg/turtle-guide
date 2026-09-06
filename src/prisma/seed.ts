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

  // Tables Better Auth 
  await prisma.account.deleteMany(); 
  await prisma.session.deleteMany(); 
  await prisma.verification.deleteMany(); 

  await prisma.administrator.deleteMany(); 
  await prisma.user.deleteMany(); 

  console.log("🗑️ Database cleaned"); 

  // ============================================================ 
  // USERS 
  // ============================================================ 

  const user = await prisma.user.create({ 
    data: { 
      id: "user_boris_001", 
      name: "Boris Mangwa", 
      email: "boris@example.com", 
      emailVerified: true, 
    }, 
  }); 

  const adminUser = await prisma.user.create({ 
    data: { 
      id: "user_admin_001", 
      name: "Administrateur TurtleGuide", 
      email: "admin@example.com", 
      emailVerified: true, 

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
      latitude: 5.52, 
      longitude: 10.42, 
    }, 
  }); 

  const bafoussam = await prisma.location.create({ 
    data: { 
      address: "Centre administratif de Bafoussam", 
      city: "Bafoussam", 
      latitude: 5.4778, 
      longitude: 10.4176, 
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

  const prefecture = await prisma.administrativeBody.create({ 
    data: { 
      name: "Préfecture", 
    }, 
  }); 

  const tribunal = await prisma.administrativeBody.create({ 
    data: { 
      name: "Tribunal de Première Instance", 
    }, 
  }); 

  console.log("✅ Administrative bodies created"); 

  // ============================================================ 
  // ADMINISTRATIVE UNITS 
  // ============================================================ 

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

  const tribunalBafoussam = await prisma.administrativeUnit.create({ 
    data: { 
      name: "Tribunal de Première Instance de Bafoussam", 
      administrativeBodyId: tribunal.id, 
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

  await prisma.areaServed.createMany({ 
    data: [ 
      { 
        name: "Bafoussam", 
        locationId: bafoussam.id, 
        administrativeUnitId: mairieBafoussam.id, 
      }, 
      { 
        name: "Bafoussam", 
        locationId: bafoussam.id, 
        administrativeUnitId: prefectureBafoussam.id, 
      }, 
      { 
        name: "Bafoussam", 
        locationId: bafoussam.id, 
        administrativeUnitId: tribunalBafoussam.id, 
      }, 
      { 
        name: "Bamegoum", 
        locationId: bamegoum.id, 
        administrativeUnitId: tribunalBafoussam.id, 
      }, 
      { 
        name: "Bamenda", 
        locationId: bamenda.id, 
        administrativeUnitId: tribunalBamenda.id, 
      }, 
    ], 
  }); 

  console.log("✅ Areas served created"); 

  // ============================================================ 
  // CATEGORIES 
  // ============================================================ 

  const civilStatusCategory = await prisma.category.create({ 
    data: { 
      name: "État civil", 
      slug: "etat-civil", 
      description: 
        "Démarches administratives relatives aux actes et documents d'état civil.", 
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

  const residenceCategory = await prisma.category.create({ 
    data: { 
      name: "Résidence et administration", 
      slug: "residence-administration", 
      description: 
        "Démarches liées à la résidence et aux formalités administratives.", 
      isActive: true, 
    }, 
  }); 

  console.log("✅ Categories created"); 

  // ============================================================ 
  // PROCEDURES 
  // ============================================================ 

  const birthProcedure = await prisma.procedure.create({ 
    data: { 
      title: "Démarche concernant un acte de naissance", 
      description: 
        "Répondez aux questions afin d'identifier la démarche adaptée à votre situation.", 
      legalBasis: "Législation camerounaise relative à l'état civil.", 
      categoryId: civilStatusCategory.id, 
      isActive: true, 
    }, 
  }); 

  const identityProcedure = await prisma.procedure.create({ 
    data: { 
      title: "Obtenir ou renouveler un document d'identité", 
      description: 
        "Ce questionnaire permet d'identifier la démarche correspondant à votre situation.", 
      legalBasis: 
        "Législation camerounaise relative aux documents d'identité.", 
      categoryId: identityCategory.id, 
      isActive: true, 
    }, 
  }); 

  const residenceProcedure = await prisma.procedure.create({ 
    data: { 
      title: "Effectuer une démarche liée à la résidence", 
      description: 
        "Identifiez la démarche administrative correspondant à votre besoin.", 
      legalBasis: 
        "Réglementation applicable aux démarches administratives locales.", 
      categoryId: residenceCategory.id, 
      isActive: true, 
    }, 
  }); 

  console.log("✅ Procedures created"); 

  // ============================================================ 
  // PROCESSES 
  // ============================================================ 

  const birthCertificateProcess = await prisma.process.create({ 
    data: { 
      title: "Obtenir une copie d'acte de naissance", 
      description: 
        "Démarche permettant d'obtenir une copie ou un extrait d'acte de naissance.", 
    }, 
  }); 

  const birthCertificationProcess = await prisma.process.create({ 
    data: { 
      title: "Faire certifier un acte de naissance", 
      description: 
        "Démarche permettant de faire certifier une copie d'acte de naissance.", 
    }, 
  }); 

  const firstIdentityProcess = await prisma.process.create({ 
    data: { 
      title: "Première demande de document d'identité", 
      description: 
        "Démarche pour effectuer une première demande de document d'identité.", 
    }, 
  }); 

  const renewalIdentityProcess = await prisma.process.create({ 
    data: { 
      title: "Renouvellement d'un document d'identité", 
      description: 
        "Démarche pour renouveler un document d'identité existant.", 
    }, 
  }); 

  const residenceCertificateProcess = await prisma.process.create({ 
    data: { 
      title: "Obtenir une attestation de résidence", 
      description: 
        "Démarche permettant d'obtenir une attestation de résidence.", 
    }, 
  }); 

  console.log("✅ Processes created"); 

  /// ============================================================ 
// QUESTIONS - BIRTH PROCEDURE 
// ============================================================ 

const birthQuestion = await prisma.question.create({ 
  data: { 
    title: "Quel est votre besoin concernant votre acte de naissance ?", 
    description: 
      "Sélectionnez la situation qui correspond le mieux à votre besoin.", 
    procedureId: birthProcedure.id, 
  }, 
}); 

const birthCopyQuestion = await prisma.question.create({ 
  data: { 
    title: "Possédez-vous déjà une copie de votre acte de naissance ?", 
    description: 
      "Cette information permet de déterminer la démarche adaptée à votre situation.", 
    procedureId: birthProcedure.id, 
  }, 
}); 

const birthCopyAgeQuestion = await prisma.question.create({ 
  data: { 
    title: "L'acte de naissance est-il encore lisible et exploitable ?", 
    description: 
      "Vérifiez que les informations présentes sur votre copie sont lisibles et peuvent être utilisées.", 
    procedureId: birthProcedure.id, 
  }, 
}); 

const birthMissingQuestion = await prisma.question.create({ 
  data: { 
    title: "Savez-vous dans quelle commune votre naissance a été enregistrée ?", 
    description: 
      "Cette information permet d'orienter votre demande vers le service compétent.", 
    procedureId: birthProcedure.id, 
  }, 
}); 

const birthCertificationQuestion = await prisma.question.create({ 
  data: { 
    title: "Pourquoi souhaitez-vous faire certifier votre acte ?", 
    description: 
      "Indiquez l'utilisation prévue de l'acte afin de déterminer la démarche correspondante.", 
    procedureId: birthProcedure.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 1 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Je souhaite obtenir une copie de mon acte", 
    questionId: birthQuestion.id, 
    nextQuestionId: birthCopyQuestion.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Je souhaite faire certifier mon acte", 
    questionId: birthQuestion.id, 
    nextQuestionId: birthCertificationQuestion.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 2 - Possession de l'acte 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Oui, j'en possède une", 
    questionId: birthCopyQuestion.id, 
    nextQuestionId: birthCopyAgeQuestion.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Non, je n'en possède pas", 
    questionId: birthCopyQuestion.id, 
    nextQuestionId: birthMissingQuestion.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 3 - État de la copie 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Oui, elle est lisible", 
    questionId: birthCopyAgeQuestion.id, 
    processId: birthCertificateProcess.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Non, elle est détériorée ou difficilement lisible", 
    questionId: birthCopyAgeQuestion.id, 
    processId: birthCertificateProcess.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 4 - Localisation de l'acte 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Oui, je connais la commune", 
    questionId: birthMissingQuestion.id, 
    processId: birthCertificateProcess.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Non, je ne connais pas la commune", 
    questionId: birthMissingQuestion.id, 
    processId: birthCertificateProcess.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 5 - Certification 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Pour une démarche administrative", 
    questionId: birthCertificationQuestion.id, 
    processId: birthCertificationProcess.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Pour fournir un document à une administration", 
    questionId: birthCertificationQuestion.id, 
    processId: birthCertificationProcess.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Pour une autre raison", 
    questionId: birthCertificationQuestion.id, 
    processId: birthCertificationProcess.id, 
  }, 
}); 


// ============================================================ 
// QUESTIONS - IDENTITY PROCEDURE 
// ============================================================ 

const identityQuestion = await prisma.question.create({ 
  data: { 
    title: "Quel est votre besoin concernant votre document d'identité ?", 
    description: 
      "Sélectionnez la situation qui correspond à votre besoin.", 
    procedureId: identityProcedure.id, 
  }, 
}); 

const identityTypeQuestion = await prisma.question.create({ 
  data: { 
    title: "S'agit-il de votre première demande de document d'identité ?", 
    description: 
      "Cette information permet de déterminer le parcours administratif adapté.", 
    procedureId: identityProcedure.id, 
  }, 
}); 

const identityExistingQuestion = await prisma.question.create({ 
  data: { 
    title: "Votre document d'identité actuel est-il toujours valide ?", 
    description: 
      "Indiquez l'état actuel de votre document d'identité.", 
    procedureId: identityProcedure.id, 
  }, 
}); 

const identityLostQuestion = await prisma.question.create({ 
  data: { 
    title: "Votre document d'identité a-t-il été perdu ou volé ?", 
    description: 
      "Cette information permet de déterminer les démarches supplémentaires nécessaires.", 
    procedureId: identityProcedure.id, 
  }, 
}); 

const identityModificationQuestion = await prisma.question.create({ 
  data: { 
    title: "Souhaitez-vous modifier certaines informations présentes sur votre document ?", 
    description: 
      "Par exemple, une modification concernant votre nom ou une autre information administrative.", 
    procedureId: identityProcedure.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 1 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Je souhaite faire une première demande", 
    questionId: identityQuestion.id, 
    nextQuestionId: identityTypeQuestion.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Je souhaite renouveler mon document", 
    questionId: identityQuestion.id, 
    nextQuestionId: identityExistingQuestion.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 2 - Première demande 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Oui, c'est ma première demande", 
    questionId: identityTypeQuestion.id, 
    processId: firstIdentityProcess.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Non", 
    questionId: identityTypeQuestion.id, 
    processId: firstIdentityProcess.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 3 - Validité 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Oui, mon document est encore valide", 
    questionId: identityExistingQuestion.id, 
    nextQuestionId: identityModificationQuestion.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Non, mon document n'est plus valide", 
    questionId: identityExistingQuestion.id, 
    nextQuestionId: identityLostQuestion.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 4 - Perte / vol 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Oui, il a été perdu ou volé", 
    questionId: identityLostQuestion.id, 
    processId: renewalIdentityProcess.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Non, je possède toujours mon document", 
    questionId: identityLostQuestion.id, 
    processId: renewalIdentityProcess.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 5 - Modification 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Oui, je souhaite modifier des informations", 
    questionId: identityModificationQuestion.id, 
    processId: renewalIdentityProcess.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Non, je ne souhaite rien modifier", 
    questionId: identityModificationQuestion.id, 
    processId: renewalIdentityProcess.id, 
  }, 
}); 

// ============================================================ 
// QUESTIONS - RESIDENCE PROCEDURE 
// ============================================================ 

const residenceQuestion = await prisma.question.create({ 
  data: { 
    title: "Quelle démarche souhaitez-vous effectuer ?", 
    description: 
      "Sélectionnez la démarche correspondant à votre situation.", 
    procedureId: residenceProcedure.id, 
  }, 
}); 

const residenceLocationQuestion = await prisma.question.create({ 
  data: { 
    title: "Résidez-vous actuellement dans la commune concernée ?", 
    description: 
      "Cette information permet de vérifier le parcours administratif adapté.", 
    procedureId: residenceProcedure.id, 
  }, 
}); 

const residenceDurationQuestion = await prisma.question.create({ 
  data: { 
    title: "Depuis combien de temps résidez-vous dans cette commune ?", 
    description: 
      "Indiquez approximativement la durée de votre résidence dans la commune.", 
    procedureId: residenceProcedure.id, 
  }, 
}); 

const residencePreviousCertificateQuestion = await prisma.question.create({ 
  data: { 
    title: "Avez-vous déjà obtenu une attestation de résidence ?", 
    description: 
      "Cette information permet de déterminer si vous effectuez une première demande ou une nouvelle demande.", 
    procedureId: residenceProcedure.id, 
  }, 
}); 

const residenceReasonQuestion = await prisma.question.create({ 
  data: { 
    title: "Pour quelle raison avez-vous besoin de cette attestation ?", 
    description: 
      "Sélectionnez l'utilisation prévue pour votre attestation de résidence.", 
    procedureId: residenceProcedure.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 1 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Je souhaite obtenir une attestation de résidence", 
    questionId: residenceQuestion.id, 
    nextQuestionId: residenceLocationQuestion.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 2 - Commune 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Oui", 
    questionId: residenceLocationQuestion.id, 
    nextQuestionId: residenceDurationQuestion.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Non", 
    questionId: residenceLocationQuestion.id, 
    processId: residenceCertificateProcess.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 3 - Durée 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Moins de 3 mois", 
    questionId: residenceDurationQuestion.id, 
    nextQuestionId: residencePreviousCertificateQuestion.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Entre 3 mois et 1 an", 
    questionId: residenceDurationQuestion.id, 
    nextQuestionId: residencePreviousCertificateQuestion.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Plus d'un an", 
    questionId: residenceDurationQuestion.id, 
    nextQuestionId: residencePreviousCertificateQuestion.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 4 - Attestation précédente 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Oui, j'en ai déjà obtenu une", 
    nextQuestionId: residenceReasonQuestion.id, 
    questionId: residencePreviousCertificateQuestion.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Non, c'est ma première demande", 
    nextQuestionId: residenceReasonQuestion.id, 
    questionId: residencePreviousCertificateQuestion.id, 
  }, 
}); 

// ------------------------------------------------------------ 
// Question 5 - Motif 
// ------------------------------------------------------------ 

await prisma.answerOption.create({ 
  data: { 
    label: "Pour une démarche administrative", 
    questionId: residenceReasonQuestion.id, 
    processId: residenceCertificateProcess.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Pour constituer un dossier", 
    questionId: residenceReasonQuestion.id, 
    processId: residenceCertificateProcess.id, 
  }, 
}); 

await prisma.answerOption.create({ 
  data: { 
    label: "Pour une autre raison", 
    questionId: residenceReasonQuestion.id, 
    processId: residenceCertificateProcess.id, 
  }, 
}); 

console.log("✅ Questions and answer trees created"); 

  // ============================================================ 
  // DOCUMENTS 
  // ============================================================ 

  const birthCertificateForm = await prisma.document.create({ 
    data: { 
      name: "Formulaire de demande d'acte de naissance", 
      price: 1000, 
      customizable: true, 
      legalWarning: 
        "Vérifiez attentivement les informations avant d'utiliser ce document.", 
    }, 
  }); 

  const certificationForm = await prisma.document.create({ 
    data: { 
      name: "Formulaire de demande de certification", 
      price: 1500, 
      customizable: true, 
      legalWarning: 
        "Les informations renseignées doivent correspondre aux documents officiels.", 
    }, 
  }); 

  const identityForm = await prisma.document.create({ 
    data: { 
      name: "Formulaire de demande de document d'identité", 
      price: 2000, 
      customizable: true, 
    }, 
  }); 

  const residenceForm = await prisma.document.create({ 
    data: { 
      name: "Demande d'attestation de résidence", 
      price: 500, 
      customizable: true, 
    }, 
  }); 

  console.log("✅ Documents created"); 

  // ============================================================ 
  // STEPS 
  // ============================================================ 

  const certificationStep = await prisma.step.create({ 
    data: { 
      title: "Préparer les documents nécessaires", 
      description: 
        "Rassemblez les documents requis avant de vous rendre au service compétent.", 
      processId: birthCertificationProcess.id, 
      administrativeBodyId: mairie.id, 
      documents: { 
        connect: [{ id: certificationForm.id }], 
      }, 
    }, 
  }); 

  await prisma.step.create({ 
    data: { 
      title: "Se rendre au service compétent", 
      description: 
        "Présentez-vous à la mairie ou auprès du service compétent.", 
      processId: birthCertificationProcess.id, 
      administrativeBodyId: mairie.id, 
    }, 
  }); 

  await prisma.step.create({ 
    data: { 
      title: "Préparer votre demande", 
      description: 
        "Préparez les informations et documents nécessaires à la demande.", 
      processId: birthCertificateProcess.id, 
      administrativeBodyId: mairie.id, 
      documents: { 
        connect: [{ id: birthCertificateForm.id }], 
      }, 
    }, 
  }); 

  await prisma.step.create({ 
    data: { 
      title: "Déposer la demande", 
      description: 
        "Déposez votre demande auprès du service administratif compétent.", 
      processId: birthCertificateProcess.id, 
      administrativeBodyId: mairie.id, 
    }, 
  }); 

  await prisma.step.create({ 
    data: { 
      title: "Préparer les pièces requises", 
      description: 
        "Rassemblez les pièces justificatives nécessaires pour votre demande.", 
      processId: firstIdentityProcess.id, 
      administrativeBodyId: prefecture.id, 
      documents: { 
        connect: [{ id: identityForm.id }], 
      }, 
    }, 
  }); 

  await prisma.step.create({ 
    data: { 
      title: "Déposer votre première demande", 
      description: 
        "Présentez-vous auprès du service compétent pour déposer votre dossier.", 
      processId: firstIdentityProcess.id, 
      administrativeBodyId: prefecture.id, 
    }, 
  }); 

  await prisma.step.create({ 
    data: { 
      title: "Préparer le dossier de renouvellement", 
      description: 
        "Préparez les documents nécessaires au renouvellement.", 
      processId: renewalIdentityProcess.id, 
      administrativeBodyId: prefecture.id, 
      documents: { 
        connect: [{ id: identityForm.id }], 
      }, 
    }, 
  }); 

  await prisma.step.create({ 
    data: { 
      title: "Déposer la demande de renouvellement", 
      description: 
        "Déposez votre dossier auprès du service administratif compétent.", 
      processId: renewalIdentityProcess.id, 
      administrativeBodyId: prefecture.id, 
    }, 
  }); 

  await prisma.step.create({ 
    data: { 
      title: "Remplir la demande", 
      description: 
        "Complétez les informations nécessaires pour votre attestation de résidence.", 
      processId: residenceCertificateProcess.id, 
      administrativeBodyId: mairie.id, 
      documents: { 
        connect: [{ id: residenceForm.id }], 
      }, 
    }, 
  }); 

  await prisma.step.create({ 
    data: { 
      title: "Faire viser la demande", 
      description: 
        "Présentez votre demande au service compétent.", 
      processId: residenceCertificateProcess.id, 
      administrativeBodyId: mairie.id, 
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
        "Ne versez pas d'argent à une personne qui prétend pouvoir accélérer votre démarche sans justificatif officiel.", 
      stepId: certificationStep.id, 
    }, 
  }); 

  console.log("✅ Fraud alert created"); 

  // ============================================================ 
  // USER FOLDER 
  // ============================================================ 

  const folder = await prisma.folder.create({ 
    data: { 
      name: "Certification de mon acte de naissance", 
      status: FolderStatus.PENDING, 
      userId: user.id, 
      procedureId: birthProcedure.id, 
      processId: birthCertificationProcess.id, 
      locationId: bafoussam.id, 
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
      amount: certificationForm.price, 
      userId: user.id, 
      documentId: certificationForm.id, 
    }, 
  }); 

  await prisma.transaction.create({ 
    data: { 
      reference: "TX-SEED-001", 
      amount: purchase.amount, 
      paymentMethod: "MOBILE_MONEY", 
      status: TransactionStatus.SUCCESS, 
      documentPurchaseId: purchase.id, 
    }, 
  }); 

  console.log("✅ Document purchase created"); 

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
      reference: "DON-SEED-001", 
      amount: donation.amount, 
      paymentMethod: "MOBILE_MONEY", 
      status: TransactionStatus.SUCCESS, 
      donationId: donation.id, 
    }, 
  }); 

  console.log("✅ Donation created"); 

  console.log("\n🎉 Seed completed successfully!"); 
  console.log(`👤 User: ${user.email}`); 
  console.log(`👤 Admin: ${adminUser.email}`); 
  console.log(`📁 Folder: ${folder.name}`); 
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