--
-- PostgreSQL database dump
--

\restrict P3Pt0ZNUThbBJf4GFexCdCwCcb1QB0sZ30tQq5DIaO7p102ztsO4HPfkl2DE52j

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
mohrohim02@gmail.com	00000000000023235	Moh. Rohim, S.T.	mohrohim02@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.251	2025-12-28 12:58:26.251	\N	cmjpqjg3r000zzzudb8fl7z3k
zulfiamaliyah1306@gmail.com	-	Zulfi Amaliyah, S.Kom	zulfiamaliyah1306@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.846	2025-12-29 13:33:29.267	\N	cmjpqjgkb001lzzudf7awrgbn
drasuburhindartin@gmail.com	3449744648300010	Dra. Subur Hindartin	drasuburhindartin@gmail.com	081234567890	AKTIF	2025-12-28 12:58:25.761	2025-12-28 12:58:25.761	\N	cmjpqjfq5000hzzudv0kh70hy
yudiaster1922@gmail.com	00000000230011444	Dwi Wahyudi, S.T,	yudiaster1922@gmail.com	081234567890	AKTIF	2025-12-28 12:58:25.817	2025-12-28 12:58:25.817	\N	cmjpqjfrp000jzzudom6mf4da
erlinnoviadiana@gmail.com	3455763666300010	Erlin Novia Diana, S.E.	erlinnoviadiana@gmail.com	081234567890	AKTIF	2025-12-28 12:58:25.871	2025-12-28 12:58:25.871	\N	cmjpqjft7000lzzudpd04rbpz
feramegaharistiana@gmail.com	00000000000000022222	Fera Mega Haristina, S.Tr.Kom.	feramegaharistiana@gmail.com	081234567890	AKTIF	2025-12-28 12:58:25.925	2025-12-28 12:58:25.925	\N	cmjpqjfuq000nzzuddsr70c6o
franceskoyen16@gmail.com	0000000023232323	Frances Laurence Setyo Budi, S.Pd.	franceskoyen16@gmail.com	081234567890	AKTIF	2025-12-28 12:58:25.98	2025-12-28 12:58:25.98	\N	cmjpqjfw8000pzzudf7p896q7
ilafebtisherly@gmail.com	1234567891	Ila Febti Sherly M., S.E	ilafebtisherly@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.034	2025-12-28 12:58:26.034	\N	cmjpqjfxq000rzzudr7yi234o
imtianateguh@gmail.com	00000000000000004	Imtiana, S.Pd	imtianateguh@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.088	2025-12-28 12:58:26.088	\N	cmjpqjfz8000tzzudz7y8lmn2
faizabrahammalik@gmail.com	0000000000000066	M. Fais Jainuddin, S.Pd	faizabrahammalik@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.142	2025-12-28 12:58:26.142	\N	cmjpqjg0r000vzzud189jjxky
pa717885@gmail.com	00000000000000076	Maulida Putri Lesmana	pa717885@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.196	2025-12-28 12:58:26.196	\N	cmjpqjg29000xzzudbedq6vj7
ainiabdcholis.73@gmail.com	8550751654200000	Aini Abdul Cholis S.Pd.	ainiabdcholis.73@gmail.com	081234567890	AKTIF	2025-12-28 12:58:25.704	2025-12-28 13:25:03.754	\N	cmjpqjfol000fzzudcli6ogvh
wahyumirnawati30@gmail.com	--	Wahyu Mirnawati, S.Ak.	wahyumirnawati30@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.793	2025-12-29 11:41:36.455	\N	cmjpqjgit001jzzudg5dvjn9z
rizkielutfi@gmail.com	1201212121212110	Rizky Lutfi Romadona, S.Kom.	rizkielutfi@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.574	2025-12-29 11:43:07.948	\N	cmjpqjgcr001bzzudxkyeze81
udayaniprayuda@gmail.com	0000000000000010044	Udayani, S.Pd.	udayaniprayuda@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.74	2025-12-28 12:58:26.74	\N	cmjpqjghc001hzzud8bxgsy1g
rizalpecintaseni@gmail.com	8549764665110030	Syamsul Rizal, S.Pd.I.	rizalpecintaseni@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.685	2025-12-28 12:58:26.685	\N	cmjpqjgfu001fzzudo6bdeiz6
purwantisiska25@gmail.com	00000000000000977	Siska Purwanti, S.E.	purwantisiska25@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.628	2025-12-28 12:58:26.628	\N	cmjpqjge9001dzzud3wcy1ldy
nurulhidayahse485@gmail.com	0000000000000007878	Nurul Hidayah, S.E.	nurulhidayahse485@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.521	2025-12-28 12:58:26.521	\N	cmjpqjgb90019zzudds26creh
nurmalaevayanti2006@gmail.com	5040758659300040	Nurmala Evayanti S.Pd.	nurmalaevayanti2006@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.466	2025-12-28 12:58:26.466	\N	cmjpqjg9r0017zzudloyv24qh
nunungindrawati437@gmail.com	5736762663300210	Nunung Indrawati, S.Pd.	nunungindrawati437@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.412	2025-12-28 12:58:26.412	\N	cmjpqjg880015zzudw8dy26u7
danzia22@gmail.com	0000000000000006	Mulyono, S.Th.	danzia22@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.358	2025-12-28 12:58:26.358	\N	cmjpqjg6q0013zzudju2dxg80
yunuskacer@gmail.com	8834765666130320	Moh. Yunus Ansori, S.Pd.	yunuskacer@gmail.com	081234567890	AKTIF	2025-12-28 12:58:26.304	2025-12-28 12:58:26.304	\N	cmjpqjg590011zzud1akfb3hh
\.


--
-- Data for Name: JadwalPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") FROM stdin;
cmjr6khze0001laudg9pxags5	SENIN	07:38	08:16	cmjpqj7vl0006zzud190ad32k	cmjpqkbqg007lzzudxvs8tt0m	zulfiamaliyah1306@gmail.com	2025-12-29 13:14:55.368	2025-12-29 13:14:55.368
cmjr6lqnc0002laudzfs026t5	SENIN	08:54	09:32	cmjpqj7vl0006zzud190ad32k	cmjpqkbqg007lzzudxvs8tt0m	zulfiamaliyah1306@gmail.com	2025-12-29 13:15:53.255	2025-12-29 13:15:53.255
cmjr6j8ea0000laudpk9i0nx1	SENIN	08:16	08:54	cmjpqj7vl0006zzud190ad32k	cmjpqkbqg007lzzudxvs8tt0m	zulfiamaliyah1306@gmail.com	2025-12-29 13:13:56.29	2025-12-29 13:13:56.29
\.


--
-- Data for Name: Jurusan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Jurusan" (id, kode, nama, deskripsi, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmjpqi8bd0003zzudm7igg3fg	AK	Akuntansi	\N	2025-12-28 12:57:29.497	2025-12-28 12:57:29.497	\N
cmjpqilo90004zzudkp2tk0ad	TKJ	Teknik Komputer dan Jaringan	\N	2025-12-28 12:57:46.809	2025-12-28 12:57:46.809	\N
cmjpqitxd0005zzudue2md3la	TKR	Teknik Kendaraan Ringan	\N	2025-12-28 12:57:57.505	2025-12-28 12:57:57.505	\N
\.


--
-- Data for Name: Kelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "waliKelasId", "jurusanId") FROM stdin;
cmjpqj7vl0006zzud190ad32k	X Akuntansi	X	30	2025-12-28 12:58:15.585	2025-12-28 12:58:15.585	\N	\N	cmjpqi8bd0003zzudm7igg3fg
cmjpqj7vu0007zzudh3nwc45f	X Teknik Kendaraan Ringan	X	30	2025-12-28 12:58:15.594	2025-12-28 12:58:15.594	\N	\N	cmjpqitxd0005zzudue2md3la
cmjpqj7vz0008zzuddij02zp9	X Teknik Komputer dan Jaringan	X	30	2025-12-28 12:58:15.599	2025-12-28 12:58:15.599	\N	\N	cmjpqilo90004zzudkp2tk0ad
cmjpqj7w40009zzudlasvla8v	XI Akuntansi	XI	30	2025-12-28 12:58:15.604	2025-12-28 12:58:15.604	\N	\N	cmjpqi8bd0003zzudm7igg3fg
cmjpqj7wa000azzud7xerd64t	XI Teknik Kendaraan Ringan	XI	30	2025-12-28 12:58:15.61	2025-12-28 12:58:15.61	\N	\N	cmjpqitxd0005zzudue2md3la
cmjpqj7wf000bzzudxli3p2cu	XI Teknik Komputer dan Jaringan	XI	30	2025-12-28 12:58:15.615	2025-12-28 12:58:15.615	\N	\N	cmjpqilo90004zzudkp2tk0ad
cmjpqj7wl000czzudn8unt2eu	XII Akuntansi	XII	30	2025-12-28 12:58:15.621	2025-12-28 12:58:15.621	\N	\N	cmjpqi8bd0003zzudm7igg3fg
cmjpqj7wv000dzzudhlu3phi8	XII Teknik Kendaraan Ringan	XII	30	2025-12-28 12:58:15.631	2025-12-28 12:58:15.631	\N	\N	cmjpqitxd0005zzudue2md3la
cmjpqj7x0000ezzud73qdbsab	XII Teknik Komputer dan Jaringan	XII	30	2025-12-28 12:58:15.636	2025-12-28 12:58:15.636	\N	\N	cmjpqilo90004zzudkp2tk0ad
\.


