--
-- PostgreSQL database dump
--

\restrict dpf2eEt5f7eZGWnYEzKVsw2Pyq8Zp1LowfkElNib4DGUQBMDohwauAzldnwKYb9

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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


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
cmjpqjfqb000izzudx5lxt3v4	3449744648300010	Dra. Subur Hindartin	drasuburhindartin@gmail.com	081234567890	AKTIF	2025-12-28 12:58:25.761	2025-12-28 12:58:25.761	\N	cmjpqjfq5000hzzudv0kh70hy
cmjpqjfru000kzzudookn6h98	00000000230011444	Dwi Wahyudi, S.T,	yudiaster1922@gmail.com	081234567890	AKTIF	2025-12-28 12:58:25.817	2025-12-28 12:58:25.817	\N	cmjpqjfrp000jzzudom6mf4da
cmjpqjftb000mzzud3iitv5ct	3455763666300010	Erlin Novia Diana, S.E.	erlinnoviadiana@gmail.com	081234567890	AKTIF	2025-12-28 12:58:25.871	2025-12-28 12:58:25.871	\N	cmjpqjft7000lzzudpd04rbpz
cmjpqjfuu000ozzud58uavosd	00000000000000022222	Fera Mega Haristina, S.Tr.Kom.	feramegaharistiana@gmail.com	081234567890	AKTIF	2025-12-28 12:58:25.925	2025-12-28 12:58:25.925	\N	cmjpqjfuq000nzzuddsr70c6o
cmjpqjfwd000qzzud1cjbeurt	0000000023232323	Frances Laurence Setyo Budi, S.Pd.	franceskoyen16@gmail.com	081234567890	AKTIF	2025-12-28 12:58:25.98	2025-12-28 12:58:25.98	\N	cmjpqjfw8000pzzudf7p896q7
cmjpqjfxu000szzudk626hr6y	1234567891	Ila Febti Sherly M., S.E	ilafebtisherly@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.034	2025-12-28 12:58:26.034	\N	cmjpqjfxq000rzzudr7yi234o
cmjpqjfzd000uzzudmfngs5vm	00000000000000004	Imtiana, S.Pd	imtianateguh@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.088	2025-12-28 12:58:26.088	\N	cmjpqjfz8000tzzudz7y8lmn2
cmjpqjg0v000wzzudi0vys6t5	0000000000000066	M. Fais Jainuddin, S.Pd	faizabrahammalik@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.142	2025-12-28 12:58:26.142	\N	cmjpqjg0r000vzzud189jjxky
cmjpqjg2d000yzzudan4jw3lv	00000000000000076	Maulida Putri Lesmana	pa717885@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.196	2025-12-28 12:58:26.196	\N	cmjpqjg29000xzzudbedq6vj7
cmjpqjg3v0010zzud21nxztr1	00000000000023235	Moh. Rohim, S.T.	mohrohim02@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.251	2025-12-28 12:58:26.251	\N	cmjpqjg3r000zzzudb8fl7z3k
cmjpqjg5c0012zzudark30thx	8834765666130320	Moh. Yunus Ansori, S.Pd.	yunuskacer@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.304	2025-12-28 12:58:26.304	\N	cmjpqjg590011zzud1akfb3hh
cmjpqjg6v0014zzudzx778mqn	0000000000000006	Mulyono, S.Th.	danzia22@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.358	2025-12-28 12:58:26.358	\N	cmjpqjg6q0013zzudju2dxg80
cmjpqjg8d0016zzud5jexqo7j	5736762663300210	Nunung Indrawati, S.Pd.	nunungindrawati437@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.412	2025-12-28 12:58:26.412	\N	cmjpqjg880015zzudw8dy26u7
cmjpqjg9v0018zzudj3wzfzqn	5040758659300040	Nurmala Evayanti S.Pd.	nurmalaevayanti2006@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.466	2025-12-28 12:58:26.466	\N	cmjpqjg9r0017zzudloyv24qh
cmjpqjgbe001azzud2i8b18j9	0000000000000007878	Nurul Hidayah, S.E.	nurulhidayahse485@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.521	2025-12-28 12:58:26.521	\N	cmjpqjgb90019zzudds26creh
cmjpqjgcv001czzud8jhhyxdg	1201212121212110	Rizky Lutfi Romadona, S.Kom	rizkielutfi@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.574	2025-12-28 12:58:26.574	\N	cmjpqjgcr001bzzudxkyeze81
cmjpqjged001ezzudugl00z4x	00000000000000977	Siska Purwanti, S.E.	purwantisiska25@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.628	2025-12-28 12:58:26.628	\N	cmjpqjge9001dzzud3wcy1ldy
cmjpqjgfy001gzzudthnb18dh	8549764665110030	Syamsul Rizal, S.Pd.I.	rizalpecintaseni@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.685	2025-12-28 12:58:26.685	\N	cmjpqjgfu001fzzudo6bdeiz6
cmjpqjghh001izzudtf4sexue	0000000000000010044	Udayani, S.Pd.	udayaniprayuda@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.74	2025-12-28 12:58:26.74	\N	cmjpqjghc001hzzud8bxgsy1g
cmjpqjgix001kzzudrd0n5d22	00000000003444211	Wahyu Mirnawati, S.Ak.	wahyumirnawati30@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.793	2025-12-28 12:58:26.793	\N	cmjpqjgit001jzzudg5dvjn9z
cmjpqjgkf001mzzud5occ1sv2	0000000000000044	Zulfi Amaliyah, S.Kom	zulfiamaliyah1306@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.846	2025-12-28 13:00:04.402	\N	cmjpqjgkb001lzzudf7awrgbn
cmjpqjfop000gzzudfbfd1nub	8550751654200000	Aini Abdul Cholis S.Pd.	ainiabdcholis.73@gmail.com	081234567890	AKTIF	2025-12-28 12:58:25.704	2025-12-28 13:25:03.754	\N	cmjpqjfol000fzzudcli6ogvh
\.


