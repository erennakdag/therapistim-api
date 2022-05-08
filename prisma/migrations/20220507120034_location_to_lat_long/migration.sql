/*
  Warnings:

  - You are about to drop the column `location` on the `Therapist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Therapist" DROP COLUMN "location",
ADD COLUMN     "latitude" INTEGER,
ADD COLUMN     "longitude" INTEGER;
