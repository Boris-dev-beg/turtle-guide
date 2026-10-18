import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

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
