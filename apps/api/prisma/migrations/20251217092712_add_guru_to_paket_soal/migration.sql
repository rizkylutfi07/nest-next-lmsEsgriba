-- AlterTable
ALTER TABLE "PaketSoal" ADD COLUMN     "guruId" TEXT;

-- CreateIndex
CREATE INDEX "PaketSoal_guruId_idx" ON "PaketSoal"("guruId");

-- AddForeignKey
ALTER TABLE "PaketSoal" ADD CONSTRAINT "PaketSoal_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;
