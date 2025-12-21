-- CreateEnum
CREATE TYPE "Hari" AS ENUM ('SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU');

-- CreateEnum
CREATE TYPE "TipeMateri" AS ENUM ('DOKUMEN', 'VIDEO', 'LINK', 'TEKS', 'GAMBAR');

-- CreateEnum
CREATE TYPE "TipePenilaian" AS ENUM ('MANUAL', 'AUTO', 'PEER_REVIEW');

-- CreateEnum
CREATE TYPE "StatusPengumpulan" AS ENUM ('BELUM_DIKUMPULKAN', 'DIKUMPULKAN', 'TERLAMBAT', 'DINILAI');

-- CreateEnum
CREATE TYPE "TipeNotifikasi" AS ENUM ('MATERI_BARU', 'TUGAS_BARU', 'DEADLINE_REMINDER', 'TUGAS_DINILAI', 'FORUM_REPLY', 'PENGUMUMAN', 'SISTEM');

-- AlterEnum
ALTER TYPE "StatusPengerjaan" ADD VALUE 'DIBLOKIR';

-- CreateTable
CREATE TABLE "JadwalPelajaran" (
    "id" TEXT NOT NULL,
    "hari" "Hari" NOT NULL,
    "jamMulai" TEXT NOT NULL,
    "jamSelesai" TEXT NOT NULL,
    "kelasId" TEXT NOT NULL,
    "mataPelajaranId" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JadwalPelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materi" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tipe" "TipeMateri" NOT NULL DEFAULT 'DOKUMEN',
    "konten" TEXT,
    "mataPelajaranId" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "kelasId" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Materi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MateriAttachment" (
    "id" TEXT NOT NULL,
    "materiId" TEXT NOT NULL,
    "namaFile" TEXT NOT NULL,
    "ukuranFile" INTEGER NOT NULL,
    "tipeFile" TEXT NOT NULL,
    "urlFile" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MateriAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MateriBookmark" (
    "id" TEXT NOT NULL,
    "materiId" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MateriBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tugas" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "instruksi" TEXT,
    "mataPelajaranId" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "kelasId" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "maxScore" INTEGER NOT NULL DEFAULT 100,
    "tipePenilaian" "TipePenilaian" NOT NULL DEFAULT 'MANUAL',
    "allowLateSubmit" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tugas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TugasAttachment" (
    "id" TEXT NOT NULL,
    "tugasId" TEXT NOT NULL,
    "namaFile" TEXT NOT NULL,
    "ukuranFile" INTEGER NOT NULL,
    "tipeFile" TEXT NOT NULL,
    "urlFile" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TugasAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TugasSiswa" (
    "id" TEXT NOT NULL,
    "tugasId" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "status" "StatusPengumpulan" NOT NULL DEFAULT 'BELUM_DIKUMPULKAN',
    "submittedAt" TIMESTAMP(3),
    "gradedAt" TIMESTAMP(3),
    "konten" TEXT,
    "score" DOUBLE PRECISION,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TugasSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TugasSiswaFile" (
    "id" TEXT NOT NULL,
    "tugasSiswaId" TEXT NOT NULL,
    "namaFile" TEXT NOT NULL,
    "ukuranFile" INTEGER NOT NULL,
    "tipeFile" TEXT NOT NULL,
    "urlFile" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TugasSiswaFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumKategori" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "icon" TEXT,
    "warna" TEXT,
    "mataPelajaranId" TEXT,
    "kelasId" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumKategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumThread" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "kategoriId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorType" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ForumThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumPost" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "parentId" TEXT,
    "authorId" TEXT NOT NULL,
    "authorType" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ForumPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumReaction" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifikasi" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipe" "TipeNotifikasi" NOT NULL,
    "judul" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "linkUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressSiswa" (
    "id" TEXT NOT NULL,
    "siswaId" TEXT NOT NULL,
    "mataPelajaranId" TEXT NOT NULL,
    "materiDibaca" INTEGER NOT NULL DEFAULT 0,
    "tugasSelesai" INTEGER NOT NULL DEFAULT 0,
    "forumPosts" INTEGER NOT NULL DEFAULT 0,
    "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressSiswa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JadwalPelajaran_kelasId_idx" ON "JadwalPelajaran"("kelasId");

-- CreateIndex
CREATE INDEX "JadwalPelajaran_hari_idx" ON "JadwalPelajaran"("hari");

-- CreateIndex
CREATE INDEX "Materi_mataPelajaranId_idx" ON "Materi"("mataPelajaranId");

-- CreateIndex
CREATE INDEX "Materi_guruId_idx" ON "Materi"("guruId");

-- CreateIndex
CREATE INDEX "Materi_kelasId_idx" ON "Materi"("kelasId");

-- CreateIndex
CREATE INDEX "Materi_isPublished_idx" ON "Materi"("isPublished");

-- CreateIndex
CREATE INDEX "MateriAttachment_materiId_idx" ON "MateriAttachment"("materiId");

-- CreateIndex
CREATE INDEX "MateriBookmark_siswaId_idx" ON "MateriBookmark"("siswaId");

-- CreateIndex
CREATE UNIQUE INDEX "MateriBookmark_materiId_siswaId_key" ON "MateriBookmark"("materiId", "siswaId");

-- CreateIndex
CREATE INDEX "Tugas_mataPelajaranId_idx" ON "Tugas"("mataPelajaranId");

-- CreateIndex
CREATE INDEX "Tugas_guruId_idx" ON "Tugas"("guruId");

-- CreateIndex
CREATE INDEX "Tugas_kelasId_idx" ON "Tugas"("kelasId");

-- CreateIndex
CREATE INDEX "Tugas_deadline_idx" ON "Tugas"("deadline");

-- CreateIndex
CREATE INDEX "TugasAttachment_tugasId_idx" ON "TugasAttachment"("tugasId");

-- CreateIndex
CREATE INDEX "TugasSiswa_tugasId_idx" ON "TugasSiswa"("tugasId");

-- CreateIndex
CREATE INDEX "TugasSiswa_siswaId_idx" ON "TugasSiswa"("siswaId");

-- CreateIndex
CREATE INDEX "TugasSiswa_status_idx" ON "TugasSiswa"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TugasSiswa_tugasId_siswaId_key" ON "TugasSiswa"("tugasId", "siswaId");

-- CreateIndex
CREATE INDEX "TugasSiswaFile_tugasSiswaId_idx" ON "TugasSiswaFile"("tugasSiswaId");

-- CreateIndex
CREATE INDEX "ForumKategori_mataPelajaranId_idx" ON "ForumKategori"("mataPelajaranId");

-- CreateIndex
CREATE INDEX "ForumKategori_kelasId_idx" ON "ForumKategori"("kelasId");

-- CreateIndex
CREATE INDEX "ForumThread_kategoriId_idx" ON "ForumThread"("kategoriId");

-- CreateIndex
CREATE INDEX "ForumThread_authorId_idx" ON "ForumThread"("authorId");

-- CreateIndex
CREATE INDEX "ForumThread_createdAt_idx" ON "ForumThread"("createdAt");

-- CreateIndex
CREATE INDEX "ForumPost_threadId_idx" ON "ForumPost"("threadId");

-- CreateIndex
CREATE INDEX "ForumPost_authorId_idx" ON "ForumPost"("authorId");

-- CreateIndex
CREATE INDEX "ForumPost_parentId_idx" ON "ForumPost"("parentId");

-- CreateIndex
CREATE INDEX "ForumReaction_postId_idx" ON "ForumReaction"("postId");

-- CreateIndex
CREATE INDEX "ForumReaction_userId_idx" ON "ForumReaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ForumReaction_postId_userId_tipe_key" ON "ForumReaction"("postId", "userId", "tipe");

-- CreateIndex
CREATE INDEX "Notifikasi_userId_idx" ON "Notifikasi"("userId");

-- CreateIndex
CREATE INDEX "Notifikasi_isRead_idx" ON "Notifikasi"("isRead");

-- CreateIndex
CREATE INDEX "Notifikasi_createdAt_idx" ON "Notifikasi"("createdAt");

-- CreateIndex
CREATE INDEX "ProgressSiswa_siswaId_idx" ON "ProgressSiswa"("siswaId");

-- CreateIndex
CREATE INDEX "ProgressSiswa_mataPelajaranId_idx" ON "ProgressSiswa"("mataPelajaranId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressSiswa_siswaId_mataPelajaranId_key" ON "ProgressSiswa"("siswaId", "mataPelajaranId");

-- AddForeignKey
ALTER TABLE "JadwalPelajaran" ADD CONSTRAINT "JadwalPelajaran_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalPelajaran" ADD CONSTRAINT "JadwalPelajaran_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalPelajaran" ADD CONSTRAINT "JadwalPelajaran_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materi" ADD CONSTRAINT "Materi_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materi" ADD CONSTRAINT "Materi_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materi" ADD CONSTRAINT "Materi_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriAttachment" ADD CONSTRAINT "MateriAttachment_materiId_fkey" FOREIGN KEY ("materiId") REFERENCES "Materi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriBookmark" ADD CONSTRAINT "MateriBookmark_materiId_fkey" FOREIGN KEY ("materiId") REFERENCES "Materi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriBookmark" ADD CONSTRAINT "MateriBookmark_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "Siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tugas" ADD CONSTRAINT "Tugas_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tugas" ADD CONSTRAINT "Tugas_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "Guru"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tugas" ADD CONSTRAINT "Tugas_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TugasAttachment" ADD CONSTRAINT "TugasAttachment_tugasId_fkey" FOREIGN KEY ("tugasId") REFERENCES "Tugas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TugasSiswa" ADD CONSTRAINT "TugasSiswa_tugasId_fkey" FOREIGN KEY ("tugasId") REFERENCES "Tugas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TugasSiswa" ADD CONSTRAINT "TugasSiswa_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "Siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TugasSiswaFile" ADD CONSTRAINT "TugasSiswaFile_tugasSiswaId_fkey" FOREIGN KEY ("tugasSiswaId") REFERENCES "TugasSiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumKategori" ADD CONSTRAINT "ForumKategori_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "MataPelajaran"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumKategori" ADD CONSTRAINT "ForumKategori_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumThread" ADD CONSTRAINT "ForumThread_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "ForumKategori"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "ForumThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ForumPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumReaction" ADD CONSTRAINT "ForumReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressSiswa" ADD CONSTRAINT "ProgressSiswa_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "Siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressSiswa" ADD CONSTRAINT "ProgressSiswa_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "MataPelajaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
