--
-- PostgreSQL database dump
--

\restrict pNPDmsxY4qcb7geGjiVmEae23a75IPgWq3856i2WtSIHKDwHKAICHNrQg7ovWSa

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."_GuruMataPelajaran" DROP CONSTRAINT IF EXISTS "_GuruMataPelajaran_B_fkey";
ALTER TABLE IF EXISTS ONLY public."_GuruMataPelajaran" DROP CONSTRAINT IF EXISTS "_GuruMataPelajaran_A_fkey";
ALTER TABLE IF EXISTS ONLY public."Ujian" DROP CONSTRAINT IF EXISTS "Ujian_paketSoalId_fkey";
ALTER TABLE IF EXISTS ONLY public."Ujian" DROP CONSTRAINT IF EXISTS "Ujian_mataPelajaranId_fkey";
ALTER TABLE IF EXISTS ONLY public."Ujian" DROP CONSTRAINT IF EXISTS "Ujian_kelasId_fkey";
ALTER TABLE IF EXISTS ONLY public."Ujian" DROP CONSTRAINT IF EXISTS "Ujian_guruId_fkey";
ALTER TABLE IF EXISTS ONLY public."UjianSoal" DROP CONSTRAINT IF EXISTS "UjianSoal_ujianId_fkey";
ALTER TABLE IF EXISTS ONLY public."UjianSoal" DROP CONSTRAINT IF EXISTS "UjianSoal_bankSoalId_fkey";
ALTER TABLE IF EXISTS ONLY public."UjianSiswa" DROP CONSTRAINT IF EXISTS "UjianSiswa_ujianId_fkey";
ALTER TABLE IF EXISTS ONLY public."UjianSiswa" DROP CONSTRAINT IF EXISTS "UjianSiswa_siswaId_fkey";
ALTER TABLE IF EXISTS ONLY public."UjianKelas" DROP CONSTRAINT IF EXISTS "UjianKelas_ujianId_fkey";
ALTER TABLE IF EXISTS ONLY public."UjianKelas" DROP CONSTRAINT IF EXISTS "UjianKelas_kelasId_fkey";
ALTER TABLE IF EXISTS ONLY public."Tugas" DROP CONSTRAINT IF EXISTS "Tugas_mataPelajaranId_fkey";
ALTER TABLE IF EXISTS ONLY public."Tugas" DROP CONSTRAINT IF EXISTS "Tugas_kelasId_fkey";
ALTER TABLE IF EXISTS ONLY public."Tugas" DROP CONSTRAINT IF EXISTS "Tugas_guruId_fkey";
ALTER TABLE IF EXISTS ONLY public."TugasSiswa" DROP CONSTRAINT IF EXISTS "TugasSiswa_tugasId_fkey";
ALTER TABLE IF EXISTS ONLY public."TugasSiswa" DROP CONSTRAINT IF EXISTS "TugasSiswa_siswaId_fkey";
ALTER TABLE IF EXISTS ONLY public."TugasSiswaFile" DROP CONSTRAINT IF EXISTS "TugasSiswaFile_tugasSiswaId_fkey";
ALTER TABLE IF EXISTS ONLY public."TugasAttachment" DROP CONSTRAINT IF EXISTS "TugasAttachment_tugasId_fkey";
ALTER TABLE IF EXISTS ONLY public."Siswa" DROP CONSTRAINT IF EXISTS "Siswa_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."Siswa" DROP CONSTRAINT IF EXISTS "Siswa_tahunAjaranId_fkey";
ALTER TABLE IF EXISTS ONLY public."Siswa" DROP CONSTRAINT IF EXISTS "Siswa_kelasId_fkey";
ALTER TABLE IF EXISTS ONLY public."SiswaKelasHistory" DROP CONSTRAINT IF EXISTS "SiswaKelasHistory_tahunAjaranId_fkey";
ALTER TABLE IF EXISTS ONLY public."SiswaKelasHistory" DROP CONSTRAINT IF EXISTS "SiswaKelasHistory_siswaId_fkey";
ALTER TABLE IF EXISTS ONLY public."SiswaKelasHistory" DROP CONSTRAINT IF EXISTS "SiswaKelasHistory_kelasId_fkey";
ALTER TABLE IF EXISTS ONLY public."RPP" DROP CONSTRAINT IF EXISTS "RPP_mataPelajaranId_fkey";
ALTER TABLE IF EXISTS ONLY public."RPP" DROP CONSTRAINT IF EXISTS "RPP_guruId_fkey";
ALTER TABLE IF EXISTS ONLY public."RPPKelas" DROP CONSTRAINT IF EXISTS "RPPKelas_rppId_fkey";
ALTER TABLE IF EXISTS ONLY public."RPPKelas" DROP CONSTRAINT IF EXISTS "RPPKelas_kelasId_fkey";
ALTER TABLE IF EXISTS ONLY public."ProgressSiswa" DROP CONSTRAINT IF EXISTS "ProgressSiswa_siswaId_fkey";
ALTER TABLE IF EXISTS ONLY public."ProgressSiswa" DROP CONSTRAINT IF EXISTS "ProgressSiswa_mataPelajaranId_fkey";
ALTER TABLE IF EXISTS ONLY public."Pengumuman" DROP CONSTRAINT IF EXISTS "Pengumuman_authorId_fkey";
ALTER TABLE IF EXISTS ONLY public."PaketSoal" DROP CONSTRAINT IF EXISTS "PaketSoal_mataPelajaranId_fkey";
ALTER TABLE IF EXISTS ONLY public."PaketSoal" DROP CONSTRAINT IF EXISTS "PaketSoal_guruId_fkey";
ALTER TABLE IF EXISTS ONLY public."PaketSoalKelas" DROP CONSTRAINT IF EXISTS "PaketSoalKelas_paketSoalId_fkey";
ALTER TABLE IF EXISTS ONLY public."PaketSoalKelas" DROP CONSTRAINT IF EXISTS "PaketSoalKelas_kelasId_fkey";
ALTER TABLE IF EXISTS ONLY public."PaketSoalItem" DROP CONSTRAINT IF EXISTS "PaketSoalItem_paketSoalId_fkey";
ALTER TABLE IF EXISTS ONLY public."PaketSoalItem" DROP CONSTRAINT IF EXISTS "PaketSoalItem_bankSoalId_fkey";
ALTER TABLE IF EXISTS ONLY public."Materi" DROP CONSTRAINT IF EXISTS "Materi_mataPelajaranId_fkey";
ALTER TABLE IF EXISTS ONLY public."Materi" DROP CONSTRAINT IF EXISTS "Materi_kelasId_fkey";
ALTER TABLE IF EXISTS ONLY public."Materi" DROP CONSTRAINT IF EXISTS "Materi_guruId_fkey";
ALTER TABLE IF EXISTS ONLY public."MateriBookmark" DROP CONSTRAINT IF EXISTS "MateriBookmark_siswaId_fkey";
ALTER TABLE IF EXISTS ONLY public."MateriBookmark" DROP CONSTRAINT IF EXISTS "MateriBookmark_materiId_fkey";
ALTER TABLE IF EXISTS ONLY public."MateriAttachment" DROP CONSTRAINT IF EXISTS "MateriAttachment_materiId_fkey";
ALTER TABLE IF EXISTS ONLY public."Kelas" DROP CONSTRAINT IF EXISTS "Kelas_waliKelasId_fkey";
ALTER TABLE IF EXISTS ONLY public."Kelas" DROP CONSTRAINT IF EXISTS "Kelas_jurusanId_fkey";
ALTER TABLE IF EXISTS ONLY public."JadwalPelajaran" DROP CONSTRAINT IF EXISTS "JadwalPelajaran_mataPelajaranId_fkey";
ALTER TABLE IF EXISTS ONLY public."JadwalPelajaran" DROP CONSTRAINT IF EXISTS "JadwalPelajaran_kelasId_fkey";
ALTER TABLE IF EXISTS ONLY public."JadwalPelajaran" DROP CONSTRAINT IF EXISTS "JadwalPelajaran_guruId_fkey";
ALTER TABLE IF EXISTS ONLY public."Guru" DROP CONSTRAINT IF EXISTS "Guru_userId_fkey";
ALTER TABLE IF EXISTS ONLY public."ForumThread" DROP CONSTRAINT IF EXISTS "ForumThread_kategoriId_fkey";
ALTER TABLE IF EXISTS ONLY public."ForumReaction" DROP CONSTRAINT IF EXISTS "ForumReaction_postId_fkey";
ALTER TABLE IF EXISTS ONLY public."ForumPost" DROP CONSTRAINT IF EXISTS "ForumPost_threadId_fkey";
ALTER TABLE IF EXISTS ONLY public."ForumPost" DROP CONSTRAINT IF EXISTS "ForumPost_parentId_fkey";
ALTER TABLE IF EXISTS ONLY public."ForumKategori" DROP CONSTRAINT IF EXISTS "ForumKategori_mataPelajaranId_fkey";
ALTER TABLE IF EXISTS ONLY public."ForumKategori" DROP CONSTRAINT IF EXISTS "ForumKategori_kelasId_fkey";
ALTER TABLE IF EXISTS ONLY public."BankSoal" DROP CONSTRAINT IF EXISTS "BankSoal_mataPelajaranId_fkey";
ALTER TABLE IF EXISTS ONLY public."BankSoal" DROP CONSTRAINT IF EXISTS "BankSoal_kelasId_fkey";
ALTER TABLE IF EXISTS ONLY public."BankSoal" DROP CONSTRAINT IF EXISTS "BankSoal_guruId_fkey";
ALTER TABLE IF EXISTS ONLY public."Attendance" DROP CONSTRAINT IF EXISTS "Attendance_siswaId_fkey";
DROP INDEX IF EXISTS public."_GuruMataPelajaran_B_index";
DROP INDEX IF EXISTS public."User_email_key";
DROP INDEX IF EXISTS public."Ujian_tanggalMulai_idx";
DROP INDEX IF EXISTS public."Ujian_mataPelajaranId_idx";
DROP INDEX IF EXISTS public."Ujian_kode_key";
DROP INDEX IF EXISTS public."Ujian_kelasId_idx";
DROP INDEX IF EXISTS public."Ujian_guruId_idx";
DROP INDEX IF EXISTS public."UjianSoal_ujianId_idx";
DROP INDEX IF EXISTS public."UjianSoal_ujianId_bankSoalId_key";
DROP INDEX IF EXISTS public."UjianSiswa_ujianId_siswaId_key";
DROP INDEX IF EXISTS public."UjianSiswa_ujianId_idx";
DROP INDEX IF EXISTS public."UjianSiswa_tokenAkses_key";
DROP INDEX IF EXISTS public."UjianSiswa_siswaId_idx";
DROP INDEX IF EXISTS public."UjianKelas_ujianId_kelasId_key";
DROP INDEX IF EXISTS public."UjianKelas_ujianId_idx";
DROP INDEX IF EXISTS public."UjianKelas_kelasId_idx";
DROP INDEX IF EXISTS public."Tugas_mataPelajaranId_idx";
DROP INDEX IF EXISTS public."Tugas_kelasId_idx";
DROP INDEX IF EXISTS public."Tugas_guruId_idx";
DROP INDEX IF EXISTS public."Tugas_deadline_idx";
DROP INDEX IF EXISTS public."TugasSiswa_tugasId_siswaId_key";
DROP INDEX IF EXISTS public."TugasSiswa_tugasId_idx";
DROP INDEX IF EXISTS public."TugasSiswa_status_idx";
DROP INDEX IF EXISTS public."TugasSiswa_siswaId_idx";
DROP INDEX IF EXISTS public."TugasSiswaFile_tugasSiswaId_idx";
DROP INDEX IF EXISTS public."TugasAttachment_tugasId_idx";
DROP INDEX IF EXISTS public."TahunAjaran_tahun_key";
DROP INDEX IF EXISTS public."Siswa_userId_key";
DROP INDEX IF EXISTS public."Siswa_nisn_key";
DROP INDEX IF EXISTS public."SiswaKelasHistory_siswaId_idx";
DROP INDEX IF EXISTS public."SiswaKelasHistory_kelasId_tahunAjaranId_idx";
DROP INDEX IF EXISTS public."Settings_key_key";
DROP INDEX IF EXISTS public."RPP_status_idx";
DROP INDEX IF EXISTS public."RPP_mataPelajaranId_idx";
DROP INDEX IF EXISTS public."RPP_kode_key";
DROP INDEX IF EXISTS public."RPP_isPublished_idx";
DROP INDEX IF EXISTS public."RPP_guruId_idx";
DROP INDEX IF EXISTS public."RPPKelas_rppId_kelasId_key";
DROP INDEX IF EXISTS public."RPPKelas_rppId_idx";
DROP INDEX IF EXISTS public."RPPKelas_kelasId_idx";
DROP INDEX IF EXISTS public."ProgressSiswa_siswaId_mataPelajaranId_key";
DROP INDEX IF EXISTS public."ProgressSiswa_siswaId_idx";
DROP INDEX IF EXISTS public."ProgressSiswa_mataPelajaranId_idx";
DROP INDEX IF EXISTS public."PaketSoal_mataPelajaranId_idx";
DROP INDEX IF EXISTS public."PaketSoal_kode_key";
DROP INDEX IF EXISTS public."PaketSoal_guruId_idx";
DROP INDEX IF EXISTS public."PaketSoalKelas_paketSoalId_kelasId_key";
DROP INDEX IF EXISTS public."PaketSoalKelas_paketSoalId_idx";
DROP INDEX IF EXISTS public."PaketSoalKelas_kelasId_idx";
DROP INDEX IF EXISTS public."PaketSoalItem_paketSoalId_idx";
DROP INDEX IF EXISTS public."PaketSoalItem_paketSoalId_bankSoalId_key";
DROP INDEX IF EXISTS public."Notifikasi_userId_idx";
DROP INDEX IF EXISTS public."Notifikasi_isRead_idx";
DROP INDEX IF EXISTS public."Notifikasi_createdAt_idx";
DROP INDEX IF EXISTS public."Materi_mataPelajaranId_idx";
DROP INDEX IF EXISTS public."Materi_kelasId_idx";
DROP INDEX IF EXISTS public."Materi_isPublished_idx";
DROP INDEX IF EXISTS public."Materi_guruId_idx";
DROP INDEX IF EXISTS public."MateriBookmark_siswaId_idx";
DROP INDEX IF EXISTS public."MateriBookmark_materiId_siswaId_key";
DROP INDEX IF EXISTS public."MateriAttachment_materiId_idx";
DROP INDEX IF EXISTS public."MataPelajaran_kode_key";
DROP INDEX IF EXISTS public."Jurusan_kode_key";
DROP INDEX IF EXISTS public."JadwalPelajaran_kelasId_idx";
DROP INDEX IF EXISTS public."JadwalPelajaran_hari_idx";
DROP INDEX IF EXISTS public."Guru_userId_key";
DROP INDEX IF EXISTS public."Guru_nip_key";
DROP INDEX IF EXISTS public."Guru_email_key";
DROP INDEX IF EXISTS public."ForumThread_kategoriId_idx";
DROP INDEX IF EXISTS public."ForumThread_createdAt_idx";
DROP INDEX IF EXISTS public."ForumThread_authorId_idx";
DROP INDEX IF EXISTS public."ForumReaction_userId_idx";
DROP INDEX IF EXISTS public."ForumReaction_postId_userId_tipe_key";
DROP INDEX IF EXISTS public."ForumReaction_postId_idx";
DROP INDEX IF EXISTS public."ForumPost_threadId_idx";
DROP INDEX IF EXISTS public."ForumPost_parentId_idx";
DROP INDEX IF EXISTS public."ForumPost_authorId_idx";
DROP INDEX IF EXISTS public."ForumKategori_mataPelajaranId_idx";
DROP INDEX IF EXISTS public."ForumKategori_kelasId_idx";
DROP INDEX IF EXISTS public."BankSoal_mataPelajaranId_idx";
DROP INDEX IF EXISTS public."BankSoal_kode_key";
DROP INDEX IF EXISTS public."BankSoal_kelasId_idx";
DROP INDEX IF EXISTS public."BankSoal_guruId_idx";
DROP INDEX IF EXISTS public."Attendance_tanggal_idx";
DROP INDEX IF EXISTS public."Attendance_siswaId_tanggal_key";
DROP INDEX IF EXISTS public."Attendance_siswaId_tanggal_idx";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."_GuruMataPelajaran" DROP CONSTRAINT IF EXISTS "_GuruMataPelajaran_AB_pkey";
ALTER TABLE IF EXISTS ONLY public."User" DROP CONSTRAINT IF EXISTS "User_pkey";
ALTER TABLE IF EXISTS ONLY public."Ujian" DROP CONSTRAINT IF EXISTS "Ujian_pkey";
ALTER TABLE IF EXISTS ONLY public."UjianSoal" DROP CONSTRAINT IF EXISTS "UjianSoal_pkey";
ALTER TABLE IF EXISTS ONLY public."UjianSiswa" DROP CONSTRAINT IF EXISTS "UjianSiswa_pkey";
ALTER TABLE IF EXISTS ONLY public."UjianKelas" DROP CONSTRAINT IF EXISTS "UjianKelas_pkey";
ALTER TABLE IF EXISTS ONLY public."Tugas" DROP CONSTRAINT IF EXISTS "Tugas_pkey";
ALTER TABLE IF EXISTS ONLY public."TugasSiswa" DROP CONSTRAINT IF EXISTS "TugasSiswa_pkey";
ALTER TABLE IF EXISTS ONLY public."TugasSiswaFile" DROP CONSTRAINT IF EXISTS "TugasSiswaFile_pkey";
ALTER TABLE IF EXISTS ONLY public."TugasAttachment" DROP CONSTRAINT IF EXISTS "TugasAttachment_pkey";
ALTER TABLE IF EXISTS ONLY public."TahunAjaran" DROP CONSTRAINT IF EXISTS "TahunAjaran_pkey";
ALTER TABLE IF EXISTS ONLY public."Siswa" DROP CONSTRAINT IF EXISTS "Siswa_pkey";
ALTER TABLE IF EXISTS ONLY public."SiswaKelasHistory" DROP CONSTRAINT IF EXISTS "SiswaKelasHistory_pkey";
ALTER TABLE IF EXISTS ONLY public."Settings" DROP CONSTRAINT IF EXISTS "Settings_pkey";
ALTER TABLE IF EXISTS ONLY public."RPP" DROP CONSTRAINT IF EXISTS "RPP_pkey";
ALTER TABLE IF EXISTS ONLY public."RPPKelas" DROP CONSTRAINT IF EXISTS "RPPKelas_pkey";
ALTER TABLE IF EXISTS ONLY public."ProgressSiswa" DROP CONSTRAINT IF EXISTS "ProgressSiswa_pkey";
ALTER TABLE IF EXISTS ONLY public."Pengumuman" DROP CONSTRAINT IF EXISTS "Pengumuman_pkey";
ALTER TABLE IF EXISTS ONLY public."PaketSoal" DROP CONSTRAINT IF EXISTS "PaketSoal_pkey";
ALTER TABLE IF EXISTS ONLY public."PaketSoalKelas" DROP CONSTRAINT IF EXISTS "PaketSoalKelas_pkey";
ALTER TABLE IF EXISTS ONLY public."PaketSoalItem" DROP CONSTRAINT IF EXISTS "PaketSoalItem_pkey";
ALTER TABLE IF EXISTS ONLY public."Notifikasi" DROP CONSTRAINT IF EXISTS "Notifikasi_pkey";
ALTER TABLE IF EXISTS ONLY public."Materi" DROP CONSTRAINT IF EXISTS "Materi_pkey";
ALTER TABLE IF EXISTS ONLY public."MateriBookmark" DROP CONSTRAINT IF EXISTS "MateriBookmark_pkey";
ALTER TABLE IF EXISTS ONLY public."MateriAttachment" DROP CONSTRAINT IF EXISTS "MateriAttachment_pkey";
ALTER TABLE IF EXISTS ONLY public."MataPelajaran" DROP CONSTRAINT IF EXISTS "MataPelajaran_pkey";
ALTER TABLE IF EXISTS ONLY public."Kelas" DROP CONSTRAINT IF EXISTS "Kelas_pkey";
ALTER TABLE IF EXISTS ONLY public."Jurusan" DROP CONSTRAINT IF EXISTS "Jurusan_pkey";
ALTER TABLE IF EXISTS ONLY public."JadwalPelajaran" DROP CONSTRAINT IF EXISTS "JadwalPelajaran_pkey";
ALTER TABLE IF EXISTS ONLY public."Guru" DROP CONSTRAINT IF EXISTS "Guru_pkey";
ALTER TABLE IF EXISTS ONLY public."ForumThread" DROP CONSTRAINT IF EXISTS "ForumThread_pkey";
ALTER TABLE IF EXISTS ONLY public."ForumReaction" DROP CONSTRAINT IF EXISTS "ForumReaction_pkey";
ALTER TABLE IF EXISTS ONLY public."ForumPost" DROP CONSTRAINT IF EXISTS "ForumPost_pkey";
ALTER TABLE IF EXISTS ONLY public."ForumKategori" DROP CONSTRAINT IF EXISTS "ForumKategori_pkey";
ALTER TABLE IF EXISTS ONLY public."BankSoal" DROP CONSTRAINT IF EXISTS "BankSoal_pkey";
ALTER TABLE IF EXISTS ONLY public."Attendance" DROP CONSTRAINT IF EXISTS "Attendance_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."_GuruMataPelajaran";
DROP TABLE IF EXISTS public."User";
DROP TABLE IF EXISTS public."UjianSoal";
DROP TABLE IF EXISTS public."UjianSiswa";
DROP TABLE IF EXISTS public."UjianKelas";
DROP TABLE IF EXISTS public."Ujian";
DROP TABLE IF EXISTS public."TugasSiswaFile";
DROP TABLE IF EXISTS public."TugasSiswa";
DROP TABLE IF EXISTS public."TugasAttachment";
DROP TABLE IF EXISTS public."Tugas";
DROP TABLE IF EXISTS public."TahunAjaran";
DROP TABLE IF EXISTS public."SiswaKelasHistory";
DROP TABLE IF EXISTS public."Siswa";
DROP TABLE IF EXISTS public."Settings";
DROP TABLE IF EXISTS public."RPPKelas";
DROP TABLE IF EXISTS public."RPP";
DROP TABLE IF EXISTS public."ProgressSiswa";
DROP TABLE IF EXISTS public."Pengumuman";
DROP TABLE IF EXISTS public."PaketSoalKelas";
DROP TABLE IF EXISTS public."PaketSoalItem";
DROP TABLE IF EXISTS public."PaketSoal";
DROP TABLE IF EXISTS public."Notifikasi";
DROP TABLE IF EXISTS public."MateriBookmark";
DROP TABLE IF EXISTS public."MateriAttachment";
DROP TABLE IF EXISTS public."Materi";
DROP TABLE IF EXISTS public."MataPelajaran";
DROP TABLE IF EXISTS public."Kelas";
DROP TABLE IF EXISTS public."Jurusan";
DROP TABLE IF EXISTS public."JadwalPelajaran";
DROP TABLE IF EXISTS public."Guru";
DROP TABLE IF EXISTS public."ForumThread";
DROP TABLE IF EXISTS public."ForumReaction";
DROP TABLE IF EXISTS public."ForumPost";
DROP TABLE IF EXISTS public."ForumKategori";
DROP TABLE IF EXISTS public."BankSoal";
DROP TABLE IF EXISTS public."Attendance";
DROP TYPE IF EXISTS public."TipeSoal";
DROP TYPE IF EXISTS public."TipePenilaian";
DROP TYPE IF EXISTS public."TipeNotifikasi";
DROP TYPE IF EXISTS public."TipeMateri";
DROP TYPE IF EXISTS public."StatusUjian";
DROP TYPE IF EXISTS public."StatusTahunAjaran";
DROP TYPE IF EXISTS public."StatusSiswa";
DROP TYPE IF EXISTS public."StatusRPP";
DROP TYPE IF EXISTS public."StatusPengumpulan";
DROP TYPE IF EXISTS public."StatusPengerjaan";
DROP TYPE IF EXISTS public."StatusGuru";
DROP TYPE IF EXISTS public."Role";
DROP TYPE IF EXISTS public."Hari";
DROP TYPE IF EXISTS public."DimensiProfilLulusan";
DROP TYPE IF EXISTS public."AttendanceStatus";
--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'HADIR',
    'IZIN',
    'SAKIT',
    'ALPHA',
    'TERLAMBAT'
);


ALTER TYPE public."AttendanceStatus" OWNER TO postgres;

--
-- Name: DimensiProfilLulusan; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DimensiProfilLulusan" AS ENUM (
    'KEIMANAN_KETAQWAAN',
    'KEWARGAAN',
    'PENALARAN_KRITIS',
    'KREATIFITAS',
    'KOLABORASI',
    'KEMANDIRIAN',
    'KESEHATAN',
    'KOMUNIKASI'
);


ALTER TYPE public."DimensiProfilLulusan" OWNER TO postgres;

--
-- Name: Hari; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Hari" AS ENUM (
    'SENIN',
    'SELASA',
    'RABU',
    'KAMIS',
    'JUMAT',
    'SABTU'
);


ALTER TYPE public."Hari" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'GURU',
    'SISWA',
    'PETUGAS_ABSENSI'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: StatusGuru; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusGuru" AS ENUM (
    'AKTIF',
    'CUTI',
    'PENSIUN'
);


ALTER TYPE public."StatusGuru" OWNER TO postgres;

--
-- Name: StatusPengerjaan; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusPengerjaan" AS ENUM (
    'BELUM_MULAI',
    'SEDANG_MENGERJAKAN',
    'SELESAI',
    'TIDAK_HADIR',
    'DIBLOKIR'
);


ALTER TYPE public."StatusPengerjaan" OWNER TO postgres;

--
-- Name: StatusPengumpulan; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusPengumpulan" AS ENUM (
    'BELUM_DIKUMPULKAN',
    'DIKUMPULKAN',
    'TERLAMBAT',
    'DINILAI'
);


ALTER TYPE public."StatusPengumpulan" OWNER TO postgres;

--
-- Name: StatusRPP; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusRPP" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."StatusRPP" OWNER TO postgres;

--
-- Name: StatusSiswa; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusSiswa" AS ENUM (
    'AKTIF',
    'PKL',
    'LULUS',
    'PINDAH',
    'KELUAR'
);


ALTER TYPE public."StatusSiswa" OWNER TO postgres;

--
-- Name: StatusTahunAjaran; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusTahunAjaran" AS ENUM (
    'AKTIF',
    'SELESAI',
    'AKAN_DATANG'
);


ALTER TYPE public."StatusTahunAjaran" OWNER TO postgres;

--
-- Name: StatusUjian; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusUjian" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ONGOING',
    'SELESAI',
    'DIBATALKAN'
);


ALTER TYPE public."StatusUjian" OWNER TO postgres;

--
-- Name: TipeMateri; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TipeMateri" AS ENUM (
    'DOKUMEN',
    'VIDEO',
    'LINK',
    'TEKS',
    'GAMBAR'
);


ALTER TYPE public."TipeMateri" OWNER TO postgres;

--
-- Name: TipeNotifikasi; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TipeNotifikasi" AS ENUM (
    'MATERI_BARU',
    'TUGAS_BARU',
    'DEADLINE_REMINDER',
    'TUGAS_DINILAI',
    'FORUM_REPLY',
    'PENGUMUMAN',
    'SISTEM'
);


ALTER TYPE public."TipeNotifikasi" OWNER TO postgres;

--
-- Name: TipePenilaian; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TipePenilaian" AS ENUM (
    'MANUAL',
    'AUTO',
    'PEER_REVIEW'
);


ALTER TYPE public."TipePenilaian" OWNER TO postgres;

--
-- Name: TipeSoal; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TipeSoal" AS ENUM (
    'PILIHAN_GANDA',
    'ESSAY',
    'BENAR_SALAH',
    'ISIAN_SINGKAT'
);


ALTER TYPE public."TipeSoal" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Attendance" (
    id text NOT NULL,
    "siswaId" text NOT NULL,
    tanggal date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "jamMasuk" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "jamKeluar" timestamp(3) without time zone,
    status public."AttendanceStatus" DEFAULT 'HADIR'::public."AttendanceStatus" NOT NULL,
    keterangan text,
    "scanBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Attendance" OWNER TO postgres;

--
-- Name: BankSoal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."BankSoal" (
    id text NOT NULL,
    kode text NOT NULL,
    pertanyaan text NOT NULL,
    tipe public."TipeSoal" DEFAULT 'PILIHAN_GANDA'::public."TipeSoal" NOT NULL,
    "mataPelajaranId" text,
    "pilihanJawaban" jsonb,
    "jawabanBenar" text,
    bobot integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "guruId" text,
    "kelasId" text
);


ALTER TABLE public."BankSoal" OWNER TO postgres;

--
-- Name: ForumKategori; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ForumKategori" (
    id text NOT NULL,
    nama text NOT NULL,
    deskripsi text,
    icon text,
    warna text,
    "mataPelajaranId" text,
    "kelasId" text,
    urutan integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ForumKategori" OWNER TO postgres;

--
-- Name: ForumPost; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ForumPost" (
    id text NOT NULL,
    "threadId" text NOT NULL,
    "parentId" text,
    "authorId" text NOT NULL,
    "authorType" text NOT NULL,
    konten text NOT NULL,
    "isEdited" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."ForumPost" OWNER TO postgres;

--
-- Name: ForumReaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ForumReaction" (
    id text NOT NULL,
    "postId" text NOT NULL,
    "userId" text NOT NULL,
    tipe text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ForumReaction" OWNER TO postgres;

--
-- Name: ForumThread; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ForumThread" (
    id text NOT NULL,
    judul text NOT NULL,
    "isPinned" boolean DEFAULT false NOT NULL,
    "isLocked" boolean DEFAULT false NOT NULL,
    "kategoriId" text NOT NULL,
    "authorId" text NOT NULL,
    "authorType" text NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "replyCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."ForumThread" OWNER TO postgres;

