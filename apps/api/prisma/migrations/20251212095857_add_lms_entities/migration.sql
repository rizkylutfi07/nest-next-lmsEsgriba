-- CreateEnum
CREATE TYPE "StatusTahunAjaran" AS ENUM ('AKTIF', 'SELESAI', 'AKAN_DATANG');

-- CreateEnum
CREATE TYPE "StatusGuru" AS ENUM ('AKTIF', 'CUTI', 'PENSIUN');

-- CreateEnum
CREATE TYPE "StatusSiswa" AS ENUM ('AKTIF', 'MAGANG', 'PINDAH', 'ALUMNI');

-- CreateTable
CREATE TABLE "TahunAjaran" (
    "id" TEXT NOT NULL,
    "tahun" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "status" "StatusTahunAjaran" NOT NULL DEFAULT 'AKAN_DATANG',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TahunAjaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MataPelajaran" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jamPelajaran" INTEGER NOT NULL,
    "deskripsi" TEXT,
    "tingkat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MataPelajaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guru" (
    "id" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nomorTelepon" TEXT,
    "status" "StatusGuru" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "mataPelajaranId" TEXT,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kelas" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tingkat" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "kapasitas" INTEGER NOT NULL DEFAULT 32,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "tahunAjaranId" TEXT NOT NULL,
    "waliKelasId" TEXT,

    CONSTRAINT "Kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Siswa" (
    "id" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "alamat" TEXT,
    "nomorTelepon" TEXT,
    "email" TEXT,
    "status" "StatusSiswa" NOT NULL DEFAULT 'AKTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "kelasId" TEXT,

    CONSTRAINT "Siswa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TahunAjaran_tahun_semester_key" ON "TahunAjaran"("tahun", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "MataPelajaran_kode_key" ON "MataPelajaran"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_nip_key" ON "Guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_email_key" ON "Guru"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Kelas_nama_tahunAjaranId_key" ON "Kelas"("nama", "tahunAjaranId");

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nisn_key" ON "Siswa"("nisn");

-- AddForeignKey
ALTER TABLE "Guru" ADD CONSTRAINT "Guru_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES "MataPelajaran"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES "TahunAjaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kelas" ADD CONSTRAINT "Kelas_waliKelasId_fkey" FOREIGN KEY ("waliKelasId") REFERENCES "Guru"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Siswa" ADD CONSTRAINT "Siswa_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "Kelas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
