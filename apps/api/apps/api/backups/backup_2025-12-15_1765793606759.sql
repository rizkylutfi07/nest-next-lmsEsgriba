--
-- PostgreSQL database dump
--

\restrict ie1kGdOgcCmd6fbHpvLqy8swezN3HfYzXLe5deHGdzuuCZuhHpDZEwh488SpAE0

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
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'GURU',
    'SISWA'
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
-- Name: StatusSiswa; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StatusSiswa" AS ENUM (
    'AKTIF',
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
    "tahunAjaranId" text
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
    semester integer NOT NULL,
    "tanggalMulai" timestamp(3) without time zone NOT NULL,
    "tanggalSelesai" timestamp(3) without time zone NOT NULL,
    status public."StatusTahunAjaran" DEFAULT 'AKAN_DATANG'::public."StatusTahunAjaran" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."TahunAjaran" OWNER TO postgres;

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
cmj6yskfu0000kqudssfzldia	cmj5gx31i005p35ud17ebh91g	2025-12-14	2025-12-15 09:41:51.348	\N	TERLAMBAT	\N	\N	2025-12-15 09:41:51.353	2025-12-15 09:41:51.353	\N
cmj6ytkz00001kqud5kma7m34	cmj5gx2zz005n35udbo6v7qv9	2025-12-14	2025-12-15 09:42:38.699	\N	TERLAMBAT	\N	\N	2025-12-15 09:42:38.7	2025-12-15 09:42:38.7	\N
cmj6yu1iw0002kqud3um7ktie	cmj5gx2yi005l35udcr748bi3	2025-12-14	2025-12-15 09:43:00.147	\N	TERLAMBAT	\N	\N	2025-12-15 09:43:00.151	2025-12-15 09:43:00.151	\N
cmj6z140h0003kquduhe8insl	cmj5gx2wz005j35ud2ivwa2j0	2025-12-14	2025-12-15 09:48:29.968	\N	TERLAMBAT	\N	\N	2025-12-15 09:48:29.969	2025-12-15 09:48:29.969	\N
cmj6z1osy0004kqudlos6iuaa	cmj5gx2u0005f35udktuxz1uv	2025-12-14	2025-12-15 09:48:56.911	\N	TERLAMBAT	\N	\N	2025-12-15 09:48:56.913	2025-12-15 09:48:56.913	\N
cmj6z2uos0005kqudozgukc50	cmj5gx2mh005535ud6oic8o1p	2025-12-14	2025-12-15 09:49:51.195	\N	TERLAMBAT	\N	\N	2025-12-15 09:49:51.196	2025-12-15 09:49:51.196	\N
cmj6z30710006kqud9lpclxus	cmj5gx2jh005135udtbcxbtb9	2025-12-14	2025-12-15 09:49:58.332	\N	TERLAMBAT	\N	\N	2025-12-15 09:49:58.333	2025-12-15 09:49:58.333	\N
\.


--
-- Data for Name: Guru; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") FROM stdin;
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
cmj5cyfcu00024iuddr4oqwkv	MTK	Matematika	13	\N	SEMUA	2025-12-14 06:42:46.974	2025-12-14 06:42:46.974	\N
\.


