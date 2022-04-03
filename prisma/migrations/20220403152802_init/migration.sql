-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "gender" TEXT NOT NULL DEFAULT E'Non-Binary',
    "location" TEXT,
    "hasPrivateInsurance" BOOLEAN,
    "insuranceProvider" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Therapist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "languages" JSONB NOT NULL,
    "specialties" JSONB NOT NULL,
    "canWriteMedication" BOOLEAN NOT NULL,
    "website" TEXT,
    "location" TEXT,
    "acceptsPrivateInsurance" BOOLEAN,
    "insuranceProvider" TEXT,

    CONSTRAINT "Therapist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Therapist_email_key" ON "Therapist"("email");