--
-- Name: Guru; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Guru" (
    id text NOT NULL,
    nip text NOT NULL,
    nama text NOT NULL,
    email text NOT NULL,
    "nomorTelepon" text,
    status public."StatusGuru" DEFAULT 'AKTIF'::public."StatusGuru" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "userId" text
);


ALTER TABLE public."Guru" OWNER TO postgres;

--
-- Name: JadwalPelajaran; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JadwalPelajaran" (
    id text NOT NULL,
    hari public."Hari" NOT NULL,
    "jamMulai" text NOT NULL,
    "jamSelesai" text NOT NULL,
    "kelasId" text NOT NULL,
    "mataPelajaranId" text NOT NULL,
    "guruId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."JadwalPelajaran" OWNER TO postgres;

--
-- Name: Jurusan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Jurusan" (
    id text NOT NULL,
    kode text NOT NULL,
    nama text NOT NULL,
    deskripsi text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Jurusan" OWNER TO postgres;

--
-- Name: Kelas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Kelas" (
    id text NOT NULL,
    nama text NOT NULL,
    tingkat text NOT NULL,
    kapasitas integer DEFAULT 32 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "waliKelasId" text,
    "jurusanId" text
);


ALTER TABLE public."Kelas" OWNER TO postgres;

--
-- Name: MataPelajaran; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MataPelajaran" (
    id text NOT NULL,
    kode text NOT NULL,
    nama text NOT NULL,
    "jamPelajaran" integer NOT NULL,
    deskripsi text,
    tingkat text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."MataPelajaran" OWNER TO postgres;

--
-- Name: Materi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Materi" (
    id text NOT NULL,
    judul text NOT NULL,
    deskripsi text,
    tipe public."TipeMateri" DEFAULT 'DOKUMEN'::public."TipeMateri" NOT NULL,
    konten text,
    "mataPelajaranId" text NOT NULL,
    "guruId" text NOT NULL,
    "kelasId" text,
    "isPinned" boolean DEFAULT false NOT NULL,
    "isPublished" boolean DEFAULT true NOT NULL,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Materi" OWNER TO postgres;

--
-- Name: MateriAttachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MateriAttachment" (
    id text NOT NULL,
    "materiId" text NOT NULL,
    "namaFile" text NOT NULL,
    "ukuranFile" integer NOT NULL,
    "tipeFile" text NOT NULL,
    "urlFile" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MateriAttachment" OWNER TO postgres;

--
-- Name: MateriBookmark; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MateriBookmark" (
    id text NOT NULL,
    "materiId" text NOT NULL,
    "siswaId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MateriBookmark" OWNER TO postgres;

--
-- Name: Notifikasi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notifikasi" (
    id text NOT NULL,
    "userId" text NOT NULL,
    tipe public."TipeNotifikasi" NOT NULL,
    judul text NOT NULL,
    pesan text NOT NULL,
    "linkUrl" text,
    "isRead" boolean DEFAULT false NOT NULL,
    "readAt" timestamp(3) without time zone,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notifikasi" OWNER TO postgres;

--
-- Name: PaketSoal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaketSoal" (
    id text NOT NULL,
    kode text NOT NULL,
    nama text NOT NULL,
    deskripsi text,
    "mataPelajaranId" text,
    "totalSoal" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "guruId" text
);


ALTER TABLE public."PaketSoal" OWNER TO postgres;

--
-- Name: PaketSoalItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaketSoalItem" (
    id text NOT NULL,
    "paketSoalId" text NOT NULL,
    "bankSoalId" text NOT NULL,
    urutan integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PaketSoalItem" OWNER TO postgres;

--
-- Name: PaketSoalKelas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaketSoalKelas" (
    id text NOT NULL,
    "paketSoalId" text NOT NULL,
    "kelasId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PaketSoalKelas" OWNER TO postgres;

--
-- Name: Pengumuman; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Pengumuman" (
    id text NOT NULL,
    judul text NOT NULL,
    konten text NOT NULL,
    "targetRoles" public."Role"[] DEFAULT ARRAY[]::public."Role"[],
    "authorId" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Pengumuman" OWNER TO postgres;

--
-- Name: ProgressSiswa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProgressSiswa" (
    id text NOT NULL,
    "siswaId" text NOT NULL,
    "mataPelajaranId" text NOT NULL,
    "materiDibaca" integer DEFAULT 0 NOT NULL,
    "tugasSelesai" integer DEFAULT 0 NOT NULL,
    "forumPosts" integer DEFAULT 0 NOT NULL,
    "totalScore" double precision DEFAULT 0 NOT NULL,
    "lastActivity" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ProgressSiswa" OWNER TO postgres;

--
-- Name: RPP; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RPP" (
    id text NOT NULL,
    kode text NOT NULL,
    "mataPelajaranId" text NOT NULL,
    "guruId" text NOT NULL,
    "capaianPembelajaran" text NOT NULL,
    "tujuanPembelajaran" jsonb NOT NULL,
    status public."StatusRPP" DEFAULT 'DRAFT'::public."StatusRPP" NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "alokasiWaktu" integer NOT NULL,
    "asesmenAkhir" text,
    "asesmenAwal" text,
    "asesmenProses" text,
    "dimensiProfilLulusan" jsonb,
    fase text,
    "identifikasiMateri" text,
    "identifikasiPesertaDidik" text,
    "kegiatanAwal" jsonb,
    "kegiatanMemahami" jsonb,
    "kegiatanMengaplikasi" jsonb,
    "kegiatanMerefleksi" jsonb,
    "kegiatanPenutup" jsonb,
    "kemitraanPembelajaran" text,
    "lingkunganPembelajaran" text,
    "lintasDisiplinIlmu" text,
    materi text NOT NULL,
    "namaGuru" text,
    "pemanfaatanDigital" text,
    "praktikPedagogik" text,
    "tahunAjaran" text,
    "topikPembelajaran" text NOT NULL
);


ALTER TABLE public."RPP" OWNER TO postgres;

--
-- Name: RPPKelas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RPPKelas" (
    id text NOT NULL,
    "rppId" text NOT NULL,
    "kelasId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RPPKelas" OWNER TO postgres;

--
-- Name: Settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Settings" (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Settings" OWNER TO postgres;

--
-- Name: Siswa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Siswa" (
    id text NOT NULL,
    nisn text NOT NULL,
    nama text NOT NULL,
    "tanggalLahir" timestamp(3) without time zone NOT NULL,
    alamat text,
    "nomorTelepon" text,
    email text,
    status public."StatusSiswa" DEFAULT 'AKTIF'::public."StatusSiswa" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "kelasId" text,
    "userId" text,
    "tahunAjaranId" text,
    agama text
);


ALTER TABLE public."Siswa" OWNER TO postgres;

--
-- Name: SiswaKelasHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SiswaKelasHistory" (
    id text NOT NULL,
    "siswaId" text NOT NULL,
    "kelasId" text NOT NULL,
    "tahunAjaranId" text NOT NULL,
    "tanggalMulai" timestamp(3) without time zone NOT NULL,
    "tanggalSelesai" timestamp(3) without time zone,
    status text NOT NULL,
    catatan text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SiswaKelasHistory" OWNER TO postgres;

--
-- Name: TahunAjaran; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TahunAjaran" (
    id text NOT NULL,
    tahun text NOT NULL,
    "tanggalMulai" timestamp(3) without time zone NOT NULL,
    "tanggalSelesai" timestamp(3) without time zone NOT NULL,
    status public."StatusTahunAjaran" DEFAULT 'AKAN_DATANG'::public."StatusTahunAjaran" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."TahunAjaran" OWNER TO postgres;

--
-- Name: Tugas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tugas" (
    id text NOT NULL,
    judul text NOT NULL,
    deskripsi text NOT NULL,
    instruksi text,
    "mataPelajaranId" text NOT NULL,
    "guruId" text NOT NULL,
    "kelasId" text,
    deadline timestamp(3) without time zone NOT NULL,
    "maxScore" integer DEFAULT 100 NOT NULL,
    "tipePenilaian" public."TipePenilaian" DEFAULT 'MANUAL'::public."TipePenilaian" NOT NULL,
    "allowLateSubmit" boolean DEFAULT false NOT NULL,
    "isPublished" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Tugas" OWNER TO postgres;

--
-- Name: TugasAttachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TugasAttachment" (
    id text NOT NULL,
    "tugasId" text NOT NULL,
    "namaFile" text NOT NULL,
    "ukuranFile" integer NOT NULL,
    "tipeFile" text NOT NULL,
    "urlFile" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TugasAttachment" OWNER TO postgres;

--
-- Name: TugasSiswa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TugasSiswa" (
    id text NOT NULL,
    "tugasId" text NOT NULL,
    "siswaId" text NOT NULL,
    status public."StatusPengumpulan" DEFAULT 'BELUM_DIKUMPULKAN'::public."StatusPengumpulan" NOT NULL,
    "submittedAt" timestamp(3) without time zone,
    "gradedAt" timestamp(3) without time zone,
    konten text,
    score double precision,
    feedback text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TugasSiswa" OWNER TO postgres;

--
-- Name: TugasSiswaFile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TugasSiswaFile" (
    id text NOT NULL,
    "tugasSiswaId" text NOT NULL,
    "namaFile" text NOT NULL,
    "ukuranFile" integer NOT NULL,
    "tipeFile" text NOT NULL,
    "urlFile" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TugasSiswaFile" OWNER TO postgres;

--
-- Name: Ujian; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ujian" (
    id text NOT NULL,
    kode text NOT NULL,
    judul text NOT NULL,
    deskripsi text,
    "mataPelajaranId" text,
    "kelasId" text,
    durasi integer NOT NULL,
    "tanggalMulai" timestamp(3) without time zone NOT NULL,
    "tanggalSelesai" timestamp(3) without time zone NOT NULL,
    "nilaiMinimal" integer,
    "acakSoal" boolean DEFAULT true NOT NULL,
    "tampilkanNilai" boolean DEFAULT false NOT NULL,
    status public."StatusUjian" DEFAULT 'DRAFT'::public."StatusUjian" NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "paketSoalId" text,
    "guruId" text,
    "deteksiKecurangan" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Ujian" OWNER TO postgres;

--
-- Name: UjianKelas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UjianKelas" (
    id text NOT NULL,
    "ujianId" text NOT NULL,
    "kelasId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UjianKelas" OWNER TO postgres;

--
-- Name: UjianSiswa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UjianSiswa" (
    id text NOT NULL,
    "ujianId" text NOT NULL,
    "siswaId" text NOT NULL,
    "tokenAkses" text,
    "waktuMulai" timestamp(3) without time zone,
    "waktuSelesai" timestamp(3) without time zone,
    durasi integer,
    status public."StatusPengerjaan" DEFAULT 'BELUM_MULAI'::public."StatusPengerjaan" NOT NULL,
    "nilaiTotal" double precision,
    "isPassed" boolean,
    jawaban jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "manualGrades" jsonb
);


ALTER TABLE public."UjianSiswa" OWNER TO postgres;

--
-- Name: UjianSoal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UjianSoal" (
    id text NOT NULL,
    "ujianId" text NOT NULL,
    "bankSoalId" text NOT NULL,
    "nomorUrut" integer NOT NULL,
    bobot integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."UjianSoal" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'SISWA'::public."Role" NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _GuruMataPelajaran; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_GuruMataPelajaran" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_GuruMataPelajaran" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Attendance" (id, "siswaId", tanggal, "jamMasuk", "jamKeluar", status, keterangan, "scanBy", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: BankSoal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."BankSoal" (id, kode, pertanyaan, tipe, "mataPelajaranId", "pilihanJawaban", "jawabanBenar", bobot, "createdAt", "updatedAt", "deletedAt", "guruId", "kelasId") FROM stdin;
\.


--
-- Data for Name: ForumKategori; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ForumKategori" (id, nama, deskripsi, icon, warna, "mataPelajaranId", "kelasId", urutan, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ForumPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ForumPost" (id, "threadId", "parentId", "authorId", "authorType", konten, "isEdited", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: ForumReaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ForumReaction" (id, "postId", "userId", tipe, "createdAt") FROM stdin;
\.


--
-- Data for Name: ForumThread; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ForumThread" (id, judul, "isPinned", "isLocked", "kategoriId", "authorId", "authorType", "viewCount", "replyCount", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Guru; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") FROM stdin;
cmj9z8yox00385dudt5p2uvo1	1234567891	Ila Febti Sherly M., S.E	ilafebtisherly@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.849	2025-12-17 12:25:57.706	\N	cmj9z8you00375dudrf1e71qe
cmj9z8ybn002q5dud7n4058u9	5040758659300040	Nurmala Evayanti S.Pd.	nurmalaevayanti2006@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.371	2025-12-23 11:57:12.118	\N	cmj9z8ybk002p5dudp5man22v
cmj9z8y4a002g5dudjlq4s2jp	0000000000000066	M. Fais Jainuddin, S.Pd	faizabrahammalik@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.105	2025-12-23 11:57:31.914	\N	cmj9z8y44002f5dudfvho6nza
cmj9z8y77002k5dudwjch4365	8834765666130320	Moh. Yunus Ansori, S.Pd.	yunuskacer@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.211	2025-12-23 11:58:13.302	\N	cmj9z8y73002j5dud9ooury49
cmj9z8xtu00225dudew59ixr7	8550751654200000	Aini Abdul Cholis S.Pd.	ainiabdcholis.73@gmail.com	081234567890	AKTIF	2025-12-17 12:17:53.73	2025-12-23 11:59:18.368	\N	cmj9z8xto00215dudxiyqcr71
cmj9z8y5q002i5dudk3gr40r9	00000000000023235	Moh. Rohim, S.T.	mohrohim02@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.158	2025-12-23 12:02:46.205	\N	cmj9z8y5n002h5dud9vb23462
cmj9z8yd4002s5dudqb9lav2o	0000000000000007878	Nurul Hidayah, S.E.	nurulhidayahse485@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.423	2025-12-23 12:01:50.717	\N	cmj9z8ycz002r5duda3p9ojun
cmj9z8y8o002m5dudwnycw1jf	0000000000000006	Mulyono, S.Th.	danzia22@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.263	2025-12-23 12:05:31.217	\N	cmj9z8y8l002l5dudo8u4k81t
cmj9z8yhl002y5dudqly12oc3	8549764665110030	Syamsul Rizal, S.Pd.I.	rizalpecintaseni@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.585	2025-12-23 12:05:44.242	\N	cmj9z8yhh002x5dud9my7ci8i
cmj9z8xyc00285dudgvf5bnnv	3455763666300010	Erlin Novia Diana, S.E.	erlinnoviadiana@gmail.com	081234567890	AKTIF	2025-12-17 12:17:53.891	2025-12-23 12:06:19.489	\N	cmj9z8xy800275dudsv8ypuim
cmj9z8ykj00325dudk20mdgjx	00000000003444211	Wahyu Mirnawati, S.Ak.	wahyumirnawati30@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.691	2025-12-23 12:08:17.471	\N	cmj9z8ykf00315duda3u6niqb
cmj9z8y1b002c5dudh3e7fyuu	0000000023232323	Frances Laurence Setyo Budi, S.Pd.	franceskoyen16@gmail.com	081234567890	AKTIF	2025-12-17 12:17:53.998	2025-12-23 12:08:30.754	\N	cmj9z8y16002b5dudps21lpfm
cmj9z8ya7002o5dudm0yzma1k	5736762663300210	Nunung Indrawati, S.Pd.	nunungindrawati437@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.318	2025-12-25 11:59:15.002	\N	cmj9z8ya2002n5dudxxrmi27p
cmj9z8xzs002a5dudw0c717l2	00000000000000022222	Fera Mega Haristina, S.Tr.Kom.	feramegaharistiana@gmail.com	081234567890	AKTIF	2025-12-17 12:17:53.943	2025-12-25 12:04:08.915	\N	cmj9z8xzp00295dudiet5g8kd
cmj9z8yg3002w5dud29sel0av	00000000000000977	Siska Purwanti, S.E.	purwantisiska25@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.53	2025-12-25 12:08:06.998	\N	cmj9z8yfy002v5dudvf51yqq4
cmj9z8yj000305dudtwddc0j1	0000000000000010044	Udayani, S.Pd.	udayaniprayuda@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.635	2025-12-27 14:54:08.736	\N	cmj9z8yix002z5dudbc4lk8nv
cmj9z8yem002u5dudolwskcz4	1201212121212110	Rizky Lutfi Romadona, S.Kom.	rizkielutfi@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.477	2025-12-29 13:49:03.398	\N	cmj9z8yej002t5dudlb0wn4mh
cmj9z8ynh00365dudxaiuoy08	00000000000000076	Maulida Putri Lesmana, S.Pd.	pa717885@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.797	2025-12-29 13:51:21.808	\N	cmj9z8ynd00355dudycn1e6hi
cmj9z8yly00345dudadjrqvfh	0000000000000044	Zulfi Amaliyah, S.Kom.	zulfiamaliyah1306@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.742	2025-12-29 13:51:25.822	\N	cmj9z8ylv00335dudr8tet2na
cmj9z8y2q002e5dud69l0gx00	00000000000000004	Imtiana, S.Pd.	imtianateguh@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.049	2025-12-29 13:51:36.674	\N	cmj9z8y2n002d5dudjgj6nzx4
cmj9z8xwv00265dud0w98oh1m	00000000230011444	Dwi Wahyudi, S.T.	yudiaster1922@gmail.com	081234567890	AKTIF	2025-12-17 12:17:53.839	2025-12-29 13:51:43.272	\N	cmj9z8xws00255dudbgtsplon
cmj9z8xvg00245duda7dxbp56	3449744648300010	Dra. Subur Hindartin, S.Pd.	drasuburhindartin@gmail.com	081234567890	AKTIF	2025-12-17 12:17:53.787	2025-12-29 13:51:53.255	\N	cmj9z8xvb00235dudd4xbolii
\.


