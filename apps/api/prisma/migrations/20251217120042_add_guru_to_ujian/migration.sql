-- AlterTable
ALTER TABLE "Ujian" ADD COLUMN     "guruId" TEXT;

-- CreateIndex
CREATE INDEX "Ujian_guruId_idx" ON "Ujian"("guruId");

-- AddForeignKey
ALTER TABLE "Ujian" ADD CONSTRAINT "Ujian_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;
