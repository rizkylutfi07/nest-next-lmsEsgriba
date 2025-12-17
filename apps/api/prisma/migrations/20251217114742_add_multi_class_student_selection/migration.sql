-- AlterTable
ALTER TABLE "Siswa" ADD COLUMN     "agama" TEXT;

-- CreateTable
CREATE TABLE "UjianKelas" (
    "id" TEXT NOT NULL,
    "ujianId" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UjianKelas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UjianKelas_ujianId_idx" ON "UjianKelas"("ujianId");

-- CreateIndex
CREATE INDEX "UjianKelas_kelasId_idx" ON "UjianKelas"("kelasId");

-- CreateIndex
CREATE UNIQUE INDEX "UjianKelas_ujianId_kelasId_key" ON "UjianKelas"("ujianId", "kelasId");

-- AddForeignKey
ALTER TABLE "UjianKelas" ADD CONSTRAINT "UjianKelas_ujianId_fkey" FOREIGN KEY ("ujianId") REFERENCES "Ujian"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UjianKelas" ADD CONSTRAINT "UjianKelas_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
