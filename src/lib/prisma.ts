import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not defined. Add it to your .env file before running Prisma or the seed.",
  );
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
