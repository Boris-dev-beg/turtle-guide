-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED');

-- CreateTable
CREATE TABLE "admin_invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "invitedById" TEXT,

    CONSTRAINT "admin_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_invitations_tokenHash_key" ON "admin_invitations"("tokenHash");

-- CreateIndex
CREATE INDEX "admin_invitations_email_status_idx" ON "admin_invitations"("email", "status");

-- CreateIndex
CREATE INDEX "admin_invitations_status_expiresAt_idx" ON "admin_invitations"("status", "expiresAt");

-- AddForeignKey
ALTER TABLE "admin_invitations" ADD CONSTRAINT "admin_invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "administrators"("id") ON DELETE SET NULL ON UPDATE CASCADE;