--
-- Data for Name: JadwalPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") FROM stdin;
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
\.


--
-- Data for Name: RPPKelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RPPKelas" (id, "rppId", "kelasId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Settings" (id, key, value, "createdAt", "updatedAt") FROM stdin;
cmjaxivkf0000u0udfciy166n	late_time_threshold	07:00	2025-12-18 04:17:24.303	2025-12-18 04:17:24.303
\.


--
-- Data for Name: Siswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) FROM stdin;
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
9a56aa20-4c72-4561-86d6-9a39d104a690	2024/2025	2024-07-01 00:00:00	2024-12-31 00:00:00	AKTIF	2025-12-30 07:40:08.245	2025-12-30 07:40:08.245	\N
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
cmjpqhr2b0002zzud0439khlo	rizky@mail.com	Rizky	2025-12-28 12:57:07.139	2025-12-28 12:57:07.139	$2b$10$JJrtoWxwfHopUyHAd65nluuP1cOXfG3nMhUBxi9WCzqxfcUGoNHmO	ADMIN
cmjpqjfol000fzzudcli6ogvh	ainiabdcholis.73@gmail.com	Aini Abdul Cholis S.Pd.	2025-12-28 12:58:25.701	2025-12-28 12:58:25.701	$2b$10$KC84PE2C4aYVrjCO.yPWOeNaTtI0h53.L7s5./HldAn2RTpIJMzvq	GURU
cmjpqjfq5000hzzudv0kh70hy	drasuburhindartin@gmail.com	Dra. Subur Hindartin	2025-12-28 12:58:25.757	2025-12-28 12:58:25.757	$2b$10$.mD6UFTxpkQzZBB7Mz1IO.yGf34fGhGe9Qd.r6VkpP5tUzR8CQl5W	GURU
cmjpqjfrp000jzzudom6mf4da	yudiaster1922@gmail.com	Dwi Wahyudi, S.T,	2025-12-28 12:58:25.813	2025-12-28 12:58:25.813	$2b$10$BkxON6HqEuN7eLuvEjflGe30Htozf6ML3nw77QZoXscOz/W8DZPlC	GURU
cmjpqjft7000lzzudpd04rbpz	erlinnoviadiana@gmail.com	Erlin Novia Diana, S.E.	2025-12-28 12:58:25.867	2025-12-28 12:58:25.867	$2b$10$QdysMCEnq.ImTbRkCvXQEeUGHN4tUOHra95fXQjPpX9eoTCbnGWhq	GURU
cmjpqjfuq000nzzuddsr70c6o	feramegaharistiana@gmail.com	Fera Mega Haristina, S.Tr.Kom.	2025-12-28 12:58:25.922	2025-12-28 12:58:25.922	$2b$10$8fdQby3bBxoeLskVh6aRWexrgp38jK4s8eQAaShmEobTiWaNVkmbi	GURU
cmjpqjfw8000pzzudf7p896q7	franceskoyen16@gmail.com	Frances Laurence Setyo Budi, S.Pd.	2025-12-28 12:58:25.976	2025-12-28 12:58:25.976	$2b$10$FeppiLvhAzBD9WcYkGPyrOqcPymSqUtlOp7YS8zYcl8ChlhkQomn.	GURU
cmjpqjfxq000rzzudr7yi234o	ilafebtisherly@gmail.com	Ila Febti Sherly M., S.E	2025-12-28 12:58:26.03	2025-12-28 12:58:26.03	$2b$10$q87f/0cqanG./e81M7iL5.Ivd.b//uAt6LU4PGBuklp37gqhroVjC	GURU
cmjpqjfz8000tzzudz7y8lmn2	imtianateguh@gmail.com	Imtiana, S.Pd	2025-12-28 12:58:26.084	2025-12-28 12:58:26.084	$2b$10$50WvVt9QA.6iJwnaadLX0e7XINQptxiTSC9Ep8xhE/eCbqSc/bYqe	GURU
cmjpqjg0r000vzzud189jjxky	faizabrahammalik@gmail.com	M. Fais Jainuddin, S.Pd	2025-12-28 12:58:26.139	2025-12-28 12:58:26.139	$2b$10$cSGyOG1DxURG2OqSZKMaheIjHKVDi.seRy74LUdP7GLVl/GShOndS	GURU
cmjpqjg29000xzzudbedq6vj7	pa717885@gmail.com	Maulida Putri Lesmana	2025-12-28 12:58:26.193	2025-12-28 12:58:26.193	$2b$10$10RdFM.pKRmg0YC8TzakVOgqyrNFKysUb39lz1gsJGkZ2K4PB0YSS	GURU
cmjpqjg3r000zzzudb8fl7z3k	mohrohim02@gmail.com	Moh. Rohim, S.T.	2025-12-28 12:58:26.247	2025-12-28 12:58:26.247	$2b$10$nkbf0K8.n/pJgm46zirXL.oNiNC7jTLpo8WXyttNbEcoXvtP7ApzK	GURU
cmjpqjg590011zzud1akfb3hh	yunuskacer@gmail.com	Moh. Yunus Ansori, S.Pd.	2025-12-28 12:58:26.301	2025-12-28 12:58:26.301	$2b$10$B6qeA2.hXkm2LFmOxMWe.e5w702T00a2DmDUXirX38ypdr.2VfXa.	GURU
cmjpqjg6q0013zzudju2dxg80	danzia22@gmail.com	Mulyono, S.Th.	2025-12-28 12:58:26.354	2025-12-28 12:58:26.354	$2b$10$9JPQmZ3WFvO6Fmr20A3uSujSd8GAOsx4XEn9NYZeAFzzjXxrl6.qK	GURU
cmjpqjg880015zzudw8dy26u7	nunungindrawati437@gmail.com	Nunung Indrawati, S.Pd.	2025-12-28 12:58:26.408	2025-12-28 12:58:26.408	$2b$10$N/6nA1fdse3jBQXxoF5SSe0fXnqo5ML4qAfsfRFrduzdEGvgPukvW	GURU
cmjpqjg9r0017zzudloyv24qh	nurmalaevayanti2006@gmail.com	Nurmala Evayanti S.Pd.	2025-12-28 12:58:26.463	2025-12-28 12:58:26.463	$2b$10$Rvj3HYhWZeoLyvpnc5xohuQFU5gCkwxFTmusdJmts.4P1t5kV03x6	GURU
cmjpqjgb90019zzudds26creh	nurulhidayahse485@gmail.com	Nurul Hidayah, S.E.	2025-12-28 12:58:26.517	2025-12-28 12:58:26.517	$2b$10$ZIrFAPJ7teRORhNT07X4xe0bdWna3.BaZSrfyT3RvnGx9t/Puz6Gq	GURU
cmjpqjgcr001bzzudxkyeze81	rizkielutfi@gmail.com	Rizky Lutfi Romadona, S.Kom	2025-12-28 12:58:26.571	2025-12-28 12:58:26.571	$2b$10$dhVmigUkRpLY7nA3EuniuukK4U.RMA3uDLZigHizruPrFtw6az1JW	GURU
cmjpqjge9001dzzud3wcy1ldy	purwantisiska25@gmail.com	Siska Purwanti, S.E.	2025-12-28 12:58:26.625	2025-12-28 12:58:26.625	$2b$10$DCRbW4biCP4ttXvLTZWT9.kZDd0KSCUKyZSklbS6HkPCktiexzXFK	GURU
cmjpqjgfu001fzzudo6bdeiz6	rizalpecintaseni@gmail.com	Syamsul Rizal, S.Pd.I.	2025-12-28 12:58:26.682	2025-12-28 12:58:26.682	$2b$10$GYyb.rteIkBDTtbz0oNX0umwNv3d2EYXut0NRtdL0IL1khXZOwAyO	GURU
cmjpqjghc001hzzud8bxgsy1g	udayaniprayuda@gmail.com	Udayani, S.Pd.	2025-12-28 12:58:26.736	2025-12-28 12:58:26.736	$2b$10$ptCSOY24oBq5v7ju1tifQORESIQYAN/J7PuYq9726lSAzt.kz.pSm	GURU
cmjpqjgit001jzzudg5dvjn9z	wahyumirnawati30@gmail.com	Wahyu Mirnawati, S.Ak.	2025-12-28 12:58:26.789	2025-12-28 12:58:26.789	$2b$10$7sxv4NUQWDI2TGGbFmhCB.AKSiWO/K7q1ZaJxXwXcHlFNl0DYpmAG	GURU
cmjpqjgkb001lzzudf7awrgbn	zulfiamaliyah1306@gmail.com	Zulfi Amaliyah, S.Kom	2025-12-28 12:58:26.843	2025-12-28 12:58:26.843	$2b$10$kD7MfuX7.SKy7DFFz7SN8.aFCe4JyGxhapJxYm4q1Pwdi4fTCHZnu	GURU
cmjpqjqfr001nzzudmm8356tr	abihartowicaksono@cbt.com	ABI HARTO WICAKSONO	2025-12-28 12:58:39.639	2025-12-28 12:58:39.639	$2b$10$dXIWc8D8ku3/fH0HGKt4VOWe9MHYpop3FJYxcdakPYCcfLEO0ilMi	SISWA
cmjpqjqhg001pzzud1bybu0v1	adamsyahrezagumilang@cbt.com	ADAM SYAHREZA GUMILANG	2025-12-28 12:58:39.7	2025-12-28 12:58:39.7	$2b$10$sXIgjal8R5PeLUfCUAnFxOZfi3qOf1.nFQawT1OVtSgGsXGXOmFpe	SISWA
cmjpqjqj2001rzzud8jzp7o3n	aditiyarizkybayupradika@cbt.com	ADITIYA RIZKY BAYU PRADIKA	2025-12-28 12:58:39.758	2025-12-28 12:58:39.758	$2b$10$FK8gidGUA9iu0Id/99kpAO3lbTfW7ZnrTPakp0p4u1LQ8Zki1THa6	SISWA
cmjpqjqkm001tzzudmtjpxfuh	adityacaturprayogo@cbt.com	ADITYA CATUR PRAYOGO	2025-12-28 12:58:39.814	2025-12-28 12:58:39.814	$2b$10$yz6iipUBoQr/u1P.JtDOy.y35GyTaGjxhzsXdlQpkwnA3XN3gY8DO	SISWA
cmjpqjqm6001vzzud6e701ntb	example12@cbt.com	ADITYA DAMARA PUTRA KRISTIAWAN	2025-12-28 12:58:39.87	2025-12-28 12:58:39.87	$2b$10$MNwlayKoUOk7wsHwJav3zuIV7HcfQdkPjpGhK.Wmc3y8IP2yE.5JO	SISWA
cmjpqjqnr001xzzud1nf842x7	adrianodwipradhita@cbt.com	ADRIANO DWI PRADHITA	2025-12-28 12:58:39.927	2025-12-28 12:58:39.927	$2b$10$KiWNentHxeoV.fCPzhIT1.sCB7Qu2Ysf6vutUDyD.YDxvhL7iHjiW	SISWA
cmjpqjqpa001zzzudi0f0qnxy	agungtrisnadewi@cbt.com	AGUNG TRISNA DEWI	2025-12-28 12:58:39.982	2025-12-28 12:58:39.982	$2b$10$k3I5glkgzzsyrJ4G728zz.XG9MkPHCrzrsEOw/b4rCHVdld8ftiy2	SISWA
cmjpqjqqt0021zzudfbxpb78k	aguswiraadipurnomo@cbt.com	AGUS WIRA ADI PURNOMO	2025-12-28 12:58:40.037	2025-12-28 12:58:40.037	$2b$10$3d232f2MMb.KF4i4ezY/ueLkHzL8u2pkHrG.nO4OnYcpp0yXcSvC6	SISWA
cmjpqjqse0023zzuddlfv3w8l	example1@cbt.com	AHMAD DIMAS KURNIAWAN	2025-12-28 12:58:40.094	2025-12-28 12:58:40.094	$2b$10$tlPak1bOo0vDSUbVWJaDd.v8MinaClRXSwJRB4TIgiLF55N0ZoeWW	SISWA
cmjpqjqty0025zzud5pssdsmd	ahmadrianzuhriafandi@cbt.com	AHMAD RIAN ZUHRI AFANDI	2025-12-28 12:58:40.15	2025-12-28 12:58:40.15	$2b$10$GIII75.k4DEjnIjn4wVdUu/ExvE2CzX8jbA2Usr2O9nEfwazU/S2q	SISWA
cmjpqjqvh0027zzudpadslyyh	example2@cbt.com	AINO YOEL	2025-12-28 12:58:40.205	2025-12-28 12:58:40.205	$2b$10$6cjwGCtKR39GFFS72qF5pezO3/ExTRomCiOlEe5yfD1gKXZF0U80u	SISWA
cmjpqjqx20029zzuda3sl9t4t	ainurrohmah@cbt.com	AINUR ROHMAH	2025-12-28 12:58:40.262	2025-12-28 12:58:40.262	$2b$10$kJ6D3JK3ae.IcjHEAEWKO.l6UNGVsISfEbS4ZOd9XopO5vhmd0hIm	SISWA
cmjpqjqym002bzzuddf8cu16w	aldiprayatna@cbt.com	ALDI PRAYATNA	2025-12-28 12:58:40.318	2025-12-28 12:58:40.318	$2b$10$IMR8lXRl2ndkZvYabvONs.wXUPFl8pTQvuvY0VFQe8YPnJCaDD4NG	SISWA
cmjpqjr06002dzzudppef2a6h	aldoilfanpratama@cbt.com	ALDO ILFAN PRATAMA	2025-12-28 12:58:40.374	2025-12-28 12:58:40.374	$2b$10$zNAdObbwoiAtvrRPJni/POwNntiVmIJ1GfI6ZCoarjaslOLcodQmK	SISWA
cmjpqjr1q002fzzud55nhf1tw	alfatriefendi@cbt.com	ALFA TRI EFENDI	2025-12-28 12:58:40.43	2025-12-28 12:58:40.43	$2b$10$Mff1EkpAzKBbUdbIkXAPOOcq9zzfE/FXnQ5VVDSi.deoLAUuVzB5a	SISWA
cmjpqjr39002hzzud6jfrr45f	example13@cbt.com	ALFAZA OKTAVINO PRADITIA	2025-12-28 12:58:40.485	2025-12-28 12:58:40.485	$2b$10$qYkKuhCcdfBir4BCYZ1vLeiylav8lxcey/WkWaT/4faE2fD1UNAli	SISWA
cmjpqjr4t002jzzudtiq3jqnu	alifaturrosikin@cbt.com	ALIFATUR ROSIKIN	2025-12-28 12:58:40.541	2025-12-28 12:58:40.541	$2b$10$ZIX85sYk6h9eGjm/Vsk3Ze/N5bYEAGyZfRs7Pe30YmIqlNxRGjS9q	SISWA
cmjpqjr6d002lzzud9z7uj6ks	ameliadewisinta@cbt.com	AMELIA DEWI SINTA	2025-12-28 12:58:40.597	2025-12-28 12:58:40.597	$2b$10$RMQzwjp4g8aqncu9ZKZRPuAv0UJs/SPhYhERv/nYOkwE4O6SP9iHu	SISWA
cmjpqjr7y002nzzudh0e79xqj	example3@cbt.com	ANANDA MAYCKO WIJAYA	2025-12-28 12:58:40.654	2025-12-28 12:58:40.654	$2b$10$TwiDeGKsD7J4.ajl/pH20.kfYvvZwvtaqCM562J24tlLKuvJDxesK	SISWA
cmjpqjr9h002pzzudw0uq9oxc	andhikabayusaputra@cbt.com	ANDHIKA BAYU SAPUTRA	2025-12-28 12:58:40.709	2025-12-28 12:58:40.709	$2b$10$Horv3VadGReM7Kk6X7uzjeN6Gfa2pu9P3ytSUtbQjzmkxRZx4CcXW	SISWA
cmjpqjrb1002rzzud642qnh1y	example4@cbt.com	ANGGA CAHYO PRATAMA	2025-12-28 12:58:40.765	2025-12-28 12:58:40.765	$2b$10$varBaewL/DK10UIDf7oCOOypxw8F/ii.Z1PIgKp/wIctgkeWZnW3O	SISWA
cmjpqjrcm002tzzudn633dwth	anggivirnandaputri@cbt.com	ANGGI VIRNANDA PUTRI	2025-12-28 12:58:40.822	2025-12-28 12:58:40.822	$2b$10$dKz8OFBex5gzWHag9FKpA.CXH1jkgDioFsvF/wlD8QblP6er8ipjW	SISWA
cmjpqjre6002vzzudmja95u62	awangsetiawan@cbt.com	AWANG SETIAWAN	2025-12-28 12:58:40.878	2025-12-28 12:58:40.878	$2b$10$d24WzXJ7jk5MxSbl/YVHyuJ4s5.4papSGg7IH1F.5ZY12MaisOT3e	SISWA
cmjpqjrfq002xzzudyun15d0e	example25@cbt.com	AYUNI ARIMBI	2025-12-28 12:58:40.934	2025-12-28 12:58:40.934	$2b$10$6y9zQrhHMnFi0sAVyytb1.Ou8a6bcKOAL3aB7BPxHvTuPhNjQkCsC	SISWA
cmjpqjrh9002zzzud3hjj6xch	example5@cbt.com	AZAI DENIS SAFARULLAH	2025-12-28 12:58:40.989	2025-12-28 12:58:40.989	$2b$10$OUBNb7l83rFFCOQJoZ41qerNhuNWVzK34Ld7KCJAcdSw07C4.NFhC	SISWA
cmjpqjris0031zzudp6vk28im	example14@cbt.com	BADRIA NUR ANISA	2025-12-28 12:58:41.044	2025-12-28 12:58:41.044	$2b$10$lIBHnOTNmJRs828vgpQsKOuLXgBB9y7A4Ze1nJy5PxMulTKOWsB/y	SISWA
cmjpqjrkd0033zzudue97i1qi	bagussetiawan@cbt.com	BAGUS SETIAWAN	2025-12-28 12:58:41.101	2025-12-28 12:58:41.101	$2b$10$Pke5IU0Vv/vWEmDxEpnEKudPS2PE74fhqJp3srHMieo3Abl4keOzS	SISWA
cmjpqjrlw0035zzudr8dj3jd2	example6@cbt.com	CANDRA PRATAMA	2025-12-28 12:58:41.156	2025-12-28 12:58:41.156	$2b$10$.s1Et4SNNbBknp9Vwm3p5eM09Sp2uwzR6JTOzrrQ7g8SiOrmCto2i	SISWA
cmjpqjrnf0037zzud5mhxvo9k	danubagusprayogo@cbt.com	DANU BAGUS PRAYOGO	2025-12-28 12:58:41.211	2025-12-28 12:58:41.211	$2b$10$tgHuv77N4pq2CC6H84lEne2OLX59zJrkJ6/BeyuVNpwwcGVPDRfXu	SISWA
cmjpqjroy0039zzuddk876iat	davaputraprasetya@cbt.com	DAVA PUTRA PRASETYA	2025-12-28 12:58:41.266	2025-12-28 12:58:41.266	$2b$10$akPxAbD7oiSIkqcJBylAW.xWVdb9Kzt4SCOwbUsnoK9RT/TrsCQbm	SISWA
cmjpqjrqi003bzzudcyb5tlta	definingtyas@cbt.com	DEFI NINGTYAS	2025-12-28 12:58:41.322	2025-12-28 12:58:41.322	$2b$10$iRQhqRuMwyca74lD64qOyuKgBijaTxvGAyHenTMMGloKheZ.tQzdG	SISWA
cmjpqjrs2003dzzud3klh82ub	dendibayupratama@cbt.com	DENDI BAYU PRATAMA	2025-12-28 12:58:41.378	2025-12-28 12:58:41.378	$2b$10$ys05Gp9Ti26tNT4WlPqqX.Ix4qTqF74O3CdX94pmqcOcpYR03RYOO	SISWA
cmjpqjrtl003fzzud5wu30zyy	desimustika@esgriba.com	DESY MUSTIKA MAYA SARI	2025-12-28 12:58:41.433	2025-12-28 12:58:41.433	$2b$10$0UfTW9IVNGhiqE6AlnbAfuujZku9d6Ukzf/z4/xtBbHKJnYXXFBge	SISWA
cmjpqjrv4003hzzudvti3m4z3	dewiwahyuni@cbt.com	DEWI WAHYUNI	2025-12-28 12:58:41.488	2025-12-28 12:58:41.488	$2b$10$zYAxMWCPN.HX/1aKYYHe6OfYaVHlgo0A3uNcezvDPLmxEEgrFh7TO	SISWA
cmjpqjrwo003jzzudcv85qs8s	dinarizaayumatussholeha@cbt.com	DINA RIZA AYU MATUSSHOLEHA	2025-12-28 12:58:41.544	2025-12-28 12:58:41.544	$2b$10$mhgApaUKgnlimb6AI7ucu.U74A3bMQVJ7U7Cr4Z/L7WFdKxKvYsGS	SISWA
cmjpqjry6003lzzudvy9zuvrw	dinoabipratama@cbt.com	DINO ABI PRATAMA	2025-12-28 12:58:41.598	2025-12-28 12:58:41.598	$2b$10$j54ImuxNxmXNDQMucXTeQeyDiqcABRvbYT6nKOWT5fPhuyT9BpCS.	SISWA
cmjpqjrzr003nzzudcjsz0f7p	dizayogayudistia@cbt.com	DIZA YOGA YUDISTIA	2025-12-28 12:58:41.655	2025-12-28 12:58:41.655	$2b$10$Gji.dPMHH3gh4no/RKyKCuXUGQeOtFeL1g/g7KJjVOVin9zSJxlui	SISWA
cmjpqjs19003pzzudu4rngm9n	example15@cbt.com	DWI AYU MEI JAYANTI	2025-12-28 12:58:41.709	2025-12-28 12:58:41.709	$2b$10$HHt.LJ4ytPZy28JJmJ4kPu.hsKoYD.aCVnnW/HPLVKN8jvCl9Y/5O	SISWA
\.


