/*
  Warnings:

  - You are about to drop the column `diferensiasi` on the `RPP` table. All the data in the column will be lost.
  - You are about to drop the column `durasi` on the `RPP` table. All the data in the column will be lost.
  - You are about to drop the column `judul` on the `RPP` table. All the data in the column will be lost.
  - You are about to drop the column `kegiatanPembelajaran` on the `RPP` table. All the data in the column will be lost.
  - You are about to drop the column `materiPembelajaran` on the `RPP` table. All the data in the column will be lost.
  - You are about to drop the column `metodeAssessment` on the `RPP` table. All the data in the column will be lost.
  - You are about to drop the column `profilPelajarPancasila` on the `RPP` table. All the data in the column will be lost.
  - You are about to drop the column `refleksi` on the `RPP` table. All the data in the column will be lost.
  - You are about to drop the column `sumberBelajar` on the `RPP` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalPelaksanaan` on the `RPP` table. All the data in the column will be lost.
  - You are about to drop the column `topik` on the `RPP` table. All the data in the column will be lost.
  - Added the required column `alokasiWaktu` to the `RPP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `materi` to the `RPP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topikPembelajaran` to the `RPP` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DimensiProfilLulusan" AS ENUM ('KEIMANAN_KETAQWAAN', 'KEWARGAAN', 'PENALARAN_KRITIS', 'KREATIFITAS', 'KOLABORASI', 'KEMANDIRIAN', 'KESEHATAN', 'KOMUNIKASI');

-- AlterTable
ALTER TABLE "RPP" DROP COLUMN "diferensiasi",
DROP COLUMN "durasi",
DROP COLUMN "judul",
DROP COLUMN "kegiatanPembelajaran",
DROP COLUMN "materiPembelajaran",
DROP COLUMN "metodeAssessment",
DROP COLUMN "profilPelajarPancasila",
DROP COLUMN "refleksi",
DROP COLUMN "sumberBelajar",
DROP COLUMN "tanggalPelaksanaan",
DROP COLUMN "topik",
ADD COLUMN     "alokasiWaktu" INTEGER NOT NULL,
ADD COLUMN     "asesmenAkhir" TEXT,
ADD COLUMN     "asesmenAwal" TEXT,
ADD COLUMN     "asesmenProses" TEXT,
ADD COLUMN     "dimensiProfilLulusan" JSONB,
ADD COLUMN     "fase" TEXT,
ADD COLUMN     "identifikasiMateri" TEXT,
ADD COLUMN     "identifikasiPesertaDidik" TEXT,
ADD COLUMN     "kegiatanAwal" JSONB,
ADD COLUMN     "kegiatanMemahami" JSONB,
ADD COLUMN     "kegiatanMengaplikasi" JSONB,
ADD COLUMN     "kegiatanMerefleksi" JSONB,
ADD COLUMN     "kegiatanPenutup" JSONB,
ADD COLUMN     "kemitraanPembelajaran" TEXT,
ADD COLUMN     "lingkunganPembelajaran" TEXT,
ADD COLUMN     "lintasDisiplinIlmu" TEXT,
ADD COLUMN     "materi" TEXT NOT NULL,
ADD COLUMN     "namaGuru" TEXT,
ADD COLUMN     "pemanfaatanDigital" TEXT,
ADD COLUMN     "praktikPedagogik" TEXT,
ADD COLUMN     "tahunAjaran" TEXT,
ADD COLUMN     "topikPembelajaran" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ProfilPelajarPancasila";
