-- CreateEnum
CREATE TYPE "LaboratoryOrderPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "LaboratoryOrderStatus" AS ENUM ('PENDING', 'SCHEDULED', 'COLLECTED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LaboratoryResultStatus" AS ENUM ('PENDING', 'ENTERED', 'VERIFIED', 'CANCELLED');

-- CreateTable
CREATE TABLE "laboratory_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "laboratory_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratory_tests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "laboratoryCategoryId" TEXT NOT NULL,
    "description" TEXT,
    "referenceRange" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "laboratory_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratory_orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "medicalRecordId" TEXT NOT NULL,
    "laboratoryCategoryId" TEXT NOT NULL,
    "laboratoryTestId" TEXT NOT NULL,
    "priority" "LaboratoryOrderPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "LaboratoryOrderStatus" NOT NULL DEFAULT 'PENDING',
    "clinicalNotes" TEXT,
    "orderedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectedDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "laboratory_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratory_results" (
    "id" TEXT NOT NULL,
    "laboratoryOrderId" TEXT NOT NULL,
    "resultValue" TEXT,
    "referenceRange" TEXT,
    "interpretation" TEXT,
    "technicianNotes" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "attachment" TEXT,
    "status" "LaboratoryResultStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "laboratory_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "laboratory_categories_name_key" ON "laboratory_categories"("name");

-- CreateIndex
CREATE INDEX "laboratory_categories_name_idx" ON "laboratory_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "laboratory_tests_name_key" ON "laboratory_tests"("name");

-- CreateIndex
CREATE INDEX "laboratory_tests_name_idx" ON "laboratory_tests"("name");

-- CreateIndex
CREATE INDEX "laboratory_tests_laboratoryCategoryId_idx" ON "laboratory_tests"("laboratoryCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "laboratory_orders_orderNumber_key" ON "laboratory_orders"("orderNumber");

-- CreateIndex
CREATE INDEX "laboratory_orders_patientId_idx" ON "laboratory_orders"("patientId");

-- CreateIndex
CREATE INDEX "laboratory_orders_doctorId_idx" ON "laboratory_orders"("doctorId");

-- CreateIndex
CREATE INDEX "laboratory_orders_appointmentId_idx" ON "laboratory_orders"("appointmentId");

-- CreateIndex
CREATE INDEX "laboratory_orders_medicalRecordId_idx" ON "laboratory_orders"("medicalRecordId");

-- CreateIndex
CREATE INDEX "laboratory_orders_status_idx" ON "laboratory_orders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "laboratory_results_laboratoryOrderId_key" ON "laboratory_results"("laboratoryOrderId");

-- CreateIndex
CREATE INDEX "laboratory_results_laboratoryOrderId_idx" ON "laboratory_results"("laboratoryOrderId");

-- AddForeignKey
ALTER TABLE "laboratory_tests" ADD CONSTRAINT "laboratory_tests_laboratoryCategoryId_fkey" FOREIGN KEY ("laboratoryCategoryId") REFERENCES "laboratory_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratory_orders" ADD CONSTRAINT "laboratory_orders_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratory_orders" ADD CONSTRAINT "laboratory_orders_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratory_orders" ADD CONSTRAINT "laboratory_orders_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratory_orders" ADD CONSTRAINT "laboratory_orders_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratory_orders" ADD CONSTRAINT "laboratory_orders_laboratoryCategoryId_fkey" FOREIGN KEY ("laboratoryCategoryId") REFERENCES "laboratory_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratory_orders" ADD CONSTRAINT "laboratory_orders_laboratoryTestId_fkey" FOREIGN KEY ("laboratoryTestId") REFERENCES "laboratory_tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratory_results" ADD CONSTRAINT "laboratory_results_laboratoryOrderId_fkey" FOREIGN KEY ("laboratoryOrderId") REFERENCES "laboratory_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