--
-- Data for Name: JadwalPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") FROM stdin;
cmjr7mij60004laudb3xy6wa8	SENIN	08:16	08:54	cmj5eca0w0006jsud9bca11b3	cmj9z7q84001d5dud60yqektg	cmj9z8ybn002q5dud7n4058u9	2025-12-29 13:44:29.01	2025-12-29 14:03:04.577
cmjr7mijc0005laudungska8r	SENIN	08:54	09:32	cmj5eca0w0006jsud9bca11b3	cmj9z7q84001d5dud60yqektg	cmj9z8ybn002q5dud7n4058u9	2025-12-29 13:44:29.016	2025-12-29 14:03:04.585
cmjr7mijj0006laud3ja4aztt	SENIN	10:10	10:45	cmj5eca0w0006jsud9bca11b3	cmj9z7q84001d5dud60yqektg	cmj9z8ybn002q5dud7n4058u9	2025-12-29 13:44:29.023	2025-12-29 14:03:04.593
cmjr7spee000nlaudxqbumeko	SENIN	10:45	11:20	cmj5eca0e0003jsud1uxj50o4	cmj9z7q87001e5dudb1uk5u9j	cmj9z8yem002u5dudolwskcz4	2025-12-29 13:49:17.846	2025-12-29 14:03:04.686
cmjr7spek000olaudaqt9nmi4	SENIN	11:20	11:55	cmj5eca0e0003jsud1uxj50o4	cmj9z7q87001e5dudb1uk5u9j	cmj9z8yem002u5dudolwskcz4	2025-12-29 13:49:17.852	2025-12-29 14:03:04.691
cmjr7spep000plaud2bdijgv1	SENIN	11:55	12:30	cmj5eca0e0003jsud1uxj50o4	cmj9z7q87001e5dudb1uk5u9j	cmj9z8yem002u5dudolwskcz4	2025-12-29 13:49:17.857	2025-12-29 14:03:04.696
cmjr7speu000qlaudl4whrwb0	SENIN	12:30	13:05	cmj5eca0e0003jsud1uxj50o4	cmj9z7q87001e5dudb1uk5u9j	cmj9z8yem002u5dudolwskcz4	2025-12-29 13:49:17.862	2025-12-29 14:03:04.702
cmjr89biy000rlaud6t1l7ikd	SENIN	07:38	08:16	cmj5eca130007jsudvzwt5rjx	cmj9z7q8k001h5dudkou2wtsf	cmj9z8xtu00225dudew59ixr7	2025-12-29 14:02:13.018	2025-12-29 14:03:04.706
cmjr7mijq0007laud2yfc6yxo	SENIN	10:45	11:20	cmj5eca0w0006jsud9bca11b3	cmj9z7q7y001c5dudu38a65qb	cmj9z8y4a002g5dudjlq4s2jp	2025-12-29 13:44:29.03	2025-12-29 14:03:04.601
cmjr7mijv0008laudp9i3uhso	SENIN	11:20	11:55	cmj5eca0w0006jsud9bca11b3	cmj9z7q7y001c5dudu38a65qb	cmj9z8y4a002g5dudjlq4s2jp	2025-12-29 13:44:29.035	2025-12-29 14:03:04.606
cmjr7mik20009laudu1d05jlf	SENIN	11:55	12:30	cmj5eca0w0006jsud9bca11b3	cmj9z7q7y001c5dudu38a65qb	cmj9z8y4a002g5dudjlq4s2jp	2025-12-29 13:44:29.042	2025-12-29 14:03:04.612
cmjr7mik7000alaudla2f7jnr	SENIN	12:30	13:05	cmj5eca0w0006jsud9bca11b3	cmj9z7q7y001c5dudu38a65qb	cmj9z8y4a002g5dudjlq4s2jp	2025-12-29 13:44:29.047	2025-12-29 14:03:04.617
cmjr7ovsh000blaude5fhsbzy	SENIN	07:38	08:16	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q94001n5dudvyt50cow	cmj9z8yg3002w5dud29sel0av	2025-12-29 13:46:19.505	2025-12-29 14:03:04.623
cmjr7ovsm000claudg7h4ihvz	SENIN	08:16	08:54	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q94001n5dudvyt50cow	cmj9z8yg3002w5dud29sel0av	2025-12-29 13:46:19.51	2025-12-29 14:03:04.628
cmjr7ovsr000dlaudo5k5ifra	SENIN	08:54	09:32	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q94001n5dudvyt50cow	cmj9z8yg3002w5dud29sel0av	2025-12-29 13:46:19.515	2025-12-29 14:03:04.633
cmjr7ovsw000elauditk0mcm1	SENIN	10:10	10:45	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q94001n5dudvyt50cow	cmj9z8yg3002w5dud29sel0av	2025-12-29 13:46:19.52	2025-12-29 14:03:04.638
cmjr7ovt1000flaudanywb0z8	SENIN	10:45	11:20	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q84001d5dud60yqektg	cmj9z8ybn002q5dud7n4058u9	2025-12-29 13:46:19.525	2025-12-29 14:03:04.643
cmjr7ovt6000glaudisesfljw	SENIN	11:20	11:55	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q84001d5dud60yqektg	cmj9z8ybn002q5dud7n4058u9	2025-12-29 13:46:19.53	2025-12-29 14:03:04.648
cmjr7ovtc000hlaudjd7b89q9	SENIN	11:55	12:30	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q84001d5dud60yqektg	cmj9z8ybn002q5dud7n4058u9	2025-12-29 13:46:19.536	2025-12-29 14:03:04.654
cmjr7ovti000ilaud3v1rsx3b	SENIN	12:30	13:05	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q84001d5dud60yqektg	cmj9z8ybn002q5dud7n4058u9	2025-12-29 13:46:19.542	2025-12-29 14:03:04.658
cmjr7spdh000jlaudv1xaahr8	SENIN	07:38	08:16	cmj5eca0e0003jsud1uxj50o4	cmj9z7q8v001k5dudwd0dr0f2	cmj9z8y77002k5dudwjch4365	2025-12-29 13:49:17.813	2025-12-29 14:03:04.664
cmjr7spdr000klaudtbyedgjs	SENIN	08:16	08:54	cmj5eca0e0003jsud1uxj50o4	cmj9z7q8v001k5dudwd0dr0f2	cmj9z8y77002k5dudwjch4365	2025-12-29 13:49:17.823	2025-12-29 14:03:04.67
cmjr7spe3000llauds31ruxra	SENIN	08:54	09:32	cmj5eca0e0003jsud1uxj50o4	cmj9z7q8v001k5dudwd0dr0f2	cmj9z8y77002k5dudwjch4365	2025-12-29 13:49:17.835	2025-12-29 14:03:04.675
cmjr7spe9000mlauduq8wv1fy	SENIN	10:10	10:45	cmj5eca0e0003jsud1uxj50o4	cmj9z7q8c001f5dudtoyt49tx	cmj9z8y8o002m5dudwnycw1jf	2025-12-29 13:49:17.841	2025-12-29 14:03:04.681
cmjr89bj4000slaudacb7hd6u	SENIN	08:16	08:54	cmj5eca130007jsudvzwt5rjx	cmj9z7q8k001h5dudkou2wtsf	cmj9z8xtu00225dudew59ixr7	2025-12-29 14:02:13.024	2025-12-29 14:03:04.712
cmjr89bj9000tlaud9hdp917x	SENIN	08:54	09:32	cmj5eca130007jsudvzwt5rjx	cmj9z7q8k001h5dudkou2wtsf	cmj9z8xtu00225dudew59ixr7	2025-12-29 14:02:13.029	2025-12-29 14:03:04.717
cmjr89bje000ulaudjh7fttn8	SENIN	10:10	10:45	cmj5eca130007jsudvzwt5rjx	cmj9z7q8k001h5dudkou2wtsf	cmj9z8xtu00225dudew59ixr7	2025-12-29 14:02:13.034	2025-12-29 14:03:04.722
cmjr89bjk000vlaudpa7agawy	SENIN	10:45	11:20	cmj5eca130007jsudvzwt5rjx	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-29 14:02:13.04	2025-12-29 14:03:04.727
cmjr89bjp000wlaudd0lzlvj5	SENIN	11:20	11:55	cmj5eca130007jsudvzwt5rjx	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-29 14:02:13.045	2025-12-29 14:03:04.732
cmjr89bju000xlaudzcr4mwfr	SENIN	11:55	12:30	cmj5eca130007jsudvzwt5rjx	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-29 14:02:13.05	2025-12-29 14:03:04.737
cmjr89bjz000ylaudakuob2f1	SENIN	12:30	13:05	cmj5eca130007jsudvzwt5rjx	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-29 14:02:13.055	2025-12-29 14:03:04.742
cmjr89bk5000zlauddwy7fc9s	SENIN	07:38	08:16	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q7y001c5dudu38a65qb	cmj9z8yj000305dudtwddc0j1	2025-12-29 14:02:13.061	2025-12-29 14:03:04.747
cmjr89bk90010laudvoq6bult	SENIN	08:16	08:54	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q7y001c5dudu38a65qb	cmj9z8yj000305dudtwddc0j1	2025-12-29 14:02:13.065	2025-12-29 14:03:04.752
cmjr89bke0011laudxwu0jawl	SENIN	08:54	09:32	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q7y001c5dudu38a65qb	cmj9z8yj000305dudtwddc0j1	2025-12-29 14:02:13.07	2025-12-29 14:03:04.757
cmjr89bkj0012laudc1yfq525	SENIN	10:10	10:45	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q8k001h5dudkou2wtsf	cmj9z8ya7002o5dudm0yzma1k	2025-12-29 14:02:13.075	2025-12-29 14:03:04.763
cmjr89bko0013laud8y3kqv81	SENIN	10:45	11:20	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q8k001h5dudkou2wtsf	cmj9z8ya7002o5dudm0yzma1k	2025-12-29 14:02:13.08	2025-12-29 14:03:04.768
cmjr89bkt0014lauduxgnpfkn	SENIN	11:20	11:55	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q8k001h5dudkou2wtsf	cmj9z8ya7002o5dudm0yzma1k	2025-12-29 14:02:13.085	2025-12-29 14:03:04.773
cmjr89bl00015laudqzbp5r0v	SENIN	11:55	12:30	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9i001r5dudnscpl8q0	cmj9z8xyc00285dudgvf5bnnv	2025-12-29 14:02:13.092	2025-12-29 14:03:04.778
cmjr89bl90016laudocdafnkm	SENIN	12:30	13:05	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9i001r5dudnscpl8q0	cmj9z8xyc00285dudgvf5bnnv	2025-12-29 14:02:13.101	2025-12-29 14:03:04.783
cmjr89bli0017laudmu1rqcbq	SENIN	07:38	08:16	cmj5eca0k0004jsuddjewnal1	cmj9z7q8q001j5dudx5o1zuri	cmj9z8xvg00245duda7dxbp56	2025-12-29 14:02:13.11	2025-12-29 14:03:04.788
cmjr89blq0018laudz84us053	SENIN	08:16	08:54	cmj5eca0k0004jsuddjewnal1	cmj9z7q8q001j5dudx5o1zuri	cmj9z8xvg00245duda7dxbp56	2025-12-29 14:02:13.118	2025-12-29 14:03:04.793
cmjr89bm00019laudghsm3uuk	SENIN	08:54	09:32	cmj5eca0k0004jsuddjewnal1	cmj9z7q8m001i5dudi334c2ms	cmj9z8xyc00285dudgvf5bnnv	2025-12-29 14:02:13.128	2025-12-29 14:03:04.798
cmjr89bm9001alauda0j961f3	SENIN	10:10	10:45	cmj5eca0k0004jsuddjewnal1	cmj9z7q8m001i5dudi334c2ms	cmj9z8xyc00285dudgvf5bnnv	2025-12-29 14:02:13.137	2025-12-29 14:03:04.803
cmjr89bmh001blaudws2r6585	SENIN	10:45	11:20	cmj5eca0k0004jsuddjewnal1	cmj9z7q8k001h5dudkou2wtsf	cmj9z8xtu00225dudew59ixr7	2025-12-29 14:02:13.145	2025-12-29 14:03:04.808
cmjr89bmp001claudil7qpllo	SENIN	11:20	11:55	cmj5eca0k0004jsuddjewnal1	cmj9z7q8k001h5dudkou2wtsf	cmj9z8xtu00225dudew59ixr7	2025-12-29 14:02:13.153	2025-12-29 14:03:04.813
cmjr7miil0003laudjtx7100x	SENIN	07:38	08:16	cmj5eca0w0006jsud9bca11b3	cmj9z7q84001d5dud60yqektg	cmj9z8ybn002q5dud7n4058u9	2025-12-29 13:44:28.989	2025-12-29 14:03:04.564
cmjr89bmu001dlaud3rxer16a	SENIN	11:55	12:30	cmj5eca0k0004jsuddjewnal1	cmj9z7q8k001h5dudkou2wtsf	cmj9z8xtu00225dudew59ixr7	2025-12-29 14:02:13.158	2025-12-29 14:03:04.817
cmjr89bn0001elaudzifq9lqx	SENIN	12:30	13:05	cmj5eca0k0004jsuddjewnal1	cmj9z7q8k001h5dudkou2wtsf	cmj9z8xtu00225dudew59ixr7	2025-12-29 14:02:13.164	2025-12-29 14:03:04.822
cmjr89bn7001flaudku54wur1	SENIN	07:38	08:16	cmj5eca170008jsudb4r1h58n	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-29 14:02:13.171	2025-12-29 14:03:04.826
cmjr89bnc001glaud8eju6ig7	SENIN	08:16	08:54	cmj5eca170008jsudb4r1h58n	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-29 14:02:13.176	2025-12-29 14:03:04.831
cmjr89bni001hlaudvpq6bgzm	SENIN	08:54	09:32	cmj5eca170008jsudb4r1h58n	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-29 14:02:13.182	2025-12-29 14:03:04.836
cmjr8afig001rlaud74y27et6	SENIN	10:10	10:45	cmj5eca170008jsudb4r1h58n	cmj9z7qa8001y5dud4gjab2sw	cmj9z8xwv00265dud0w98oh1m	2025-12-29 14:03:04.84	2025-12-29 14:03:04.84
cmjr8afil001slaud9if0a1m2	SENIN	10:45	11:20	cmj5eca170008jsudb4r1h58n	cmj9z7qa8001y5dud4gjab2sw	cmj9z8xwv00265dud0w98oh1m	2025-12-29 14:03:04.845	2025-12-29 14:03:04.845
cmjr89bnr001ilaud8x9bm612	SENIN	07:38	08:16	cmj5eca050002jsudq5rc3oa3	cmj9z7q8x001l5dudh15r8ocj	cmj9z8ya7002o5dudm0yzma1k	2025-12-29 14:02:13.191	2025-12-29 14:03:04.85
cmjr89bnw001jlaudod8er5k7	SENIN	08:16	08:54	cmj5eca050002jsudq5rc3oa3	cmj9z7q8x001l5dudh15r8ocj	cmj9z8ya7002o5dudm0yzma1k	2025-12-29 14:02:13.196	2025-12-29 14:03:04.854
cmjr89bo2001klaudsbv98chc	SENIN	08:54	09:32	cmj5eca050002jsudq5rc3oa3	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yd4002s5dudqb9lav2o	2025-12-29 14:02:13.202	2025-12-29 14:03:04.859
cmjr89bo8001llauddkih58au	SENIN	10:10	10:45	cmj5eca050002jsudq5rc3oa3	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yd4002s5dudqb9lav2o	2025-12-29 14:02:13.208	2025-12-29 14:03:04.863
cmjr89boe001mlaudgtpmwgfi	SENIN	10:45	11:20	cmj5eca050002jsudq5rc3oa3	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yd4002s5dudqb9lav2o	2025-12-29 14:02:13.214	2025-12-29 14:03:04.868
cmjr89bok001nlaud64jhepnx	SENIN	11:20	11:55	cmj5eca050002jsudq5rc3oa3	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yd4002s5dudqb9lav2o	2025-12-29 14:02:13.22	2025-12-29 14:03:04.873
cmjr89bop001olaudwpzh79hp	SENIN	07:38	08:16	cmj5eca0o0005jsud0ambwla7	cmj9z7q9n001s5dudxr525koc	cmj9z8xzs002a5dudw0c717l2	2025-12-29 14:02:13.225	2025-12-29 14:03:04.877
cmjr89bow001plaud9fn9dfpi	SENIN	08:16	08:54	cmj5eca0o0005jsud0ambwla7	cmj9z7q9n001s5dudxr525koc	cmj9z8xzs002a5dudw0c717l2	2025-12-29 14:02:13.232	2025-12-29 14:03:04.882
cmjr89bp1001qlaud4wrphamt	SENIN	08:54	09:32	cmj5eca0o0005jsud0ambwla7	cmj9z7q9n001s5dudxr525koc	cmj9z8xzs002a5dudw0c717l2	2025-12-29 14:02:13.237	2025-12-29 14:03:04.886
cmjs6jarh000055ud2ejf2m47	SELASA	07:00	07:38	cmj5eca0w0006jsud9bca11b3	cmj9z7q8v001k5dudwd0dr0f2	cmj9z8y77002k5dudwjch4365	2025-12-30 06:01:45.532	2025-12-30 06:01:45.532
cmjs6jg41000155ud2mggikw4	SELASA	07:38	08:16	cmj5eca0w0006jsud9bca11b3	cmj9z7q8v001k5dudwd0dr0f2	cmj9z8y77002k5dudwjch4365	2025-12-30 06:01:52.464	2025-12-30 06:01:52.464
cmjs6jk22000255udja90wkk2	SELASA	08:16	08:54	cmj5eca0w0006jsud9bca11b3	cmj9z7q8v001k5dudwd0dr0f2	cmj9z8y77002k5dudwjch4365	2025-12-30 06:01:57.576	2025-12-30 06:01:57.576
cmjs6jyhc000355ud6ozb8qn9	SELASA	08:54	09:32	cmj5eca0w0006jsud9bca11b3	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	2025-12-30 06:02:16.271	2025-12-30 06:02:16.271
cmjs6k3yp000455udba0tzbbi	SELASA	10:10	10:45	cmj5eca0w0006jsud9bca11b3	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	2025-12-30 06:02:23.376	2025-12-30 06:02:23.376
cmjs6kpo6000555ud75t9pf5c	SELASA	10:45	11:20	cmj5eca0w0006jsud9bca11b3	cmj9z7q98001o5dudu8zzru3q	cmj9z8y5q002i5dudk3gr40r9	2025-12-30 06:02:51.509	2025-12-30 06:02:51.509
cmjs6ktts000655ud8ss1of3n	SELASA	11:20	11:55	cmj5eca0w0006jsud9bca11b3	cmj9z7q98001o5dudu8zzru3q	cmj9z8y5q002i5dudk3gr40r9	2025-12-30 06:02:56.895	2025-12-30 06:02:56.895
cmjs6kxd9000755udg2jkok71	SELASA	11:55	12:30	cmj5eca0w0006jsud9bca11b3	cmj9z7q98001o5dudu8zzru3q	cmj9z8y5q002i5dudk3gr40r9	2025-12-30 06:03:01.485	2025-12-30 06:03:01.485
cmjs6l2mv000855udkpcldo21	SELASA	12:30	13:05	cmj5eca0w0006jsud9bca11b3	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-30 06:03:08.308	2025-12-30 06:03:08.308
cmjs6lsfl000955udh7i36ma3	SELASA	07:00	07:38	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8v001k5dudwd0dr0f2	cmj9z8y77002k5dudwjch4365	2025-12-30 06:03:41.744	2025-12-30 06:03:41.744
cmjs6lw7l000a55udklmjlkm3	SELASA	07:38	08:16	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8v001k5dudwd0dr0f2	cmj9z8y77002k5dudwjch4365	2025-12-30 06:03:46.639	2025-12-30 06:03:46.639
cmjs6m1bg000b55ud958jmape	SELASA	08:16	08:54	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8v001k5dudwd0dr0f2	cmj9z8y77002k5dudwjch4365	2025-12-30 06:03:53.26	2025-12-30 06:03:53.26
cmjs6ml4k000c55ud1wxye928	SELASA	08:54	09:32	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8k001h5dudkou2wtsf	cmj9z8ya7002o5dudm0yzma1k	2025-12-30 06:04:18.931	2025-12-30 06:04:18.931
cmjs6mokb000d55uda77jb741	SELASA	10:10	10:45	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8k001h5dudkou2wtsf	cmj9z8ya7002o5dudm0yzma1k	2025-12-30 06:04:23.386	2025-12-30 06:04:23.386
cmjs6msa0000e55udxrvagyhh	SELASA	10:45	11:20	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8k001h5dudkou2wtsf	cmj9z8ya7002o5dudm0yzma1k	2025-12-30 06:04:28.199	2025-12-30 06:04:28.199
cmjs6n26n000f55udt8s4a7hi	SELASA	11:20	11:55	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8k001h5dudkou2wtsf	cmj9z8ya7002o5dudm0yzma1k	2025-12-30 06:04:41.039	2025-12-30 06:04:41.039
cmjs6n6gn000g55uds5eloxw5	SELASA	11:55	12:30	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8h001g5dud3cnj22wr	cmj9z8y2q002e5dud69l0gx00	2025-12-30 06:04:46.582	2025-12-30 06:04:46.582
cmjs6naan000h55udswvz68dj	SELASA	12:30	13:05	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8h001g5dud3cnj22wr	cmj9z8y2q002e5dud69l0gx00	2025-12-30 06:04:51.55	2025-12-30 06:04:51.55
cmjs6nya8000i55ud0n5nr0zd	SELASA	07:00	07:38	cmj5eca0e0003jsud1uxj50o4	cmj9z7q8h001g5dud3cnj22wr	cmj9z8y2q002e5dud69l0gx00	2025-12-30 06:05:22.639	2025-12-30 06:05:22.639
cmjs6o18f000j55ud12m3ptay	SELASA	07:38	08:16	cmj5eca0e0003jsud1uxj50o4	cmj9z7q8h001g5dud3cnj22wr	cmj9z8y2q002e5dud69l0gx00	2025-12-30 06:05:26.461	2025-12-30 06:05:26.461
cmjs6o43e000k55udevlmmsg4	SELASA	08:16	08:54	cmj5eca0e0003jsud1uxj50o4	cmj9z7q8h001g5dud3cnj22wr	cmj9z8y2q002e5dud69l0gx00	2025-12-30 06:05:30.169	2025-12-30 06:05:30.169
cmjs6oif5000l55ud996qsgxn	SELASA	08:54	09:32	cmj5eca0e0003jsud1uxj50o4	cmj9z7q87001e5dudb1uk5u9j	cmj9z8yem002u5dudolwskcz4	2025-12-30 06:05:48.736	2025-12-30 06:05:48.736
cmjs6on6f000m55ud5ypsfw6z	SELASA	10:10	10:45	cmj5eca0e0003jsud1uxj50o4	cmj9z7q87001e5dudb1uk5u9j	cmj9z8yem002u5dudolwskcz4	2025-12-30 06:05:54.903	2025-12-30 06:05:54.903
cmjs6or55000n55ud67mymvue	SELASA	10:45	11:20	cmj5eca0e0003jsud1uxj50o4	cmj9z7q87001e5dudb1uk5u9j	cmj9z8yem002u5dudolwskcz4	2025-12-30 06:06:00.041	2025-12-30 06:06:00.041
cmjs6oye5000o55ud5eg1yr31	SELASA	11:20	11:55	cmj5eca0e0003jsud1uxj50o4	cmj9z7q87001e5dudb1uk5u9j	cmj9z8yem002u5dudolwskcz4	2025-12-30 06:06:09.436	2025-12-30 06:06:09.436
cmjs6p2zu000p55udkhu6dpf3	SELASA	11:55	12:30	cmj5eca0e0003jsud1uxj50o4	cmj9z7q8m001i5dudi334c2ms	cmj9z8xyc00285dudgvf5bnnv	2025-12-30 06:06:15.402	2025-12-30 06:06:15.402
cmjs6p66o000q55ud5pyvv9tt	SELASA	12:30	13:05	cmj5eca0e0003jsud1uxj50o4	cmj9z7q8m001i5dudi334c2ms	cmj9z8xyc00285dudgvf5bnnv	2025-12-30 06:06:19.536	2025-12-30 06:06:19.536
cmjs6qap3000r55ud02pwyx5z	SELASA	07:00	07:38	cmj5eca130007jsudvzwt5rjx	cmj9z7q90001m5dud5q6cvaku	cmj9z8yly00345dudadjrqvfh	2025-12-30 06:07:12.039	2025-12-30 06:07:12.039
cmjs6qdm3000s55udxpoho987	SELASA	07:38	08:16	cmj5eca130007jsudvzwt5rjx	cmj9z7q90001m5dud5q6cvaku	cmj9z8yly00345dudadjrqvfh	2025-12-30 06:07:15.818	2025-12-30 06:07:15.818
cmjs6qgps000t55udwbewqf91	SELASA	08:16	08:54	cmj5eca130007jsudvzwt5rjx	cmj9z7q90001m5dud5q6cvaku	cmj9z8yly00345dudadjrqvfh	2025-12-30 06:07:19.84	2025-12-30 06:07:19.84
cmjs6qya9000u55udwppwzo67	SELASA	08:54	09:32	cmj5eca130007jsudvzwt5rjx	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-30 06:07:42.608	2025-12-30 06:07:42.608
cmjs6r1lc000v55udunts7sad	SELASA	10:10	10:45	cmj5eca130007jsudvzwt5rjx	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-30 06:07:46.895	2025-12-30 06:07:46.895
cmjs6r4w9000w55udgak7jwh7	SELASA	10:45	11:20	cmj5eca130007jsudvzwt5rjx	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-30 06:07:51.177	2025-12-30 06:07:51.177
cmjs6rg48000x55udz7ljt2ug	SELASA	11:20	11:55	cmj5eca130007jsudvzwt5rjx	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-30 06:08:05.72	2025-12-30 06:08:05.72
cmjs6rjo3000y55udemnypz4n	SELASA	11:55	12:30	cmj5eca130007jsudvzwt5rjx	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-30 06:08:10.321	2025-12-30 06:08:10.321
cmjs6rn6n000z55ud313z0j7n	SELASA	12:30	13:05	cmj5eca130007jsudvzwt5rjx	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-30 06:08:14.879	2025-12-30 06:08:14.879
cmjs6tt1m001055ud70xthpf6	SELASA	07:00	07:38	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q8x001l5dudh15r8ocj	cmj9z8ykj00325dudk20mdgjx	2025-12-30 06:09:55.785	2025-12-30 06:09:55.785
cmjs6txll001155udqb0bo501	SELASA	07:38	08:16	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q8x001l5dudh15r8ocj	cmj9z8ykj00325dudk20mdgjx	2025-12-30 06:10:01.688	2025-12-30 06:10:01.688
cmjs6u1i4001255ud0wyfb1kf	SELASA	08:16	08:54	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q8x001l5dudh15r8ocj	cmj9z8ykj00325dudk20mdgjx	2025-12-30 06:10:06.746	2025-12-30 06:10:06.746
cmjs6uy0w001355udtz3i4p11	SELASA	08:54	09:32	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9i001r5dudnscpl8q0	cmj9z8xyc00285dudgvf5bnnv	2025-12-30 06:10:48.895	2025-12-30 06:10:48.895
cmjs6v6vm001455udm94fgh9l	SELASA	10:10	10:45	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9i001r5dudnscpl8q0	cmj9z8xyc00285dudgvf5bnnv	2025-12-30 06:11:00.369	2025-12-30 06:11:00.369
cmjs6vcnt001555uda0ajwyex	SELASA	10:45	11:20	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yd4002s5dudqb9lav2o	2025-12-30 06:11:07.864	2025-12-30 06:11:07.864
cmjs6vhkx001655uddmm65hrf	SELASA	11:20	11:55	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yd4002s5dudqb9lav2o	2025-12-30 06:11:14.239	2025-12-30 06:11:14.239
cmjs6vlmb001755udkc2ajxny	SELASA	11:55	12:30	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yd4002s5dudqb9lav2o	2025-12-30 06:11:19.475	2025-12-30 06:11:19.475
cmjs6vpgg001855ud0g2hz55w	SELASA	12:30	13:05	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yd4002s5dudqb9lav2o	2025-12-30 06:11:24.446	2025-12-30 06:11:24.446
cmjs6w9ox001955udh6ywaowz	SELASA	07:00	07:38	cmj5eca0k0004jsuddjewnal1	cmj9z7q9n001s5dudxr525koc	cmj9z8yem002u5dudolwskcz4	2025-12-30 06:11:50.673	2025-12-30 06:11:50.673
cmjs6wd0z001a55udxrs9lyg0	SELASA	07:38	08:16	cmj5eca0k0004jsuddjewnal1	cmj9z7q9n001s5dudxr525koc	cmj9z8yem002u5dudolwskcz4	2025-12-30 06:11:54.994	2025-12-30 06:11:54.994
cmjs6wgcc001b55udvi3q70z9	SELASA	08:16	08:54	cmj5eca0k0004jsuddjewnal1	cmj9z7q9n001s5dudxr525koc	cmj9z8yem002u5dudolwskcz4	2025-12-30 06:11:59.291	2025-12-30 06:11:59.291
cmjs6wpuh001c55udx2sy9s6q	SELASA	08:54	09:32	cmj5eca0k0004jsuddjewnal1	cmj9z7q9n001s5dudxr525koc	cmj9z8y8o002m5dudwnycw1jf	2025-12-30 06:12:11.608	2025-12-30 06:12:11.608
cmjs6wtpy001d55ude1zk2ume	SELASA	10:10	10:45	cmj5eca0k0004jsuddjewnal1	cmj9z7q9n001s5dudxr525koc	cmj9z8y8o002m5dudwnycw1jf	2025-12-30 06:12:16.628	2025-12-30 06:12:16.628
cmjs6wxhs001e55udhhascbpc	SELASA	10:45	11:20	cmj5eca0k0004jsuddjewnal1	cmj9z7q9n001s5dudxr525koc	cmj9z8y8o002m5dudwnycw1jf	2025-12-30 06:12:21.52	2025-12-30 06:12:21.52
cmjs6x1x5001f55uds3tfrguj	SELASA	11:20	11:55	cmj5eca0k0004jsuddjewnal1	cmj9z7q9n001s5dudxr525koc	cmj9z8y8o002m5dudwnycw1jf	2025-12-30 06:12:27.256	2025-12-30 06:12:27.256
cmjs6x6m2001g55udti5f4y1x	SELASA	11:55	12:30	cmj5eca0k0004jsuddjewnal1	cmj9z7q9n001s5dudxr525koc	cmj9z8y8o002m5dudwnycw1jf	2025-12-30 06:12:33.338	2025-12-30 06:12:33.338
cmjs6xa6o001h55ud0tl3u60n	SELASA	12:30	13:05	cmj5eca0k0004jsuddjewnal1	cmj9z7q9n001s5dudxr525koc	cmj9z8y8o002m5dudwnycw1jf	2025-12-30 06:12:37.967	2025-12-30 06:12:37.967
cmjs6xqww001i55ud3gbhvhpg	SELASA	07:00	07:38	cmj5eca170008jsudb4r1h58n	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-30 06:12:59.648	2025-12-30 06:12:59.648
cmjs6xu49001j55udz35rascc	SELASA	07:38	08:16	cmj5eca170008jsudb4r1h58n	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-30 06:13:03.8	2025-12-30 06:13:03.8
cmjs6xx02001k55udfi59yihs	SELASA	08:16	08:54	cmj5eca170008jsudb4r1h58n	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-30 06:13:07.537	2025-12-30 06:13:07.537
cmjs6xzw0001l55ud2crz6tkx	SELASA	08:54	09:32	cmj5eca170008jsudb4r1h58n	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-30 06:13:11.279	2025-12-30 06:13:11.279
cmjs6y7a9001m55udg31hu9rb	SELASA	10:10	10:45	cmj5eca170008jsudb4r1h58n	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-30 06:13:20.864	2025-12-30 06:13:20.864
cmjs6yiu8001n55udvn1hbo3b	SELASA	07:00	07:38	cmj5eca050002jsudq5rc3oa3	cmj9z7q84001d5dud60yqektg	cmj9z8ybn002q5dud7n4058u9	2025-12-30 06:13:35.839	2025-12-30 06:13:35.839
cmjs6ytkd001o55udexvh859k	SELASA	07:38	08:16	cmj5eca050002jsudq5rc3oa3	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yd4002s5dudqb9lav2o	2025-12-30 06:13:49.74	2025-12-30 06:13:49.74
cmjs6z3nk001p55udjrp345vj	SELASA	08:16	08:54	cmj5eca050002jsudq5rc3oa3	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	2025-12-30 06:14:02.815	2025-12-30 06:14:02.815
cmjs6z7p6001q55ud9450akfe	SELASA	08:54	09:32	cmj5eca050002jsudq5rc3oa3	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	2025-12-30 06:14:08.057	2025-12-30 06:14:08.057
cmjs6zogc001r55ud47wl7nfd	SELASA	07:00	07:38	cmj5eca0o0005jsud0ambwla7	cmj9z7q8k001h5dudkou2wtsf	cmj9z8xtu00225dudew59ixr7	2025-12-30 06:14:29.771	2025-12-30 06:14:29.771
cmjs6zsc2001s55udq9yovq9y	SELASA	07:38	08:16	cmj5eca0o0005jsud0ambwla7	cmj9z7q8k001h5dudkou2wtsf	cmj9z8xtu00225dudew59ixr7	2025-12-30 06:14:34.801	2025-12-30 06:14:34.801
cmjs702ox001t55udsvwlm47x	SELASA	08:16	08:54	cmj5eca0o0005jsud0ambwla7	cmj9z7qa5001x5dudniu477gy	cmj9z8y2q002e5dud69l0gx00	2025-12-30 06:14:48.225	2025-12-30 06:14:48.225
cmjs705sg001u55udp9tajcrt	SELASA	08:54	09:32	cmj5eca0o0005jsud0ambwla7	cmj9z7qa5001x5dudniu477gy	cmj9z8y2q002e5dud69l0gx00	2025-12-30 06:14:52.239	2025-12-30 06:14:52.239
cmjs70a76001v55udtp739a5y	SELASA	10:10	10:45	cmj5eca0o0005jsud0ambwla7	cmj9z7q84001d5dud60yqektg	cmj9z8ybn002q5dud7n4058u9	2025-12-30 06:14:57.951	2025-12-30 06:14:57.951
\.


--
-- Data for Name: Jurusan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Jurusan" (id, kode, nama, deskripsi, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmj5cz42g00034iudqf3vd4tn	AK	Akuntansi	\N	2025-12-14 06:43:19	2025-12-14 06:43:19	\N
cmj5czfhl00044iudsyvwnrok	TKJ	Teknik Komputer dan Jaringan	\N	2025-12-14 06:43:33.801	2025-12-14 06:43:33.801	\N
cmj5czn6h00054iuds6wh2zr0	TKR	Teknik Kendaraan Ringan	\N	2025-12-14 06:43:43.768	2025-12-14 06:43:43.768	\N
\.


--
-- Data for Name: Kelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "waliKelasId", "jurusanId") FROM stdin;
cmj5eca170008jsudb4r1h58n	XII Teknik Kendaraan Ringan	XII	30	2025-12-14 07:21:32.875	2025-12-30 15:29:46.063	\N	cmj9z8y1b002c5dudh3e7fyuu	cmj5czn6h00054iuds6wh2zr0
cmj5eca130007jsudvzwt5rjx	XI Teknik Kendaraan Ringan	XI	30	2025-12-14 07:21:32.871	2025-12-30 15:31:25.529	\N	cmj9z8ybn002q5dud7n4058u9	cmj5czn6h00054iuds6wh2zr0
cmj5eca0w0006jsud9bca11b3	X Teknik Kendaraan Ringan	X	30	2025-12-14 07:21:32.864	2025-12-30 15:31:31.482	\N	cmj9z8ya7002o5dudm0yzma1k	cmj5czn6h00054iuds6wh2zr0
cmj5eca0o0005jsud0ambwla7	XII Teknik Komputer dan Jaringan	XII	30	2025-12-14 07:21:32.856	2025-12-30 15:31:39.152	\N	cmj9z8yj000305dudtwddc0j1	cmj5czfhl00044iudsyvwnrok
cmj5eca0k0004jsuddjewnal1	XI Teknik Komputer dan Jaringan	XI	30	2025-12-14 07:21:32.852	2025-12-30 15:31:50.978	\N	cmj9z8xzs002a5dudw0c717l2	cmj5czfhl00044iudsyvwnrok
cmj5eca0e0003jsud1uxj50o4	X Teknik Komputer dan Jaringan	X	30	2025-12-14 07:21:32.846	2025-12-30 15:31:58.01	\N	cmj9z8yly00345dudadjrqvfh	cmj5czfhl00044iudsyvwnrok
cmj5eca050002jsudq5rc3oa3	XII Akuntansi	XII	30	2025-12-14 07:21:32.837	2025-12-30 15:32:08.21	\N	cmj9z8y2q002e5dud69l0gx00	cmj5cz42g00034iudqf3vd4tn
cmj5ec9zx0001jsud5cnf1k74	XI Akuntansi	XI	30	2025-12-14 07:21:32.829	2025-12-30 15:32:21.516	\N	cmj9z8y8o002m5dudwnycw1jf	cmj5cz42g00034iudqf3vd4tn
cmj5ec9zf0000jsudgpxci2hf	X Akuntansi	X	30	2025-12-14 07:21:32.811	2025-12-30 15:32:29.025	\N	cmj9z8y4a002g5dudjlq4s2jp	cmj5cz42g00034iudqf3vd4tn
\.


--
-- Data for Name: MataPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmj9z7q7y001c5dudu38a65qb	MTK	Matematika	4		SEMUA	2025-12-17 12:16:57.214	2025-12-17 12:16:57.214	\N
cmj9z7q84001d5dud60yqektg	BIND	Bahasa Indonesia	4		SEMUA	2025-12-17 12:16:57.22	2025-12-17 12:16:57.22	\N
cmj9z7q87001e5dudb1uk5u9j	DPK TKJ	Dasar Program Keahlian TKJ	4		SEMUA	2025-12-17 12:16:57.223	2025-12-17 12:16:57.223	\N
cmj9z7q8c001f5dudtoyt49tx	Informatika	Informatika	4		SEMUA	2025-12-17 12:16:57.228	2025-12-17 12:16:57.228	\N
cmj9z7q8h001g5dud3cnj22wr	IPAS	IPAS	4		SEMUA	2025-12-17 12:16:57.233	2025-12-17 12:16:57.233	\N
cmj9z7q8k001h5dudkou2wtsf	Bahasa Inggris	Bahasa Inggris	4		SEMUA	2025-12-17 12:16:57.236	2025-12-17 12:16:57.236	\N
cmj9z7q8m001i5dudi334c2ms	Sejarah Indonesia	Sejarah Indonesia	4		SEMUA	2025-12-17 12:16:57.238	2025-12-17 12:16:57.238	\N
cmj9z7q8q001j5dudx5o1zuri	PPKN	Pendidikan Pancasila dan Kewarganegaraan	4		SEMUA	2025-12-17 12:16:57.242	2025-12-17 12:16:57.242	\N
cmj9z7q8v001k5dudwd0dr0f2	PJOK	PJOK	4		SEMUA	2025-12-17 12:16:57.247	2025-12-17 12:16:57.247	\N
cmj9z7q8x001l5dudh15r8ocj	PKKWU AK	PKKWU AK	4		SEMUA	2025-12-17 12:16:57.249	2025-12-17 12:16:57.249	\N
cmj9z7q90001m5dud5q6cvaku	PAI	PAI	4		SEMUA	2025-12-17 12:16:57.252	2025-12-17 12:16:57.252	\N
cmj9z7q94001n5dudvyt50cow	DPK AK	Dasar Program Keahlian AK	4		SEMUA	2025-12-17 12:16:57.256	2025-12-17 12:16:57.256	\N
cmj9z7q98001o5dudu8zzru3q	DPK TKR	Dasar Program Keahlian TKR	4		SEMUA	2025-12-17 12:16:57.26	2025-12-17 12:16:57.26	\N
cmj9z7q9c001p5dudhh2cp17a	Bahasa Daerah	Bahasa Daerah	4		SEMUA	2025-12-17 12:16:57.264	2025-12-17 12:16:57.264	\N
cmj9z7q9f001q5dud3giiabft	KK TKR	Konsentrasi Keahlian TKR	4		SEMUA	2025-12-17 12:16:57.267	2025-12-17 12:16:57.267	\N
cmj9z7q9i001r5dudnscpl8q0	KK AK	Konsentrasi Keahlian AK	4		SEMUA	2025-12-17 12:16:57.27	2025-12-17 12:16:57.27	\N
cmj9z7q9n001s5dudxr525koc	KK TKJ	Konsentrasi Keahlian TKJ	4		SEMUA	2025-12-17 12:16:57.275	2025-12-17 12:16:57.275	\N
cmj9z7q9q001t5dudysev7yd8	PAK	PAK	4		SEMUA	2025-12-17 12:16:57.278	2025-12-17 12:16:57.278	\N
cmj9z7q9s001u5dudswlkj5ya	Mapel Pilihan AK	Mapel Pilihan AK	4		SEMUA	2025-12-17 12:16:57.28	2025-12-17 12:16:57.28	\N
cmj9z7q9v001v5dud8r2heab2	Mapel Pilihan TKJ	Mapel Pilihan TKJ	4		SEMUA	2025-12-17 12:16:57.283	2025-12-17 12:16:57.283	\N
cmj9z7qa0001w5dudmau1sngf	Mapel Pilihan TKR	Mapel Pilihan TKR	4		SEMUA	2025-12-17 12:16:57.288	2025-12-17 12:16:57.288	\N
cmj9z7qa5001x5dudniu477gy	PKKWU TKJ	PKKWU TKJ	4		SEMUA	2025-12-17 12:16:57.293	2025-12-17 12:16:57.293	\N
cmj9z7qa8001y5dud4gjab2sw	PKKWU TKR	PKKWU TKR	4		SEMUA	2025-12-17 12:16:57.296	2025-12-17 12:16:57.296	\N
cmj9z7qaa001z5dudjfz3mlu8	Pramuka	Pramuka	4		SEMUA	2025-12-17 12:16:57.298	2025-12-17 12:16:57.298	\N
cmj9z7qae00205dudqey9zf1h	Seni Budaya	Seni Budaya	4		SEMUA	2025-12-17 12:16:57.302	2025-12-17 12:16:57.302	\N
cmjof810t000005udgq7bzpjh	BK	Bimbingan Konseling	5	\N	SEMUA	2025-12-27 14:53:51.533	2025-12-27 14:53:51.533	\N
\.


