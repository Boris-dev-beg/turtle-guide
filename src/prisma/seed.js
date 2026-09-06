"use strict"; 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) { 
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); } 
    return new (P || (P = Promise))(function (resolve, reject) { 
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } } 
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } } 
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); } 
        step((generator = generator.apply(thisArg, _arguments || [])).next()); 
    }); 
}; 
var __generator = (this && this.__generator) || function (thisArg, body) { 
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g; 
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g; 
    function verb(n) { return function (v) { return step([n, v]); }; } 
    function step(op) { 
        if (f) throw new TypeError("Generator is already executing."); 
        while (_) try { 
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t; 
            if (y = 0, t) op = [op[0] & 2, t.value]; 
            switch (op[0]) { 
                case 0: case 1: t = op; break; 
                case 4: _.label++; return { value: op[1], done: false }; 
                case 5: _.label++; y = op[1]; op = [0]; continue; 
                case 7: op = _.ops.pop(); _.trys.pop(); continue; 
                default: 
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; } 
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; } 
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; } 
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; } 
                    if (t[2]) _.ops.pop(); 
                    _.trys.pop(); continue; 
            } 
            op = body.call(thisArg, _); 
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; } 
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true }; 
    } 
}; 
exports.__esModule = true; 
var client_1 = require("../generated/prisma/client"); 
var adapter_pg_1 = require("@prisma/adapter-pg"); 
var adapter = new adapter_pg_1.PrismaPg({ 
    connectionString: process.env.DATABASE_URL 
}); 
var prisma = new client_1.PrismaClient({ 
    adapter: adapter 
}); 
function main() { 
    return __awaiter(this, void 0, void 0, function () { 
        var user, adminUser, bamegoum, bafoussam, bamenda, mairie, tribunal, prefecture, tribunalBafoussam, mairieBafoussam, prefectureBafoussam, tribunalBamenda, civilStatusCategory, identityCategory, birthCertificateProcess, birthRegistrationProcess, identityDocumentProcess, birthProcedure, identityProcedure, birthQuestion, certificationQuestion, identityQuestion, certifiedCopyDocument, birthCertificateForm, identityForm, certificationStep, folder, certificationOption, purchase, donation; 
        return __generator(this, function (_a) { 
            switch (_a.label) { 
                case 0: 
                    console.log("🌱 Starting seed..."); 
                    // ============================================================ 
                    // CLEAN DATABASE 
                    // ============================================================ 
                    return [4 /*yield*/, prisma.fraudAlert.deleteMany()]; 
                case 1: 
                    // ============================================================ 
                    // CLEAN DATABASE 
                    // ============================================================ 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.transaction.deleteMany()]; 
                case 2: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.documentPurchase.deleteMany()]; 
                case 3: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.document.deleteMany()]; 
                case 4: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.answer.deleteMany()]; 
                case 5: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.progression.deleteMany()]; 
                case 6: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.answerOption.deleteMany()]; 
                case 7: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.question.deleteMany()]; 
                case 8: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.step.deleteMany()]; 
                case 9: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.folder.deleteMany()]; 
                case 10: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.process.deleteMany()]; 
                case 11: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.areaServed.deleteMany()]; 
                case 12: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.administrativeUnit.deleteMany()]; 
                case 13: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.administrativeBody.deleteMany()]; 
                case 14: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.procedure.deleteMany()]; 
                case 15: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.category.deleteMany()]; 
                case 16: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.donation.deleteMany()]; 
                case 17: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.administrator.deleteMany()]; 
                case 18: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.user.deleteMany()]; 
                case 19: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.location.deleteMany()]; 
                case 20: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.user.create({ 
                            data: { 
                                phone: "+237690000001", 
                                name: "Boris Mangwa", 
                                email: "boris@example.com", 
                                hashedPassword: "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUV" 
                            } 
                        })]; 
                case 21: 
                    user = _a.sent(); 
                    return [4 /*yield*/, prisma.user.create({ 
                            data: { 
                                phone: "+237690000002", 
                                name: "Admin Turtle Guide", 
                                email: "admin@example.com", 
                                hashedPassword: "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUV", 
                                administrator: { 
                                    create: { 
                                        accessLevel: "ADMIN" 
                                    } 
                                } 
                            } 
                        })]; 
                case 22: 
                    adminUser = _a.sent(); 
                    console.log("✅ Users created"); 
                    return [4 /*yield*/, prisma.location.create({ 
                            data: { 
                                address: "Centre-ville de Bamegoum", 
                                city: "Bamegoum", 
                                latitude: -5.1234, 
                                longitude: 10.4567 
                            } 
                        })]; 
                case 23: 
                    bamegoum = _a.sent(); 
                    return [4 /*yield*/, prisma.location.create({ 
                            data: { 
                                address: "Centre administratif de Bafoussam", 
                                city: "Bafoussam", 
                                latitude: 5.4781, 
                                longitude: 10.4178 
                            } 
                        })]; 
                case 24: 
                    bafoussam = _a.sent(); 
                    return [4 /*yield*/, prisma.location.create({ 
                            data: { 
                                address: "Centre administratif de Bamenda", 
                                city: "Bamenda", 
                                latitude: 5.9597, 
                                longitude: 10.1459 
                            } 
                        })]; 
                case 25: 
                    bamenda = _a.sent(); 
                    console.log("✅ Locations created"); 
                    return [4 /*yield*/, prisma.administrativeBody.create({ 
                            data: { 
                                name: "Mairie" 
                            } 
                        })]; 
                case 26: 
                    mairie = _a.sent(); 
                    return [4 /*yield*/, prisma.administrativeBody.create({ 
                            data: { 
                                name: "Tribunal de Première Instance" 
                            } 
                        })]; 
                case 27: 
                    tribunal = _a.sent(); 
                    return [4 /*yield*/, prisma.administrativeBody.create({ 
                            data: { 
                                name: "Préfecture" 
                            } 
                        })]; 
                case 28: 
                    prefecture = _a.sent(); 
                    console.log("✅ Administrative bodies created"); 
                    return [4 /*yield*/, prisma.administrativeUnit.create({ 
                            data: { 
                                name: "Tribunal de Première Instance de Bafoussam", 
                                administrativeBodyId: tribunal.id, 
                                locationId: bafoussam.id 
                            } 
                        })]; 
                case 29: 
                    tribunalBafoussam = _a.sent(); 
                    return [4 /*yield*/, prisma.administrativeUnit.create({ 
                            data: { 
                                name: "Mairie de Bafoussam", 
                                administrativeBodyId: mairie.id, 
                                locationId: bafoussam.id 
                            } 
                        })]; 
                case 30: 
                    mairieBafoussam = _a.sent(); 
                    return [4 /*yield*/, prisma.administrativeUnit.create({ 
                            data: { 
                                name: "Préfecture de Bafoussam", 
                                administrativeBodyId: prefecture.id, 
                                locationId: bafoussam.id 
                            } 
                        })]; 
                case 31: 
                    prefectureBafoussam = _a.sent(); 
                    return [4 /*yield*/, prisma.administrativeUnit.create({ 
                            data: { 
                                name: "Tribunal de Première Instance de Bamenda", 
                                administrativeBodyId: tribunal.id, 
                                locationId: bamenda.id 
                            } 
                        })]; 
                case 32: 
                    tribunalBamenda = _a.sent(); 
                    console.log("✅ Administrative units created"); 
                    // ============================================================ 
                    // AREAS SERVED 
                    // ============================================================ 
                    return [4 /*yield*/, prisma.areaServed.create({ 
                            data: { 
                                name: "Bamegoum", 
                                locationId: bamegoum.id, 
                                administrativeUnitId: tribunalBafoussam.id 
                            } 
                        })]; 
                case 33: 
                    // ============================================================ 
                    // AREAS SERVED 
                    // ============================================================ 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.areaServed.create({ 
                            data: { 
                                name: "Bafoussam", 
                                locationId: bafoussam.id, 
                                administrativeUnitId: tribunalBafoussam.id 
                            } 
                        })]; 
                case 34: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.areaServed.create({ 
                            data: { 
                                name: "Bafoussam", 
                                locationId: bafoussam.id, 
                                administrativeUnitId: mairieBafoussam.id 
                            } 
                        })]; 
                case 35: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.areaServed.create({ 
                            data: { 
                                name: "Bafoussam", 
                                locationId: bafoussam.id, 
                                administrativeUnitId: prefectureBafoussam.id 
                            } 
                        })]; 
                case 36: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.areaServed.create({ 
                            data: { 
                                name: "Bamenda", 
                                locationId: bamenda.id, 
                                administrativeUnitId: tribunalBamenda.id 
                            } 
                        })]; 
                case 37: 
                    _a.sent(); 
                    console.log("✅ Areas served created"); 
                    return [4 /*yield*/, prisma.category.create({ 
                            data: { 
                                name: "État civil", 
                                slug: "etat-civil", 
                                description: "Démarches administratives relatives aux actes d'état civil.", 
                                isActive: true 
                            } 
                        })]; 
                case 38: 
                    civilStatusCategory = _a.sent(); 
                    return [4 /*yield*/, prisma.category.create({ 
                            data: { 
                                name: "Identité", 
                                slug: "identite", 
                                description: "Démarches relatives aux documents et justificatifs d'identité.", 
                                isActive: true 
                            } 
                        })]; 
                case 39: 
                    identityCategory = _a.sent(); 
                    console.log("✅ Categories created"); 
                    return [4 /*yield*/, prisma.process.create({ 
                            data: { 
                                title: "Certification d'un acte de naissance", 
                                description: "Démarche permettant de faire certifier un acte de naissance." 
                            } 
                        })]; 
                case 40: 
                    birthCertificateProcess = _a.sent(); 
                    return [4 /*yield*/, prisma.process.create({ 
                            data: { 
                                title: "Obtention d'un acte de naissance", 
                                description: "Démarche permettant d'obtenir une copie ou un extrait d'acte de naissance." 
                            } 
                        })]; 
                case 41: 
                    birthRegistrationProcess = _a.sent(); 
                    return [4 /*yield*/, prisma.process.create({ 
                            data: { 
                                title: "Demande de document d'identité", 
                                description: "Démarche permettant d'effectuer une demande de document d'identité." 
                            } 
                        })]; 
                case 42: 
                    identityDocumentProcess = _a.sent(); 
                    console.log("✅ Processes created"); 
                    return [4 /*yield*/, prisma.procedure.create({ 
                            data: { 
                                title: "Je souhaite effectuer une démarche concernant mon acte de naissance", 
                                description: "Répondez aux questions suivantes afin d'identifier la démarche adaptée.", 
                                legalBasis: "Législation camerounaise relative à l'état civil.", 
                                categoryId: civilStatusCategory.id, 
                                isActive: true 
                            } 
                        })]; 
                case 43: 
                    birthProcedure = _a.sent(); 
                    return [4 /*yield*/, prisma.procedure.create({ 
                            data: { 
                                title: "Je souhaite obtenir un document d'identité", 
                                description: "Ce questionnaire permet d'identifier la démarche correspondant à votre situation.", 
                                legalBasis: "Législation camerounaise relative aux documents d'identité.", 
                                categoryId: identityCategory.id, 
                                isActive: true 
                            } 
                        })]; 
                case 44: 
                    identityProcedure = _a.sent(); 
                    console.log("✅ Procedures created"); 
                    return [4 /*yield*/, prisma.question.create({ 
                            data: { 
                                title: "Quel est votre besoin concernant votre acte de naissance ?", 
                                description: "Sélectionnez la situation qui correspond à votre besoin.", 
                                procedureId: birthProcedure.id 
                            } 
                        })]; 
                case 45: 
                    birthQuestion = _a.sent(); 
                    return [4 /*yield*/, prisma.question.create({ 
                            data: { 
                                title: "L'acte de naissance est-il déjà disponible ?", 
                                description: "Cette information permet de déterminer la démarche à effectuer.", 
                                procedureId: birthProcedure.id 
                            } 
                        })]; 
                case 46: 
                    certificationQuestion = _a.sent(); 
                    // ============================================================ 
                    // ANSWER OPTIONS 
                    // ============================================================ 
                    return [4 /*yield*/, prisma.answerOption.createMany({ 
                            data: [ 
                                { 
                                    label: "Je veux faire certifier mon acte", 
                                    questionId: birthQuestion.id, 
                                    processId: birthCertificateProcess.id 
                                }, 
                                { 
                                    label: "Je n'ai pas encore d'acte de naissance", 
                                    questionId: birthQuestion.id, 
                                    nextQuestionId: certificationQuestion.id 
                                }, 
                                { 
                                    label: "Oui", 
                                    questionId: certificationQuestion.id, 
                                    processId: birthCertificateProcess.id 
                                }, 
                                { 
                                    label: "Non", 
                                    questionId: certificationQuestion.id, 
                                    processId: birthRegistrationProcess.id 
                                }, 
                            ] 
                        })]; 
                case 47: 
                    // ============================================================ 
                    // ANSWER OPTIONS 
                    // ============================================================ 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.question.create({ 
                            data: { 
                                title: "Pourquoi souhaitez-vous obtenir un document d'identité ?", 
                                description: "Choisissez la situation qui vous correspond.", 
                                procedureId: identityProcedure.id 
                            } 
                        })]; 
                case 48: 
                    identityQuestion = _a.sent(); 
                    return [4 /*yield*/, prisma.answerOption.createMany({ 
                            data: [ 
                                { 
                                    label: "Première demande", 
                                    questionId: identityQuestion.id, 
                                    processId: identityDocumentProcess.id 
                                }, 
                                { 
                                    label: "Renouvellement", 
                                    questionId: identityQuestion.id, 
                                    processId: identityDocumentProcess.id 
                                }, 
                            ] 
                        })]; 
                case 49: 
                    _a.sent(); 
                    console.log("✅ Questions and answer options created"); 
                    return [4 /*yield*/, prisma.document.create({ 
                            data: { 
                                name: "Formulaire de demande de certification", 
                                price: 1500, 
                                customizable: true, 
                                legalWarning: "Vérifiez les informations avant toute utilisation du document." 
                            } 
                        })]; 
                case 50: 
                    certifiedCopyDocument = _a.sent(); 
                    return [4 /*yield*/, prisma.document.create({ 
                            data: { 
                                name: "Formulaire de demande d'acte de naissance", 
                                price: 1000, 
                                customizable: true 
                            } 
                        })]; 
                case 51: 
                    birthCertificateForm = _a.sent(); 
                    return [4 /*yield*/, prisma.document.create({ 
                            data: { 
                                name: "Formulaire de demande de document d'identité", 
                                price: 2000, 
                                customizable: true 
                            } 
                        })]; 
                case 52: 
                    identityForm = _a.sent(); 
                    console.log("✅ Documents created"); 
                    return [4 /*yield*/, prisma.step.create({ 
                            data: { 
                                title: "Préparer votre dossier", 
                                description: "Préparez les documents nécessaires avant de vous rendre au service compétent.", 
                                processId: birthCertificateProcess.id, 
                                administrativeBodyId: tribunal.id, 
                                documents: { 
                                    connect: [{ id: certifiedCopyDocument.id }] 
                                } 
                            } 
                        })]; 
                case 53: 
                    certificationStep = _a.sent(); 
                    return [4 /*yield*/, prisma.step.create({ 
                            data: { 
                                title: "Se rendre au service compétent", 
                                description: "Présentez-vous auprès du service administratif compétent.", 
                                processId: birthCertificateProcess.id, 
                                administrativeBodyId: tribunal.id 
                            } 
                        })]; 
                case 54: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.step.create({ 
                            data: { 
                                title: "Déposer la demande", 
                                description: "Déposez votre demande auprès du service administratif.", 
                                processId: birthRegistrationProcess.id, 
                                administrativeBodyId: mairie.id, 
                                documents: { 
                                    connect: [{ id: birthCertificateForm.id }] 
                                } 
                            } 
                        })]; 
                case 55: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.step.create({ 
                            data: { 
                                title: "Effectuer la demande", 
                                description: "Présentez les documents requis pour votre demande.", 
                                processId: identityDocumentProcess.id, 
                                administrativeBodyId: prefecture.id, 
                                documents: { 
                                    connect: [{ id: identityForm.id }] 
                                } 
                            } 
                        })]; 
                case 56: 
                    _a.sent(); 
                    console.log("✅ Steps created"); 
                    // ============================================================ 
                    // FRAUD ALERT 
                    // ============================================================ 
                    return [4 /*yield*/, prisma.fraudAlert.create({ 
                            data: { 
                                title: "Attention aux intermédiaires non officiels", 
                                description: "Ne versez pas d'argent à une personne prétendant pouvoir accélérer votre démarche sans justificatif officiel.", 
                                stepId: certificationStep.id 
                            } 
                        })]; 
                case 57: 
                    // ============================================================ 
                    // FRAUD ALERT 
                    // ============================================================ 
                    _a.sent(); 
                    console.log("✅ Fraud alerts created"); 
                    return [4 /*yield*/, prisma.folder.create({ 
                            data: { 
                                name: "Dossier - Certification acte de naissance", 
                                status: client_1.FolderStatus.PENDING, 
                                userId: user.id, 
                                procedureId: birthProcedure.id, 
                                processId: birthCertificateProcess.id, 
                                locationId: bamegoum.id 
                            } 
                        })]; 
                case 58: 
                    folder = _a.sent(); 
                    return [4 /*yield*/, prisma.answerOption.findFirst({ 
                            where: { 
                                questionId: birthQuestion.id, 
                                processId: birthCertificateProcess.id 
                            } 
                        })]; 
                case 59: 
                    certificationOption = _a.sent(); 
                    if (!certificationOption) { 
                        throw new Error("Certification answer option not found"); 
                    } 
                    return [4 /*yield*/, prisma.answer.create({ 
                            data: { 
                                folderId: folder.id, 
                                optionId: certificationOption.id 
                            } 
                        })]; 
                case 60: 
                    _a.sent(); 
                    return [4 /*yield*/, prisma.progression.create({ 
                            data: { 
                                folderId: folder.id, 
                                currentQuestionId: birthQuestion.id 
                            } 
                        })]; 
                case 61: 
                    _a.sent(); 
                    console.log("✅ Folder, answer and progression created"); 
                    return [4 /*yield*/, prisma.documentPurchase.create({ 
                            data: { 
                                purchaseDate: new Date(), 
                                amount: certifiedCopyDocument.price, 
                                userId: user.id, 
                                documentId: certifiedCopyDocument.id 
                            } 
                        })]; 
                case 62: 
                    purchase = _a.sent(); 
                    // ============================================================ 
                    // TRANSACTION 
                    // ============================================================ 
                    return [4 /*yield*/, prisma.transaction.create({ 
                            data: { 
                                reference: "TX-".concat(Date.now()), 
                                amount: purchase.amount, 
                                paymentMethod: "MOBILE_MONEY", 
                                date: new Date(), 
                                status: client_1.TransactionStatus.SUCCESS, 
                                documentPurchaseId: purchase.id 
                            } 
                        })]; 
                case 63: 
                    // ============================================================ 
                    // TRANSACTION 
                    // ============================================================ 
                    _a.sent(); 
                    console.log("✅ Purchase and transaction created"); 
                    return [4 /*yield*/, prisma.donation.create({ 
                            data: { 
                                amount: 500, 
                                userId: user.id 
                            } 
                        })]; 
                case 64: 
                    donation = _a.sent(); 
                    return [4 /*yield*/, prisma.transaction.create({ 
                            data: { 
                                reference: "DON-".concat(Date.now()), 
                                amount: donation.amount, 
                                paymentMethod: "MOBILE_MONEY", 
                                date: new Date(), 
                                status: client_1.TransactionStatus.SUCCESS, 
                                donationId: donation.id 
                            } 
                        })]; 
                case 65: 
                    _a.sent(); 
                    console.log("✅ Donation created"); 
                    console.log("\n🎉 Seed completed successfully!"); 
                    console.log("\uD83D\uDC64 User: ".concat(user.email)); 
                    console.log("\uD83D\uDC64 Admin: ".concat(adminUser.email)); 
                    console.log("\uD83D\uDCC1 Folder: ".concat(folder.id)); 
                    return [2 /*return*/]; 
            } 
        }); 
    }); 
} 
main()["catch"](function (error) { 
    console.error("❌ Seed failed:"); 
    console.error(error); 
    process.exit(1); 
})["finally"](function () { return __awaiter(void 0, void 0, void 0, function () { 
    return __generator(this, function (_a) { 
        switch (_a.label) { 
            case 0: return [4 /*yield*/, prisma.$disconnect()]; 
            case 1: 
                _a.sent(); 
                return [2 /*return*/]; 
        } 
    }); 
}); }); 
