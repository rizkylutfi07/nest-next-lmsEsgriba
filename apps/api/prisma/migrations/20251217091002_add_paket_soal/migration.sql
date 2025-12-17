-- AlterTable
ALTER TABLE "Ujian" ADD COLUMN     "paketSoalId" TEXT;

-- CreateTable
CREATE TABLE "PaketSoal" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "mataPelajaranId" TEXT,
    "tingkatKesulitan" TEXT,
    "totalSoal" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PaketSoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaketSoalItem" (
    "id" TEXT NOT NULL,
    "paketSoalId" TEXT NOT NULL,
    "bankSoalId" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaketSoalItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaketSoal_kode_key" ON "PaketSoal"("kode");

-- CreateIndex
CREATE INDEX "PaketSoal_mataPelajaranId_idx" ON "PaketSoal"("mataPelajaranId");

-- CreateIndex
CREATE INDEX "PaketSoalItem_paketSoalId_idx" ON "PaketSoalItem"("paketSoalId");

-- CreateIndex
CREATE UNIQUE INDEX "PaketSoalItem_paketSoalId_bankSoalId_key" ON "PaketSoalItem"("paketSoalId", "bankSoalId");

-- AddForeignKey
ALTER TABLE "PaketSoal" ADD CONSTRAINT "PaketSoal_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "MataPelajaran"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaketSoalItem" ADD CONSTRAINT "PaketSoalItem_paketSoalId_fkey" FOREIGN KEY ("paketSoalId") REFERENCES "PaketSoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaketSoalItem" ADD CONSTRAINT "PaketSoalItem_bankSoalId_fkey" FOREIGN KEY ("bankSoalId") REFERENCES "BankSoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ujian" ADD CONSTRAINT "Ujian_paketSoalId_fkey" FOREIGN KEY ("paketSoalId") REFERENCES "PaketSoal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
