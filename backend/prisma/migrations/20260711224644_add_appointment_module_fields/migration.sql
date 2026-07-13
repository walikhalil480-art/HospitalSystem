/*
  Warnings:

  - You are about to drop the column `date` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `appointments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appointmentNumber]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appointmentDate` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appointmentNumber` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `queueNumber` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConsultationType" AS ENUM ('IN_PERSON', 'ONLINE');

-- CreateEnum
CREATE TYPE "AppointmentPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'EMERGENCY');

-- DropIndex
DROP INDEX "appointments_date_idx";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "date",
DROP COLUMN "endDate",
DROP COLUMN "reason",
ADD COLUMN     "appointmentDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "appointmentNumber" TEXT NOT NULL,
ADD COLUMN     "consultationType" "ConsultationType" NOT NULL DEFAULT 'IN_PERSON',
ADD COLUMN     "departmentId" TEXT NOT NULL,
ADD COLUMN     "durationMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "priority" "AppointmentPriority" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "queueNumber" INTEGER NOT NULL,
ADD COLUMN     "reasonForVisit" TEXT,
ADD COLUMN     "startTime" TEXT NOT NULL,
ADD COLUMN     "symptoms" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "appointments_appointmentNumber_key" ON "appointments"("appointmentNumber");

-- CreateIndex
CREATE INDEX "appointments_departmentId_idx" ON "appointments"("departmentId");

-- CreateIndex
CREATE INDEX "appointments_appointmentDate_idx" ON "appointments"("appointmentDate");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
