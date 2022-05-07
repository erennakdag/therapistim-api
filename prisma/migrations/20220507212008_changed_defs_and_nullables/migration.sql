/*
  Warnings:

  - You are about to drop the column `address` on the `Therapist` table. All the data in the column will be lost.
  - Added the required column `adress` to the `Therapist` table without a default value. This is not possible if the table is not empty.
  - Made the column `acceptsPrivateInsurance` on table `Therapist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `Therapist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Therapist` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Therapist" DROP COLUMN "address",
ADD COLUMN     "adress" TEXT NOT NULL,
ALTER COLUMN "languages" DROP NOT NULL,
ALTER COLUMN "specialties" DROP NOT NULL,
ALTER COLUMN "acceptsPrivateInsurance" SET NOT NULL,
ALTER COLUMN "acceptsPrivateInsurance" SET DEFAULT false,
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;