--
-- Data for Name: Siswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId") FROM stdin;
cmj5gwyqw000135udakhyrrna	81475874	ABI HARTO WICAKSONO	1970-01-01 00:00:38.367	Jl. Merdeka No. 123	81234567890	abihartowicaksono@cbt.com	AKTIF	2025-12-14 08:33:37.255	2025-12-14 08:33:37.255	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwyql000035udj9kefx0z	cmj5cxv7e00014iudyynxuvmc
cmj5gwysk000335ud06zbjkum	95805399	ADAM SYAHREZA GUMILANG	1970-01-01 00:00:38.431	Jl. Sudirman No. 45	81234567891	adamsyahrezagumilang@cbt.com	AKTIF	2025-12-14 08:33:37.315	2025-12-14 08:33:37.315	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwysf000235udeqpf8mo9	cmj5cxv7e00014iudyynxuvmc
cmj5gwyu3000535udp8xm32kg	3088037976	ADITIYA RIZKY BAYU PRADIKA	1970-01-01 00:00:38.431	Jl. Sudirman No. 46	81234567892	aditiyarizkybayupradika@cbt.com	AKTIF	2025-12-14 08:33:37.371	2025-12-14 08:33:37.371	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwytz000435ud3k5i6zne	cmj5cxv7e00014iudyynxuvmc
cmj5gwyvo000735udytelfevq	84194598	ADITYA CATUR PRAYOGO	1970-01-01 00:00:38.431	Jl. Sudirman No. 47	81234567893	adityacaturprayogo@cbt.com	AKTIF	2025-12-14 08:33:37.427	2025-12-14 08:33:37.427	\N	cmj5eca0o0005jsud0ambwla7	cmj5gwyvj000635udzcqos5da	cmj5cxv7e00014iudyynxuvmc
cmj5gwyx9000935ud28f9ggyr	108737154	ADITYA DAMARA PUTRA KRISTIAWAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 48	81234567894	example12@cbt.com	AKTIF	2025-12-14 08:33:37.485	2025-12-14 08:33:37.485	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gwyx4000835udq2k2tbxp	cmj5cxv7e00014iudyynxuvmc
cmj5gwyyw000b35udpo5b2m4t	76544902	ADRIANO DWI PRADHITA	1970-01-01 00:00:38.431	Jl. Sudirman No. 49	81234567895	adrianodwipradhita@cbt.com	AKTIF	2025-12-14 08:33:37.543	2025-12-14 08:33:37.543	\N	cmj5eca170008jsudb4r1h58n	cmj5gwyyq000a35udwqnc8ohp	cmj5cxv7e00014iudyynxuvmc
cmj5gwz0g000d35ud5n8q889d	77382296	AGUNG TRISNA DEWI	1970-01-01 00:00:38.431	Jl. Sudirman No. 50	81234567896	agungtrisnadewi@cbt.com	AKTIF	2025-12-14 08:33:37.599	2025-12-14 08:33:37.599	\N	cmj5eca050002jsudq5rc3oa3	cmj5gwz0c000c35udn9g3zoan	cmj5cxv7e00014iudyynxuvmc
cmj5gwz23000f35udoygf650d	86881070	AGUS WIRA ADI PURNOMO	1970-01-01 00:00:38.431	Jl. Sudirman No. 51	81234567897	aguswiraadipurnomo@cbt.com	AKTIF	2025-12-14 08:33:37.659	2025-12-14 08:33:37.659	\N	cmj5eca0o0005jsud0ambwla7	cmj5gwz1y000e35udzacwpk0x	cmj5cxv7e00014iudyynxuvmc
cmj5gwz3n000h35udillr14ag	99461767	AHMAD DIMAS KURNIAWAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 52	81234567898	example1@cbt.com	AKTIF	2025-12-14 08:33:37.714	2025-12-14 08:33:37.714	\N	cmj5eca0w0006jsud9bca11b3	cmj5gwz3i000g35udydzzmr53	cmj5cxv7e00014iudyynxuvmc
cmj5gwz58000j35ud2jgpgotd	86817502	AHMAD RIAN ZUHRI AFANDI	1970-01-01 00:00:38.431	Jl. Sudirman No. 53	81234567899	ahmadrianzuhriafandi@cbt.com	AKTIF	2025-12-14 08:33:37.771	2025-12-14 08:33:37.771	\N	cmj5eca170008jsudb4r1h58n	cmj5gwz53000i35udw6fgqktc	cmj5cxv7e00014iudyynxuvmc
cmj5gwz6t000l35ud8wsvgkyz	99396650	AINO YOEL	1970-01-01 00:00:38.431	Jl. Sudirman No. 54	81234567900	example2@cbt.com	AKTIF	2025-12-14 08:33:37.828	2025-12-14 08:33:37.828	\N	cmj5eca0w0006jsud9bca11b3	cmj5gwz6p000k35ud68fsf33i	cmj5cxv7e00014iudyynxuvmc
cmj5gwz8c000n35ud8pxa34ep	50397766	AINUR ROHMAH	1970-01-01 00:00:38.431	Jl. Sudirman No. 55	81234567901	ainurrohmah@cbt.com	AKTIF	2025-12-14 08:33:37.883	2025-12-14 08:33:37.883	\N	cmj5ec9zx0001jsud5cnf1k74	cmj5gwz88000m35ud5x4ctx7s	cmj5cxv7e00014iudyynxuvmc
cmj5gwz9u000p35uddazsd00z	79686226	ALDI PRAYATNA	1970-01-01 00:00:38.431	Jl. Sudirman No. 56	81234567902	aldiprayatna@cbt.com	AKTIF	2025-12-14 08:33:37.937	2025-12-14 08:33:37.937	\N	cmj5eca0o0005jsud0ambwla7	cmj5gwz9q000o35ud7f7d7ltw	cmj5cxv7e00014iudyynxuvmc
cmj5gwzbe000r35ud3dm0w5mp	57279011	ALDO ILFAN PRATAMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 57	81234567903	aldoilfanpratama@cbt.com	AKTIF	2025-12-14 08:33:37.994	2025-12-14 08:33:37.994	\N	cmj5eca170008jsudb4r1h58n	cmj5gwzb9000q35uds8mmj6bl	cmj5cxv7e00014iudyynxuvmc
cmj5gwzcy000t35ud1wibxk47	78367595	ALFA TRI EFENDI	1970-01-01 00:00:38.431	Jl. Sudirman No. 58	81234567904	alfatriefendi@cbt.com	AKTIF	2025-12-14 08:33:38.049	2025-12-14 08:33:38.049	\N	cmj5eca170008jsudb4r1h58n	cmj5gwzct000s35udllh69h8u	cmj5cxv7e00014iudyynxuvmc
cmj5gwzeh000v35udwd1xnzk8	97678393	ALFAZA OKTAVINO PRADITIA	1970-01-01 00:00:38.431	Jl. Sudirman No. 59	81234567905	example13@cbt.com	AKTIF	2025-12-14 08:33:38.105	2025-12-14 08:33:38.105	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gwzed000u35udlnddwq47	cmj5cxv7e00014iudyynxuvmc
cmj5gwzg0000x35udzy1o8cpn	97759070	ALIFATUR ROSIKIN	1970-01-01 00:00:38.431	Jl. Sudirman No. 60	81234567906	alifaturrosikin@cbt.com	AKTIF	2025-12-14 08:33:38.16	2025-12-14 08:33:38.16	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwzfw000w35udzc26ap9b	cmj5cxv7e00014iudyynxuvmc
cmj5gwzhi000z35udkij11ubh	85609468	AMELIA DEWI SINTA	1970-01-01 00:00:38.431	Jl. Sudirman No. 61	81234567907	ameliadewisinta@cbt.com	AKTIF	2025-12-14 08:33:38.214	2025-12-14 08:33:38.214	\N	cmj5eca050002jsudq5rc3oa3	cmj5gwzhe000y35udg8o4lrsn	cmj5cxv7e00014iudyynxuvmc
cmj5gwzj2001135udp7u21il5	94461900	ANANDA MAYCKO WIJAYA	1970-01-01 00:00:38.431	Jl. Sudirman No. 62	81234567908	example3@cbt.com	AKTIF	2025-12-14 08:33:38.269	2025-12-14 08:33:38.269	\N	cmj5eca0w0006jsud9bca11b3	cmj5gwziy001035udhbgntn1o	cmj5cxv7e00014iudyynxuvmc
cmj5gwzkk001335uddaybproj	88279036	ANDHIKA BAYU SAPUTRA	1970-01-01 00:00:38.431	Jl. Sudirman No. 63	81234567909	andhikabayusaputra@cbt.com	AKTIF	2025-12-14 08:33:38.324	2025-12-14 08:33:38.324	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwzkg001235uda1zowq2b	cmj5cxv7e00014iudyynxuvmc
cmj5gwzm3001535ud35s55raa	104207471	ANGGA CAHYO PRATAMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 64	81234567910	example4@cbt.com	AKTIF	2025-12-14 08:33:38.378	2025-12-14 08:33:38.378	\N	cmj5eca0w0006jsud9bca11b3	cmj5gwzlz001435udoar1p1ou	cmj5cxv7e00014iudyynxuvmc
cmj5gwznm001735udpzuadsi6	87785971	ANGGI VIRNANDA PUTRI	1970-01-01 00:00:38.431	Jl. Sudirman No. 65	81234567911	anggivirnandaputri@cbt.com	AKTIF	2025-12-14 08:33:38.434	2025-12-14 08:33:38.434	\N	cmj5ec9zx0001jsud5cnf1k74	cmj5gwzni001635udt2intkub	cmj5cxv7e00014iudyynxuvmc
cmj5gwzp6001935udi39qku1d	3080015591	AWANG SETIAWAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 66	81234567912	awangsetiawan@cbt.com	AKTIF	2025-12-14 08:33:38.489	2025-12-14 08:33:38.489	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwzp2001835udtswr5q1s	cmj5cxv7e00014iudyynxuvmc
cmj5gwzqp001b35udoas61cxe	95325705	AYUNI ARIMBI	1970-01-01 00:00:38.431	Jl. Sudirman No. 67	81234567913	example25@cbt.com	AKTIF	2025-12-14 08:33:38.544	2025-12-14 08:33:38.544	\N	cmj5ec9zf0000jsudgpxci2hf	cmj5gwzql001a35udfoqzqfcv	cmj5cxv7e00014iudyynxuvmc
cmj5gwzs8001d35ud78grtko5	88137615	AZAI DENIS SAFARULLAH	1970-01-01 00:00:38.431	Jl. Sudirman No. 68	81234567914	example5@cbt.com	AKTIF	2025-12-14 08:33:38.599	2025-12-14 08:33:38.599	\N	cmj5eca0w0006jsud9bca11b3	cmj5gwzs4001c35udaqgx22e1	cmj5cxv7e00014iudyynxuvmc
cmj5gwztr001f35udgp2iqne6	99940723	BADRIA NUR ANISA	1970-01-01 00:00:38.431	Jl. Sudirman No. 69	81234567915	example14@cbt.com	AKTIF	2025-12-14 08:33:38.654	2025-12-14 08:33:38.654	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gwztn001e35udd3b8c4mg	cmj5cxv7e00014iudyynxuvmc
cmj5gwzv9001h35udc6lry71w	85744170	BAGUS SETIAWAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 70	81234567916	bagussetiawan@cbt.com	AKTIF	2025-12-14 08:33:38.708	2025-12-14 08:33:38.708	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwzv5001g35ud5bbn2qzz	cmj5cxv7e00014iudyynxuvmc
cmj5gwzws001j35ud376v2a11	3096187956	CANDRA PRATAMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 71	81234567917	example6@cbt.com	AKTIF	2025-12-14 08:33:38.764	2025-12-14 08:33:38.764	\N	cmj5eca0w0006jsud9bca11b3	cmj5gwzwo001i35uduhbzcboi	cmj5cxv7e00014iudyynxuvmc
cmj5gwzyc001l35udnzueuy9e	69853933	DANU BAGUS PRAYOGO	1970-01-01 00:00:38.431	Jl. Sudirman No. 72	81234567918	danubagusprayogo@cbt.com	AKTIF	2025-12-14 08:33:38.819	2025-12-14 08:33:38.819	\N	cmj5eca170008jsudb4r1h58n	cmj5gwzy7001k35udjqgqcye1	cmj5cxv7e00014iudyynxuvmc
cmj5gwzzu001n35udi1ekaazg	3080427888	DAVA PUTRA PRASETYA	1970-01-01 00:00:38.431	Jl. Sudirman No. 73	81234567919	davaputraprasetya@cbt.com	AKTIF	2025-12-14 08:33:38.874	2025-12-14 08:33:38.874	\N	cmj5eca130007jsudvzwt5rjx	cmj5gwzzr001m35udpblpr5c0	cmj5cxv7e00014iudyynxuvmc
cmj5gx01e001p35udcjqmly7n	75360603	DEFI NINGTYAS	1970-01-01 00:00:38.431	Jl. Sudirman No. 74	81234567920	definingtyas@cbt.com	AKTIF	2025-12-14 08:33:38.929	2025-12-14 08:33:38.929	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx01a001o35udcz1uye9r	cmj5cxv7e00014iudyynxuvmc
cmj5gx02w001r35ud6qdfidog	86514583	DENDI BAYU PRATAMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 75	81234567921	dendibayupratama@cbt.com	AKTIF	2025-12-14 08:33:38.983	2025-12-14 08:33:38.983	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx02s001q35udsc32mvtz	cmj5cxv7e00014iudyynxuvmc
cmj5gx04g001t35udknq3yqoe	3093967437	DESY MUSTIKA MAYA SARI	1970-01-01 00:00:38.431	Jl. Sudirman No. 76	81234567922	example26@cbt.com	AKTIF	2025-12-14 08:33:39.039	2025-12-14 08:33:39.039	\N	cmj5ec9zf0000jsudgpxci2hf	cmj5gx04c001s35udal7y6kqp	cmj5cxv7e00014iudyynxuvmc
cmj5gx05x001v35udwd5nk8nj	71300771	DEWI WAHYUNI	1970-01-01 00:00:38.431	Jl. Sudirman No. 77	81234567923	dewiwahyuni@cbt.com	AKTIF	2025-12-14 08:33:39.093	2025-12-14 08:33:39.093	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx05t001u35ud56w1gpg0	cmj5cxv7e00014iudyynxuvmc
cmj5gx07f001x35udj3ispkx8	74612857	DINA RIZA AYU MATUSSHOLEHA	1970-01-01 00:00:38.431	Jl. Sudirman No. 78	81234567924	dinarizaayumatussholeha@cbt.com	AKTIF	2025-12-14 08:33:39.147	2025-12-14 08:33:39.147	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx07b001w35ud6uy774vt	cmj5cxv7e00014iudyynxuvmc
cmj5gx08y001z35udsqo698l8	88236354	DINO ABI PRATAMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 79	81234567925	dinoabipratama@cbt.com	AKTIF	2025-12-14 08:33:39.201	2025-12-14 08:33:39.201	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx08u001y35udh95b095v	cmj5cxv7e00014iudyynxuvmc
cmj5gx0ag002135ud9fhzdekh	84607003	DIZA YOGA YUDISTIA	1970-01-01 00:00:38.431	Jl. Sudirman No. 80	81234567926	dizayogayudistia@cbt.com	AKTIF	2025-12-14 08:33:39.256	2025-12-14 08:33:39.256	\N	cmj5ec9zx0001jsud5cnf1k74	cmj5gx0ac002035udfnj8z7vm	cmj5cxv7e00014iudyynxuvmc
cmj5gx0c0002335udrmwctcnm	108153368	DWI AYU MEI JAYANTI	1970-01-01 00:00:38.431	Jl. Sudirman No. 81	81234567927	example15@cbt.com	AKTIF	2025-12-14 08:33:39.311	2025-12-14 08:33:39.311	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx0bv002235ud9wy5giy5	cmj5cxv7e00014iudyynxuvmc
cmj5gx0di002535ud32uasdbw	85947084	DWI SINTIA PUTRI	1970-01-01 00:00:38.431	Jl. Sudirman No. 82	81234567928	dwisintiaputri@cbt.com	AKTIF	2025-12-14 08:33:39.365	2025-12-14 08:33:39.365	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx0de002435ud24zdsw0s	cmj5cxv7e00014iudyynxuvmc
cmj5gx0ez002735ud6aegx8z1	83725353	EKA DEVI AINUROHMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 83	81234567929	ekadeviainurohma@cbt.com	AKTIF	2025-12-14 08:33:39.419	2025-12-14 08:33:39.419	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx0ev002635udvv65yg6g	cmj5cxv7e00014iudyynxuvmc
cmj5gx0gi002935udl20nfbog	24142799	ENGGAR DWI PRASETYO	1970-01-01 00:00:38.431	Jl. Sudirman No. 84	81234567930	enggardwiprasetyo@cbt.com	AKTIF	2025-12-14 08:33:39.474	2025-12-14 08:33:39.474	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx0gd002835udbw0sqmi6	cmj5cxv7e00014iudyynxuvmc
cmj5gx0i0002b35ud19a6xd7r	76887989	ESA AGIL PUTRA	1970-01-01 00:00:38.431	Jl. Sudirman No. 85	81234567931	esaagilputra@cbt.com	AKTIF	2025-12-14 08:33:39.528	2025-12-14 08:33:39.528	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx0hw002a35udavq9oyfo	cmj5cxv7e00014iudyynxuvmc
cmj5gx0jj002d35udjlza7xue	82535073	FAHMI ADLIYANTO	1970-01-01 00:00:38.431	Jl. Sudirman No. 86	81234567932	fahmiadliyanto@cbt.com	AKTIF	2025-12-14 08:33:39.582	2025-12-14 08:33:39.582	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx0jf002c35udq9gtxbg2	cmj5cxv7e00014iudyynxuvmc
cmj5gx0l0002f35ud6j2sufzk	3087966253	FAREL ADITYA PUTRA	1970-01-01 00:00:38.431	Jl. Sudirman No. 87	81234567933	fareladityaputra@cbt.com	AKTIF	2025-12-14 08:33:39.635	2025-12-14 08:33:39.635	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx0kw002e35ud03ae2xo1	cmj5cxv7e00014iudyynxuvmc
cmj5gx0ml002h35udvjc8yzeb	78956609	FATURROHMAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 88	81234567934	faturrohman@cbt.com	AKTIF	2025-12-14 08:33:39.692	2025-12-14 08:33:39.692	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx0mf002g35udp7fvgdod	cmj5cxv7e00014iudyynxuvmc
cmj5gx0o3002j35uda0ok0i4j	108026037	FERDIO PUTRA PRASETYA	1970-01-01 00:00:38.431	Jl. Sudirman No. 89	81234567935	example16@cbt.com	AKTIF	2025-12-14 08:33:39.747	2025-12-14 08:33:39.747	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx0nz002i35udbi0v5c4g	cmj5cxv7e00014iudyynxuvmc
cmj5gx0pm002l35udhnyriry6	83278579	FIOLA SEPTIANA RAMADANI	1970-01-01 00:00:38.431	Jl. Sudirman No. 90	81234567936	fiolaseptianaramadani@cbt.com	AKTIF	2025-12-14 08:33:39.802	2025-12-14 08:33:39.802	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx0pi002k35udwebdytrh	cmj5cxv7e00014iudyynxuvmc
cmj5gx0r4002n35ud6i7qxccl	91017410	FIQI ADITIA	1970-01-01 00:00:38.431	Jl. Sudirman No. 91	81234567937	fiqiaditia@cbt.com	AKTIF	2025-12-14 08:33:39.855	2025-12-14 08:33:39.855	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx0r0002m35udzu8e92kf	cmj5cxv7e00014iudyynxuvmc
cmj5gx0sm002p35udzxd3mus1	73255473	FITRIANA EKA AMELIA	1970-01-01 00:00:38.431	Jl. Sudirman No. 92	81234567938	fitrianaekaamelia@cbt.com	AKTIF	2025-12-14 08:33:39.91	2025-12-14 08:33:39.91	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx0si002o35ud2jnff2tj	cmj5cxv7e00014iudyynxuvmc
cmj5gx0u3002r35udqkenscl3	81943244	HERNANDA WILDAN FIRDAUSI	1970-01-01 00:00:38.431	Jl. Sudirman No. 93	81234567939	hernandawildanfirdausi@cbt.com	AKTIF	2025-12-14 08:33:39.962	2025-12-14 08:33:39.962	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx0tz002q35udykvj7rwf	cmj5cxv7e00014iudyynxuvmc
cmj5gx0vl002t35udzzptrcos	91150081	HUMAM FAUZI YANTO	1970-01-01 00:00:38.431	Jl. Sudirman No. 94	81234567940	example7@cbt.com	AKTIF	2025-12-14 08:33:40.017	2025-12-14 08:33:40.017	\N	cmj5eca0w0006jsud9bca11b3	cmj5gx0vh002s35udu1n8yl9k	cmj5cxv7e00014iudyynxuvmc
cmj5gx0x4002v35udz7qohe6d	82276835	ICHA JUWITA	1970-01-01 00:00:38.431	Jl. Sudirman No. 95	81234567941	ichajuwita@cbt.com	AKTIF	2025-12-14 08:33:40.072	2025-12-14 08:33:40.072	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx0x0002u35udc7ccpufd	cmj5cxv7e00014iudyynxuvmc
cmj5gx0ym002x35udzhcjnau4	83877893	INA AZRIANA DEVI	1970-01-01 00:00:38.431	Jl. Sudirman No. 96	81234567942	inaazrianadevi@cbt.com	AKTIF	2025-12-14 08:33:40.125	2025-12-14 08:33:40.125	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx0yj002w35ud8v9qi589	cmj5cxv7e00014iudyynxuvmc
cmj5gx103002z35udn2m30zv3	3083956550	INTAN BALQIS HUMAIRO	1970-01-01 00:00:38.431	Jl. Sudirman No. 97	81234567943	intanbalqishumairo@cbt.com	AKTIF	2025-12-14 08:33:40.178	2025-12-14 08:33:40.178	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx100002y35udilmg1ny8	cmj5cxv7e00014iudyynxuvmc
cmj5gx11k003135ud73cds1fi	93398824	JENI EKA NURSABELA	1970-01-01 00:00:38.431	Jl. Sudirman No. 98	81234567944	jeniekanursabela@cbt.com	AKTIF	2025-12-14 08:33:40.232	2025-12-14 08:33:40.232	\N	cmj5ec9zx0001jsud5cnf1k74	cmj5gx11g003035ud3bx82k5d	cmj5cxv7e00014iudyynxuvmc
cmj5gx131003335ud6cxmwwir	27420464	JESEN ARDIYANTO	1970-01-01 00:00:38.431	Jl. Sudirman No. 99	81234567945	jesenardiyanto@cbt.com	AKTIF	2025-12-14 08:33:40.285	2025-12-14 08:33:40.285	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx12x003235udw6jxtx4r	cmj5cxv7e00014iudyynxuvmc
cmj5gx14k003535udo7rhjcnp	71482878	JESIKA MARTA AL-ZAHRA	1970-01-01 00:00:38.431	Jl. Sudirman No. 100	81234567946	jesikamartaal-zahra@cbt.com	AKTIF	2025-12-14 08:33:40.339	2025-12-14 08:33:40.339	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx14g003435ud6w8b4goi	cmj5cxv7e00014iudyynxuvmc
cmj5gx162003735ud5de1cxbc	84405603	JOSHUA BAGUS NUGROHO	1970-01-01 00:00:38.431	Jl. Sudirman No. 101	81234567947	joshuabagusnugroho@cbt.com	AKTIF	2025-12-14 08:33:40.394	2025-12-14 08:33:40.394	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx15y003635udfzfvsnsn	cmj5cxv7e00014iudyynxuvmc
cmj5gx17k003935udaewx76ro	98437959	KETUT DIMAS MUHAMAD RISAL	1970-01-01 00:00:38.431	Jl. Sudirman No. 102	81234567948	example17@cbt.com	AKTIF	2025-12-14 08:33:40.447	2025-12-14 08:33:40.447	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx17g003835uduzmy772u	cmj5cxv7e00014iudyynxuvmc
cmj5gx193003b35udn6l73ohj	3102507572	KEVIN MAULANA ISHAQ	1970-01-01 00:00:38.431	Jl. Sudirman No. 103	81234567949	example8@cbt.com	AKTIF	2025-12-14 08:33:40.503	2025-12-14 08:33:40.503	\N	cmj5eca0w0006jsud9bca11b3	cmj5gx18z003a35udlra3qj4l	cmj5cxv7e00014iudyynxuvmc
cmj5gx1al003d35udbg9vhv2a	72745125	KHAIRUL RIZAL FAUZI TUKIMIN	1970-01-01 00:00:38.431	Jl. Sudirman No. 104	81234567950	khairulrizalfauzitukimin@cbt.com	AKTIF	2025-12-14 08:33:40.557	2025-12-14 08:33:40.557	\N	cmj5eca170008jsudb4r1h58n	cmj5gx1ai003c35udrndkgaz9	cmj5cxv7e00014iudyynxuvmc
cmj5gx1c3003f35udp6zso1o3	76188634	KHALUD SAIFUL ANWAR	1970-01-01 00:00:38.431	Jl. Sudirman No. 105	81234567951	khaludsaifulanwar@cbt.com	AKTIF	2025-12-14 08:33:40.61	2025-12-14 08:33:40.61	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx1bz003e35udkcmtj455	cmj5cxv7e00014iudyynxuvmc
cmj5gx1dj003h35udb14ouf8y	82219934	LIANA RANTIKA PUTRI	1970-01-01 00:00:38.431	Jl. Sudirman No. 106	81234567952	lianarantikaputri@cbt.com	AKTIF	2025-12-14 08:33:40.663	2025-12-14 08:33:40.663	\N	cmj5ec9zx0001jsud5cnf1k74	cmj5gx1dg003g35udnuykpero	cmj5cxv7e00014iudyynxuvmc
cmj5gx1f1003j35udutcxv8c7	81662471	LIVIAN AYUNING UTAMI	1970-01-01 00:00:38.431	Jl. Sudirman No. 107	81234567953	livianayuningutami@cbt.com	AKTIF	2025-12-14 08:33:40.717	2025-12-14 08:33:40.717	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx1ex003i35ud2tmr6ezm	cmj5cxv7e00014iudyynxuvmc
cmj5gx1gj003l35udh98cts8w	94280655	LUCKY ADITYA PRATAMA	1970-01-01 00:00:38.431	Jl. Sudirman No. 108	81234567954	luckyadityapratama@cbt.com	AKTIF	2025-12-14 08:33:40.77	2025-12-14 08:33:40.77	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx1gf003k35udqn4te1zt	cmj5cxv7e00014iudyynxuvmc
cmj5gx1i0003n35udv6gnc1l1	67491019	LUKMAN AFANDI	1970-01-01 00:00:38.431	Jl. Sudirman No. 109	81234567955	lukmanafandi@cbt.com	AKTIF	2025-12-14 08:33:40.824	2025-12-14 08:33:40.824	\N	cmj5eca170008jsudb4r1h58n	cmj5gx1hw003m35udhjaaqojj	cmj5cxv7e00014iudyynxuvmc
cmj5gx1ji003p35udxuz53ke6	3088988176	M. BAGAS SANTOSO	1970-01-01 00:00:38.431	Jl. Sudirman No. 110	81234567956	mbagassantoso@cbt.com	AKTIF	2025-12-14 08:33:40.878	2025-12-14 08:33:40.878	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx1je003o35udc4kp1c2m	cmj5cxv7e00014iudyynxuvmc
cmj5gx1l1003r35udz4zykbfo	3088352964	M. BAGUS SATRIO	1970-01-01 00:00:38.431	Jl. Sudirman No. 111	81234567957	mbagussatrio@cbt.com	AKTIF	2025-12-14 08:33:40.933	2025-12-14 08:33:40.933	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx1kx003q35udsvrwk0yg	cmj5cxv7e00014iudyynxuvmc
cmj5gx1mi003t35udec1w0c85	97802751	M. SAIFURROSI	1970-01-01 00:00:38.431	Jl. Sudirman No. 112	81234567958	example9@cbt.com	AKTIF	2025-12-14 08:33:40.986	2025-12-14 08:33:40.986	\N	cmj5eca0w0006jsud9bca11b3	cmj5gx1mf003s35udmkcekzi3	cmj5cxv7e00014iudyynxuvmc
cmj5gx1o2003v35udzn7dj9ls	93234409	M. YUSRON GINANDA	1970-01-01 00:00:38.431	Jl. Sudirman No. 113	81234567959	example18@cbt.com	AKTIF	2025-12-14 08:33:41.041	2025-12-14 08:33:41.041	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx1nx003u35udc8a2l13v	cmj5cxv7e00014iudyynxuvmc
cmj5gx1pk003x35udstmkp6g7	78252676	MARCEL GALIH GINANJAR	1970-01-01 00:00:38.431	Jl. Sudirman No. 114	81234567960	marcelgalihginanjar@cbt.com	AKTIF	2025-12-14 08:33:41.095	2025-12-14 08:33:41.095	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx1pg003w35ud8n0lxpp8	cmj5cxv7e00014iudyynxuvmc
cmj5gx1r2003z35udbet34tx1	81962676	MAZELLO ITO AFRIANZIE	1970-01-01 00:00:38.431	Jl. Sudirman No. 115	81234567961	mazelloitoafrianzie@cbt.com	AKTIF	2025-12-14 08:33:41.15	2025-12-14 08:33:41.15	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx1qy003y35udt05qd1id	cmj5cxv7e00014iudyynxuvmc
cmj5gx1sk004135udexpydl8s	29537229	MINEL ASARI	1970-01-01 00:00:38.431	Jl. Sudirman No. 116	81234567962	minelasari@cbt.com	AKTIF	2025-12-14 08:33:41.204	2025-12-14 08:33:41.204	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx1sg004035udzqsyoalc	cmj5cxv7e00014iudyynxuvmc
cmj5gx1u3004335udkj267fhr	82560328	MOH. AMAR MA'RUF	1970-01-01 00:00:38.431	Jl. Sudirman No. 117	81234567963	example10000@example.com	AKTIF	2025-12-14 08:33:41.258	2025-12-14 08:33:41.258	\N	cmj5eca0w0006jsud9bca11b3	cmj5gx1tz004235udd1rv3ppx	cmj5cxv7e00014iudyynxuvmc
cmj5gx1vm004535udc4l2kzg5	94760422	MOH. BAYU AINURROHMAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 118	81234567964	mohbayuainurrohman@cbt.com	AKTIF	2025-12-14 08:33:41.314	2025-12-14 08:33:41.314	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx1vi004435ud0rdy53xd	cmj5cxv7e00014iudyynxuvmc
cmj5gx1x5004735udoeer6a1p	3093129285	MOH. RADITH MUSTOFA	1970-01-01 00:00:38.431	Jl. Sudirman No. 119	81234567965	example10@cbt.com	AKTIF	2025-12-14 08:33:41.368	2025-12-14 08:33:41.368	\N	cmj5eca0w0006jsud9bca11b3	cmj5gx1x1004635udvhadbran	cmj5cxv7e00014iudyynxuvmc
cmj5gx1yo004935ud3pslwtt1	78005721	MOHAMMAD ZIDAN MAULANA	1970-01-01 00:00:38.431	Jl. Sudirman No. 120	81234567966	mohammadzidanmaulana@cbt.com	AKTIF	2025-12-14 08:33:41.424	2025-12-14 08:33:41.424	\N	cmj5eca170008jsudb4r1h58n	cmj5gx1yk004835ud9hcuxcvr	cmj5cxv7e00014iudyynxuvmc
cmj5gx206004b35uduf215trn	89145134	MUHAMAD RISKI NEO VALENTINO	1970-01-01 00:00:38.431	Jl. Sudirman No. 121	81234567967	example19@cbt.com	AKTIF	2025-12-14 08:33:41.477	2025-12-14 08:33:41.477	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx202004a35uditlzqygw	cmj5cxv7e00014iudyynxuvmc
cmj5gx21o004d35udxjptvn08	119631620	MUHAMMAD RIZKI	1970-01-01 00:00:38.431	Jl. Sudirman No. 122	81234567968	example20@cbt.com	AKTIF	2025-12-14 08:33:41.532	2025-12-14 08:33:41.532	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx21k004c35udlo92ywg1	cmj5cxv7e00014iudyynxuvmc
cmj5gx234004f35udt3s4ka40	101593710	MUHAMMAD ZAINAL ABIDIN	1970-01-01 00:00:38.431	Jl. Sudirman No. 123	81234567969	example11@cbt.com	AKTIF	2025-12-14 08:33:41.584	2025-12-14 08:33:41.584	\N	cmj5eca0w0006jsud9bca11b3	cmj5gx231004e35udeisgbcya	cmj5cxv7e00014iudyynxuvmc
cmj5gx24m004h35udvyljawbl	83159381	NADIATUZZAHROH	1970-01-01 00:00:38.431	Jl. Sudirman No. 124	81234567970	nadiatuzzahroh@cbt.com	AKTIF	2025-12-14 08:33:41.637	2025-12-14 08:33:41.637	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx24i004g35udt6qrnb7l	cmj5cxv7e00014iudyynxuvmc
cmj5gx264004j35ud8hnkcdnj	95829771	NAUFAL DZAKI HANIF ABIYYI	1970-01-01 00:00:38.431	Jl. Sudirman No. 125	81234567971	example21@cbt.com	AKTIF	2025-12-14 08:33:41.691	2025-12-14 08:33:41.691	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx260004i35udriuw72oc	cmj5cxv7e00014iudyynxuvmc
cmj5gx27k004l35udp3ylddi4	74347595	NAYSILA NADINE CEYSEANA	1970-01-01 00:00:38.431	Jl. Sudirman No. 126	81234567972	naysilanadineceyseana@cbt.com	AKTIF	2025-12-14 08:33:41.744	2025-12-14 08:33:41.744	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx27h004k35udvdyo2fwy	cmj5cxv7e00014iudyynxuvmc
cmj5gx292004n35ud17iskv1j	89544490	NOUVAL YURI SAPUTRA	1970-01-01 00:00:38.431	Jl. Sudirman No. 127	81234567973	nouvalyurisaputra@cbt.com	AKTIF	2025-12-14 08:33:41.796	2025-12-14 08:33:41.796	\N	cmj5eca170008jsudb4r1h58n	cmj5gx28x004m35udws9r11al	cmj5cxv7e00014iudyynxuvmc
cmj5gx2ak004p35udjg0jhfie	79295893	NUKE KUSUMA WARDANI	1970-01-01 00:00:38.431	Jl. Sudirman No. 128	81234567974	nukekusumawardani@cbt.com	AKTIF	2025-12-14 08:33:41.852	2025-12-14 08:33:41.852	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx2ag004o35udqr0i50ow	cmj5cxv7e00014iudyynxuvmc
cmj5gx2c1004r35udtqywx9eq	78151631	NURHASAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 129	81234567975	example27@cbt.com	AKTIF	2025-12-14 08:33:41.905	2025-12-14 08:33:41.905	\N	cmj5ec9zf0000jsudgpxci2hf	cmj5gx2bx004q35udncso3x1e	cmj5cxv7e00014iudyynxuvmc
cmj5gx2dj004t35udiz37sd6e	65243793	PHILIPUS JAYA BALAN RAKASIWI	1970-01-01 00:00:38.431	Jl. Sudirman No. 130	81234567976	philipusjayabalanrakasiwi@cbt.com	AKTIF	2025-12-14 08:33:41.958	2025-12-14 08:33:41.958	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx2dg004s35udfhoy10rz	cmj5cxv7e00014iudyynxuvmc
cmj5gx2f2004v35udq20lwbo0	78440641	RAHMAD FIRMANSYAH	1970-01-01 00:00:38.431	Jl. Sudirman No. 131	81234567977	rahmadfirmansyah@cbt.com	AKTIF	2025-12-14 08:33:42.013	2025-12-14 08:33:42.013	\N	cmj5eca170008jsudb4r1h58n	cmj5gx2ey004u35udtxb4t3ri	cmj5cxv7e00014iudyynxuvmc
cmj5gx2gi004x35ud0wei40by	81034228	RAVADAL ADHA	1970-01-01 00:00:38.431	Jl. Sudirman No. 132	81234567978	ravadaladha@cbt.com	AKTIF	2025-12-14 08:33:42.066	2025-12-14 08:33:42.066	\N	cmj5ec9zx0001jsud5cnf1k74	cmj5gx2gf004w35udlkyaly82	cmj5cxv7e00014iudyynxuvmc
cmj5gx2i0004z35udecgz1nlq	99114829	RAZKY GABRIL WAHYUDI	1970-01-01 00:00:38.431	Jl. Sudirman No. 133	81234567979	example22@cbt.com	AKTIF	2025-12-14 08:33:42.119	2025-12-14 08:33:42.119	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx2hw004y35udh3y17ie4	cmj5cxv7e00014iudyynxuvmc
cmj5gx2jh005135udtbcxbtb9	71528590	REZY ANGGARA BAHARI	1970-01-01 00:00:38.431	Jl. Sudirman No. 134	81234567980	rezyanggarabahari@cbt.com	AKTIF	2025-12-14 08:33:42.172	2025-12-14 08:33:42.172	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx2jd005035udyuohrs2j	cmj5cxv7e00014iudyynxuvmc
cmj5gx2kx005335udc4757qsp	98069279	RIDHO IRWANSYAH	1970-01-01 00:00:38.431	Jl. Sudirman No. 135	81234567981	ridhoirwansyah@cbt.com	AKTIF	2025-12-14 08:33:42.225	2025-12-14 08:33:42.225	\N	cmj5eca0k0004jsuddjewnal1	cmj5gx2ku005235udqtgs17js	cmj5cxv7e00014iudyynxuvmc
cmj5gx2mh005535ud6oic8o1p	82598502	RIVA ADITYA PUTRA	1970-01-01 00:00:38.431	Jl. Sudirman No. 136	81234567982	rivaadityaputra@cbt.com	AKTIF	2025-12-14 08:33:42.28	2025-12-14 08:33:42.28	\N	cmj5eca130007jsudvzwt5rjx	cmj5gx2mc005435udz2z1c0tg	cmj5cxv7e00014iudyynxuvmc
cmj5gx2ny005735udgqgfno56	109444333	RIZKY WIDODO	1970-01-01 00:00:38.431	Jl. Sudirman No. 137	81234567983	example23@cbt.com	AKTIF	2025-12-14 08:33:42.334	2025-12-14 08:33:42.334	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx2nv005635udhkikfx5c	cmj5cxv7e00014iudyynxuvmc
cmj5gx2ph005935udv1g8ipeb	77627927	SEPTIA IRFAN RAMADHAN	1970-01-01 00:00:38.431	Jl. Sudirman No. 138	81234567984	septiairfanramadhan@cbt.com	AKTIF	2025-12-14 08:33:42.388	2025-12-14 08:33:42.388	\N	cmj5eca170008jsudb4r1h58n	cmj5gx2pd005835udp1ug0523	cmj5cxv7e00014iudyynxuvmc
cmj5gx2qz005b35ud4370ott0	113396361	SUPRIYADI	1970-01-01 00:00:38.431	Jl. Sudirman No. 139	81234567985	example24@cbt.com	AKTIF	2025-12-14 08:33:42.443	2025-12-14 08:33:42.443	\N	cmj5eca0e0003jsud1uxj50o4	cmj5gx2qv005a35ud9ybz7pdt	cmj5cxv7e00014iudyynxuvmc
cmj5gx2sg005d35udvqbnlkoz	86217954	TESYA HERLIANA	1970-01-01 00:00:38.431	Jl. Sudirman No. 140	81234567986	tesyaherliana@cbt.com	AKTIF	2025-12-14 08:33:42.496	2025-12-14 08:33:42.496	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx2sd005c35udyl3o8dav	cmj5cxv7e00014iudyynxuvmc
cmj5gx2u0005f35udktuxz1uv	75001728	WISNU MAULANA	1970-01-01 00:00:38.431	Jl. Sudirman No. 141	81234567987	wisnumaulana@cbt.com	AKTIF	2025-12-14 08:33:42.551	2025-12-14 08:33:42.551	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx2tv005e35udpkauz4m3	cmj5cxv7e00014iudyynxuvmc
cmj5gx2vh005h35udn702xrb0	83757487	WULAN FEBRIYANTI	1970-01-01 00:00:38.431	Jl. Sudirman No. 142	81234567988	wulanfebriyanti@cbt.com	AKTIF	2025-12-14 08:33:42.605	2025-12-14 08:33:42.605	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx2vd005g35udsfcg75mb	cmj5cxv7e00014iudyynxuvmc
cmj5gx2wz005j35ud2ivwa2j0	88579651	YEHEZKIEL KEVIN RAHARJO	1970-01-01 00:00:38.431	Jl. Sudirman No. 143	81234567989	yehezkielkevinraharjo@cbt.com	AKTIF	2025-12-14 08:33:42.658	2025-12-14 08:33:42.658	\N	cmj5eca0o0005jsud0ambwla7	cmj5gx2ww005i35udmbp9bp8d	cmj5cxv7e00014iudyynxuvmc
cmj5gx2yi005l35udcr748bi3	79467322	YOHANES DWI PRAYOGA	1970-01-01 00:00:38.431	Jl. Sudirman No. 144	81234567990	yohanesdwiprayoga@cbt.com	AKTIF	2025-12-14 08:33:42.713	2025-12-14 08:33:42.713	\N	cmj5eca170008jsudb4r1h58n	cmj5gx2ye005k35ud0lbk4bs6	cmj5cxv7e00014iudyynxuvmc
cmj5gx2zz005n35udbo6v7qv9	97561362	YUDA WIRASA	1970-01-01 00:00:38.431	Jl. Sudirman No. 145	81234567991	example28@cbt.com	AKTIF	2025-12-14 08:33:42.766	2025-12-14 08:33:42.766	\N	cmj5ec9zf0000jsudgpxci2hf	cmj5gx2zv005m35ud2aj2o8s7	cmj5cxv7e00014iudyynxuvmc
cmj5gx31i005p35ud17ebh91g	71347347	YULI YATIMAH	1970-01-01 00:00:38.431	Jl. Sudirman No. 146	81234567992	yuliyatimah@cbt.com	AKTIF	2025-12-14 08:33:42.821	2025-12-14 08:33:42.821	\N	cmj5eca050002jsudq5rc3oa3	cmj5gx31d005o35udqv3tt8vd	cmj5cxv7e00014iudyynxuvmc
\.


