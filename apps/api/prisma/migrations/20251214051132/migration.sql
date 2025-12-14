-- DropForeignKey
ALTER TABLE "Kelas" DROP CONSTRAINT "Kelas_tahunAjaranId_fkey";

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
