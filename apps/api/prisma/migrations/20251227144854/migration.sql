-- AlterTable
ALTER TABLE "Ujian" ADD COLUMN     "deteksiKecurangan" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "UjianSiswa" ADD COLUMN     "manualGrades" JSONB;

-- CreateTable
CREATE TABLE "Pengumuman" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "targetRoles" "Role"[] DEFAULT ARRAY[]::"Role"[],
    "authorId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
