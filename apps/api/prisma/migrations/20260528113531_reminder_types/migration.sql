/*
  Warnings:

  - Changed the type of `type` on the `Reminder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('INTERVIEW', 'FOLLOW_UP', 'DEADLINE', 'NETWORKING');

-- AlterTable
ALTER TABLE "Reminder"
ALTER COLUMN "type"
TYPE "ReminderType"
USING ("type"::"ReminderType");