--
-- Data for Name: Materi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Materi" (id, judul, deskripsi, tipe, konten, "mataPelajaranId", "guruId", "kelasId", "isPinned", "isPublished", "viewCount", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: MateriAttachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MateriAttachment" (id, "materiId", "namaFile", "ukuranFile", "tipeFile", "urlFile", "createdAt") FROM stdin;
\.


--
-- Data for Name: MateriBookmark; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MateriBookmark" (id, "materiId", "siswaId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Notifikasi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notifikasi" (id, "userId", tipe, judul, pesan, "linkUrl", "isRead", "readAt", metadata, "createdAt") FROM stdin;
\.


--
-- Data for Name: PaketSoal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaketSoal" (id, kode, nama, deskripsi, "mataPelajaranId", "totalSoal", "createdAt", "updatedAt", "deletedAt", "guruId") FROM stdin;
\.


--
-- Data for Name: PaketSoalItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaketSoalItem" (id, "paketSoalId", "bankSoalId", urutan, "createdAt") FROM stdin;
\.


--
-- Data for Name: PaketSoalKelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaketSoalKelas" (id, "paketSoalId", "kelasId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Pengumuman; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Pengumuman" (id, judul, konten, "targetRoles", "authorId", "isActive", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: ProgressSiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProgressSiswa" (id, "siswaId", "mataPelajaranId", "materiDibaca", "tugasSelesai", "forumPosts", "totalScore", "lastActivity", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: RPP; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RPP" (id, kode, "mataPelajaranId", "guruId", "capaianPembelajaran", "tujuanPembelajaran", status, "isPublished", "createdAt", "updatedAt", "deletedAt", "alokasiWaktu", "asesmenAkhir", "asesmenAwal", "asesmenProses", "dimensiProfilLulusan", fase, "identifikasiMateri", "identifikasiPesertaDidik", "kegiatanAwal", "kegiatanMemahami", "kegiatanMengaplikasi", "kegiatanMerefleksi", "kegiatanPenutup", "kemitraanPembelajaran", "lingkunganPembelajaran", "lintasDisiplinIlmu", materi, "namaGuru", "pemanfaatanDigital", "praktikPedagogik", "tahunAjaran", "topikPembelajaran") FROM stdin;
cmjsihj2y0000v5ud7f0f6syr	RPP-DPK	cmj9z7q9n001s5dudxr525koc	cmj9z8yem002u5dudolwskcz4	Pada akhir fase F, peserta didik mampu mengelola dan mengamankan jaringan komputer berbasis kabel dan nirkabel, termasuk mengkonfigurasi perangkat jaringan aktif, menerapkan protokol jaringan, serta melakukan pemeliharaan dan perbaikan. Secara spesifik, peserta didik mampu mengkonfigurasi perangkat jaringan Mikrotik untuk membangun konektivitas dasar dan layanan jaringan esensial sesuai standar operasional prosedur dan kebutuhan fungsional.	["Setelah mengikuti sesi diskusi dan demonstrasi, peserta didik mampu menjelaskan fungsi dan konsep dasar komponen Mikrotik (misalnya, Winbox, IP Address, DHCP Server, DNS, Gateway) dengan tepat dan percaya diri.", "Melalui kegiatan praktikum mandiri, peserta didik mampu mengaplikasikan langkah-langkah setting dasar Mikrotik (identitas router, konfigurasi IP Address, DHCP Server, DNS, dan Gateway) pada perangkat fisik atau virtual dengan akurat dan sesuai prosedur.", "Melalui studi kasus sederhana, peserta didik mampu menganalisis dan mengidentifikasi potensi permasalahan pada konfigurasi dasar Mikrotik serta mengusulkan solusi secara logis dan kritis."]	PUBLISHED	t	2025-12-30 11:36:18.393	2025-12-30 11:45:05.838	2025-12-30 11:45:05.835	90	1. **Unjuk Kerja/Praktik:** Peserta didik diminta untuk mendemonstrasikan konfigurasi dasar Mikrotik sesuai skenario yang diberikan (misalnya, 'Konfigurasikan Mikrotik ini agar dapat memberikan internet ke 3 komputer klien dan 1 perangkat Wi-Fi'). Penilaian berdasarkan rubrik yang mencakup ketepatan konfigurasi, fungsionalitas, efisiensi, dan kemampuan troubleshooting.\n2. **Pertanyaan Lisan/Tertulis:** Pertanyaan yang menguji pemahaman konseptual dan kemampuan penalaran kritis, misalnya 'Jelaskan perbedaan antara IP Address statis dan dinamis pada Mikrotik!', atau 'Jika klien tidak mendapatkan IP dari DHCP Server Mikrotik, langkah-langkah apa saja yang akan kamu lakukan untuk mendiagnosis masalah tersebut?'	Kuis lisan singkat di awal pembelajaran untuk mengidentifikasi pengetahuan awal peserta didik terkait konsep dasar jaringan seperti IP Address, DHCP, DNS, dan fungsi router.	1. **Observasi Praktikum:** Guru melakukan observasi langsung selama praktikum, mencatat ketepatan langkah, kemandirian, efisiensi waktu, serta kemampuan peserta didik dalam mengidentifikasi dan memecahkan masalah saat konfigurasi. Guru dapat menggunakan lembar observasi dengan rubrik.\n2. **Diskusi & Tanya Jawab:** Penilaian keaktifan peserta didik dalam diskusi kelompok dan kemampuan menjawab pertanyaan guru terkait konsep dan prosedur konfigurasi Mikrotik.\n3. **Penyelesaian LKS:** Penilaian kelengkapan dan kebenaran hasil konfigurasi yang tercatat dalam Lembar Kerja Siswa (LKS).	["KEWARGAAN", "PENALARAN_KRITIS"]	fase f	Materi 'Setting Dasar Mikrotik' merupakan pengetahuan prosedural yang sangat aplikatif, namun juga membutuhkan pemahaman konseptual yang kuat (misalnya, fungsi IP address, DHCP, DNS, gateway). Relevansi materi ini sangat tinggi karena Mikrotik adalah perangkat jaringan yang banyak digunakan di berbagai skala industri di Indonesia, sehingga penguasaan materi ini menjadi kompetensi esensial bagi teknisi jaringan. Tingkat kesulitan materi ini moderat; langkah-langkah dasarnya relatif mudah diikuti, namun pemahaman mendalam tentang setiap parameter dan kemampuan untuk memecahkan masalah membutuhkan penalaran kritis dan pengalaman.	Peserta didik fase F (kelas XI/XII SMK) pada program keahlian TKJ umumnya memiliki dasar pengetahuan tentang komputer dan jaringan, namun dengan tingkat pemahaman yang bervariasi. Sebagian mungkin telah terpapar konsep jaringan dasar seperti IP address dan router, sementara yang lain mungkin baru mengenalnya secara mendalam. Mereka memiliki minat yang tinggi terhadap praktik langsung, eksplorasi teknologi, dan pemecahan masalah nyata yang relevan dengan dunia kerja. Kesiapan belajar mereka akan dipengaruhi oleh pengalaman sebelumnya dan motivasi untuk menguasai keterampilan teknis yang dibutuhkan di industri. Beberapa mungkin memiliki gaya belajar visual-kinestetik yang kuat, sehingga pendekatan praktikum sangat cocok.	{"prinsip": ["Mindful", "Meaningful", "Bermakna (Meaningful)", "Berkesadaran (Mindful)"], "kegiatan": "1. **Pembukaan & Sapaan (2 menit):** Guru menyapa peserta didik dengan hangat, mengucapkan salam, dan mengajak untuk berdoa bersama sebagai wujud rasa syukur dan kesiapan belajar (Mindful).\\n2. **Cek Kehadiran & Kesiapan (2 menit):** Guru melakukan pengecekan kehadiran dan memastikan kesiapan fisik serta mental peserta didik untuk memulai pembelajaran.\\n3. **Apersepsi & Motivasi (4 menit):** Guru memantik diskusi singkat tentang pentingnya router dalam kehidupan sehari-hari (misalnya, 'Bagaimana internet di rumah atau sekolah bisa terhubung?') dan mengaitkannya dengan peran Mikrotik sebagai salah satu perangkat router populer. Guru juga menjelaskan relevansi materi 'Setting Dasar Mikrotik' dengan kompetensi yang dibutuhkan di dunia kerja sebagai teknisi jaringan, menumbuhkan motivasi dan kesadaran akan makna pembelajaran (Meaningful).\\n4. **Penyampaian Tujuan Pembelajaran & Dimensi P3 (2 menit):** Guru menyampaikan tujuan pembelajaran yang akan dicapai dan mengaitkannya dengan dimensi Profil Pelajar Pancasila 'Kewargaan' (misalnya, tanggung jawab dalam mengelola infrastruktur jaringan) dan 'Penalaran Kritis' (kemampuan memecahkan masalah jaringan)."}	{"prinsip": ["Meaningful", "Mindful", "Bermakna (Meaningful)", "Berkesadaran (Mindful)"], "kegiatan": "1. **Identifikasi Pengetahuan Awal (5 menit):** Guru menyajikan pertanyaan pemantik seperti 'Apa yang kalian ketahui tentang IP Address?', 'Mengapa router dibutuhkan?', 'Pernahkah kalian melihat atau menggunakan perangkat Mikrotik?' untuk mengidentifikasi pengetahuan awal peserta didik dan memicu rasa ingin tahu (Mindful).\\n2. **Eksplorasi Konsep (10 menit):** Guru memfasilitasi diskusi singkat tentang konsep dasar jaringan dan fungsi utama sebuah router. Guru kemudian menampilkan antarmuka Winbox dan mendemonstrasikan secara singkat cara login ke Mikrotik. Peserta didik diajak untuk mengamati dan bertanya (Meaningful).\\n3. **Studi Kasus Sederhana (10 menit):** Guru menyajikan skenario sederhana 'Sebuah kantor kecil ingin memiliki jaringan internet yang terbagi ke beberapa komputer dan perangkat Wi-Fi. Komponen Mikrotik apa saja yang perlu diatur?' Peserta didik secara berpasangan berdiskusi untuk mengidentifikasi komponen Mikrotik yang perlu di-setting. Guru membimbing diskusi untuk memastikan pemahaman konsep dasar (Meaningful, Mindful)."}	{"prinsip": ["Meaningful", "Joyful", "Menggembirakan (Joyful)", "Bermakna (Meaningful)"], "kegiatan": "1. **Demonstrasi Interaktif (15 menit):** Guru mendemonstrasikan langkah-langkah setting dasar Mikrotik (mengganti identitas, konfigurasi IP Address, DHCP Server, DNS, dan Gateway) secara langsung menggunakan perangkat Mikrotik dan Winbox. Guru menjelaskan setiap langkah secara detail dan memberikan kesempatan peserta didik untuk bertanya. (Meaningful)\\n2. **Praktikum Mandiri/Berpasangan (25 menit):** Peserta didik menerima Lembar Kerja Siswa (LKS) yang berisi panduan langkah demi langkah untuk melakukan setting dasar Mikrotik pada perangkat fisik atau virtual yang telah disediakan. Mereka bekerja secara mandiri atau berpasangan. Guru berkeliling untuk memantau, memberikan bimbingan, dan menstimulasi pemikiran kritis dengan pertanyaan seperti 'Jika terjadi error, apa langkah pertama yang akan kamu cek?' (Joyful, Meaningful, Penalaran Kritis).\\n3. **Tantangan Pemecahan Masalah (5 menit):** Guru memberikan tantangan kecil, misalnya 'Setelah setting selesai, coba ping ke google.com. Jika tidak bisa, identifikasi di mana letak masalahnya dan bagaimana solusinya?' Ini mendorong peserta didik untuk menerapkan penalaran kritis dalam menghadapi masalah nyata. (Joyful, Penalaran Kritis)"}	{"prinsip": ["Mindful", "Bermakna (Meaningful)"], "kegiatan": "1. **Refleksi Diri (5 menit):** Setiap peserta didik diminta untuk menuliskan secara singkat (atau menyampaikan secara lisan) tiga hal yang paling menantang dalam proses setting dasar Mikrotik, dua hal yang paling mereka pelajari, dan satu hal yang ingin mereka eksplorasi lebih lanjut. (Mindful)\\n2. **Diskusi Reflektif (3 menit):** Guru memfasilitasi diskusi singkat tentang pengalaman praktikum. 'Bagaimana perasaan kalian setelah berhasil mengkonfigurasi Mikrotik?', 'Apakah kalian menemukan kesulitan? Bagaimana cara kalian mengatasinya?' Ini juga kesempatan untuk mengaitkan kembali dengan dimensi Profil Pelajar Pancasila 'Penalaran Kritis' (bagaimana mereka mengatasi masalah) dan 'Kewargaan' (tanggung jawab dalam melakukan konfigurasi jaringan yang benar)."}	{"prinsip": ["Mindful", "Bermakna (Meaningful)", "Menggembirakan (Joyful)"], "kegiatan": "1. **Rangkuman (2 menit):** Guru bersama peserta didik merangkum poin-poin penting dari materi 'Setting Dasar Mikrotik' yang telah dipelajari.\\n2. **Umpan Balik & Apresiasi (2 menit):** Guru memberikan umpan balik positif atas partisipasi dan usaha peserta didik, serta memberikan apresiasi atas kerja keras mereka. Guru juga menanyakan umpan balik singkat dari peserta didik tentang pembelajaran hari ini.\\n3. **Informasi Lanjutan & Doa (2 menit):** Guru menyampaikan materi atau topik yang akan dibahas pada pertemuan berikutnya dan menutup pembelajaran dengan doa bersama."}	Tidak ada kemitraan dengan pihak luar secara spesifik untuk sesi ini, namun materi ini dapat dikembangkan di kemudian hari dengan praktisi industri.	Laboratorium Komputer yang dilengkapi dengan perangkat Mikrotik RouterBoard (fisik atau virtual/simulasi seperti EVE-NG/GNS3) untuk setiap kelompok/individu, komputer klien, koneksi internet, proyektor, dan papan tulis interaktif. Budaya belajar yang diterapkan adalah kolaboratif, eksploratif, dan berorientasi pada pemecahan masalah, dengan mendorong peserta didik untuk berani mencoba dan belajar dari kesalahan.	Matematika (untuk konsep subnetting IP address), Bahasa Inggris (untuk istilah teknis dan dokumentasi), Pendidikan Pancasila (untuk etika penggunaan teknologi dan keamanan siber).	Setting Dasar Mikrotik	\N	Aplikasi Winbox untuk konfigurasi Mikrotik, perangkat Mikrotik RouterOS (fisik/virtual), browser web untuk akses dokumentasi/referensi online (wiki.mikrotik.com, forum), proyektor untuk demonstrasi, dan mungkin platform LMS untuk berbagi materi/LKS.	Pendekatan Deep Learning dengan model Pembelajaran Berbasis Masalah (Problem-Based Learning) dan Pembelajaran Berbasis Proyek Sederhana (Project-Based Learning). Strategi yang digunakan meliputi demonstrasi interaktif, diskusi kelompok, praktikum mandiri, dan studi kasus. Metode yang diterapkan adalah ceramah singkat, tanya jawab, simulasi, dan praktik langsung (hands-on).	2025-2026	Konfigurasi Dasar Mikrotik RouterOS (Menggunakan Winbox): Pengaturan Identitas Router, Konfigurasi IP Address pada Interface, Konfigurasi DHCP Server, Konfigurasi DNS Client, dan Konfigurasi Gateway (Routing).
cmjsiy5ed000096ud77slyg7m	RPP-DPK-001	cmj9z7q87001e5dudb1uk5u9j	cmj9z8yem002u5dudolwskcz4	Pada akhir fase F, peserta didik mampu menerapkan dasar-dasar sistem jaringan komputer, mengidentifikasi komponen jaringan, serta mengimplementasikan konfigurasi dasar jaringan kabel dan nirkabel secara mandiri atau berkelompok untuk mendukung konektivitas data dan informasi.	["Peserta didik mampu menjelaskan konsep dasar jaringan kabel dan nirkabel (jenis, komponen, topologi) dengan tepat setelah mengikuti diskusi dan presentasi. (PENALARAN_KRITIS)", "Peserta didik mampu mengidentifikasi dan membedakan komponen perangkat keras yang diperlukan untuk membangun jaringan kabel dan nirkabel melalui observasi dan eksplorasi. (PENALARAN_KRITIS)", "Peserta didik mampu mengimplementasikan konfigurasi dasar jaringan kabel menggunakan simulasi atau perangkat fisik sederhana secara kolaboratif dalam kelompok. (KREATIFITAS, KOLABORASI)"]	PUBLISHED	t	2025-12-30 11:49:13.811	2025-12-30 11:49:13.811	\N	90	Unjuk kerja/Portofolio: Hasil konfigurasi jaringan kabel dan nirkabel pada perangkat simulasi atau fisik yang diunggah atau didokumentasikan, disertai penjelasan singkat tentang langkah-langkah dan hasil pengujian. Penilaian refleksi individu (kedalaman pemahaman, kesadaran diri terhadap proses belajar).	Observasi partisipasi dan jawaban lisan peserta didik saat apersepsi dan asesmen diagnostik singkat tentang pengetahuan dasar jaringan (misalnya, 'Apa itu IP address?', 'Apa fungsi router?').	Observasi guru selama diskusi kelompok (keaktifan, kolaborasi, kemampuan berargumen, PENALARAN_KRITIS). Observasi performa saat praktikum (ketepatan mengikuti prosedur, kemampuan memecahkan masalah, KREATIFITAS dalam mencari solusi, KOLABORASI). Penilaian lembar kerja praktikum (kelengkapan konfigurasi, hasil pengujian konektivitas).	["PENALARAN_KRITIS", "KREATIFITAS", "KOLABORASI"]	Fase F/X/Ganjil	Materi 'Konfigurasi Jaringan Kabel dan Nirkabel' mencakup pengetahuan konseptual (jenis-jenis jaringan, protokol, topologi) dan prosedural (langkah-langkah konfigurasi perangkat). Materi ini sangat relevan dengan kehidupan sehari-hari peserta didik (penggunaan internet, Wi-Fi) dan menjadi dasar penting dalam program keahlian TKJ. Tingkat kesulitan materi ini moderat, membutuhkan pemahaman teori dasar sebelum dapat diaplikasikan secara praktis. Materi ini mendorong peserta didik untuk berpikir kritis dalam memecahkan masalah konfigurasi.	Peserta didik Fase F di SMK kelas X umumnya berada pada tahap perkembangan kognitif operasional formal, mampu berpikir abstrak namun masih memerlukan konteks konkret. Mereka memiliki tingkat literasi digital yang bervariasi, beberapa mungkin sudah memiliki pengetahuan dasar tentang jaringan dari pengalaman pribadi atau media sosial. Kesiapan belajar mereka dapat beragam, ada yang antusias dengan praktik, ada pula yang lebih suka teori. Minat mereka cenderung pada hal-hal aplikatif dan relevan dengan dunia kerja. Beberapa mungkin memiliki gaya belajar visual, auditori, atau kinestetik. Peserta didik diharapkan dapat bekerja secara kolaboratif dalam kelompok.	{"prinsip": ["Mindful", "Meaningful"], "kegiatan": "1. Guru membuka pelajaran dengan salam dan memimpin doa. (Mindful)\\n2. Guru mengecek kehadiran dan kesiapan belajar peserta didik.\\n3. Guru melakukan apersepsi dengan menampilkan video singkat atau gambar tentang penggunaan jaringan internet dalam kehidupan sehari-hari (misalnya, di rumah, sekolah, tempat kerja) dan menanyakan 'Apa yang kalian ketahui tentang bagaimana perangkat-perangkat ini bisa saling terhubung?' (Meaningful, Mindful)\\n4. Guru menjelaskan tujuan pembelajaran dan manfaat mempelajari konfigurasi jaringan dalam dunia kerja TKJ.\\n5. Guru melakukan asesmen diagnostik singkat (pertanyaan lisan atau polling sederhana) untuk mengetahui pengetahuan awal peserta didik tentang jaringan komputer. Contoh: 'Siapa yang tahu bedanya jaringan kabel dan nirkabel?'"}	{"prinsip": ["Meaningful", "Mindful"], "kegiatan": "1. Peserta didik dibagi menjadi beberapa kelompok kecil (3-4 orang).\\n2. Setiap kelompok diberikan studi kasus sederhana tentang kebutuhan jaringan di sebuah kantor kecil atau rumah. (Meaningful)\\n3. Guru memfasilitasi diskusi kelompok untuk mengidentifikasi jenis-jenis jaringan (LAN, WLAN), komponen utama (router, switch, kabel, NIC, AP), dan topologi dasar yang mungkin digunakan dalam studi kasus tersebut. Peserta didik dapat mencari informasi dari buku paket atau sumber online. (Meaningful, Mindful, PENALARAN_KRITIS)\\n4. Guru memberikan penjelasan singkat dan interaktif tentang konsep-konsep kunci (IP address, subnet mask, gateway, DHCP) yang akan digunakan dalam konfigurasi, menggunakan contoh-contoh yang relevan.\\n5. Setiap kelompok diminta mempresentasikan hasil diskusi awal mereka tentang komponen dan topologi yang akan mereka pilih."}	{"prinsip": ["Meaningful", "Joyful"], "kegiatan": "1. Guru mendemonstrasikan langkah-langkah dasar konfigurasi jaringan kabel pada perangkat lunak simulasi (misalnya, Cisco Packet Tracer) atau perangkat fisik sederhana (misalnya, menghubungkan PC ke switch, memberikan IP address statis). (Meaningful)\\n2. Setiap kelompok menerima lembar kerja praktikum yang berisi skenario konfigurasi dasar jaringan kabel dan nirkabel.\\n3. Peserta didik secara berkelompok memulai praktikum konfigurasi jaringan sesuai skenario, baik menggunakan Cisco Packet Tracer atau perangkat fisik yang tersedia. Mereka diminta untuk mengkonfigurasi IP Address, menguji konektivitas (ping), dan jika memungkinkan, mengkonfigurasi SSID dan password pada perangkat nirkabel. (Meaningful, Joyful, KREATIFITAS, KOLABORASI)\\n4. Guru memfasilitasi dan membimbing peserta didik, memberikan bantuan jika diperlukan, dan mendorong diskusi antar anggota kelompok untuk memecahkan masalah."}	{"prinsip": ["Mindful"], "kegiatan": "1. Setiap kelompok diminta untuk menuliskan secara singkat kendala yang mereka hadapi selama praktikum dan bagaimana mereka mengatasinya.\\n2. Guru memimpin diskusi singkat tentang 'Apa hal baru yang kalian pelajari hari ini?' dan 'Bagian mana dari konfigurasi yang paling menantang dan mengapa?'. (Mindful)\\n3. Peserta didik secara individu menuliskan satu hal penting yang mereka pahami dari pembelajaran hari ini dan satu pertanyaan yang masih ingin mereka ketahui."}	{"prinsip": ["Mindful"], "kegiatan": "1. Guru bersama peserta didik menyimpulkan poin-poin penting pembelajaran hari ini.\\n2. Guru memberikan apresiasi atas partisipasi aktif peserta didik.\\n3. Guru menyampaikan materi untuk pertemuan selanjutnya (misalnya, troubleshooting jaringan sederhana).\\n4. Guru menutup pelajaran dengan doa dan salam."}	Belum ada kemitraan khusus untuk sesi ini.	Laboratorium komputer dengan akses internet dan perangkat lunak simulasi jaringan (misalnya Cisco Packet Tracer) atau laboratorium praktik dengan perangkat jaringan fisik sederhana (switch, router Wi-Fi, kabel UTP, PC/laptop). Budaya belajar yang kolaboratif, saling membantu, dan mendorong eksperimen.	Informatika (algoritma, logika), Matematika (perhitungan IP address, subnetting), Bahasa Indonesia (komunikasi teknis, penulisan laporan).	Konfigurasi Jaringan Kabel dan Nirkabel	\N	Perangkat lunak simulasi jaringan (Cisco Packet Tracer) untuk praktikum virtual. Sumber belajar daring (video tutorial, artikel teknis) untuk eksplorasi mandiri. Media presentasi digital (PowerPoint, Google Slides) untuk penjelasan konsep dan presentasi hasil.	Pembelajaran Berbasis Proyek (Project-Based Learning) atau Pembelajaran Berbasis Masalah (Problem-Based Learning) dengan pendekatan Deep Learning, di mana peserta didik tidak hanya menghafal prosedur tetapi memahami 'mengapa' dan 'bagaimana' suatu konfigurasi bekerja, serta mampu memecahkan masalah. Metode diskusi, demonstrasi, dan praktikum mandiri/kelompok.	2025-2026	Konfigurasi Dasar Jaringan Kabel (LAN) dan Jaringan Nirkabel (WLAN) menggunakan perangkat simulasi atau perangkat fisik sederhana (router, switch, kabel UTP).
\.


--
-- Data for Name: RPPKelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RPPKelas" (id, "rppId", "kelasId", "createdAt") FROM stdin;
cmjsihj3c0001v5ud9ro4r2zv	cmjsihj2y0000v5ud7f0f6syr	cmj5eca0k0004jsuddjewnal1	2025-12-30 11:36:18.407
cmjsiy5eo000196ud9fcg2fmm	cmjsiy5ed000096ud77slyg7m	cmj5eca0e0003jsud1uxj50o4	2025-12-30 11:49:13.823
\.


--
-- Data for Name: Settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Settings" (id, key, value, "createdAt", "updatedAt") FROM stdin;
cmjaxivkf0000u0udfciy166n	late_time_threshold	07:00	2025-12-18 04:17:24.303	2025-12-18 04:17:24.303
cmjsjzanb0001hkudfdbzvco7	school_address	Situbondo	2025-12-30 12:18:06.887	2025-12-30 13:50:02.082
cmjsjzana0000hkudwsylon6p	school_name	SMKS PGRI Banyuputih	2025-12-30 12:18:06.886	2025-12-30 13:50:02.082
cmjsjzanb0002hkudh035yqke	school_phone	08563682390	2025-12-30 12:18:06.887	2025-12-30 13:50:02.083
cmjsjzane000ahkudr287pppa	school_youtube	@esgriba	2025-12-30 12:18:06.89	2025-12-30 13:50:02.086
cmjsjzand0007hkudpkcf2o7s	school_logo	-	2025-12-30 12:18:06.889	2025-12-30 13:50:02.085
cmjsjzanc0005hkudpnvxj2fh	school_principal_name	Irawan Adi Wasito, S.T.	2025-12-30 12:18:06.888	2025-12-30 13:50:02.084
cmjsjzand0006hkudwelpwbui	school_principal_nip	-	2025-12-30 12:18:06.888	2025-12-30 13:50:02.084
cmjsjzane0009hkud5c30rbb7	school_facebook	@esgriba	2025-12-30 12:18:06.889	2025-12-30 13:50:02.086
cmjsjzanc0003hkude4xm6g20	school_email	esgriba20522645@gmail.com	2025-12-30 12:18:06.887	2025-12-30 13:50:02.083
cmjsjzanc0004hkud3a36orf8	school_website	https://www.smkpgribanyuputih.sch.id/	2025-12-30 12:18:06.888	2025-12-30 13:50:02.084
cmjsjzand0008hkudtjodll1q	school_instagram	@esgriba	2025-12-30 12:18:06.889	2025-12-30 13:50:02.085
\.


--
-- Data for Name: Siswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) FROM stdin;
cmj5gwyqw000135udakhyrrna	81475874	ABI HARTO WICAKSONO	1970-01-01 00:00:38.367	Jl. Merdeka No. 123	81234567890	abihartowicaksono@cbt.com	AKTIF	2025-12-14 08:33:37.255	2025-12-14 08:33:37.255	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwyql000035udj9kefx0z	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwysk000335ud06zbjkum	95805399	ADAM SYAHREZA GUMILANG	1970-01-01 00:00:38.431	Jl. Sudirman No. 45	81234567891	adamsyahrezagumilang@cbt.com	AKTIF	2025-12-14 08:33:37.315	2025-12-14 08:33:37.315	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwysf000235udeqpf8mo9	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwyu3000535udp8xm32kg	3088037976	ADITIYA RIZKY BAYU PRADIKA	1970-01-01 00:00:38.431	Jl. Sudirman No. 46	81234567892	aditiyarizkybayupradika@cbt.com	AKTIF	2025-12-14 08:33:37.371	2025-12-14 08:33:37.371	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwytz000435ud3k5i6zne	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwyvo000735udytelfevq	84194598	ADITYA CATUR PRAYOGO	1970-01-01 00:00:38.431	Jl. Sudirman No. 47	81234567893	adityacaturprayogo@cbt.com	AKTIF	2025-12-14 08:33:37.427	2025-12-14 08:33:37.427	\N	cmj5eca0o0005jsud0ambwla7	cmj5gwyvj000635udzcqos5da	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwyx9000935ud28f9ggyr	108737154	ADITYA DAMARA PUTRA KRISTIAWAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 48	81234567894	example12@cbt.com	AKTIF	2025-12-14 08:33:37.485	2025-12-14 08:33:37.485	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gwyx4000835udq2k2tbxp	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwz0g000d35ud5n8q889d	77382296	AGUNG TRISNA DEWI	1970-01-01 00:00:38.431	Jl. Sudirman No. 50	81234567896	agungtrisnadewi@cbt.com	AKTIF	2025-12-14 08:33:37.599	2025-12-14 08:33:37.599	\N	cmj5eca050002jsudq5rc3oa3	cmj5gwz0c000c35udn9g3zoan	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwz23000f35udoygf650d	86881070	AGUS WIRA ADI PURNOMO	1970-01-01 00:00:38.431	Jl. Sudirman No. 51	81234567897	aguswiraadipurnomo@cbt.com	AKTIF	2025-12-14 08:33:37.659	2025-12-14 08:33:37.659	\N	cmj5eca0o0005jsud0ambwla7	cmj5gwz1y000e35udzacwpk0x	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwz3n000h35udillr14ag	99461767	AHMAD DIMAS KURNIAWAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 52	81234567898	example1@cbt.com	AKTIF	2025-12-14 08:33:37.714	2025-12-14 08:33:37.714	\N	cmj5eca0w0006jsud9bca11b3	cmj5gwz3i000g35udydzzmr53	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwz6t000l35ud8wsvgkyz	99396650	AINO YOEL	1970-01-01 00:00:38.431	Jl. Sudirman No. 54	81234567900	example2@cbt.com	AKTIF	2025-12-14 08:33:37.828	2025-12-14 08:33:37.828	\N	cmj5eca0w0006jsud9bca11b3	cmj5gwz6p000k35ud68fsf33i	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwz8c000n35ud8pxa34ep	50397766	AINUR ROHMAH	1970-01-01 00:00:38.431	Jl. Sudirman No. 55	81234567901	ainurrohmah@cbt.com	AKTIF	2025-12-14 08:33:37.883	2025-12-14 08:33:37.883	\N	cmj5ec9zx0001jsud5cnf1k74	cmj5gwz88000m35ud5x4ctx7s	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwz9u000p35uddazsd00z	79686226	ALDI PRAYATNA	1970-01-01 00:00:38.431	Jl. Sudirman No. 56	81234567902	aldiprayatna@cbt.com	AKTIF	2025-12-14 08:33:37.937	2025-12-14 08:33:37.937	\N	cmj5eca0o0005jsud0ambwla7	cmj5gwz9q000o35ud7f7d7ltw	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzeh000v35udwd1xnzk8	97678393	ALFAZA OKTAVINO PRADITIA	1970-01-01 00:00:38.431	Jl. Sudirman No. 59	81234567905	example13@cbt.com	AKTIF	2025-12-14 08:33:38.105	2025-12-14 08:33:38.105	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gwzed000u35udlnddwq47	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzg0000x35udzy1o8cpn	97759070	ALIFATUR ROSIKIN	1970-01-01 00:00:38.431	Jl. Sudirman No. 60	81234567906	alifaturrosikin@cbt.com	AKTIF	2025-12-14 08:33:38.16	2025-12-14 08:33:38.16	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwzfw000w35udzc26ap9b	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzhi000z35udkij11ubh	85609468	AMELIA DEWI SINTA	1970-01-01 00:00:38.431	Jl. Sudirman No. 61	81234567907	ameliadewisinta@cbt.com	AKTIF	2025-12-14 08:33:38.214	2025-12-14 08:33:38.214	\N	cmj5eca050002jsudq5rc3oa3	cmj5gwzhe000y35udg8o4lrsn	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzj2001135udp7u21il5	94461900	ANANDA MAYCKO WIJAYA	1970-01-01 00:00:38.431	Jl. Sudirman No. 62	81234567908	example3@cbt.com	AKTIF	2025-12-14 08:33:38.269	2025-12-14 08:33:38.269	\N	cmj5eca0w0006jsud9bca11b3	cmj5gwziy001035udhbgntn1o	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzkk001335uddaybproj	88279036	ANDHIKA BAYU SAPUTRA	1970-01-01 00:00:38.431	Jl. Sudirman No. 63	81234567909	andhikabayusaputra@cbt.com	AKTIF	2025-12-14 08:33:38.324	2025-12-14 08:33:38.324	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwzkg001235uda1zowq2b	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzm3001535ud35s55raa	104207471	ANGGA CAHYO PRATAMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 64	81234567910	example4@cbt.com	AKTIF	2025-12-14 08:33:38.378	2025-12-14 08:33:38.378	\N	cmj5eca0w0006jsud9bca11b3	cmj5gwzlz001435udoar1p1ou	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwznm001735udpzuadsi6	87785971	ANGGI VIRNANDA PUTRI	1970-01-01 00:00:38.431	Jl. Sudirman No. 65	81234567911	anggivirnandaputri@cbt.com	AKTIF	2025-12-14 08:33:38.434	2025-12-14 08:33:38.434	\N	cmj5ec9zx0001jsud5cnf1k74	cmj5gwzni001635udt2intkub	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzp6001935udi39qku1d	3080015591	AWANG SETIAWAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 66	81234567912	awangsetiawan@cbt.com	AKTIF	2025-12-14 08:33:38.489	2025-12-14 08:33:38.489	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwzp2001835udtswr5q1s	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzqp001b35udoas61cxe	95325705	AYUNI ARIMBI	1970-01-01 00:00:38.431	Jl. Sudirman No. 67	81234567913	example25@cbt.com	AKTIF	2025-12-14 08:33:38.544	2025-12-14 08:33:38.544	\N	cmj5ec9zf0000jsudgpxci2hf	cmj5gwzql001a35udfoqzqfcv	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzs8001d35ud78grtko5	88137615	AZAI DENIS SAFARULLAH	1970-01-01 00:00:38.431	Jl. Sudirman No. 68	81234567914	example5@cbt.com	AKTIF	2025-12-14 08:33:38.599	2025-12-14 08:33:38.599	\N	cmj5eca0w0006jsud9bca11b3	cmj5gwzs4001c35udaqgx22e1	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwztr001f35udgp2iqne6	99940723	BADRIA NUR ANISA	1970-01-01 00:00:38.431	Jl. Sudirman No. 69	81234567915	example14@cbt.com	AKTIF	2025-12-14 08:33:38.654	2025-12-14 08:33:38.654	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gwztn001e35udd3b8c4mg	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzv9001h35udc6lry71w	85744170	BAGUS SETIAWAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 70	81234567916	bagussetiawan@cbt.com	AKTIF	2025-12-14 08:33:38.708	2025-12-14 08:33:38.708	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwzv5001g35ud5bbn2qzz	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzws001j35ud376v2a11	3096187956	CANDRA PRATAMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 71	81234567917	example6@cbt.com	AKTIF	2025-12-14 08:33:38.764	2025-12-14 08:33:38.764	\N	cmj5eca0w0006jsud9bca11b3	cmj5gwzwo001i35uduhbzcboi	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzzu001n35udi1ekaazg	3080427888	DAVA PUTRA PRASETYA	1970-01-01 00:00:38.431	Jl. Sudirman No. 73	81234567919	davaputraprasetya@cbt.com	AKTIF	2025-12-14 08:33:38.874	2025-12-14 08:33:38.874	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwzzr001m35udpblpr5c0	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx01e001p35udcjqmly7n	75360603	DEFI NINGTYAS	1970-01-01 00:00:38.431	Jl. Sudirman No. 74	81234567920	definingtyas@cbt.com	AKTIF	2025-12-14 08:33:38.929	2025-12-14 08:33:38.929	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx01a001o35udcz1uye9r	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzbe000r35ud3dm0w5mp	57279011	ALDO ILFAN PRATAMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 57	81234567903	aldoilfanpratama@cbt.com	AKTIF	2025-12-14 08:33:37.994	2025-12-16 12:33:14.38	\N	cmj5eca170008jsudb4r1h58n	cmj5gwzb9000q35uds8mmj6bl	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwz58000j35ud2jgpgotd	86817502	AHMAD RIAN ZUHRI AFANDI	1970-01-01 00:00:38.431	Jl. Sudirman No. 53	81234567899	ahmadrianzuhriafandi@cbt.com	AKTIF	2025-12-14 08:33:37.771	2025-12-16 12:33:17.609	\N	cmj5eca170008jsudb4r1h58n	cmj5gwz53000i35udw6fgqktc	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwyyw000b35udpo5b2m4t	76544902	ADRIANO DWI PRADHITA	1970-01-01 00:00:38.431	Jl. Sudirman No. 49	81234567895	adrianodwipradhita@cbt.com	AKTIF	2025-12-14 08:33:37.543	2025-12-16 12:33:21.091	\N	cmj5eca170008jsudb4r1h58n	cmj5gwyyq000a35udwqnc8ohp	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzcy000t35ud1wibxk47	78367595	ALFA TRI EFENDI	1970-01-01 00:00:38.431	Jl. Sudirman No. 58	81234567904	alfatriefendi@cbt.com	AKTIF	2025-12-14 08:33:38.049	2025-12-16 12:33:11.1	\N	cmj5eca170008jsudb4r1h58n	cmj5gwzct000s35udllh69h8u	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx02w001r35ud6qdfidog	86514583	DENDI BAYU PRATAMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 75	81234567921	dendibayupratama@cbt.com	AKTIF	2025-12-14 08:33:38.983	2025-12-14 08:33:38.983	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx02s001q35udsc32mvtz	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx05x001v35udwd5nk8nj	71300771	DEWI WAHYUNI	1970-01-01 00:00:38.431	Jl. Sudirman No. 77	81234567923	dewiwahyuni@cbt.com	AKTIF	2025-12-14 08:33:39.093	2025-12-14 08:33:39.093	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx05t001u35ud56w1gpg0	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx07f001x35udj3ispkx8	74612857	DINA RIZA AYU MATUSSHOLEHA	1970-01-01 00:00:38.431	Jl. Sudirman No. 78	81234567924	dinarizaayumatussholeha@cbt.com	AKTIF	2025-12-14 08:33:39.147	2025-12-14 08:33:39.147	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx07b001w35ud6uy774vt	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx08y001z35udsqo698l8	88236354	DINO ABI PRATAMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 79	81234567925	dinoabipratama@cbt.com	AKTIF	2025-12-14 08:33:39.201	2025-12-14 08:33:39.201	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx08u001y35udh95b095v	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0ag002135ud9fhzdekh	84607003	DIZA YOGA YUDISTIA	1970-01-01 00:00:38.431	Jl. Sudirman No. 80	81234567926	dizayogayudistia@cbt.com	AKTIF	2025-12-14 08:33:39.256	2025-12-14 08:33:39.256	\N	cmj5ec9zx0001jsud5cnf1k74	cmj5gx0ac002035udfnj8z7vm	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0c0002335udrmwctcnm	108153368	DWI AYU MEI JAYANTI	1970-01-01 00:00:38.431	Jl. Sudirman No. 81	81234567927	example15@cbt.com	AKTIF	2025-12-14 08:33:39.311	2025-12-14 08:33:39.311	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx0bv002235ud9wy5giy5	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0di002535ud32uasdbw	85947084	DWI SINTIA PUTRI	1970-01-01 00:00:38.431	Jl. Sudirman No. 82	81234567928	dwisintiaputri@cbt.com	AKTIF	2025-12-14 08:33:39.365	2025-12-14 08:33:39.365	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx0de002435ud24zdsw0s	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0ez002735ud6aegx8z1	83725353	EKA DEVI AINUROHMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 83	81234567929	ekadeviainurohma@cbt.com	AKTIF	2025-12-14 08:33:39.419	2025-12-14 08:33:39.419	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx0ev002635udvv65yg6g	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0gi002935udl20nfbog	24142799	ENGGAR DWI PRASETYO	1970-01-01 00:00:38.431	Jl. Sudirman No. 84	81234567930	enggardwiprasetyo@cbt.com	AKTIF	2025-12-14 08:33:39.474	2025-12-14 08:33:39.474	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx0gd002835udbw0sqmi6	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0i0002b35ud19a6xd7r	76887989	ESA AGIL PUTRA	1970-01-01 00:00:38.431	Jl. Sudirman No. 85	81234567931	esaagilputra@cbt.com	AKTIF	2025-12-14 08:33:39.528	2025-12-14 08:33:39.528	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx0hw002a35udavq9oyfo	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0jj002d35udjlza7xue	82535073	FAHMI ADLIYANTO	1970-01-01 00:00:38.431	Jl. Sudirman No. 86	81234567932	fahmiadliyanto@cbt.com	AKTIF	2025-12-14 08:33:39.582	2025-12-14 08:33:39.582	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx0jf002c35udq9gtxbg2	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0l0002f35ud6j2sufzk	3087966253	FAREL ADITYA PUTRA	1970-01-01 00:00:38.431	Jl. Sudirman No. 87	81234567933	fareladityaputra@cbt.com	AKTIF	2025-12-14 08:33:39.635	2025-12-14 08:33:39.635	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx0kw002e35ud03ae2xo1	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0ml002h35udvjc8yzeb	78956609	FATURROHMAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 88	81234567934	faturrohman@cbt.com	AKTIF	2025-12-14 08:33:39.692	2025-12-14 08:33:39.692	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx0mf002g35udp7fvgdod	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0o3002j35uda0ok0i4j	108026037	FERDIO PUTRA PRASETYA	1970-01-01 00:00:38.431	Jl. Sudirman No. 89	81234567935	example16@cbt.com	AKTIF	2025-12-14 08:33:39.747	2025-12-14 08:33:39.747	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx0nz002i35udbi0v5c4g	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0pm002l35udhnyriry6	83278579	FIOLA SEPTIANA RAMADANI	1970-01-01 00:00:38.431	Jl. Sudirman No. 90	81234567936	fiolaseptianaramadani@cbt.com	AKTIF	2025-12-14 08:33:39.802	2025-12-14 08:33:39.802	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx0pi002k35udwebdytrh	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0r4002n35ud6i7qxccl	91017410	FIQI ADITIA	1970-01-01 00:00:38.431	Jl. Sudirman No. 91	81234567937	fiqiaditia@cbt.com	AKTIF	2025-12-14 08:33:39.855	2025-12-14 08:33:39.855	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx0r0002m35udzu8e92kf	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0sm002p35udzxd3mus1	73255473	FITRIANA EKA AMELIA	1970-01-01 00:00:38.431	Jl. Sudirman No. 92	81234567938	fitrianaekaamelia@cbt.com	AKTIF	2025-12-14 08:33:39.91	2025-12-14 08:33:39.91	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx0si002o35ud2jnff2tj	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0u3002r35udqkenscl3	81943244	HERNANDA WILDAN FIRDAUSI	1970-01-01 00:00:38.431	Jl. Sudirman No. 93	81234567939	hernandawildanfirdausi@cbt.com	AKTIF	2025-12-14 08:33:39.962	2025-12-14 08:33:39.962	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx0tz002q35udykvj7rwf	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0vl002t35udzzptrcos	91150081	HUMAM FAUZI YANTO	1970-01-01 00:00:38.431	Jl. Sudirman No. 94	81234567940	example7@cbt.com	AKTIF	2025-12-14 08:33:40.017	2025-12-14 08:33:40.017	\N	cmj5eca0w0006jsud9bca11b3	cmj5gx0vh002s35udu1n8yl9k	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0x4002v35udz7qohe6d	82276835	ICHA JUWITA	1970-01-01 00:00:38.431	Jl. Sudirman No. 95	81234567941	ichajuwita@cbt.com	AKTIF	2025-12-14 08:33:40.072	2025-12-14 08:33:40.072	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx0x0002u35udc7ccpufd	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx0ym002x35udzhcjnau4	83877893	INA AZRIANA DEVI	1970-01-01 00:00:38.431	Jl. Sudirman No. 96	81234567942	inaazrianadevi@cbt.com	AKTIF	2025-12-14 08:33:40.125	2025-12-14 08:33:40.125	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx0yj002w35ud8v9qi589	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx103002z35udn2m30zv3	3083956550	INTAN BALQIS HUMAIRO	1970-01-01 00:00:38.431	Jl. Sudirman No. 97	81234567943	intanbalqishumairo@cbt.com	AKTIF	2025-12-14 08:33:40.178	2025-12-14 08:33:40.178	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx100002y35udilmg1ny8	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx11k003135ud73cds1fi	93398824	JENI EKA NURSABELA	1970-01-01 00:00:38.431	Jl. Sudirman No. 98	81234567944	jeniekanursabela@cbt.com	AKTIF	2025-12-14 08:33:40.232	2025-12-14 08:33:40.232	\N	cmj5ec9zx0001jsud5cnf1k74	cmj5gx11g003035ud3bx82k5d	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx131003335ud6cxmwwir	27420464	JESEN ARDIYANTO	1970-01-01 00:00:38.431	Jl. Sudirman No. 99	81234567945	jesenardiyanto@cbt.com	AKTIF	2025-12-14 08:33:40.285	2025-12-14 08:33:40.285	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx12x003235udw6jxtx4r	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx14k003535udo7rhjcnp	71482878	JESIKA MARTA AL-ZAHRA	1970-01-01 00:00:38.431	Jl. Sudirman No. 100	81234567946	jesikamartaal-zahra@cbt.com	AKTIF	2025-12-14 08:33:40.339	2025-12-14 08:33:40.339	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx14g003435ud6w8b4goi	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx162003735ud5de1cxbc	84405603	JOSHUA BAGUS NUGROHO	1970-01-01 00:00:38.431	Jl. Sudirman No. 101	81234567947	joshuabagusnugroho@cbt.com	AKTIF	2025-12-14 08:33:40.394	2025-12-14 08:33:40.394	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx15y003635udfzfvsnsn	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx17k003935udaewx76ro	98437959	KETUT DIMAS MUHAMAD RISAL	1970-01-01 00:00:38.431	Jl. Sudirman No. 102	81234567948	example17@cbt.com	AKTIF	2025-12-14 08:33:40.447	2025-12-14 08:33:40.447	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx17g003835uduzmy772u	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx193003b35udn6l73ohj	3102507572	KEVIN MAULANA ISHAQ	1970-01-01 00:00:38.431	Jl. Sudirman No. 103	81234567949	example8@cbt.com	AKTIF	2025-12-14 08:33:40.503	2025-12-14 08:33:40.503	\N	cmj5eca0w0006jsud9bca11b3	cmj5gx18z003a35udlra3qj4l	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1c3003f35udp6zso1o3	76188634	KHALUD SAIFUL ANWAR	1970-01-01 00:00:38.431	Jl. Sudirman No. 105	81234567951	khaludsaifulanwar@cbt.com	AKTIF	2025-12-14 08:33:40.61	2025-12-14 08:33:40.61	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx1bz003e35udkcmtj455	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1dj003h35udb14ouf8y	82219934	LIANA RANTIKA PUTRI	1970-01-01 00:00:38.431	Jl. Sudirman No. 106	81234567952	lianarantikaputri@cbt.com	AKTIF	2025-12-14 08:33:40.663	2025-12-14 08:33:40.663	\N	cmj5ec9zx0001jsud5cnf1k74	cmj5gx1dg003g35udnuykpero	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1f1003j35udutcxv8c7	81662471	LIVIAN AYUNING UTAMI	1970-01-01 00:00:38.431	Jl. Sudirman No. 107	81234567953	livianayuningutami@cbt.com	AKTIF	2025-12-14 08:33:40.717	2025-12-14 08:33:40.717	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx1ex003i35ud2tmr6ezm	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1gj003l35udh98cts8w	94280655	LUCKY ADITYA PRATAMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 108	81234567954	luckyadityapratama@cbt.com	AKTIF	2025-12-14 08:33:40.77	2025-12-14 08:33:40.77	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx1gf003k35udqn4te1zt	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1ji003p35udxuz53ke6	3088988176	M. BAGAS SANTOSO	1970-01-01 00:00:38.431	Jl. Sudirman No. 110	81234567956	mbagassantoso@cbt.com	AKTIF	2025-12-14 08:33:40.878	2025-12-14 08:33:40.878	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx1je003o35udc4kp1c2m	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1l1003r35udz4zykbfo	3088352964	M. BAGUS SATRIO	1970-01-01 00:00:38.431	Jl. Sudirman No. 111	81234567957	mbagussatrio@cbt.com	AKTIF	2025-12-14 08:33:40.933	2025-12-14 08:33:40.933	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx1kx003q35udsvrwk0yg	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1mi003t35udec1w0c85	97802751	M. SAIFURROSI	1970-01-01 00:00:38.431	Jl. Sudirman No. 112	81234567958	example9@cbt.com	AKTIF	2025-12-14 08:33:40.986	2025-12-14 08:33:40.986	\N	cmj5eca0w0006jsud9bca11b3	cmj5gx1mf003s35udmkcekzi3	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1o2003v35udzn7dj9ls	93234409	M. YUSRON GINANDA	1970-01-01 00:00:38.431	Jl. Sudirman No. 113	81234567959	example18@cbt.com	AKTIF	2025-12-14 08:33:41.041	2025-12-14 08:33:41.041	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx1nx003u35udc8a2l13v	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1pk003x35udstmkp6g7	78252676	MARCEL GALIH GINANJAR	1970-01-01 00:00:38.431	Jl. Sudirman No. 114	81234567960	marcelgalihginanjar@cbt.com	AKTIF	2025-12-14 08:33:41.095	2025-12-14 08:33:41.095	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx1pg003w35ud8n0lxpp8	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1u3004335udkj267fhr	82560328	MOH. AMAR MA'RUF	1970-01-01 00:00:38.431	Jl. Sudirman No. 117	81234567963	example10000@example.com	AKTIF	2025-12-14 08:33:41.258	2025-12-14 08:33:41.258	\N	cmj5eca0w0006jsud9bca11b3	cmj5gx1tz004235udd1rv3ppx	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1vm004535udc4l2kzg5	94760422	MOH. BAYU AINURROHMAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 118	81234567964	mohbayuainurrohman@cbt.com	AKTIF	2025-12-14 08:33:41.314	2025-12-14 08:33:41.314	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx1vi004435ud0rdy53xd	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1x5004735udoeer6a1p	3093129285	MOH. RADITH MUSTOFA	1970-01-01 00:00:38.431	Jl. Sudirman No. 119	81234567965	example10@cbt.com	AKTIF	2025-12-14 08:33:41.368	2025-12-14 08:33:41.368	\N	cmj5eca0w0006jsud9bca11b3	cmj5gx1x1004635udvhadbran	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx206004b35uduf215trn	89145134	MUHAMAD RISKI NEO VALENTINO	1970-01-01 00:00:38.431	Jl. Sudirman No. 121	81234567967	example19@cbt.com	AKTIF	2025-12-14 08:33:41.477	2025-12-14 08:33:41.477	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx202004a35uditlzqygw	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx21o004d35udxjptvn08	119631620	MUHAMMAD RIZKI	1970-01-01 00:00:38.431	Jl. Sudirman No. 122	81234567968	example20@cbt.com	AKTIF	2025-12-14 08:33:41.532	2025-12-14 08:33:41.532	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx21k004c35udlo92ywg1	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx234004f35udt3s4ka40	101593710	MUHAMMAD ZAINAL ABIDIN	1970-01-01 00:00:38.431	Jl. Sudirman No. 123	81234567969	example11@cbt.com	AKTIF	2025-12-14 08:33:41.584	2025-12-14 08:33:41.584	\N	cmj5eca0w0006jsud9bca11b3	cmj5gx231004e35udeisgbcya	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx24m004h35udvyljawbl	83159381	NADIATUZZAHROH	1970-01-01 00:00:38.431	Jl. Sudirman No. 124	81234567970	nadiatuzzahroh@cbt.com	AKTIF	2025-12-14 08:33:41.637	2025-12-14 08:33:41.637	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx24i004g35udt6qrnb7l	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx264004j35ud8hnkcdnj	95829771	NAUFAL DZAKI HANIF ABIYYI	1970-01-01 00:00:38.431	Jl. Sudirman No. 125	81234567971	example21@cbt.com	AKTIF	2025-12-14 08:33:41.691	2025-12-14 08:33:41.691	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx260004i35udriuw72oc	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx27k004l35udp3ylddi4	74347595	NAYSILA NADINE CEYSEANA	1970-01-01 00:00:38.431	Jl. Sudirman No. 126	81234567972	naysilanadineceyseana@cbt.com	AKTIF	2025-12-14 08:33:41.744	2025-12-14 08:33:41.744	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx27h004k35udvdyo2fwy	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2ak004p35udjg0jhfie	79295893	NUKE KUSUMA WARDANI	1970-01-01 00:00:38.431	Jl. Sudirman No. 128	81234567974	nukekusumawardani@cbt.com	AKTIF	2025-12-14 08:33:41.852	2025-12-14 08:33:41.852	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx2ag004o35udqr0i50ow	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2c1004r35udtqywx9eq	78151631	NURHASAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 129	81234567975	example27@cbt.com	AKTIF	2025-12-14 08:33:41.905	2025-12-14 08:33:41.905	\N	cmj5ec9zf0000jsudgpxci2hf	cmj5gx2bx004q35udncso3x1e	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2dj004t35udiz37sd6e	65243793	PHILIPUS JAYA BALAN RAKASIWI	1970-01-01 00:00:38.431	Jl. Sudirman No. 130	81234567976	philipusjayabalanrakasiwi@cbt.com	AKTIF	2025-12-14 08:33:41.958	2025-12-14 08:33:41.958	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx2dg004s35udfhoy10rz	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2gi004x35ud0wei40by	81034228	RAVADAL ADHA	1970-01-01 00:00:38.431	Jl. Sudirman No. 132	81234567978	ravadaladha@cbt.com	AKTIF	2025-12-14 08:33:42.066	2025-12-14 08:33:42.066	\N	cmj5ec9zx0001jsud5cnf1k74	cmj5gx2gf004w35udlkyaly82	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2i0004z35udecgz1nlq	99114829	RAZKY GABRIL WAHYUDI	1970-01-01 00:00:38.431	Jl. Sudirman No. 133	81234567979	example22@cbt.com	AKTIF	2025-12-14 08:33:42.119	2025-12-14 08:33:42.119	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx2hw004y35udh3y17ie4	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2jh005135udtbcxbtb9	71528590	REZY ANGGARA BAHARI	1970-01-01 00:00:38.431	Jl. Sudirman No. 134	81234567980	rezyanggarabahari@cbt.com	AKTIF	2025-12-14 08:33:42.172	2025-12-14 08:33:42.172	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx2jd005035udyuohrs2j	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2kx005335udc4757qsp	98069279	RIDHO IRWANSYAH	1970-01-01 00:00:38.431	Jl. Sudirman No. 135	81234567981	ridhoirwansyah@cbt.com	AKTIF	2025-12-14 08:33:42.225	2025-12-14 08:33:42.225	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx2ku005235udqtgs17js	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2mh005535ud6oic8o1p	82598502	RIVA ADITYA PUTRA	1970-01-01 00:00:38.431	Jl. Sudirman No. 136	81234567982	rivaadityaputra@cbt.com	AKTIF	2025-12-14 08:33:42.28	2025-12-14 08:33:42.28	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx2mc005435udz2z1c0tg	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1yo004935ud3pslwtt1	78005721	MOHAMMAD ZIDAN MAULANA	1970-01-01 00:00:38.431	Jl. Sudirman No. 120	81234567966	mohammadzidanmaulana@cbt.com	AKTIF	2025-12-14 08:33:41.424	2025-12-16 12:32:56.951	\N	cmj5eca170008jsudb4r1h58n	cmj5gx1yk004835ud9hcuxcvr	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1i0003n35udv6gnc1l1	67491019	LUKMAN AFANDI	1970-01-01 00:00:38.431	Jl. Sudirman No. 109	81234567955	lukmanafandi@cbt.com	AKTIF	2025-12-14 08:33:40.824	2025-12-16 12:33:00.633	\N	cmj5eca170008jsudb4r1h58n	cmj5gx1hw003m35udhjaaqojj	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1sk004135udexpydl8s	29537229	MINEL ASARI	1970-01-01 00:00:38.431	Jl. Sudirman No. 116	81234567962	minelasari@cbt.com	AKTIF	2025-12-14 08:33:41.204	2025-12-16 12:33:37.138	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx1sg004035udzqsyoalc	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1r2003z35udbet34tx1	81962676	MAZELLO ITO AFRIANZIE	1970-01-01 00:00:38.431	Jl. Sudirman No. 115	81234567961	mazelloitoafrianzie@cbt.com	AKTIF	2025-12-14 08:33:41.15	2025-12-16 12:33:40.619	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx1qy003y35udt05qd1id	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx292004n35ud17iskv1j	89544490	NOUVAL YURI SAPUTRA	1970-01-01 00:00:38.431	Jl. Sudirman No. 127	81234567973	nouvalyurisaputra@cbt.com	AKTIF	2025-12-14 08:33:41.796	2025-12-16 12:32:51.295	\N	cmj5eca170008jsudb4r1h58n	cmj5gx28x004m35udws9r11al	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2ny005735udgqgfno56	109444333	RIZKY WIDODO	1970-01-01 00:00:38.431	Jl. Sudirman No. 137	81234567983	example23@cbt.com	AKTIF	2025-12-14 08:33:42.334	2025-12-14 08:33:42.334	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx2nv005635udhkikfx5c	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2qz005b35ud4370ott0	113396361	SUPRIYADI	1970-01-01 00:00:38.431	Jl. Sudirman No. 139	81234567985	example24@cbt.com	AKTIF	2025-12-14 08:33:42.443	2025-12-14 08:33:42.443	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx2qv005a35ud9ybz7pdt	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2sg005d35udvqbnlkoz	86217954	TESYA HERLIANA	1970-01-01 00:00:38.431	Jl. Sudirman No. 140	81234567986	tesyaherliana@cbt.com	AKTIF	2025-12-14 08:33:42.496	2025-12-14 08:33:42.496	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx2sd005c35udyl3o8dav	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2u0005f35udktuxz1uv	75001728	WISNU MAULANA	1970-01-01 00:00:38.431	Jl. Sudirman No. 141	81234567987	wisnumaulana@cbt.com	AKTIF	2025-12-14 08:33:42.551	2025-12-14 08:33:42.551	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx2tv005e35udpkauz4m3	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2vh005h35udn702xrb0	83757487	WULAN FEBRIYANTI	1970-01-01 00:00:38.431	Jl. Sudirman No. 142	81234567988	wulanfebriyanti@cbt.com	AKTIF	2025-12-14 08:33:42.605	2025-12-14 08:33:42.605	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx2vd005g35udsfcg75mb	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2zz005n35udbo6v7qv9	97561362	YUDA WIRASA	1970-01-01 00:00:38.431	Jl. Sudirman No. 145	81234567991	example28@cbt.com	AKTIF	2025-12-14 08:33:42.766	2025-12-14 08:33:42.766	\N	cmj5ec9zf0000jsudgpxci2hf	cmj5gx2zv005m35ud2aj2o8s7	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2yi005l35udcr748bi3	79467322	YOHANES DWI PRAYOGA	1970-01-01 00:00:38.431	Jl. Sudirman No. 144	81234567990	yohanesdwiprayoga@cbt.com	AKTIF	2025-12-14 08:33:42.713	2025-12-16 12:32:37.753	\N	cmj5eca170008jsudb4r1h58n	cmj5gx2ye005k35ud0lbk4bs6	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2ph005935udv1g8ipeb	77627927	SEPTIA IRFAN RAMADHAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 138	81234567984	septiairfanramadhan@cbt.com	AKTIF	2025-12-14 08:33:42.388	2025-12-16 12:32:41.218	\N	cmj5eca170008jsudb4r1h58n	cmj5gx2pd005835udp1ug0523	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2f2004v35udq20lwbo0	78440641	RAHMAD FIRMANSYAH	1970-01-01 00:00:38.431	Jl. Sudirman No. 131	81234567977	rahmadfirmansyah@cbt.com	AKTIF	2025-12-14 08:33:42.013	2025-12-16 12:32:46.386	\N	cmj5eca170008jsudb4r1h58n	cmj5gx2ey004u35udtxb4t3ri	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx1al003d35udbg9vhv2a	72745125	KHAIRUL RIZAL FAUZI TUKIMIN	1970-01-01 00:00:38.431	Jl. Sudirman No. 104	81234567950	khairulrizalfauzitukimin@cbt.com	AKTIF	2025-12-14 08:33:40.557	2025-12-16 12:33:03.952	\N	cmj5eca170008jsudb4r1h58n	cmj5gx1ai003c35udrndkgaz9	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gwzyc001l35udnzueuy9e	69853933	DANU BAGUS PRAYOGO	1970-01-01 00:00:38.431	Jl. Sudirman No. 72	81234567918	danubagusprayogo@cbt.com	AKTIF	2025-12-14 08:33:38.819	2025-12-16 12:33:07.513	\N	cmj5eca170008jsudb4r1h58n	cmj5gwzy7001k35udjqgqcye1	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx31i005p35ud17ebh91g	71347347	YULI YATIMAH	1970-01-01 00:00:38.431	Jl. Sudirman No. 146	81234567992	yuliyatimah@cbt.com	AKTIF	2025-12-14 08:33:42.821	2025-12-16 12:33:27.522	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx31d005o35udqv3tt8vd	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx2wz005j35ud2ivwa2j0	88579651	YEHEZKIEL KEVIN RAHARJO	1970-01-01 00:00:38.431	Jl. Sudirman No. 143	81234567989	yehezkielkevinraharjo@cbt.com	AKTIF	2025-12-14 08:33:42.658	2025-12-16 12:33:30.953	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx2ww005i35udmbp9bp8d	cmj5cxv7e00014iudyynxuvmc	\N
cmj5gx04g001t35udknq3yqoe	3093967437	DESY MUSTIKA MAYA SARI	1970-01-01 00:00:38.431	Jl. Sudirman No. 76	81234567922	desimustika@esgriba.com	AKTIF	2025-12-14 08:33:39.039	2025-12-22 11:46:56.003	\N	cmj5ec9zf0000jsudgpxci2hf	cmj5gx04c001s35udal7y6kqp	cmj5cxv7e00014iudyynxuvmc	\N
\.


