--
-- PostgreSQL database dump
--

\restrict SIOmGKiBDETLudqtoMXTXP65xHD8bHcqJkxjXSzDOCaeBjG6sKotGwOv7GTsSEV

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

COPY public."BankSoal" (id, kode, pertanyaan, tipe, "mataPelajaranId", "pilihanJawaban", "jawabanBenar", bobot, penjelasan, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmjog21gt000092udtimjt1iu	SOAL-00001	Desain grafis adalah…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Seni membuat tulisan saja", "isCorrect": false}, {"id": "B", "text": "Proses komunikasi visual menggunakan gambar, warna, dan teks", "isCorrect": true}, {"id": "C", "text": "Kegiatan menggambar manual di kertas", "isCorrect": false}, {"id": "D", "text": "Hanya membuat poster saja", "isCorrect": false}, {"id": "E", "text": "Proses dekorasi tanpa tujuan’", "isCorrect": false}]	B	3	\N	2025-12-27 15:17:11.787	2025-12-27 15:17:11.787	\N
cmjog21h2000192ud0pawgtf5	SOAL-00002	Software yang digunakan dalam pembuatan desain grafis digital adalah…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Microsoft Word", "isCorrect": false}, {"id": "B", "text": "Canva", "isCorrect": true}, {"id": "C", "text": "WhatsApp", "isCorrect": false}, {"id": "D", "text": "Chrome", "isCorrect": false}, {"id": "E", "text": "Winamp", "isCorrect": false}]	B	3	\N	2025-12-27 15:17:11.797	2025-12-27 15:17:11.797	\N
cmjog21h8000292uddw0wgr6y	SOAL-00003	Elemen dasar desain grafis yang mengatur besar kecilnya objek adalah…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Garis", "isCorrect": false}, {"id": "B", "text": "Warna", "isCorrect": false}, {"id": "C", "text": "Tipografi", "isCorrect": false}, {"id": "D", "text": "Ukuran", "isCorrect": true}, {"id": "E", "text": "Kontras", "isCorrect": false}]	D	3	\N	2025-12-27 15:17:11.804	2025-12-27 15:17:11.804	\N
cmjog21hf000392udc768sg89	SOAL-00004	Jenis huruf dalam desain disebut…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Color", "isCorrect": false}, {"id": "B", "text": "Font / Tipografi", "isCorrect": true}, {"id": "C", "text": "Layer", "isCorrect": false}, {"id": "D", "text": "Filter", "isCorrect": false}, {"id": "E", "text": "Vector", "isCorrect": false}]	B	3	\N	2025-12-27 15:17:11.81	2025-12-27 15:17:11.81	\N
cmjog21hl000492udetxievs8	SOAL-00005	Tujuan utama desain poster adalah…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Hanya untuk estetika", "isCorrect": false}, {"id": "B", "text": "Menyampaikan informasi dan menarik perhatian", "isCorrect": true}, {"id": "C", "text": "Membuat layar penuh", "isCorrect": false}, {"id": "D", "text": "Membuat komputer menjadi lambat", "isCorrect": false}, {"id": "E", "text": "Menghapus gambar", "isCorrect": false}]	B	3	\N	2025-12-27 15:17:11.816	2025-12-27 15:17:11.816	\N
cmjog21hr000592udbp4pfprc	SOAL-00006	Canva merupakan aplikasi desain berbasis…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Offline murni", "isCorrect": false}, {"id": "B", "text": "Browser dan mobile", "isCorrect": true}, {"id": "C", "text": "Sistem database", "isCorrect": false}, {"id": "D", "text": "Game", "isCorrect": false}, {"id": "E", "text": "Format video", "isCorrect": false}]	B	3	\N	2025-12-27 15:17:11.823	2025-12-27 15:17:11.823	\N
cmjog21hy000692udnzfyydp3	SOAL-00007	Format gambar yang cocok untuk desain web adalah…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Exe", "isCorrect": false}, {"id": "B", "text": "Jpg", "isCorrect": true}, {"id": "C", "text": "Txt", "isCorrect": false}, {"id": "D", "text": "Doc", "isCorrect": false}, {"id": "E", "text": "zip", "isCorrect": false}]	B	3	\N	2025-12-27 15:17:11.829	2025-12-27 15:17:11.829	\N
cmjog21i3000792udfhrs4t5a	SOAL-00008	Warna primer dalam desain grafis digital adalah…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Hitam, putih, abu", "isCorrect": false}, {"id": "B", "text": "Merah, kuning, hijau", "isCorrect": false}, {"id": "C", "text": "RGB (red, green, blue)", "isCorrect": true}, {"id": "D", "text": "Brown, grey, black", "isCorrect": false}, {"id": "E", "text": "Cyan, silver, pink", "isCorrect": false}]	C	3	\N	2025-12-27 15:17:11.835	2025-12-27 15:17:11.835	\N
cmjog21ia000892udu4pb93uh	SOAL-00009	Tools di Canva untuk mengatur teks adalah…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Elements", "isCorrect": false}, {"id": "B", "text": "Upload", "isCorrect": false}, {"id": "C", "text": "Text", "isCorrect": true}, {"id": "D", "text": "Share", "isCorrect": false}, {"id": "E", "text": "Charts", "isCorrect": false}]	C	3	\N	2025-12-27 15:17:11.841	2025-12-27 15:17:11.841	\N
cmjog21ig000992udin59wac4	SOAL-00010	Desain yang terlalu banyak warna akan menyebabkan…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Harmonis", "isCorrect": false}, {"id": "B", "text": "Enak dibaca", "isCorrect": false}, {"id": "C", "text": "Tidak rapi dan membingungkan", "isCorrect": true}, {"id": "D", "text": "Simple", "isCorrect": false}, {"id": "E", "text": "Kosong", "isCorrect": false}]	C	3	\N	2025-12-27 15:17:11.847	2025-12-27 15:17:11.847	\N
cmjog21im000a92udt4m2smm4	SOAL-00011	Gambar berbasis vector tidak pecah karena…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Dibuat dari pixel", "isCorrect": false}, {"id": "B", "text": "Dibuat dari rumus matematis", "isCorrect": true}, {"id": "C", "text": "Dibuat dari kertas", "isCorrect": false}, {"id": "D", "text": "Berformat video", "isCorrect": false}, {"id": "E", "text": "Berformat audio", "isCorrect": false}]	B	3	\N	2025-12-27 15:17:11.853	2025-12-27 15:17:11.853	\N
cmjog21is000b92ud3kztongm	SOAL-00012	Layout adalah…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Susunan elemen desain", "isCorrect": true}, {"id": "B", "text": "Warna gelap", "isCorrect": false}, {"id": "C", "text": "File komputer", "isCorrect": false}, {"id": "D", "text": "Foto selfie", "isCorrect": false}, {"id": "E", "text": "Ukuran kertas", "isCorrect": false}]	A	3	\N	2025-12-27 15:17:11.859	2025-12-27 15:17:11.859	\N
cmjog21ix000c92ude57fbqco	SOAL-00013	Poster yang baik memiliki…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Banyak teks menumpuk", "isCorrect": false}, {"id": "B", "text": "Pesan jelas dan visual menarik", "isCorrect": true}, {"id": "C", "text": "Background kosong saja", "isCorrect": false}, {"id": "D", "text": "Judul tidak terlihat", "isCorrect": false}, {"id": "E", "text": "Tulisan kecil", "isCorrect": false}]	B	3	\N	2025-12-27 15:17:11.865	2025-12-27 15:17:11.865	\N
cmjog21j4000d92ud9blxi1qy	SOAL-00014	Tools untuk mengubah ukuran objek di Canva adalah…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Rotate", "isCorrect": false}, {"id": "B", "text": "Resize", "isCorrect": true}, {"id": "C", "text": "Delete", "isCorrect": false}, {"id": "D", "text": "Share", "isCorrect": false}, {"id": "E", "text": "Save", "isCorrect": false}]	B	3	\N	2025-12-27 15:17:11.871	2025-12-27 15:17:11.871	\N
cmjog21j9000e92udpmhbptak	SOAL-00015	Warna yang selaras dan nyaman dilihat disebut…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Kontras", "isCorrect": false}, {"id": "B", "text": "Komposisi", "isCorrect": false}, {"id": "C", "text": "Harmoni warna", "isCorrect": true}, {"id": "D", "text": "Blur", "isCorrect": false}, {"id": "E", "text": "Shadow", "isCorrect": false}]	C	3	\N	2025-12-27 15:17:11.876	2025-12-27 15:17:11.876	\N
cmjog21jf000f92ud54trbv0w	SOAL-00016	File hasil desain di Canva bisa di-download dalam bentuk…	PILIHAN_GANDA	\N	[{"id": "A", "text": "mp3", "isCorrect": false}, {"id": "B", "text": "docx", "isCorrect": false}, {"id": "C", "text": "mp4", "isCorrect": false}, {"id": "D", "text": "ppt", "isCorrect": false}, {"id": "E", "text": "png", "isCorrect": true}]	E	3	\N	2025-12-27 15:17:11.882	2025-12-27 15:17:11.882	\N
cmjog21jk000g92udjtu1jfuw	SOAL-00017	Poster digital biasanya digunakan untuk…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Mewarnai buku", "isCorrect": false}, {"id": "B", "text": "Promosi, pengumuman, kampanye", "isCorrect": true}, {"id": "C", "text": "Memutar musik", "isCorrect": false}, {"id": "D", "text": "Mengisi formulir", "isCorrect": false}, {"id": "E", "text": "Mempercepat internet", "isCorrect": false}]	B	3	\N	2025-12-27 15:17:11.887	2025-12-27 15:17:11.887	\N
cmjog21jr000h92udkctmfgd3	SOAL-00018	Fungsi tombol “Upload” di Canva adalah…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Menghapus gambar", "isCorrect": false}, {"id": "B", "text": "Mengganti warna", "isCorrect": false}, {"id": "C", "text": "Mengunggah foto atau logo dari perangkat", "isCorrect": true}, {"id": "D", "text": "Mengunduh desain", "isCorrect": false}, {"id": "E", "text": "Mengedit video", "isCorrect": false}]	C	3	\N	2025-12-27 15:17:11.894	2025-12-27 15:17:11.894	\N
cmjog21jx000i92ud1ydtz0gx	SOAL-00019	Jika desain terlihat kosong, maka solusi yang tepat adalah…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Ikut geng motor", "isCorrect": true}, {"id": "B", "text": "Minum-minuman keras", "isCorrect": false}, {"id": "C", "text": "Menjaga iman dan memilih teman baik", "isCorrect": false}, {"id": "D", "text": "Melawan guru", "isCorrect": false}, {"id": "E", "text": "Tidak belajar", "isCorrect": false}]	A	3	\N	2025-12-27 15:17:11.9	2025-12-27 15:17:11.9	\N
cmjog21k1000j92ud2yblqwc5	SOAL-00020	Elemen penting pada poster promosi produk adalah…	PILIHAN_GANDA	\N	[{"id": "A", "text": "Harga, nama produk, gambar produk", "isCorrect": true}, {"id": "B", "text": "Tulisan kecil dan banyak paragraf", "isCorrect": false}, {"id": "C", "text": "Warna gelap semua", "isCorrect": false}, {"id": "D", "text": "Gambar buram", "isCorrect": false}, {"id": "E", "text": "Tidak perlu tulisan", "isCorrect": false}]	A	3	\N	2025-12-27 15:17:11.905	2025-12-27 15:17:11.905	\N
cmjog21k8000k92udt2nikijc	SOAL-00021	Jelaskan pengertian desain grafis!	ESSAY	\N	\N	\N	8	\N	2025-12-27 15:17:11.911	2025-12-27 15:17:11.911	\N
cmjog21kd000l92udre3oi4b7	SOAL-00022	Apa kelebihan Canva sebagai aplikasi desain?	ESSAY	\N	\N	\N	8	\N	2025-12-27 15:17:11.916	2025-12-27 15:17:11.916	\N
cmjog21kk000m92udk1cxlaqt	SOAL-00023	Mengapa tipografi penting dalam sebuah desain?	ESSAY	\N	\N	\N	8	\N	2025-12-27 15:17:11.924	2025-12-27 15:17:11.924	\N
cmjog21kq000n92udr2y8mwc4	SOAL-00024	Sebutkan 3 contoh hasil desain yang bisa dibuat di Canva!	ESSAY	\N	\N	\N	8	\N	2025-12-27 15:17:11.929	2025-12-27 15:17:11.929	\N
cmjog21kv000o92udqs1stsbo	SOAL-00025	Apa yang dimaksud dengan komposisi desain?	ESSAY	\N	\N	\N	8	\N	2025-12-27 15:17:11.935	2025-12-27 15:17:11.935	\N
cmjog2xqh001e92ud2gz4da9p	SOAL-00026	Questions 1 to 25 are incomplete dialogues or sentences. Five choices marked A, B, C, D, E are given beneath each dialogue or sentence. You have to choose the one that best completes Olla : What were you doing when I rang you up? Qolli : I was ... my homework.	PILIHAN_GANDA	\N	[{"id": "A", "text": "Doing", "isCorrect": true}, {"id": "B", "text": "Done", "isCorrect": false}, {"id": "C", "text": "Does", "isCorrect": false}, {"id": "D", "text": "Do", "isCorrect": false}, {"id": "E", "text": "Did", "isCorrect": false}]	A	2	\N	2025-12-27 15:17:53.608	2025-12-27 15:17:53.608	\N
cmjog2xqt001f92ud101dbylq	SOAL-00027	Kintan and I were drawing a view of Bromo Mountain two days ago. The interrogative construction of past continuous tense above is?	PILIHAN_GANDA	\N	[{"id": "A", "text": "Are Kintan and I drawing a view of Bromo Mountain two days ago?", "isCorrect": false}, {"id": "B", "text": "Do Kintan and I draw a view of Bromo Mountain two days ago?", "isCorrect": false}, {"id": "C", "text": "Did Kintan and I draw a view of Bromo Mountain two days ago?", "isCorrect": false}, {"id": "D", "text": "Does Kintan and I drawing a view of Bromo Mountain two days ago?", "isCorrect": false}, {"id": "E", "text": "Were Kintan and I drawing a view of Bromo Mountain two days ago?", "isCorrect": true}]	E	2	\N	2025-12-27 15:17:53.62	2025-12-27 15:17:53.62	\N
cmjog2xqz001g92ud7vup30vy	SOAL-00028	My mother taught me this formula yesterday, But I … understand it. I couldn’t make it.	PILIHAN_GANDA	\N	[{"id": "A", "text": "Was not confusing", "isCorrect": false}, {"id": "B", "text": "Was confusing", "isCorrect": true}, {"id": "C", "text": "Am confusing", "isCorrect": false}, {"id": "D", "text": "Have confused", "isCorrect": false}, {"id": "E", "text": "Did not confusing", "isCorrect": false}]	B	2	\N	2025-12-27 15:17:53.626	2025-12-27 15:17:53.626	\N
cmjog2xr6001h92udv23xq1zy	SOAL-00029	Yanti : Please call me if you need my help. Sugi : Thanks, but for now, I … need your help.	PILIHAN_GANDA	\N	[{"id": "A", "text": "Am not", "isCorrect": false}, {"id": "B", "text": "Not", "isCorrect": false}, {"id": "C", "text": "Does not", "isCorrect": false}, {"id": "D", "text": "Do not", "isCorrect": true}, {"id": "E", "text": "Is not", "isCorrect": false}]	D	2	\N	2025-12-27 15:17:53.633	2025-12-27 15:17:53.633	\N
cmjog2xrb001i92ud8ablag3s	SOAL-00030	I and my friends … in library. We read some books	PILIHAN_GANDA	\N	[{"id": "A", "text": "Am", "isCorrect": false}, {"id": "B", "text": "Is", "isCorrect": false}, {"id": "C", "text": "Are", "isCorrect": true}, {"id": "D", "text": "Have", "isCorrect": false}, {"id": "E", "text": "Had", "isCorrect": false}]	C	2	\N	2025-12-27 15:17:53.638	2025-12-27 15:17:53.638	\N
cmjog2xrj001j92udlq5m1zs9	SOAL-00031	Penguins live in the Antarctic. They cannot fly, but they . . . well	PILIHAN_GANDA	\N	[{"id": "A", "text": "Swim", "isCorrect": true}, {"id": "B", "text": "Swam", "isCorrect": false}, {"id": "C", "text": "Swims", "isCorrect": false}, {"id": "D", "text": "Swimming", "isCorrect": false}, {"id": "E", "text": "Swimmer", "isCorrect": false}]	A	2	\N	2025-12-27 15:17:53.646	2025-12-27 15:17:53.646	\N
cmjog2xrq001k92udf6kjmq5n	SOAL-00032	"They visited grandmother." Its passive voice version is ...	PILIHAN_GANDA	\N	[{"id": "A", "text": "Grandmother was visited by them.", "isCorrect": true}, {"id": "B", "text": "Grandmother were visited by them.", "isCorrect": false}, {"id": "C", "text": "Grandmother is visited by them.", "isCorrect": false}, {"id": "D", "text": "Grandmother are visited by them.", "isCorrect": false}, {"id": "E", "text": "Grandmother was being visited by them.", "isCorrect": false}]	A	2	\N	2025-12-27 15:17:53.653	2025-12-27 15:17:53.653	\N
cmjog2xru001l92ud473xhqnb	SOAL-00033	Jupiter's four moons ... through a telescope by Galileo.	PILIHAN_GANDA	\N	[{"id": "A", "text": "First viewed.", "isCorrect": false}, {"id": "B", "text": "Were first viewed", "isCorrect": true}, {"id": "C", "text": "Had been first viewed", "isCorrect": false}, {"id": "D", "text": "Were being first viewed.", "isCorrect": false}, {"id": "E", "text": "Was first viewed.", "isCorrect": false}]	B	2	\N	2025-12-27 15:17:53.658	2025-12-27 15:17:53.658	\N
cmjog2xs2001m92ud428j4fcj	SOAL-00034	"They translated some old documents last week." What is the passive form of this sentence?	PILIHAN_GANDA	\N	[{"id": "A", "text": "Some old documents are translated by them last week.", "isCorrect": false}, {"id": "B", "text": "Some old documents have been translated by them last week.", "isCorrect": false}, {"id": "C", "text": "Some old documents were being translated by them last week.", "isCorrect": false}, {"id": "D", "text": "Some old documents were translated by them last week.", "isCorrect": true}, {"id": "E", "text": "Some old documents are translated by them last week.", "isCorrect": false}]	D	2	\N	2025-12-27 15:17:53.665	2025-12-27 15:17:53.665	\N
cmjog2xs8001n92udi1f0iac3	SOAL-00035	Wendy : I thought you got the invitation. Rika : Yes I . . . . . Wendy : Then why didn't you show up last night? Rika : I'm sorry; my mom needed me last night.	PILIHAN_GANDA	\N	[{"id": "A", "text": "Does", "isCorrect": false}, {"id": "B", "text": "Done", "isCorrect": false}, {"id": "C", "text": "Do", "isCorrect": false}, {"id": "D", "text": "Thought", "isCorrect": false}, {"id": "E", "text": "Did", "isCorrect": true}]	E	2	\N	2025-12-27 15:17:53.671	2025-12-27 15:17:53.671	\N
cmjog2xsd001o92udqqf5hupp	SOAL-00036	Arrange the jumbled words below into good sentences of simple past tense 1. Ignored - 2. last day - 3. She - 4. my call	PILIHAN_GANDA	\N	[{"id": "A", "text": "2 – 1 – 3 – 4", "isCorrect": false}, {"id": "B", "text": "4 – 1 – 2 – 3", "isCorrect": false}, {"id": "C", "text": "3 – 1 – 2 – 4", "isCorrect": false}, {"id": "D", "text": "3 – 1 – 4 – 2", "isCorrect": true}, {"id": "E", "text": "4 – 3 – 2 – 1", "isCorrect": false}]	D	2	\N	2025-12-27 15:17:53.676	2025-12-27 15:17:53.676	\N
cmjog2xsk001p92udqh1rethg	SOAL-00037	Dona……. this delicious food for us, 1 hour ago	PILIHAN_GANDA	\N	[{"id": "A", "text": "Cooking", "isCorrect": false}, {"id": "B", "text": "Cooked", "isCorrect": true}, {"id": "C", "text": "Cooks", "isCorrect": false}, {"id": "D", "text": "Cook", "isCorrect": false}, {"id": "E", "text": "Cooken", "isCorrect": false}]	B	2	\N	2025-12-27 15:17:53.683	2025-12-27 15:17:53.683	\N
cmjog2xso001q92ud6ss0ho8u	SOAL-00038	Shela : hi mela, what did you do last night? Mela : ……………….	PILIHAN_GANDA	\N	[{"id": "A", "text": "I am watching drama series on VIU last night", "isCorrect": false}, {"id": "B", "text": "I watch drama series on VIU last night", "isCorrect": false}, {"id": "C", "text": "I watched drama series on VIU last night", "isCorrect": true}, {"id": "D", "text": "I watches drama series on VIU last night", "isCorrect": false}, {"id": "E", "text": "I watching drama series on VIU last night", "isCorrect": false}]	C	2	\N	2025-12-27 15:17:53.688	2025-12-27 15:17:53.688	\N
cmjog2xsv001r92uduzcd846e	SOAL-00039	Dicky : I called you last night but there was no answer. Where were you? Vira : Sorry. I ... when you called me last night.	PILIHAN_GANDA	\N	[{"id": "A", "text": "Sleep", "isCorrect": false}, {"id": "B", "text": "Slept", "isCorrect": false}, {"id": "C", "text": "Was sleeping", "isCorrect": true}, {"id": "D", "text": "Am sleeping", "isCorrect": false}, {"id": "E", "text": "Were slept", "isCorrect": false}]	C	2	\N	2025-12-27 15:17:53.695	2025-12-27 15:17:53.695	\N
cmjog2xt1001s92udzrrqmbmb	SOAL-00040	Ron : What do you usually do after school? Jack : I usually . . .	PILIHAN_GANDA	\N	[{"id": "A", "text": "Wake up at six", "isCorrect": false}, {"id": "B", "text": "Take a holiday", "isCorrect": false}, {"id": "C", "text": "Have lunch", "isCorrect": true}, {"id": "D", "text": "Have breakfast", "isCorrect": false}, {"id": "E", "text": "Having dinner", "isCorrect": false}]	C	2	\N	2025-12-27 15:17:53.699	2025-12-27 15:17:53.699	\N
cmjog2xt6001t92udtvjwyyfx	SOAL-00041	Arrange the jumbled words below into good sentences of simple past tense. 1. At - 2. Yesterday - 3. They - 4. the - 5. Lunch - 6. Had - 7. Restaurant	PILIHAN_GANDA	\N	[{"id": "A", "text": "3 – 6 – 5 – 1 – 4 – 7 – 2", "isCorrect": true}, {"id": "B", "text": "4 – 5 – 6 – 1 – 2 – 3 – 4", "isCorrect": false}, {"id": "C", "text": "4 – 3 – 5 – 6 – 1 – 2 – 7", "isCorrect": false}, {"id": "D", "text": "3 – 6 – 5 – 7 – 1 – 4 – 2", "isCorrect": false}, {"id": "E", "text": "7 – 6 – 5 – 4 – 3 – 2 – 1", "isCorrect": false}]	A	2	\N	2025-12-27 15:17:53.706	2025-12-27 15:17:53.706	\N
cmjog2xtd001u92udsxrx3uc6	SOAL-00042	Smith : . . . Anto : At 10 pm.	PILIHAN_GANDA	\N	[{"id": "A", "text": "What time do you usually go to bed?", "isCorrect": true}, {"id": "B", "text": "What do you usually do before sleeping?", "isCorrect": false}, {"id": "C", "text": "When do you usually have breakfast?", "isCorrect": false}, {"id": "D", "text": "What do you usually do at night?", "isCorrect": false}, {"id": "E", "text": "What time do you usually have lunch?", "isCorrect": false}]	A	2	\N	2025-12-27 15:17:53.713	2025-12-27 15:17:53.713	\N
cmjog2xtk001v92ud6k7ylfra	SOAL-00043	... Tuesday I saw Enid hunt a rabbit in the woods.	PILIHAN_GANDA	\N	[{"id": "A", "text": "Later", "isCorrect": false}, {"id": "B", "text": "More", "isCorrect": false}, {"id": "C", "text": "Ago", "isCorrect": false}, {"id": "D", "text": "Last", "isCorrect": true}, {"id": "E", "text": "Yesterday", "isCorrect": false}]	D	2	\N	2025-12-27 15:17:53.719	2025-12-27 15:17:53.719	\N
cmjog2xts001w92ud3muak83d	SOAL-00044	Tamara burnt her paper when she … in the kitchen.	PILIHAN_GANDA	\N	[{"id": "A", "text": "Is cooking", "isCorrect": false}, {"id": "B", "text": "Was cooking", "isCorrect": true}, {"id": "C", "text": "Is not cooking", "isCorrect": false}, {"id": "D", "text": "Cooks", "isCorrect": false}, {"id": "E", "text": "Was cooked", "isCorrect": false}]	B	2	\N	2025-12-27 15:17:53.727	2025-12-27 15:17:53.727	\N
cmjog2xtz001x92udzgcv87ys	SOAL-00045	The teacher always asks the homework ... by the students at home.	PILIHAN_GANDA	\N	[{"id": "A", "text": "Is taken", "isCorrect": false}, {"id": "B", "text": "Is making", "isCorrect": false}, {"id": "C", "text": "To make", "isCorrect": false}, {"id": "D", "text": "To be made", "isCorrect": false}, {"id": "E", "text": "Is made", "isCorrect": true}]	E	2	\N	2025-12-27 15:17:53.735	2025-12-27 15:17:53.735	\N
cmjog2xu6001y92udhaqzj7e4	SOAL-00046	"A well-known architect is designing our new office." The passive form of the above sentence is, "Our new office ... by a well-known architect."	PILIHAN_GANDA	\N	[{"id": "A", "text": "Design", "isCorrect": false}, {"id": "B", "text": "Designed", "isCorrect": false}, {"id": "C", "text": "Is being designed", "isCorrect": true}, {"id": "D", "text": "Be designing", "isCorrect": false}, {"id": "E", "text": "Is designed", "isCorrect": false}]	C	2	\N	2025-12-27 15:17:53.74	2025-12-27 15:17:53.74	\N
cmjog2xub001z92udg0uu2r2v	SOAL-00047	Q: How do you go to school? Y: We ___ the bus to school	PILIHAN_GANDA	\N	[{"id": "A", "text": "Rode", "isCorrect": false}, {"id": "B", "text": "Ride", "isCorrect": true}, {"id": "C", "text": "Riden", "isCorrect": false}, {"id": "D", "text": "Riding", "isCorrect": false}, {"id": "E", "text": "Rides", "isCorrect": false}]	B	2	\N	2025-12-27 15:17:53.747	2025-12-27 15:17:53.747	\N
cmjog2xui002092udi1ftqufd	SOAL-00048	Tari ... to the bank two hours ago she said she wanted to save her money.	PILIHAN_GANDA	\N	[{"id": "A", "text": "Gone", "isCorrect": false}, {"id": "B", "text": "Went", "isCorrect": true}, {"id": "C", "text": "Goes", "isCorrect": false}, {"id": "D", "text": "Go", "isCorrect": false}, {"id": "E", "text": "Going", "isCorrect": false}]	B	2	\N	2025-12-27 15:17:53.753	2025-12-27 15:17:53.753	\N
cmjog2xun002192udnev0pifm	SOAL-00049	X: When did you do your homework? Y: I ... my homework when you watched television.	PILIHAN_GANDA	\N	[{"id": "A", "text": "Does", "isCorrect": false}, {"id": "B", "text": "Am doing", "isCorrect": false}, {"id": "C", "text": "Was done", "isCorrect": false}, {"id": "D", "text": "Has done", "isCorrect": false}, {"id": "E", "text": "Was doing", "isCorrect": true}]	E	2	\N	2025-12-27 15:17:53.758	2025-12-27 15:17:53.758	\N
cmjog2xut002292udxejgv62k	SOAL-00050	Q: When do you do your homework? R: ...	PILIHAN_GANDA	\N	[{"id": "A", "text": "I have did my homework at 6 pm", "isCorrect": false}, {"id": "B", "text": "I did my homework at 6 pm", "isCorrect": false}, {"id": "C", "text": "I am doing my homework at 6 pm", "isCorrect": false}, {"id": "D", "text": "I do my job at home at 6 pm", "isCorrect": false}, {"id": "E", "text": "I do my homework at 6 pm", "isCorrect": true}]	E	2	\N	2025-12-27 15:17:53.765	2025-12-27 15:17:53.765	\N
cmjog2xuz002392ud1e8cli9y	SOAL-00051	Questions 26 – 50 are based on a selection of reading materials. You have to choose the best answer for each question. Questions 26 to 31 based on the following text. Dear Editor We are writing to complain about ads on TV. There are so many ads, especially during our favorite programs. We think they should be stopped for a number of reasons. First, ads are nuisance. They go on for a long time and there are so many. Sometimes there seems to be more ads than programs. Second, ads are bad influence on people. They try to encourage people to buy unhealthy food like beer, soft drink, candy and chips. And they make people want things they do not really need and cannot. Finally, the people who make ads have too much say in what programs people watch. That is because they want to put all their ads on popular programs that a lot of people watch. Some programs which are not so popular get stopped because they do not attract enough ads, even though those programs may be someone’s favorite. For those reasons, we think TV station should stop showing ads. They interrupt programs. They are bad influences on people, and they are sometimes put a stop to people’s favorite shows. We are sick of ads, and now we mostly watch other channels. David What kind of genre does the text above belong to?	PILIHAN_GANDA	\N	[{"id": "A", "text": "Descriptive text", "isCorrect": false}, {"id": "B", "text": "Narrative text", "isCorrect": false}, {"id": "C", "text": "Hortatory exposition", "isCorrect": true}, {"id": "D", "text": "Recount text", "isCorrect": false}, {"id": "E", "text": "Report text", "isCorrect": false}]	C	2	\N	2025-12-27 15:17:53.77	2025-12-27 15:17:53.77	\N
cmjog2xv5002492udsr5n8z5h	SOAL-00052	What is the purpose of the text?	PILIHAN_GANDA	\N	[{"id": "A", "text": "To persuade the reader or listener about the most important case.", "isCorrect": false}, {"id": "B", "text": "To persuade the reader or listener that something should be the case.", "isCorrect": false}, {"id": "C", "text": "To persuade the reader or listener that something should", "isCorrect": false}, {"id": "D", "text": "To inform the reader or listener about some cases", "isCorrect": true}, {"id": "E", "text": "To give opinion to the reader or listener related some cases.or should not be done", "isCorrect": false}]	D	2	\N	2025-12-27 15:17:53.776	2025-12-27 15:17:53.776	\N
cmjog2xvc002592udwi6m1bnk	SOAL-00053	The generic structure of the text above is…..	PILIHAN_GANDA	\N	[{"id": "A", "text": "thesis – arguments – reiteration", "isCorrect": false}, {"id": "B", "text": "description – identification", "isCorrect": false}, {"id": "C", "text": "identification – description", "isCorrect": true}, {"id": "D", "text": "thesis – arguments – recommendation", "isCorrect": false}, {"id": "E", "text": "orientation – event – reorientation", "isCorrect": false}]	C	2	\N	2025-12-27 15:17:53.783	2025-12-27 15:17:53.783	\N
cmjog2xvh002692udjtnws2kh	SOAL-00054	Who is the letter addressed to?	PILIHAN_GANDA	\N	[{"id": "A", "text": "Advertisement", "isCorrect": false}, {"id": "B", "text": "Reader", "isCorrect": false}, {"id": "C", "text": "Listener", "isCorrect": false}, {"id": "D", "text": "David", "isCorrect": false}, {"id": "E", "text": "Editor", "isCorrect": true}]	E	2	\N	2025-12-27 15:17:53.789	2025-12-27 15:17:53.789	\N
cmjog2xvo002792udr9fc8qzs	SOAL-00055	The following statements are true based on the text, except…..	PILIHAN_GANDA	\N	[{"id": "A", "text": "Advertisement encourages people to buy unhealthy food.", "isCorrect": false}, {"id": "B", "text": "Advertisement is a nuisance..", "isCorrect": false}, {"id": "C", "text": "Advertisement interrupts programs.", "isCorrect": false}, {"id": "D", "text": "Advertisement has many advantages.", "isCorrect": true}, {"id": "E", "text": "Advertisement puts a stop to people’s favourite show.", "isCorrect": false}]	D	2	\N	2025-12-27 15:17:53.795	2025-12-27 15:17:53.795	\N
cmjog2xvu002892udgcsbq6hg	SOAL-00056	In what paragraph is stating an issue?	PILIHAN_GANDA	\N	[{"id": "A", "text": "Second paragraph", "isCorrect": false}, {"id": "B", "text": "First paragraph", "isCorrect": true}, {"id": "C", "text": "Third paragraph", "isCorrect": false}, {"id": "D", "text": "Fourth paragraph", "isCorrect": false}, {"id": "E", "text": "The last paragraph", "isCorrect": false}]	B	2	\N	2025-12-27 15:17:53.801	2025-12-27 15:17:53.801	\N
cmjog2xvz002992udlkdj810r	SOAL-00057	Questions 32 to 34 based on the following text. Space Travel Space travel should be stopped for many reasons. Firstly, it is totally unsafe as proven by the Colombia Space Shuttle disaster. Thousand people have been killed in accidents. Secondly, it costs billions and billions dollars every day just to put fuel into rockets. Professor Smith from the Spend Money on People Space Association agrees that space travel is a waste of time and money. Further, space travel is altering the world’s weather pattern as evidenced by the record of high temperatures this summer in Cobar. Everyone knows that if God wanted us to fly in space we should have been born with space suits. Stop space before it destroys the earth. How many reasons are stated in the text dealing with the point that Space travel should be stopped?	PILIHAN_GANDA	\N	[{"id": "A", "text": "One", "isCorrect": false}, {"id": "B", "text": "Two", "isCorrect": false}, {"id": "C", "text": "Three", "isCorrect": true}, {"id": "D", "text": "Four", "isCorrect": false}, {"id": "E", "text": "Five", "isCorrect": false}]	C	2	\N	2025-12-27 15:17:53.807	2025-12-27 15:17:53.807	\N
cmjog2xw6002a92udgparw4k3	SOAL-00058	Which is not true based on the text above…..	PILIHAN_GANDA	\N	[{"id": "A", "text": "Space travel costs billions and billions of dollars everyday", "isCorrect": true}, {"id": "B", "text": "Space travel offer benefits to the earth", "isCorrect": false}, {"id": "C", "text": "Space travel destroys the earth", "isCorrect": false}, {"id": "D", "text": "Space travel should be stopped", "isCorrect": false}, {"id": "E", "text": "Space travel is unsafe", "isCorrect": false}]	A	2	\N	2025-12-27 15:17:53.814	2025-12-27 15:17:53.814	\N
cmjog2xwc002b92udlk1pqxvu	SOAL-00059	Stop space before it destroys the earth. This part of paragraph indicates the …	PILIHAN_GANDA	\N	[{"id": "A", "text": "Argument", "isCorrect": false}, {"id": "B", "text": "Reinforcement", "isCorrect": false}, {"id": "C", "text": "Recommendation", "isCorrect": true}, {"id": "D", "text": "Thesis", "isCorrect": false}, {"id": "E", "text": "Elaboration", "isCorrect": false}]	C	2	\N	2025-12-27 15:17:53.819	2025-12-27 15:17:53.819	\N
cmjog2xwi002c92udizouby9g	SOAL-00060	Stop space before it destroys the earth. What does the word “it” refer to…..	PILIHAN_GANDA	\N	[{"id": "A", "text": "Space", "isCorrect": false}, {"id": "B", "text": "Travel", "isCorrect": false}, {"id": "C", "text": "Space suit", "isCorrect": false}, {"id": "D", "text": "The earth", "isCorrect": false}, {"id": "E", "text": "Space travel", "isCorrect": true}]	E	2	\N	2025-12-27 15:17:53.826	2025-12-27 15:17:53.826	\N
cmjog2xwp002d92ud0j86c559	SOAL-00061	Questions 36 to 39 refer to the following text. Venice is a city in northern Italy. It has been known as the “Queen of the Adriatic”, “City of Bridges”, and “The City of Light”. The city stretches across 117 small islands in the marshy Venetian Lagoon along the Adriatic Sea in northeast Italy. Venice is world famous for its canals. It is built on an archipelago of 117 islands formed by about 150 canals in a shallow lagoon. The islands on which the city is built are connected by about 400 bridges. In the old center, the canals serve the function of roads, and every form of transport is on water or on foot. You can ride gondola there. It is the classical Venetian boat which nowadays is mostly used for tourists, or weddings, funerals, or other ceremonies. Now, most Venetians travel by motorized waterbuses which ply regular routes along the major canals and between the city’s islands. The city has many private boats. The only gondolas still in common use by Venetians are the Traghetti, foot passenger ferries crossing the Grand Canal at certain points without bridges. What does the second paragraph of the text tell us about?	PILIHAN_GANDA	\N	[{"id": "A", "text": "The forms of transport in the world.", "isCorrect": false}, {"id": "B", "text": "The canals and roads that people like to use.", "isCorrect": false}, {"id": "C", "text": "The archipelago that has a lot of islands.", "isCorrect": false}, {"id": "D", "text": "Venice as the world famous for its canals.", "isCorrect": true}, {"id": "E", "text": "Venice is the city of light", "isCorrect": false}]	D	2	\N	2025-12-27 15:17:53.832	2025-12-27 15:17:53.832	\N
cmjog2xwu002e92udje7ql3x2	SOAL-00062	What transport crosses the Grand Canal for foot passengers at certain points without bridges?	PILIHAN_GANDA	\N	[{"id": "A", "text": "Gondolas.", "isCorrect": false}, {"id": "B", "text": "Traghetti.", "isCorrect": true}, {"id": "C", "text": "Waterbuses.", "isCorrect": false}, {"id": "D", "text": "Lagoon.", "isCorrect": false}, {"id": "E", "text": "Ship", "isCorrect": false}]	B	2	\N	2025-12-27 15:17:53.837	2025-12-27 15:17:53.837	\N
cmjog2xwz002f92ud90pv1oiq	SOAL-00063	What does the text tell you about?	PILIHAN_GANDA	\N	[{"id": "A", "text": "Gondola.", "isCorrect": false}, {"id": "B", "text": "Traghetti.", "isCorrect": false}, {"id": "C", "text": "Venice", "isCorrect": true}, {"id": "D", "text": "Italy.", "isCorrect": false}, {"id": "E", "text": "Venetian boat", "isCorrect": false}]	C	2	\N	2025-12-27 15:17:53.843	2025-12-27 15:17:53.843	\N
cmjog2xx4002g92udpprth6by	SOAL-00064	From the text we can say that Venice belongs to a city of ….	PILIHAN_GANDA	\N	[{"id": "A", "text": "Water", "isCorrect": true}, {"id": "B", "text": "Ceremonies", "isCorrect": false}, {"id": "C", "text": "Buses", "isCorrect": false}, {"id": "D", "text": "Funerals", "isCorrect": false}, {"id": "E", "text": "Gondola", "isCorrect": false}]	A	2	\N	2025-12-27 15:17:53.848	2025-12-27 15:17:53.848	\N
cmjog2xxb002h92udioqb37fp	SOAL-00065	Questions 40 to 43 refer to the following text. Orchard Road is a Boulevard which becomes business and entertainment center in Singapore. Orchard Road is surrounded by a lush tropical and flower gardens which are beautiful. At first, Orchard Road is just a suburban street lined with orchards, plantations nutmeg, and pepper farming. However, in the 1970s, it turned into a shopping center in Singapore. In 1960 and 1970 entertainment industries began to enter this road. Shopping centers such as mall and Plaza was built in 1974. Orchard Road runs along about 2.2 km. This road is one-way street flanked by a variety of shopping malls, hotels and restaurants. The shopping area which is nearly 800,000 square meters provides a wide range of Things, food, and entertainment. In this area there are many options that can satisfy visitors from all walks of life starting from the luxury branded things to the Popular branded, from exclusive restaurants to fast food. There are so many ways that can be accessed to get to Orchard road such as: by taxi, bus or drive your own car. For those who are driving to Orchard Road can be entered from the west through the Napier Road. Vehicles from Dunearn Road can turn to left at the intersection of the Marriott Hotel junction. Vehicles that come from Paterson can turn right onto Orchard Road. Orchard is always crowded so you have to be careful in order not to get lost. In the third paragraph the writer describes about?	PILIHAN_GANDA	\N	[{"id": "A", "text": "The location of Orchard Road", "isCorrect": false}, {"id": "B", "text": "The direction to get to Orchard Road", "isCorrect": true}, {"id": "C", "text": "The things that we can see at orchard road", "isCorrect": false}, {"id": "D", "text": "The history of Orchard Road", "isCorrect": false}, {"id": "E", "text": "The distance of Orchard Road", "isCorrect": false}]	B	2	\N	2025-12-27 15:17:53.854	2025-12-27 15:17:53.854	\N
cmjog2xxf002i92udje23hc3x	SOAL-00066	Which statement is TRUE?	PILIHAN_GANDA	\N	[{"id": "A", "text": "At first Orchard Road is a crowded settlement", "isCorrect": false}, {"id": "B", "text": "Orchard road became business and entertainment center since 1974", "isCorrect": false}, {"id": "C", "text": "Vehicles from Dunrean road turn to the left at intersection of the Marriott Hotel junction", "isCorrect": true}, {"id": "D", "text": "Orchard road is infamous place at Singapore", "isCorrect": false}, {"id": "E", "text": "Orchard road is not surrounded by flower garden", "isCorrect": false}]	C	2	\N	2025-12-27 15:17:53.859	2025-12-27 15:17:53.859	\N
cmjog2xxm002j92udcctdgs99	SOAL-00067	The text mainly focuses on	PILIHAN_GANDA	\N	[{"id": "A", "text": "Singapore", "isCorrect": false}, {"id": "B", "text": "Orchard Plantation", "isCorrect": false}, {"id": "C", "text": "Plaza and Mall", "isCorrect": false}, {"id": "D", "text": "Orchard road as business and entertainment center", "isCorrect": true}, {"id": "E", "text": "Shopping Center", "isCorrect": false}]	D	2	\N	2025-12-27 15:17:53.865	2025-12-27 15:17:53.865	\N
cmjog2xxs002k92ud2rjveizm	SOAL-00068	Words “it” in line 4 refers to?	PILIHAN_GANDA	\N	[{"id": "A", "text": "The plantation", "isCorrect": false}, {"id": "B", "text": "Luxury branded things", "isCorrect": false}, {"id": "C", "text": "Suburban street", "isCorrect": true}, {"id": "D", "text": "The plaza", "isCorrect": false}, {"id": "E", "text": "Singapore", "isCorrect": false}]	C	2	\N	2025-12-27 15:17:53.871	2025-12-27 15:17:53.871	\N
cmjog2xxx002l92udhtw9nbec	SOAL-00069	Questions 44 to 47 refer to the following text. A long time ago, there lived on the island of Bali a giant-like creature named Kebo Iwo. The people of Bali used to say that Kebo Iwo was everything, a destroyer as well as a creator. He was satisfied with the meal, but this meant for the Balinese people enough food for a thousand men. Difficulties arose when for the first time the barns were almost empty and the new harvest was still a long way off. This made Kebo Iwo wild with great anger. In his hunger, he destroyed all the houses and even all the temples. It made the Balinese turn to rage. So, they came together to plan steps to oppose this powerful giant by using his stupidity. They asked Kebo Iwo to build them a very deep well, and rebuild all the houses and temples he had destroyed. After they fed Kebo Iwo, he began to dig a deep hole. One day he had eaten too much, he fell asleep in the hole. The oldest man in the village gave a sign, and the villagers began to throw the limestone they had collected before into the hole. The limestone made the water inside the hole boiling. Kebo Iwo was buried alive. Then the water in the well rose higher and higher until at last it overflowed and formed Lake Batur. The mound of earth dug from the well by Kebo Iwo is known as Mount Batur Which the following fact is true about Kebo Iwo?	PILIHAN_GANDA	\N	[{"id": "A", "text": "Kebo Iwo ate a little amount of meat", "isCorrect": false}, {"id": "B", "text": "Kebo Iwo is a destroyer that cannot make anything", "isCorrect": false}, {"id": "C", "text": "Kebo Iwo was angry because his food was stolen by Balinese people", "isCorrect": false}, {"id": "D", "text": "Kebo eat food was equal for food of thousand people", "isCorrect": true}, {"id": "E", "text": "Kebo Iwo destroyed all the house but not the temple", "isCorrect": false}]	D	2	\N	2025-12-27 15:17:53.876	2025-12-27 15:17:53.876	\N
cmjog2xy3002m92udl2tf3c5c	SOAL-00070	According to the story, if Kebo Iwa is never existed in Bali island, what do you think will happen?	PILIHAN_GANDA	\N	[{"id": "A", "text": "There will be no Bali island", "isCorrect": false}, {"id": "B", "text": "Bali People will never be angry", "isCorrect": false}, {"id": "C", "text": "All Bali people will live in a prosperous way", "isCorrect": false}, {"id": "D", "text": "Mount Batur will not be a sacred place now", "isCorrect": false}, {"id": "E", "text": "We are not able see the beauty of Lake Batur", "isCorrect": true}]	E	2	\N	2025-12-27 15:17:53.883	2025-12-27 15:17:53.883	\N
cmjog2xy8002n92udcin0uxlx	SOAL-00071	Why did Kebo Iwo feel angry to the Balinese people?	PILIHAN_GANDA	\N	[{"id": "A", "text": "Because Balinese people didn’t give him food", "isCorrect": true}, {"id": "B", "text": "Because Balinese people took his food so his barns was empty", "isCorrect": false}, {"id": "C", "text": "Because Balinese people ate his meal", "isCorrect": false}, {"id": "D", "text": "Because Balinese people were in hunger", "isCorrect": false}, {"id": "E", "text": "Because Balinese people turned to rage", "isCorrect": false}]	A	2	\N	2025-12-27 15:17:53.887	2025-12-27 15:17:53.887	\N
cmjog2xye002o92ud8ijbppyn	SOAL-00072	What is mount batur?	PILIHAN_GANDA	\N	[{"id": "A", "text": ".A lake build by Kebo Iwa", "isCorrect": false}, {"id": "B", "text": ".A mound of earth dug from the well by Kebo iwa", "isCorrect": true}, {"id": "C", "text": ".The mountain build by Kebo Iwa", "isCorrect": false}, {"id": "D", "text": ".A well dug by Kebo iwa", "isCorrect": false}, {"id": "E", "text": ".A home build by Balinese people to Kebo Iwa", "isCorrect": false}]	B	2	\N	2025-12-27 15:17:53.893	2025-12-27 15:17:53.893	\N
cmjog2xyj002p92ud1wgmpm5z	SOAL-00073	Questions 48 to 50 refer to the following text. A long time ago, very few people lived in the New Territories. There were only a few villages. If the people wanted to go from one village to another, they often had to pass through wild and unsafe forest. One day, a farmer’s young wife went to the next village to visit her own mother and brother. She brought along her baby son. When it was time for her to leave, her brother said “ it is getting dark. Let my son, Ah Tim go with you though the forest.” So Ah Tim led the way and the young woman followed behind, carrying her baby. When they were in the forest, suddenly they saw a group of wolves. They began to run to avoid the danger, but Ah Tim kicked against a stone and fell down. At once the wolves caught him. The young woman cried to the wolves, “ please eat my own son instead.” Then, she put her baby son on the ground in front of the wolves and took her nephew away. Everyone understood that this was because the woman was very good and kind. She had offered her own son’s life to save her nephew. They ran back to the house and called for help. All men in the village fetched thick sticks and went back with her into the forest. When they got there, they saw something very strange. Instead of eating the woman’s baby the wolves were playing with him. What is the purpose of the writer by writing the story above?	PILIHAN_GANDA	\N	[{"id": "A", "text": "To describe the danger of the villages", "isCorrect": false}, {"id": "B", "text": "To narrate how the wolves were playing with the baby.", "isCorrect": false}, {"id": "C", "text": "To tell the villagers’ relationship", "isCorrect": false}, {"id": "D", "text": "To explain how important a relative is", "isCorrect": false}, {"id": "E", "text": "To entertain the readers of the story", "isCorrect": true}]	E	2	\N	2025-12-27 15:17:53.898	2025-12-27 15:17:53.898	\N
cmjog2xyp002q92udeuzoqrz9	SOAL-00074	The brother let her son go with his aunt as she left home because ….	PILIHAN_GANDA	\N	[{"id": "A", "text": "Ah Tim wanted to see the wolves", "isCorrect": false}, {"id": "B", "text": "Ah Tim would be a guardian for them", "isCorrect": true}, {"id": "C", "text": "Ah Tim was bored to live with his parents", "isCorrect": false}, {"id": "D", "text": "The baby was too cute to be alone", "isCorrect": false}, {"id": "E", "text": "His aunt wanted him to come long", "isCorrect": false}]	B	2	\N	2025-12-27 15:17:53.905	2025-12-27 15:17:53.905	\N
cmjog2xyw002r92uds09rf6oc	SOAL-00075	From the passage we learn that the villages were ….	PILIHAN_GANDA	\N	[{"id": "A", "text": "Separated by untamed jungles", "isCorrect": true}, {"id": "B", "text": "Situated in a large district", "isCorrect": false}, {"id": "C", "text": "Located in one huge area", "isCorrect": false}, {"id": "D", "text": "Wild and unsafe", "isCorrect": false}, {"id": "E", "text": "Dark and very dangerous", "isCorrect": false}]	A	2	\N	2025-12-27 15:17:53.911	2025-12-27 15:17:53.911	\N
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
cmj9z8yly00345dudadjrqvfh	0000000000000044	Zulfi Amaliyah, S.Kom	zulfiamaliyah1306@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.742	2025-12-17 12:26:16.194	\N	cmj9z8ylv00335dudr8tet2na
cmj9z8ybn002q5dud7n4058u9	5040758659300040	Nurmala Evayanti S.Pd.	nurmalaevayanti2006@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.371	2025-12-23 11:57:12.118	\N	cmj9z8ybk002p5dudp5man22v
cmj9z8y4a002g5dudjlq4s2jp	0000000000000066	M. Fais Jainuddin, S.Pd	faizabrahammalik@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.105	2025-12-23 11:57:31.914	\N	cmj9z8y44002f5dudfvho6nza
cmj9z8y77002k5dudwjch4365	8834765666130320	Moh. Yunus Ansori, S.Pd.	yunuskacer@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.211	2025-12-23 11:58:13.302	\N	cmj9z8y73002j5dud9ooury49
cmj9z8yem002u5dudolwskcz4	1201212121212110	Rizky Lutfi Romadona, S.Kom	rizkielutfi@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.477	2025-12-23 11:58:40.481	\N	cmj9z8yej002t5dudlb0wn4mh
cmj9z8xtu00225dudew59ixr7	8550751654200000	Aini Abdul Cholis S.Pd.	ainiabdcholis.73@gmail.com	081234567890	AKTIF	2025-12-17 12:17:53.73	2025-12-23 11:59:18.368	\N	cmj9z8xto00215dudxiyqcr71
cmj9z8y5q002i5dudk3gr40r9	00000000000023235	Moh. Rohim, S.T.	mohrohim02@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.158	2025-12-23 12:02:46.205	\N	cmj9z8y5n002h5dud9vb23462
cmj9z8xvg00245duda7dxbp56	3449744648300010	Dra. Subur Hindartin	drasuburhindartin@gmail.com	081234567890	AKTIF	2025-12-17 12:17:53.787	2025-12-23 12:00:48.021	\N	cmj9z8xvb00235dudd4xbolii
cmj9z8yd4002s5dudqb9lav2o	0000000000000007878	Nurul Hidayah, S.E.	nurulhidayahse485@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.423	2025-12-23 12:01:50.717	\N	cmj9z8ycz002r5duda3p9ojun
cmj9z8y2q002e5dud69l0gx00	00000000000000004	Imtiana, S.Pd	imtianateguh@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.049	2025-12-23 12:04:57.009	\N	cmj9z8y2n002d5dudjgj6nzx4
cmj9z8y8o002m5dudwnycw1jf	0000000000000006	Mulyono, S.Th.	danzia22@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.263	2025-12-23 12:05:31.217	\N	cmj9z8y8l002l5dudo8u4k81t
cmj9z8yhl002y5dudqly12oc3	8549764665110030	Syamsul Rizal, S.Pd.I.	rizalpecintaseni@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.585	2025-12-23 12:05:44.242	\N	cmj9z8yhh002x5dud9my7ci8i
cmj9z8xyc00285dudgvf5bnnv	3455763666300010	Erlin Novia Diana, S.E.	erlinnoviadiana@gmail.com	081234567890	AKTIF	2025-12-17 12:17:53.891	2025-12-23 12:06:19.489	\N	cmj9z8xy800275dudsv8ypuim
cmj9z8xwv00265dud0w98oh1m	00000000230011444	Dwi Wahyudi, S.T,	yudiaster1922@gmail.com	081234567890	AKTIF	2025-12-17 12:17:53.839	2025-12-23 12:07:53.385	\N	cmj9z8xws00255dudbgtsplon
cmj9z8ykj00325dudk20mdgjx	00000000003444211	Wahyu Mirnawati, S.Ak.	wahyumirnawati30@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.691	2025-12-23 12:08:17.471	\N	cmj9z8ykf00315duda3u6niqb
cmj9z8y1b002c5dudh3e7fyuu	0000000023232323	Frances Laurence Setyo Budi, S.Pd.	franceskoyen16@gmail.com	081234567890	AKTIF	2025-12-17 12:17:53.998	2025-12-23 12:08:30.754	\N	cmj9z8y16002b5dudps21lpfm
cmj9z8ya7002o5dudm0yzma1k	5736762663300210	Nunung Indrawati, S.Pd.	nunungindrawati437@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.318	2025-12-25 11:59:15.002	\N	cmj9z8ya2002n5dudxxrmi27p
cmj9z8xzs002a5dudw0c717l2	00000000000000022222	Fera Mega Haristina, S.Tr.Kom.	feramegaharistiana@gmail.com	081234567890	AKTIF	2025-12-17 12:17:53.943	2025-12-25 12:04:08.915	\N	cmj9z8xzp00295dudiet5g8kd
cmj9z8yg3002w5dud29sel0av	00000000000000977	Siska Purwanti, S.E.	purwantisiska25@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.53	2025-12-25 12:08:06.998	\N	cmj9z8yfy002v5dudvf51yqq4
cmj9z8ynh00365dudxaiuoy08	00000000000000076	Maulida Putri Lesmana	pa717885@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.797	2025-12-27 14:54:01.414	\N	cmj9z8ynd00355dudycn1e6hi
cmj9z8yj000305dudtwddc0j1	0000000000000010044	Udayani, S.Pd.	udayaniprayuda@gmail.com	081234567890	AKTIF	2025-12-17 12:17:54.635	2025-12-27 14:54:08.736	\N	cmj9z8yix002z5dudbc4lk8nv
\.


--
-- Data for Name: JadwalPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") FROM stdin;
cmjh3jl490001cqud3kr1298a	SENIN	07:38	08:16	cmj5ec9zf0000jsudgpxci2hf	cmj9z7qae00205dudqey9zf1h	cmj9z8yox00385dudt5p2uvo1	2025-12-22 11:52:32.168	2025-12-22 11:52:32.168
cmjh3jv8w0002cqudpqnp8a1z	SENIN	08:16	08:54	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8c001f5dudtoyt49tx	cmj9z8xzs002a5dudw0c717l2	2025-12-22 11:52:45.296	2025-12-22 11:52:45.296
cmjh3kyxc0003cqudd8vzybo0	SENIN	08:54	09:32	cmj5ec9zf0000jsudgpxci2hf	cmj9z7qae00205dudqey9zf1h	cmj9z8y2q002e5dud69l0gx00	2025-12-22 11:53:36.719	2025-12-22 11:53:36.719
cmjle3ec40000omudiuwni8lz	KAMIS	07:00	07:38	cmj5eca0w0006jsud9bca11b3	cmj9z7q9c001p5dudhh2cp17a	cmj9z8ya7002o5dudm0yzma1k	2025-12-25 11:58:57.363	2025-12-25 11:59:23.978
cmjle4b0i0001omudres3aulf	KAMIS	07:38	08:16	cmj5eca0w0006jsud9bca11b3	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-25 11:59:39.714	2025-12-25 11:59:39.714
cmjle4mr10002omudrzqfeej5	KAMIS	08:16	08:54	cmj5eca0w0006jsud9bca11b3	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-25 11:59:54.925	2025-12-25 11:59:54.925
cmjle4vcx0003omuduoa9f8ih	KAMIS	08:54	09:32	cmj5eca0w0006jsud9bca11b3	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-25 12:00:06.08	2025-12-25 12:00:06.08
cmjle52gk0004omudekm730j8	KAMIS	10:10	10:45	cmj5eca0w0006jsud9bca11b3	cmj9z7qae00205dudqey9zf1h	cmj9z8yhl002y5dudqly12oc3	2025-12-25 12:00:15.284	2025-12-25 12:00:15.284
cmjle57bs0005omudljdfnapu	KAMIS	10:45	11:20	cmj5eca0w0006jsud9bca11b3	cmj9z7qae00205dudqey9zf1h	cmj9z8yhl002y5dudqly12oc3	2025-12-25 12:00:21.592	2025-12-25 12:00:21.592
cmjle5gsf0006omud9y3t25ck	KAMIS	11:20	11:55	cmj5eca0w0006jsud9bca11b3	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-25 12:00:33.855	2025-12-25 12:00:33.855
cmjle5nco0007omudzwm9xe0g	KAMIS	11:55	12:30	cmj5eca0w0006jsud9bca11b3	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-25 12:00:42.36	2025-12-25 12:00:42.36
cmjle5vdc0008omud2fpqo9r5	KAMIS	12:30	13:05	cmj5eca0w0006jsud9bca11b3	cmj9z7q98001o5dudu8zzru3q	cmj9z8xwv00265dud0w98oh1m	2025-12-25 12:00:52.752	2025-12-25 12:00:52.752
cmjle6gig0009omudomtsllhe	KAMIS	07:00	07:38	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	2025-12-25 12:01:20.152	2025-12-25 12:01:20.152
cmjle6o4y000aomud96eehydy	KAMIS	07:38	08:16	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	2025-12-25 12:01:30.033	2025-12-25 12:01:30.033
cmjle6t5h000bomud3pjpd28v	KAMIS	08:16	08:54	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	2025-12-25 12:01:36.533	2025-12-25 12:01:36.533
cmjle6yeq000comud34gyikka	KAMIS	08:54	09:32	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	2025-12-25 12:01:43.345	2025-12-25 12:01:43.345
cmjle7ckl000domudjcd3bg8f	KAMIS	10:10	10:45	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8q001j5dudx5o1zuri	cmj9z8xvg00245duda7dxbp56	2025-12-25 12:02:01.701	2025-12-25 12:02:01.701
cmjle7n4q000eomudufb8utm9	KAMIS	10:45	11:20	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8q001j5dudx5o1zuri	cmj9z8xvg00245duda7dxbp56	2025-12-25 12:02:15.386	2025-12-25 12:02:15.386
cmjle7w40000fomudf4jtf81a	KAMIS	11:20	11:55	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8h001g5dud3cnj22wr	cmj9z8y2q002e5dud69l0gx00	2025-12-25 12:02:27.024	2025-12-25 12:02:27.024
cmjle81yp000gomudiv4senhp	KAMIS	11:55	12:30	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8h001g5dud3cnj22wr	cmj9z8y2q002e5dud69l0gx00	2025-12-25 12:02:34.608	2025-12-25 12:02:34.608
cmjle8605000homudlg0puuff	KAMIS	12:30	13:05	cmj5ec9zf0000jsudgpxci2hf	cmj9z7q8h001g5dud3cnj22wr	cmj9z8y2q002e5dud69l0gx00	2025-12-25 12:02:39.844	2025-12-25 12:02:39.844
cmjle8k9e000iomudgmpmezmv	KAMIS	07:00	07:38	cmj5eca0e0003jsud1uxj50o4	cmj9z7q90001m5dud5q6cvaku	cmj9z8yhl002y5dudqly12oc3	2025-12-25 12:02:58.321	2025-12-25 12:02:58.321
cmjle8p85000jomudfxmra6sh	KAMIS	07:38	08:16	cmj5eca0e0003jsud1uxj50o4	cmj9z7q90001m5dud5q6cvaku	cmj9z8yhl002y5dudqly12oc3	2025-12-25 12:03:04.757	2025-12-25 12:03:04.757
cmjle8xci000komudx6155p78	KAMIS	08:16	08:54	cmj5eca0e0003jsud1uxj50o4	cmj9z7q90001m5dud5q6cvaku	cmj9z8yhl002y5dudqly12oc3	2025-12-25 12:03:15.281	2025-12-25 12:03:15.281
cmjle9794000lomud6elyt814	KAMIS	08:54	09:32	cmj5eca0e0003jsud1uxj50o4	cmj9z7q7y001c5dudu38a65qb	cmj9z8y4a002g5dudjlq4s2jp	2025-12-25 12:03:28.12	2025-12-25 12:03:28.12
cmjle9hhk000momudhytuwwiq	KAMIS	10:10	10:45	cmj5eca0e0003jsud1uxj50o4	cmj9z7q7y001c5dudu38a65qb	cmj9z8y4a002g5dudjlq4s2jp	2025-12-25 12:03:41.384	2025-12-25 12:03:41.384
cmjleafyh000nomudeto6v4ox	KAMIS	10:45	11:20	cmj5eca0e0003jsud1uxj50o4	cmj9z7q87001e5dudb1uk5u9j	cmj9z8xzs002a5dudw0c717l2	2025-12-25 12:04:26.056	2025-12-25 12:04:26.056
cmjlean30000oomudn27l34ms	KAMIS	11:20	11:55	cmj5eca0e0003jsud1uxj50o4	cmj9z7q87001e5dudb1uk5u9j	cmj9z8xzs002a5dudw0c717l2	2025-12-25 12:04:35.292	2025-12-25 12:04:35.292
cmjlearce000pomudy8hsv17u	KAMIS	11:55	12:30	cmj5eca0e0003jsud1uxj50o4	cmj9z7q87001e5dudb1uk5u9j	cmj9z8xzs002a5dudw0c717l2	2025-12-25 12:04:40.814	2025-12-25 12:04:40.814
cmjleawgk000qomudrrdgkzqp	KAMIS	12:30	13:05	cmj5eca0e0003jsud1uxj50o4	cmj9z7q87001e5dudb1uk5u9j	cmj9z8xzs002a5dudw0c717l2	2025-12-25 12:04:47.444	2025-12-25 12:04:47.444
cmjlebpv9000romudkrdgcvnz	KAMIS	07:00	07:38	cmj5eca130007jsudvzwt5rjx	cmj9z7q8m001i5dudi334c2ms	cmj9z8xyc00285dudgvf5bnnv	2025-12-25 12:05:25.557	2025-12-25 12:05:25.557
cmjleburm000somud01sda1hv	KAMIS	07:38	08:16	cmj5eca130007jsudvzwt5rjx	cmj9z7q8m001i5dudi334c2ms	cmj9z8xyc00285dudgvf5bnnv	2025-12-25 12:05:31.905	2025-12-25 12:05:31.905
cmjlec4pi000tomudp7uy09jy	KAMIS	08:16	08:54	cmj5eca130007jsudvzwt5rjx	cmj9z7q8q001j5dudx5o1zuri	cmj9z8xvg00245duda7dxbp56	2025-12-25 12:05:44.788	2025-12-25 12:05:44.788
cmjlecawk000uomudmb5w2fwb	KAMIS	08:54	09:32	cmj5eca130007jsudvzwt5rjx	cmj9z7q8q001j5dudx5o1zuri	cmj9z8xvg00245duda7dxbp56	2025-12-25 12:05:52.82	2025-12-25 12:05:52.82
cmjlecjom000vomudfv4w4lff	KAMIS	10:10	10:45	cmj5eca130007jsudvzwt5rjx	cmj9z7q7y001c5dudu38a65qb	cmj9z8yj000305dudtwddc0j1	2025-12-25 12:06:04.198	2025-12-25 12:06:04.198
cmjlecubz000womud02x1n4pa	KAMIS	10:45	11:20	cmj5eca130007jsudvzwt5rjx	cmj9z7q7y001c5dudu38a65qb	cmj9z8yj000305dudtwddc0j1	2025-12-25 12:06:17.998	2025-12-25 12:06:17.998
cmjlecxvq000xomudyi7rd9uq	KAMIS	11:20	11:55	cmj5eca130007jsudvzwt5rjx	cmj9z7q7y001c5dudu38a65qb	cmj9z8yj000305dudtwddc0j1	2025-12-25 12:06:22.598	2025-12-25 12:06:22.598
cmjled15t000yomudvewts84v	KAMIS	11:55	12:30	cmj5eca130007jsudvzwt5rjx	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-25 12:06:26.849	2025-12-25 12:06:46.463
cmjled46d000zomudpve0hqfy	KAMIS	12:30	13:05	cmj5eca130007jsudvzwt5rjx	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-25 12:06:30.757	2025-12-25 12:06:51.985
cmjlee1zd0010omud5f3aui6f	KAMIS	07:00	07:38	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q8q001j5dudx5o1zuri	cmj9z8xvg00245duda7dxbp56	2025-12-25 12:07:14.569	2025-12-25 12:07:14.569
cmjlee5bi0011omudoee9uhkp	KAMIS	07:38	08:16	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q8q001j5dudx5o1zuri	cmj9z8xvg00245duda7dxbp56	2025-12-25 12:07:18.893	2025-12-25 12:07:18.893
cmjlefht20012omuds2uma0um	KAMIS	08:16	08:54	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yg3002w5dud29sel0av	2025-12-25 12:08:21.734	2025-12-25 12:08:21.734
cmjleflj40013omud95mewn2f	KAMIS	08:54	09:32	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yg3002w5dud29sel0av	2025-12-25 12:08:26.559	2025-12-25 12:08:26.559
cmjlefvjv0014omudbi1mpy5x	KAMIS	10:10	10:45	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yg3002w5dud29sel0av	2025-12-25 12:08:39.547	2025-12-25 12:08:39.547
cmjleg76w0015omudnsgifj3e	KAMIS	10:45	11:20	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q8x001l5dudh15r8ocj	cmj9z8ykj00325dudk20mdgjx	2025-12-25 12:08:54.632	2025-12-25 12:08:54.632
cmjlegaef0016omud42klgnta	KAMIS	11:20	11:55	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q8x001l5dudh15r8ocj	cmj9z8ykj00325dudk20mdgjx	2025-12-25 12:08:58.791	2025-12-25 12:08:58.791
cmjlegkqy0017omudwters5lg	KAMIS	11:55	12:30	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9c001p5dudhh2cp17a	cmj9z8y1b002c5dudh3e7fyuu	2025-12-25 12:09:12.201	2025-12-25 12:09:12.201
cmjlegq0m0018omud7w2epxqq	KAMIS	12:30	13:05	cmj5ec9zx0001jsud5cnf1k74	cmj9z7q9c001p5dudhh2cp17a	cmj9z8y1b002c5dudh3e7fyuu	2025-12-25 12:09:19.03	2025-12-25 12:09:19.03
cmjleh9960019omudmq6w8ztd	KAMIS	07:00	07:38	cmj5eca0k0004jsuddjewnal1	cmj9z7q8v001k5dudwd0dr0f2	cmj9z8y77002k5dudwjch4365	2025-12-25 12:09:43.961	2025-12-25 12:09:43.961
cmjlehcfp001aomudu0p7xo39	KAMIS	07:38	08:16	cmj5eca0k0004jsuddjewnal1	cmj9z7q8v001k5dudwd0dr0f2	cmj9z8y77002k5dudwjch4365	2025-12-25 12:09:48.084	2025-12-25 12:09:48.084
cmjlehnxu001bomudjmh2tph4	KAMIS	08:16	08:54	cmj5eca0k0004jsuddjewnal1	cmj9z7q9n001s5dudxr525koc	cmj9z8xzs002a5dudw0c717l2	2025-12-25 12:10:02.994	2025-12-25 12:10:02.994
cmjlehted001comud5gk47o4q	KAMIS	08:54	09:32	cmj5eca0k0004jsuddjewnal1	cmj9z7q9n001s5dudxr525koc	cmj9z8xzs002a5dudw0c717l2	2025-12-25 12:10:10.069	2025-12-25 12:10:10.069
cmjlei5hr001domudsggm29fb	KAMIS	10:10	10:45	cmj5eca0k0004jsuddjewnal1	cmj9z7q9c001p5dudhh2cp17a	cmj9z8y1b002c5dudh3e7fyuu	2025-12-25 12:10:25.742	2025-12-25 12:10:25.742
cmjleicno001eomudpvndrb52	KAMIS	10:45	11:20	cmj5eca0k0004jsuddjewnal1	cmj9z7q9c001p5dudhh2cp17a	cmj9z8y1b002c5dudh3e7fyuu	2025-12-25 12:10:35.027	2025-12-25 12:10:35.027
cmjleirkw001fomud8lxcrx2t	KAMIS	11:20	11:55	cmj5eca0k0004jsuddjewnal1	cmj9z7q90001m5dud5q6cvaku	cmj9z8yhl002y5dudqly12oc3	2025-12-25 12:10:54.368	2025-12-25 12:10:54.368
cmjleiv59001gomudrdsbuwyj	KAMIS	11:55	12:30	cmj5eca0k0004jsuddjewnal1	cmj9z7q90001m5dud5q6cvaku	cmj9z8yhl002y5dudqly12oc3	2025-12-25 12:10:58.989	2025-12-25 12:10:58.989
cmjleiyci001homudsmlsg2dc	KAMIS	12:30	13:05	cmj5eca0k0004jsuddjewnal1	cmj9z7q90001m5dud5q6cvaku	cmj9z8yhl002y5dudqly12oc3	2025-12-25 12:11:03.138	2025-12-25 12:11:03.138
cmjlejfla001iomud1yx9n9zk	KAMIS	07:00	07:38	cmj5eca170008jsudb4r1h58n	cmj9z7q9v001v5dud8r2heab2	cmj9z8xzs002a5dudw0c717l2	2025-12-25 12:11:25.486	2025-12-25 12:11:25.486
cmjlejkbx001jomudbvvsb4dm	KAMIS	07:38	08:16	cmj5eca170008jsudb4r1h58n	cmj9z7q9v001v5dud8r2heab2	cmj9z8xzs002a5dudw0c717l2	2025-12-25 12:11:31.628	2025-12-25 12:11:31.628
cmjlejsus001komudzlxyfomi	KAMIS	08:16	08:54	cmj5eca170008jsudb4r1h58n	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-25 12:11:42.675	2025-12-25 12:11:42.675
cmjlejzgo001lomudzzkt8frb	KAMIS	08:54	09:32	cmj5eca170008jsudb4r1h58n	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-25 12:11:51.239	2025-12-25 12:11:51.239
cmjlek7ws001momuddzw2zk63	KAMIS	10:10	10:45	cmj5eca170008jsudb4r1h58n	cmj9z7q9f001q5dud3giiabft	cmj9z8y5q002i5dudk3gr40r9	2025-12-25 12:12:02.188	2025-12-25 12:12:02.188
cmjlekh9o001nomudas8p4r36	KAMIS	07:00	07:38	cmj5eca050002jsudq5rc3oa3	cmj9z7q7y001c5dudu38a65qb	cmj9z8yj000305dudtwddc0j1	2025-12-25 12:12:14.315	2025-12-25 12:12:14.315
cmjlekju0001oomudvzyk6s9c	KAMIS	07:38	08:16	cmj5eca050002jsudq5rc3oa3	cmj9z7q7y001c5dudu38a65qb	cmj9z8yj000305dudtwddc0j1	2025-12-25 12:12:17.64	2025-12-25 12:12:17.64
cmjlekqx5001pomudxulo3g24	KAMIS	08:16	08:54	cmj5eca050002jsudq5rc3oa3	cmj9z7q9c001p5dudhh2cp17a	cmj9z8y1b002c5dudh3e7fyuu	2025-12-25 12:12:26.824	2025-12-25 12:12:26.824
cmjleku6d001qomudtje339t7	KAMIS	08:54	09:32	cmj5eca050002jsudq5rc3oa3	cmj9z7q9c001p5dudhh2cp17a	cmj9z8y1b002c5dudh3e7fyuu	2025-12-25 12:12:31.045	2025-12-25 12:12:31.045
cmjlel3p4001romud4id24np0	KAMIS	10:10	10:45	cmj5eca050002jsudq5rc3oa3	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	2025-12-25 12:12:43.383	2025-12-25 12:12:43.383
cmjlel8c1001somudsph4yc9n	KAMIS	10:45	11:20	cmj5eca050002jsudq5rc3oa3	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	2025-12-25 12:12:49.393	2025-12-25 12:12:49.393
cmjlelfz1001tomud1t7qzjjy	KAMIS	07:00	07:38	cmj5eca0o0005jsud0ambwla7	cmj9z7q9n001s5dudxr525koc	cmj9z8yem002u5dudolwskcz4	2025-12-25 12:12:59.292	2025-12-25 12:12:59.292
cmjlelqt3001uomudtj9mytak	KAMIS	07:38	08:16	cmj5eca0o0005jsud0ambwla7	cmj9z7q9n001s5dudxr525koc	cmj9z8yem002u5dudolwskcz4	2025-12-25 12:13:13.334	2025-12-25 12:13:13.334
cmjlelz1f001vomud8b0coee1	KAMIS	08:16	08:54	cmj5eca0o0005jsud0ambwla7	cmj9z7q9n001s5dudxr525koc	cmj9z8yem002u5dudolwskcz4	2025-12-25 12:13:24.003	2025-12-25 12:13:24.003
cmjlem28r001womudn0jvar29	KAMIS	08:54	09:32	cmj5eca0o0005jsud0ambwla7	cmj9z7q9n001s5dudxr525koc	cmj9z8yem002u5dudolwskcz4	2025-12-25 12:13:28.154	2025-12-25 12:13:28.154
cmjlemaye001xomudfgg7jmyk	KAMIS	10:10	10:45	cmj5eca0o0005jsud0ambwla7	cmj9z7q8q001j5dudx5o1zuri	cmj9z8xvg00245duda7dxbp56	2025-12-25 12:13:39.445	2025-12-25 12:13:39.445
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
cmj5ec9zf0000jsudgpxci2hf	X Akuntansi	X	30	2025-12-14 07:21:32.811	2025-12-14 07:21:32.811	\N	\N	cmj5cz42g00034iudqf3vd4tn
cmj5ec9zx0001jsud5cnf1k74	XI Akuntansi	XI	30	2025-12-14 07:21:32.829	2025-12-14 07:21:32.829	\N	\N	cmj5cz42g00034iudqf3vd4tn
cmj5eca050002jsudq5rc3oa3	XII Akuntansi	XII	30	2025-12-14 07:21:32.837	2025-12-14 07:21:32.837	\N	\N	cmj5cz42g00034iudqf3vd4tn
cmj5eca0e0003jsud1uxj50o4	X Teknik Komputer dan Jaringan	X	30	2025-12-14 07:21:32.846	2025-12-14 07:21:32.846	\N	\N	cmj5czfhl00044iudsyvwnrok
cmj5eca0k0004jsuddjewnal1	XI Teknik Komputer dan Jaringan	XI	30	2025-12-14 07:21:32.852	2025-12-14 07:21:32.852	\N	\N	cmj5czfhl00044iudsyvwnrok
cmj5eca0o0005jsud0ambwla7	XII Teknik Komputer dan Jaringan	XII	30	2025-12-14 07:21:32.856	2025-12-14 07:21:32.856	\N	\N	cmj5czfhl00044iudsyvwnrok
cmj5eca0w0006jsud9bca11b3	X Teknik Kendaraan Ringan	X	30	2025-12-14 07:21:32.864	2025-12-14 07:21:32.864	\N	\N	cmj5czn6h00054iuds6wh2zr0
cmj5eca130007jsudvzwt5rjx	XI Teknik Kendaraan Ringan	XI	30	2025-12-14 07:21:32.871	2025-12-14 07:21:32.871	\N	\N	cmj5czn6h00054iuds6wh2zr0
cmj5eca170008jsudb4r1h58n	XII Teknik Kendaraan Ringan	XII	30	2025-12-14 07:21:32.875	2025-12-14 07:21:32.875	\N	\N	cmj5czn6h00054iuds6wh2zr0
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
cmjfuw7ew0000ysudu7n9x6xw	aaaaaa	aaaaaa	DOKUMEN	file://1766329358202-32b94ae3450dea8b583bf1f464d0390b.html	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	cmj5ec9zf0000jsudgpxci2hf	f	t	0	2025-12-21 15:02:38.214	2025-12-22 09:42:04.937	2025-12-22 09:42:04.932
cmjftvqn90001smud4jqjksz2	tik	tik	TEKS	sdsadasdas das da da da da da das asas d a	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	cmj5ec9zf0000jsudgpxci2hf	f	t	0	2025-12-21 14:34:16.868	2025-12-22 09:42:07.978	2025-12-22 09:42:07.977
cmjftfdir0000smudc2j2nr57	ASAS	aSAS	DOKUMEN	\N	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	cmj5ec9zf0000jsudgpxci2hf	f	t	0	2025-12-21 14:21:33.361	2025-12-22 09:51:50.737	2025-12-22 09:51:50.732
cmjh2hfwj00006nudambm0s7b	INFORMATIKA	Informatika	DOKUMEN	file://1766402572470-b247b71dcd534a9ee1071c6382b35dcc4.html	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	cmj5ec9zf0000jsudgpxci2hf	f	t	0	2025-12-22 11:22:52.481	2025-12-22 11:22:52.481	\N
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
cmjoh9fe90000y9udf40jkhuc	cmjh2hfwj00006nudambm0s7b	cmj5gx2zz005n35udbo6v7qv9	2025-12-27 15:50:56.049
\.


--
-- Data for Name: Notifikasi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notifikasi" (id, "userId", tipe, judul, pesan, "linkUrl", "isRead", "readAt", metadata, "createdAt") FROM stdin;
cmjh9si5z0001rvud4s6mycgj	cmj5gwzqp001b35udoas61cxe	TUGAS_BARU	Tugas Baru: Konsentrasi Keahlian AK	Ila Febti Sherly M., S.E memberi tugas baru dengan deadline 26/12/2025	/tugas	f	\N	{"tugasId": "cmjh9si5a0000rvud0p28ibep"}	2025-12-22 14:47:25.943
cmjh9si640002rvudgmtam2b6	cmj5gx2c1004r35udtqywx9eq	TUGAS_BARU	Tugas Baru: Konsentrasi Keahlian AK	Ila Febti Sherly M., S.E memberi tugas baru dengan deadline 26/12/2025	/tugas	f	\N	{"tugasId": "cmjh9si5a0000rvud0p28ibep"}	2025-12-22 14:47:25.948
cmjibd3we0001s0udetqjnsyh	cmj5gx04g001t35udknq3yqoe	TUGAS_DINILAI	Tugas Telah Dinilai	Tugas "TIK" telah dinilai. Nilai Anda: 80/100	/tugas	t	2025-12-23 08:24:14.915	{"score": 80, "tugasId": "cmjia6tbi00002fudovdit4lo"}	2025-12-23 08:19:13.022
cmjkuv8ho001rd3udne3hg9jp	cmj5gx0jj002d35udjlza7xue	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.836
cmjkuv8hr001sd3udp5etfw6f	cmj5gx0l0002f35ud6j2sufzk	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.839
cmjkuv8hu001td3udk3fhwhkc	cmj5gx0ml002h35udvjc8yzeb	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.842
cmjkuv8hx001ud3ud3qwmhr6k	cmj5gx0o3002j35uda0ok0i4j	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.845
cmjkuv8i0001vd3ud7ed7jro7	cmj5gx0pm002l35udhnyriry6	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.848
cmjkuv8i3001wd3udcyjn1vc4	cmj5gx0r4002n35ud6i7qxccl	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.851
cmjkuv8i6001xd3ud8urehz5n	cmj5gx0sm002p35udzxd3mus1	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.854
cmjkuv8ia001yd3udto1583g0	cmj5gx0u3002r35udqkenscl3	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.858
cmjkuv8ic001zd3udn8s83bfs	cmj5gx0vl002t35udzzptrcos	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.86
cmjkuv8if0020d3udx2cvldpe	cmj5gx0x4002v35udz7qohe6d	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.863
cmjkuv8ii0021d3udddzyo4g9	cmj5gx0ym002x35udzhcjnau4	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.866
cmjkuv8ik0022d3udzkknpvu9	cmj5gx103002z35udn2m30zv3	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.868
cmjkuv8in0023d3udt7wz1d3z	cmj5gx11k003135ud73cds1fi	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.871
cmjkuv8iq0024d3ud62p1bk7c	cmj5gx131003335ud6cxmwwir	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.874
cmjkuv8it0025d3udsmz30mni	cmj5gx14k003535udo7rhjcnp	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.877
cmjkuv8iw0026d3udb0oo7rln	cmj5gx162003735ud5de1cxbc	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.88
cmjkuv8iy0027d3udwf4gzroi	cmj5gx17k003935udaewx76ro	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.882
cmji9fekg0001awudzj069fd5	cmj5gwzqp001b35udoas61cxe	TUGAS_BARU	Tugas Baru: Informatika	Zulfi Amaliyah, S.Kom memberi tugas baru dengan deadline 26/12/2025	/tugas	f	\N	{"tugasId": "cmji9fejl0000awudarrb4ypf"}	2025-12-23 07:25:00.928
cmji9feko0002awud4dyn0dgo	cmj5gx2c1004r35udtqywx9eq	TUGAS_BARU	Tugas Baru: Informatika	Zulfi Amaliyah, S.Kom memberi tugas baru dengan deadline 26/12/2025	/tugas	f	\N	{"tugasId": "cmji9fejl0000awudarrb4ypf"}	2025-12-23 07:25:00.936
cmjkuv8c20001d3ud3gxqhgk9	cmj9z8ynh00365dudxaiuoy08	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.634
cmjkuv8c80002d3udsx17pfai	cmj9z8yox00385dudt5p2uvo1	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.64
cmjkuv8cd0003d3ud1ijw7i3f	cmj9z8yly00345dudadjrqvfh	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.645
cmjkuv8cg0004d3udrt95dpr1	cmj9z8ybn002q5dud7n4058u9	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.648
cmjkuv8ck0005d3udoq6kz0z1	cmj9z8y4a002g5dudjlq4s2jp	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.652
cmjkuv8co0006d3udsntnu00a	cmj9z8yg3002w5dud29sel0av	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.656
cmjkuv8cr0007d3udf75cbmtw	cmj9z8y77002k5dudwjch4365	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.659
cmjkuv8cu0008d3udkgf4a49f	cmj9z8yem002u5dudolwskcz4	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.662
cmjkuv8cx0009d3ud8s9sexf5	cmj9z8xtu00225dudew59ixr7	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.665
cmjkuv8d1000ad3udgsz2358g	cmj9z8yj000305dudtwddc0j1	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.669
cmjkuv8d4000bd3ud8wxncx4y	cmj9z8y5q002i5dudk3gr40r9	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.672
cmjkuv8d8000cd3ud58sack04	cmj9z8xvg00245duda7dxbp56	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.676
cmjkuv8db000dd3uddmt9tf40	cmj9z8ya7002o5dudm0yzma1k	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.679
cmjkuv8df000ed3udiw1b7vl6	cmj9z8yd4002s5dudqb9lav2o	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.683
cmjkuv8di000fd3udgsbc8oav	cmj9z8y2q002e5dud69l0gx00	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.686
cmjkuv8dl000gd3ud3m9ak9qw	cmj9z8y8o002m5dudwnycw1jf	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.689
cmjkuv8dn000hd3udvzy5kku8	cmj9z8yhl002y5dudqly12oc3	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.691
cmjkuv8dq000id3udq0uhh9i3	cmj9z8xyc00285dudgvf5bnnv	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.694
cmjkuv8dt000jd3udppoiu6ra	cmj9z8xzs002a5dudw0c717l2	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.697
cmjkuv8dx000kd3ud4okc8zcq	cmj9z8xwv00265dud0w98oh1m	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.701
cmjia812x00042fudur6h3kyf	cmj9z8yly00345dudadjrqvfh	TUGAS_DINILAI	Pengumpulan Tugas Baru	DESY MUSTIKA MAYA SARI telah mengumpulkan tugas "TIK"	/tugas-management	t	2025-12-23 08:01:08.467	{"tugasId": "cmjia6tbi00002fudovdit4lo"}	2025-12-23 07:47:16.473
cmjia10nj0001ifud3aidxd00	cmj9z8yly00345dudadjrqvfh	TUGAS_DINILAI	Pengumpulan Tugas Baru	DESY MUSTIKA MAYA SARI telah mengumpulkan tugas "asd"	/tugas-management	t	2025-12-23 11:43:31.644	{"tugasId": "cmji9m8160000qyudmt14e3z3"}	2025-12-23 07:41:49.327
cmjkuv8dz000ld3uddhf6bhsh	cmj9z8ykj00325dudk20mdgjx	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.703
cmjkuv8e2000md3udi3cku44w	cmj9z8y1b002c5dudh3e7fyuu	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.706
cmjkuv8e5000nd3udyqvp03e0	cmj5gwyqw000135udakhyrrna	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.709
cmjkuv8e8000od3udjf6dbcd8	cmj5gwysk000335ud06zbjkum	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.711
cmjkuv8eb000pd3ud4dq47ncz	cmj5gwyu3000535udp8xm32kg	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.714
cmjkuv8ee000qd3udpvnrb0tq	cmj5gwyvo000735udytelfevq	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.718
cmjkuv8eh000rd3ud42woej3j	cmj5gwyx9000935ud28f9ggyr	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.721
cmjkuv8ek000sd3udx4foxs25	cmj5gwz0g000d35ud5n8q889d	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.724
cmjkuv8en000td3udgmnqt463	cmj5gwz23000f35udoygf650d	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.727
cmjkuv8ep000ud3ud1wmj9cgu	cmj5gwz3n000h35udillr14ag	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.729
cmjkuv8eu000vd3ude6p1ihlf	cmj5gwz6t000l35ud8wsvgkyz	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.733
cmjkuv8ex000wd3udyjc8fwjj	cmj5gwz8c000n35ud8pxa34ep	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.737
cmjkuv8ez000xd3ud9n0wp8gf	cmj5gwz9u000p35uddazsd00z	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.739
cmjkuv8f3000yd3udyrc3dyuf	cmj5gwzeh000v35udwd1xnzk8	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.743
cmjkuv8f6000zd3udvnwp8v94	cmj5gwzg0000x35udzy1o8cpn	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.746
cmjkuv8f90010d3udegg81ceh	cmj5gwzhi000z35udkij11ubh	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.749
cmjkuv8fc0011d3ud32wzx61p	cmj5gwzj2001135udp7u21il5	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.752
cmjkuv8ff0012d3udxiyhriu8	cmj5gwzkk001335uddaybproj	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.755
cmjkuv8fj0013d3ud9th3p0z6	cmj5gwzm3001535ud35s55raa	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.759
cmjkuv8fm0014d3ud1kfyuyjr	cmj5gwznm001735udpzuadsi6	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.762
cmjkuv8fq0015d3ud4vmgkzmv	cmj5gwzp6001935udi39qku1d	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.766
cmjkuv8fs0016d3ud72pfsqbu	cmj5gwzqp001b35udoas61cxe	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.768
cmjkuv8fv0017d3uda9tg3rzi	cmj5gwzs8001d35ud78grtko5	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.771
cmjibcz5v0000s0uda6f50mkj	cmj5gx04g001t35udknq3yqoe	TUGAS_DINILAI	Tugas Telah Dinilai	Tugas "TIK" telah dinilai. Nilai Anda: 80/100	/tugas	t	2025-12-23 08:24:12.849	{"score": 80, "tugasId": "cmjia6tbi00002fudovdit4lo"}	2025-12-23 08:19:06.883
cmjkuv8fy0018d3ud2pv2im9r	cmj5gwztr001f35udgp2iqne6	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.774
cmjkuv8g20019d3ud254f7ztu	cmj5gwzv9001h35udc6lry71w	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.778
cmjkuv8g5001ad3udq38zwln1	cmj5gwzws001j35ud376v2a11	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.781
cmjkuv8g8001bd3uddsqqnbja	cmj5gwzzu001n35udi1ekaazg	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.784
cmjkuv8gb001cd3udg64gsxxz	cmj5gx01e001p35udcjqmly7n	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.787
cmjkuv8gf001dd3udr5z2ru84	cmj5gwzbe000r35ud3dm0w5mp	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.791
cmjkuv8gj001ed3ud21r3u07y	cmj5gwz58000j35ud2jgpgotd	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.795
cmjkuv8gm001fd3ud73gh78dw	cmj5gwyyw000b35udpo5b2m4t	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.798
cmjkuv8gp001gd3ud2wpxx9he	cmj5gwzcy000t35ud1wibxk47	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.801
cmjkuv8gt001hd3udp9f6w65t	cmj5gx02w001r35ud6qdfidog	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.805
cmjkuv8gw001id3udwvtlq2kt	cmj5gx05x001v35udwd5nk8nj	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.808
cmjkuv8h0001jd3udealsxoh0	cmj5gx07f001x35udj3ispkx8	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.812
cmjkuv8h4001kd3udg3omvhy2	cmj5gx08y001z35udsqo698l8	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.816
cmjkuv8h7001ld3udq08s7zlb	cmj5gx0ag002135ud9fhzdekh	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.819
cmjkuv8h9001md3udhxd0rmsb	cmj5gx0c0002335udrmwctcnm	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.821
cmjkuv8hd001nd3udv70q4zyt	cmj5gx0di002535ud32uasdbw	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.825
cmjkuv8hg001od3udumnngb4v	cmj5gx0ez002735ud6aegx8z1	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.828
cmjkuv8hi001pd3ud9djv06wq	cmj5gx0gi002935udl20nfbog	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.83
cmjkuv8hl001qd3udngnugpta	cmj5gx0i0002b35ud19a6xd7r	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.833
cmjkuv8j20028d3udsg59b4n7	cmj5gx193003b35udn6l73ohj	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.886
cmjkuv8j60029d3udmrysp0zi	cmj5gx1c3003f35udp6zso1o3	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.889
cmjkuv8j8002ad3udsdapt9q9	cmj5gx1dj003h35udb14ouf8y	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.892
cmjkuv8jc002bd3udwgmepfdb	cmj5gx1f1003j35udutcxv8c7	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.896
cmjkuv8jf002cd3udz4mzoqlh	cmj5gx1gj003l35udh98cts8w	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.899
cmjkuv8ji002dd3udizqphul3	cmj5gx1ji003p35udxuz53ke6	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.902
cmjkuv8jm002ed3ud0xap9o5b	cmj5gx1l1003r35udz4zykbfo	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.906
cmjkuv8jq002fd3udituof6hp	cmj5gx1mi003t35udec1w0c85	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.91
cmjkuv8js002gd3udz4d5roxu	cmj5gx1o2003v35udzn7dj9ls	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.912
cmjkuv8jv002hd3udlzrhsjje	cmj5gx1pk003x35udstmkp6g7	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.915
cmjkuv8jy002id3udt89jpl2k	cmj5gx1u3004335udkj267fhr	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.918
cmjkuv8k3002jd3udabbujs4a	cmj5gx1vm004535udc4l2kzg5	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.923
cmjkuv8k6002kd3ud8vr9qsgn	cmj5gx1x5004735udoeer6a1p	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.926
cmjkuv8k9002ld3udreccocak	cmj5gx206004b35uduf215trn	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.929
cmjkuv8ke002md3udapjn3pcd	cmj5gx21o004d35udxjptvn08	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.934
cmjkuv8kh002nd3udathxu4wr	cmj5gx234004f35udt3s4ka40	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.937
cmjkuv8kk002od3udk1odbx06	cmj5gx24m004h35udvyljawbl	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.94
cmjkuv8km002pd3ud2n3tc1p3	cmj5gx264004j35ud8hnkcdnj	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.942
cmjkuv8kq002qd3udgb5w6qxu	cmj5gx27k004l35udp3ylddi4	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.946
cmjkuv8kt002rd3ud5oncctr6	cmj5gx2ak004p35udjg0jhfie	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.949
cmjkuv8kw002sd3uduys9oflb	cmj5gx2c1004r35udtqywx9eq	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.952
cmjkuv8l0002td3ud76x0ntpw	cmj5gx2dj004t35udiz37sd6e	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.956
cmjkuv8l2002ud3udj1mitgv4	cmj5gx2gi004x35ud0wei40by	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.958
cmjkuv8l6002vd3udgdv1lasj	cmj5gx2i0004z35udecgz1nlq	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.962
cmjkuv8l9002wd3udxt23q7gf	cmj5gx2jh005135udtbcxbtb9	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.965
cmjkuv8ld002xd3ude015cgjt	cmj5gx2kx005335udc4757qsp	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.969
cmjkuv8lf002yd3udv3opklbm	cmj5gx2mh005535ud6oic8o1p	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.971
cmjkuv8lj002zd3ud065rau4q	cmj5gx1yo004935ud3pslwtt1	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.974
cmjkuv8ll0030d3uduuwjrivc	cmj5gx1i0003n35udv6gnc1l1	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.977
cmjkuv8lp0031d3udcl79exen	cmj5gx1sk004135udexpydl8s	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.981
cmjkuv8ls0032d3udcqcuq76z	cmj5gx1r2003z35udbet34tx1	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.984
cmjkuv8lv0033d3udwyghtojo	cmj5gx292004n35ud17iskv1j	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.987
cmjkuv8ly0034d3ud926oa7gb	cmj5gx2ny005735udgqgfno56	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.99
cmjkuv8m10035d3ud589wxc5m	cmj5gx2qz005b35ud4370ott0	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.993
cmjkuv8m40036d3udobrhtnn7	cmj5gx2sg005d35udvqbnlkoz	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.996
cmjkuv8m70037d3udtpmi661w	cmj5gx2u0005f35udktuxz1uv	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:43.999
cmjkuv8m90038d3udwpi6x7ld	cmj5gx2vh005h35udn702xrb0	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:44.001
cmjkuv8mi003bd3uda3oimeol	cmj5gx2ph005935udv1g8ipeb	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:44.01
cmjkuv8mm003cd3udjjn9mrjk	cmj5gx2f2004v35udq20lwbo0	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:44.014
cmjkuv8mp003dd3udt6vi4yed	cmj5gx1al003d35udbg9vhv2a	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:44.016
cmjkuv8ms003ed3udyvxxl23d	cmj5gwzyc001l35udnzueuy9e	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:44.019
cmjkuv8mu003fd3ud0rh13wxu	cmj5gx31i005p35ud17ebh91g	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:44.022
cmjkuv8my003gd3udpz22s8zj	cmj5gx2wz005j35ud2ivwa2j0	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	f	\N	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:44.026
cmjkuv8n1003hd3udahqxrivx	cmj5gx04g001t35udknq3yqoe	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	t	2025-12-25 03:00:51.01	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:44.029
cmjkuv8mg003ad3udc8lwvdx7	cmj5gx2yi005l35udcr748bi3	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	t	2025-12-27 15:41:56.613	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:44.008
cmjkuv8md0039d3udodm2ypcn	cmj5gx2zz005n35udbo6v7qv9	SISTEM	Pengumuman: tes	Rizky membuat pengumuman baru. tesss	/pengumuman	t	2025-12-27 15:49:59.784	{"pengumumanId": "cmjkuv8bs0000d3udll1spmx9"}	2025-12-25 03:00:44.005
cmji9fekt0003awudjnjcgo5y	cmj5gx2zz005n35udbo6v7qv9	TUGAS_BARU	Tugas Baru: Informatika	Zulfi Amaliyah, S.Kom memberi tugas baru dengan deadline 26/12/2025	/tugas	t	2025-12-27 15:50:01.544	{"tugasId": "cmji9fejl0000awudarrb4ypf"}	2025-12-23 07:25:00.941
cmjh9si690003rvud1niaqp1r	cmj5gx2zz005n35udbo6v7qv9	TUGAS_BARU	Tugas Baru: Konsentrasi Keahlian AK	Ila Febti Sherly M., S.E memberi tugas baru dengan deadline 26/12/2025	/tugas	t	2025-12-27 15:50:03.557	{"tugasId": "cmjh9si5a0000rvud0p28ibep"}	2025-12-22 14:47:25.953
\.


--
-- Data for Name: PaketSoal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaketSoal" (id, kode, nama, deskripsi, "mataPelajaranId", "totalSoal", "createdAt", "updatedAt", "deletedAt", "guruId") FROM stdin;
cmjic35lb000081ud6uexgy91	PKT-00001	TIK	\N	cmj9z7q8c001f5dudtoyt49tx	25	2025-12-23 08:39:28.269	2025-12-23 10:15:18.906	\N	cmj9z8yly00345dudadjrqvfh
cmjofnphj002u05ud1j5k63fs	PKT-00003	tik2	\N	cmj9z7q8c001f5dudtoyt49tx	25	2025-12-27 15:06:03.078	2025-12-27 15:17:11.998	\N	cmj9z8yly00345dudadjrqvfh
cmjofmbu1000105udmay4slaj	PKT-00002	bing	\N	cmj9z7q8k001h5dudkou2wtsf	50	2025-12-27 15:04:58.728	2025-12-27 15:17:53.999	\N	cmj9z8xtu00225dudew59ixr7
\.


--
-- Data for Name: PaketSoalItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaketSoalItem" (id, "paketSoalId", "bankSoalId", urutan, "createdAt") FROM stdin;
cmjog21lp000p92udh2jio90l	cmjofnphj002u05ud1j5k63fs	cmjog21gt000092udtimjt1iu	1	2025-12-27 15:17:11.949
cmjog21lx000r92udpst0hexg	cmjofnphj002u05ud1j5k63fs	cmjog21im000a92udt4m2smm4	11	2025-12-27 15:17:11.955
cmjog21m3001292udxv225i4j	cmjofnphj002u05ud1j5k63fs	cmjog21j4000d92ud9blxi1qy	14	2025-12-27 15:17:11.957
cmjog21m9001592udnscd0v2t	cmjofnphj002u05ud1j5k63fs	cmjog21jk000g92udjtu1jfuw	17	2025-12-27 15:17:11.958
cmjog21lp000q92udouvmze6w	cmjofnphj002u05ud1j5k63fs	cmjog21h2000192ud0pawgtf5	2	2025-12-27 15:17:11.95
cmjog21lx000s92udllqydpru	cmjofnphj002u05ud1j5k63fs	cmjog21is000b92ud3kztongm	12	2025-12-27 15:17:11.955
cmjog21m2001192ud6qmkrzni	cmjofnphj002u05ud1j5k63fs	cmjog21ix000c92ude57fbqco	13	2025-12-27 15:17:11.956
cmjog21m9001492ud4cyfaytc	cmjofnphj002u05ud1j5k63fs	cmjog21jf000f92ud54trbv0w	16	2025-12-27 15:17:11.958
cmjog21mg001d92udljp8k3ss	cmjofnphj002u05ud1j5k63fs	cmjog21kv000o92udqs1stsbo	25	2025-12-27 15:17:11.963
cmjog21ly000t92udlnrnlocc	cmjofnphj002u05ud1j5k63fs	cmjog21hl000492udetxievs8	5	2025-12-27 15:17:11.952
cmjog21lz000u92udfy84ccli	cmjofnphj002u05ud1j5k63fs	cmjog21hr000592udbp4pfprc	6	2025-12-27 15:17:11.952
cmjog21lz000v92udq53gnzx6	cmjofnphj002u05ud1j5k63fs	cmjog21ia000892udu4pb93uh	9	2025-12-27 15:17:11.954
cmjog21lz000w92udpuxr5pqx	cmjofnphj002u05ud1j5k63fs	cmjog21hf000392udc768sg89	4	2025-12-27 15:17:11.951
cmjog21lz000x92udhy8z6fn7	cmjofnphj002u05ud1j5k63fs	cmjog21h8000292uddw0wgr6y	3	2025-12-27 15:17:11.95
cmjog21m0000y92udber2199d	cmjofnphj002u05ud1j5k63fs	cmjog21hy000692udnzfyydp3	7	2025-12-27 15:17:11.953
cmjog21m0000z92udcjo5mekb	cmjofnphj002u05ud1j5k63fs	cmjog21i3000792udfhrs4t5a	8	2025-12-27 15:17:11.953
cmjog21m0001092udm7d2tn3i	cmjofnphj002u05ud1j5k63fs	cmjog21ig000992udin59wac4	10	2025-12-27 15:17:11.954
cmjog21m8001392udb1t64cm7	cmjofnphj002u05ud1j5k63fs	cmjog21j9000e92udpmhbptak	15	2025-12-27 15:17:11.957
cmjog21ma001692udflr9rtvz	cmjofnphj002u05ud1j5k63fs	cmjog21jr000h92udkctmfgd3	18	2025-12-27 15:17:11.959
cmjog21ma001792ud51muwsvp	cmjofnphj002u05ud1j5k63fs	cmjog21jx000i92ud1ydtz0gx	19	2025-12-27 15:17:11.959
cmjog21mb001892udjn2vx8e1	cmjofnphj002u05ud1j5k63fs	cmjog21k1000j92ud2yblqwc5	20	2025-12-27 15:17:11.96
cmjog21mb001992udz5mbjcso	cmjofnphj002u05ud1j5k63fs	cmjog21k8000k92udt2nikijc	21	2025-12-27 15:17:11.96
cmjog21mb001a92udrpz9l5lz	cmjofnphj002u05ud1j5k63fs	cmjog21kd000l92udre3oi4b7	22	2025-12-27 15:17:11.961
cmjog21mc001b92ud4sp51v98	cmjofnphj002u05ud1j5k63fs	cmjog21kk000m92udk1cxlaqt	23	2025-12-27 15:17:11.962
cmjog21me001c92udpm0ibue6	cmjofnphj002u05ud1j5k63fs	cmjog21kq000n92udr2y8mwc4	24	2025-12-27 15:17:11.962
cmjog2y00002s92ud2migsyj5	cmjofmbu1000105udmay4slaj	cmjog2xqh001e92ud2gz4da9p	1	2025-12-27 15:17:53.925
cmjog2y00002t92uds3xj6fen	cmjofmbu1000105udmay4slaj	cmjog2xqt001f92ud101dbylq	2	2025-12-27 15:17:53.925
cmjog2y04002u92udt1mwnakc	cmjofmbu1000105udmay4slaj	cmjog2xsd001o92udqqf5hupp	11	2025-12-27 15:17:53.93
cmjog2y06002v92ude51k6zpy	cmjofmbu1000105udmay4slaj	cmjog2xsk001p92udqh1rethg	12	2025-12-27 15:17:53.931
cmjog2y0b003192udp1bmlb4e	cmjofmbu1000105udmay4slaj	cmjog2xso001q92ud6ss0ho8u	13	2025-12-27 15:17:53.931
cmjog2y0a002w92udf0rqxmov	cmjofmbu1000105udmay4slaj	cmjog2xr6001h92udv23xq1zy	4	2025-12-27 15:17:53.926
cmjog2y0a002x92ud2d1jd6zp	cmjofmbu1000105udmay4slaj	cmjog2xrb001i92ud8ablag3s	5	2025-12-27 15:17:53.927
cmjog2y0a002y92udlglr62ym	cmjofmbu1000105udmay4slaj	cmjog2xrq001k92udf6kjmq5n	7	2025-12-27 15:17:53.927
cmjog2y0a002z92ud9kezvn84	cmjofmbu1000105udmay4slaj	cmjog2xru001l92ud473xhqnb	8	2025-12-27 15:17:53.928
cmjog2y0a003092uds4lq4gls	cmjofmbu1000105udmay4slaj	cmjog2xqz001g92ud7vup30vy	3	2025-12-27 15:17:53.926
cmjog2y0b003392ud7ziumer2	cmjofmbu1000105udmay4slaj	cmjog2xs2001m92ud428j4fcj	9	2025-12-27 15:17:53.928
cmjog2y0b003292ud1q1zg1vw	cmjofmbu1000105udmay4slaj	cmjog2xs8001n92udi1f0iac3	10	2025-12-27 15:17:53.929
cmjog2y0c003592ud2emkfkmb	cmjofmbu1000105udmay4slaj	cmjog2xsv001r92uduzcd846e	14	2025-12-27 15:17:53.932
cmjog2y0b003492ud332j3a1r	cmjofmbu1000105udmay4slaj	cmjog2xrj001j92udlq5m1zs9	6	2025-12-27 15:17:53.927
cmjog2y0f003692udnpnjdg9z	cmjofmbu1000105udmay4slaj	cmjog2xt1001s92udzrrqmbmb	15	2025-12-27 15:17:53.932
cmjog2y0i003792udmfepxc1n	cmjofmbu1000105udmay4slaj	cmjog2xt6001t92udtvjwyyfx	16	2025-12-27 15:17:53.933
cmjog2y0k003892udggiehio5	cmjofmbu1000105udmay4slaj	cmjog2xtd001u92udsxrx3uc6	17	2025-12-27 15:17:53.933
cmjog2y0l003992udyxg33ddj	cmjofmbu1000105udmay4slaj	cmjog2xtk001v92ud6k7ylfra	18	2025-12-27 15:17:53.934
cmjog2y0m003a92udqnxibxcn	cmjofmbu1000105udmay4slaj	cmjog2xts001w92ud3muak83d	19	2025-12-27 15:17:53.934
cmjog2y0m003b92udiz9dj6w3	cmjofmbu1000105udmay4slaj	cmjog2xtz001x92udzgcv87ys	20	2025-12-27 15:17:53.935
cmjog2y0m003c92udk4gy8ef2	cmjofmbu1000105udmay4slaj	cmjog2xu6001y92udhaqzj7e4	21	2025-12-27 15:17:53.935
cmjog2y0m003d92ud14bqqlan	cmjofmbu1000105udmay4slaj	cmjog2xub001z92udg0uu2r2v	22	2025-12-27 15:17:53.936
cmjog2y0n003e92udkfkehkdb	cmjofmbu1000105udmay4slaj	cmjog2xui002092udi1ftqufd	23	2025-12-27 15:17:53.936
cmjog2y0n003f92ud6f2te5wz	cmjofmbu1000105udmay4slaj	cmjog2xun002192udnev0pifm	24	2025-12-27 15:17:53.937
cmjog2y0o003g92ud9762lsrt	cmjofmbu1000105udmay4slaj	cmjog2xut002292udxejgv62k	25	2025-12-27 15:17:53.937
cmjog2y0p003h92udt8hqw16i	cmjofmbu1000105udmay4slaj	cmjog2xuz002392ud1e8cli9y	26	2025-12-27 15:17:53.937
cmjog2y0q003i92udkxb0c1ld	cmjofmbu1000105udmay4slaj	cmjog2xv5002492udsr5n8z5h	27	2025-12-27 15:17:53.938
cmjog2y0q003j92udae8vkw3x	cmjofmbu1000105udmay4slaj	cmjog2xvc002592udwi6m1bnk	28	2025-12-27 15:17:53.938
cmjog2y0s003k92udo4gq9x0j	cmjofmbu1000105udmay4slaj	cmjog2xvh002692udjtnws2kh	29	2025-12-27 15:17:53.939
cmjog2y0s003l92udzvnwekay	cmjofmbu1000105udmay4slaj	cmjog2xvo002792udr9fc8qzs	30	2025-12-27 15:17:53.939
cmjog2y0t003m92ud4j9kk6ib	cmjofmbu1000105udmay4slaj	cmjog2xvu002892udgcsbq6hg	31	2025-12-27 15:17:53.94
cmjog2y0t003n92ud8hw91n2p	cmjofmbu1000105udmay4slaj	cmjog2xvz002992udlkdj810r	32	2025-12-27 15:17:53.941
cmjog2y0u003o92ud47rbhpne	cmjofmbu1000105udmay4slaj	cmjog2xw6002a92udgparw4k3	33	2025-12-27 15:17:53.941
cmjog2y0v003p92ud43dpv3lk	cmjofmbu1000105udmay4slaj	cmjog2xwi002c92udizouby9g	35	2025-12-27 15:17:53.942
cmjog2y0v003q92udep6y3zkr	cmjofmbu1000105udmay4slaj	cmjog2xwc002b92udlk1pqxvu	34	2025-12-27 15:17:53.941
cmjog2y0w003r92ud0p9zoh90	cmjofmbu1000105udmay4slaj	cmjog2xwp002d92ud0j86c559	36	2025-12-27 15:17:53.942
cmjog2y0x003s92udamqht57f	cmjofmbu1000105udmay4slaj	cmjog2xwu002e92udje7ql3x2	37	2025-12-27 15:17:53.943
cmjog2y0y003t92ud5pwfw4s0	cmjofmbu1000105udmay4slaj	cmjog2xwz002f92ud90pv1oiq	38	2025-12-27 15:17:53.943
cmjog2y0y003u92udivqaonmd	cmjofmbu1000105udmay4slaj	cmjog2xx4002g92udpprth6by	39	2025-12-27 15:17:53.944
cmjog2y0z003v92udsyzx6cx5	cmjofmbu1000105udmay4slaj	cmjog2xxm002j92udcctdgs99	42	2025-12-27 15:17:53.945
cmjog2y0z003w92udrdhfmkby	cmjofmbu1000105udmay4slaj	cmjog2xxb002h92udioqb37fp	40	2025-12-27 15:17:53.944
cmjog2y0z003x92ud9uhz1agw	cmjofmbu1000105udmay4slaj	cmjog2xxf002i92udje23hc3x	41	2025-12-27 15:17:53.945
cmjog2y0z003y92udqd89qlsk	cmjofmbu1000105udmay4slaj	cmjog2xxs002k92ud2rjveizm	43	2025-12-27 15:17:53.946
cmjog2y10003z92udxgynpmzl	cmjofmbu1000105udmay4slaj	cmjog2xxx002l92udhtw9nbec	44	2025-12-27 15:17:53.946
cmjog2y12004092udxro14xy3	cmjofmbu1000105udmay4slaj	cmjog2xy3002m92udl2tf3c5c	45	2025-12-27 15:17:53.947
cmjog2y12004192udfkeo7mti	cmjofmbu1000105udmay4slaj	cmjog2xy8002n92udcin0uxlx	46	2025-12-27 15:17:53.947
cmjog2y13004292udbqh0f2h5	cmjofmbu1000105udmay4slaj	cmjog2xye002o92ud8ijbppyn	47	2025-12-27 15:17:53.948
cmjog2y14004392udy085kry5	cmjofmbu1000105udmay4slaj	cmjog2xyj002p92ud1wgmpm5z	48	2025-12-27 15:17:53.948
cmjog2y15004492udl00wi9hs	cmjofmbu1000105udmay4slaj	cmjog2xyp002q92udeuzoqrz9	49	2025-12-27 15:17:53.949
cmjog2y15004592ud6dqvke9r	cmjofmbu1000105udmay4slaj	cmjog2xyw002r92uds09rf6oc	50	2025-12-27 15:17:53.949
\.


--
-- Data for Name: Pengumuman; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Pengumuman" (id, judul, konten, "targetRoles", "authorId", "isActive", "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmjkun7gd00009euda6d69xmq	Tes 2	Tes 2Tes 2Tes 2Tes 2Tes 2 adhas dasjhd ajsdgh jasgdjas jasgd jasgd jasgdh gasgdhasd ajsd	{}	cmj5cw3cn00004iud971p5w0w	f	2025-12-25 02:54:29.245	2025-12-25 02:58:32.033	2025-12-25 02:58:32.033
cmjk5crza00006pudt1zutd11	Pengumuman Libur Sekolah	Yth. Bapak/Ibu Orang Tua/Wali Siswa serta Seluruh Siswa-siswi SMKS PGRI Banyuputih\n\nBerdasarkan Kalender Pendidikan Tahun Ajaran 2025/2026, bersama ini kami sampaikan informasi mengenai agenda libur sekolah sebagai berikut:\n\nMasa Libur: 22 Desember 2025 s/d 1 Januari 2026.\n\nMasuk Sekolah Kembali: Jumat, 2 Januari 2026.\n\nKegiatan: Belajar Mengajar (KBM) berjalan normal seperti biasa.\n\nKami mengimbau kepada Bapak/Ibu Wali Siswa agar tetap memantau kegiatan putra-putrinya selama liburan dan memastikan mereka kembali ke sekolah tepat waktu sesuai jadwal yang telah ditentukan.\n\nDemikian pengumuman ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.	{}	cmj5cw3cn00004iud971p5w0w	t	2025-12-24 15:06:32.23	2025-12-25 02:58:34.679	2025-12-25 02:58:34.679
cmjkuv8bs0000d3udll1spmx9	tes	tesss	{}	cmj5cw3cn00004iud971p5w0w	t	2025-12-25 03:00:43.622	2025-12-25 03:03:13.836	\N
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
cmjaxivkf0000u0udfciy166n	late_time_threshold	07:00	2025-12-18 04:17:24.303	2025-12-18 04:17:24.303
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
cmj5cxv7e00014iudyynxuvmc	2025/2026	2025-12-16 00:00:00	2026-02-19 00:00:00	AKTIF	2025-12-14 06:42:20.858	2025-12-17 07:23:20.52	\N
\.


--
-- Data for Name: Tugas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tugas" (id, judul, deskripsi, instruksi, "mataPelajaranId", "guruId", "kelasId", deadline, "maxScore", "tipePenilaian", "allowLateSubmit", "isPublished", "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmjh88n52000021udce7b91f8	asdasd	asdasd	asdasda	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	cmj5ec9zf0000jsudgpxci2hf	2025-12-25 14:03:00	100	MANUAL	f	t	2025-12-22 14:03:59.651	2025-12-22 14:04:48.566	2025-12-22 14:04:48.565
cmjh8a6ns000621udz9fucu3a	sdfdf	sfsf	dfsdf	cmj9z7qae00205dudqey9zf1h	cmj9z8y2q002e5dud69l0gx00	cmj5ec9zf0000jsudgpxci2hf	2025-12-26 14:05:00	100	MANUAL	f	t	2025-12-22 14:05:11.607	2025-12-22 14:07:54.24	2025-12-22 14:07:54.239
cmjh8nwy6000c21udaifw4sok	dasdasd	asdasd	asdasd	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	\N	2025-12-26 14:15:00	100	MANUAL	f	t	2025-12-22 14:15:52.205	2025-12-22 14:18:07.018	2025-12-22 14:18:07.014
cmjh8r6kj0000ipudzukknbpt	asd	asdas	das	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	cmj5ec9zf0000jsudgpxci2hf	2025-12-25 14:18:00	100	MANUAL	t	t	2025-12-22 14:18:24.642	2025-12-22 14:20:04.083	2025-12-22 14:20:04.077
cmjh8totv000068udkizshhjp	asdasd	asd	asdasd	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	cmj5ec9zf0000jsudgpxci2hf	2025-12-25 14:20:00	100	MANUAL	f	t	2025-12-22 14:20:21.617	2025-12-22 14:22:36.103	2025-12-22 14:22:36.099
cmjh8wyqo0000kbudfa3co2b4	sadas	dasdas	dasdasdas	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	cmj5ec9zf0000jsudgpxci2hf	2025-12-25 14:22:00	100	MANUAL	f	t	2025-12-22 14:22:54.431	2025-12-22 14:24:33.406	2025-12-22 14:24:33.401
cmjh8zjp70000itudpps4ygdv	dasdas	dasd	asdasd	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	cmj5ec9zf0000jsudgpxci2hf	2025-12-25 14:24:00	100	MANUAL	f	t	2025-12-22 14:24:54.906	2025-12-22 14:27:21.184	2025-12-22 14:27:21.184
cmjh95r3d00000oud9dflc4ek	asdas	dasdasd	asdasda	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	cmj5ec9zf0000jsudgpxci2hf	2025-12-24 14:29:00	100	MANUAL	f	t	2025-12-22 14:29:44.423	2025-12-22 14:34:29.989	2025-12-22 14:34:29.985
cmjh933f00006itudx55dsnz3	asdasd	asdasd	asdad	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	cmj5ec9zf0000jsudgpxci2hf	2025-12-25 14:27:00	100	MANUAL	f	t	2025-12-22 14:27:40.428	2025-12-22 14:34:32.064	2025-12-22 14:34:32.063
cmjh9cbiu000057udo994scza	asdasd	asdasd	dasdasd	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	cmj5ec9zf0000jsudgpxci2hf	2025-12-25 14:34:00	100	MANUAL	f	t	2025-12-22 14:34:50.837	2025-12-22 14:37:22.443	2025-12-22 14:37:22.439
cmjh9iltz0002djudlqkzkgom	asd	asdas	dasd	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	cmj5ec9zf0000jsudgpxci2hf	2025-12-25 14:39:00	100	MANUAL	f	t	2025-12-22 14:39:44.134	2025-12-22 14:41:58.482	2025-12-22 14:41:58.48
cmjh9fxkd0000djudrab7yzlj	asdas	dasdasd	asdasda	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	\N	2025-12-26 14:37:00	100	MANUAL	f	t	2025-12-22 14:37:39.372	2025-12-22 14:41:59.692	2025-12-22 14:41:59.691
cmjh9mblt0008djudbkpmcsaa	asdasd	asdasd	asdasd	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	cmj5ec9zf0000jsudgpxci2hf	2025-12-26 14:42:00	100	MANUAL	f	t	2025-12-22 14:42:37.504	2025-12-22 14:46:49.424	2025-12-22 14:46:49.419
cmji9m8160000qyudmt14e3z3	asd	asdasd	sadasd	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	cmj5ec9zf0000jsudgpxci2hf	2025-12-26 07:30:00	100	MANUAL	f	t	2025-12-23 07:30:19.049	2025-12-23 07:45:42.821	2025-12-23 07:45:42.817
cmjh9si5a0000rvud0p28ibep	INFORMATIKA			cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	cmj5ec9zf0000jsudgpxci2hf	2025-12-26 14:47:00	100	MANUAL	f	t	2025-12-22 14:47:25.916	2025-12-23 07:16:56.218	2025-12-23 07:16:56.212
cmji95m4n0000oeudhpfq70vk	tes	asdasd		cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	cmj5ec9zf0000jsudgpxci2hf	2025-12-27 07:17:00	100	MANUAL	f	t	2025-12-23 07:17:24.165	2025-12-23 07:18:06.605	2025-12-23 07:18:06.604
cmji9875l0002oeud62wh8pvn	asdasd	asdasd	asdasdas	cmj9z7q9i001r5dudnscpl8q0	cmj9z8yox00385dudt5p2uvo1	cmj5ec9zf0000jsudgpxci2hf	2025-12-26 07:18:00	100	MANUAL	f	t	2025-12-23 07:19:24.728	2025-12-23 07:24:38.224	2025-12-23 07:24:38.22
cmji9fejl0000awudarrb4ypf	asdasd	asdasdas	dasd	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	cmj5ec9zf0000jsudgpxci2hf	2025-12-26 07:24:00	100	MANUAL	f	t	2025-12-23 07:25:00.894	2025-12-23 07:29:51.14	2025-12-23 07:29:51.136
cmjia6tbi00002fudovdit4lo	TIK	TIK	ASDASD	cmj9z7q8c001f5dudtoyt49tx	cmj9z8yly00345dudadjrqvfh	cmj5ec9zf0000jsudgpxci2hf	2025-12-27 07:46:00	100	MANUAL	f	t	2025-12-23 07:46:19.756	2025-12-23 07:46:19.756	\N
\.


--
-- Data for Name: TugasAttachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TugasAttachment" (id, "tugasId", "namaFile", "ukuranFile", "tipeFile", "urlFile", "createdAt") FROM stdin;
cmji9m81u0001qyudcfyzezgf	cmji9m8160000qyudmt14e3z3	QR_3093967437_DESY_MUSTIKA_MAYA_SARI.png	3129	image/png	tugas-1766475019038-675526247.png	2025-12-23 07:30:19.074
cmjia6tc800022fud85cpfsjk	cmjia6tbi00002fudovdit4lo	SURAT PERNYATAANok.docx	29179	application/wps-office.docx	tugas-1766475979747-602187071.docx	2025-12-23 07:46:19.784
\.


--
-- Data for Name: TugasSiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TugasSiswa" (id, "tugasId", "siswaId", status, "submittedAt", "gradedAt", konten, score, feedback, "createdAt", "updatedAt") FROM stdin;
cmjia10n60000ifudy9ibcjxp	cmji9m8160000qyudmt14e3z3	cmj5gx04g001t35udknq3yqoe	DINILAI	2025-12-23 07:41:49.3	2025-12-23 07:42:33.598	tettessfsdfsf	80		2025-12-23 07:41:49.312	2025-12-23 07:42:33.599
cmjia812l00032fudymr0zx24	cmjia6tbi00002fudovdit4lo	cmj5gx04g001t35udknq3yqoe	DINILAI	2025-12-23 07:47:16.453	2025-12-23 08:19:13.017		80	sipp	2025-12-23 07:47:16.46	2025-12-23 08:19:13.017
\.


--
-- Data for Name: TugasSiswaFile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TugasSiswaFile" (id, "tugasSiswaId", "namaFile", "ukuranFile", "tipeFile", "urlFile", "createdAt") FROM stdin;
cmjia10no0002ifudvunjrxow	cmjia10n60000ifudy9ibcjxp	Soal BIN CBT Ganjil XI.docx	23626	application/wps-office.docx	submission-1766475709294-549429986.docx	2025-12-23 07:41:49.332
cmjia813200052fudo9u41l4c	cmjia812l00032fudymr0zx24	Screenshot_20251219_142722_Chrome.jpg	332098	image/jpeg	submission-1766476036445-982720339.jpg	2025-12-23 07:47:16.478
\.


--
-- Data for Name: Ujian; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ujian" (id, kode, judul, deskripsi, "mataPelajaranId", "kelasId", durasi, "tanggalMulai", "tanggalSelesai", "nilaiMinimal", "acakSoal", "tampilkanNilai", status, "createdBy", "createdAt", "updatedAt", "deletedAt", "paketSoalId", "guruId", "deteksiKecurangan") FROM stdin;
cmjifj9d6002soludnz59mwwv	UJI-00001	tik		cmj9z7q8c001f5dudtoyt49tx	\N	60	2025-12-23 10:15:00	2025-12-23 11:15:00	70	t	f	PUBLISHED	cmj9z8ylv00335dudr8tet2na	2025-12-23 10:15:58.505	2025-12-23 10:16:02.117	\N	cmjic35lb000081ud6uexgy91	cmj9z8yly00345dudadjrqvfh	t
cmjk1zvpu0000ibud7ugrpmg8	UJI-00002	asdd	dasd	cmj9z7q8c001f5dudtoyt49tx	\N	60	2025-12-24 13:32:00	2025-12-24 14:32:00	70	t	f	PUBLISHED	cmj5cw3cn00004iud971p5w0w	2025-12-24 13:32:31.697	2025-12-24 14:08:19.297	\N	cmjic35lb000081ud6uexgy91	cmj9z8yly00345dudadjrqvfh	f
\.


--
-- Data for Name: UjianKelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UjianKelas" (id, "ujianId", "kelasId", "createdAt") FROM stdin;
cmjifj9d9003ioludb1au9jc6	cmjifj9d6002soludnz59mwwv	cmj5ec9zf0000jsudgpxci2hf	2025-12-23 10:15:58.505
cmjk1zvq0000qibudrzx2dlvo	cmjk1zvpu0000ibud7ugrpmg8	cmj5ec9zf0000jsudgpxci2hf	2025-12-24 13:32:31.697
\.


--
-- Data for Name: UjianSiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UjianSiswa" (id, "ujianId", "siswaId", "tokenAkses", "waktuMulai", "waktuSelesai", durasi, status, "nilaiTotal", "isPassed", jawaban, "createdAt", "updatedAt", "manualGrades") FROM stdin;
cmjifjcv1003joludodwb367t	cmjifj9d6002soludnz59mwwv	cmj5gwzqp001b35udoas61cxe	\N	\N	\N	\N	BELUM_MULAI	\N	\N	\N	2025-12-23 10:16:03.037	2025-12-23 10:16:03.037	\N
cmjifjcv1003koludhx5c784l	cmjifj9d6002soludnz59mwwv	cmj5gx2c1004r35udtqywx9eq	\N	\N	\N	\N	BELUM_MULAI	\N	\N	\N	2025-12-23 10:16:03.037	2025-12-23 10:16:03.037	\N
cmjifjcv1003loludjqwe6xz7	cmjifj9d6002soludnz59mwwv	cmj5gx2zz005n35udbo6v7qv9	\N	\N	\N	\N	BELUM_MULAI	\N	\N	\N	2025-12-23 10:16:03.037	2025-12-23 10:16:03.037	\N
cmjifjcv1003molud6ycukjm4	cmjifj9d6002soludnz59mwwv	cmj5gx04g001t35udknq3yqoe	\N	2025-12-23 10:16:07.454	2025-12-23 10:22:49.872	6	SELESAI	43	f	[{"soalId": "cmjifieo5001holudft7ycw8s", "jawaban": "B"}, {"soalId": "cmjifieo0001goludfkwbw40k", "jawaban": "A"}, {"soalId": "cmjifieqy001yoludx262gojq", "jawaban": "Makan malam "}, {"soalId": "cmjifieoa001iolud5rcx9rue", "jawaban": "A"}, {"soalId": "cmjifienj001eoludxsig2f5g", "jawaban": "A"}, {"soalId": "cmjifieoe001jolud9363qoeg", "jawaban": "A"}, {"soalId": "cmjifienv001foluddwaxkhi7", "jawaban": "A"}, {"soalId": "cmjifieor001loludmim8twxs", "jawaban": "A"}, {"soalId": "cmjifieqt001xolud1y9xhes0", "jawaban": "A"}]	2025-12-23 10:16:03.037	2025-12-23 13:39:04.073	{"cmjifj9d7003doludqvnyap4m": 8, "cmjifj9d7003eoluduhr2275u": 8, "cmjifj9d7003foludt8ye7ult": 8, "cmjifj9d7003goluddvo7uc6w": 8, "cmjifj9d7003holudrznmxscj": 8}
cmjk1zyyd000ribudu0nydg1n	cmjk1zvpu0000ibud7ugrpmg8	cmj5gwzqp001b35udoas61cxe	\N	\N	\N	\N	BELUM_MULAI	\N	\N	\N	2025-12-24 13:32:35.893	2025-12-24 13:32:35.893	\N
cmjk1zyyd000sibud1odpd7hf	cmjk1zvpu0000ibud7ugrpmg8	cmj5gx2c1004r35udtqywx9eq	\N	\N	\N	\N	BELUM_MULAI	\N	\N	\N	2025-12-24 13:32:35.893	2025-12-24 13:32:35.893	\N
cmjk1zyyd000tibudmb5stmma	cmjk1zvpu0000ibud7ugrpmg8	cmj5gx2zz005n35udbo6v7qv9	\N	\N	\N	\N	BELUM_MULAI	\N	\N	\N	2025-12-24 13:32:35.893	2025-12-24 13:32:35.893	\N
cmjk1zyyd000uibudlvanlp82	cmjk1zvpu0000ibud7ugrpmg8	cmj5gx04g001t35udknq3yqoe	\N	2025-12-24 13:43:42.241	2025-12-24 14:00:40.859	16	SELESAI	6	f	[{"soalId": "cmjifieqi001voludsqyo1qmb", "jawaban": "B"}, {"soalId": "cmjifieq5001toludcvqwda78", "jawaban": "A"}, {"soalId": "cmjifieor001loludmim8twxs", "jawaban": "B"}, {"soalId": "cmjifieqn001woludaaipze17", "jawaban": "C"}, {"soalId": "cmjifieo0001goludfkwbw40k", "jawaban": "A"}, {"soalId": "cmjifieoe001jolud9363qoeg", "jawaban": "A"}, {"soalId": "cmjifiepl001qolud1sgehr2f", "jawaban": "A"}]	2025-12-24 13:32:35.893	2025-12-24 14:00:40.86	\N
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
cmj9z8yly00345dudadjrqvfh	cmj9z7q8c001f5dudtoyt49tx
cmj9z8yly00345dudadjrqvfh	cmj9z7q90001m5dud5q6cvaku
cmj9z8yly00345dudadjrqvfh	cmj9z7qa0001w5dudmau1sngf
cmj9z8ybn002q5dud7n4058u9	cmj9z7q84001d5dud60yqektg
cmj9z8y4a002g5dudjlq4s2jp	cmj9z7q7y001c5dudu38a65qb
cmj9z8y77002k5dudwjch4365	cmj9z7q8v001k5dudwd0dr0f2
cmj9z8yem002u5dudolwskcz4	cmj9z7q87001e5dudb1uk5u9j
cmj9z8yem002u5dudolwskcz4	cmj9z7q9n001s5dudxr525koc
cmj9z8xtu00225dudew59ixr7	cmj9z7q8k001h5dudkou2wtsf
cmj9z8xvg00245duda7dxbp56	cmj9z7q8q001j5dudx5o1zuri
cmj9z8yd4002s5dudqb9lav2o	cmj9z7q9i001r5dudnscpl8q0
cmj9z8y5q002i5dudk3gr40r9	cmj9z7q98001o5dudu8zzru3q
cmj9z8y5q002i5dudk3gr40r9	cmj9z7q9f001q5dud3giiabft
cmj9z8y2q002e5dud69l0gx00	cmj9z7q8h001g5dud3cnj22wr
cmj9z8y2q002e5dud69l0gx00	cmj9z7qa5001x5dudniu477gy
cmj9z8y8o002m5dudwnycw1jf	cmj9z7q8c001f5dudtoyt49tx
cmj9z8y8o002m5dudwnycw1jf	cmj9z7q9n001s5dudxr525koc
cmj9z8yhl002y5dudqly12oc3	cmj9z7q90001m5dud5q6cvaku
cmj9z8yhl002y5dudqly12oc3	cmj9z7qae00205dudqey9zf1h
cmj9z8xyc00285dudgvf5bnnv	cmj9z7q8m001i5dudi334c2ms
cmj9z8xyc00285dudgvf5bnnv	cmj9z7q9i001r5dudnscpl8q0
cmj9z8xyc00285dudgvf5bnnv	cmj9z7q9v001v5dud8r2heab2
cmj9z8xwv00265dud0w98oh1m	cmj9z7q98001o5dudu8zzru3q
cmj9z8xwv00265dud0w98oh1m	cmj9z7q9f001q5dud3giiabft
cmj9z8xwv00265dud0w98oh1m	cmj9z7qa8001y5dud4gjab2sw
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
cmj9z8ynh00365dudxaiuoy08	cmjof810t000005udgq7bzpjh
cmj9z8yj000305dudtwddc0j1	cmj9z7q7y001c5dudu38a65qb
cmj9z8yj000305dudtwddc0j1	cmj9z7qaa001z5dudjfz3mlu8
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
25cbcde4-da2f-4cc8-83c4-c53957adbea6	609cb3817046359fc62b69f293e3903cd198aae0f3510bf462c59f9ad4035ff7	2025-12-14 06:31:18.835747+00	20251211102828_init	\N	\N	2025-12-14 06:31:18.83016+00	1
ea77ed3b-4da4-4635-a3e3-00089ab07944	2640bf707564a1056f78c31ab21927c3e2ba43ac93d47d3f1ef832ccced34bc8	2025-12-14 06:31:18.841561+00	20251211151758_npm_run_prisma_generate	\N	\N	2025-12-14 06:31:18.83679+00	1
e6de99b5-8b05-486a-80ac-b1ef7bbc8737	0c7e0d4e778e1cc415cbfd0b3fbe7fdc91ffeb05229bf7599a2ebb8ceb9ffb3e	2025-12-14 06:31:18.859358+00	20251212095857_add_lms_entities	\N	\N	2025-12-14 06:31:18.842709+00	1
9e68f37c-b5f2-4de7-a907-203165ec1522	750d8a254ceaaf152f260f65242d25249ecaaf9678faa3f041f061007f1ee44d	2025-12-14 06:31:18.87073+00	20251212112639_add_jurusan_and_update_kelas	\N	\N	2025-12-14 06:31:18.860547+00	1
d86908ec-eee3-43fa-b177-e3322609e9a5	998edaffc3e7e33bda76f385a440e3df4dbf0428564a2a15763cd5aa26535719	2025-12-14 06:31:18.88245+00	20251212122610_add_many_to_many_guru_mata_pelajaran	\N	\N	2025-12-14 06:31:18.872583+00	1
1850ccde-a2ab-4d64-8c26-3aeced7cf999	92f08fc24273bbcd87412a6494250a94461f6da2ba78cc5cc67527b74e451431	2025-12-14 06:31:18.89181+00	20251212125923_add_user_integration_to_siswa_guru	\N	\N	2025-12-14 06:31:18.883597+00	1
f9f16ffd-9012-464f-bddd-ea50ad209c61	2af40a7de13d912e0dc5428dfaad47807ad86bb19d9b998236759c7c6779f568	2025-12-14 06:31:18.900475+00	20251212145913_make_tahun_ajaran_required_in_kelas	\N	\N	2025-12-14 06:31:18.893029+00	1
4916feba-0f6f-481c-a33e-899d714f14be	90480c68541aad550a5a12bc2e8485029efc1fb1fa25a9940a1323042c4385e2	2025-12-14 06:31:18.907562+00	20251214051132	\N	\N	2025-12-14 06:31:18.901757+00	1
dc09486e-9aa8-4911-b3fc-76eaceea3b5f	f4eb6ab1a9e0366ad782133ad765d973cb1b2ab0a48a1f7e9034e305b6634ff0	2025-12-14 06:31:32.238868+00	20251214063132_refactor_tahun_ajaran_to_siswa	\N	\N	2025-12-14 06:31:32.226902+00	1
73a86823-e8fa-4920-9f59-a21a009f557c	25d03367cc79cdbff0ec8e1c2d3c33a3b806c75a4e4b1fecd1932f16e476b4e5	2025-12-14 08:42:12.558915+00	20251214084212_add_attendance_model	\N	\N	2025-12-14 08:42:12.543587+00	1
d13dd0a1-8778-48be-a0e3-4b2fcad3f1f9	9c5dce6d4875f6332cacf7463b5274add07688e63ce466bb55322ca48798db91	2025-12-16 11:06:39.688214+00	20251216110639_add_petugas_absensi_role	\N	\N	2025-12-16 11:06:39.684805+00	1
839fd3f6-6fec-4885-b81a-3abbd1be9a37	8334127d9f47b107a04a7d4f45e7b1a9f28120a32076d8418b80a0fbdd0d7fd3	2025-12-17 02:31:06.839154+00	20251217022933_remove_semester_from_tahun_ajaran	\N	\N	2025-12-17 02:31:06.831379+00	1
d68e8bfa-48fb-4ed7-9e1c-50c63cd34bce	750d3916e193e86a376975d2c2776442d2927c8c75e0e51903d350dd990c2f6b	2025-12-16 11:51:14.343646+00	20251216115114_add_magang_status	\N	\N	2025-12-16 11:51:14.340335+00	1
5a4576c2-a0a8-43b4-8a45-d3886f792273	da85a17d1e1e9d2f1e72621609dbf630c551db1a7cb10b87199cd81e646623ef	2025-12-16 11:52:39.628246+00	20251216115239_rename_magang_to_pkl	\N	\N	2025-12-16 11:52:39.612393+00	1
ac9c6256-0a4f-45bc-b207-4bbbc330c309	39e302b56339b64f0b94a36c409a5271427d4159a7bda50059e41db697152c50	2025-12-17 11:47:42.425417+00	20251217114742_add_multi_class_student_selection	\N	\N	2025-12-17 11:47:42.41209+00	1
e7714767-02e4-4cba-9ef6-1cda99cc360b	0156d098f4db91ff3bbadcc1b79aadb5d97c09871b71938fd4dc6e53391a1532	2025-12-16 12:49:05.605477+00	20251216124905_add_settings_model	\N	\N	2025-12-16 12:49:05.599174+00	1
a1d4c89c-449e-4995-a8bd-e4937f0a4a90	ca56657a42dc94fe3aa791065e17521b02eadc0abb8a196bd6d74998eaca7b18	2025-12-17 07:42:27.654699+00	20251217074227_remove_tingkat_kesulitan	\N	\N	2025-12-17 07:42:27.631133+00	1
f0e7af81-4a04-42f9-8b3f-5addddbb6f59	8334127d9f47b107a04a7d4f45e7b1a9f28120a32076d8418b80a0fbdd0d7fd3	\N	20251217022933_remove_semester_from_tahun_ajaran	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20251217022933_remove_semester_from_tahun_ajaran\n\nDatabase error code: 23505\n\nDatabase error:\nERROR: could not create unique index "TahunAjaran_tahun_key"\nDETAIL: Key (tahun)=(2025/2026) is duplicated.\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E23505), message: "could not create unique index \\"TahunAjaran_tahun_key\\"", detail: Some("Key (tahun)=(2025/2026) is duplicated."), hint: None, position: None, where_: None, schema: Some("public"), table: Some("TahunAjaran"), column: None, datatype: None, constraint: Some("TahunAjaran_tahun_key"), file: Some("tuplesortvariants.c"), line: Some(1550), routine: Some("comparetup_index_btree_tiebreak") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20251217022933_remove_semester_from_tahun_ajaran"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20251217022933_remove_semester_from_tahun_ajaran"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:246	2025-12-17 02:30:58.550928+00	2025-12-17 02:29:33.997981+00	0
2c9885b9-dc02-4e46-b931-5ececfe61b01	b49d31efb8891a0baa5b7c1c11b5468cc50c80552ec5a7b78852605d377c5bef	2025-12-17 09:10:02.049316+00	20251217091002_add_paket_soal	\N	\N	2025-12-17 09:10:02.037045+00	1
9225bb4c-2c73-464b-8cf2-06eaead37bee	c709d568b3e9f35bfae33784143ab1dc0f924ed7188d7682fe83a2230a1ee496	2025-12-17 09:22:51.963536+00	20251217092251_remove_tingkat_kesulitan	\N	\N	2025-12-17 09:22:51.959643+00	1
fa77163e-c8cd-476c-a2de-9e69baa13618	1e2dc8a2aa1a8521d2ffe0b9e6dc3039cea60c545ec602bdfe0492285e12afd8	2025-12-17 12:00:58.944202+00	20251217120042_add_guru_to_ujian	\N	\N	2025-12-17 12:00:58.937467+00	1
bafc30c0-6d52-4cd4-bd40-5ce1a2ff5610	c8a78ac8421e0546ebf611754745d56f60ef00986d8fbaec0ea700f0b022c21e	2025-12-17 09:27:12.124423+00	20251217092712_add_guru_to_paket_soal	\N	\N	2025-12-17 09:27:12.116295+00	1
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
GRANT CREATE ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict SIOmGKiBDETLudqtoMXTXP65xHD8bHcqJkxjXSzDOCaeBjG6sKotGwOv7GTsSEV

