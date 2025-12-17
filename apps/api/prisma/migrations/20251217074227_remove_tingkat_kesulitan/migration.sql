-- CreateEnum
CREATE TYPE "TipeSoal" AS ENUM ('PILIHAN_GANDA', 'ESSAY', 'BENAR_SALAH', 'ISIAN_SINGKAT');

-- CreateEnum
CREATE TYPE "StatusUjian" AS ENUM ('DRAFT', 'PUBLISHED', 'ONGOING', 'SELESAI', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "StatusPengerjaan" AS ENUM ('BELUM_MULAI', 'SEDANG_MENGERJAKAN', 'SELESAI', 'TIDAK_HADIR');

-- CreateTable
CREATE TABLE "BankSoal" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "tipe" "TipeSoal" NOT NULL DEFAULT 'PILIHAN_GANDA',
    "mataPelajaranId" TEXT,
    "pilihanJawaban" JSONB,
    "jawabanBenar" TEXT,
    "bobot" INTEGER NOT NULL DEFAULT 1,
    "penjelasan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BankSoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ujian" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "mataPelajaranId" TEXT,
    "kelasId" TEXT,
    "durasi" INTEGER NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "nilaiMinimal" INTEGER,
    "acakSoal" BOOLEAN NOT NULL DEFAULT true,
    "tampilkanNilai" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusUjian" NOT NULL DEFAULT 'DRAFT',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Ujian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UjianSoal" (
    "id" TEXT NOT NULL,
    "ujianId" TEXT NOT NULL,
    "bankSoalId" TEXT NOT NULL,
    "nomorUrut" INTEGER NOT NULL,
    "bobot" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UjianSoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UjianSiswa" (
    "id" TEXT NOT NULL,
    "ujianId" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "tokenAkses" TEXT,
    "waktuMulai" TIMESTAMP(3),
    "waktuSelesai" TIMESTAMP(3),
    "durasi" INTEGER,
    "status" "StatusPengerjaan" NOT NULL DEFAULT 'BELUM_MULAI',
    "nilaiTotal" DOUBLE PRECISION,
    "isPassed" BOOLEAN,
    "jawaban" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UjianSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankSoal_kode_key" ON "BankSoal"("kode");

-- CreateIndex
CREATE INDEX "BankSoal_mataPelajaranId_idx" ON "BankSoal"("mataPelajaranId");

-- CreateIndex
CREATE UNIQUE INDEX "Ujian_kode_key" ON "Ujian"("kode");

-- CreateIndex
CREATE INDEX "Ujian_mataPelajaranId_idx" ON "Ujian"("mataPelajaranId");

-- CreateIndex
CREATE INDEX "Ujian_kelasId_idx" ON "Ujian"("kelasId");

-- CreateIndex
CREATE INDEX "Ujian_tanggalMulai_idx" ON "Ujian"("tanggalMulai");

-- CreateIndex
CREATE INDEX "UjianSoal_ujianId_idx" ON "UjianSoal"("ujianId");

-- CreateIndex
CREATE UNIQUE INDEX "UjianSoal_ujianId_bankSoalId_key" ON "UjianSoal"("ujianId", "bankSoalId");

-- CreateIndex
CREATE UNIQUE INDEX "UjianSiswa_tokenAkses_key" ON "UjianSiswa"("tokenAkses");

-- CreateIndex
CREATE INDEX "UjianSiswa_ujianId_idx" ON "UjianSiswa"("ujianId");

-- CreateIndex
CREATE INDEX "UjianSiswa_siswaId_idx" ON "UjianSiswa"("siswaId");

-- CreateIndex
CREATE UNIQUE INDEX "UjianSiswa_ujianId_siswaId_key" ON "UjianSiswa"("ujianId", "siswaId");

-- AddForeignKey
ALTER TABLE "BankSoal" ADD CONSTRAINT "BankSoal_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "MataPelajaran"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ujian" ADD CONSTRAINT "Ujian_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "MataPelajaran"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ujian" ADD CONSTRAINT "Ujian_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UjianSoal" ADD CONSTRAINT "UjianSoal_ujianId_fkey" FOREIGN KEY ("ujianId") REFERENCES "Ujian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UjianSoal" ADD CONSTRAINT "UjianSoal_bankSoalId_fkey" FOREIGN KEY ("bankSoalId") REFERENCES "BankSoal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UjianSiswa" ADD CONSTRAINT "UjianSiswa_ujianId_fkey" FOREIGN KEY ("ujianId") REFERENCES "Ujian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UjianSiswa" ADD CONSTRAINT "UjianSiswa_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