--
-- Data for Name: SiswaKelasHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SiswaKelasHistory" (id, "siswaId", "kelasId", "tahunAjaranId", "tanggalMulai", "tanggalSelesai", status, catatan, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TahunAjaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TahunAjaran" (id, tahun, "tanggalMulai", "tanggalSelesai", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
38ba958f-eb02-4e45-90c5-779f301fc4f9	2024/2025	2024-07-01 00:00:00	2024-12-31 00:00:00	AKTIF	2025-12-30 07:52:56.287	2025-12-30 07:52:56.287	\N
cmj5cxv7e00014iudyynxuvmc	2025/2026	2025-12-16 00:00:00	2026-02-19 00:00:00	AKTIF	2025-12-14 06:42:20.858	2025-12-17 07:23:20.52	\N
\.


--
-- Data for Name: Tugas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tugas" (id, judul, deskripsi, instruksi, "mataPelajaranId", "guruId", "kelasId", deadline, "maxScore", "tipePenilaian", "allowLateSubmit", "isPublished", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: TugasAttachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TugasAttachment" (id, "tugasId", "namaFile", "ukuranFile", "tipeFile", "urlFile", "createdAt") FROM stdin;
\.


--
-- Data for Name: TugasSiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TugasSiswa" (id, "tugasId", "siswaId", status, "submittedAt", "gradedAt", konten, score, feedback, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TugasSiswaFile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TugasSiswaFile" (id, "tugasSiswaId", "namaFile", "ukuranFile", "tipeFile", "urlFile", "createdAt") FROM stdin;
\.


--
-- Data for Name: Ujian; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ujian" (id, kode, judul, deskripsi, "mataPelajaranId", "kelasId", durasi, "tanggalMulai", "tanggalSelesai", "nilaiMinimal", "acakSoal", "tampilkanNilai", status, "createdBy", "createdAt", "updatedAt", "deletedAt", "paketSoalId", "guruId", "deteksiKecurangan") FROM stdin;
\.


--
-- Data for Name: UjianKelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UjianKelas" (id, "ujianId", "kelasId", "createdAt") FROM stdin;
\.


--
-- Data for Name: UjianSiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UjianSiswa" (id, "ujianId", "siswaId", "tokenAkses", "waktuMulai", "waktuSelesai", durasi, status, "nilaiTotal", "isPassed", jawaban, "createdAt", "updatedAt", "manualGrades") FROM stdin;
\.


--
-- Data for Name: UjianSoal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UjianSoal" (id, "ujianId", "bankSoalId", "nomorUrut", bobot, "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name, "createdAt", "updatedAt", password, role) FROM stdin;
cmj5cw3cn00004iud971p5w0w	rizky@mail.com	Rizky	2025-12-14 06:40:58.103	2025-12-14 06:40:58.103	$2b$10$jYGpzfeTx.IJASjBGxrVE.tf4kuyrdQIV44CRGUcl3rqUQ2F3zQS2	ADMIN
cmj5gwyql000035udj9kefx0z	abihartowicaksono@cbt.com	ABI HARTO WICAKSONO	2025-12-14 08:33:37.245	2025-12-14 08:33:37.245	$2b$10$5Q7gCiV/cmiDE5o8keIP3O/uyLV3B4aKP8x1iOQNV14fFpJduqXTa	SISWA
cmj5gwysf000235udeqpf8mo9	adamsyahrezagumilang@cbt.com	ADAM SYAHREZA GUMILANG	2025-12-14 08:33:37.311	2025-12-14 08:33:37.311	$2b$10$/Sm6OIJrU9ieTWaMw9yBrOEl8fMLlOFSu3QfCGHSBjLuFZCd.h2MO	SISWA
cmj5gwytz000435ud3k5i6zne	aditiyarizkybayupradika@cbt.com	ADITIYA RIZKY BAYU PRADIKA	2025-12-14 08:33:37.367	2025-12-14 08:33:37.367	$2b$10$QU0HMFDX.FKwgGVz79Wz5.awxbG.TgoepLsRkYqUVFr/yMm5vCh/K	SISWA
cmj5gwyvj000635udzcqos5da	adityacaturprayogo@cbt.com	ADITYA CATUR PRAYOGO	2025-12-14 08:33:37.423	2025-12-14 08:33:37.423	$2b$10$HoWP0zUaDssknhWwopCUO.QkByAqgzf9yIX/KlOugebAbfOandkqq	SISWA
cmj5gwyx4000835udq2k2tbxp	example12@cbt.com	ADITYA DAMARA PUTRA KRISTIAWAN	2025-12-14 08:33:37.48	2025-12-14 08:33:37.48	$2b$10$e2DEjQBUOuPzLnJ0qHorR.N4wzOUyMkz4SLF36aUJTpUfOzThPbj.	SISWA
cmj5gwyyq000a35udwqnc8ohp	adrianodwipradhita@cbt.com	ADRIANO DWI PRADHITA	2025-12-14 08:33:37.538	2025-12-14 08:33:37.538	$2b$10$mEYbgViYbC9UjLlHcDHf2.LCtSviCMVWt8SByedsrRop.0Xmew/d.	SISWA
cmj5gwz0c000c35udn9g3zoan	agungtrisnadewi@cbt.com	AGUNG TRISNA DEWI	2025-12-14 08:33:37.596	2025-12-14 08:33:37.596	$2b$10$2b5zxWGhxAIK9Arue6427OkSZU3is6UO3XHuEFwujAXR/4lZOj7Fm	SISWA
cmj5gwz1y000e35udzacwpk0x	aguswiraadipurnomo@cbt.com	AGUS WIRA ADI PURNOMO	2025-12-14 08:33:37.654	2025-12-14 08:33:37.654	$2b$10$iA0ZQR0O2ou6i0h/8Uvwjug6oiax6kaoSlq.5tNIxbuRFD6hpF9t.	SISWA
cmj5gwz3i000g35udydzzmr53	example1@cbt.com	AHMAD DIMAS KURNIAWAN	2025-12-14 08:33:37.71	2025-12-14 08:33:37.71	$2b$10$G0nnig6veHoW2uamT0Ymie512Ddy7NSx0/mXVq8XkyQVlpLlrR10i	SISWA
cmj5gwz53000i35udw6fgqktc	ahmadrianzuhriafandi@cbt.com	AHMAD RIAN ZUHRI AFANDI	2025-12-14 08:33:37.767	2025-12-14 08:33:37.767	$2b$10$qZ0d2joT83a83Wtm8P6eruxx34oID1RPEcscB0iTPBh38zkm/g5yS	SISWA
cmj5gwz6p000k35ud68fsf33i	example2@cbt.com	AINO YOEL	2025-12-14 08:33:37.825	2025-12-14 08:33:37.825	$2b$10$o7MJEfM5PhZvP3CYGi/pVOGoVIc5kWzLrfdwniiKjDWaQEuPi/d8y	SISWA
cmj5gwz88000m35ud5x4ctx7s	ainurrohmah@cbt.com	AINUR ROHMAH	2025-12-14 08:33:37.88	2025-12-14 08:33:37.88	$2b$10$yLDOyWQ0K9.jkzeJ67liu.6FhlSzyY4ePVAtL12xr9/2K6AUNYu82	SISWA
cmj5gwz9q000o35ud7f7d7ltw	aldiprayatna@cbt.com	ALDI PRAYATNA	2025-12-14 08:33:37.934	2025-12-14 08:33:37.934	$2b$10$NIPFvEd/wlOFP0ex3Aj3tujQxV5A2Vw2o2cFXVJhcxUi5QOuOATS.	SISWA
cmj5gwzb9000q35uds8mmj6bl	aldoilfanpratama@cbt.com	ALDO ILFAN PRATAMA	2025-12-14 08:33:37.989	2025-12-14 08:33:37.989	$2b$10$sVsk69s8ge38pHvyYTQrUOEKQ7uN5XTR/3NN5ak4AHybO/dwxprKm	SISWA
cmj5gwzct000s35udllh69h8u	alfatriefendi@cbt.com	ALFA TRI EFENDI	2025-12-14 08:33:38.045	2025-12-14 08:33:38.045	$2b$10$zdiROYH4yUho1R/7imiaHOR9ehhMtQ/a9dH4/4SBgFRZGnqa52dzG	SISWA
cmj5gwzed000u35udlnddwq47	example13@cbt.com	ALFAZA OKTAVINO PRADITIA	2025-12-14 08:33:38.101	2025-12-14 08:33:38.101	$2b$10$7g2C1XGdos1wVaUCCwIii.yKz2d2EAMQb0BdpMblQgwWPBz98Y3Gq	SISWA
cmj5gwzfw000w35udzc26ap9b	alifaturrosikin@cbt.com	ALIFATUR ROSIKIN	2025-12-14 08:33:38.156	2025-12-14 08:33:38.156	$2b$10$UeBkuTY2kaZg7J9UJcCvoOOE8A/wCaEocb.fcvpABsgs.ygG//aUu	SISWA
cmj5gwzhe000y35udg8o4lrsn	ameliadewisinta@cbt.com	AMELIA DEWI SINTA	2025-12-14 08:33:38.21	2025-12-14 08:33:38.21	$2b$10$eNxyiUR7S3f4WtM/ABO.hePWuaOiP1X72yskw/qyWZvK0Ee9C7h0e	SISWA
cmj5gwziy001035udhbgntn1o	example3@cbt.com	ANANDA MAYCKO WIJAYA	2025-12-14 08:33:38.266	2025-12-14 08:33:38.266	$2b$10$MYx8nhclCk67gfBT8ZUJGerRFwxXJ1ixtYzB88R.IbFSvcWmjPBiS	SISWA
cmj5gwzkg001235uda1zowq2b	andhikabayusaputra@cbt.com	ANDHIKA BAYU SAPUTRA	2025-12-14 08:33:38.32	2025-12-14 08:33:38.32	$2b$10$zX8SqUy76c/M68Jqvm87e.oMvj2fSea5vqHIekMDuZ3LbrpteVCbW	SISWA
cmj5gwzlz001435udoar1p1ou	example4@cbt.com	ANGGA CAHYO PRATAMA	2025-12-14 08:33:38.375	2025-12-14 08:33:38.375	$2b$10$gkigz7.ZwvNxDfWJq2tlj.P7pYHj2tdFO.53./zHde097gFqqIIBi	SISWA
cmj5gwzni001635udt2intkub	anggivirnandaputri@cbt.com	ANGGI VIRNANDA PUTRI	2025-12-14 08:33:38.43	2025-12-14 08:33:38.43	$2b$10$o9i2prpTY.dnXWu1ygFZrObK4x4blfSvG2gtgk/t.UuDixr3MkM4u	SISWA
cmj5gwzp2001835udtswr5q1s	awangsetiawan@cbt.com	AWANG SETIAWAN	2025-12-14 08:33:38.486	2025-12-14 08:33:38.486	$2b$10$Dd4dvJtA2.dKgDAog2sMue17h/zkuWD/l1dgQ2nkeQZG.eXqtGZx6	SISWA
cmj5gwzql001a35udfoqzqfcv	example25@cbt.com	AYUNI ARIMBI	2025-12-14 08:33:38.541	2025-12-14 08:33:38.541	$2b$10$bWEqVSCm3XQi9HDhb3bn4uqfQZJz6BFMILYwxaEZe8f6LsAK5eb6u	SISWA
cmj5gwzs4001c35udaqgx22e1	example5@cbt.com	AZAI DENIS SAFARULLAH	2025-12-14 08:33:38.595	2025-12-14 08:33:38.595	$2b$10$8tlweExCNOq5bqKIz16v/uweuUTsCvsXRQcpob51dNx9ed.48puSC	SISWA
cmj5gwztn001e35udd3b8c4mg	example14@cbt.com	BADRIA NUR ANISA	2025-12-14 08:33:38.651	2025-12-14 08:33:38.651	$2b$10$5Llm6n1OEzmLVIUF3YoIIeQ2JYfpZlnhfbu60zfR2tcdZ4hn9kkNq	SISWA
cmj5gwzv5001g35ud5bbn2qzz	bagussetiawan@cbt.com	BAGUS SETIAWAN	2025-12-14 08:33:38.705	2025-12-14 08:33:38.705	$2b$10$KKhYJEACdJ2M2er5QJE7T.JKPBKmvV6KBlVcpmoyP8kIFBcwIxE9C	SISWA
cmj5gwzwo001i35uduhbzcboi	example6@cbt.com	CANDRA PRATAMA	2025-12-14 08:33:38.76	2025-12-14 08:33:38.76	$2b$10$31QCDyTLa5GrNMUVuP/UF.LxYqke8GbKRM44Lb7z./pmbBy8FUQ66	SISWA
cmj5gwzy7001k35udjqgqcye1	danubagusprayogo@cbt.com	DANU BAGUS PRAYOGO	2025-12-14 08:33:38.815	2025-12-14 08:33:38.815	$2b$10$gIukZJLlI3dmIimx.J7QU.OLO.7t3SQNAKSWfhAcDAeUWEGVoa8uO	SISWA
cmj5gwzzr001m35udpblpr5c0	davaputraprasetya@cbt.com	DAVA PUTRA PRASETYA	2025-12-14 08:33:38.871	2025-12-14 08:33:38.871	$2b$10$qh5M4U1WeNtmQ86yvJbk7eCOiMsrfcLduBCgyT7mpIT/vInmGUtU2	SISWA
cmj5gx01a001o35udcz1uye9r	definingtyas@cbt.com	DEFI NINGTYAS	2025-12-14 08:33:38.926	2025-12-14 08:33:38.926	$2b$10$QvqW3hyijv6G4lX5Tko1a.RYB49oEyz2oUB.YA/TrYJe9xT.SkgQm	SISWA
cmj5gx02s001q35udsc32mvtz	dendibayupratama@cbt.com	DENDI BAYU PRATAMA	2025-12-14 08:33:38.98	2025-12-14 08:33:38.98	$2b$10$2dqNuMhEz8Db286yFTgC5.4YFTEBXQNxeZKKfTzdB3hWZTZSGBuN.	SISWA
cmj5gx05t001u35ud56w1gpg0	dewiwahyuni@cbt.com	DEWI WAHYUNI	2025-12-14 08:33:39.089	2025-12-14 08:33:39.089	$2b$10$TmPC2a4wfh18AxF58kqaAe/XJHtTO4oq9AEM9gvo8dcblKKMOcbiG	SISWA
cmj5gx07b001w35ud6uy774vt	dinarizaayumatussholeha@cbt.com	DINA RIZA AYU MATUSSHOLEHA	2025-12-14 08:33:39.143	2025-12-14 08:33:39.143	$2b$10$N9CmxnGuK.o.mrQI64mixuWu7ICbZaMv4YK8I7ExYgrQGHnWruzJu	SISWA
cmj5gx08u001y35udh95b095v	dinoabipratama@cbt.com	DINO ABI PRATAMA	2025-12-14 08:33:39.198	2025-12-14 08:33:39.198	$2b$10$h5YihryfOT0xv40z4Ti27eQRdk04gfJ3qm78v7tjWQUC52ud4z9Y.	SISWA
cmj5gx0ac002035udfnj8z7vm	dizayogayudistia@cbt.com	DIZA YOGA YUDISTIA	2025-12-14 08:33:39.252	2025-12-14 08:33:39.252	$2b$10$HrD9T8JdIAoDtzEGJcYfWemjQZ3HSb.UzjaXo8cfgNRTYS5Moz/pu	SISWA
cmj5gx0bv002235ud9wy5giy5	example15@cbt.com	DWI AYU MEI JAYANTI	2025-12-14 08:33:39.307	2025-12-14 08:33:39.307	$2b$10$kQc9TPW0d7vDv4Srm.BkfePozlHyyR.aGBEQALuitUGL.n4KGub0O	SISWA
cmj5gx0de002435ud24zdsw0s	dwisintiaputri@cbt.com	DWI SINTIA PUTRI	2025-12-14 08:33:39.362	2025-12-14 08:33:39.362	$2b$10$tO1CLLaMLbV2bdXILmNkNu4hWhk1zU207CacVStE0Lq/zGuLtGxrO	SISWA
cmj5gx0ev002635udvv65yg6g	ekadeviainurohma@cbt.com	EKA DEVI AINUROHMA	2025-12-14 08:33:39.415	2025-12-14 08:33:39.415	$2b$10$8hsHdRGP7WMdt.gnP2FSNeX85PMAp0TShPGJuqlFDT9TjowA/v24m	SISWA
cmj5gx0gd002835udbw0sqmi6	enggardwiprasetyo@cbt.com	ENGGAR DWI PRASETYO	2025-12-14 08:33:39.469	2025-12-14 08:33:39.469	$2b$10$ubzOUtFm5jvR3fsiPz13Yu4TQl.WR89LrTSA32wcyrICswbv/uAIW	SISWA
cmj5gx0hw002a35udavq9oyfo	esaagilputra@cbt.com	ESA AGIL PUTRA	2025-12-14 08:33:39.524	2025-12-14 08:33:39.524	$2b$10$OZMrXJv03UocRK1Rkw5HZOl1tpW9E4EMB7IyWURaAB3L6t4ag7zs2	SISWA
cmj5gx0jf002c35udq9gtxbg2	fahmiadliyanto@cbt.com	FAHMI ADLIYANTO	2025-12-14 08:33:39.579	2025-12-14 08:33:39.579	$2b$10$Yo2M7biLLoCR6.rzzVtT6ej.7dBnWQzb7B9o3GRhYPXGV4AkEJCXW	SISWA
cmj5gx0kw002e35ud03ae2xo1	fareladityaputra@cbt.com	FAREL ADITYA PUTRA	2025-12-14 08:33:39.632	2025-12-14 08:33:39.632	$2b$10$WoYFgE1Pds8tbQ54nMqCnOGDL.2LpBGJ/6LRFYTn0wq3FSVRkXx.S	SISWA
cmj5gx0mf002g35udp7fvgdod	faturrohman@cbt.com	FATURROHMAN	2025-12-14 08:33:39.687	2025-12-14 08:33:39.687	$2b$10$mldB2VE9.qQ.mG00C2ztQuY.DyqShydxESrwT0vcYKByO8MigmuBy	SISWA
cmj5gx0nz002i35udbi0v5c4g	example16@cbt.com	FERDIO PUTRA PRASETYA	2025-12-14 08:33:39.743	2025-12-14 08:33:39.743	$2b$10$yCXsjoQ4JFhCjkZq5TZYbe8pOX51sxaCAGkfbr9SeoS8kpKJfbd/G	SISWA
cmj5gx0pi002k35udwebdytrh	fiolaseptianaramadani@cbt.com	FIOLA SEPTIANA RAMADANI	2025-12-14 08:33:39.798	2025-12-14 08:33:39.798	$2b$10$ZWz5tUjK07/tMIraoICc9ex6iFfEQ6yD/sH4Nkl4Fs4Q3JnP9X8qO	SISWA
cmj5gx0r0002m35udzu8e92kf	fiqiaditia@cbt.com	FIQI ADITIA	2025-12-14 08:33:39.852	2025-12-14 08:33:39.852	$2b$10$TXMxkufQzu.srwB1WyJvPuq5egxFcjtObm7520ddY8YdK9uqgStcq	SISWA
cmj5gx0si002o35ud2jnff2tj	fitrianaekaamelia@cbt.com	FITRIANA EKA AMELIA	2025-12-14 08:33:39.906	2025-12-14 08:33:39.906	$2b$10$ghsNSpYjxMV//x.5AVleSuNPJisSHQ.TEyX7J5G8qrgS9dRq5SZHW	SISWA
cmj5gx0tz002q35udykvj7rwf	hernandawildanfirdausi@cbt.com	HERNANDA WILDAN FIRDAUSI	2025-12-14 08:33:39.959	2025-12-14 08:33:39.959	$2b$10$Dcpmm3NTQ2Tfi6.COAhcjeGAuySHCrPnmTC2cq5zEwEch0w0Nbxc.	SISWA
cmj5gx0vh002s35udu1n8yl9k	example7@cbt.com	HUMAM FAUZI YANTO	2025-12-14 08:33:40.013	2025-12-14 08:33:40.013	$2b$10$r8qqYovHDfi8YxylzDBFburR934QAnXHppsFB8b/wDI5c5jSntDfO	SISWA
cmj5gx0x0002u35udc7ccpufd	ichajuwita@cbt.com	ICHA JUWITA	2025-12-14 08:33:40.068	2025-12-14 08:33:40.068	$2b$10$LyMfvfdzS3BY6JzzvYKL..jNr65MkT3CHst0TVZqpLeeBzcZ78z0K	SISWA
cmj5gx0yj002w35ud8v9qi589	inaazrianadevi@cbt.com	INA AZRIANA DEVI	2025-12-14 08:33:40.123	2025-12-14 08:33:40.123	$2b$10$uffZ51BM366x9JqaQWdpweTJiDoP7sgUla./YPw9aNv/jc.m7o3zG	SISWA
cmj5gx100002y35udilmg1ny8	intanbalqishumairo@cbt.com	INTAN BALQIS HUMAIRO	2025-12-14 08:33:40.176	2025-12-14 08:33:40.176	$2b$10$yRtmXtim8gtUMySIb0ltSu2x0xoP6XS9xiSA2zRytbe/.Gi9vIoFu	SISWA
cmj5gx11g003035ud3bx82k5d	jeniekanursabela@cbt.com	JENI EKA NURSABELA	2025-12-14 08:33:40.228	2025-12-14 08:33:40.228	$2b$10$g5xiOdWBYgyqedNbglhyMejmMoAHsWmfJlgmUW8r4z4JVGbvQxLa2	SISWA
cmj5gx12x003235udw6jxtx4r	jesenardiyanto@cbt.com	JESEN ARDIYANTO	2025-12-14 08:33:40.281	2025-12-14 08:33:40.281	$2b$10$L1KLICXq3ZaDTkBO17rOwerxL/PjdMPTjMp42BhVqZF/a.Km.0hTe	SISWA
cmj5gx14g003435ud6w8b4goi	jesikamartaal-zahra@cbt.com	JESIKA MARTA AL-ZAHRA	2025-12-14 08:33:40.336	2025-12-14 08:33:40.336	$2b$10$7qMEekHNAjTJJ499/hp6/uPCKwIZdyJk6d4kRA98hPZKPn7cVHG1.	SISWA
cmj5gx15y003635udfzfvsnsn	joshuabagusnugroho@cbt.com	JOSHUA BAGUS NUGROHO	2025-12-14 08:33:40.39	2025-12-14 08:33:40.39	$2b$10$cLd/Y6zZfpioG8.JQK7P9emrgU9cIWr2KW3ZeN/94GlMT88mzgZRW	SISWA
cmj5gx17g003835uduzmy772u	example17@cbt.com	KETUT DIMAS MUHAMAD RISAL	2025-12-14 08:33:40.444	2025-12-14 08:33:40.444	$2b$10$T0ukWPdR.809ccNV/5m7KO6LM1A1k2i/BIFrq/FyYiHSlt01yFz4u	SISWA
cmj5gx18z003a35udlra3qj4l	example8@cbt.com	KEVIN MAULANA ISHAQ	2025-12-14 08:33:40.499	2025-12-14 08:33:40.499	$2b$10$uBEpt3H35gGkW.hQxwpiZeswyIfQjNzWdtE70xDWtyxhNc.yyn8q.	SISWA
cmj5gx1ai003c35udrndkgaz9	khairulrizalfauzitukimin@cbt.com	KHAIRUL RIZAL FAUZI TUKIMIN	2025-12-14 08:33:40.554	2025-12-14 08:33:40.554	$2b$10$N3N1Xsj3jQwTlz8j30D1uuyds7TGWMKmeXS04/goiUk4sHQEilYUC	SISWA
cmj5gx1bz003e35udkcmtj455	khaludsaifulanwar@cbt.com	KHALUD SAIFUL ANWAR	2025-12-14 08:33:40.607	2025-12-14 08:33:40.607	$2b$10$pp2Q.A9uhWotYBb5Bl.bsOsajyaEwWjvt8kcPGdxQizPmthMo4aty	SISWA
cmj5gx1dg003g35udnuykpero	lianarantikaputri@cbt.com	LIANA RANTIKA PUTRI	2025-12-14 08:33:40.66	2025-12-14 08:33:40.66	$2b$10$omtSpijg6/nqL.QV0F7bMOuhnKswBMwxk5flJb9Hh8/ov27Nya.d.	SISWA
cmj5gx1ex003i35ud2tmr6ezm	livianayuningutami@cbt.com	LIVIAN AYUNING UTAMI	2025-12-14 08:33:40.713	2025-12-14 08:33:40.713	$2b$10$VLV5/X./8D.qHmC8R04oA.00/ROJj6octo7Iavzq5kph14.jNlzOK	SISWA
cmj5gx1gf003k35udqn4te1zt	luckyadityapratama@cbt.com	LUCKY ADITYA PRATAMA	2025-12-14 08:33:40.767	2025-12-14 08:33:40.767	$2b$10$uAWsVU.zHR6xaCeLnJL71Oa4yr9RW1o.KgHZX21nOMC8bA6LsZwDK	SISWA
cmj5gx1hw003m35udhjaaqojj	lukmanafandi@cbt.com	LUKMAN AFANDI	2025-12-14 08:33:40.82	2025-12-14 08:33:40.82	$2b$10$NXpY4ciXWh/zTT4a2MUikOOK3sIqZy0J5IvBhcsgghc7tAr099UhS	SISWA
cmj5gx1je003o35udc4kp1c2m	mbagassantoso@cbt.com	M. BAGAS SANTOSO	2025-12-14 08:33:40.874	2025-12-14 08:33:40.874	$2b$10$w1M8IJqZarK/H4cTgWOKrep/vxu/uu5EE8s0/u52KdZMswpW16AOS	SISWA
cmj5gx1kx003q35udsvrwk0yg	mbagussatrio@cbt.com	M. BAGUS SATRIO	2025-12-14 08:33:40.929	2025-12-14 08:33:40.929	$2b$10$.ejnfg5wFafLZs./iiALheXJWajy4.TTc2ck6QEIryBZikG9XgYga	SISWA
cmj5gx1mf003s35udmkcekzi3	example9@cbt.com	M. SAIFURROSI	2025-12-14 08:33:40.983	2025-12-14 08:33:40.983	$2b$10$jb3UgkRydpRrwD2XyxSjseIGRZkQAhnEvvd4PIIJZBacStlrhKPly	SISWA
cmj5gx1nx003u35udc8a2l13v	example18@cbt.com	M. YUSRON GINANDA	2025-12-14 08:33:41.037	2025-12-14 08:33:41.037	$2b$10$FIkX1Np6aCMbuZ2ah6gFwea8T.T7OPSTLoOPvpXzQWvdGyvEcg21S	SISWA
cmj5gx1pg003w35ud8n0lxpp8	marcelgalihginanjar@cbt.com	MARCEL GALIH GINANJAR	2025-12-14 08:33:41.092	2025-12-14 08:33:41.092	$2b$10$t7ldjM39sSAPx0NtzxTDquA4uWING8BwJXs2H8zbIv9Z09PBGiWh6	SISWA
cmj5gx1qy003y35udt05qd1id	mazelloitoafrianzie@cbt.com	MAZELLO ITO AFRIANZIE	2025-12-14 08:33:41.146	2025-12-14 08:33:41.146	$2b$10$lsg2kiPtwpWxWJJ0zCRJq.wvTyCt8xlX1wgrmOSMDEKVdG6vZ4qui	SISWA
cmj5gx1sg004035udzqsyoalc	minelasari@cbt.com	MINEL ASARI	2025-12-14 08:33:41.2	2025-12-14 08:33:41.2	$2b$10$5LtAmaVu6JpetOQa5/KiPOG7jTRI8mGZcYURL7pGcYSotqyAPIOQa	SISWA
cmj5gx1tz004235udd1rv3ppx	example10000@example.com	MOH. AMAR MA'RUF	2025-12-14 08:33:41.255	2025-12-14 08:33:41.255	$2b$10$XZMxr6ZQsd2FROhu0Kt0gOwqDVmvEGW0wO7E1y4EDAhV6.kUiPvOG	SISWA
cmj5gx1vi004435ud0rdy53xd	mohbayuainurrohman@cbt.com	MOH. BAYU AINURROHMAN	2025-12-14 08:33:41.31	2025-12-14 08:33:41.31	$2b$10$CuJYnK2cWUKcTofGa.DKjeDmVs5q7zxX.HM3ekQlXS064YDJpXCTq	SISWA
cmj5gx1x1004635udvhadbran	example10@cbt.com	MOH. RADITH MUSTOFA	2025-12-14 08:33:41.365	2025-12-14 08:33:41.365	$2b$10$TpsDqHe1q8NOfcmUUzn8UuEmRrdrpTBuMyRMfGNJvysBQ.F3DBIAK	SISWA
cmj5gx1yk004835ud9hcuxcvr	mohammadzidanmaulana@cbt.com	MOHAMMAD ZIDAN MAULANA	2025-12-14 08:33:41.42	2025-12-14 08:33:41.42	$2b$10$iQUGDy82Y/9HoevToUKDFeQ1IjjYmfDKTk0oq86dmJPqngA5l5EoO	SISWA
cmj5gx202004a35uditlzqygw	example19@cbt.com	MUHAMAD RISKI NEO VALENTINO	2025-12-14 08:33:41.474	2025-12-14 08:33:41.474	$2b$10$juj.bqsJNM7RIt1/WzjliOvyTZkS7.JpzbnhmXMfUfWPKz3GY1/X.	SISWA
cmj5gx21k004c35udlo92ywg1	example20@cbt.com	MUHAMMAD RIZKI	2025-12-14 08:33:41.528	2025-12-14 08:33:41.528	$2b$10$pQIKslwrgauDB.wIrz8Q/.7WkZirqlH/LoeMhvxQN6ySt8/F1m66a	SISWA
cmj5gx231004e35udeisgbcya	example11@cbt.com	MUHAMMAD ZAINAL ABIDIN	2025-12-14 08:33:41.581	2025-12-14 08:33:41.581	$2b$10$z5OD4jHLPKfZI1fEgTDskebpK4qF5FVJ833sWNlK/Zz1TzK2NN6g2	SISWA
cmj5gx24i004g35udt6qrnb7l	nadiatuzzahroh@cbt.com	NADIATUZZAHROH	2025-12-14 08:33:41.634	2025-12-14 08:33:41.634	$2b$10$IX/Bgj/B.XProOgGnL34aeIzBSYpF1CXGPa9aMWoysEg0bP7Swawu	SISWA
cmj5gx260004i35udriuw72oc	example21@cbt.com	NAUFAL DZAKI HANIF ABIYYI	2025-12-14 08:33:41.688	2025-12-14 08:33:41.688	$2b$10$LrNJSdRflPXfcHLqm6bDqe8.ktS4DCp3oqjHvGtUVLHNBEXHc7Gti	SISWA
cmj5gx27h004k35udvdyo2fwy	naysilanadineceyseana@cbt.com	NAYSILA NADINE CEYSEANA	2025-12-14 08:33:41.741	2025-12-14 08:33:41.741	$2b$10$nmv.pU4DbB48VDjsBn46l.1DDdJjBYX3Q3ETWvlLipyvL8euqaXOy	SISWA
cmj5gx28x004m35udws9r11al	nouvalyurisaputra@cbt.com	NOUVAL YURI SAPUTRA	2025-12-14 08:33:41.793	2025-12-14 08:33:41.793	$2b$10$F4qE08pklQZztYE92r9Xxuk2znLAAX1.b/VUIH2clsxB31iF9/Pta	SISWA
cmj5gx2ag004o35udqr0i50ow	nukekusumawardani@cbt.com	NUKE KUSUMA WARDANI	2025-12-14 08:33:41.848	2025-12-14 08:33:41.848	$2b$10$H11ia2GrN8hNWVkJ/cGigu/RHFh.PH6z.7qFfE5SzRinEAjcbZyk2	SISWA
cmj5gx2bx004q35udncso3x1e	example27@cbt.com	NURHASAN	2025-12-14 08:33:41.901	2025-12-14 08:33:41.901	$2b$10$yWbwzV5pZh2VY5cNKmi8yODVdu2UWKzKRO/JiIaEMtLNs5z9h6jt2	SISWA
cmj5gx2dg004s35udfhoy10rz	philipusjayabalanrakasiwi@cbt.com	PHILIPUS JAYA BALAN RAKASIWI	2025-12-14 08:33:41.956	2025-12-14 08:33:41.956	$2b$10$rakNiN2VvDPskNw1eZ3wVOlUemfSd3csLPrTv5/iQZEGc0K8J97mi	SISWA
cmj5gx2ey004u35udtxb4t3ri	rahmadfirmansyah@cbt.com	RAHMAD FIRMANSYAH	2025-12-14 08:33:42.01	2025-12-14 08:33:42.01	$2b$10$gIqO.dpbA2srgntpay6z6uguqeAP3dqYR30B6Sygzvwm2SYbovk4W	SISWA
cmj5gx2gf004w35udlkyaly82	ravadaladha@cbt.com	RAVADAL ADHA	2025-12-14 08:33:42.063	2025-12-14 08:33:42.063	$2b$10$XV.Pzyw1nc.rYSWR6ZOxMeRjk9av1CR3Q7xEhODf6S6kmz0M.m0rO	SISWA
cmj5gx2hw004y35udh3y17ie4	example22@cbt.com	RAZKY GABRIL WAHYUDI	2025-12-14 08:33:42.116	2025-12-14 08:33:42.116	$2b$10$5.cyobUBdBAoDYyWsmC.su7bF/5/B8l3kjfQkCOn3LxIxCi28TbOe	SISWA
cmj5gx2jd005035udyuohrs2j	rezyanggarabahari@cbt.com	REZY ANGGARA BAHARI	2025-12-14 08:33:42.169	2025-12-14 08:33:42.169	$2b$10$Zxa2anNIEPVLnwCXwkusceo2RZ3mMPIKIx3VHs1ethbRuC283r32q	SISWA
cmj5gx2ku005235udqtgs17js	ridhoirwansyah@cbt.com	RIDHO IRWANSYAH	2025-12-14 08:33:42.222	2025-12-14 08:33:42.222	$2b$10$2PTMmvSYZyB9aB0uVdQV8OgEg/6xEeHAEZr2B0ZZwrmRCKGe5AZHW	SISWA
cmj5gx2mc005435udz2z1c0tg	rivaadityaputra@cbt.com	RIVA ADITYA PUTRA	2025-12-14 08:33:42.276	2025-12-14 08:33:42.276	$2b$10$a2AJfW7d4.WgMCjnMmoQN.3GaQ6SEeR8rnVLHPfauITNrmUnqNDNq	SISWA
cmj5gx2nv005635udhkikfx5c	example23@cbt.com	RIZKY WIDODO	2025-12-14 08:33:42.331	2025-12-14 08:33:42.331	$2b$10$DpBpWS3yWRWwolk79ju9aeBvEq5pwx38GPzCyAG3e3Jvt1YnYsTle	SISWA
cmj5gx2pd005835udp1ug0523	septiairfanramadhan@cbt.com	SEPTIA IRFAN RAMADHAN	2025-12-14 08:33:42.385	2025-12-14 08:33:42.385	$2b$10$fgb96s7bHiJBUAOiPAsGyOdzHP3WRL1BQ3NURlOlnW9QrsxqaxHsm	SISWA
cmj5gx2qv005a35ud9ybz7pdt	example24@cbt.com	SUPRIYADI	2025-12-14 08:33:42.439	2025-12-14 08:33:42.439	$2b$10$/fHPGgD5ArqnFXg17lk7lOAPV5ArYq5bS0C0GQx8uJH/QMHNlarAG	SISWA
cmj5gx2sd005c35udyl3o8dav	tesyaherliana@cbt.com	TESYA HERLIANA	2025-12-14 08:33:42.493	2025-12-14 08:33:42.493	$2b$10$XvMktoAKg7/oG.txjwJOxOn1jnZbTvuxIwBo8.qhTCoPvVfW/sSjm	SISWA
cmj5gx2tv005e35udpkauz4m3	wisnumaulana@cbt.com	WISNU MAULANA	2025-12-14 08:33:42.547	2025-12-14 08:33:42.547	$2b$10$plpLK1tpmf./clc4mPg6DuUn0AqoYQjGa3eeAPRwbylsquFw7EGpi	SISWA
cmj5gx2vd005g35udsfcg75mb	wulanfebriyanti@cbt.com	WULAN FEBRIYANTI	2025-12-14 08:33:42.601	2025-12-14 08:33:42.601	$2b$10$qJY6kQrkji64LTqKXhlk5u3s2tl2Sr13cxIb82UeFEOu0iObWx2Ea	SISWA
cmj5gx2ww005i35udmbp9bp8d	yehezkielkevinraharjo@cbt.com	YEHEZKIEL KEVIN RAHARJO	2025-12-14 08:33:42.656	2025-12-14 08:33:42.656	$2b$10$8gdTpZSudlezzOgVk2GLZO7c97Puq3X2FICuk5P08uOdupVqbM6/i	SISWA
cmj5gx2ye005k35ud0lbk4bs6	yohanesdwiprayoga@cbt.com	YOHANES DWI PRAYOGA	2025-12-14 08:33:42.71	2025-12-14 08:33:42.71	$2b$10$f5ECPVBxrDThgEuRQm7tLeKYyTISCXKsj6CM6Kn1o3a45HNFTggCW	SISWA
cmj5gx2zv005m35ud2aj2o8s7	example28@cbt.com	YUDA WIRASA	2025-12-14 08:33:42.763	2025-12-14 08:33:42.763	$2b$10$kimndO4msuJnUkkv4BoNDuGNABfPBrpZwz5707TApwOzvbgTs92em	SISWA
cmj5gx31d005o35udqv3tt8vd	yuliyatimah@cbt.com	YULI YATIMAH	2025-12-14 08:33:42.817	2025-12-15 09:13:52.78	$2b$10$FIJQKJNU8kn4aaD0mXT7WuT/yPTaLglP6BoZspMgbkYB1wjgNa0ya	SISWA
cmj8hh49m0000oaudjfiw6g8c	petugasabsensi@mail.com	Hari	2025-12-16 11:12:36.058	2025-12-16 11:12:36.058	$2b$10$h24kCkRAeGrmZHveE0r19.dhXDmhVVHcbU7aTifSmWP3jK7rAbCAa	PETUGAS_ABSENSI
cmj9z8xto00215dudxiyqcr71	ainiabdcholis.73@gmail.com	Aini Abdul Cholis S.Pd.	2025-12-17 12:17:53.724	2025-12-17 12:17:53.724	$2b$10$8d5eRQzqyaHxvTqdaZ0Xb.KMA9t1CccY0MokoaaCeQDO4JUonsm5u	GURU
cmj9z8xvb00235dudd4xbolii	drasuburhindartin@gmail.com	Dra. Subur Hindartin	2025-12-17 12:17:53.783	2025-12-17 12:17:53.783	$2b$10$zK5uU3Xgn/ac3yU6KKx1a.8rpjn4D1WG.Ou1Tgucb5L4XQR1izT3C	GURU
cmj9z8xws00255dudbgtsplon	yudiaster1922@gmail.com	Dwi Wahyudi, S.T,	2025-12-17 12:17:53.836	2025-12-17 12:17:53.836	$2b$10$YyJs1CrLRs5.2T8BUluBOe7Tj.wvxs2pLYSiyATFXmSTzXj.yGzVe	GURU
cmj9z8xy800275dudsv8ypuim	erlinnoviadiana@gmail.com	Erlin Novia Diana, S.E.	2025-12-17 12:17:53.888	2025-12-17 12:17:53.888	$2b$10$/waGiSyB0t9vwLueL9NmFOC0JGkWUtsttc/SQu1V/ASD5ov8y2b3O	GURU
cmj9z8xzp00295dudiet5g8kd	feramegaharistiana@gmail.com	Fera Mega Haristina, S.Tr.Kom.	2025-12-17 12:17:53.941	2025-12-17 12:17:53.941	$2b$10$O2yNs147SaOWSNADTQw.cOU9NgObwsUIzUy8QqGMZz7zHvAQx1S.q	GURU
cmj9z8y16002b5dudps21lpfm	franceskoyen16@gmail.com	Frances Laurence Setyo Budi, S.Pd.	2025-12-17 12:17:53.994	2025-12-17 12:17:53.994	$2b$10$qTxhgk048vaLAkehVRUGD.gFHI3grpRamVmY4t0uwscnDAUHl9sWW	GURU
cmj9z8y2n002d5dudjgj6nzx4	imtianateguh@gmail.com	Imtiana, S.Pd	2025-12-17 12:17:54.047	2025-12-17 12:17:54.047	$2b$10$YAm0kXZlWHCC31rxS2iAL.aNaX6lrF2E56eA5JGY9PClZApF2PX6G	GURU
cmj9z8y44002f5dudfvho6nza	faizabrahammalik@gmail.com	M. Fais Jainuddin, S.Pd	2025-12-17 12:17:54.1	2025-12-17 12:17:54.1	$2b$10$pG.E6A1wwK8pFBDxijQ9FeAw7fhH.RYsuoceohV1i8yMB9Ywh1KaC	GURU
cmj9z8y5n002h5dud9vb23462	mohrohim02@gmail.com	Moh. Rohim, S.T.	2025-12-17 12:17:54.155	2025-12-17 12:17:54.155	$2b$10$7HH5bidHf8R60YQ1wSPKZOzuLU/PZfNMG0pPwT1GxNl4cDiNXWmlK	GURU
cmj9z8y73002j5dud9ooury49	yunuskacer@gmail.com	Moh. Yunus Ansori, S.Pd.	2025-12-17 12:17:54.207	2025-12-17 12:17:54.207	$2b$10$b.XN.kbU9W.rCAo.NtL/4uEYRtWcNjSv23TWqqlJqofhK0Haw4eK.	GURU
cmj9z8y8l002l5dudo8u4k81t	danzia22@gmail.com	Mulyono, S.Th.	2025-12-17 12:17:54.261	2025-12-17 12:17:54.261	$2b$10$niDbRCJ5f.6DWxmLfDop2ej9J3nXS6natY9K/38fhMo5xLx/iRm.a	GURU
cmj9z8ya2002n5dudxxrmi27p	nunungindrawati437@gmail.com	Nunung Indrawati, S.Pd.	2025-12-17 12:17:54.314	2025-12-17 12:17:54.314	$2b$10$W95AlE618b7g2R0jxnAtFurczP4G2yNzJGpuzoj9GcGDahmaYSiT2	GURU
cmj9z8ybk002p5dudp5man22v	nurmalaevayanti2006@gmail.com	Nurmala Evayanti S.Pd.	2025-12-17 12:17:54.368	2025-12-17 12:17:54.368	$2b$10$JuD9MrSjTnn9JjGXK8s8I.s5gFTVjGYCU/Jl/Sg4A8ZDByCBZSvUa	GURU
cmj9z8ycz002r5duda3p9ojun	nurulhidayahse485@gmail.com	Nurul Hidayah, S.E.	2025-12-17 12:17:54.419	2025-12-17 12:17:54.419	$2b$10$WCSq4rLN4ICBmTocXomrGOeQeRo2wHcv.9VXzzYb4ms0V561eMzuu	GURU
cmj9z8yfy002v5dudvf51yqq4	purwantisiska25@gmail.com	Siska Purwanti, S.E.	2025-12-17 12:17:54.526	2025-12-17 12:17:54.526	$2b$10$sWRMxFzGkLPqKZWFTV5p5.F9yNbQrpSMpBIn4k/ZWipc2GK1oDQpG	GURU
cmj9z8yhh002x5dud9my7ci8i	rizalpecintaseni@gmail.com	Syamsul Rizal, S.Pd.I.	2025-12-17 12:17:54.581	2025-12-17 12:17:54.581	$2b$10$CNuEXEu7LJVQRmA.BgEMG.bGjlD36JsK4DkKLfbBV1T/j0XgPIigq	GURU
cmj9z8yix002z5dudbc4lk8nv	udayaniprayuda@gmail.com	Udayani, S.Pd.	2025-12-17 12:17:54.633	2025-12-17 12:17:54.633	$2b$10$mx2VrBuCGVqaCRIlMCl6kOpaX2BG3iAbUMUB2dijH3rZGl9bMySye	GURU
cmj9z8ykf00315duda3u6niqb	wahyumirnawati30@gmail.com	Wahyu Mirnawati, S.Ak.	2025-12-17 12:17:54.687	2025-12-17 12:17:54.687	$2b$10$dRmoisOlOqhHY5ZTr7ErMeNDuO9E0nIEqWcVVf0qvP30LafIf42r6	GURU
cmj9z8ynd00355dudycn1e6hi	pa717885@gmail.com	Maulida Putri Lesmana	2025-12-17 12:17:54.793	2025-12-17 12:17:54.793	$2b$10$tYhChWCpdqZ/5A1bzHFtcu9LZpKS2bIDhETwVIwgDSN0yRbWdggTG	GURU
cmj9z8you00375dudrf1e71qe	ilafebtisherly@gmail.com	Ila Febti Sherly M., S.E	2025-12-17 12:17:54.846	2025-12-17 12:17:54.846	$2b$10$UB2xcYNx90qbDQQ3LlMkHOCSfQj.XWLldNJ9bmn4LW59GLZvbrYkm	GURU
cmj5gx04c001s35udal7y6kqp	desimustika@esgriba.com	DESY MUSTIKA MAYA SARI	2025-12-14 08:33:39.036	2025-12-22 11:46:55.996	$2b$10$nOCUVw8yH97gwAqDSQhuV.EQOBRd45gtsB79vTyNrDe3dOTi3IP/y	SISWA
cmj9z8ylv00335dudr8tet2na	zulfiamaliyah1306@gmail.com	Zulfi Amaliyah, S.Kom	2025-12-17 12:17:54.739	2025-12-23 07:48:07.524	$2b$10$WFyItfPq96XxeDV9hutJweDwS7mRpoHgdeia06BTGTQVYV.upKDkC	GURU
cmj9z8yej002t5dudlb0wn4mh	rizkielutfi@gmail.com	Rizky Lutfi Romadona, S.Kom	2025-12-17 12:17:54.475	2025-12-25 11:54:51.909	$2b$10$u/GAfkYy./EURPHeBYkbRem3Oro.3AcydU2Ptm3mv0yX1KSB3vnTu	GURU
\.


