-- CreateEnum
CREATE TYPE "AdminContentAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "admin_content_activities" (
    "id" TEXT NOT NULL,
    "action" "AdminContentAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "entityName" TEXT NOT NULL,
    "summary" TEXT,
    "actorName" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" TEXT,

    CONSTRAINT "admin_content_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_content_activities_occurredAt_idx" ON "admin_content_activities"("occurredAt");

-- CreateIndex
CREATE INDEX "admin_content_activities_entityType_occurredAt_idx" ON "admin_content_activities"("entityType", "occurredAt");

-- AddForeignKey
ALTER TABLE "admin_content_activities" ADD CONSTRAINT "admin_content_activities_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
