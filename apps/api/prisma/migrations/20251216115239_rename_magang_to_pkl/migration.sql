/*
  Warnings:

  - The values [MAGANG] on the enum `StatusSiswa` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusSiswa_new" AS ENUM ('AKTIF', 'PKL', 'LULUS', 'PINDAH', 'KELUAR');
ALTER TABLE "public"."Siswa" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Siswa" ALTER COLUMN "status" TYPE "StatusSiswa_new" USING ("status"::text::"StatusSiswa_new");
ALTER TYPE "StatusSiswa" RENAME TO "StatusSiswa_old";
ALTER TYPE "StatusSiswa_new" RENAME TO "StatusSiswa";
DROP TYPE "public"."StatusSiswa_old";
ALTER TABLE "Siswa" ALTER COLUMN "status" SET DEFAULT 'AKTIF';
COMMIT;