--
-- Data for Name: _GuruMataPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_GuruMataPelajaran" ("A", "B") FROM stdin;
cmj9z8yox00385dudt5p2uvo1	cmj9z7q9i001r5dudnscpl8q0
cmj9z8ybn002q5dud7n4058u9	cmj9z7q84001d5dud60yqektg
cmj9z8y4a002g5dudjlq4s2jp	cmj9z7q7y001c5dudu38a65qb
cmj9z8y77002k5dudwjch4365	cmj9z7q8v001k5dudwd0dr0f2
cmj9z8xtu00225dudew59ixr7	cmj9z7q8k001h5dudkou2wtsf
cmj9z8yd4002s5dudqb9lav2o	cmj9z7q9i001r5dudnscpl8q0
cmj9z8y5q002i5dudk3gr40r9	cmj9z7q98001o5dudu8zzru3q
cmj9z8y5q002i5dudk3gr40r9	cmj9z7q9f001q5dud3giiabft
cmj9z8y8o002m5dudwnycw1jf	cmj9z7q8c001f5dudtoyt49tx
cmj9z8y8o002m5dudwnycw1jf	cmj9z7q9n001s5dudxr525koc
cmj9z8yhl002y5dudqly12oc3	cmj9z7q90001m5dud5q6cvaku
cmj9z8yhl002y5dudqly12oc3	cmj9z7qae00205dudqey9zf1h
cmj9z8xyc00285dudgvf5bnnv	cmj9z7q8m001i5dudi334c2ms
cmj9z8xyc00285dudgvf5bnnv	cmj9z7q9i001r5dudnscpl8q0
cmj9z8xyc00285dudgvf5bnnv	cmj9z7q9v001v5dud8r2heab2
cmj9z8ykj00325dudk20mdgjx	cmj9z7q8x001l5dudh15r8ocj
cmj9z8y1b002c5dudh3e7fyuu	cmj9z7q9c001p5dudhh2cp17a
cmj9z8ya7002o5dudm0yzma1k	cmj9z7q8k001h5dudkou2wtsf
cmj9z8ya7002o5dudm0yzma1k	cmj9z7q8x001l5dudh15r8ocj
cmj9z8ya7002o5dudm0yzma1k	cmj9z7q9c001p5dudhh2cp17a
cmj9z8xzs002a5dudw0c717l2	cmj9z7q87001e5dudb1uk5u9j
cmj9z8xzs002a5dudw0c717l2	cmj9z7q9n001s5dudxr525koc
cmj9z8xzs002a5dudw0c717l2	cmj9z7q9v001v5dud8r2heab2
cmj9z8xzs002a5dudw0c717l2	cmj9z7qa0001w5dudmau1sngf
cmj9z8yg3002w5dud29sel0av	cmj9z7q94001n5dudvyt50cow
cmj9z8yg3002w5dud29sel0av	cmj9z7q9i001r5dudnscpl8q0
cmj9z8yj000305dudtwddc0j1	cmj9z7q7y001c5dudu38a65qb
cmj9z8yj000305dudtwddc0j1	cmj9z7qaa001z5dudjfz3mlu8
cmj9z8yem002u5dudolwskcz4	cmj9z7q87001e5dudb1uk5u9j
cmj9z8yem002u5dudolwskcz4	cmj9z7q9n001s5dudxr525koc
cmj9z8ynh00365dudxaiuoy08	cmjof810t000005udgq7bzpjh
cmj9z8yly00345dudadjrqvfh	cmj9z7q8c001f5dudtoyt49tx
cmj9z8yly00345dudadjrqvfh	cmj9z7q90001m5dud5q6cvaku
cmj9z8yly00345dudadjrqvfh	cmj9z7qa0001w5dudmau1sngf
cmj9z8y2q002e5dud69l0gx00	cmj9z7q8h001g5dud3cnj22wr
cmj9z8y2q002e5dud69l0gx00	cmj9z7qa5001x5dudniu477gy
cmj9z8xwv00265dud0w98oh1m	cmj9z7q98001o5dudu8zzru3q
cmj9z8xwv00265dud0w98oh1m	cmj9z7q9f001q5dud3giiabft
cmj9z8xwv00265dud0w98oh1m	cmj9z7qa8001y5dud4gjab2sw
cmj9z8xvg00245duda7dxbp56	cmj9z7q8q001j5dudx5o1zuri
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
ae98c7eb-e7bf-45a3-abc2-e0ed829eae7b	609cb3817046359fc62b69f293e3903cd198aae0f3510bf462c59f9ad4035ff7	2025-12-30 07:52:56.215058+00	20251211102828_init	\N	\N	2025-12-30 07:52:56.208618+00	1
8fdc794d-470e-44e8-9193-7f645ae15e34	0156d098f4db91ff3bbadcc1b79aadb5d97c09871b71938fd4dc6e53391a1532	2025-12-30 07:52:56.362528+00	20251216124905_add_settings_model	\N	\N	2025-12-30 07:52:56.356019+00	1
937e5050-a748-41af-9cdd-8bab986f91ba	2640bf707564a1056f78c31ab21927c3e2ba43ac93d47d3f1ef832ccced34bc8	2025-12-30 07:52:56.222546+00	20251211151758_npm_run_prisma_generate	\N	\N	2025-12-30 07:52:56.216567+00	1
b76eef30-e5ee-433c-b6fc-2e84ab8e0a42	0c7e0d4e778e1cc415cbfd0b3fbe7fdc91ffeb05229bf7599a2ebb8ceb9ffb3e	2025-12-30 07:52:56.248765+00	20251212095857_add_lms_entities	\N	\N	2025-12-30 07:52:56.224249+00	1
c81da8c7-add8-453a-b20d-a1a181aa85d4	b43cc7d286cb1c9e4eed35a237d4805ddb2ad96144c39cfb102c2eae959a72e4	2025-12-30 07:52:56.516583+00	20251221112959_add_lms_features	\N	\N	2025-12-30 07:52:56.449159+00	1
7d3f37ec-67ff-4314-87f9-683574bc239d	750d8a254ceaaf152f260f65242d25249ecaaf9678faa3f041f061007f1ee44d	2025-12-30 07:52:56.261952+00	20251212112639_add_jurusan_and_update_kelas	\N	\N	2025-12-30 07:52:56.250322+00	1
ad1d39a2-a708-462f-9de6-fb46a9f59e65	8334127d9f47b107a04a7d4f45e7b1a9f28120a32076d8418b80a0fbdd0d7fd3	2025-12-30 07:52:56.370034+00	20251217022933_remove_semester_from_tahun_ajaran	\N	\N	2025-12-30 07:52:56.364081+00	1
338e1430-8098-4f7a-aa3f-1527b7890a67	998edaffc3e7e33bda76f385a440e3df4dbf0428564a2a15763cd5aa26535719	2025-12-30 07:52:56.273583+00	20251212122610_add_many_to_many_guru_mata_pelajaran	\N	\N	2025-12-30 07:52:56.263446+00	1
ba7053b6-fc5a-48ab-8d0a-9be18ea2a9dd	92f08fc24273bbcd87412a6494250a94461f6da2ba78cc5cc67527b74e451431	2025-12-30 07:52:56.283794+00	20251212125923_add_user_integration_to_siswa_guru	\N	\N	2025-12-30 07:52:56.275252+00	1
e2313e93-4441-4961-a123-a9baa31e28f9	2af40a7de13d912e0dc5428dfaad47807ad86bb19d9b998236759c7c6779f568	2025-12-30 07:52:56.291911+00	20251212145913_make_tahun_ajaran_required_in_kelas	\N	\N	2025-12-30 07:52:56.285428+00	1
9705efaa-3135-4b86-b602-c891c226877d	ca56657a42dc94fe3aa791065e17521b02eadc0abb8a196bd6d74998eaca7b18	2025-12-30 07:52:56.397274+00	20251217074227_remove_tingkat_kesulitan	\N	\N	2025-12-30 07:52:56.371914+00	1
b8c8f6c4-34de-4c52-8cc2-1803509ea8d5	90480c68541aad550a5a12bc2e8485029efc1fb1fa25a9940a1323042c4385e2	2025-12-30 07:52:56.300155+00	20251214051132	\N	\N	2025-12-30 07:52:56.293457+00	1
2ef88588-d725-43b7-a869-7507961bdb3c	f4eb6ab1a9e0366ad782133ad765d973cb1b2ab0a48a1f7e9034e305b6634ff0	2025-12-30 07:52:56.314444+00	20251214063132_refactor_tahun_ajaran_to_siswa	\N	\N	2025-12-30 07:52:56.301782+00	1
fa187df7-f8af-43b4-a07d-11c200ec16e6	25d03367cc79cdbff0ec8e1c2d3c33a3b806c75a4e4b1fecd1932f16e476b4e5	2025-12-30 07:52:56.331122+00	20251214084212_add_attendance_model	\N	\N	2025-12-30 07:52:56.316153+00	1
1d4fb474-9796-47b3-88af-1c93a5ae33ae	b49d31efb8891a0baa5b7c1c11b5468cc50c80552ec5a7b78852605d377c5bef	2025-12-30 07:52:56.412813+00	20251217091002_add_paket_soal	\N	\N	2025-12-30 07:52:56.398855+00	1
cf34a161-11cc-41a6-a1a3-9cdf7f86a53f	9c5dce6d4875f6332cacf7463b5274add07688e63ce466bb55322ca48798db91	2025-12-30 07:52:56.33742+00	20251216110639_add_petugas_absensi_role	\N	\N	2025-12-30 07:52:56.332689+00	1
827ca0a9-2a2c-4972-8ca4-d1168c2be6cb	750d3916e193e86a376975d2c2776442d2927c8c75e0e51903d350dd990c2f6b	2025-12-30 07:52:56.343455+00	20251216115114_add_magang_status	\N	\N	2025-12-30 07:52:56.338909+00	1
86b2ccb0-341c-4a2d-82dd-53334f652bb3	8b0c125c9e6596cb9e1284407b263669b73ce9632cae5ae62bcf77135a2d8b2a	2025-12-30 07:52:56.526185+00	20251227144854	\N	\N	2025-12-30 07:52:56.518331+00	1
e56934fa-c926-4522-9791-c5a87f0f06fa	da85a17d1e1e9d2f1e72621609dbf630c551db1a7cb10b87199cd81e646623ef	2025-12-30 07:52:56.354457+00	20251216115239_rename_magang_to_pkl	\N	\N	2025-12-30 07:52:56.345014+00	1
ee4a6955-a494-45c7-a582-1cc4f1907a24	c709d568b3e9f35bfae33784143ab1dc0f924ed7188d7682fe83a2230a1ee496	2025-12-30 07:52:56.419397+00	20251217092251_remove_tingkat_kesulitan	\N	\N	2025-12-30 07:52:56.41443+00	1
de80e5de-2804-4904-9fac-3b2ee66e3011	c8a78ac8421e0546ebf611754745d56f60ef00986d8fbaec0ea700f0b022c21e	2025-12-30 07:52:56.427589+00	20251217092712_add_guru_to_paket_soal	\N	\N	2025-12-30 07:52:56.420973+00	1
af25e687-6c4d-4858-89a9-4a96fffc2488	39e302b56339b64f0b94a36c409a5271427d4159a7bda50059e41db697152c50	2025-12-30 07:52:56.439114+00	20251217114742_add_multi_class_student_selection	\N	\N	2025-12-30 07:52:56.429106+00	1
6d675a3c-690c-4d8e-a57e-06c3d19e44ba	dd18dc80c02140eb9c3d3521d8ec38d7b8cebdd8904ed44e14d9253313ecad58	2025-12-30 07:52:56.539986+00	20251228114822_remove_penjelasan_column	\N	\N	2025-12-30 07:52:56.52764+00	1
22525396-ca63-48ff-b931-e5851d24325b	1e2dc8a2aa1a8521d2ffe0b9e6dc3039cea60c545ec602bdfe0492285e12afd8	2025-12-30 07:52:56.44731+00	20251217120042_add_guru_to_ujian	\N	\N	2025-12-30 07:52:56.440737+00	1
bd7530a8-7e2b-49eb-af45-409890a1a837	08c45dbcc1c059307cbb748ed2abf7eb27633741c2f3d2848282546515b8643f	2025-12-30 07:52:56.558558+00	20251230062100_add_rpp_deep_learning	\N	\N	2025-12-30 07:52:56.541599+00	1
6c137ca6-d349-493c-90a6-7e5d05401118	421897ab0b79d60efa1cb5f781d0f940f44d4ebf634bc78a85dcbaf9c02eedef	2025-12-30 07:52:56.570641+00	20251230062917_update_rpp_to_official_format	\N	\N	2025-12-30 07:52:56.560248+00	1
\.


