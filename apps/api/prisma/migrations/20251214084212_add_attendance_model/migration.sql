/*
  Warnings:

  - The values [MAGANG,ALUMNI] on the enum `StatusSiswa` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'ALPHA', 'TERLAMBAT');

-- AlterEnum
BEGIN;
CREATE TYPE "StatusSiswa_new" AS ENUM ('AKTIF', 'LULUS', 'PINDAH', 'KELUAR');
ALTER TABLE "public"."Siswa" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Siswa" ALTER COLUMN "status" TYPE "StatusSiswa_new" USING ("status"::text::"StatusSiswa_new");
ALTER TYPE "StatusSiswa" RENAME TO "StatusSiswa_old";
ALTER TYPE "StatusSiswa_new" RENAME TO "StatusSiswa";
DROP TYPE "public"."StatusSiswa_old";
ALTER TABLE "Siswa" ALTER COLUMN "status" SET DEFAULT 'AKTIF';
COMMIT;

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "tanggal" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jamMasuk" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jamKeluar" TIMESTAMP(3),
    "status" "AttendanceStatus" NOT NULL DEFAULT 'HADIR',
    "keterangan" TEXT,
    "scanBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attendance_siswaId_tanggal_idx" ON "Attendance"("siswaId", "tanggal");

-- CreateIndex
CREATE INDEX "Attendance_tanggal_idx" ON "Attendance"("tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_siswaId_tanggal_key" ON "Attendance"("siswaId", "tanggal");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "Siswa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