--
-- Data for Name: MataPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmjpqkbpm007dzzud184yx3us	BIND	Bahasa Indonesia	4		SEMUA	2025-12-28 12:59:07.21	2025-12-28 12:59:07.21	\N
cmjpqkbpq007ezzud4vtzd5nd	BK	Bimbingan Konseling	5		SEMUA	2025-12-28 12:59:07.214	2025-12-28 12:59:07.214	\N
cmjpqkbpu007fzzudbhqmezob	Bahasa Daerah	Bahasa Daerah	4		SEMUA	2025-12-28 12:59:07.218	2025-12-28 12:59:07.218	\N
cmjpqkbpy007gzzudy2fpxsyy	Bahasa Inggris	Bahasa Inggris	4		SEMUA	2025-12-28 12:59:07.222	2025-12-28 12:59:07.222	\N
cmjpqkbq2007hzzudet0ap57m	DPK AK	Dasar Program Keahlian AK	4		SEMUA	2025-12-28 12:59:07.226	2025-12-28 12:59:07.226	\N
cmjpqkbq5007izzud2lglv7sc	DPK TKJ	Dasar Program Keahlian TKJ	4		SEMUA	2025-12-28 12:59:07.229	2025-12-28 12:59:07.229	\N
cmjpqkbq9007jzzuddfy333wp	DPK TKR	Dasar Program Keahlian TKR	4		SEMUA	2025-12-28 12:59:07.233	2025-12-28 12:59:07.233	\N
cmjpqkbqc007kzzudxjte9wkn	IPAS	IPAS	4		SEMUA	2025-12-28 12:59:07.236	2025-12-28 12:59:07.236	\N
cmjpqkbqg007lzzudxvs8tt0m	Informatika	Informatika	4		SEMUA	2025-12-28 12:59:07.24	2025-12-28 12:59:07.24	\N
cmjpqkbqj007mzzudqqixadhp	KK AK	Konsentrasi Keahlian AK	4		SEMUA	2025-12-28 12:59:07.243	2025-12-28 12:59:07.243	\N
cmjpqkbqm007nzzudmamm8jp1	KK TKJ	Konsentrasi Keahlian TKJ	4		SEMUA	2025-12-28 12:59:07.246	2025-12-28 12:59:07.246	\N
cmjpqkbqq007ozzud8ul8rp9s	KK TKR	Konsentrasi Keahlian TKR	4		SEMUA	2025-12-28 12:59:07.25	2025-12-28 12:59:07.25	\N
cmjpqkbqt007pzzudgq7iby7b	MTK	Matematika	4		SEMUA	2025-12-28 12:59:07.253	2025-12-28 12:59:07.253	\N
cmjpqkbqx007qzzudykr9mkkv	Mapel Pilihan AK	Mapel Pilihan AK	4		SEMUA	2025-12-28 12:59:07.257	2025-12-28 12:59:07.257	\N
cmjpqkbr0007rzzudighkn3lf	Mapel Pilihan TKJ	Mapel Pilihan TKJ	4		SEMUA	2025-12-28 12:59:07.26	2025-12-28 12:59:07.26	\N
cmjpqkbr3007szzudz1r9c3mh	Mapel Pilihan TKR	Mapel Pilihan TKR	4		SEMUA	2025-12-28 12:59:07.263	2025-12-28 12:59:07.263	\N
cmjpqkbr7007tzzudv3xw71c8	PAI	PAI	4		SEMUA	2025-12-28 12:59:07.267	2025-12-28 12:59:07.267	\N
cmjpqkbrb007uzzud15xnb31y	PAK	PAK	4		SEMUA	2025-12-28 12:59:07.271	2025-12-28 12:59:07.271	\N
cmjpqkbre007vzzudq7gnyrdk	PJOK	PJOK	4		SEMUA	2025-12-28 12:59:07.274	2025-12-28 12:59:07.274	\N
cmjpqkbri007wzzudzaybsqxa	PKKWU AK	PKKWU AK	4		SEMUA	2025-12-28 12:59:07.278	2025-12-28 12:59:07.278	\N
cmjpqkbrl007xzzudub3cmf3q	PKKWU TKJ	PKKWU TKJ	4		SEMUA	2025-12-28 12:59:07.281	2025-12-28 12:59:07.281	\N
cmjpqkbrn007yzzud8d7kdduc	PKKWU TKR	PKKWU TKR	4		SEMUA	2025-12-28 12:59:07.283	2025-12-28 12:59:07.283	\N
cmjpqkbrr007zzzudnpzxh01i	PPKN	Pendidikan Pancasila dan Kewarganegaraan	4		SEMUA	2025-12-28 12:59:07.287	2025-12-28 12:59:07.287	\N
cmjpqkbru0080zzudcpiiizs1	Pramuka	Pramuka	4		SEMUA	2025-12-28 12:59:07.29	2025-12-28 12:59:07.29	\N
cmjpqkbrx0081zzudabzkc9pt	Sejarah Indonesia	Sejarah Indonesia	4		SEMUA	2025-12-28 12:59:07.293	2025-12-28 12:59:07.293	\N
cmjpqkbs10082zzudhevnctph	Seni Budaya	Seni Budaya	4		SEMUA	2025-12-28 12:59:07.297	2025-12-28 12:59:07.297	\N
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
-- Data for Name: Settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Settings" (id, key, value, "createdAt", "updatedAt") FROM stdin;
cmjr3anuh008jieud114e3tys	late_time_threshold	07:00	2025-12-29 11:43:17.561	2025-12-29 11:43:17.561
\.