--
-- Name: Attendance Attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY (id);


--
-- Name: BankSoal BankSoal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankSoal"
    ADD CONSTRAINT "BankSoal_pkey" PRIMARY KEY (id);


--
-- Name: ForumKategori ForumKategori_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ForumKategori"
    ADD CONSTRAINT "ForumKategori_pkey" PRIMARY KEY (id);


--
-- Name: ForumPost ForumPost_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ForumPost"
    ADD CONSTRAINT "ForumPost_pkey" PRIMARY KEY (id);


--
-- Name: ForumReaction ForumReaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ForumReaction"
    ADD CONSTRAINT "ForumReaction_pkey" PRIMARY KEY (id);


--
-- Name: ForumThread ForumThread_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ForumThread"
    ADD CONSTRAINT "ForumThread_pkey" PRIMARY KEY (id);


--
-- Name: Guru Guru_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guru"
    ADD CONSTRAINT "Guru_pkey" PRIMARY KEY (id);


--
-- Name: JadwalPelajaran JadwalPelajaran_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JadwalPelajaran"
    ADD CONSTRAINT "JadwalPelajaran_pkey" PRIMARY KEY (id);


--
-- Name: Jurusan Jurusan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Jurusan"
    ADD CONSTRAINT "Jurusan_pkey" PRIMARY KEY (id);


