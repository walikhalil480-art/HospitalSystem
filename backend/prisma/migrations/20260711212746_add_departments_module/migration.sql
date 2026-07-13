/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `departments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");
