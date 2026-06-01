/*
  Warnings:

  - You are about to drop the column `appliedDate` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `Application` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_userId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "appliedDate",
DROP COLUMN "location",
DROP COLUMN "salary",
ADD COLUMN     "description" TEXT,
ALTER COLUMN "status" SET DEFAULT 'SAVED';

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
