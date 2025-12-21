--
-- PostgreSQL database dump
--

\restrict 6PvD4i4ljtHhz6DAleMXNpaMQNknb0jeg0V8uBkMyKTPpVAyJWJ1w8lTJnc8W9o

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
    penjelasan text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
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
    "guruId" text
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
    "updatedAt" timestamp(3) without time zone NOT NULL
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

COPY public."BankSoal" (id, kode, pertanyaan, tipe, "mataPelajaranId", "pilihanJawaban", "jawabanBenar", bobot, penjelasan, "createdAt", "updatedAt", "deletedAt") FROM stdin;
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
cmjfq2i9u0001lpud7edgg6n9	8550751654200000	Aini Abdul Cholis S.Pd.	ainiabdcholis.73@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.145	2025-12-21 12:47:34.145	\N	cmjfq2i9l0000lpud18tskitn
cmjfq2ibg0003lpuds4g2crhg	3449744648300010	Dra. Subur Hindartin	drasuburhindartin@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.203	2025-12-21 12:47:34.203	\N	cmjfq2ibc0002lpudx24estq2
cmjfq2icz0005lpudk0zohn7o	00000000230011444	Dwi Wahyudi, S.T,	yudiaster1922@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.259	2025-12-21 12:47:34.259	\N	cmjfq2icv0004lpudw66gmkt1
cmjfq2ieh0007lpudulpnzohy	3455763666300010	Erlin Novia Diana, S.E.	erlinnoviadiana@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.312	2025-12-21 12:47:34.312	\N	cmjfq2ied0006lpud5xore2pz
cmjfq2ify0009lpudqaf0sfq8	00000000000000022222	Fera Mega Haristina, S.Tr.Kom.	feramegaharistiana@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.366	2025-12-21 12:47:34.366	\N	cmjfq2ifu0008lpudpcu4vhar
cmjfq2ihf000blpuddyb8c64p	0000000023232323	Frances Laurence Setyo Budi, S.Pd.	franceskoyen16@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.419	2025-12-21 12:47:34.419	\N	cmjfq2ihc000alpudz7xmjob2
cmjfq2iix000dlpud0ysd7zc8	00000000000000004	Imtiana, S.Pd	imtianateguh@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.472	2025-12-21 12:47:34.472	\N	cmjfq2iit000clpud92kkrc37
cmjfq2ike000flpuduf67fkte	0000000000000066	M. Fais Jainuddin, S.Pd	faizabrahammalik@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.526	2025-12-21 12:47:34.526	\N	cmjfq2ika000elpudgwo3cxdp
cmjfq2ilv000hlpudakofcoiu	00000000000023235	Moh. Rohim, S.T.	mohrohim02@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.578	2025-12-21 12:47:34.578	\N	cmjfq2ilq000glpudod05400p
cmjfq2inc000jlpuds8blphm7	8834765666130320	Moh. Yunus Ansori, S.Pd.	yunuskacer@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.632	2025-12-21 12:47:34.632	\N	cmjfq2in9000ilpudhd524f9z
cmjfq2iou000llpudsv6t82yw	0000000000000006	Mulyono, S.Th.	danzia22@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.686	2025-12-21 12:47:34.686	\N	cmjfq2ior000klpudcnmdlqss
cmjfq2iqb000nlpud5kc5g99f	5736762663300210	Nunung Indrawati, S.Pd.	nunungindrawati437@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.739	2025-12-21 12:47:34.739	\N	cmjfq2iq8000mlpudga4zac51
cmjfq2irs000plpudmh7m3wkj	5040758659300040	Nurmala Evayanti S.Pd.	nurmalaevayanti2006@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.791	2025-12-21 12:47:34.791	\N	cmjfq2irn000olpudoe53wga3
cmjfq2ita000rlpudv1n6e74r	0000000000000007878	Nurul Hidayah, S.E.	nurulhidayahse485@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.846	2025-12-21 12:47:34.846	\N	cmjfq2it6000qlpud7fxa29mk
cmjfq2iur000tlpudnl7x754l	1201212121212110	Rizky Lutfi Romadona, S.Kom	rizkielutfi@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.898	2025-12-21 12:47:34.898	\N	cmjfq2ium000slpudy2de656c
cmjfq2iw8000vlpudbxzy7sej	00000000000000977	Siska Purwanti, S.E.	purwantisiska25@gmail.com	081234567890	AKTIF	2025-12-21 12:47:34.95	2025-12-21 12:47:34.95	\N	cmjfq2iw3000ulpud4q4ebh8o
cmjfq2ixo000xlpudeobn37px	8549764665110030	Syamsul Rizal, S.Pd.I.	rizalpecintaseni@gmail.com	081234567890	AKTIF	2025-12-21 12:47:35.004	2025-12-21 12:47:35.004	\N	cmjfq2ixl000wlpuddcxlwcdi
cmjfq2iz6000zlpudke9x9jhe	0000000000000010044	Udayani, S.Pd.	udayaniprayuda@gmail.com	081234567890	AKTIF	2025-12-21 12:47:35.058	2025-12-21 12:47:35.058	\N	cmjfq2iz3000ylpudv9amxdpu
cmjfq2j0n0011lpudtew7ku2s	00000000003444211	Wahyu Mirnawati, S.Ak.	wahyumirnawati30@gmail.com	081234567890	AKTIF	2025-12-21 12:47:35.111	2025-12-21 12:47:35.111	\N	cmjfq2j0k0010lpudgrvtpdwm
cmjfq2j240013lpudh4tzgt9i	0000000000000044	Zulfi Amaliyah, S.Kom	zulfiamaliyah1306@gmail.com	081234567890	AKTIF	2025-12-21 12:47:35.164	2025-12-21 12:47:35.164	\N	cmjfq2j210012lpud1vyeuyab
cmjfq2j3n0015lpud8mpdbq7w	00000000000000076	Maulida Putri Lesmana	pa717885@gmail.com	081234567890	AKTIF	2025-12-21 12:47:35.218	2025-12-21 12:47:35.218	\N	cmjfq2j3j0014lpudrf43cuxq
cmjfq2j550017lpudfjrg1459	1234567891	Ila Febti Sherly M., S.E	ilafebtisherly@gmail.com	081234567890	AKTIF	2025-12-21 12:47:35.272	2025-12-21 12:47:35.272	\N	cmjfq2j500016lpudt3312gaz
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
\.


