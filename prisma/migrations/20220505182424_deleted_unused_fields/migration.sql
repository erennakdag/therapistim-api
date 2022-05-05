/*
  Warnings:

  - You are about to drop the column `hasPrivateInsurance` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceProvider` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceProvider` on the `Therapist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "hasPrivateInsurance",
DROP COLUMN "insuranceProvider",
DROP COLUMN "location";

-- AlterTable
ALTER TABLE "Therapist" DROP COLUMN "insuranceProvider",
ADD COLUMN     "institutionName" TEXT;
