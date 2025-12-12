/*
  Warnings:

  - You are about to drop the column `jurusan` on the `Kelas` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nama,jurusanId]` on the table `Kelas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Kelas" DROP CONSTRAINT "Kelas_tahunAjaranId_fkey";

-- DropIndex
DROP INDEX "Kelas_nama_tahunAjaranId_key";

-- AlterTable
ALTER TABLE "Kelas" DROP COLUMN "jurusan",
ADD COLUMN     "jurusanId" TEXT,
ALTER COLUMN "tahunAjaranId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Jurusan" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Jurusan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jurusan_kode_key" ON "Jurusan"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Kelas_nama_jurusanId_key" ON "Kelas"("nama", "jurusanId");

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_jurusanId_fkey" FOREIGN KEY ("jurusanId") REFERENCES "Jurusan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("id") ON DELETE SET NULL ON UPDATE CASCADE;
