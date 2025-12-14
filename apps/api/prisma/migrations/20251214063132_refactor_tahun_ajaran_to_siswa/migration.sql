/*
  Warnings:

  - You are about to drop the column `tahunAjaranId` on the `Kelas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Kelas" DROP CONSTRAINT "Kelas_tahunAjaranId_fkey";

-- DropIndex
DROP INDEX "Kelas_nama_jurusanId_key";

-- AlterTable
ALTER TABLE "Kelas" DROP COLUMN "tahunAjaranId";

-- AlterTable
ALTER TABLE "Siswa" ADD COLUMN     "tahunAjaranId" TEXT;

-- CreateTable
CREATE TABLE "SiswaKelasHistory" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,
    "tahunAjaranId" TEXT NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiswaKelasHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SiswaKelasHistory_siswaId_idx" ON "SiswaKelasHistory"("siswaId");

-- CreateIndex
CREATE INDEX "SiswaKelasHistory_kelasId_tahunAjaranId_idx" ON "SiswaKelasHistory"("kelasId", "tahunAjaranId");

-- AddForeignKey
ALTER TABLE "Siswa" ADD CONSTRAINT "Siswa_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiswaKelasHistory" ADD CONSTRAINT "SiswaKelasHistory_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "Siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiswaKelasHistory" ADD CONSTRAINT "SiswaKelasHistory_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiswaKelasHistory" ADD CONSTRAINT "SiswaKelasHistory_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
