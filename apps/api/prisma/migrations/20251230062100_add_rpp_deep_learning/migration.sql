-- CreateEnum
CREATE TYPE "StatusRPP" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProfilPelajarPancasila" AS ENUM ('BERIMAN_BERTAKWA', 'BERKEBINEKAAN_GLOBAL', 'GOTONG_ROYONG', 'MANDIRI', 'BERNALAR_KRITIS', 'KREATIF');

-- CreateTable
CREATE TABLE "RPP" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "mataPelajaranId" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "topik" TEXT NOT NULL,
    "durasi" INTEGER NOT NULL,
    "tanggalPelaksanaan" TIMESTAMP(3),
    "capaianPembelajaran" TEXT NOT NULL,
    "tujuanPembelajaran" JSONB NOT NULL,
    "profilPelajarPancasila" JSONB NOT NULL,
    "materiPembelajaran" TEXT,
    "metodeAssessment" JSONB,
    "kegiatanPembelajaran" JSONB NOT NULL,
    "refleksi" TEXT,
    "diferensiasi" JSONB,
    "sumberBelajar" JSONB,
    "status" "StatusRPP" NOT NULL DEFAULT 'DRAFT',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RPP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RPPKelas" (
    "id" TEXT NOT NULL,
    "rppId" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RPPKelas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RPP_kode_key" ON "RPP"("kode");

-- CreateIndex
CREATE INDEX "RPP_mataPelajaranId_idx" ON "RPP"("mataPelajaranId");

-- CreateIndex
CREATE INDEX "RPP_guruId_idx" ON "RPP"("guruId");

-- CreateIndex
CREATE INDEX "RPP_status_idx" ON "RPP"("status");

-- CreateIndex
CREATE INDEX "RPP_isPublished_idx" ON "RPP"("isPublished");

-- CreateIndex
CREATE INDEX "RPPKelas_rppId_idx" ON "RPPKelas"("rppId");

-- CreateIndex
CREATE INDEX "RPPKelas_kelasId_idx" ON "RPPKelas"("kelasId");

-- CreateIndex
CREATE UNIQUE INDEX "RPPKelas_rppId_kelasId_key" ON "RPPKelas"("rppId", "kelasId");

-- AddForeignKey
ALTER TABLE "RPP" ADD CONSTRAINT "RPP_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RPP" ADD CONSTRAINT "RPP_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RPPKelas" ADD CONSTRAINT "RPPKelas_rppId_fkey" FOREIGN KEY ("rppId") REFERENCES "RPP"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RPPKelas" ADD CONSTRAINT "RPPKelas_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