--
-- Data for Name: _GuruMataPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_GuruMataPelajaran" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
dabbaf32-9e11-4a1e-b927-7d3c80f3b2ca	609cb3817046359fc62b69f293e3903cd198aae0f3510bf462c59f9ad4035ff7	2025-12-30 07:40:08.177099+00	20251211102828_init	\N	\N	2025-12-30 07:40:08.170224+00	1
2ccbdef2-90d7-4697-950d-c924dabf1bb7	0156d098f4db91ff3bbadcc1b79aadb5d97c09871b71938fd4dc6e53391a1532	2025-12-30 07:40:08.322538+00	20251216124905_add_settings_model	\N	\N	2025-12-30 07:40:08.316022+00	1
da660e8f-216c-4e9d-9a7d-2a7b435beb0a	2640bf707564a1056f78c31ab21927c3e2ba43ac93d47d3f1ef832ccced34bc8	2025-12-30 07:40:08.184025+00	20251211151758_npm_run_prisma_generate	\N	\N	2025-12-30 07:40:08.178611+00	1
af432044-dc54-45b6-ab39-39f91182bfb6	0c7e0d4e778e1cc415cbfd0b3fbe7fdc91ffeb05229bf7599a2ebb8ceb9ffb3e	2025-12-30 07:40:08.207365+00	20251212095857_add_lms_entities	\N	\N	2025-12-30 07:40:08.186043+00	1
d0ee026c-4abf-4c98-a9ed-0e742557e352	b43cc7d286cb1c9e4eed35a237d4805ddb2ad96144c39cfb102c2eae959a72e4	2025-12-30 07:40:08.474976+00	20251221112959_add_lms_features	\N	\N	2025-12-30 07:40:08.407454+00	1
f5cac1d6-2d06-4264-a16a-c31776786b3b	750d8a254ceaaf152f260f65242d25249ecaaf9678faa3f041f061007f1ee44d	2025-12-30 07:40:08.220973+00	20251212112639_add_jurusan_and_update_kelas	\N	\N	2025-12-30 07:40:08.208963+00	1
a6c9e333-ca48-4d9d-8822-3d46ec14ce03	8334127d9f47b107a04a7d4f45e7b1a9f28120a32076d8418b80a0fbdd0d7fd3	2025-12-30 07:40:08.330386+00	20251217022933_remove_semester_from_tahun_ajaran	\N	\N	2025-12-30 07:40:08.324364+00	1
daeb0ba6-66ff-4a47-b763-7a8a95ba548d	998edaffc3e7e33bda76f385a440e3df4dbf0428564a2a15763cd5aa26535719	2025-12-30 07:40:08.232929+00	20251212122610_add_many_to_many_guru_mata_pelajaran	\N	\N	2025-12-30 07:40:08.222597+00	1
57670c06-21ed-4adb-a2bd-b66730ac06c1	92f08fc24273bbcd87412a6494250a94461f6da2ba78cc5cc67527b74e451431	2025-12-30 07:40:08.242684+00	20251212125923_add_user_integration_to_siswa_guru	\N	\N	2025-12-30 07:40:08.234399+00	1
4c75c521-630f-4379-9b31-5c53e12dc307	2af40a7de13d912e0dc5428dfaad47807ad86bb19d9b998236759c7c6779f568	2025-12-30 07:40:08.251109+00	20251212145913_make_tahun_ajaran_required_in_kelas	\N	\N	2025-12-30 07:40:08.244325+00	1
11bf7052-0f3d-43a7-9dff-745bc822faef	ca56657a42dc94fe3aa791065e17521b02eadc0abb8a196bd6d74998eaca7b18	2025-12-30 07:40:08.356891+00	20251217074227_remove_tingkat_kesulitan	\N	\N	2025-12-30 07:40:08.331976+00	1
3052e6a6-038e-4b4c-ae48-52f6b6b8cec1	90480c68541aad550a5a12bc2e8485029efc1fb1fa25a9940a1323042c4385e2	2025-12-30 07:40:08.25935+00	20251214051132	\N	\N	2025-12-30 07:40:08.252806+00	1
1eb19994-dfa4-48b1-b713-d374326279de	f4eb6ab1a9e0366ad782133ad765d973cb1b2ab0a48a1f7e9034e305b6634ff0	2025-12-30 07:40:08.27433+00	20251214063132_refactor_tahun_ajaran_to_siswa	\N	\N	2025-12-30 07:40:08.260949+00	1
8c4f4d95-9779-4e11-9150-e5452a02ff00	25d03367cc79cdbff0ec8e1c2d3c33a3b806c75a4e4b1fecd1932f16e476b4e5	2025-12-30 07:40:08.291119+00	20251214084212_add_attendance_model	\N	\N	2025-12-30 07:40:08.275938+00	1
033364f1-4036-4a32-9ad2-00c4dfc91104	b49d31efb8891a0baa5b7c1c11b5468cc50c80552ec5a7b78852605d377c5bef	2025-12-30 07:40:08.37243+00	20251217091002_add_paket_soal	\N	\N	2025-12-30 07:40:08.3584+00	1
f4677569-63e0-46ec-90fd-6c0832378158	9c5dce6d4875f6332cacf7463b5274add07688e63ce466bb55322ca48798db91	2025-12-30 07:40:08.2973+00	20251216110639_add_petugas_absensi_role	\N	\N	2025-12-30 07:40:08.292776+00	1
e5c5bdbf-373b-47cf-966d-55f6f992ce52	750d3916e193e86a376975d2c2776442d2927c8c75e0e51903d350dd990c2f6b	2025-12-30 07:40:08.303403+00	20251216115114_add_magang_status	\N	\N	2025-12-30 07:40:08.29882+00	1
5f9134f8-60ac-4dac-baf2-c94a9a496279	8b0c125c9e6596cb9e1284407b263669b73ce9632cae5ae62bcf77135a2d8b2a	2025-12-30 07:40:08.484268+00	20251227144854	\N	\N	2025-12-30 07:40:08.476434+00	1
399cca31-ab7f-470e-9d0b-c8d8af19c9e1	da85a17d1e1e9d2f1e72621609dbf630c551db1a7cb10b87199cd81e646623ef	2025-12-30 07:40:08.314445+00	20251216115239_rename_magang_to_pkl	\N	\N	2025-12-30 07:40:08.305016+00	1
d1eb5041-f513-437d-9b83-0922816df73a	c709d568b3e9f35bfae33784143ab1dc0f924ed7188d7682fe83a2230a1ee496	2025-12-30 07:40:08.378612+00	20251217092251_remove_tingkat_kesulitan	\N	\N	2025-12-30 07:40:08.374026+00	1
bdb9710d-014c-44d4-a269-66a2cceb50ea	c8a78ac8421e0546ebf611754745d56f60ef00986d8fbaec0ea700f0b022c21e	2025-12-30 07:40:08.386578+00	20251217092712_add_guru_to_paket_soal	\N	\N	2025-12-30 07:40:08.380117+00	1
798f262b-3fa7-4804-b3f5-e75424fe19d2	39e302b56339b64f0b94a36c409a5271427d4159a7bda50059e41db697152c50	2025-12-30 07:40:08.397718+00	20251217114742_add_multi_class_student_selection	\N	\N	2025-12-30 07:40:08.388099+00	1
4c6040dd-f997-4a90-9fa2-88064606486c	dd18dc80c02140eb9c3d3521d8ec38d7b8cebdd8904ed44e14d9253313ecad58	2025-12-30 07:40:08.498769+00	20251228114822_remove_penjelasan_column	\N	\N	2025-12-30 07:40:08.485829+00	1
293d417c-d41d-4a7c-aad8-5c6d1f3b55af	1e2dc8a2aa1a8521d2ffe0b9e6dc3039cea60c545ec602bdfe0492285e12afd8	2025-12-30 07:40:08.405816+00	20251217120042_add_guru_to_ujian	\N	\N	2025-12-30 07:40:08.399224+00	1
38ea4fbc-1c72-4c9c-8a2b-bf074f8385c8	08c45dbcc1c059307cbb748ed2abf7eb27633741c2f3d2848282546515b8643f	2025-12-30 07:40:08.517761+00	20251230062100_add_rpp_deep_learning	\N	\N	2025-12-30 07:40:08.500629+00	1
f20b4434-6454-430e-8846-dcdbc1cf2b87	421897ab0b79d60efa1cb5f781d0f940f44d4ebf634bc78a85dcbaf9c02eedef	2025-12-30 07:40:08.529976+00	20251230062917_update_rpp_to_official_format	\N	\N	2025-12-30 07:40:08.519426+00	1
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
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT CREATE ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict dpf2eEt5f7eZGWnYEzKVsw2Pyq8Zp1LowfkElNib4DGUQBMDohwauAzldnwKYb9

