-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_locationId_fkey";

-- AlterTable
ALTER TABLE "folders" ALTER COLUMN "locationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