--
-- Data for Name: Kelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "waliKelasId", "jurusanId") FROM stdin;
cmjfriinc000pcxudzodt8dr1	X Akuntansi	X	30	2025-12-21 13:28:00.744	2025-12-21 13:28:00.744	\N	\N	\N
cmjfriini000qcxudly05sni0	XI Akuntansi	XI	30	2025-12-21 13:28:00.75	2025-12-21 13:28:00.75	\N	\N	\N
cmjfriinp000rcxudiifgh0li	XII Akuntansi	XII	30	2025-12-21 13:28:00.757	2025-12-21 13:28:00.757	\N	\N	\N
cmjfriint000scxuduljaoezo	X Teknik Komputer dan Jaringan	X	30	2025-12-21 13:28:00.761	2025-12-21 13:28:00.761	\N	\N	\N
cmjfriinx000tcxudiky0ao13	XI Teknik Komputer dan Jaringan	XI	30	2025-12-21 13:28:00.765	2025-12-21 13:28:00.765	\N	\N	\N
cmjfriio1000ucxudb7fqi0ko	XII Teknik Komputer dan Jaringan	XII	30	2025-12-21 13:28:00.769	2025-12-21 13:28:00.769	\N	\N	\N
cmjfriio6000vcxudiy4y95ej	X Teknik Kendaraan Ringan	X	30	2025-12-21 13:28:00.774	2025-12-21 13:28:00.774	\N	\N	\N
cmjfriioa000wcxudtdcjh7m2	XI Teknik Kendaraan Ringan	XI	30	2025-12-21 13:28:00.778	2025-12-21 13:28:00.778	\N	\N	\N
cmjfriiod000xcxudkxqd4ilk	XII Teknik Kendaraan Ringan	XII	30	2025-12-21 13:28:00.781	2025-12-21 13:28:00.781	\N	\N	\N
\.


