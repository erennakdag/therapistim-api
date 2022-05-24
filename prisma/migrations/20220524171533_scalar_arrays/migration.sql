/*
  Warnings:

  - The `languages` column on the `Therapist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `specialties` column on the `Therapist` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Therapist" DROP COLUMN "languages",
ADD COLUMN     "languages" TEXT[],
DROP COLUMN "specialties",
ADD COLUMN     "specialties" TEXT[];