--
-- Data for Name: Siswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) FROM stdin;
cmjpqjqfy001ozzudjav107fi	81475874	ABI HARTO WICAKSONO	1970-01-01 00:00:00	Jl. Merdeka No. 123	81234567890	abihartowicaksono@cbt.com	AKTIF	2025-12-28 12:58:39.645	2025-12-28 12:58:39.645	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjqfr001nzzudmm8356tr	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjqhk001qzzudurv3igbv	95805399	ADAM SYAHREZA GUMILANG	1970-01-01 00:00:00	Jl. Sudirman No. 45	81234567891	adamsyahrezagumilang@cbt.com	AKTIF	2025-12-28 12:58:39.703	2025-12-28 12:58:39.703	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjqhg001pzzud1bybu0v1	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjqj6001szzudj08h6taj	3088037976	ADITIYA RIZKY BAYU PRADIKA	1970-01-01 00:00:00	Jl. Sudirman No. 46	81234567892	aditiyarizkybayupradika@cbt.com	AKTIF	2025-12-28 12:58:39.761	2025-12-28 12:58:39.761	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjqj2001rzzud8jzp7o3n	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjqkq001uzzud9nble1gg	84194598	ADITYA CATUR PRAYOGO	1970-01-01 00:00:00	Jl. Sudirman No. 47	81234567893	adityacaturprayogo@cbt.com	AKTIF	2025-12-28 12:58:39.818	2025-12-28 12:58:39.818	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjqkm001tzzudmtjpxfuh	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjqmb001wzzudycuxwna5	108737154	ADITYA DAMARA PUTRA KRISTIAWAN	1970-01-01 00:00:00	Jl. Sudirman No. 48	81234567894	example12@cbt.com	AKTIF	2025-12-28 12:58:39.874	2025-12-28 12:58:39.874	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqjqm6001vzzud6e701ntb	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjqnv001yzzudo897injc	76544902	ADRIANO DWI PRADHITA	1970-01-01 00:00:00	Jl. Sudirman No. 49	81234567895	adrianodwipradhita@cbt.com	AKTIF	2025-12-28 12:58:39.93	2025-12-28 12:58:39.93	\N	cmjpqj7wv000dzzudhlu3phi8	cmjpqjqnr001xzzud1nf842x7	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjqpg0020zzud7oe3q85j	77382296	AGUNG TRISNA DEWI	1970-01-01 00:00:00	Jl. Sudirman No. 50	81234567896	agungtrisnadewi@cbt.com	AKTIF	2025-12-28 12:58:39.987	2025-12-28 12:58:39.987	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjqpa001zzzudi0f0qnxy	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjqqy0022zzudz4vrkuo0	86881070	AGUS WIRA ADI PURNOMO	1970-01-01 00:00:00	Jl. Sudirman No. 51	81234567897	aguswiraadipurnomo@cbt.com	AKTIF	2025-12-28 12:58:40.041	2025-12-28 12:58:40.041	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjqqt0021zzudfbxpb78k	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjqsj0024zzudven4rrgs	99461767	AHMAD DIMAS KURNIAWAN	1970-01-01 00:00:00	Jl. Sudirman No. 52	81234567898	example1@cbt.com	AKTIF	2025-12-28 12:58:40.098	2025-12-28 12:58:40.098	\N	cmjpqj7vu0007zzudh3nwc45f	cmjpqjqse0023zzuddlfv3w8l	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjqu20026zzudy4hf0hj5	86817502	AHMAD RIAN ZUHRI AFANDI	1970-01-01 00:00:00	Jl. Sudirman No. 53	81234567899	ahmadrianzuhriafandi@cbt.com	AKTIF	2025-12-28 12:58:40.153	2025-12-28 12:58:40.153	\N	cmjpqj7wv000dzzudhlu3phi8	cmjpqjqty0025zzud5pssdsmd	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjqvm0028zzudwfqaufho	99396650	AINO YOEL	1970-01-01 00:00:00	Jl. Sudirman No. 54	81234567900	example2@cbt.com	AKTIF	2025-12-28 12:58:40.21	2025-12-28 12:58:40.21	\N	cmjpqj7vu0007zzudh3nwc45f	cmjpqjqvh0027zzudpadslyyh	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjqx7002azzudarz2bczw	50397766	AINUR ROHMAH	1970-01-01 00:00:00	Jl. Sudirman No. 55	81234567901	ainurrohmah@cbt.com	AKTIF	2025-12-28 12:58:40.266	2025-12-28 12:58:40.266	\N	cmjpqj7w40009zzudlasvla8v	cmjpqjqx20029zzuda3sl9t4t	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjqyr002czzud7ogt1per	79686226	ALDI PRAYATNA	1970-01-01 00:00:00	Jl. Sudirman No. 56	81234567902	aldiprayatna@cbt.com	AKTIF	2025-12-28 12:58:40.322	2025-12-28 12:58:40.322	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjqym002bzzuddf8cu16w	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjr0b002ezzudtffyt5bv	57279011	ALDO ILFAN PRATAMA	1970-01-01 00:00:00	Jl. Sudirman No. 57	81234567903	aldoilfanpratama@cbt.com	AKTIF	2025-12-28 12:58:40.378	2025-12-28 12:58:40.378	\N	cmjpqj7wv000dzzudhlu3phi8	cmjpqjr06002dzzudppef2a6h	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjr1u002gzzudaobqx2ad	78367595	ALFA TRI EFENDI	1970-01-01 00:00:00	Jl. Sudirman No. 58	81234567904	alfatriefendi@cbt.com	AKTIF	2025-12-28 12:58:40.433	2025-12-28 12:58:40.433	\N	cmjpqj7wv000dzzudhlu3phi8	cmjpqjr1q002fzzud55nhf1tw	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjr3e002izzud9cgzk56e	97678393	ALFAZA OKTAVINO PRADITIA	1970-01-01 00:00:00	Jl. Sudirman No. 59	81234567905	example13@cbt.com	AKTIF	2025-12-28 12:58:40.49	2025-12-28 12:58:40.49	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqjr39002hzzud6jfrr45f	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjr4x002kzzud8fl5iu8p	97759070	ALIFATUR ROSIKIN	1970-01-01 00:00:00	Jl. Sudirman No. 60	81234567906	alifaturrosikin@cbt.com	AKTIF	2025-12-28 12:58:40.545	2025-12-28 12:58:40.545	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjr4t002jzzudtiq3jqnu	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjr6i002mzzud1n1u75oq	85609468	AMELIA DEWI SINTA	1970-01-01 00:00:00	Jl. Sudirman No. 61	81234567907	ameliadewisinta@cbt.com	AKTIF	2025-12-28 12:58:40.601	2025-12-28 12:58:40.601	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjr6d002lzzud9z7uj6ks	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjr83002ozzudyqdip31n	94461900	ANANDA MAYCKO WIJAYA	1970-01-01 00:00:00	Jl. Sudirman No. 62	81234567908	example3@cbt.com	AKTIF	2025-12-28 12:58:40.658	2025-12-28 12:58:40.658	\N	cmjpqj7vu0007zzudh3nwc45f	cmjpqjr7y002nzzudh0e79xqj	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjr9m002qzzudzc5ixzne	88279036	ANDHIKA BAYU SAPUTRA	1970-01-01 00:00:00	Jl. Sudirman No. 63	81234567909	andhikabayusaputra@cbt.com	AKTIF	2025-12-28 12:58:40.713	2025-12-28 12:58:40.713	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjr9h002pzzudw0uq9oxc	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrb6002szzud9wty1qw6	104207471	ANGGA CAHYO PRATAMA	1970-01-01 00:00:00	Jl. Sudirman No. 64	81234567910	example4@cbt.com	AKTIF	2025-12-28 12:58:40.77	2025-12-28 12:58:40.77	\N	cmjpqj7vu0007zzudh3nwc45f	cmjpqjrb1002rzzud642qnh1y	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrcr002uzzudlf578qj0	87785971	ANGGI VIRNANDA PUTRI	1970-01-01 00:00:00	Jl. Sudirman No. 65	81234567911	anggivirnandaputri@cbt.com	AKTIF	2025-12-28 12:58:40.826	2025-12-28 12:58:40.826	\N	cmjpqj7w40009zzudlasvla8v	cmjpqjrcm002tzzudn633dwth	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrea002wzzudwxrh0al2	3080015591	AWANG SETIAWAN	1970-01-01 00:00:00	Jl. Sudirman No. 66	81234567912	awangsetiawan@cbt.com	AKTIF	2025-12-28 12:58:40.882	2025-12-28 12:58:40.882	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjre6002vzzudmja95u62	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrfv002yzzudfvxxtgx2	95325705	AYUNI ARIMBI	1970-01-01 00:00:00	Jl. Sudirman No. 67	81234567913	example25@cbt.com	AKTIF	2025-12-28 12:58:40.938	2025-12-28 12:58:40.938	\N	cmjpqj7vl0006zzud190ad32k	cmjpqjrfq002xzzudyun15d0e	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrhd0030zzudyj85c0qz	88137615	AZAI DENIS SAFARULLAH	1970-01-01 00:00:00	Jl. Sudirman No. 68	81234567914	example5@cbt.com	AKTIF	2025-12-28 12:58:40.992	2025-12-28 12:58:40.992	\N	cmjpqj7vu0007zzudh3nwc45f	cmjpqjrh9002zzzud3hjj6xch	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjriy0032zzud42uym59p	99940723	BADRIA NUR ANISA	1970-01-01 00:00:00	Jl. Sudirman No. 69	81234567915	example14@cbt.com	AKTIF	2025-12-28 12:58:41.049	2025-12-28 12:58:41.049	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqjris0031zzudp6vk28im	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrkh0034zzud4ci0n8yl	85744170	BAGUS SETIAWAN	1970-01-01 00:00:00	Jl. Sudirman No. 70	81234567916	bagussetiawan@cbt.com	AKTIF	2025-12-28 12:58:41.104	2025-12-28 12:58:41.104	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjrkd0033zzudue97i1qi	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrm10036zzudpcbyw14h	3096187956	CANDRA PRATAMA	1970-01-01 00:00:00	Jl. Sudirman No. 71	81234567917	example6@cbt.com	AKTIF	2025-12-28 12:58:41.16	2025-12-28 12:58:41.16	\N	cmjpqj7vu0007zzudh3nwc45f	cmjpqjrlw0035zzudr8dj3jd2	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrnj0038zzudefbmdj9t	69853933	DANU BAGUS PRAYOGO	1970-01-01 00:00:00	Jl. Sudirman No. 72	81234567918	danubagusprayogo@cbt.com	AKTIF	2025-12-28 12:58:41.215	2025-12-28 12:58:41.215	\N	cmjpqj7wv000dzzudhlu3phi8	cmjpqjrnf0037zzud5mhxvo9k	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrp3003azzudbpc7o8da	3080427888	DAVA PUTRA PRASETYA	1970-01-01 00:00:00	Jl. Sudirman No. 73	81234567919	davaputraprasetya@cbt.com	AKTIF	2025-12-28 12:58:41.27	2025-12-28 12:58:41.27	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjroy0039zzuddk876iat	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrqn003czzudhbgrsp2s	75360603	DEFI NINGTYAS	1970-01-01 00:00:00	Jl. Sudirman No. 74	81234567920	definingtyas@cbt.com	AKTIF	2025-12-28 12:58:41.326	2025-12-28 12:58:41.326	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjrqi003bzzudcyb5tlta	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrs6003ezzudanrhp93a	86514583	DENDI BAYU PRATAMA	1970-01-01 00:00:00	Jl. Sudirman No. 75	81234567921	dendibayupratama@cbt.com	AKTIF	2025-12-28 12:58:41.381	2025-12-28 12:58:41.381	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjrs2003dzzud3klh82ub	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrtq003gzzud197t6tlz	3093967437	DESY MUSTIKA MAYA SARI	1970-01-01 00:00:00	Jl. Sudirman No. 76	81234567922	desimustika@esgriba.com	AKTIF	2025-12-28 12:58:41.437	2025-12-28 12:58:41.437	\N	cmjpqj7vl0006zzud190ad32k	cmjpqjrtl003fzzud5wu30zyy	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrv8003izzudehv6ur30	71300771	DEWI WAHYUNI	1970-01-01 00:00:00	Jl. Sudirman No. 77	81234567923	dewiwahyuni@cbt.com	AKTIF	2025-12-28 12:58:41.491	2025-12-28 12:58:41.491	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjrv4003hzzudvti3m4z3	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrwt003kzzudktcxtiqg	74612857	DINA RIZA AYU MATUSSHOLEHA	1970-01-01 00:00:00	Jl. Sudirman No. 78	81234567924	dinarizaayumatussholeha@cbt.com	AKTIF	2025-12-28 12:58:41.548	2025-12-28 12:58:41.548	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjrwo003jzzudcv85qs8s	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjryb003mzzudr78q0tzy	88236354	DINO ABI PRATAMA	1970-01-01 00:00:00	Jl. Sudirman No. 79	81234567925	dinoabipratama@cbt.com	AKTIF	2025-12-28 12:58:41.602	2025-12-28 12:58:41.602	\N	cmjpqj7wf000bzzudxli3p2cu	cmjpqjry6003lzzudvy9zuvrw	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjrzw003ozzud3y1nw87j	84607003	DIZA YOGA YUDISTIA	1970-01-01 00:00:00	Jl. Sudirman No. 80	81234567926	dizayogayudistia@cbt.com	AKTIF	2025-12-28 12:58:41.659	2025-12-28 12:58:41.659	\N	cmjpqj7w40009zzudlasvla8v	cmjpqjrzr003nzzudcjsz0f7p	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjs1d003qzzud5t3e1xqp	108153368	DWI AYU MEI JAYANTI	1970-01-01 00:00:00	Jl. Sudirman No. 81	81234567927	example15@cbt.com	AKTIF	2025-12-28 12:58:41.713	2025-12-28 12:58:41.713	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqjs19003pzzudu4rngm9n	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjs2y003szzud3i4oj7qd	85947084	DWI SINTIA PUTRI	1970-01-01 00:00:00	Jl. Sudirman No. 82	81234567928	dwisintiaputri@cbt.com	AKTIF	2025-12-28 12:58:41.769	2025-12-28 12:58:41.769	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjs2s003rzzudbg2xwq7p	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjs4f003uzzud54pdouny	83725353	EKA DEVI AINUROHMA	1970-01-01 00:00:00	Jl. Sudirman No. 83	81234567929	ekadeviainurohma@cbt.com	AKTIF	2025-12-28 12:58:41.823	2025-12-28 12:58:41.823	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjs4b003tzzudosxhuf2i	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjs60003wzzudhrr725s5	24142799	ENGGAR DWI PRASETYO	1970-01-01 00:00:00	Jl. Sudirman No. 84	81234567930	enggardwiprasetyo@cbt.com	AKTIF	2025-12-28 12:58:41.879	2025-12-28 12:58:41.879	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjs5v003vzzud19rtvkkh	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjs7i003yzzudod2wuuy8	76887989	ESA AGIL PUTRA	1970-01-01 00:00:00	Jl. Sudirman No. 85	81234567931	esaagilputra@cbt.com	AKTIF	2025-12-28 12:58:41.933	2025-12-28 12:58:41.933	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjs7e003xzzud077zwzv9	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjs910040zzudo9ndlhxx	82535073	FAHMI ADLIYANTO	1970-01-01 00:00:00	Jl. Sudirman No. 86	81234567932	fahmiadliyanto@cbt.com	AKTIF	2025-12-28 12:58:41.989	2025-12-28 12:58:41.989	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjs8w003zzzudm7vz9efw	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsaj0042zzudpfiphgwb	3087966253	FAREL ADITYA PUTRA	1970-01-01 00:00:00	Jl. Sudirman No. 87	81234567933	fareladityaputra@cbt.com	AKTIF	2025-12-28 12:58:42.042	2025-12-28 12:58:42.042	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjsaf0041zzudezczzva4	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsc50044zzud3v5nd0gh	78956609	FATURROHMAN	1970-01-01 00:00:00	Jl. Sudirman No. 88	81234567934	faturrohman@cbt.com	AKTIF	2025-12-28 12:58:42.1	2025-12-28 12:58:42.1	\N	cmjpqj7wf000bzzudxli3p2cu	cmjpqjsc00043zzud232qhcuo	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsdn0046zzudltp6z0a7	108026037	FERDIO PUTRA PRASETYA	1970-01-01 00:00:00	Jl. Sudirman No. 89	81234567935	example16@cbt.com	AKTIF	2025-12-28 12:58:42.154	2025-12-28 12:58:42.154	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqjsdj0045zzudjgwf19q8	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsf70048zzudx5mf148q	83278579	FIOLA SEPTIANA RAMADANI	1970-01-01 00:00:00	Jl. Sudirman No. 90	81234567936	fiolaseptianaramadani@cbt.com	AKTIF	2025-12-28 12:58:42.211	2025-12-28 12:58:42.211	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjsf20047zzudhrpua5kx	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsgr004azzud7m9k2d5w	91017410	FIQI ADITIA	1970-01-01 00:00:00	Jl. Sudirman No. 91	81234567937	fiqiaditia@cbt.com	AKTIF	2025-12-28 12:58:42.266	2025-12-28 12:58:42.266	\N	cmjpqj7wf000bzzudxli3p2cu	cmjpqjsgm0049zzudbwni25mc	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsi9004czzudxeo9b3d2	73255473	FITRIANA EKA AMELIA	1970-01-01 00:00:00	Jl. Sudirman No. 92	81234567938	fitrianaekaamelia@cbt.com	AKTIF	2025-12-28 12:58:42.321	2025-12-28 12:58:42.321	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjsi6004bzzudog6a0j1w	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsjt004ezzud8sllv773	81943244	HERNANDA WILDAN FIRDAUSI	1970-01-01 00:00:00	Jl. Sudirman No. 93	81234567939	hernandawildanfirdausi@cbt.com	AKTIF	2025-12-28 12:58:42.376	2025-12-28 12:58:42.376	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjsjo004dzzudhps08l2v	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjslc004gzzud03l1dobt	91150081	HUMAM FAUZI YANTO	1970-01-01 00:00:00	Jl. Sudirman No. 94	81234567940	example7@cbt.com	AKTIF	2025-12-28 12:58:42.432	2025-12-28 12:58:42.432	\N	cmjpqj7vu0007zzudh3nwc45f	cmjpqjsl8004fzzudfceml7a6	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsmx004izzudt941021b	82276835	ICHA JUWITA	1970-01-01 00:00:00	Jl. Sudirman No. 95	81234567941	ichajuwita@cbt.com	AKTIF	2025-12-28 12:58:42.488	2025-12-28 12:58:42.488	\N	cmjpqj7wf000bzzudxli3p2cu	cmjpqjsms004hzzudc1tmjzu6	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsof004kzzud0lfda9o9	83877893	INA AZRIANA DEVI	1970-01-01 00:00:00	Jl. Sudirman No. 96	81234567942	inaazrianadevi@cbt.com	AKTIF	2025-12-28 12:58:42.543	2025-12-28 12:58:42.543	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjsob004jzzudhvfd9omo	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjspz004mzzudfxhih2ov	3083956550	INTAN BALQIS HUMAIRO	1970-01-01 00:00:00	Jl. Sudirman No. 97	81234567943	intanbalqishumairo@cbt.com	AKTIF	2025-12-28 12:58:42.598	2025-12-28 12:58:42.598	\N	cmjpqj7wf000bzzudxli3p2cu	cmjpqjspu004lzzudyhx1wu1e	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsrh004ozzud9u92gs8a	93398824	JENI EKA NURSABELA	1970-01-01 00:00:00	Jl. Sudirman No. 98	81234567944	jeniekanursabela@cbt.com	AKTIF	2025-12-28 12:58:42.653	2025-12-28 12:58:42.653	\N	cmjpqj7w40009zzudlasvla8v	cmjpqjsre004nzzudt76ldtdp	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjst0004qzzudk1mnhnir	27420464	JESEN ARDIYANTO	1970-01-01 00:00:00	Jl. Sudirman No. 99	81234567945	jesenardiyanto@cbt.com	AKTIF	2025-12-28 12:58:42.708	2025-12-28 12:58:42.708	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjssw004pzzudtbcfrv99	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsui004szzud066ll1wg	71482878	JESIKA MARTA AL-ZAHRA	1970-01-01 00:00:00	Jl. Sudirman No. 100	81234567946	jesikamartaal-zahra@cbt.com	AKTIF	2025-12-28 12:58:42.762	2025-12-28 12:58:42.762	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjsue004rzzudv64mizbj	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsw2004uzzudckc4jbq3	84405603	JOSHUA BAGUS NUGROHO	1970-01-01 00:00:00	Jl. Sudirman No. 101	81234567947	joshuabagusnugroho@cbt.com	AKTIF	2025-12-28 12:58:42.817	2025-12-28 12:58:42.817	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjsvx004tzzudruv25lo9	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsxk004wzzudqqclewhw	98437959	KETUT DIMAS MUHAMAD RISAL	1970-01-01 00:00:00	Jl. Sudirman No. 102	81234567948	example17@cbt.com	AKTIF	2025-12-28 12:58:42.872	2025-12-28 12:58:42.872	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqjsxg004vzzudciths08d	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjsz4004yzzud45e0agu8	3102507572	KEVIN MAULANA ISHAQ	1970-01-01 00:00:00	Jl. Sudirman No. 103	81234567949	example8@cbt.com	AKTIF	2025-12-28 12:58:42.928	2025-12-28 12:58:42.928	\N	cmjpqj7vu0007zzudh3nwc45f	cmjpqjsz0004xzzudxnfb7dbe	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjt0n0050zzud7bqzi30u	72745125	KHAIRUL RIZAL FAUZI TUKIMIN	1970-01-01 00:00:00	Jl. Sudirman No. 104	81234567950	khairulrizalfauzitukimin@cbt.com	AKTIF	2025-12-28 12:58:42.982	2025-12-28 12:58:42.982	\N	cmjpqj7wv000dzzudhlu3phi8	cmjpqjt0j004zzzudvzl11epu	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjt270052zzudwtuzzlwl	76188634	KHALUD SAIFUL ANWAR	1970-01-01 00:00:00	Jl. Sudirman No. 105	81234567951	khaludsaifulanwar@cbt.com	AKTIF	2025-12-28 12:58:43.038	2025-12-28 12:58:43.038	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjt220051zzudneh3e376	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjt3p0054zzudgvc2e0z4	82219934	LIANA RANTIKA PUTRI	1970-01-01 00:00:00	Jl. Sudirman No. 106	81234567952	lianarantikaputri@cbt.com	AKTIF	2025-12-28 12:58:43.093	2025-12-28 12:58:43.093	\N	cmjpqj7w40009zzudlasvla8v	cmjpqjt3l0053zzudy6lmqs6h	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjt5a0056zzudmaakjsy9	81662471	LIVIAN AYUNING UTAMI	1970-01-01 00:00:00	Jl. Sudirman No. 107	81234567953	livianayuningutami@cbt.com	AKTIF	2025-12-28 12:58:43.149	2025-12-28 12:58:43.149	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjt550055zzudgql87di2	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjt6s0058zzuds4jxz958	94280655	LUCKY ADITYA PRATAMA	1970-01-01 00:00:00	Jl. Sudirman No. 108	81234567954	luckyadityapratama@cbt.com	AKTIF	2025-12-28 12:58:43.204	2025-12-28 12:58:43.204	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjt6o0057zzudaawyb04z	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjt8c005azzud9hiz3zbd	67491019	LUKMAN AFANDI	1970-01-01 00:00:00	Jl. Sudirman No. 109	81234567955	lukmanafandi@cbt.com	AKTIF	2025-12-28 12:58:43.259	2025-12-28 12:58:43.259	\N	cmjpqj7wv000dzzudhlu3phi8	cmjpqjt870059zzudck94vyiw	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjt9u005czzudqk4246fl	3088988176	M. BAGAS SANTOSO	1970-01-01 00:00:00	Jl. Sudirman No. 110	81234567956	mbagassantoso@cbt.com	AKTIF	2025-12-28 12:58:43.313	2025-12-28 12:58:43.313	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjt9q005bzzud3ukyt5nx	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtbe005ezzudopiect4w	3088352964	M. BAGUS SATRIO	1970-01-01 00:00:00	Jl. Sudirman No. 111	81234567957	mbagussatrio@cbt.com	AKTIF	2025-12-28 12:58:43.369	2025-12-28 12:58:43.369	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjtb9005dzzudqrqp58pm	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtcw005gzzuda6c3yag2	97802751	M. SAIFURROSI	1970-01-01 00:00:00	Jl. Sudirman No. 112	81234567958	example9@cbt.com	AKTIF	2025-12-28 12:58:43.423	2025-12-28 12:58:43.423	\N	cmjpqj7vu0007zzudh3nwc45f	cmjpqjtcs005fzzudi9o00jt8	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjteg005izzudba8swh99	93234409	M. YUSRON GINANDA	1970-01-01 00:00:00	Jl. Sudirman No. 113	81234567959	example18@cbt.com	AKTIF	2025-12-28 12:58:43.479	2025-12-28 12:58:43.479	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqjtea005hzzudj3vnu2n8	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtfx005kzzud6q32my71	78252676	MARCEL GALIH GINANJAR	1970-01-01 00:00:00	Jl. Sudirman No. 114	81234567960	marcelgalihginanjar@cbt.com	AKTIF	2025-12-28 12:58:43.533	2025-12-28 12:58:43.533	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjtft005jzzud8686r7p8	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjthi005mzzud0emzmkwp	81962676	MAZELLO ITO AFRIANZIE	1970-01-01 00:00:00	Jl. Sudirman No. 115	81234567961	mazelloitoafrianzie@cbt.com	AKTIF	2025-12-28 12:58:43.589	2025-12-28 12:58:43.589	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjthc005lzzud3ptnvxde	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtj1005ozzudkukrid3g	29537229	MINEL ASARI	1970-01-01 00:00:00	Jl. Sudirman No. 116	81234567962	minelasari@cbt.com	AKTIF	2025-12-28 12:58:43.645	2025-12-28 12:58:43.645	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjtiw005nzzud5opakkld	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtkl005qzzud4f3kgvxc	82560328	MOH. AMAR MA'RUF	1970-01-01 00:00:00	Jl. Sudirman No. 117	81234567963	example10000@example.com	AKTIF	2025-12-28 12:58:43.701	2025-12-28 12:58:43.701	\N	cmjpqj7vu0007zzudh3nwc45f	cmjpqjtkg005pzzudgdx10yrb	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtm4005szzudwb5wluye	94760422	MOH. BAYU AINURROHMAN	1970-01-01 00:00:00	Jl. Sudirman No. 118	81234567964	mohbayuainurrohman@cbt.com	AKTIF	2025-12-28 12:58:43.755	2025-12-28 12:58:43.755	\N	cmjpqj7wf000bzzudxli3p2cu	cmjpqjtm0005rzzuds23bjr5x	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtnn005uzzud2tu8sojs	3093129285	MOH. RADITH MUSTOFA	1970-01-01 00:00:00	Jl. Sudirman No. 119	81234567965	example10@cbt.com	AKTIF	2025-12-28 12:58:43.811	2025-12-28 12:58:43.811	\N	cmjpqj7vu0007zzudh3nwc45f	cmjpqjtnk005tzzudk50ir2c3	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtp7005wzzudlxfu8nvr	78005721	MOHAMMAD ZIDAN MAULANA	1970-01-01 00:00:00	Jl. Sudirman No. 120	81234567966	mohammadzidanmaulana@cbt.com	AKTIF	2025-12-28 12:58:43.866	2025-12-28 12:58:43.866	\N	cmjpqj7wv000dzzudhlu3phi8	cmjpqjtp2005vzzudxmbx7nlc	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtqq005yzzudi2o3975w	89145134	MUHAMAD RISKI NEO VALENTINO	1970-01-01 00:00:00	Jl. Sudirman No. 121	81234567967	example19@cbt.com	AKTIF	2025-12-28 12:58:43.921	2025-12-28 12:58:43.921	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqjtqm005xzzudalqhedjb	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjts90060zzudlsyvm81x	119631620	MUHAMMAD RIZKI	1970-01-01 00:00:00	Jl. Sudirman No. 122	81234567968	example20@cbt.com	AKTIF	2025-12-28 12:58:43.976	2025-12-28 12:58:43.976	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqjts4005zzzudel7g03vb	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjttr0062zzudcyqruav4	101593710	MUHAMMAD ZAINAL ABIDIN	1970-01-01 00:00:00	Jl. Sudirman No. 123	81234567969	example11@cbt.com	AKTIF	2025-12-28 12:58:44.031	2025-12-28 12:58:44.031	\N	cmjpqj7vu0007zzudh3nwc45f	cmjpqjttn0061zzudqjgm6n28	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtvb0064zzudabitb4nr	83159381	NADIATUZZAHROH	1970-01-01 00:00:00	Jl. Sudirman No. 124	81234567970	nadiatuzzahroh@cbt.com	AKTIF	2025-12-28 12:58:44.086	2025-12-28 12:58:44.086	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjtv70063zzudai7tpf7i	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtwv0066zzudgjjl6nw6	95829771	NAUFAL DZAKI HANIF ABIYYI	1970-01-01 00:00:00	Jl. Sudirman No. 125	81234567971	example21@cbt.com	AKTIF	2025-12-28 12:58:44.141	2025-12-28 12:58:44.141	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqjtwp0065zzud29ds3g36	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtyf0068zzudpkgfy56w	74347595	NAYSILA NADINE CEYSEANA	1970-01-01 00:00:00	Jl. Sudirman No. 126	81234567972	naysilanadineceyseana@cbt.com	AKTIF	2025-12-28 12:58:44.198	2025-12-28 12:58:44.198	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjtya0067zzudy02nk9hn	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjtzx006azzuda4fv668e	89544490	NOUVAL YURI SAPUTRA	1970-01-01 00:00:00	Jl. Sudirman No. 127	81234567973	nouvalyurisaputra@cbt.com	AKTIF	2025-12-28 12:58:44.252	2025-12-28 12:58:44.252	\N	cmjpqj7wv000dzzudhlu3phi8	cmjpqjtzt0069zzudb1lx1g6i	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqju1h006czzudvqxeoe72	79295893	NUKE KUSUMA WARDANI	1970-01-01 00:00:00	Jl. Sudirman No. 128	81234567974	nukekusumawardani@cbt.com	AKTIF	2025-12-28 12:58:44.308	2025-12-28 12:58:44.308	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqju1d006bzzudgrkbebvh	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqju2z006ezzud6r0trnmb	78151631	NURHASAN	1970-01-01 00:00:00	Jl. Sudirman No. 129	81234567975	example27@cbt.com	AKTIF	2025-12-28 12:58:44.363	2025-12-28 12:58:44.363	\N	cmjpqj7vl0006zzud190ad32k	cmjpqju2v006dzzudtmqsdo43	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqju4j006gzzudi3kgm4dw	65243793	PHILIPUS JAYA BALAN RAKASIWI	1970-01-01 00:00:00	Jl. Sudirman No. 130	81234567976	philipusjayabalanrakasiwi@cbt.com	AKTIF	2025-12-28 12:58:44.418	2025-12-28 12:58:44.418	\N	cmjpqj7wa000azzud7xerd64t	cmjpqju4e006fzzud4h07l0v4	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqju61006izzudy73rtlsv	78440641	RAHMAD FIRMANSYAH	1970-01-01 00:00:00	Jl. Sudirman No. 131	81234567977	rahmadfirmansyah@cbt.com	AKTIF	2025-12-28 12:58:44.473	2025-12-28 12:58:44.473	\N	cmjpqj7wv000dzzudhlu3phi8	cmjpqju5x006hzzuds764d0xb	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqju7k006kzzudmwu7iv99	81034228	RAVADAL ADHA	1970-01-01 00:00:00	Jl. Sudirman No. 132	81234567978	ravadaladha@cbt.com	AKTIF	2025-12-28 12:58:44.528	2025-12-28 12:58:44.528	\N	cmjpqj7w40009zzudlasvla8v	cmjpqju7g006jzzudmu10wprh	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqju93006mzzud3z6z4qza	99114829	RAZKY GABRIL WAHYUDI	1970-01-01 00:00:00	Jl. Sudirman No. 133	81234567979	example22@cbt.com	AKTIF	2025-12-28 12:58:44.582	2025-12-28 12:58:44.582	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqju8y006lzzud1gqdfn27	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjuam006ozzudmk6do0kc	71528590	REZY ANGGARA BAHARI	1970-01-01 00:00:00	Jl. Sudirman No. 134	81234567980	rezyanggarabahari@cbt.com	AKTIF	2025-12-28 12:58:44.638	2025-12-28 12:58:44.638	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjuai006nzzudgdu61y3h	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjuc6006qzzudxil0hjkt	98069279	RIDHO IRWANSYAH	1970-01-01 00:00:00	Jl. Sudirman No. 135	81234567981	ridhoirwansyah@cbt.com	AKTIF	2025-12-28 12:58:44.693	2025-12-28 12:58:44.693	\N	cmjpqj7wf000bzzudxli3p2cu	cmjpqjuc2006pzzudh3vhakb5	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjudr006szzudhkmqn0lo	82598502	RIVA ADITYA PUTRA	1970-01-01 00:00:00	Jl. Sudirman No. 136	81234567982	rivaadityaputra@cbt.com	AKTIF	2025-12-28 12:58:44.75	2025-12-28 12:58:44.75	\N	cmjpqj7wa000azzud7xerd64t	cmjpqjudm006rzzudi2guoa6g	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjuf9006uzzud28itclbc	109444333	RIZKY WIDODO	1970-01-01 00:00:00	Jl. Sudirman No. 137	81234567983	example23@cbt.com	AKTIF	2025-12-28 12:58:44.805	2025-12-28 12:58:44.805	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqjuf6006tzzudi5gxnomx	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjugt006wzzud066tikhm	77627927	SEPTIA IRFAN RAMADHAN	1970-01-01 00:00:00	Jl. Sudirman No. 138	81234567984	septiairfanramadhan@cbt.com	AKTIF	2025-12-28 12:58:44.86	2025-12-28 12:58:44.86	\N	cmjpqj7wv000dzzudhlu3phi8	cmjpqjugp006vzzudt5zhgnk6	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjuic006yzzudrzhdc5kt	113396361	SUPRIYADI	1970-01-01 00:00:00	Jl. Sudirman No. 139	81234567985	example24@cbt.com	AKTIF	2025-12-28 12:58:44.915	2025-12-28 12:58:44.915	\N	cmjpqj7vz0008zzuddij02zp9	cmjpqjui8006xzzudb0pjr3v1	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjujv0070zzudn9edqnq8	86217954	TESYA HERLIANA	1970-01-01 00:00:00	Jl. Sudirman No. 140	81234567986	tesyaherliana@cbt.com	AKTIF	2025-12-28 12:58:44.971	2025-12-28 12:58:44.971	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjujr006zzzudynrhlctk	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjuld0072zzudbqvwdqko	75001728	WISNU MAULANA	1970-01-01 00:00:00	Jl. Sudirman No. 141	81234567987	wisnumaulana@cbt.com	AKTIF	2025-12-28 12:58:45.025	2025-12-28 12:58:45.025	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjul90071zzudpz4mpyl9	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjumx0074zzud6a28ksk9	83757487	WULAN FEBRIYANTI	1970-01-01 00:00:00	Jl. Sudirman No. 142	81234567988	wulanfebriyanti@cbt.com	AKTIF	2025-12-28 12:58:45.08	2025-12-28 12:58:45.08	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjums0073zzudtp9woqe0	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjuof0076zzudp9tdp6tc	88579651	YEHEZKIEL KEVIN RAHARJO	1970-01-01 00:00:00	Jl. Sudirman No. 143	81234567989	yehezkielkevinraharjo@cbt.com	AKTIF	2025-12-28 12:58:45.135	2025-12-28 12:58:45.135	\N	cmjpqj7x0000ezzud73qdbsab	cmjpqjuob0075zzud36q7u0ej	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjuq20078zzudwviu6418	79467322	YOHANES DWI PRAYOGA	1970-01-01 00:00:00	Jl. Sudirman No. 144	81234567990	yohanesdwiprayoga@cbt.com	AKTIF	2025-12-28 12:58:45.193	2025-12-28 12:58:45.193	\N	cmjpqj7wv000dzzudhlu3phi8	cmjpqjupy0077zzud6gakdwu9	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjurk007azzudrhnr0tzd	97561362	YUDA WIRASA	1970-01-01 00:00:00	Jl. Sudirman No. 145	81234567991	example28@cbt.com	AKTIF	2025-12-28 12:58:45.248	2025-12-28 12:58:45.248	\N	cmjpqj7vl0006zzud190ad32k	cmjpqjurg0079zzud3rlh8olp	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
cmjpqjut4007czzud7iwjbdd3	71347347	YULI YATIMAH	1970-01-01 00:00:00	Jl. Sudirman No. 146	81234567992	yuliyatimah@cbt.com	AKTIF	2025-12-28 12:58:45.303	2025-12-28 12:58:45.303	\N	cmjpqj7wl000czzudn8unt2eu	cmjpqjusz007bzzuddp1306xi	c117abae-ebb8-4598-a4b0-e01a597eacc0	\N
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
c117abae-ebb8-4598-a4b0-e01a597eacc0	2024/2025	2024-07-01 00:00:00	2024-12-31 00:00:00	AKTIF	2025-12-28 12:55:24.183	2025-12-28 12:55:24.183	\N
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
cmjpqjge9001dzzud3wcy1ldy	purwantisiska25@gmail.com	Siska Purwanti, S.E.	2025-12-28 12:58:26.625	2025-12-28 12:58:26.625	$2b$10$DCRbW4biCP4ttXvLTZWT9.kZDd0KSCUKyZSklbS6HkPCktiexzXFK	GURU
cmjpqjgfu001fzzudo6bdeiz6	rizalpecintaseni@gmail.com	Syamsul Rizal, S.Pd.I.	2025-12-28 12:58:26.682	2025-12-28 12:58:26.682	$2b$10$GYyb.rteIkBDTtbz0oNX0umwNv3d2EYXut0NRtdL0IL1khXZOwAyO	GURU
cmjpqjghc001hzzud8bxgsy1g	udayaniprayuda@gmail.com	Udayani, S.Pd.	2025-12-28 12:58:26.736	2025-12-28 12:58:26.736	$2b$10$ptCSOY24oBq5v7ju1tifQORESIQYAN/J7PuYq9726lSAzt.kz.pSm	GURU
cmjpqjgit001jzzudg5dvjn9z	wahyumirnawati30@gmail.com	Wahyu Mirnawati, S.Ak.	2025-12-28 12:58:26.789	2025-12-28 12:58:26.789	$2b$10$7sxv4NUQWDI2TGGbFmhCB.AKSiWO/K7q1ZaJxXwXcHlFNl0DYpmAG	GURU
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
cmjpqjgkb001lzzudf7awrgbn	zulfiamaliyah1306@gmail.com	Zulfi Amaliyah, S.Kom	2025-12-28 12:58:26.843	2025-12-29 13:26:54.371	$2b$10$Lhq6tzqJslwfceAjauIMqOBsCQHh4ivt97f3RX5y02bl0luPlTI5m	GURU
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
cmjpqjs2s003rzzudbg2xwq7p	dwisintiaputri@cbt.com	DWI SINTIA PUTRI	2025-12-28 12:58:41.764	2025-12-28 12:58:41.764	$2b$10$rZeF7npidiPgmcwVaTein.i5loV224BMN9DtgBmKmsWV7IOJUpE1y	SISWA
cmjpqjs4b003tzzudosxhuf2i	ekadeviainurohma@cbt.com	EKA DEVI AINUROHMA	2025-12-28 12:58:41.819	2025-12-28 12:58:41.819	$2b$10$A.G4Zz2tAmhDKXFEyq7wg.ekSaqh9qOLG/AxF3wqpzXP.0lZb0BRu	SISWA
cmjpqjs5v003vzzud19rtvkkh	enggardwiprasetyo@cbt.com	ENGGAR DWI PRASETYO	2025-12-28 12:58:41.875	2025-12-28 12:58:41.875	$2b$10$3enqv5OTKV.SMbaseBJ/N.YAkiq8CcJVq212.5weRm3HEz3z.4.s.	SISWA
cmjpqjs7e003xzzud077zwzv9	esaagilputra@cbt.com	ESA AGIL PUTRA	2025-12-28 12:58:41.93	2025-12-28 12:58:41.93	$2b$10$m4OYAO3cA45T6ldlK5ywd.9l9O4VTvzrwxCupiUFaN0AKOeSeooyy	SISWA
cmjpqjs8w003zzzudm7vz9efw	fahmiadliyanto@cbt.com	FAHMI ADLIYANTO	2025-12-28 12:58:41.984	2025-12-28 12:58:41.984	$2b$10$iwg3UFjkpyZWnoZbc1dux.ngA4CAqZ7r1VeVUgIk08fhB1Y8m3ihG	SISWA
cmjpqjsaf0041zzudezczzva4	fareladityaputra@cbt.com	FAREL ADITYA PUTRA	2025-12-28 12:58:42.039	2025-12-28 12:58:42.039	$2b$10$ezO3Sq3S6JXSUrX5QVjV.u/bFema2/paaXyuOjipXXz.aFETKSa8a	SISWA
cmjpqjsc00043zzud232qhcuo	faturrohman@cbt.com	FATURROHMAN	2025-12-28 12:58:42.095	2025-12-28 12:58:42.095	$2b$10$kJc20N0HZWtHNatWL173M.4VCmHXPTCZ5br05H81MxazPGI.cYkS2	SISWA
cmjpqjsdj0045zzudjgwf19q8	example16@cbt.com	FERDIO PUTRA PRASETYA	2025-12-28 12:58:42.151	2025-12-28 12:58:42.151	$2b$10$VaONfBQXLoeBAzUtIVWaI.FgtpMMIlQcc/c/440IZwh1wXyCHo6OW	SISWA
cmjpqjsf20047zzudhrpua5kx	fiolaseptianaramadani@cbt.com	FIOLA SEPTIANA RAMADANI	2025-12-28 12:58:42.206	2025-12-28 12:58:42.206	$2b$10$qTxuEHRPMS9vHEWX8pEL/ed7bX5WP7m2cV42mUaaJNiht8xgCNUA.	SISWA
cmjpqjsgm0049zzudbwni25mc	fiqiaditia@cbt.com	FIQI ADITIA	2025-12-28 12:58:42.262	2025-12-28 12:58:42.262	$2b$10$58dR0VwDYGW2ARFCdg.IxO6gKMoW5PzYzTqne9rwt/.sFjdm.G81u	SISWA
cmjpqjsi6004bzzudog6a0j1w	fitrianaekaamelia@cbt.com	FITRIANA EKA AMELIA	2025-12-28 12:58:42.317	2025-12-28 12:58:42.317	$2b$10$ApGdSZHhZLLq0sIoiHk7NOLrwuNTxDvoJ0Js1ZhSeJmrMQXSrxGAy	SISWA
cmjpqjsjo004dzzudhps08l2v	hernandawildanfirdausi@cbt.com	HERNANDA WILDAN FIRDAUSI	2025-12-28 12:58:42.372	2025-12-28 12:58:42.372	$2b$10$euY6O/7XxBnHUEwIzOfBXeO9PQbXksatBK/FeH49B4IsUsAI3QX/W	SISWA
cmjpqjsl8004fzzudfceml7a6	example7@cbt.com	HUMAM FAUZI YANTO	2025-12-28 12:58:42.428	2025-12-28 12:58:42.428	$2b$10$nvWP9r4uerlLU7rUZBxOZOwUydYmjlubLcFBqyAHB0SP4BYfPrMRO	SISWA
cmjpqjsms004hzzudc1tmjzu6	ichajuwita@cbt.com	ICHA JUWITA	2025-12-28 12:58:42.484	2025-12-28 12:58:42.484	$2b$10$w69JoIrjDOsT.fXR4jYOiuwrwegjnGH.MIzRVDuwu5SEKSBtB.4WS	SISWA
cmjpqjsob004jzzudhvfd9omo	inaazrianadevi@cbt.com	INA AZRIANA DEVI	2025-12-28 12:58:42.539	2025-12-28 12:58:42.539	$2b$10$P80K8HznSruYv9.4YcDaoeP9i6CJSRkDpdEZONhSX/voaJNdRd8ce	SISWA
cmjpqjspu004lzzudyhx1wu1e	intanbalqishumairo@cbt.com	INTAN BALQIS HUMAIRO	2025-12-28 12:58:42.594	2025-12-28 12:58:42.594	$2b$10$Ay71tTbp3BI2fxz44EaMD.ogMB8mN5M19CEkSaXzcNjE.n7p9niA6	SISWA
cmjpqjsre004nzzudt76ldtdp	jeniekanursabela@cbt.com	JENI EKA NURSABELA	2025-12-28 12:58:42.65	2025-12-28 12:58:42.65	$2b$10$C961xVtuhs6dNjSm.fV4TOn7.8gH9Y21BYgSInirqK..XXaCAoeGK	SISWA
cmjpqjssw004pzzudtbcfrv99	jesenardiyanto@cbt.com	JESEN ARDIYANTO	2025-12-28 12:58:42.704	2025-12-28 12:58:42.704	$2b$10$7WxJzWS6WKpNUufVSEhgKu7X.ExiUUukL..xJAMy3ZIpOTrpEUCY6	SISWA
cmjpqjsue004rzzudv64mizbj	jesikamartaal-zahra@cbt.com	JESIKA MARTA AL-ZAHRA	2025-12-28 12:58:42.758	2025-12-28 12:58:42.758	$2b$10$sU8y1e6YMhiTo/hgLv40MuFI58SwwaApO3Q56mZooVS.0fHiCP6B.	SISWA
cmjpqjsvx004tzzudruv25lo9	joshuabagusnugroho@cbt.com	JOSHUA BAGUS NUGROHO	2025-12-28 12:58:42.813	2025-12-28 12:58:42.813	$2b$10$KNNJQSPYZutF48dIKd9rDOe1E4NmV9g23r0acrCvbEIGdf/SdcCby	SISWA
cmjpqjsxg004vzzudciths08d	example17@cbt.com	KETUT DIMAS MUHAMAD RISAL	2025-12-28 12:58:42.868	2025-12-28 12:58:42.868	$2b$10$Zrg39v3IjdSEAOqNQDowQOKzJfdxDBe803b9Xp2q4Y41h84Bp8S2y	SISWA
cmjpqjsz0004xzzudxnfb7dbe	example8@cbt.com	KEVIN MAULANA ISHAQ	2025-12-28 12:58:42.924	2025-12-28 12:58:42.924	$2b$10$BrxacqwnIWwuBqu12MjSye2vNjEhccgVNyUJVTCRdV8dR9yv6aaMm	SISWA
cmjpqjt0j004zzzudvzl11epu	khairulrizalfauzitukimin@cbt.com	KHAIRUL RIZAL FAUZI TUKIMIN	2025-12-28 12:58:42.979	2025-12-28 12:58:42.979	$2b$10$Vi/e.v9SHrpCtOj1EG2H3eAVYrqd2NGRRm6EqaqG9uQI1K0q8FlRu	SISWA
cmjpqjt220051zzudneh3e376	khaludsaifulanwar@cbt.com	KHALUD SAIFUL ANWAR	2025-12-28 12:58:43.034	2025-12-28 12:58:43.034	$2b$10$DKpasJOaCn9e1yf8C/PWkeeQgxjQdsVr8yCQ9twoaJIq4m0CyFJ/.	SISWA
cmjpqjt3l0053zzudy6lmqs6h	lianarantikaputri@cbt.com	LIANA RANTIKA PUTRI	2025-12-28 12:58:43.089	2025-12-28 12:58:43.089	$2b$10$tKNarso/gZpf98Qcg9Ia7uttAIAW5e3bjhZELSD7XgVy7zFa0LjaC	SISWA
cmjpqjt550055zzudgql87di2	livianayuningutami@cbt.com	LIVIAN AYUNING UTAMI	2025-12-28 12:58:43.145	2025-12-28 12:58:43.145	$2b$10$uJxYF5/3W6MY9S59GY/piu.u/RTdINNLemyGM0SsctmuvKO65fqwK	SISWA
cmjpqjt6o0057zzudaawyb04z	luckyadityapratama@cbt.com	LUCKY ADITYA PRATAMA	2025-12-28 12:58:43.2	2025-12-28 12:58:43.2	$2b$10$cHyi7gb6DEjTza2HkLI/sOqnb71QmlLXDtnjPzNLxLQjDlNE3DNLm	SISWA
cmjpqjt870059zzudck94vyiw	lukmanafandi@cbt.com	LUKMAN AFANDI	2025-12-28 12:58:43.255	2025-12-28 12:58:43.255	$2b$10$RpVa6YQJB.nkUe5lwquXxu/m2Usxj4WImIXSkHI.qJqzq6Mrno9Ra	SISWA
cmjpqjt9q005bzzud3ukyt5nx	mbagassantoso@cbt.com	M. BAGAS SANTOSO	2025-12-28 12:58:43.31	2025-12-28 12:58:43.31	$2b$10$.OuyoxX5DvOBJ22YPZ2IDe3XKpkiKjYCpjX3B4uYpWzF/9Q81im4G	SISWA
cmjpqjtb9005dzzudqrqp58pm	mbagussatrio@cbt.com	M. BAGUS SATRIO	2025-12-28 12:58:43.365	2025-12-28 12:58:43.365	$2b$10$T4f98ZAcogZxwnhxmStvqev4DCspgQWcnSpGdsuF1WYb5pJkIdnuu	SISWA
cmjpqjtcs005fzzudi9o00jt8	example9@cbt.com	M. SAIFURROSI	2025-12-28 12:58:43.42	2025-12-28 12:58:43.42	$2b$10$VCInWl3qBnWKqMGWmMDHYeHUc4uC5e3378ZfUoNQowKupJpyDpqli	SISWA
cmjpqjtea005hzzudj3vnu2n8	example18@cbt.com	M. YUSRON GINANDA	2025-12-28 12:58:43.474	2025-12-28 12:58:43.474	$2b$10$UwmO389EdhmWDZqZxrwjuusAPwN0KI8vXMJXV/9xHlp3jATRPeSlu	SISWA
cmjpqjtft005jzzud8686r7p8	marcelgalihginanjar@cbt.com	MARCEL GALIH GINANJAR	2025-12-28 12:58:43.529	2025-12-28 12:58:43.529	$2b$10$iOm.IQ0vaZeMJN5hnjB1GOiGjD7NPX5SyuV.0Rhwczl2gZ.JIqHBu	SISWA
cmjpqjthc005lzzud3ptnvxde	mazelloitoafrianzie@cbt.com	MAZELLO ITO AFRIANZIE	2025-12-28 12:58:43.584	2025-12-28 12:58:43.584	$2b$10$fFljJkeRjnnBk6aOG.rfXeUoNcCYLkOq/FPhF3MuRUv/ZWgRB/SFi	SISWA
cmjpqjtiw005nzzud5opakkld	minelasari@cbt.com	MINEL ASARI	2025-12-28 12:58:43.64	2025-12-28 12:58:43.64	$2b$10$1rafZ0LOP/k7eOjbc2JmXubFKX6lSks6BBKgqZcDicb9l8AqxPmjS	SISWA
cmjpqjtkg005pzzudgdx10yrb	example10000@example.com	MOH. AMAR MA'RUF	2025-12-28 12:58:43.696	2025-12-28 12:58:43.696	$2b$10$0FPK8JRZz1jZA5WBERkvSO4IbgoiZr2bfYQ.YWsigvZSx4ihyIcBK	SISWA
cmjpqjtm0005rzzuds23bjr5x	mohbayuainurrohman@cbt.com	MOH. BAYU AINURROHMAN	2025-12-28 12:58:43.752	2025-12-28 12:58:43.752	$2b$10$5Eek4aqAJ/pYjNg8/nrLrOk/PZcWtjdGKTSQlbry9kE78G/YK0Du2	SISWA
cmjpqjtnk005tzzudk50ir2c3	example10@cbt.com	MOH. RADITH MUSTOFA	2025-12-28 12:58:43.807	2025-12-28 12:58:43.807	$2b$10$uX09R64sHhNz.fhHJRC0nucZgVPi9DaYemtxvWmXdDO/d8rGYskoq	SISWA
cmjpqjtp2005vzzudxmbx7nlc	mohammadzidanmaulana@cbt.com	MOHAMMAD ZIDAN MAULANA	2025-12-28 12:58:43.862	2025-12-28 12:58:43.862	$2b$10$aPpP1sraqu/2xwb2ChHh/uUz.sLWRr6mrg1EadZR7MxkHHQvudJn2	SISWA
cmjpqjtqm005xzzudalqhedjb	example19@cbt.com	MUHAMAD RISKI NEO VALENTINO	2025-12-28 12:58:43.918	2025-12-28 12:58:43.918	$2b$10$iEUZsZiq4xqWcLc87Y6r4.1AS2CGDf//rA7lXcoDlqNsgY2KpuUNu	SISWA
cmjpqjts4005zzzudel7g03vb	example20@cbt.com	MUHAMMAD RIZKI	2025-12-28 12:58:43.972	2025-12-28 12:58:43.972	$2b$10$GQmO6f4n94dakkC/nLkggOYTfJI/7lsRHPU7C0H.LaL7P3t8m5/qu	SISWA
cmjpqjttn0061zzudqjgm6n28	example11@cbt.com	MUHAMMAD ZAINAL ABIDIN	2025-12-28 12:58:44.027	2025-12-28 12:58:44.027	$2b$10$GXUInzY8WRxPNhHs6HdylOplClhDvRVd6Sf1P1yNz46myaqDbi4XC	SISWA
cmjpqjtv70063zzudai7tpf7i	nadiatuzzahroh@cbt.com	NADIATUZZAHROH	2025-12-28 12:58:44.083	2025-12-28 12:58:44.083	$2b$10$aBod3cgibDfWrEqQmhaIDucQnmjidBiDYcTHpnKj4tLhDhqAKeKWG	SISWA
cmjpqjtwp0065zzud29ds3g36	example21@cbt.com	NAUFAL DZAKI HANIF ABIYYI	2025-12-28 12:58:44.137	2025-12-28 12:58:44.137	$2b$10$o5.rj.cd8pwedJAxs0MKLesfSkvsNYi27gDwE9988a.p6uyIJy0I2	SISWA
cmjpqjtya0067zzudy02nk9hn	naysilanadineceyseana@cbt.com	NAYSILA NADINE CEYSEANA	2025-12-28 12:58:44.194	2025-12-28 12:58:44.194	$2b$10$WpMt/BblJnJ7ZxfoG9xu4OZpYi/iLrfkAFVQw1DlMZC42GHfRjkxy	SISWA
cmjpqjtzt0069zzudb1lx1g6i	nouvalyurisaputra@cbt.com	NOUVAL YURI SAPUTRA	2025-12-28 12:58:44.249	2025-12-28 12:58:44.249	$2b$10$ku1bqpNmk/CCWJB1E4/u4u0OzE4LnTh93GYl11NTjrISLRYooQJvm	SISWA
cmjpqju1d006bzzudgrkbebvh	nukekusumawardani@cbt.com	NUKE KUSUMA WARDANI	2025-12-28 12:58:44.305	2025-12-28 12:58:44.305	$2b$10$oP8ODYD/C6J2cDroWyiMMetmkK/LwucXshWROWQyYI9QSG6kizBTe	SISWA
cmjpqju2v006dzzudtmqsdo43	example27@cbt.com	NURHASAN	2025-12-28 12:58:44.359	2025-12-28 12:58:44.359	$2b$10$T3/xUFvhjdhsK3oiuEZfVepgmrfwqh.TTXYHshW5x0Lh/YNiU0K.u	SISWA
cmjpqju4e006fzzud4h07l0v4	philipusjayabalanrakasiwi@cbt.com	PHILIPUS JAYA BALAN RAKASIWI	2025-12-28 12:58:44.414	2025-12-28 12:58:44.414	$2b$10$KyZQHoKovmTlqFJ/n08/S.QBpzdkHCGq/t6W8.cVqMoC8fzsvYXeK	SISWA
cmjpqju5x006hzzuds764d0xb	rahmadfirmansyah@cbt.com	RAHMAD FIRMANSYAH	2025-12-28 12:58:44.469	2025-12-28 12:58:44.469	$2b$10$YRx/b8B00pSYlvB2FiKbde7hqRQ.BNIBydk54fBWxc2kp1Kabvbcq	SISWA
cmjpqju7g006jzzudmu10wprh	ravadaladha@cbt.com	RAVADAL ADHA	2025-12-28 12:58:44.524	2025-12-28 12:58:44.524	$2b$10$4eyxx43pAM1HV2YxkQJ0cOvttuJOButfj1HW8DJomB.Oh1huQDbXq	SISWA
cmjpqju8y006lzzud1gqdfn27	example22@cbt.com	RAZKY GABRIL WAHYUDI	2025-12-28 12:58:44.578	2025-12-28 12:58:44.578	$2b$10$M8VMymXzBl2q0YgUrEfITekBqoBna/028fl9BVV4VJ664qYS8Q3Vm	SISWA
cmjpqjuai006nzzudgdu61y3h	rezyanggarabahari@cbt.com	REZY ANGGARA BAHARI	2025-12-28 12:58:44.633	2025-12-28 12:58:44.633	$2b$10$7fK/.rMaFGz6qt/PxxzW1.vGI0.POL4jG.QL6N/xqqd068Borr.ra	SISWA
cmjpqjuc2006pzzudh3vhakb5	ridhoirwansyah@cbt.com	RIDHO IRWANSYAH	2025-12-28 12:58:44.69	2025-12-28 12:58:44.69	$2b$10$sWEuUtlFG6UZBRGAnNKOHu1ruJstlhLbbv4z67jeJHSn13gUWFBMm	SISWA
cmjpqjudm006rzzudi2guoa6g	rivaadityaputra@cbt.com	RIVA ADITYA PUTRA	2025-12-28 12:58:44.746	2025-12-28 12:58:44.746	$2b$10$wc15NN.oLY/UBliz7AW1TOUW3v3V.aVRa1rCBg1NotzpeziJ56xsy	SISWA
cmjpqjuf6006tzzudi5gxnomx	example23@cbt.com	RIZKY WIDODO	2025-12-28 12:58:44.802	2025-12-28 12:58:44.802	$2b$10$lrXjkhzdPH7jrPuz8GYhU.EpW0cmAW5V9qETW4VD80o/aC1GF/B5e	SISWA
cmjpqjugp006vzzudt5zhgnk6	septiairfanramadhan@cbt.com	SEPTIA IRFAN RAMADHAN	2025-12-28 12:58:44.857	2025-12-28 12:58:44.857	$2b$10$aeSapE3FM7mQe8TPmhJ10uUbsszr8h7z.5Z0E4VRlP2v/QmtG6X7W	SISWA
cmjpqjui8006xzzudb0pjr3v1	example24@cbt.com	SUPRIYADI	2025-12-28 12:58:44.912	2025-12-28 12:58:44.912	$2b$10$Cn./wSa5b04gyDGaAD/1Sehr9lohVg7120NuN7pFBYjG1MYgCOcR6	SISWA
cmjpqjujr006zzzudynrhlctk	tesyaherliana@cbt.com	TESYA HERLIANA	2025-12-28 12:58:44.967	2025-12-28 12:58:44.967	$2b$10$nVOu31TuFoCjdISzPw4xuuKj0BaMlgfHhwbqH5yv.3uy1.yMMctHi	SISWA
cmjpqjul90071zzudpz4mpyl9	wisnumaulana@cbt.com	WISNU MAULANA	2025-12-28 12:58:45.021	2025-12-28 12:58:45.021	$2b$10$7i0QhIOilm7bitnDLWsmLOTkSA3.HwrSCTbdjafGIvBI3v8JrvhQi	SISWA
cmjpqjums0073zzudtp9woqe0	wulanfebriyanti@cbt.com	WULAN FEBRIYANTI	2025-12-28 12:58:45.076	2025-12-28 12:58:45.076	$2b$10$LL77JOxlzgX8w3SwmtlCeuPxhgWKjfvLdwTgDjqu6sdUSeJa2Maja	SISWA
cmjpqjuob0075zzud36q7u0ej	yehezkielkevinraharjo@cbt.com	YEHEZKIEL KEVIN RAHARJO	2025-12-28 12:58:45.131	2025-12-28 12:58:45.131	$2b$10$HCTCfZ5gAvKr9q/vnBCVJOctApB6vuVQQ5zPfnDwDp8KB2B6iNFKa	SISWA
cmjpqjupy0077zzud6gakdwu9	yohanesdwiprayoga@cbt.com	YOHANES DWI PRAYOGA	2025-12-28 12:58:45.19	2025-12-28 12:58:45.19	$2b$10$ynoJmhawYv5viWdUvPJbS.LVjwlCW8BLFMtx5HhRqB2aIiYGLLosO	SISWA
cmjpqjurg0079zzud3rlh8olp	example28@cbt.com	YUDA WIRASA	2025-12-28 12:58:45.244	2025-12-28 12:58:45.244	$2b$10$5uo6bvERbyUPLR8xfLWM3etpx2ST9kx5kNINNMsCc5bL30ua0klCe	SISWA
cmjpqjusz007bzzuddp1306xi	yuliyatimah@cbt.com	YULI YATIMAH	2025-12-28 12:58:45.299	2025-12-28 12:58:45.299	$2b$10$Fk13nH72bo2SxFXRItZNeeARJWdsSAPmNiYvX.Iu0O7lNfVplb8tu	SISWA
cmjpqjgcr001bzzudxkyeze81	rizkielutfi@gmail.com	Rizky Lutfi Romadona, S.Kom	2025-12-28 12:58:26.571	2025-12-29 13:23:38.279	$2b$10$S3m6m/0ZiWPHFKjw9uT/3OgDrpn6YIlcSUV60Wcj4dut1ELJnmK66	GURU
\.