--
-- Name: Kelas Kelas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kelas"
    ADD CONSTRAINT "Kelas_pkey" PRIMARY KEY (id);


--
-- Name: MataPelajaran MataPelajaran_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MataPelajaran"
    ADD CONSTRAINT "MataPelajaran_pkey" PRIMARY KEY (id);


--
-- Name: MateriAttachment MateriAttachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MateriAttachment"
    ADD CONSTRAINT "MateriAttachment_pkey" PRIMARY KEY (id);


--
-- Name: MateriBookmark MateriBookmark_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MateriBookmark"
    ADD CONSTRAINT "MateriBookmark_pkey" PRIMARY KEY (id);


--
-- Name: Materi Materi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Materi"
    ADD CONSTRAINT "Materi_pkey" PRIMARY KEY (id);


--
-- Name: Notifikasi Notifikasi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notifikasi"
    ADD CONSTRAINT "Notifikasi_pkey" PRIMARY KEY (id);


--
-- Name: PaketSoalItem PaketSoalItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaketSoalItem"
    ADD CONSTRAINT "PaketSoalItem_pkey" PRIMARY KEY (id);


--
-- Name: PaketSoalKelas PaketSoalKelas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaketSoalKelas"
    ADD CONSTRAINT "PaketSoalKelas_pkey" PRIMARY KEY (id);


--
-- Name: PaketSoal PaketSoal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaketSoal"
    ADD CONSTRAINT "PaketSoal_pkey" PRIMARY KEY (id);


--
-- Name: Pengumuman Pengumuman_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pengumuman"
    ADD CONSTRAINT "Pengumuman_pkey" PRIMARY KEY (id);


--
-- Name: ProgressSiswa ProgressSiswa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProgressSiswa"
    ADD CONSTRAINT "ProgressSiswa_pkey" PRIMARY KEY (id);


--
-- Name: RPPKelas RPPKelas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RPPKelas"
    ADD CONSTRAINT "RPPKelas_pkey" PRIMARY KEY (id);


--
-- Name: RPP RPP_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RPP"
    ADD CONSTRAINT "RPP_pkey" PRIMARY KEY (id);


--
-- Name: Settings Settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Settings"
    ADD CONSTRAINT "Settings_pkey" PRIMARY KEY (id);


--
-- Name: SiswaKelasHistory SiswaKelasHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiswaKelasHistory"
    ADD CONSTRAINT "SiswaKelasHistory_pkey" PRIMARY KEY (id);


--
-- Name: Siswa Siswa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Siswa"
    ADD CONSTRAINT "Siswa_pkey" PRIMARY KEY (id);


--
-- Name: TahunAjaran TahunAjaran_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TahunAjaran"
    ADD CONSTRAINT "TahunAjaran_pkey" PRIMARY KEY (id);


--
-- Name: TugasAttachment TugasAttachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TugasAttachment"
    ADD CONSTRAINT "TugasAttachment_pkey" PRIMARY KEY (id);


--
-- Name: TugasSiswaFile TugasSiswaFile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TugasSiswaFile"
    ADD CONSTRAINT "TugasSiswaFile_pkey" PRIMARY KEY (id);


--
-- Name: TugasSiswa TugasSiswa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TugasSiswa"
    ADD CONSTRAINT "TugasSiswa_pkey" PRIMARY KEY (id);


--
-- Name: Tugas Tugas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tugas"
    ADD CONSTRAINT "Tugas_pkey" PRIMARY KEY (id);


--
-- Name: UjianKelas UjianKelas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UjianKelas"
    ADD CONSTRAINT "UjianKelas_pkey" PRIMARY KEY (id);


--
-- Name: UjianSiswa UjianSiswa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UjianSiswa"
    ADD CONSTRAINT "UjianSiswa_pkey" PRIMARY KEY (id);


--
-- Name: UjianSoal UjianSoal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UjianSoal"
    ADD CONSTRAINT "UjianSoal_pkey" PRIMARY KEY (id);


--
-- Name: Ujian Ujian_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ujian"
    ADD CONSTRAINT "Ujian_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _GuruMataPelajaran _GuruMataPelajaran_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_GuruMataPelajaran"
    ADD CONSTRAINT "_GuruMataPelajaran_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Attendance_siswaId_tanggal_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Attendance_siswaId_tanggal_idx" ON public."Attendance" USING btree ("siswaId", tanggal);


--
-- Name: Attendance_siswaId_tanggal_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Attendance_siswaId_tanggal_key" ON public."Attendance" USING btree ("siswaId", tanggal);


--
-- Name: Attendance_tanggal_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Attendance_tanggal_idx" ON public."Attendance" USING btree (tanggal);


--
-- Name: BankSoal_guruId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BankSoal_guruId_idx" ON public."BankSoal" USING btree ("guruId");


--
-- Name: BankSoal_kelasId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BankSoal_kelasId_idx" ON public."BankSoal" USING btree ("kelasId");


--
-- Name: BankSoal_kode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "BankSoal_kode_key" ON public."BankSoal" USING btree (kode);


--
-- Name: BankSoal_mataPelajaranId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "BankSoal_mataPelajaranId_idx" ON public."BankSoal" USING btree ("mataPelajaranId");


--
-- Name: ForumKategori_kelasId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ForumKategori_kelasId_idx" ON public."ForumKategori" USING btree ("kelasId");


--
-- Name: ForumKategori_mataPelajaranId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ForumKategori_mataPelajaranId_idx" ON public."ForumKategori" USING btree ("mataPelajaranId");


--
-- Name: ForumPost_authorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ForumPost_authorId_idx" ON public."ForumPost" USING btree ("authorId");


--
-- Name: ForumPost_parentId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ForumPost_parentId_idx" ON public."ForumPost" USING btree ("parentId");


--
-- Name: ForumPost_threadId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ForumPost_threadId_idx" ON public."ForumPost" USING btree ("threadId");


--
-- Name: ForumReaction_postId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ForumReaction_postId_idx" ON public."ForumReaction" USING btree ("postId");


--
-- Name: ForumReaction_postId_userId_tipe_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ForumReaction_postId_userId_tipe_key" ON public."ForumReaction" USING btree ("postId", "userId", tipe);


--
-- Name: ForumReaction_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ForumReaction_userId_idx" ON public."ForumReaction" USING btree ("userId");


--
-- Name: ForumThread_authorId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ForumThread_authorId_idx" ON public."ForumThread" USING btree ("authorId");


--
-- Name: ForumThread_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ForumThread_createdAt_idx" ON public."ForumThread" USING btree ("createdAt");


--
-- Name: ForumThread_kategoriId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ForumThread_kategoriId_idx" ON public."ForumThread" USING btree ("kategoriId");


--
-- Name: Guru_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Guru_email_key" ON public."Guru" USING btree (email);


--
-- Name: Guru_nip_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Guru_nip_key" ON public."Guru" USING btree (nip);


--
-- Name: Guru_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Guru_userId_key" ON public."Guru" USING btree ("userId");


--
-- Name: JadwalPelajaran_hari_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "JadwalPelajaran_hari_idx" ON public."JadwalPelajaran" USING btree (hari);


--
-- Name: JadwalPelajaran_kelasId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "JadwalPelajaran_kelasId_idx" ON public."JadwalPelajaran" USING btree ("kelasId");


--
-- Name: Jurusan_kode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Jurusan_kode_key" ON public."Jurusan" USING btree (kode);


--
-- Name: MataPelajaran_kode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MataPelajaran_kode_key" ON public."MataPelajaran" USING btree (kode);


--
-- Name: MateriAttachment_materiId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MateriAttachment_materiId_idx" ON public."MateriAttachment" USING btree ("materiId");


--
-- Name: MateriBookmark_materiId_siswaId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MateriBookmark_materiId_siswaId_key" ON public."MateriBookmark" USING btree ("materiId", "siswaId");


--
-- Name: MateriBookmark_siswaId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MateriBookmark_siswaId_idx" ON public."MateriBookmark" USING btree ("siswaId");


--
-- Name: Materi_guruId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Materi_guruId_idx" ON public."Materi" USING btree ("guruId");


--
-- Name: Materi_isPublished_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Materi_isPublished_idx" ON public."Materi" USING btree ("isPublished");


--
-- Name: Materi_kelasId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Materi_kelasId_idx" ON public."Materi" USING btree ("kelasId");


--
-- Name: Materi_mataPelajaranId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Materi_mataPelajaranId_idx" ON public."Materi" USING btree ("mataPelajaranId");


--
-- Name: Notifikasi_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notifikasi_createdAt_idx" ON public."Notifikasi" USING btree ("createdAt");


--
-- Name: Notifikasi_isRead_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notifikasi_isRead_idx" ON public."Notifikasi" USING btree ("isRead");


--
-- Name: Notifikasi_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notifikasi_userId_idx" ON public."Notifikasi" USING btree ("userId");


--
-- Name: PaketSoalItem_paketSoalId_bankSoalId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaketSoalItem_paketSoalId_bankSoalId_key" ON public."PaketSoalItem" USING btree ("paketSoalId", "bankSoalId");


--
-- Name: PaketSoalItem_paketSoalId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaketSoalItem_paketSoalId_idx" ON public."PaketSoalItem" USING btree ("paketSoalId");


--
-- Name: PaketSoalKelas_kelasId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaketSoalKelas_kelasId_idx" ON public."PaketSoalKelas" USING btree ("kelasId");


--
-- Name: PaketSoalKelas_paketSoalId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaketSoalKelas_paketSoalId_idx" ON public."PaketSoalKelas" USING btree ("paketSoalId");


--
-- Name: PaketSoalKelas_paketSoalId_kelasId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaketSoalKelas_paketSoalId_kelasId_key" ON public."PaketSoalKelas" USING btree ("paketSoalId", "kelasId");


--
-- Name: PaketSoal_guruId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaketSoal_guruId_idx" ON public."PaketSoal" USING btree ("guruId");


--
-- Name: PaketSoal_kode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaketSoal_kode_key" ON public."PaketSoal" USING btree (kode);


--
-- Name: PaketSoal_mataPelajaranId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PaketSoal_mataPelajaranId_idx" ON public."PaketSoal" USING btree ("mataPelajaranId");


--
-- Name: ProgressSiswa_mataPelajaranId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProgressSiswa_mataPelajaranId_idx" ON public."ProgressSiswa" USING btree ("mataPelajaranId");


--
-- Name: ProgressSiswa_siswaId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProgressSiswa_siswaId_idx" ON public."ProgressSiswa" USING btree ("siswaId");


--
-- Name: ProgressSiswa_siswaId_mataPelajaranId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ProgressSiswa_siswaId_mataPelajaranId_key" ON public."ProgressSiswa" USING btree ("siswaId", "mataPelajaranId");


--
-- Name: RPPKelas_kelasId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RPPKelas_kelasId_idx" ON public."RPPKelas" USING btree ("kelasId");


--
-- Name: RPPKelas_rppId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RPPKelas_rppId_idx" ON public."RPPKelas" USING btree ("rppId");


--
-- Name: RPPKelas_rppId_kelasId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RPPKelas_rppId_kelasId_key" ON public."RPPKelas" USING btree ("rppId", "kelasId");


--
-- Name: RPP_guruId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RPP_guruId_idx" ON public."RPP" USING btree ("guruId");


--
-- Name: RPP_isPublished_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RPP_isPublished_idx" ON public."RPP" USING btree ("isPublished");


--
-- Name: RPP_kode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RPP_kode_key" ON public."RPP" USING btree (kode);


--
-- Name: RPP_mataPelajaranId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RPP_mataPelajaranId_idx" ON public."RPP" USING btree ("mataPelajaranId");


--
-- Name: RPP_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RPP_status_idx" ON public."RPP" USING btree (status);


--
-- Name: Settings_key_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Settings_key_key" ON public."Settings" USING btree (key);


--
-- Name: SiswaKelasHistory_kelasId_tahunAjaranId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SiswaKelasHistory_kelasId_tahunAjaranId_idx" ON public."SiswaKelasHistory" USING btree ("kelasId", "tahunAjaranId");


--
-- Name: SiswaKelasHistory_siswaId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SiswaKelasHistory_siswaId_idx" ON public."SiswaKelasHistory" USING btree ("siswaId");


--
-- Name: Siswa_nisn_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Siswa_nisn_key" ON public."Siswa" USING btree (nisn);


--
-- Name: Siswa_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Siswa_userId_key" ON public."Siswa" USING btree ("userId");


--
-- Name: TahunAjaran_tahun_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TahunAjaran_tahun_key" ON public."TahunAjaran" USING btree (tahun);


--
-- Name: TugasAttachment_tugasId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TugasAttachment_tugasId_idx" ON public."TugasAttachment" USING btree ("tugasId");


--
-- Name: TugasSiswaFile_tugasSiswaId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TugasSiswaFile_tugasSiswaId_idx" ON public."TugasSiswaFile" USING btree ("tugasSiswaId");


--
-- Name: TugasSiswa_siswaId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TugasSiswa_siswaId_idx" ON public."TugasSiswa" USING btree ("siswaId");


--
-- Name: TugasSiswa_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TugasSiswa_status_idx" ON public."TugasSiswa" USING btree (status);


--
-- Name: TugasSiswa_tugasId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TugasSiswa_tugasId_idx" ON public."TugasSiswa" USING btree ("tugasId");


--
-- Name: TugasSiswa_tugasId_siswaId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TugasSiswa_tugasId_siswaId_key" ON public."TugasSiswa" USING btree ("tugasId", "siswaId");


--
-- Name: Tugas_deadline_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Tugas_deadline_idx" ON public."Tugas" USING btree (deadline);


--
-- Name: Tugas_guruId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Tugas_guruId_idx" ON public."Tugas" USING btree ("guruId");


--
-- Name: Tugas_kelasId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Tugas_kelasId_idx" ON public."Tugas" USING btree ("kelasId");


--
-- Name: Tugas_mataPelajaranId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Tugas_mataPelajaranId_idx" ON public."Tugas" USING btree ("mataPelajaranId");


--
-- Name: UjianKelas_kelasId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UjianKelas_kelasId_idx" ON public."UjianKelas" USING btree ("kelasId");


--
-- Name: UjianKelas_ujianId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UjianKelas_ujianId_idx" ON public."UjianKelas" USING btree ("ujianId");


--
-- Name: UjianKelas_ujianId_kelasId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UjianKelas_ujianId_kelasId_key" ON public."UjianKelas" USING btree ("ujianId", "kelasId");


--
-- Name: UjianSiswa_siswaId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UjianSiswa_siswaId_idx" ON public."UjianSiswa" USING btree ("siswaId");


--
-- Name: UjianSiswa_tokenAkses_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UjianSiswa_tokenAkses_key" ON public."UjianSiswa" USING btree ("tokenAkses");


--
-- Name: UjianSiswa_ujianId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UjianSiswa_ujianId_idx" ON public."UjianSiswa" USING btree ("ujianId");


--
-- Name: UjianSiswa_ujianId_siswaId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UjianSiswa_ujianId_siswaId_key" ON public."UjianSiswa" USING btree ("ujianId", "siswaId");


--
-- Name: UjianSoal_ujianId_bankSoalId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UjianSoal_ujianId_bankSoalId_key" ON public."UjianSoal" USING btree ("ujianId", "bankSoalId");


--
-- Name: UjianSoal_ujianId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "UjianSoal_ujianId_idx" ON public."UjianSoal" USING btree ("ujianId");


--
-- Name: Ujian_guruId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ujian_guruId_idx" ON public."Ujian" USING btree ("guruId");


--
-- Name: Ujian_kelasId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ujian_kelasId_idx" ON public."Ujian" USING btree ("kelasId");


--
-- Name: Ujian_kode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Ujian_kode_key" ON public."Ujian" USING btree (kode);


--
-- Name: Ujian_mataPelajaranId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ujian_mataPelajaranId_idx" ON public."Ujian" USING btree ("mataPelajaranId");


--
-- Name: Ujian_tanggalMulai_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Ujian_tanggalMulai_idx" ON public."Ujian" USING btree ("tanggalMulai");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: _GuruMataPelajaran_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_GuruMataPelajaran_B_index" ON public."_GuruMataPelajaran" USING btree ("B");


--
-- Name: Attendance Attendance_siswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES public."Siswa"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BankSoal BankSoal_guruId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankSoal"
    ADD CONSTRAINT "BankSoal_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES public."Guru"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BankSoal BankSoal_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankSoal"
    ADD CONSTRAINT "BankSoal_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: BankSoal BankSoal_mataPelajaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."BankSoal"
    ADD CONSTRAINT "BankSoal_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES public."MataPelajaran"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ForumKategori ForumKategori_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ForumKategori"
    ADD CONSTRAINT "ForumKategori_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ForumKategori ForumKategori_mataPelajaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ForumKategori"
    ADD CONSTRAINT "ForumKategori_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES public."MataPelajaran"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ForumPost ForumPost_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ForumPost"
    ADD CONSTRAINT "ForumPost_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."ForumPost"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ForumPost ForumPost_threadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ForumPost"
    ADD CONSTRAINT "ForumPost_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES public."ForumThread"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ForumReaction ForumReaction_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ForumReaction"
    ADD CONSTRAINT "ForumReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."ForumPost"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ForumThread ForumThread_kategoriId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ForumThread"
    ADD CONSTRAINT "ForumThread_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES public."ForumKategori"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Guru Guru_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guru"
    ADD CONSTRAINT "Guru_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: JadwalPelajaran JadwalPelajaran_guruId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JadwalPelajaran"
    ADD CONSTRAINT "JadwalPelajaran_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES public."Guru"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JadwalPelajaran JadwalPelajaran_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JadwalPelajaran"
    ADD CONSTRAINT "JadwalPelajaran_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JadwalPelajaran JadwalPelajaran_mataPelajaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JadwalPelajaran"
    ADD CONSTRAINT "JadwalPelajaran_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES public."MataPelajaran"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Kelas Kelas_jurusanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kelas"
    ADD CONSTRAINT "Kelas_jurusanId_fkey" FOREIGN KEY ("jurusanId") REFERENCES public."Jurusan"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Kelas Kelas_waliKelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kelas"
    ADD CONSTRAINT "Kelas_waliKelasId_fkey" FOREIGN KEY ("waliKelasId") REFERENCES public."Guru"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MateriAttachment MateriAttachment_materiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MateriAttachment"
    ADD CONSTRAINT "MateriAttachment_materiId_fkey" FOREIGN KEY ("materiId") REFERENCES public."Materi"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MateriBookmark MateriBookmark_materiId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MateriBookmark"
    ADD CONSTRAINT "MateriBookmark_materiId_fkey" FOREIGN KEY ("materiId") REFERENCES public."Materi"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MateriBookmark MateriBookmark_siswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MateriBookmark"
    ADD CONSTRAINT "MateriBookmark_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES public."Siswa"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Materi Materi_guruId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Materi"
    ADD CONSTRAINT "Materi_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES public."Guru"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Materi Materi_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Materi"
    ADD CONSTRAINT "Materi_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Materi Materi_mataPelajaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Materi"
    ADD CONSTRAINT "Materi_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES public."MataPelajaran"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaketSoalItem PaketSoalItem_bankSoalId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaketSoalItem"
    ADD CONSTRAINT "PaketSoalItem_bankSoalId_fkey" FOREIGN KEY ("bankSoalId") REFERENCES public."BankSoal"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PaketSoalItem PaketSoalItem_paketSoalId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaketSoalItem"
    ADD CONSTRAINT "PaketSoalItem_paketSoalId_fkey" FOREIGN KEY ("paketSoalId") REFERENCES public."PaketSoal"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PaketSoalKelas PaketSoalKelas_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaketSoalKelas"
    ADD CONSTRAINT "PaketSoalKelas_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PaketSoalKelas PaketSoalKelas_paketSoalId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaketSoalKelas"
    ADD CONSTRAINT "PaketSoalKelas_paketSoalId_fkey" FOREIGN KEY ("paketSoalId") REFERENCES public."PaketSoal"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PaketSoal PaketSoal_guruId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaketSoal"
    ADD CONSTRAINT "PaketSoal_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES public."Guru"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PaketSoal PaketSoal_mataPelajaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaketSoal"
    ADD CONSTRAINT "PaketSoal_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES public."MataPelajaran"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Pengumuman Pengumuman_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pengumuman"
    ADD CONSTRAINT "Pengumuman_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProgressSiswa ProgressSiswa_mataPelajaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProgressSiswa"
    ADD CONSTRAINT "ProgressSiswa_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES public."MataPelajaran"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ProgressSiswa ProgressSiswa_siswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProgressSiswa"
    ADD CONSTRAINT "ProgressSiswa_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES public."Siswa"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RPPKelas RPPKelas_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RPPKelas"
    ADD CONSTRAINT "RPPKelas_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RPPKelas RPPKelas_rppId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RPPKelas"
    ADD CONSTRAINT "RPPKelas_rppId_fkey" FOREIGN KEY ("rppId") REFERENCES public."RPP"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RPP RPP_guruId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RPP"
    ADD CONSTRAINT "RPP_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES public."Guru"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RPP RPP_mataPelajaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RPP"
    ADD CONSTRAINT "RPP_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES public."MataPelajaran"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SiswaKelasHistory SiswaKelasHistory_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiswaKelasHistory"
    ADD CONSTRAINT "SiswaKelasHistory_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SiswaKelasHistory SiswaKelasHistory_siswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiswaKelasHistory"
    ADD CONSTRAINT "SiswaKelasHistory_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES public."Siswa"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SiswaKelasHistory SiswaKelasHistory_tahunAjaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SiswaKelasHistory"
    ADD CONSTRAINT "SiswaKelasHistory_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES public."TahunAjaran"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Siswa Siswa_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Siswa"
    ADD CONSTRAINT "Siswa_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Siswa Siswa_tahunAjaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Siswa"
    ADD CONSTRAINT "Siswa_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES public."TahunAjaran"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Siswa Siswa_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Siswa"
    ADD CONSTRAINT "Siswa_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TugasAttachment TugasAttachment_tugasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TugasAttachment"
    ADD CONSTRAINT "TugasAttachment_tugasId_fkey" FOREIGN KEY ("tugasId") REFERENCES public."Tugas"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TugasSiswaFile TugasSiswaFile_tugasSiswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TugasSiswaFile"
    ADD CONSTRAINT "TugasSiswaFile_tugasSiswaId_fkey" FOREIGN KEY ("tugasSiswaId") REFERENCES public."TugasSiswa"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TugasSiswa TugasSiswa_siswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TugasSiswa"
    ADD CONSTRAINT "TugasSiswa_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES public."Siswa"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TugasSiswa TugasSiswa_tugasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TugasSiswa"
    ADD CONSTRAINT "TugasSiswa_tugasId_fkey" FOREIGN KEY ("tugasId") REFERENCES public."Tugas"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Tugas Tugas_guruId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tugas"
    ADD CONSTRAINT "Tugas_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES public."Guru"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tugas Tugas_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tugas"
    ADD CONSTRAINT "Tugas_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Tugas Tugas_mataPelajaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tugas"
    ADD CONSTRAINT "Tugas_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES public."MataPelajaran"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UjianKelas UjianKelas_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UjianKelas"
    ADD CONSTRAINT "UjianKelas_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UjianKelas UjianKelas_ujianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UjianKelas"
    ADD CONSTRAINT "UjianKelas_ujianId_fkey" FOREIGN KEY ("ujianId") REFERENCES public."Ujian"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UjianSiswa UjianSiswa_siswaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UjianSiswa"
    ADD CONSTRAINT "UjianSiswa_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES public."Siswa"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UjianSiswa UjianSiswa_ujianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UjianSiswa"
    ADD CONSTRAINT "UjianSiswa_ujianId_fkey" FOREIGN KEY ("ujianId") REFERENCES public."Ujian"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UjianSoal UjianSoal_bankSoalId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UjianSoal"
    ADD CONSTRAINT "UjianSoal_bankSoalId_fkey" FOREIGN KEY ("bankSoalId") REFERENCES public."BankSoal"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UjianSoal UjianSoal_ujianId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UjianSoal"
    ADD CONSTRAINT "UjianSoal_ujianId_fkey" FOREIGN KEY ("ujianId") REFERENCES public."Ujian"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ujian Ujian_guruId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ujian"
    ADD CONSTRAINT "Ujian_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES public."Guru"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Ujian Ujian_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ujian"
    ADD CONSTRAINT "Ujian_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Ujian Ujian_mataPelajaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ujian"
    ADD CONSTRAINT "Ujian_mataPelajaranId_fkey" FOREIGN KEY ("mataPelajaranId") REFERENCES public."MataPelajaran"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Ujian Ujian_paketSoalId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ujian"
    ADD CONSTRAINT "Ujian_paketSoalId_fkey" FOREIGN KEY ("paketSoalId") REFERENCES public."PaketSoal"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: _GuruMataPelajaran _GuruMataPelajaran_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_GuruMataPelajaran"
    ADD CONSTRAINT "_GuruMataPelajaran_A_fkey" FOREIGN KEY ("A") REFERENCES public."Guru"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _GuruMataPelajaran _GuruMataPelajaran_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_GuruMataPelajaran"
    ADD CONSTRAINT "_GuruMataPelajaran_B_fkey" FOREIGN KEY ("B") REFERENCES public."MataPelajaran"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict pNPDmsxY4qcb7geGjiVmEae23a75IPgWq3856i2WtSIHKDwHKAICHNrQg7ovWSa

