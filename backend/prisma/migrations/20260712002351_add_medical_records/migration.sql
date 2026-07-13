/*
  Warnings:

  - You are about to drop the column `notes` on the `medical_records` table. All the data in the column will be lost.
  - You are about to drop the column `treatment` on the `medical_records` table. All the data in the column will be lost.
  - You are about to drop the column `vitals` on the `medical_records` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[medicalRecordNumber]` on the table `medical_records` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[appointmentId]` on the table `medical_records` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `medicalRecordNumber` to the `medical_records` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitDate` to the `medical_records` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MedicalRecordStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "medical_records" DROP COLUMN "notes",
DROP COLUMN "treatment",
DROP COLUMN "vitals",
ADD COLUMN     "allergies" JSONB,
ADD COLUMN     "appointmentId" TEXT,
ADD COLUMN     "auditTrail" JSONB,
ADD COLUMN     "chiefComplaint" TEXT,
ADD COLUMN     "chronicConditions" JSONB,
ADD COLUMN     "clinicalNotes" TEXT,
ADD COLUMN     "differentialDiagnosis" TEXT,
ADD COLUMN     "followUpDate" TIMESTAMP(3),
ADD COLUMN     "immunizations" JSONB,
ADD COLUMN     "laboratoryRequests" JSONB,
ADD COLUMN     "medicalRecordNumber" TEXT NOT NULL,
ADD COLUMN     "prescriptions" JSONB,
ADD COLUMN     "radiologyRequests" JSONB,
ADD COLUMN     "status" "MedicalRecordStatus" NOT NULL DEFAULT 'OPEN',
ADD COLUMN     "treatmentPlan" TEXT,
ADD COLUMN     "visitDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vitalSigns" JSONB,
ALTER COLUMN "diagnosis" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "medical_records_medicalRecordNumber_key" ON "medical_records"("medicalRecordNumber");

-- CreateIndex
CREATE UNIQUE INDEX "medical_records_appointmentId_key" ON "medical_records"("appointmentId");

-- CreateIndex
CREATE INDEX "medical_records_appointmentId_idx" ON "medical_records"("appointmentId");

-- CreateIndex
CREATE INDEX "medical_records_visitDate_idx" ON "medical_records"("visitDate");

-- CreateIndex
CREATE INDEX "medical_records_status_idx" ON "medical_records"("status");

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