--
-- Data for Name: MataPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmjfres7n0000cxudvv6fm7jl	MTK	Matematika	4		SEMUA	2025-12-21 13:25:06.515	2025-12-21 13:25:06.515	\N
cmjfres7w0001cxudcd8h6reu	BIND	Bahasa Indonesia	4		SEMUA	2025-12-21 13:25:06.524	2025-12-21 13:25:06.524	\N
cmjfres800002cxudb03ovv3j	DPK TKJ	Dasar Program Keahlian TKJ	4		SEMUA	2025-12-21 13:25:06.528	2025-12-21 13:25:06.528	\N
cmjfres830003cxudlgoig1zv	Informatika	Informatika	4		SEMUA	2025-12-21 13:25:06.531	2025-12-21 13:25:06.531	\N
cmjfres890004cxudofdahkeb	IPAS	IPAS	4		SEMUA	2025-12-21 13:25:06.537	2025-12-21 13:25:06.537	\N
cmjfres8d0005cxudb1xpbbff	Bahasa Inggris	Bahasa Inggris	4		SEMUA	2025-12-21 13:25:06.541	2025-12-21 13:25:06.541	\N
cmjfres8g0006cxudw7yyvnqh	Sejarah Indonesia	Sejarah Indonesia	4		SEMUA	2025-12-21 13:25:06.544	2025-12-21 13:25:06.544	\N
cmjfres8j0007cxudm2bbmx35	PPKN	Pendidikan Pancasila dan Kewarganegaraan	4		SEMUA	2025-12-21 13:25:06.547	2025-12-21 13:25:06.547	\N
cmjfres8o0008cxuda7eimnrb	PJOK	PJOK	4		SEMUA	2025-12-21 13:25:06.552	2025-12-21 13:25:06.552	\N
cmjfres8r0009cxud7u1x0pzi	PKKWU AK	PKKWU AK	4		SEMUA	2025-12-21 13:25:06.555	2025-12-21 13:25:06.555	\N
cmjfres8u000acxudqqyd8vxf	PAI	PAI	4		SEMUA	2025-12-21 13:25:06.558	2025-12-21 13:25:06.558	\N
cmjfres8x000bcxudncjt32re	DPK AK	Dasar Program Keahlian AK	4		SEMUA	2025-12-21 13:25:06.561	2025-12-21 13:25:06.561	\N
cmjfres92000ccxudp81k51k9	DPK TKR	Dasar Program Keahlian TKR	4		SEMUA	2025-12-21 13:25:06.566	2025-12-21 13:25:06.566	\N
cmjfres96000dcxudinu1fh0z	Bahasa Daerah	Bahasa Daerah	4		SEMUA	2025-12-21 13:25:06.57	2025-12-21 13:25:06.57	\N
cmjfres99000ecxudrw8eps2c	KK TKR	Konsentrasi Keahlian TKR	4		SEMUA	2025-12-21 13:25:06.573	2025-12-21 13:25:06.573	\N
cmjfres9c000fcxudsnll0ksd	KK AK	Konsentrasi Keahlian AK	4		SEMUA	2025-12-21 13:25:06.576	2025-12-21 13:25:06.576	\N
cmjfres9h000gcxudrxp0gcs7	KK TKJ	Konsentrasi Keahlian TKJ	4		SEMUA	2025-12-21 13:25:06.581	2025-12-21 13:25:06.581	\N
cmjfres9l000hcxudabaugiyz	PAK	PAK	4		SEMUA	2025-12-21 13:25:06.585	2025-12-21 13:25:06.585	\N
cmjfres9o000icxudzn2o8c9o	Mapel Pilihan AK	Mapel Pilihan AK	4		SEMUA	2025-12-21 13:25:06.588	2025-12-21 13:25:06.588	\N
cmjfres9q000jcxudq9yz66bd	Mapel Pilihan TKJ	Mapel Pilihan TKJ	4		SEMUA	2025-12-21 13:25:06.59	2025-12-21 13:25:06.59	\N
cmjfres9x000kcxudsnlo8v1o	Mapel Pilihan TKR	Mapel Pilihan TKR	4		SEMUA	2025-12-21 13:25:06.597	2025-12-21 13:25:06.597	\N
cmjfresa0000lcxudo08nimpk	PKKWU TKJ	PKKWU TKJ	4		SEMUA	2025-12-21 13:25:06.6	2025-12-21 13:25:06.6	\N
cmjfresa3000mcxudw03qwj7y	PKKWU TKR	PKKWU TKR	4		SEMUA	2025-12-21 13:25:06.603	2025-12-21 13:25:06.603	\N
cmjfresa7000ncxud849j7br3	Pramuka	Pramuka	4		SEMUA	2025-12-21 13:25:06.607	2025-12-21 13:25:06.607	\N
cmjfresab000ocxudpx5vcc48	Seni Budaya	Seni Budaya	4		SEMUA	2025-12-21 13:25:06.611	2025-12-21 13:25:06.611	\N
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
-- Data for Name: ProgressSiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProgressSiswa" (id, "siswaId", "mataPelajaranId", "materiDibaca", "tugasSelesai", "forumPosts", "totalScore", "lastActivity", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Settings" (id, key, value, "createdAt", "updatedAt") FROM stdin;
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
b278f857-d084-4e6f-a0c8-9069ad1e840e	2024/2025	2024-07-01 00:00:00	2024-12-31 00:00:00	AKTIF	2025-12-21 11:29:51.936	2025-12-21 11:29:51.936	\N
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

