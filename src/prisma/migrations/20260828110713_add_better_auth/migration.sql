/* 
  Warnings: 

  - You are about to drop the column `hashedPassword` on the `users` table. All the data in the column will be lost. 
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost. 
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty. 
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column. 

*/ 
-- DropIndex 
DROP INDEX "users_phone_key"; 

-- AlterTable 
ALTER TABLE "users" DROP COLUMN "hashedPassword", 
DROP COLUMN "phone", 
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false, 
ADD COLUMN     "image" TEXT, 
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL, 
ALTER COLUMN "name" SET NOT NULL; 

-- CreateTable 
CREATE TABLE "session" ( 
    "id" TEXT NOT NULL, 
    "expiresAt" TIMESTAMP(3) NOT NULL, 
    "token" TEXT NOT NULL, 
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    "updatedAt" TIMESTAMP(3) NOT NULL, 
    "ipAddress" TEXT, 
    "userAgent" TEXT, 
    "userId" TEXT NOT NULL, 

    CONSTRAINT "session_pkey" PRIMARY KEY ("id") 
); 

-- CreateTable 
CREATE TABLE "account" ( 
    "id" TEXT NOT NULL, 
    "issuer" TEXT NOT NULL, 
    "accountId" TEXT NOT NULL, 
    "providerId" TEXT NOT NULL, 
    "userId" TEXT NOT NULL, 
    "accessToken" TEXT, 
    "refreshToken" TEXT, 
    "idToken" TEXT, 
    "accessTokenExpiresAt" TIMESTAMP(3), 
    "refreshTokenExpiresAt" TIMESTAMP(3), 
    "scope" TEXT, 
    "password" TEXT, 
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    "updatedAt" TIMESTAMP(3) NOT NULL, 

    CONSTRAINT "account_pkey" PRIMARY KEY ("id") 
); 

-- CreateTable 
CREATE TABLE "verification" ( 
    "id" TEXT NOT NULL, 
    "identifier" TEXT NOT NULL, 
    "value" TEXT NOT NULL, 
    "expiresAt" TIMESTAMP(3) NOT NULL, 
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    "updatedAt" TIMESTAMP(3) NOT NULL, 

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id") 
); 

-- CreateIndex 
CREATE INDEX "session_userId_idx" ON "session"("userId"); 

-- CreateIndex 
CREATE UNIQUE INDEX "session_token_key" ON "session"("token"); 

-- CreateIndex 
CREATE INDEX "account_userId_idx" ON "account"("userId"); 

-- CreateIndex 
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "account"("issuer", "accountId"); 

-- CreateIndex 
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier"); 

-- AddForeignKey 
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; 

-- AddForeignKey 
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE; 
