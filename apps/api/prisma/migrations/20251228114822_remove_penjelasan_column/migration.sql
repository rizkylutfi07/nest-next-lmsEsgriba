/*
  Warnings:

  - You are about to drop the column `penjelasan` on the `BankSoal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BankSoal" DROP COLUMN "penjelasan",
ADD COLUMN     "guruId" TEXT,
ADD COLUMN     "kelasId" TEXT;

-- CreateTable
CREATE TABLE "PaketSoalKelas" (
    "id" TEXT NOT NULL,
    "paketSoalId" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaketSoalKelas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaketSoalKelas_paketSoalId_idx" ON "PaketSoalKelas"("paketSoalId");

-- CreateIndex
CREATE INDEX "PaketSoalKelas_kelasId_idx" ON "PaketSoalKelas"("kelasId");

-- CreateIndex
CREATE UNIQUE INDEX "PaketSoalKelas_paketSoalId_kelasId_key" ON "PaketSoalKelas"("paketSoalId", "kelasId");

-- CreateIndex
CREATE INDEX "BankSoal_guruId_idx" ON "BankSoal"("guruId");

-- CreateIndex
CREATE INDEX "BankSoal_kelasId_idx" ON "BankSoal"("kelasId");

-- AddForeignKey
ALTER TABLE "BankSoal" ADD CONSTRAINT "BankSoal_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankSoal" ADD CONSTRAINT "BankSoal_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaketSoalKelas" ADD CONSTRAINT "PaketSoalKelas_paketSoalId_fkey" FOREIGN KEY ("paketSoalId") REFERENCES "PaketSoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaketSoalKelas" ADD CONSTRAINT "PaketSoalKelas_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