--
-- Data for Name: _GuruMataPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_GuruMataPelajaran" ("A", "B") FROM stdin;
ainiabdcholis.73@gmail.com	cmjpqkbpy007gzzudy2fpxsyy
zulfiamaliyah1306@gmail.com	cmjpqkbqg007lzzudxvs8tt0m
zulfiamaliyah1306@gmail.com	cmjpqkbr3007szzudz1r9c3mh
zulfiamaliyah1306@gmail.com	cmjpqkbr7007tzzudv3xw71c8
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0f91e93b-d9bd-4686-9aca-212ad051858e	609cb3817046359fc62b69f293e3903cd198aae0f3510bf462c59f9ad4035ff7	2025-12-28 12:55:24.077579+00	20251211102828_init	\N	\N	2025-12-28 12:55:24.068649+00	1
461d49f6-7f79-4ea6-b5a7-b0e814c5f672	0156d098f4db91ff3bbadcc1b79aadb5d97c09871b71938fd4dc6e53391a1532	2025-12-28 12:55:24.303931+00	20251216124905_add_settings_model	\N	\N	2025-12-28 12:55:24.293558+00	1
132da02f-aea2-4c5c-9023-8e6459698c52	2640bf707564a1056f78c31ab21927c3e2ba43ac93d47d3f1ef832ccced34bc8	2025-12-28 12:55:24.086166+00	20251211151758_npm_run_prisma_generate	\N	\N	2025-12-28 12:55:24.07924+00	1
a82f8ee2-68ea-40d4-b7de-2715ddfed8ae	0c7e0d4e778e1cc415cbfd0b3fbe7fdc91ffeb05229bf7599a2ebb8ceb9ffb3e	2025-12-28 12:55:24.119982+00	20251212095857_add_lms_entities	\N	\N	2025-12-28 12:55:24.08953+00	1
70fb6a9a-fc85-40f4-86ce-2ae03f0cdc0d	b43cc7d286cb1c9e4eed35a237d4805ddb2ad96144c39cfb102c2eae959a72e4	2025-12-28 12:55:24.560485+00	20251221112959_add_lms_features	\N	\N	2025-12-28 12:55:24.459775+00	1
57598487-76d3-4daf-8e21-c4395e4bb7cd	750d8a254ceaaf152f260f65242d25249ecaaf9678faa3f041f061007f1ee44d	2025-12-28 12:55:24.14286+00	20251212112639_add_jurusan_and_update_kelas	\N	\N	2025-12-28 12:55:24.121708+00	1
10d412a0-a8c0-4320-8e09-19d99f199d33	8334127d9f47b107a04a7d4f45e7b1a9f28120a32076d8418b80a0fbdd0d7fd3	2025-12-28 12:55:24.317818+00	20251217022933_remove_semester_from_tahun_ajaran	\N	\N	2025-12-28 12:55:24.307622+00	1
e93f4afb-59c7-47e1-b035-4156679e97b7	998edaffc3e7e33bda76f385a440e3df4dbf0428564a2a15763cd5aa26535719	2025-12-28 12:55:24.161128+00	20251212122610_add_many_to_many_guru_mata_pelajaran	\N	\N	2025-12-28 12:55:24.148612+00	1
f2cdcc83-f0c2-47b0-b750-3ffdffcfac9a	92f08fc24273bbcd87412a6494250a94461f6da2ba78cc5cc67527b74e451431	2025-12-28 12:55:24.178234+00	20251212125923_add_user_integration_to_siswa_guru	\N	\N	2025-12-28 12:55:24.163927+00	1
753281eb-3711-4fb0-a8ce-4602bac95e93	2af40a7de13d912e0dc5428dfaad47807ad86bb19d9b998236759c7c6779f568	2025-12-28 12:55:24.190881+00	20251212145913_make_tahun_ajaran_required_in_kelas	\N	\N	2025-12-28 12:55:24.180663+00	1
8f0fc860-2c79-466c-b953-8943fd193e4b	ca56657a42dc94fe3aa791065e17521b02eadc0abb8a196bd6d74998eaca7b18	2025-12-28 12:55:24.365447+00	20251217074227_remove_tingkat_kesulitan	\N	\N	2025-12-28 12:55:24.320128+00	1
32d8603f-35d2-4c14-b84e-43bdc209b9fb	90480c68541aad550a5a12bc2e8485029efc1fb1fa25a9940a1323042c4385e2	2025-12-28 12:55:24.205454+00	20251214051132	\N	\N	2025-12-28 12:55:24.19376+00	1
c1452539-00bd-4489-bfd4-c1651a4f6094	f4eb6ab1a9e0366ad782133ad765d973cb1b2ab0a48a1f7e9034e305b6634ff0	2025-12-28 12:55:24.229113+00	20251214063132_refactor_tahun_ajaran_to_siswa	\N	\N	2025-12-28 12:55:24.208153+00	1
414cf241-3338-4583-8294-fda424f3712c	25d03367cc79cdbff0ec8e1c2d3c33a3b806c75a4e4b1fecd1932f16e476b4e5	2025-12-28 12:55:24.252691+00	20251214084212_add_attendance_model	\N	\N	2025-12-28 12:55:24.231445+00	1
ea9aa2e2-cc79-4a99-8a66-5162f760c804	b49d31efb8891a0baa5b7c1c11b5468cc50c80552ec5a7b78852605d377c5bef	2025-12-28 12:55:24.390887+00	20251217091002_add_paket_soal	\N	\N	2025-12-28 12:55:24.367771+00	1
3fedae59-bd91-4e77-a6e5-a0e88eead9d5	9c5dce6d4875f6332cacf7463b5274add07688e63ce466bb55322ca48798db91	2025-12-28 12:55:24.265692+00	20251216110639_add_petugas_absensi_role	\N	\N	2025-12-28 12:55:24.256096+00	1
b6e8a496-7578-4b3c-abf3-abca9e699ac6	750d3916e193e86a376975d2c2776442d2927c8c75e0e51903d350dd990c2f6b	2025-12-28 12:55:24.276294+00	20251216115114_add_magang_status	\N	\N	2025-12-28 12:55:24.268492+00	1
b0198d57-91e8-4200-b9d1-573318585f83	8b0c125c9e6596cb9e1284407b263669b73ce9632cae5ae62bcf77135a2d8b2a	2025-12-28 12:55:24.575665+00	20251227144854	\N	\N	2025-12-28 12:55:24.56294+00	1
c3d4c526-0fb1-451d-931e-b451400ecceb	da85a17d1e1e9d2f1e72621609dbf630c551db1a7cb10b87199cd81e646623ef	2025-12-28 12:55:24.291363+00	20251216115239_rename_magang_to_pkl	\N	\N	2025-12-28 12:55:24.278402+00	1
43564df7-88f9-4904-b1f2-febe4a65883e	c709d568b3e9f35bfae33784143ab1dc0f924ed7188d7682fe83a2230a1ee496	2025-12-28 12:55:24.407487+00	20251217092251_remove_tingkat_kesulitan	\N	\N	2025-12-28 12:55:24.393375+00	1
76a85ef1-64d8-497c-830e-6714ae5cff37	c8a78ac8421e0546ebf611754745d56f60ef00986d8fbaec0ea700f0b022c21e	2025-12-28 12:55:24.420189+00	20251217092712_add_guru_to_paket_soal	\N	\N	2025-12-28 12:55:24.410257+00	1
38d8a0c5-43c9-4474-be3f-9321669115dc	39e302b56339b64f0b94a36c409a5271427d4159a7bda50059e41db697152c50	2025-12-28 12:55:24.444703+00	20251217114742_add_multi_class_student_selection	\N	\N	2025-12-28 12:55:24.427466+00	1
817f8b66-d8e6-44fc-a05d-c72a5a144bc5	dd18dc80c02140eb9c3d3521d8ec38d7b8cebdd8904ed44e14d9253313ecad58	2025-12-28 12:55:24.597148+00	20251228114822_remove_penjelasan_column	\N	\N	2025-12-28 12:55:24.578298+00	1
931c84ae-407f-4431-9385-50506c974d8a	1e2dc8a2aa1a8521d2ffe0b9e6dc3039cea60c545ec602bdfe0492285e12afd8	2025-12-28 12:55:24.457861+00	20251217120042_add_guru_to_ujian	\N	\N	2025-12-28 12:55:24.447733+00	1
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


--
-- PostgreSQL database dump complete
--

\unrestrict P3Pt0ZNUThbBJf4GFexCdCwCcb1QB0sZ30tQq5DIaO7p102ztsO4HPfkl2DE52j