COPY public."Ujian" (id, kode, judul, deskripsi, "mataPelajaranId", "kelasId", durasi, "tanggalMulai", "tanggalSelesai", "nilaiMinimal", "acakSoal", "tampilkanNilai", status, "createdBy", "createdAt", "updatedAt", "deletedAt", "paketSoalId", "guruId") FROM stdin;
\.


--
-- Data for Name: UjianKelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UjianKelas" (id, "ujianId", "kelasId", "createdAt") FROM stdin;
\.


--
-- Data for Name: UjianSiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UjianSiswa" (id, "ujianId", "siswaId", "tokenAkses", "waktuMulai", "waktuSelesai", durasi, status, "nilaiTotal", "isPassed", jawaban, "createdAt", "updatedAt") FROM stdin;
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
1	rizky@mail.com	Rizky	2025-12-21 12:43:44.062	2025-12-21 12:44:13.928	$2b$10$9aJT5OzAGuaalA/OSwPGrurQu1ajWOndATpcowo0la/y6y5OsDgI6	ADMIN
cmjfq2i9l0000lpud18tskitn	ainiabdcholis.73@gmail.com	Aini Abdul Cholis S.Pd.	2025-12-21 12:47:34.137	2025-12-21 12:47:34.137	$2b$10$j6g6wl9bcO9kfMpN0uBE3OeCZ3LbrVdKfBJlcrHSzIUAQyWlyEaeK	GURU
cmjfq2ibc0002lpudx24estq2	drasuburhindartin@gmail.com	Dra. Subur Hindartin	2025-12-21 12:47:34.2	2025-12-21 12:47:34.2	$2b$10$I..ja8R25yEtrOK49qnq8.6tnd3zCVLfkH5btw3qCiFRTPzGbOXjG	GURU
cmjfq2icv0004lpudw66gmkt1	yudiaster1922@gmail.com	Dwi Wahyudi, S.T,	2025-12-21 12:47:34.255	2025-12-21 12:47:34.255	$2b$10$Abx3HG0AsTo55iZIEDxMgeG4oV24O48m1N1PiYB5M1WOCqrBCAOCS	GURU
cmjfq2ied0006lpud5xore2pz	erlinnoviadiana@gmail.com	Erlin Novia Diana, S.E.	2025-12-21 12:47:34.309	2025-12-21 12:47:34.309	$2b$10$nqx1a9uHBY/rOyGosD2dA.Am1jHJfP4oYxOF9epy0GkwcFZ.XzLWK	GURU
cmjfq2ifu0008lpudpcu4vhar	feramegaharistiana@gmail.com	Fera Mega Haristina, S.Tr.Kom.	2025-12-21 12:47:34.362	2025-12-21 12:47:34.362	$2b$10$JzL..AqgcyYeaYIisobM6.4rtRvfJRMmV5qMELnv.7VlGDTpZ8fwi	GURU
cmjfq2ihc000alpudz7xmjob2	franceskoyen16@gmail.com	Frances Laurence Setyo Budi, S.Pd.	2025-12-21 12:47:34.416	2025-12-21 12:47:34.416	$2b$10$TR7SDanK6cWqBPQnuSECD.0LiJhF0GLzT2MELpxPvDM93yYdCZCUG	GURU
cmjfq2iit000clpud92kkrc37	imtianateguh@gmail.com	Imtiana, S.Pd	2025-12-21 12:47:34.469	2025-12-21 12:47:34.469	$2b$10$z8Kt7LSIQAh0Hwq/HU9dPuQnSn61BrqgWAkOaSMIffv5JPDHxo.CK	GURU
cmjfq2ika000elpudgwo3cxdp	faizabrahammalik@gmail.com	M. Fais Jainuddin, S.Pd	2025-12-21 12:47:34.522	2025-12-21 12:47:34.522	$2b$10$H.zScL5aNoUt0eIgZiIxm.4fsQKMv6MeOFsrnfCL0lni.n8iVkUm6	GURU
cmjfq2ilq000glpudod05400p	mohrohim02@gmail.com	Moh. Rohim, S.T.	2025-12-21 12:47:34.574	2025-12-21 12:47:34.574	$2b$10$hCGRP8YwQo.U7Zs/wG./O.FU0fOvU3pMA2Y/26nJY5Cvw/t3z3Mzi	GURU
cmjfq2in9000ilpudhd524f9z	yunuskacer@gmail.com	Moh. Yunus Ansori, S.Pd.	2025-12-21 12:47:34.629	2025-12-21 12:47:34.629	$2b$10$uDVnFak3pTppXg85FqUN6eQdwvyb1yKCSxUm.xZNyYnHyfFFipLLC	GURU
cmjfq2ior000klpudcnmdlqss	danzia22@gmail.com	Mulyono, S.Th.	2025-12-21 12:47:34.683	2025-12-21 12:47:34.683	$2b$10$HbAZCxxrGnBDQKBQomL9Y.LCRX3gLLHZdSKDK0foK1DSFc1dGS7Oy	GURU
cmjfq2iq8000mlpudga4zac51	nunungindrawati437@gmail.com	Nunung Indrawati, S.Pd.	2025-12-21 12:47:34.736	2025-12-21 12:47:34.736	$2b$10$XZs3A.kwGt325P82fmi7BOpybTPkjrmOYO5kUeDBh1wx1T.D8U/NG	GURU
cmjfq2irn000olpudoe53wga3	nurmalaevayanti2006@gmail.com	Nurmala Evayanti S.Pd.	2025-12-21 12:47:34.787	2025-12-21 12:47:34.787	$2b$10$crD9PEi68lCNtUSy8C3f5eQnbxMbXcgO9355hM7M5hIqxII/ucEQ.	GURU
cmjfq2it6000qlpud7fxa29mk	nurulhidayahse485@gmail.com	Nurul Hidayah, S.E.	2025-12-21 12:47:34.842	2025-12-21 12:47:34.842	$2b$10$F06mtqDo03p5hGF2NKeyfeJkjIwXa9BpK9mLFGLGsy5rBJRmcjcFS	GURU
cmjfq2ium000slpudy2de656c	rizkielutfi@gmail.com	Rizky Lutfi Romadona, S.Kom	2025-12-21 12:47:34.894	2025-12-21 12:47:34.894	$2b$10$BRwulEt0sbLGgMfkb5hjKuzTcWKe5nsnr9F28cqAGUOkF9jvos9pS	GURU
cmjfq2iw3000ulpud4q4ebh8o	purwantisiska25@gmail.com	Siska Purwanti, S.E.	2025-12-21 12:47:34.947	2025-12-21 12:47:34.947	$2b$10$LjfAVlqe/ez8SP6O8B5Tq.YL6kNN39HSB/XnhohEBgcZM78BOPX9i	GURU
cmjfq2ixl000wlpuddcxlwcdi	rizalpecintaseni@gmail.com	Syamsul Rizal, S.Pd.I.	2025-12-21 12:47:35.001	2025-12-21 12:47:35.001	$2b$10$crxI18W.hwjz6bVcbf5.WeycEPH0lkwEo79whUAs0dkVt9QbuCflq	GURU
cmjfq2iz3000ylpudv9amxdpu	udayaniprayuda@gmail.com	Udayani, S.Pd.	2025-12-21 12:47:35.055	2025-12-21 12:47:35.055	$2b$10$EvYz5N9KzwZn6SVvonDGXuJkFVM5VWca7iFh23gRki8cfxEBEv83S	GURU
cmjfq2j0k0010lpudgrvtpdwm	wahyumirnawati30@gmail.com	Wahyu Mirnawati, S.Ak.	2025-12-21 12:47:35.108	2025-12-21 12:47:35.108	$2b$10$zDxs39IqPWKyMBAByxMur.D.9PPkGfZwkLndEf8.m0iXfz.hAWAdG	GURU
cmjfq2j210012lpud1vyeuyab	zulfiamaliyah1306@gmail.com	Zulfi Amaliyah, S.Kom	2025-12-21 12:47:35.161	2025-12-21 12:47:35.161	$2b$10$ZVoZnymYu4RVYjXCiXG9S.5zD3DLLQalG/UligPpbDcyf1B6qh.JK	GURU
cmjfq2j3j0014lpudrf43cuxq	pa717885@gmail.com	Maulida Putri Lesmana	2025-12-21 12:47:35.215	2025-12-21 12:47:35.215	$2b$10$NkGqjRGrjWsMbol.qQvz0eKuMahg//xVFTPvWhT0SPvMIOmPA37OC	GURU
cmjfq2j500016lpudt3312gaz	ilafebtisherly@gmail.com	Ila Febti Sherly M., S.E	2025-12-21 12:47:35.268	2025-12-21 12:47:35.268	$2b$10$NYYcs6MC.u8uDNsoEDn6SehZEcmUPBJBkzzde7.bEJfSRgy9acEPq	GURU
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
4b863b37-6676-4b4c-b288-a637470b5284	609cb3817046359fc62b69f293e3903cd198aae0f3510bf462c59f9ad4035ff7	2025-12-21 11:29:51.867099+00	20251211102828_init	\N	\N	2025-12-21 11:29:51.859056+00	1
758aeaff-e3f3-48cb-8473-d34104c8597f	0156d098f4db91ff3bbadcc1b79aadb5d97c09871b71938fd4dc6e53391a1532	2025-12-21 11:29:52.016181+00	20251216124905_add_settings_model	\N	\N	2025-12-21 11:29:52.008703+00	1
3dc94443-3ee1-41bb-8870-da9ff03c5d9c	2640bf707564a1056f78c31ab21927c3e2ba43ac93d47d3f1ef832ccced34bc8	2025-12-21 11:29:51.874989+00	20251211151758_npm_run_prisma_generate	\N	\N	2025-12-21 11:29:51.868668+00	1
9a3378cb-1b4f-4edb-a8e6-b8aaa4717222	0c7e0d4e778e1cc415cbfd0b3fbe7fdc91ffeb05229bf7599a2ebb8ceb9ffb3e	2025-12-21 11:29:51.898892+00	20251212095857_add_lms_entities	\N	\N	2025-12-21 11:29:51.876167+00	1
fa663956-0bfc-49b6-bd67-05e9cbc51340	b43cc7d286cb1c9e4eed35a237d4805ddb2ad96144c39cfb102c2eae959a72e4	2025-12-21 11:29:59.636069+00	20251221112959_add_lms_features	\N	\N	2025-12-21 11:29:59.562497+00	1
184763ff-678d-4610-836b-d778d372253b	750d8a254ceaaf152f260f65242d25249ecaaf9678faa3f041f061007f1ee44d	2025-12-21 11:29:51.91121+00	20251212112639_add_jurusan_and_update_kelas	\N	\N	2025-12-21 11:29:51.900096+00	1
863c389f-6449-413d-981f-9b8693a24645	8334127d9f47b107a04a7d4f45e7b1a9f28120a32076d8418b80a0fbdd0d7fd3	2025-12-21 11:29:52.023559+00	20251217022933_remove_semester_from_tahun_ajaran	\N	\N	2025-12-21 11:29:52.0173+00	1
a6ae2fd7-643a-41e0-8ba6-8aefb9cf6d3d	998edaffc3e7e33bda76f385a440e3df4dbf0428564a2a15763cd5aa26535719	2025-12-21 11:29:51.923372+00	20251212122610_add_many_to_many_guru_mata_pelajaran	\N	\N	2025-12-21 11:29:51.912689+00	1
f187386b-2f4e-4272-93d6-77c8ff7ca423	92f08fc24273bbcd87412a6494250a94461f6da2ba78cc5cc67527b74e451431	2025-12-21 11:29:51.93253+00	20251212125923_add_user_integration_to_siswa_guru	\N	\N	2025-12-21 11:29:51.924696+00	1
4ec8fa86-0e30-42d0-b737-26ca50259564	2af40a7de13d912e0dc5428dfaad47807ad86bb19d9b998236759c7c6779f568	2025-12-21 11:29:51.94089+00	20251212145913_make_tahun_ajaran_required_in_kelas	\N	\N	2025-12-21 11:29:51.93421+00	1
5ba859d0-adb0-47cd-8375-c3d01b268e54	ca56657a42dc94fe3aa791065e17521b02eadc0abb8a196bd6d74998eaca7b18	2025-12-21 11:29:52.053526+00	20251217074227_remove_tingkat_kesulitan	\N	\N	2025-12-21 11:29:52.024946+00	1
45b2c51f-d606-4023-bf11-a4e4c125b788	90480c68541aad550a5a12bc2e8485029efc1fb1fa25a9940a1323042c4385e2	2025-12-21 11:29:51.94984+00	20251214051132	\N	\N	2025-12-21 11:29:51.942576+00	1
dcea84d1-a3a2-4d40-a2f2-f120a951acd3	f4eb6ab1a9e0366ad782133ad765d973cb1b2ab0a48a1f7e9034e305b6634ff0	2025-12-21 11:29:51.966193+00	20251214063132_refactor_tahun_ajaran_to_siswa	\N	\N	2025-12-21 11:29:51.951279+00	1
6d1625cb-06f7-47f9-880a-5659a87d241b	25d03367cc79cdbff0ec8e1c2d3c33a3b806c75a4e4b1fecd1932f16e476b4e5	2025-12-21 11:29:51.984615+00	20251214084212_add_attendance_model	\N	\N	2025-12-21 11:29:51.967335+00	1
bca4f243-e9cf-413f-891b-9af331fdb8ed	b49d31efb8891a0baa5b7c1c11b5468cc50c80552ec5a7b78852605d377c5bef	2025-12-21 11:29:52.069309+00	20251217091002_add_paket_soal	\N	\N	2025-12-21 11:29:52.054882+00	1
fcce8987-e6bb-4f7d-84c5-e46595af1ec6	9c5dce6d4875f6332cacf7463b5274add07688e63ce466bb55322ca48798db91	2025-12-21 11:29:51.989895+00	20251216110639_add_petugas_absensi_role	\N	\N	2025-12-21 11:29:51.985815+00	1
e69bd1ec-4f93-4895-93a1-27a6b178006c	750d3916e193e86a376975d2c2776442d2927c8c75e0e51903d350dd990c2f6b	2025-12-21 11:29:51.996044+00	20251216115114_add_magang_status	\N	\N	2025-12-21 11:29:51.991511+00	1
3773b9d0-a13f-4e76-affb-5783c65968fe	da85a17d1e1e9d2f1e72621609dbf630c551db1a7cb10b87199cd81e646623ef	2025-12-21 11:29:52.007305+00	20251216115239_rename_magang_to_pkl	\N	\N	2025-12-21 11:29:51.997406+00	1
4dac4bda-ffd8-431c-a725-33d15c33e52e	c709d568b3e9f35bfae33784143ab1dc0f924ed7188d7682fe83a2230a1ee496	2025-12-21 11:29:52.075107+00	20251217092251_remove_tingkat_kesulitan	\N	\N	2025-12-21 11:29:52.070395+00	1
85616d3d-6a10-4deb-a00a-597f5a558d90	c8a78ac8421e0546ebf611754745d56f60ef00986d8fbaec0ea700f0b022c21e	2025-12-21 11:29:52.083365+00	20251217092712_add_guru_to_paket_soal	\N	\N	2025-12-21 11:29:52.076373+00	1
c0f1f253-2dea-424f-9e64-d32db038d9a3	39e302b56339b64f0b94a36c409a5271427d4159a7bda50059e41db697152c50	2025-12-21 11:29:52.095571+00	20251217114742_add_multi_class_student_selection	\N	\N	2025-12-21 11:29:52.084943+00	1
b843a0ca-adc5-4d9e-8188-5025858c7920	1e2dc8a2aa1a8521d2ffe0b9e6dc3039cea60c545ec602bdfe0492285e12afd8	2025-12-21 11:29:52.10304+00	20251217120042_add_guru_to_ujian	\N	\N	2025-12-21 11:29:52.096814+00	1
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
-- Name: PaketSoal PaketSoal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaketSoal"
    ADD CONSTRAINT "PaketSoal_pkey" PRIMARY KEY (id);


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

\unrestrict 6PvD4i4ljtHhz6DAleMXNpaMQNknb0jeg0V8uBkMyKTPpVAyJWJ1w8lTJnc8W9o

