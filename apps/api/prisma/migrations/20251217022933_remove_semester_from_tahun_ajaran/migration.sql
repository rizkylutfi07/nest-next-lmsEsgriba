/*
  Warnings:

  - You are about to drop the column `semester` on the `TahunAjaran` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tahun]` on the table `TahunAjaran` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TahunAjaran_tahun_semester_key";

-- AlterTable
ALTER TABLE "TahunAjaran" DROP COLUMN "semester";

-- CreateIndex
CREATE UNIQUE INDEX "TahunAjaran_tahun_key" ON "TahunAjaran"("tahun");