--
-- Data for Name: SiswaKelasHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SiswaKelasHistory" (id, "siswaId", "kelasId", "tahunAjaranId", "tanggalMulai", "tanggalSelesai", status, catatan, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TahunAjaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TahunAjaran" (id, tahun, semester, "tanggalMulai", "tanggalSelesai", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
2dc90346-c402-420f-a4ab-2f29072e94cd	2024/2025	1	2024-07-01 00:00:00	2024-12-31 00:00:00	SELESAI	2025-12-14 06:31:18.894	2025-12-14 07:30:47.868	\N
cmj5cxv7e00014iudyynxuvmc	2025/2026	1	2025-12-16 00:00:00	2026-02-19 00:00:00	AKTIF	2025-12-14 06:42:20.858	2025-12-14 07:30:47.875	\N
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
cmj5gx04c001s35udal7y6kqp	example26@cbt.com	DESY MUSTIKA MAYA SARI	2025-12-14 08:33:39.036	2025-12-14 08:33:39.036	$2b$10$3jQRaSnP98o8PW5gvylwS.jWEtKhUduhoi.mhyGyHB85ps8f.SKYm	SISWA
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
\.


--
-- Name: Attendance Attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY (id);


--
-- Name: Guru Guru_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guru"
    ADD CONSTRAINT "Guru_pkey" PRIMARY KEY (id);


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
-- Name: Jurusan_kode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Jurusan_kode_key" ON public."Jurusan" USING btree (kode);


--
-- Name: MataPelajaran_kode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MataPelajaran_kode_key" ON public."MataPelajaran" USING btree (kode);


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
-- Name: TahunAjaran_tahun_semester_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TahunAjaran_tahun_semester_key" ON public."TahunAjaran" USING btree (tahun, semester);


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
-- Name: Guru Guru_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Guru"
    ADD CONSTRAINT "Guru_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


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

\unrestrict ie1kGdOgcCmd6fbHpvLqy8swezN3HfYzXLe5deHGdzuuCZuhHpDZEwh488SpAE0

