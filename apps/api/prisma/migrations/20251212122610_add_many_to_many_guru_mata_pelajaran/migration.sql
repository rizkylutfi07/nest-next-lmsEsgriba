/*
  Warnings:

  - You are about to drop the column `mataPelajaranId` on the `Guru` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Guru" DROP CONSTRAINT "Guru_mataPelajaranId_fkey";

-- AlterTable
ALTER TABLE "Guru" DROP COLUMN "mataPelajaranId";

-- CreateTable
CREATE TABLE "_GuruMataPelajaran" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GuruMataPelajaran_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GuruMataPelajaran_B_index" ON "_GuruMataPelajaran"("B");

-- AddForeignKey
ALTER TABLE "_GuruMataPelajaran" ADD CONSTRAINT "_GuruMataPelajaran_A_fkey" FOREIGN KEY ("A") REFERENCES "Guru"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuruMataPelajaran" ADD CONSTRAINT "_GuruMataPelajaran_B_fkey" FOREIGN KEY ("B") REFERENCES "MataPelajaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;
