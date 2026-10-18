/*
  Warnings:

  - Added the required column `contentUrl` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "contentUrl" TEXT NOT NULL,
ADD COLUMN     "sourceUrl" TEXT;
