--
-- PostgreSQL database dump
--

\restrict p0fI5nPa3f8Q5zjAdf02sWjM6cE0KD960ZXllDTZFR322SP36rUPGdkTIFdfbcT

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
    'MAGANG',
    'PINDAH',
    'ALUMNI'
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
    "tahunAjaranId" text NOT NULL,
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
    "userId" text
);


ALTER TABLE public."Siswa" OWNER TO postgres;

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
-- Data for Name: Guru; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") FROM stdin;
\.


--
-- Data for Name: Jurusan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Jurusan" (id, kode, nama, deskripsi, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmj2syqsn0000oqi0bqjngdsz	AK	Akuntansi	\N	2025-12-12 11:47:37.127	2025-12-12 11:47:37.127	\N
cmj2sz28x0001oqi0v7eu44h0	TKJ	Teknik Komputer dan Jaringan	\N	2025-12-12 11:47:51.969	2025-12-12 11:47:51.969	\N
cmj2sz9x10002oqi0t52not0j	TKR	Teknik Kendaraan Ringan	\N	2025-12-12 11:48:01.909	2025-12-12 11:48:01.909	\N
\.


--
-- Data for Name: Kelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "tahunAjaranId", "waliKelasId", "jurusanId") FROM stdin;
cmj4d91oo00bl7yi0hp2pdna7	XII TKJ	XII	30	2025-12-13 14:03:16.296	2025-12-13 14:06:15.319	\N	cmj30obk60000nyi0d2cbh0g0	\N	cmj2sz28x0001oqi0v7eu44h0
cmj4d5zz600bg7yi0mzv0geb6	X AK	X	30	2025-12-13 14:00:54.114	2025-12-13 14:00:54.114	\N	cmj30obk60000nyi0d2cbh0g0	\N	cmj2syqsn0000oqi0bqjngdsz
cmj4d867h00bi7yi06tgfiuci	XII AK	XII	30	2025-12-13 14:02:35.5	2025-12-13 14:02:35.5	\N	cmj30obk60000nyi0d2cbh0g0	\N	cmj2syqsn0000oqi0bqjngdsz
cmj4d7vdl00bh7yi0sh0tye2g	XI AK	XI	30	2025-12-13 14:02:21.465	2025-12-13 14:02:40.973	\N	cmj30obk60000nyi0d2cbh0g0	\N	cmj2syqsn0000oqi0bqjngdsz
cmj4d8kv400bj7yi00ujftazo	X TKJ	X	30	2025-12-13 14:02:54.496	2025-12-13 14:02:54.496	\N	cmj30obk60000nyi0d2cbh0g0	\N	cmj2sz28x0001oqi0v7eu44h0
cmj4d8tyx00bk7yi0voaq9xy2	XI TKJ	XI	30	2025-12-13 14:03:06.297	2025-12-13 14:03:06.297	\N	cmj30obk60000nyi0d2cbh0g0	\N	cmj2sz28x0001oqi0v7eu44h0
cmj4d9dbb00bm7yi0kqp0zoxs	X TKR	X	30	2025-12-13 14:03:31.367	2025-12-13 14:03:31.367	\N	cmj30obk60000nyi0d2cbh0g0	\N	cmj2sz9x10002oqi0t52not0j
cmj4d9lfa00bn7yi0ovesrwcj	XI TKR	XI	30	2025-12-13 14:03:41.878	2025-12-13 14:04:33.877	\N	cmj30obk60000nyi0d2cbh0g0	\N	cmj2sz9x10002oqi0t52not0j
cmj4d9txt00bo7yi0cx6go8jq	XII TKR	XII	30	2025-12-13 14:03:52.913	2025-12-13 14:04:38.349	\N	cmj30obk60000nyi0d2cbh0g0	\N	cmj2sz9x10002oqi0t52not0j
\.


--
-- Data for Name: MataPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: Siswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId") FROM stdin;
cmj4djzku00n67yi0k09r7d26	81475874	ABI HARTO WICAKSONO	1970-01-01 00:00:38.431	Situbondo	8123456789	abihartowicaksono@cbt.com	AKTIF	2025-12-13 14:11:46.782	2025-12-13 14:11:46.782	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4djzkn00n57yi0e60qa8hl
cmj4djzmb00n87yi0so2uwejf	95805399	ADAM SYAHREZA GUMILANG	1970-01-01 00:00:38.431	Situbondo	8123456789	adamsyahrezagumilang@cbt.com	AKTIF	2025-12-13 14:11:46.834	2025-12-13 14:11:46.834	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4djzm700n77yi0ayhugouo
cmj4djznr00na7yi01o6gp9mj	3088037976	ADITIYA RIZKY BAYU PRADIKA	1970-01-01 00:00:38.431	Situbondo	8123456789	aditiyarizkybayupradika@cbt.com	AKTIF	2025-12-13 14:11:46.887	2025-12-13 14:11:46.887	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4djzno00n97yi0k6olgvpb
cmj4djzp600nc7yi06imxzbzi	84194598	ADITYA CATUR PRAYOGO	1970-01-01 00:00:38.431	Situbondo	8123456789	adityacaturprayogo@cbt.com	AKTIF	2025-12-13 14:11:46.938	2025-12-13 14:11:46.938	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4djzp400nb7yi0tmitn3ku
cmj4djzql00ne7yi07jqj5nys	108737154	ADITYA DAMARA PUTRA KRISTIAWAN	1970-01-01 00:00:38.431	Situbondo	8123456789	example12@cbt.com	AKTIF	2025-12-13 14:11:46.989	2025-12-13 14:11:46.989	\N	cmj4d8kv400bj7yi00ujftazo	cmj4djzqi00nd7yi0oxqzuj2o
cmj4djzs000ng7yi0gm9ydf1v	76544902	ADRIANO DWI PRADHITA	1970-01-01 00:00:38.431	Situbondo	8123456789	adrianodwipradhita@cbt.com	AKTIF	2025-12-13 14:11:47.04	2025-12-13 14:11:47.04	\N	cmj4d9txt00bo7yi0cx6go8jq	cmj4djzrx00nf7yi0gmqosiz1
cmj4djztf00ni7yi0oljplvqe	77382296	AGUNG TRISNA DEWI	1970-01-01 00:00:38.431	Situbondo	8123456789	agungtrisnadewi@cbt.com	AKTIF	2025-12-13 14:11:47.091	2025-12-13 14:11:47.091	\N	cmj4d867h00bi7yi06tgfiuci	cmj4djztd00nh7yi0isomfof5
cmj4djzuw00nk7yi0sjsz4vuq	86881070	AGUS WIRA ADI PURNOMO	1970-01-01 00:00:38.431	Situbondo	8123456789	aguswiraadipurnomo@cbt.com	AKTIF	2025-12-13 14:11:47.143	2025-12-13 14:11:47.143	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4djzut00nj7yi0rkt707d4
cmj4djzwb00nm7yi0dss8lbky	99461767	AHMAD DIMAS KURNIAWAN	1970-01-01 00:00:38.431	Situbondo	8123456789	example1@cbt.com	AKTIF	2025-12-13 14:11:47.194	2025-12-13 14:11:47.194	\N	cmj4d9dbb00bm7yi0kqp0zoxs	cmj4djzw800nl7yi05wzhngwv
cmj4djzxq00no7yi0of9o9obw	86817502	AHMAD RIAN ZUHRI AFANDI	1970-01-01 00:00:38.431	Situbondo	8123456789	ahmadrianzuhriafandi@cbt.com	AKTIF	2025-12-13 14:11:47.245	2025-12-13 14:11:47.245	\N	cmj4d9txt00bo7yi0cx6go8jq	cmj4djzxn00nn7yi0wg4m7o8o
cmj4djzz500nq7yi0uboi6cbv	99396650	AINO YOEL	1970-01-01 00:00:38.431	Situbondo	8123456789	example2@cbt.com	AKTIF	2025-12-13 14:11:47.297	2025-12-13 14:11:47.297	\N	cmj4d9dbb00bm7yi0kqp0zoxs	cmj4djzz300np7yi0fnjjzv2t
cmj4dk00k00ns7yi0vhrcze2b	50397766	AINUR ROHMAH	1970-01-01 00:00:38.431	Situbondo	8123456789	ainurrohmah@cbt.com	AKTIF	2025-12-13 14:11:47.348	2025-12-13 14:11:47.348	\N	cmj4d7vdl00bh7yi0sh0tye2g	cmj4dk00i00nr7yi0u673k9qt
cmj4dk02000nu7yi0yvw7g7b8	79686226	ALDI PRAYATNA	1970-01-01 00:00:38.431	Situbondo	8123456789	aldiprayatna@cbt.com	AKTIF	2025-12-13 14:11:47.399	2025-12-13 14:11:47.399	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4dk01x00nt7yi0qhshefp9
cmj4dk03h00nw7yi0h722ypif	57279011	ALDO ILFAN PRATAMA	1970-01-01 00:00:38.431	Situbondo	8123456789	aldoilfanpratama@cbt.com	AKTIF	2025-12-13 14:11:47.453	2025-12-13 14:11:47.453	\N	cmj4d9txt00bo7yi0cx6go8jq	cmj4dk03e00nv7yi0ztnmk0kp
cmj4dk04w00ny7yi0xmt21wel	78367595	ALFA TRI EFENDI	1970-01-01 00:00:38.431	Situbondo	8123456789	alfatriefendi@cbt.com	AKTIF	2025-12-13 14:11:47.504	2025-12-13 14:11:47.504	\N	cmj4d9txt00bo7yi0cx6go8jq	cmj4dk04u00nx7yi07hx0b2r1
cmj4dk06b00o07yi0xg9va4ym	97678393	ALFAZA OKTAVINO PRADITIA	1970-01-01 00:00:38.431	Situbondo	8123456789	example13@cbt.com	AKTIF	2025-12-13 14:11:47.555	2025-12-13 14:11:47.555	\N	cmj4d8kv400bj7yi00ujftazo	cmj4dk06900nz7yi01b0iakh4
cmj4dk07r00o27yi0bfwvwvjb	97759070	ALIFATUR ROSIKIN	1970-01-01 00:00:38.431	Situbondo	8123456789	alifaturrosikin@cbt.com	AKTIF	2025-12-13 14:11:47.606	2025-12-13 14:11:47.606	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk07o00o17yi0o3x3wd3a
cmj4dk09600o47yi0zz6n60yl	85609468	AMELIA DEWI SINTA	1970-01-01 00:00:38.431	Situbondo	8123456789	ameliadewisinta@cbt.com	AKTIF	2025-12-13 14:11:47.658	2025-12-13 14:11:47.658	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk09400o37yi0l8juaxow
cmj4dk0al00o67yi0sz94gcl1	94461900	ANANDA MAYCKO WIJAYA	1970-01-01 00:00:38.431	Situbondo	8123456789	example3@cbt.com	AKTIF	2025-12-13 14:11:47.709	2025-12-13 14:11:47.709	\N	cmj4d9dbb00bm7yi0kqp0zoxs	cmj4dk0ai00o57yi0ccnr0zl8
cmj4dk0c000o87yi01gpf15u2	88279036	ANDHIKA BAYU SAPUTRA	1970-01-01 00:00:38.431	Situbondo	8123456789	andhikabayusaputra@cbt.com	AKTIF	2025-12-13 14:11:47.76	2025-12-13 14:11:47.76	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk0bx00o77yi0imiqs5jg
cmj4dk0df00oa7yi0kd63j0u6	104207471	ANGGA CAHYO PRATAMA	1970-01-01 00:00:38.431	Situbondo	8123456789	example4@cbt.com	AKTIF	2025-12-13 14:11:47.81	2025-12-13 14:11:47.81	\N	cmj4d9dbb00bm7yi0kqp0zoxs	cmj4dk0dc00o97yi02qmupqdg
cmj4dk0eu00oc7yi0kitaqmdp	87785971	ANGGI VIRNANDA PUTRI	1970-01-01 00:00:38.431	Situbondo	8123456789	anggivirnandaputri@cbt.com	AKTIF	2025-12-13 14:11:47.861	2025-12-13 14:11:47.861	\N	cmj4d7vdl00bh7yi0sh0tye2g	cmj4dk0er00ob7yi01e5xt6vq
cmj4dk0g900oe7yi08fhm1vti	3080015591	AWANG SETIAWAN	1970-01-01 00:00:38.431	Situbondo	8123456789	awangsetiawan@cbt.com	AKTIF	2025-12-13 14:11:47.912	2025-12-13 14:11:47.912	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk0g600od7yi0uj89iia2
cmj4dk0hp00og7yi0xq4g3ykq	95325705	AYUNI ARIMBI	1970-01-01 00:00:38.431	Situbondo	8123456789	example25@cbt.com	AKTIF	2025-12-13 14:11:47.965	2025-12-13 14:11:47.965	\N	cmj4d5zz600bg7yi0mzv0geb6	cmj4dk0hm00of7yi0bme716h2
cmj4dk0j500oi7yi0k11x8caf	88137615	AZAI DENIS SAFARULLAH	1970-01-01 00:00:38.431	Situbondo	8123456789	example5@cbt.com	AKTIF	2025-12-13 14:11:48.017	2025-12-13 14:11:48.017	\N	cmj4d9dbb00bm7yi0kqp0zoxs	cmj4dk0j200oh7yi09es3zb4i
cmj4dk0kk00ok7yi0tu2xro7u	99940723	BADRIA NUR ANISA	1970-01-01 00:00:38.431	Situbondo	8123456789	example14@cbt.com	AKTIF	2025-12-13 14:11:48.067	2025-12-13 14:11:48.067	\N	cmj4d8kv400bj7yi00ujftazo	cmj4dk0kh00oj7yi0d8m7ge97
cmj4dk0ly00om7yi0opz7pyza	85744170	BAGUS SETIAWAN	1970-01-01 00:00:38.431	Situbondo	8123456789	bagussetiawan@cbt.com	AKTIF	2025-12-13 14:11:48.118	2025-12-13 14:11:48.118	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk0lv00ol7yi0ad1qhv9b
cmj4dk0ne00oo7yi020rit839	3096187956	CANDRA PRATAMA	1970-01-01 00:00:38.431	Situbondo	8123456789	example6@cbt.com	AKTIF	2025-12-13 14:11:48.17	2025-12-13 14:11:48.17	\N	cmj4d9dbb00bm7yi0kqp0zoxs	cmj4dk0nb00on7yi0yql2cgbq
cmj4dk0ov00oq7yi0i7ixsfik	69853933	DANU BAGUS PRAYOGO	1970-01-01 00:00:38.431	Situbondo	8123456789	danubagusprayogo@cbt.com	AKTIF	2025-12-13 14:11:48.222	2025-12-13 14:11:48.222	\N	cmj4d9txt00bo7yi0cx6go8jq	cmj4dk0os00op7yi04inbamx6
cmj4dk0qa00os7yi0splfr4h1	3080427888	DAVA PUTRA PRASETYA	1970-01-01 00:00:38.431	Situbondo	8123456789	davaputraprasetya@cbt.com	AKTIF	2025-12-13 14:11:48.274	2025-12-13 14:11:48.274	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk0q700or7yi0x1terot2
cmj4dk0rq00ou7yi03x62bm3v	75360603	DEFI NINGTYAS	1970-01-01 00:00:38.431	Situbondo	8123456789	definingtyas@cbt.com	AKTIF	2025-12-13 14:11:48.325	2025-12-13 14:11:48.325	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4dk0rn00ot7yi0i4jn3114
cmj4dk0t500ow7yi05yn4en0u	86514583	DENDI BAYU PRATAMA	1970-01-01 00:00:38.431	Situbondo	8123456789	dendibayupratama@cbt.com	AKTIF	2025-12-13 14:11:48.377	2025-12-13 14:11:48.377	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk0t200ov7yi0q47gdokk
cmj4dk0w000p07yi0kjcnog5y	71300771	DEWI WAHYUNI	1970-01-01 00:00:38.431	Situbondo	8123456789	dewiwahyuni@cbt.com	AKTIF	2025-12-13 14:11:48.479	2025-12-13 14:11:48.479	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4dk0vx00oz7yi0xs9m4h81
cmj4dk0xf00p27yi0vzivy3mr	74612857	DINA RIZA AYU MATUSSHOLEHA	1970-01-01 00:00:38.431	Situbondo	8123456789	dinarizaayumatussholeha@cbt.com	AKTIF	2025-12-13 14:11:48.531	2025-12-13 14:11:48.531	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk0xd00p17yi0twc9q3lb
cmj4dk0yv00p47yi08yc2gdje	88236354	DINO ABI PRATAMA	1970-01-01 00:00:38.431	Situbondo	8123456789	dinoabipratama@cbt.com	AKTIF	2025-12-13 14:11:48.583	2025-12-13 14:11:48.583	\N	cmj4d8tyx00bk7yi0voaq9xy2	cmj4dk0ys00p37yi0j9shau5s
cmj4dk10d00p67yi0ae1adf74	84607003	DIZA YOGA YUDISTIA	1970-01-01 00:00:38.431	Situbondo	8123456789	dizayogayudistia@cbt.com	AKTIF	2025-12-13 14:11:48.636	2025-12-13 14:11:48.636	\N	cmj4d7vdl00bh7yi0sh0tye2g	cmj4dk10800p57yi01c1b5oha
cmj4dk11t00p87yi08qtnlfpo	108153368	DWI AYU MEI JAYANTI	1970-01-01 00:00:38.431	Situbondo	8123456789	example15@cbt.com	AKTIF	2025-12-13 14:11:48.688	2025-12-13 14:11:48.688	\N	cmj4d8kv400bj7yi00ujftazo	cmj4dk11q00p77yi0vpm8o1nv
cmj4dk13700pa7yi0xxqxzhmv	85947084	DWI SINTIA PUTRI	1970-01-01 00:00:38.431	Situbondo	8123456789	dwisintiaputri@cbt.com	AKTIF	2025-12-13 14:11:48.739	2025-12-13 14:11:48.739	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4dk13500p97yi0vv2qq26m
cmj4dk14n00pc7yi012cfhcbt	83725353	EKA DEVI AINUROHMA	1970-01-01 00:00:38.431	Situbondo	8123456789	ekadeviainurohma@cbt.com	AKTIF	2025-12-13 14:11:48.791	2025-12-13 14:11:48.791	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk14k00pb7yi014gld8av
cmj4dk16300pe7yi0ucmlqlms	24142799	ENGGAR DWI PRASETYO	1970-01-01 00:00:38.431	Situbondo	8123456789	enggardwiprasetyo@cbt.com	AKTIF	2025-12-13 14:11:48.843	2025-12-13 14:11:48.843	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4dk16000pd7yi05v191omk
cmj4dk17j00pg7yi02f085it5	76887989	ESA AGIL PUTRA	1970-01-01 00:00:38.431	Situbondo	8123456789	esaagilputra@cbt.com	AKTIF	2025-12-13 14:11:48.894	2025-12-13 14:11:48.894	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4dk17g00pf7yi0ndgwdhog
cmj4dk18y00pi7yi00p2zr3tt	82535073	FAHMI ADLIYANTO	1970-01-01 00:00:38.431	Situbondo	8123456789	fahmiadliyanto@cbt.com	AKTIF	2025-12-13 14:11:48.945	2025-12-13 14:11:48.945	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk18v00ph7yi0w4r27j4x
cmj4dk1ad00pk7yi0u1vh40k2	3087966253	FAREL ADITYA PUTRA	1970-01-01 00:00:38.431	Situbondo	8123456789	fareladityaputra@cbt.com	AKTIF	2025-12-13 14:11:48.996	2025-12-13 14:11:48.996	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk1aa00pj7yi0zxxpivow
cmj4dk1bt00pm7yi0wpyrn8v1	78956609	FATURROHMAN	1970-01-01 00:00:38.431	Situbondo	8123456789	faturrohman@cbt.com	AKTIF	2025-12-13 14:11:49.048	2025-12-13 14:11:49.048	\N	cmj4d8tyx00bk7yi0voaq9xy2	cmj4dk1bp00pl7yi0dtwipyzo
cmj4dk1d800po7yi0omd305or	108026037	FERDIO PUTRA PRASETYA	1970-01-01 00:00:38.431	Situbondo	8123456789	example16@cbt.com	AKTIF	2025-12-13 14:11:49.099	2025-12-13 14:11:49.099	\N	cmj4d8kv400bj7yi00ujftazo	cmj4dk1d500pn7yi0ezc4q1c7
cmj4dk1en00pq7yi0bjtrc62t	83278579	FIOLA SEPTIANA RAMADANI	1970-01-01 00:00:38.431	Situbondo	8123456789	fiolaseptianaramadani@cbt.com	AKTIF	2025-12-13 14:11:49.15	2025-12-13 14:11:49.15	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk1ek00pp7yi0cqef76n0
cmj4dk1g100ps7yi0r55jebds	91017410	FIQI ADITIA	1970-01-01 00:00:38.431	Situbondo	8123456789	fiqiaditia@cbt.com	AKTIF	2025-12-13 14:11:49.201	2025-12-13 14:11:49.201	\N	cmj4d8tyx00bk7yi0voaq9xy2	cmj4dk1fz00pr7yi0ig87bx34
cmj4dk1hh00pu7yi0udelp53a	73255473	FITRIANA EKA AMELIA	1970-01-01 00:00:38.431	Situbondo	8123456789	fitrianaekaamelia@cbt.com	AKTIF	2025-12-13 14:11:49.252	2025-12-13 14:11:49.252	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk1he00pt7yi0nw3d3ual
cmj4dk1ix00pw7yi0fuajx8tm	81943244	HERNANDA WILDAN FIRDAUSI	1970-01-01 00:00:38.431	Situbondo	8123456789	hernandawildanfirdausi@cbt.com	AKTIF	2025-12-13 14:11:49.304	2025-12-13 14:11:49.304	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk1iu00pv7yi0ibq4sw6g
cmj4dk1ke00py7yi0bufj1s7x	91150081	HUMAM FAUZI YANTO	1970-01-01 00:00:38.431	Situbondo	8123456789	example7@cbt.com	AKTIF	2025-12-13 14:11:49.357	2025-12-13 14:11:49.357	\N	cmj4d9dbb00bm7yi0kqp0zoxs	cmj4dk1ka00px7yi0ix965enz
cmj4dk1lt00q07yi0p2pnupre	82276835	ICHA JUWITA	1970-01-01 00:00:38.431	Situbondo	8123456789	ichajuwita@cbt.com	AKTIF	2025-12-13 14:11:49.409	2025-12-13 14:11:49.409	\N	cmj4d8tyx00bk7yi0voaq9xy2	cmj4dk1lq00pz7yi0coq9zps5
cmj4dk1n800q27yi0075qswfq	83877893	INA AZRIANA DEVI	1970-01-01 00:00:38.431	Situbondo	8123456789	inaazrianadevi@cbt.com	AKTIF	2025-12-13 14:11:49.459	2025-12-13 14:11:49.459	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk1n500q17yi01kvip10i
cmj4dk1om00q47yi0ebtopry5	3083956550	INTAN BALQIS HUMAIRO	1970-01-01 00:00:38.431	Situbondo	8123456789	intanbalqishumairo@cbt.com	AKTIF	2025-12-13 14:11:49.51	2025-12-13 14:11:49.51	\N	cmj4d8tyx00bk7yi0voaq9xy2	cmj4dk1ok00q37yi0yks807qr
cmj4dk1q200q67yi0l6wrmqr3	93398824	JENI EKA NURSABELA	1970-01-01 00:00:38.431	Situbondo	8123456789	jeniekanursabela@cbt.com	AKTIF	2025-12-13 14:11:49.562	2025-12-13 14:11:49.562	\N	cmj4d7vdl00bh7yi0sh0tye2g	cmj4dk1pz00q57yi0icqeg1ut
cmj4dk1ri00q87yi0zmig1xct	27420464	JESEN ARDIYANTO	1970-01-01 00:00:38.431	Situbondo	8123456789	jesenardiyanto@cbt.com	AKTIF	2025-12-13 14:11:49.613	2025-12-13 14:11:49.613	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk1rf00q77yi05rgei2pi
cmj4dk1sy00qa7yi0pama6myv	71482878	JESIKA MARTA AL-ZAHRA	1970-01-01 00:00:38.431	Situbondo	8123456789	jesikamartaal-zahra@cbt.com	AKTIF	2025-12-13 14:11:49.665	2025-12-13 14:11:49.665	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk1sv00q97yi028x7jk9g
cmj4dk1ud00qc7yi0d8z44s7d	84405603	JOSHUA BAGUS NUGROHO	1970-01-01 00:00:38.431	Situbondo	8123456789	joshuabagusnugroho@cbt.com	AKTIF	2025-12-13 14:11:49.717	2025-12-13 14:11:49.717	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4dk1ua00qb7yi0af8m3ucv
cmj4dk1vs00qe7yi0ll9s81ws	98437959	KETUT DIMAS MUHAMAD RISAL	1970-01-01 00:00:38.431	Situbondo	8123456789	example17@cbt.com	AKTIF	2025-12-13 14:11:49.768	2025-12-13 14:11:49.768	\N	cmj4d8kv400bj7yi00ujftazo	cmj4dk1vp00qd7yi0xbby1vhu
cmj4dk1x700qg7yi0j5h46i27	3102507572	KEVIN MAULANA ISHAQ	1970-01-01 00:00:38.431	Situbondo	8123456789	example8@cbt.com	AKTIF	2025-12-13 14:11:49.819	2025-12-13 14:11:49.819	\N	cmj4d9dbb00bm7yi0kqp0zoxs	cmj4dk1x400qf7yi0pkz6tzk5
cmj4dk1ym00qi7yi0eqjng4tq	72745125	KHAIRUL RIZAL FAUZI TUKIMIN	1970-01-01 00:00:38.431	Situbondo	8123456789	khairulrizalfauzitukimin@cbt.com	AKTIF	2025-12-13 14:11:49.87	2025-12-13 14:11:49.87	\N	cmj4d9txt00bo7yi0cx6go8jq	cmj4dk1yk00qh7yi05ai25j5n
cmj4dk20200qk7yi0oaspym4l	76188634	KHALUD SAIFUL ANWAR	1970-01-01 00:00:38.431	Situbondo	8123456789	khaludsaifulanwar@cbt.com	AKTIF	2025-12-13 14:11:49.921	2025-12-13 14:11:49.921	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4dk1zz00qj7yi0m7cs8yc8
cmj4dk21i00qm7yi0ygn3rhbv	82219934	LIANA RANTIKA PUTRI	1970-01-01 00:00:38.431	Situbondo	8123456789	lianarantikaputri@cbt.com	AKTIF	2025-12-13 14:11:49.973	2025-12-13 14:11:49.973	\N	cmj4d7vdl00bh7yi0sh0tye2g	cmj4dk21e00ql7yi0x641al2z
cmj4dk22y00qo7yi0pur40d5u	81662471	LIVIAN AYUNING UTAMI	1970-01-01 00:00:38.431	Situbondo	8123456789	livianayuningutami@cbt.com	AKTIF	2025-12-13 14:11:50.025	2025-12-13 14:11:50.025	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk22v00qn7yi012bf6147
cmj4dk24d00qq7yi0djmqsyas	94280655	LUCKY ADITYA PRATAMA	1970-01-01 00:00:38.431	Situbondo	8123456789	luckyadityapratama@cbt.com	AKTIF	2025-12-13 14:11:50.077	2025-12-13 14:11:50.077	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk24a00qp7yi0y43z9oor
cmj4dk25t00qs7yi0yzon5z59	67491019	LUKMAN AFANDI	1970-01-01 00:00:38.431	Situbondo	8123456789	lukmanafandi@cbt.com	AKTIF	2025-12-13 14:11:50.128	2025-12-13 14:11:50.128	\N	cmj4d9txt00bo7yi0cx6go8jq	cmj4dk25q00qr7yi08ybeyi9y
cmj4dk27700qu7yi044mvab3q	3088988176	M. BAGAS SANTOSO	1970-01-01 00:00:38.431	Situbondo	8123456789	mbagassantoso@cbt.com	AKTIF	2025-12-13 14:11:50.179	2025-12-13 14:11:50.179	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk27500qt7yi01fryn32t
cmj4dk28l00qw7yi0x1eycqvg	3088352964	M. BAGUS SATRIO	1970-01-01 00:00:38.431	Situbondo	8123456789	mbagussatrio@cbt.com	AKTIF	2025-12-13 14:11:50.229	2025-12-13 14:11:50.229	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk28j00qv7yi0f14xcybq
cmj4dk29z00qy7yi0hld0h2el	97802751	M. SAIFURROSI	1970-01-01 00:00:38.431	Situbondo	8123456789	example9@cbt.com	AKTIF	2025-12-13 14:11:50.279	2025-12-13 14:11:50.279	\N	cmj4d9dbb00bm7yi0kqp0zoxs	cmj4dk29x00qx7yi0isz0tn8v
cmj4dk2be00r07yi08t1568su	93234409	M. YUSRON GINANDA	1970-01-01 00:00:38.431	Situbondo	8123456789	example18@cbt.com	AKTIF	2025-12-13 14:11:50.329	2025-12-13 14:11:50.329	\N	cmj4d8kv400bj7yi00ujftazo	cmj4dk2bb00qz7yi0hyebqnwo
cmj4dk2cs00r27yi07dcs8uwh	78252676	MARCEL GALIH GINANJAR	1970-01-01 00:00:38.431	Situbondo	8123456789	marcelgalihginanjar@cbt.com	AKTIF	2025-12-13 14:11:50.38	2025-12-13 14:11:50.38	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk2cp00r17yi0puunqm8f
cmj4dk2e600r47yi03nx8qdek	81962676	MAZELLO ITO AFRIANZIE	1970-01-01 00:00:38.431	Situbondo	8123456789	mazelloitoafrianzie@cbt.com	AKTIF	2025-12-13 14:11:50.43	2025-12-13 14:11:50.43	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4dk2e400r37yi0dwyfx3nd
cmj4dk2fl00r67yi0zekjr4pf	29537229	MINEL ASARI	1970-01-01 00:00:38.431	Situbondo	8123456789	minelasari@cbt.com	AKTIF	2025-12-13 14:11:50.48	2025-12-13 14:11:50.48	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4dk2fi00r57yi01ej00y8z
cmj4dk2h000r87yi09cy9y97u	82560328	MOH. AMAR MA'RUF	1970-01-01 00:00:38.431	Situbondo	8123456789	example10000@example.com	AKTIF	2025-12-13 14:11:50.532	2025-12-13 14:11:50.532	\N	cmj4d9dbb00bm7yi0kqp0zoxs	cmj4dk2gx00r77yi03vamwzbq
cmj4dk2ig00ra7yi0n5kh0ezp	94760422	MOH. BAYU AINURROHMAN	1970-01-01 00:00:38.431	Situbondo	8123456789	mohbayuainurrohman@cbt.com	AKTIF	2025-12-13 14:11:50.584	2025-12-13 14:11:50.584	\N	cmj4d8tyx00bk7yi0voaq9xy2	cmj4dk2id00r97yi012bf69wf
cmj4dk2jw00rc7yi0kutfna12	3093129285	MOH. RADITH MUSTOFA	1970-01-01 00:00:38.431	Situbondo	8123456789	example10@cbt.com	AKTIF	2025-12-13 14:11:50.635	2025-12-13 14:11:50.635	\N	cmj4d9dbb00bm7yi0kqp0zoxs	cmj4dk2jt00rb7yi070nw57xu
cmj4dk2lb00re7yi0g8sx61da	78005721	MOHAMMAD ZIDAN MAULANA	1970-01-01 00:00:38.431	Situbondo	8123456789	mohammadzidanmaulana@cbt.com	AKTIF	2025-12-13 14:11:50.686	2025-12-13 14:11:50.686	\N	cmj4d9txt00bo7yi0cx6go8jq	cmj4dk2l800rd7yi0nwe3gi05
cmj4dk2mq00rg7yi08267ftui	89145134	MUHAMAD RISKI NEO VALENTINO	1970-01-01 00:00:38.431	Situbondo	8123456789	example19@cbt.com	AKTIF	2025-12-13 14:11:50.737	2025-12-13 14:11:50.737	\N	cmj4d8kv400bj7yi00ujftazo	cmj4dk2mn00rf7yi007zkp1v4
cmj4dk2o500ri7yi0tld1ggnv	119631620	MUHAMMAD RIZKI	1970-01-01 00:00:38.431	Situbondo	8123456789	example20@cbt.com	AKTIF	2025-12-13 14:11:50.789	2025-12-13 14:11:50.789	\N	cmj4d8kv400bj7yi00ujftazo	cmj4dk2o200rh7yi01nxd0dhk
cmj4dk2pk00rk7yi02a17b57s	101593710	MUHAMMAD ZAINAL ABIDIN	1970-01-01 00:00:38.431	Situbondo	8123456789	example11@cbt.com	AKTIF	2025-12-13 14:11:50.84	2025-12-13 14:11:50.84	\N	cmj4d9dbb00bm7yi0kqp0zoxs	cmj4dk2pi00rj7yi0h6pdkcv0
cmj4dk2qz00rm7yi0ejtj3tsg	83159381	NADIATUZZAHROH	1970-01-01 00:00:38.431	Situbondo	8123456789	nadiatuzzahroh@cbt.com	AKTIF	2025-12-13 14:11:50.891	2025-12-13 14:11:50.891	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk2qx00rl7yi0xke4l1d5
cmj4dk2sf00ro7yi07hf4zpvd	95829771	NAUFAL DZAKI HANIF ABIYYI	1970-01-01 00:00:38.431	Situbondo	8123456789	example21@cbt.com	AKTIF	2025-12-13 14:11:50.942	2025-12-13 14:11:50.942	\N	cmj4d8kv400bj7yi00ujftazo	cmj4dk2sc00rn7yi0qz4wqdg1
cmj4dk2tu00rq7yi025umz9ga	74347595	NAYSILA NADINE CEYSEANA	1970-01-01 00:00:38.431	Situbondo	8123456789	naysilanadineceyseana@cbt.com	AKTIF	2025-12-13 14:11:50.994	2025-12-13 14:11:50.994	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk2ts00rp7yi0fxogonzg
cmj4dk2v900rs7yi0nnm2qo7z	89544490	NOUVAL YURI SAPUTRA	1970-01-01 00:00:38.431	Situbondo	8123456789	nouvalyurisaputra@cbt.com	AKTIF	2025-12-13 14:11:51.045	2025-12-13 14:11:51.045	\N	cmj4d9txt00bo7yi0cx6go8jq	cmj4dk2v600rr7yi0pw6xbbqy
cmj4dk2wo00ru7yi0ujmi4l0s	79295893	NUKE KUSUMA WARDANI	1970-01-01 00:00:38.431	Situbondo	8123456789	nukekusumawardani@cbt.com	AKTIF	2025-12-13 14:11:51.096	2025-12-13 14:11:51.096	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk2wl00rt7yi0u9vjetf8
cmj4dk2y400rw7yi0xaqgp2ir	78151631	NURHASAN	1970-01-01 00:00:38.431	Situbondo	8123456789	example27@cbt.com	AKTIF	2025-12-13 14:11:51.147	2025-12-13 14:11:51.147	\N	cmj4d5zz600bg7yi0mzv0geb6	cmj4dk2y000rv7yi0a5mcde8m
cmj4dk2zj00ry7yi0nuykx6t1	65243793	PHILIPUS JAYA BALAN RAKASIWI	1970-01-01 00:00:38.431	Situbondo	8123456789	philipusjayabalanrakasiwi@cbt.com	AKTIF	2025-12-13 14:11:51.198	2025-12-13 14:11:51.198	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk2zg00rx7yi0305dq46p
cmj4dk30x00s07yi0ctq150ql	78440641	RAHMAD FIRMANSYAH	1970-01-01 00:00:38.431	Situbondo	8123456789	rahmadfirmansyah@cbt.com	AKTIF	2025-12-13 14:11:51.249	2025-12-13 14:11:51.249	\N	cmj4d9txt00bo7yi0cx6go8jq	cmj4dk30u00rz7yi0h5eqo6xx
cmj4dk32b00s27yi0j7wfvy60	81034228	RAVADAL ADHA	1970-01-01 00:00:38.431	Situbondo	8123456789	ravadaladha@cbt.com	AKTIF	2025-12-13 14:11:51.299	2025-12-13 14:11:51.299	\N	cmj4d7vdl00bh7yi0sh0tye2g	cmj4dk32900s17yi0re2uxspj
cmj4dk33q00s47yi0pypb832r	99114829	RAZKY GABRIL WAHYUDI	1970-01-01 00:00:38.431	Situbondo	8123456789	example22@cbt.com	AKTIF	2025-12-13 14:11:51.35	2025-12-13 14:11:51.35	\N	cmj4d8kv400bj7yi00ujftazo	cmj4dk33o00s37yi0gn5r7itq
cmj4dk35500s67yi05zk9x83j	71528590	REZY ANGGARA BAHARI	1970-01-01 00:00:38.431	Situbondo	8123456789	rezyanggarabahari@cbt.com	AKTIF	2025-12-13 14:11:51.4	2025-12-13 14:11:51.4	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk35200s57yi0ndfb8n0a
cmj4dk36k00s87yi0s52s1m3z	98069279	RIDHO IRWANSYAH	1970-01-01 00:00:38.431	Situbondo	8123456789	ridhoirwansyah@cbt.com	AKTIF	2025-12-13 14:11:51.451	2025-12-13 14:11:51.451	\N	cmj4d8tyx00bk7yi0voaq9xy2	cmj4dk36h00s77yi04c002oxs
cmj4dk37y00sa7yi0c5mholkg	82598502	RIVA ADITYA PUTRA	1970-01-01 00:00:38.431	Situbondo	8123456789	rivaadityaputra@cbt.com	AKTIF	2025-12-13 14:11:51.502	2025-12-13 14:11:51.502	\N	cmj4d9lfa00bn7yi0ovesrwcj	cmj4dk37w00s97yi0gztiabg2
cmj4dk39d00sc7yi0qzvlwoku	109444333	RIZKY WIDODO	1970-01-01 00:00:38.431	Situbondo	8123456789	example23@cbt.com	AKTIF	2025-12-13 14:11:51.553	2025-12-13 14:11:51.553	\N	cmj4d8kv400bj7yi00ujftazo	cmj4dk39a00sb7yi0m59yohqg
cmj4dk3at00se7yi0auaisby4	77627927	SEPTIA IRFAN RAMADHAN	1970-01-01 00:00:38.431	Situbondo	8123456789	septiairfanramadhan@cbt.com	AKTIF	2025-12-13 14:11:51.604	2025-12-13 14:11:51.604	\N	cmj4d9txt00bo7yi0cx6go8jq	cmj4dk3aq00sd7yi0t995vuva
cmj4dk3c700sg7yi0vdbtkt3t	113396361	SUPRIYADI	1970-01-01 00:00:38.431	Situbondo	8123456789	example24@cbt.com	AKTIF	2025-12-13 14:11:51.655	2025-12-13 14:11:51.655	\N	cmj4d8kv400bj7yi00ujftazo	cmj4dk3c400sf7yi0zrkdwv9r
cmj4dk3dm00si7yi0b6hznkob	86217954	TESYA HERLIANA	1970-01-01 00:00:38.431	Situbondo	8123456789	tesyaherliana@cbt.com	AKTIF	2025-12-13 14:11:51.706	2025-12-13 14:11:51.706	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk3dj00sh7yi0gcnqryi1
cmj4dk3f200sk7yi0rr04dl6f	75001728	WISNU MAULANA	1970-01-01 00:00:38.431	Situbondo	8123456789	wisnumaulana@cbt.com	AKTIF	2025-12-13 14:11:51.757	2025-12-13 14:11:51.757	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk3ez00sj7yi0768vpbxv
cmj4dk3gg00sm7yi0fa9dmetk	83757487	WULAN FEBRIYANTI	1970-01-01 00:00:38.431	Situbondo	8123456789	wulanfebriyanti@cbt.com	AKTIF	2025-12-13 14:11:51.808	2025-12-13 14:11:51.808	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk3gd00sl7yi0k4zpzult
cmj4dk3hv00so7yi0b0uxhn7j	88579651	YEHEZKIEL KEVIN RAHARJO	1970-01-01 00:00:38.431	Situbondo	8123456789	yehezkielkevinraharjo@cbt.com	AKTIF	2025-12-13 14:11:51.859	2025-12-13 14:11:51.859	\N	cmj4d91oo00bl7yi0hp2pdna7	cmj4dk3hs00sn7yi0u22pnts8
cmj4dk3j900sq7yi05u4ysgjg	79467322	YOHANES DWI PRAYOGA	1970-01-01 00:00:38.431	Situbondo	8123456789	yohanesdwiprayoga@cbt.com	AKTIF	2025-12-13 14:11:51.909	2025-12-13 14:11:51.909	\N	cmj4d9txt00bo7yi0cx6go8jq	cmj4dk3j700sp7yi0hdarbfl7
cmj4dk3ko00ss7yi0h8yvy19l	97561362	YUDA WIRASA	1970-01-01 00:00:38.431	Situbondo	8123456789	example28@cbt.com	AKTIF	2025-12-13 14:11:51.96	2025-12-13 14:11:51.96	\N	cmj4d5zz600bg7yi0mzv0geb6	cmj4dk3km00sr7yi02jrhvxfe
cmj4dk3m300su7yi0o0mfxdox	71347347	YULI YATIMAH	1970-01-01 00:00:38.431	Situbondo	8123456789	yuliyatimah@cbt.com	AKTIF	2025-12-13 14:11:52.011	2025-12-13 14:11:52.011	\N	cmj4d867h00bi7yi06tgfiuci	cmj4dk3m000st7yi0wadpf5aq
cmj4dk0ul00oy7yi0br8t6lop	3093967437	DESY MUSTIKA MAYA SARI	2000-12-13 00:00:00	Situbondo	8123456789	example26@cbt.com	AKTIF	2025-12-13 14:11:48.428	2025-12-13 14:13:48.917	\N	cmj4d5zz600bg7yi0mzv0geb6	cmj4dk0ui00ox7yi09rk9u1ee
\.


--
-- Data for Name: TahunAjaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TahunAjaran" (id, tahun, semester, "tanggalMulai", "tanggalSelesai", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
cmj2pp5i40000lvi0ui6qolj5	2024/2025	1	2025-12-01 00:00:00	2025-12-11 00:00:00	SELESAI	2025-12-12 10:16:10.78	2025-12-12 15:23:31.812	\N
cmj2z2f7y0000qli09lkds1en	2025/2026	1	2025-07-14 00:00:00	2025-12-31 00:00:00	AKTIF	2025-12-12 14:38:26.446	2025-12-13 14:10:59.824	\N
cmj30obk60000nyi0d2cbh0g0	2025/2026	2	2026-01-01 00:00:00	2026-03-15 00:00:00	AKAN_DATANG	2025-12-12 15:23:27.75	2025-12-13 14:11:15.84	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, name, "createdAt", "updatedAt", password, role) FROM stdin;
cmj4djzkn00n57yi0e60qa8hl	abihartowicaksono@cbt.com	ABI HARTO WICAKSONO	2025-12-13 14:11:46.775	2025-12-13 14:11:46.775	$2b$10$vvmeL4Wou5pJa6LJii/JeOEoiM.ZBE58EiDxNyJCw3f/e4Je7s0q2	SISWA
cmj4djzm700n77yi0ayhugouo	adamsyahrezagumilang@cbt.com	ADAM SYAHREZA GUMILANG	2025-12-13 14:11:46.831	2025-12-13 14:11:46.831	$2b$10$MODwHsOqu3eF/xW.1JpaOuSarfsg.E1eLgB.WaOkijWMrp0FumqRC	SISWA
cmj4djzno00n97yi0k6olgvpb	aditiyarizkybayupradika@cbt.com	ADITIYA RIZKY BAYU PRADIKA	2025-12-13 14:11:46.884	2025-12-13 14:11:46.884	$2b$10$nuCL6/UfqeuVoKfOGSd1rux5wHNQkUMfhqPnzaK6u7Lwd.dRHWffC	SISWA
cmj4djzp400nb7yi0tmitn3ku	adityacaturprayogo@cbt.com	ADITYA CATUR PRAYOGO	2025-12-13 14:11:46.936	2025-12-13 14:11:46.936	$2b$10$VqgWSfhGS4/ITDvpdo/SMe0in7q2hlvkaDhs7IZhs6/opeWC5waXm	SISWA
cmj4djzqi00nd7yi0oxqzuj2o	example12@cbt.com	ADITYA DAMARA PUTRA KRISTIAWAN	2025-12-13 14:11:46.986	2025-12-13 14:11:46.986	$2b$10$RHPGW/409QAfGbUrECf9BOlcMPbUMQS1eOoOUiDJunnt3ShvMC9l2	SISWA
cmj4djzrx00nf7yi0gmqosiz1	adrianodwipradhita@cbt.com	ADRIANO DWI PRADHITA	2025-12-13 14:11:47.037	2025-12-13 14:11:47.037	$2b$10$Po4i3IN0SvlNN.ZR/qI8J.Jl8NaFkj3lQPWUWQG7.lUNzwZtcYR52	SISWA
cmj4djztd00nh7yi0isomfof5	agungtrisnadewi@cbt.com	AGUNG TRISNA DEWI	2025-12-13 14:11:47.089	2025-12-13 14:11:47.089	$2b$10$Mj82/FjGR7mtTWlI2IFEIOfYa8E7unoBJCthQTNZoj2YWNhTGOU5u	SISWA
cmj4djzut00nj7yi0rkt707d4	aguswiraadipurnomo@cbt.com	AGUS WIRA ADI PURNOMO	2025-12-13 14:11:47.14	2025-12-13 14:11:47.14	$2b$10$AkWuqZBuiZ5cKc2t.QOyRe092HGvlkAJZw7AYaEw4MLOO4tcytl72	SISWA
cmj2m3f190001lbi0e6fy36uy	rizky@mail.com	Rizky	2025-12-12 08:35:17.853	2025-12-12 13:25:13.311	$2b$10$ekDLYtLhoD9IFH2BQl0tv.t5ZP4TSZprEDbGsXf5n3jZFFzZF9xbW	ADMIN
cmj4djzw800nl7yi05wzhngwv	example1@cbt.com	AHMAD DIMAS KURNIAWAN	2025-12-13 14:11:47.192	2025-12-13 14:11:47.192	$2b$10$OMlzj56XHfGbMmpVFXuah.6JgHSWrAh7axjyt7omjY3r5QNbf020S	SISWA
cmj4djzxn00nn7yi0wg4m7o8o	ahmadrianzuhriafandi@cbt.com	AHMAD RIAN ZUHRI AFANDI	2025-12-13 14:11:47.243	2025-12-13 14:11:47.243	$2b$10$1QJf/JhcRftyrlWJxBpCmuvi7grkOX56vsu5duYR66AtVfePrbqY6	SISWA
cmj4djzz300np7yi0fnjjzv2t	example2@cbt.com	AINO YOEL	2025-12-13 14:11:47.295	2025-12-13 14:11:47.295	$2b$10$NEBchdafNeR4f0L6lOZnxuWwq6Ww2a6wXBigVkZ6HMyLabOZqDfpa	SISWA
cmj4dk00i00nr7yi0u673k9qt	ainurrohmah@cbt.com	AINUR ROHMAH	2025-12-13 14:11:47.346	2025-12-13 14:11:47.346	$2b$10$UOCZcwUwGLDoIldesUCno.J0C/zRBl2hoj7YEKwjsD0jl65xqM8Sm	SISWA
cmj4dk01x00nt7yi0qhshefp9	aldiprayatna@cbt.com	ALDI PRAYATNA	2025-12-13 14:11:47.397	2025-12-13 14:11:47.397	$2b$10$iG7NzJJmc5sObGShsI4I6esetfYg/A1Z7p4Zgq17L50uLoEe6Wixu	SISWA
cmj4dk03e00nv7yi0ztnmk0kp	aldoilfanpratama@cbt.com	ALDO ILFAN PRATAMA	2025-12-13 14:11:47.45	2025-12-13 14:11:47.45	$2b$10$3f3QVXGCEPZj28TWF4.ng.T6usmcoJZ1bK/BuIRcEZgZXYDyn0PeG	SISWA
cmj4dk04u00nx7yi07hx0b2r1	alfatriefendi@cbt.com	ALFA TRI EFENDI	2025-12-13 14:11:47.502	2025-12-13 14:11:47.502	$2b$10$63B4F1v.YwkM2BEd7pI4Hup5v7bW/mKU9CMXX0jGS5Yl7pztCs4HK	SISWA
cmj4dk06900nz7yi01b0iakh4	example13@cbt.com	ALFAZA OKTAVINO PRADITIA	2025-12-13 14:11:47.553	2025-12-13 14:11:47.553	$2b$10$XDDMxthWaugLzuk39VIRtOFXzNMHqKX6IAwe1/HUncV3tHUe77hUa	SISWA
cmj4dk07o00o17yi0o3x3wd3a	alifaturrosikin@cbt.com	ALIFATUR ROSIKIN	2025-12-13 14:11:47.604	2025-12-13 14:11:47.604	$2b$10$jvaQCjiDZBOSSx3TrpXeJeArEGCOZQUNFtNyyjxEowjqwv7nXpEzm	SISWA
cmj4dk09400o37yi0l8juaxow	ameliadewisinta@cbt.com	AMELIA DEWI SINTA	2025-12-13 14:11:47.656	2025-12-13 14:11:47.656	$2b$10$TMuZeKUV3AP87lxRl.f0YOxXonRZp26cdeBdybJMbnc7R.OVwI53y	SISWA
cmj4dk0ai00o57yi0ccnr0zl8	example3@cbt.com	ANANDA MAYCKO WIJAYA	2025-12-13 14:11:47.706	2025-12-13 14:11:47.706	$2b$10$r7pShWVaU/1PRHCs8ILKNeRW.XulhTBnu/b9hwrg5FmpXpCQwuljm	SISWA
cmj4dk0bx00o77yi0imiqs5jg	andhikabayusaputra@cbt.com	ANDHIKA BAYU SAPUTRA	2025-12-13 14:11:47.757	2025-12-13 14:11:47.757	$2b$10$Pgh85wEb.DNbNrm9/PxtAO1E3aD4gJTR.JAkDlGe7tsm2pHfw2jEK	SISWA
cmj4dk0dc00o97yi02qmupqdg	example4@cbt.com	ANGGA CAHYO PRATAMA	2025-12-13 14:11:47.808	2025-12-13 14:11:47.808	$2b$10$eF1BCswHJGT0OYqAS/kP7.GKu9dMf3PWTYRz4.gWYatWfRenprrFa	SISWA
cmj4dk0er00ob7yi01e5xt6vq	anggivirnandaputri@cbt.com	ANGGI VIRNANDA PUTRI	2025-12-13 14:11:47.859	2025-12-13 14:11:47.859	$2b$10$chhV9Keic2DHamYSYxIumO8qlxBp2TZkrunUe9eOknE.ut6lUIMlS	SISWA
cmj4dk0g600od7yi0uj89iia2	awangsetiawan@cbt.com	AWANG SETIAWAN	2025-12-13 14:11:47.91	2025-12-13 14:11:47.91	$2b$10$CJl8FFY5sdRZo2yj.7F9keGFIXPnTf0JTKoOPOSbmpeKxIhkj9.la	SISWA
cmj4dk0hm00of7yi0bme716h2	example25@cbt.com	AYUNI ARIMBI	2025-12-13 14:11:47.962	2025-12-13 14:11:47.962	$2b$10$PoGHJv8wBSQ068ouQuO6xe2X7fUCLdO0qbSERzPp3Xumlp6GQauu.	SISWA
cmj4dk0j200oh7yi09es3zb4i	example5@cbt.com	AZAI DENIS SAFARULLAH	2025-12-13 14:11:48.014	2025-12-13 14:11:48.014	$2b$10$eymnC2RKqP/zi0BcWW2A4uUgOp4/3gBpJ1Qh0ltCty/gjDlbBSDyq	SISWA
cmj4dk0kh00oj7yi0d8m7ge97	example14@cbt.com	BADRIA NUR ANISA	2025-12-13 14:11:48.065	2025-12-13 14:11:48.065	$2b$10$mCl8W53.kM2lmLHvD4TGnOJRgHIxHM53J3TqZbgOeTFryagM.YGtC	SISWA
cmj4dk0lv00ol7yi0ad1qhv9b	bagussetiawan@cbt.com	BAGUS SETIAWAN	2025-12-13 14:11:48.115	2025-12-13 14:11:48.115	$2b$10$pti907ABAolpOaD0uAJjfOsNSChBxoPL7cYN0QgZEhcT/KZmzZSz.	SISWA
cmj4dk0nb00on7yi0yql2cgbq	example6@cbt.com	CANDRA PRATAMA	2025-12-13 14:11:48.167	2025-12-13 14:11:48.167	$2b$10$yTs7itgcDDhtv3f6TxkfDuedAO/6cHeO9ZdzM/8SuWLMe/5/75RmW	SISWA
cmj4dk0os00op7yi04inbamx6	danubagusprayogo@cbt.com	DANU BAGUS PRAYOGO	2025-12-13 14:11:48.22	2025-12-13 14:11:48.22	$2b$10$i1VOtmXW/ZLnICulWL90luVACnxTDiJvoH7qTRW0bMFlTBiQ7zZoS	SISWA
cmj4dk0q700or7yi0x1terot2	davaputraprasetya@cbt.com	DAVA PUTRA PRASETYA	2025-12-13 14:11:48.271	2025-12-13 14:11:48.271	$2b$10$Raq7POk9ExZ36NRRjI6vB.J510LWz1UKSF.AZL3sXviZkAZiLjaee	SISWA
cmj4dk0rn00ot7yi0i4jn3114	definingtyas@cbt.com	DEFI NINGTYAS	2025-12-13 14:11:48.323	2025-12-13 14:11:48.323	$2b$10$ueUfwmoFdwu3c8q1CPaBPOxFW1tBkt9Xf9T85m.iS.fOVIHRXJjOa	SISWA
cmj4dk0t200ov7yi0q47gdokk	dendibayupratama@cbt.com	DENDI BAYU PRATAMA	2025-12-13 14:11:48.374	2025-12-13 14:11:48.374	$2b$10$zZSjN.dkw3nqyUQyBRTMTOspHXvEnzb8sNHDi2QW8phRpLUb.VL/.	SISWA
cmj4dk0ui00ox7yi09rk9u1ee	example26@cbt.com	DESY MUSTIKA MAYA SARI	2025-12-13 14:11:48.426	2025-12-13 14:11:48.426	$2b$10$JLn23NSJW3pvu0/B/MF9X.Lwq0dx7j6oKp3LrRcLo6.5R8qRfRBOi	SISWA
cmj4dk0vx00oz7yi0xs9m4h81	dewiwahyuni@cbt.com	DEWI WAHYUNI	2025-12-13 14:11:48.477	2025-12-13 14:11:48.477	$2b$10$s1VEY7Zg1mDfp2VA0nOy3u6FPnzysDLG3ZG38VciElDq2H18i2Qca	SISWA
cmj4dk0xd00p17yi0twc9q3lb	dinarizaayumatussholeha@cbt.com	DINA RIZA AYU MATUSSHOLEHA	2025-12-13 14:11:48.529	2025-12-13 14:11:48.529	$2b$10$saVlKcmBYsnFpI7ItMuBvuUxxfslxuqI04EqJKITRJBMGcq2tTv6m	SISWA
cmj4dk0ys00p37yi0j9shau5s	dinoabipratama@cbt.com	DINO ABI PRATAMA	2025-12-13 14:11:48.58	2025-12-13 14:11:48.58	$2b$10$rHq5GF7MGpyOzSnFpEGCjOkPIzOvNtGcSa2lCpOHpdJkJWHDURkEi	SISWA
cmj4dk10800p57yi01c1b5oha	dizayogayudistia@cbt.com	DIZA YOGA YUDISTIA	2025-12-13 14:11:48.632	2025-12-13 14:11:48.632	$2b$10$T/8MShqDoNIn/FFdl8KiO.X1nDH5.YNzuE2yaoPTtF8YNx64FC1ZW	SISWA
cmj4dk11q00p77yi0vpm8o1nv	example15@cbt.com	DWI AYU MEI JAYANTI	2025-12-13 14:11:48.686	2025-12-13 14:11:48.686	$2b$10$I7GaUCKK05PYW7Ixa4VwBuXUNLy3eJ2CgrqzEN1DKOB3NFitE4tK6	SISWA
cmj4dk13500p97yi0vv2qq26m	dwisintiaputri@cbt.com	DWI SINTIA PUTRI	2025-12-13 14:11:48.737	2025-12-13 14:11:48.737	$2b$10$KkZrDP1eXWG3EaEgY6bKXellQWDzVblNccOuN/u/d20dPtRuL0Taq	SISWA
cmj4dk14k00pb7yi014gld8av	ekadeviainurohma@cbt.com	EKA DEVI AINUROHMA	2025-12-13 14:11:48.788	2025-12-13 14:11:48.788	$2b$10$kNh4Gzq7Cfga9e/e43fyiO0tzFUjuYlp209OQ1nHbfMKWlu21/bEi	SISWA
cmj4dk16000pd7yi05v191omk	enggardwiprasetyo@cbt.com	ENGGAR DWI PRASETYO	2025-12-13 14:11:48.84	2025-12-13 14:11:48.84	$2b$10$d/wKbKKhLIdn81AOrfb88u6u06r0ysPYObA3wJEq6XsUHPoAvkOKS	SISWA
cmj4dk17g00pf7yi0ndgwdhog	esaagilputra@cbt.com	ESA AGIL PUTRA	2025-12-13 14:11:48.892	2025-12-13 14:11:48.892	$2b$10$LQKX.sUb7usKRwqjLO6bnuQOkQqRrXx6xGFVxxLQZ6qP.fjWBO9xy	SISWA
cmj4dk18v00ph7yi0w4r27j4x	fahmiadliyanto@cbt.com	FAHMI ADLIYANTO	2025-12-13 14:11:48.943	2025-12-13 14:11:48.943	$2b$10$Tydl6K7.57me.jAIBfTTru86mC4UFIfNxrGNFPBcF9eAnxt6q7zk2	SISWA
cmj4dk1aa00pj7yi0zxxpivow	fareladityaputra@cbt.com	FAREL ADITYA PUTRA	2025-12-13 14:11:48.994	2025-12-13 14:11:48.994	$2b$10$gS15o8lYh8VYL41ogm6LduAFOuoEdDXgfcNODky2LMKQUtmmE1OQO	SISWA
cmj4dk1bp00pl7yi0dtwipyzo	faturrohman@cbt.com	FATURROHMAN	2025-12-13 14:11:49.045	2025-12-13 14:11:49.045	$2b$10$IpvubAIGnfUEXJaWKWA7vuOkuzcpln.Mo1iwiRUjx/vdJMHsoiU7O	SISWA
cmj4dk1d500pn7yi0ezc4q1c7	example16@cbt.com	FERDIO PUTRA PRASETYA	2025-12-13 14:11:49.097	2025-12-13 14:11:49.097	$2b$10$f7dvB4IgRSbe5PMx2ZXWKeWEfoZE8BiGVmNLx.hVa95ybq2lYNVay	SISWA
cmj4dk1ek00pp7yi0cqef76n0	fiolaseptianaramadani@cbt.com	FIOLA SEPTIANA RAMADANI	2025-12-13 14:11:49.148	2025-12-13 14:11:49.148	$2b$10$6dGBLNf7EOck.VqFJSDey.kURudLGDxrbk.CyWVbfTJ62QolCncL.	SISWA
cmj4dk1fz00pr7yi0ig87bx34	fiqiaditia@cbt.com	FIQI ADITIA	2025-12-13 14:11:49.199	2025-12-13 14:11:49.199	$2b$10$Hg1VlwmP84apScLP2TMSUuHwyPRzeWBthmKdMISUmxFWmX/2QP/ne	SISWA
cmj4dk1he00pt7yi0nw3d3ual	fitrianaekaamelia@cbt.com	FITRIANA EKA AMELIA	2025-12-13 14:11:49.25	2025-12-13 14:11:49.25	$2b$10$OXaeO1P4uwYZXI3.Zmt5BOC0TOj6HOXoiaegWnQ7NHSPCgfioOXLO	SISWA
cmj4dk1iu00pv7yi0ibq4sw6g	hernandawildanfirdausi@cbt.com	HERNANDA WILDAN FIRDAUSI	2025-12-13 14:11:49.301	2025-12-13 14:11:49.301	$2b$10$RASTxs6ndO3qWVPZS9cTSeUMbU/LSgefAfk8PqVmLiL1wE8qGxUqi	SISWA
cmj4dk1ka00px7yi0ix965enz	example7@cbt.com	HUMAM FAUZI YANTO	2025-12-13 14:11:49.354	2025-12-13 14:11:49.354	$2b$10$67YH8em/eIlyhMz7zTDkXuNGS6t5dk5ZvAUNg28OwCL00cCyRqns2	SISWA
cmj4dk1lq00pz7yi0coq9zps5	ichajuwita@cbt.com	ICHA JUWITA	2025-12-13 14:11:49.406	2025-12-13 14:11:49.406	$2b$10$K5dnXBQppECOn600xJj1V.5FBdv0badtBl8gxm4i6Uk1cbO7ehkYe	SISWA
cmj4dk1n500q17yi01kvip10i	inaazrianadevi@cbt.com	INA AZRIANA DEVI	2025-12-13 14:11:49.457	2025-12-13 14:11:49.457	$2b$10$zRLzqyXHas0vgFXAd/jaPeYRWTRB3btj/BfNupkA4apczn7QBiIKW	SISWA
cmj4dk1ok00q37yi0yks807qr	intanbalqishumairo@cbt.com	INTAN BALQIS HUMAIRO	2025-12-13 14:11:49.508	2025-12-13 14:11:49.508	$2b$10$x33RzzQolQ9CUxBP3cUs5uSsh/ir/Fye9DPk4Zziy7fhxXmLGNF2O	SISWA
cmj4dk1pz00q57yi0icqeg1ut	jeniekanursabela@cbt.com	JENI EKA NURSABELA	2025-12-13 14:11:49.559	2025-12-13 14:11:49.559	$2b$10$nPkt.n/3of0A2K3BVPPqXuUi3S2MH30txHcSdZ63Ns7odmbSxYZpO	SISWA
cmj4dk1rf00q77yi05rgei2pi	jesenardiyanto@cbt.com	JESEN ARDIYANTO	2025-12-13 14:11:49.611	2025-12-13 14:11:49.611	$2b$10$tXzpKRuUJ.pGynGvScdnM.ny/UPqxPqQLOflZqK54CPMyGP1WsbCS	SISWA
cmj4dk1sv00q97yi028x7jk9g	jesikamartaal-zahra@cbt.com	JESIKA MARTA AL-ZAHRA	2025-12-13 14:11:49.663	2025-12-13 14:11:49.663	$2b$10$BIUHqDYOuHodn0gYOylCQuReZh9.nf5.gqLNbpvM2uuHs0kkuBgka	SISWA
cmj4dk1ua00qb7yi0af8m3ucv	joshuabagusnugroho@cbt.com	JOSHUA BAGUS NUGROHO	2025-12-13 14:11:49.714	2025-12-13 14:11:49.714	$2b$10$0MOahUKClCiwsFz99Wfjf.SkGOgaRbmGY5nUNXuahPnV1sCc3KttC	SISWA
cmj4dk1vp00qd7yi0xbby1vhu	example17@cbt.com	KETUT DIMAS MUHAMAD RISAL	2025-12-13 14:11:49.765	2025-12-13 14:11:49.765	$2b$10$YXaAoeFgFs9Uw/Cw.W9bdu2xjKrm1nyACiaYs5BIM2hl4yP2fx9Le	SISWA
cmj4dk1x400qf7yi0pkz6tzk5	example8@cbt.com	KEVIN MAULANA ISHAQ	2025-12-13 14:11:49.816	2025-12-13 14:11:49.816	$2b$10$8Wvxc6Jdmuccy0v.ggWCs.tDdjo5qDGu3vO1KfjE/K0n3.5XFdRrm	SISWA
cmj4dk1yk00qh7yi05ai25j5n	khairulrizalfauzitukimin@cbt.com	KHAIRUL RIZAL FAUZI TUKIMIN	2025-12-13 14:11:49.868	2025-12-13 14:11:49.868	$2b$10$ZgRAccNfdVT1Yi2dfHyQa.VddH/4EP11q7dae2PTKlJgdAoeArgEO	SISWA
cmj4dk1zz00qj7yi0m7cs8yc8	khaludsaifulanwar@cbt.com	KHALUD SAIFUL ANWAR	2025-12-13 14:11:49.919	2025-12-13 14:11:49.919	$2b$10$NEhCYg4IDGADW9bjyd0pouL14MNOI7nO7mAItKuAyUu0EUnUfBV46	SISWA
cmj4dk21e00ql7yi0x641al2z	lianarantikaputri@cbt.com	LIANA RANTIKA PUTRI	2025-12-13 14:11:49.97	2025-12-13 14:11:49.97	$2b$10$5JIGuGZizEoEICwV978fS.xi.7kTj6cgJgg4j5RJFN./UdxruUWQ6	SISWA
cmj4dk22v00qn7yi012bf6147	livianayuningutami@cbt.com	LIVIAN AYUNING UTAMI	2025-12-13 14:11:50.023	2025-12-13 14:11:50.023	$2b$10$dpMiUS1ibVBO29f/3YDjzupC8M8JhvAuQ9yZpbvI6tPWTy7usTub.	SISWA
cmj4dk24a00qp7yi0y43z9oor	luckyadityapratama@cbt.com	LUCKY ADITYA PRATAMA	2025-12-13 14:11:50.074	2025-12-13 14:11:50.074	$2b$10$3McsZrAv6XTxAecHC2m0MeyDmlKlAR34v8HzPrtZ1MuG1AMxCx.2a	SISWA
cmj4dk25q00qr7yi08ybeyi9y	lukmanafandi@cbt.com	LUKMAN AFANDI	2025-12-13 14:11:50.126	2025-12-13 14:11:50.126	$2b$10$vVgX8jcUNCRAUYtFxk0UOuCDAMESGSyaOquAgNyf6JZ1TPCWnQUBe	SISWA
cmj4dk27500qt7yi01fryn32t	mbagassantoso@cbt.com	M. BAGAS SANTOSO	2025-12-13 14:11:50.177	2025-12-13 14:11:50.177	$2b$10$DaxDYFenM6y10dwJLhsFmOJG/N8Gv0I9sPPgE8G2Pkvzx8uYeIugy	SISWA
cmj4dk28j00qv7yi0f14xcybq	mbagussatrio@cbt.com	M. BAGUS SATRIO	2025-12-13 14:11:50.227	2025-12-13 14:11:50.227	$2b$10$vhvdhuRBmszP1XbWes1ODeTfBLkw.ed1MfH5lUx6rU/ypFMKGVSYS	SISWA
cmj4dk29x00qx7yi0isz0tn8v	example9@cbt.com	M. SAIFURROSI	2025-12-13 14:11:50.276	2025-12-13 14:11:50.276	$2b$10$ehyBwqzfnjxrD8bbffPNFeEbTquQ0cI.uVN2zG95EJX8M9oMZazbO	SISWA
cmj4dk2bb00qz7yi0hyebqnwo	example18@cbt.com	M. YUSRON GINANDA	2025-12-13 14:11:50.327	2025-12-13 14:11:50.327	$2b$10$OhlpYLg0aC1JQpUxdaT3tu9Cwbwa6SdjE.f773N6Tgjt.3e/eVOCC	SISWA
cmj4dk2cp00r17yi0puunqm8f	marcelgalihginanjar@cbt.com	MARCEL GALIH GINANJAR	2025-12-13 14:11:50.377	2025-12-13 14:11:50.377	$2b$10$0e2YW7VrgrG11DWVmQ8J2.XbjSf8dxZrDvUwTbJwTwK8OUAyxIw5W	SISWA
cmj4dk2e400r37yi0dwyfx3nd	mazelloitoafrianzie@cbt.com	MAZELLO ITO AFRIANZIE	2025-12-13 14:11:50.428	2025-12-13 14:11:50.428	$2b$10$oM2kDZW8DuTwMKVahHUt2eRhMbD9Q6TLAUaOIvBjNSdkqv5EYMAgq	SISWA
cmj4dk2fi00r57yi01ej00y8z	minelasari@cbt.com	MINEL ASARI	2025-12-13 14:11:50.478	2025-12-13 14:11:50.478	$2b$10$GBCwLeayqaG1Zyb6BsLt6.47bGmb2d2.gpYH7ss8IA77hVfSepsfO	SISWA
cmj4dk2gx00r77yi03vamwzbq	example10000@example.com	MOH. AMAR MA'RUF	2025-12-13 14:11:50.529	2025-12-13 14:11:50.529	$2b$10$u8J8X8O8LVo7Ph8..1nHWu3VQ/RPmvC.4NrA130VKZ0s4thvLAQtu	SISWA
cmj4dk2id00r97yi012bf69wf	mohbayuainurrohman@cbt.com	MOH. BAYU AINURROHMAN	2025-12-13 14:11:50.581	2025-12-13 14:11:50.581	$2b$10$EmpeRxWM1C/RBcVpFouM6O9.ah6OllLEjxR/UY69ddCXoy9cSu4SK	SISWA
cmj4dk2jt00rb7yi070nw57xu	example10@cbt.com	MOH. RADITH MUSTOFA	2025-12-13 14:11:50.632	2025-12-13 14:11:50.632	$2b$10$cN97Zc/KH4SDOhcQeCw2.eapYrJZvghqtuILS5pMtJZZJfFivKg5e	SISWA
cmj4dk2l800rd7yi0nwe3gi05	mohammadzidanmaulana@cbt.com	MOHAMMAD ZIDAN MAULANA	2025-12-13 14:11:50.684	2025-12-13 14:11:50.684	$2b$10$Y6Vd2Cxp5ZwcnIV4Hi8EGeRCNGrMtlePiF821u4f0BfhyTzkAZeHa	SISWA
cmj4dk2mn00rf7yi007zkp1v4	example19@cbt.com	MUHAMAD RISKI NEO VALENTINO	2025-12-13 14:11:50.735	2025-12-13 14:11:50.735	$2b$10$Zfu7IKL9zwDl7/prNQZxXOvo0xxHw6oc9e2obunjM4TC/NwVYcFKG	SISWA
cmj4dk2o200rh7yi01nxd0dhk	example20@cbt.com	MUHAMMAD RIZKI	2025-12-13 14:11:50.786	2025-12-13 14:11:50.786	$2b$10$EWZcfGzuW7k0Lc.a96uuru.tyZolBvlkmMI.ADO3IhCdhKVVCJ5.q	SISWA
cmj4dk2pi00rj7yi0h6pdkcv0	example11@cbt.com	MUHAMMAD ZAINAL ABIDIN	2025-12-13 14:11:50.838	2025-12-13 14:11:50.838	$2b$10$5/vxBn.2fCfa6QE8nt2u1uLxm0uuSSPH9CaaniWB4eSFHzOLjjmZm	SISWA
cmj4dk2qx00rl7yi0xke4l1d5	nadiatuzzahroh@cbt.com	NADIATUZZAHROH	2025-12-13 14:11:50.889	2025-12-13 14:11:50.889	$2b$10$2qrnYTJJ6xNhy1jSNhprjO1dZZIHYzBbKc8iuGK9lem2YGcaFIdgy	SISWA
cmj4dk2sc00rn7yi0qz4wqdg1	example21@cbt.com	NAUFAL DZAKI HANIF ABIYYI	2025-12-13 14:11:50.94	2025-12-13 14:11:50.94	$2b$10$1jbgyrCSFIhIE0cTxXNk5.gmuDhvc.DuI/Y9ZZzNMqMjmAL9NRz1S	SISWA
cmj4dk2ts00rp7yi0fxogonzg	naysilanadineceyseana@cbt.com	NAYSILA NADINE CEYSEANA	2025-12-13 14:11:50.992	2025-12-13 14:11:50.992	$2b$10$HXSXasAIW3oil7GZnXTgpurqoxgFz.O78Pn0MrFi32BRKcguiOUqS	SISWA
cmj4dk2v600rr7yi0pw6xbbqy	nouvalyurisaputra@cbt.com	NOUVAL YURI SAPUTRA	2025-12-13 14:11:51.042	2025-12-13 14:11:51.042	$2b$10$fgOacRdEbZOmjGrQLDhLCeqLJZEKkVw8rKp.WTHyTg1GuJLUcNDmq	SISWA
cmj4dk2wl00rt7yi0u9vjetf8	nukekusumawardani@cbt.com	NUKE KUSUMA WARDANI	2025-12-13 14:11:51.093	2025-12-13 14:11:51.093	$2b$10$md9R0K5oM2l8jsooLzFjQuVTFbpMUswtkkteskT82viK5ZaNe1zuK	SISWA
cmj4dk2y000rv7yi0a5mcde8m	example27@cbt.com	NURHASAN	2025-12-13 14:11:51.144	2025-12-13 14:11:51.144	$2b$10$NCDLDpYumYeXxML35ApM/u1yrT7YJyT.u175M2dc4gloIiwWZ.p56	SISWA
cmj4dk2zg00rx7yi0305dq46p	philipusjayabalanrakasiwi@cbt.com	PHILIPUS JAYA BALAN RAKASIWI	2025-12-13 14:11:51.196	2025-12-13 14:11:51.196	$2b$10$UQ.psziPGIEH83BNdmulG.Q5jjDVd/VIk7uOxjtibyJuIEzZ57QFq	SISWA
cmj4dk30u00rz7yi0h5eqo6xx	rahmadfirmansyah@cbt.com	RAHMAD FIRMANSYAH	2025-12-13 14:11:51.246	2025-12-13 14:11:51.246	$2b$10$13ecTqbEtcLjerNq11jFUuiFZqkNk68PTw9rmOs6l47jBjh0Odk3q	SISWA
cmj4dk32900s17yi0re2uxspj	ravadaladha@cbt.com	RAVADAL ADHA	2025-12-13 14:11:51.296	2025-12-13 14:11:51.296	$2b$10$99snkTTovNNhATAPbL0yQeCtzcDQSKwLy8so/RFY2XcPX7GUIvtQe	SISWA
cmj4dk33o00s37yi0gn5r7itq	example22@cbt.com	RAZKY GABRIL WAHYUDI	2025-12-13 14:11:51.348	2025-12-13 14:11:51.348	$2b$10$jAxNEEFXLbVrs2ZQSy1C5OKvi1sGITG6x2geREKD.GmujTHyjHh7S	SISWA
cmj4dk35200s57yi0ndfb8n0a	rezyanggarabahari@cbt.com	REZY ANGGARA BAHARI	2025-12-13 14:11:51.398	2025-12-13 14:11:51.398	$2b$10$adTY30VvawN6/FQgGaV88ObSEd1VmxUfeej3hWwQ/D1P4/T7ey8JS	SISWA
cmj4dk36h00s77yi04c002oxs	ridhoirwansyah@cbt.com	RIDHO IRWANSYAH	2025-12-13 14:11:51.449	2025-12-13 14:11:51.449	$2b$10$.WBRTnfLhBkR3qqAppeU.OLcCt1pN/KKCE72ByuDxLGa0LDZwSjce	SISWA
cmj4dk37w00s97yi0gztiabg2	rivaadityaputra@cbt.com	RIVA ADITYA PUTRA	2025-12-13 14:11:51.5	2025-12-13 14:11:51.5	$2b$10$e9cuxsuntgn3PoBlJpLg0eEN1ULgCeCuiwNAhCsNAk7wgleOPeH8S	SISWA
cmj4dk39a00sb7yi0m59yohqg	example23@cbt.com	RIZKY WIDODO	2025-12-13 14:11:51.55	2025-12-13 14:11:51.55	$2b$10$zHoYoaOqmHkd/PluqLJY2O.Up4qu.2QkElkD6Wl.phpLKManw2Uxa	SISWA
cmj4dk3aq00sd7yi0t995vuva	septiairfanramadhan@cbt.com	SEPTIA IRFAN RAMADHAN	2025-12-13 14:11:51.602	2025-12-13 14:11:51.602	$2b$10$4KIVF9ICz3YdrF7TrY22P.j4W8X.njGtbPChnlA7E4EUCIJYUToh6	SISWA
cmj4dk3c400sf7yi0zrkdwv9r	example24@cbt.com	SUPRIYADI	2025-12-13 14:11:51.652	2025-12-13 14:11:51.652	$2b$10$4VGWKHjgmPzpstbCltezweUWmey5uNeLtXec2ZLtfhtNZDLBDKQr2	SISWA
cmj4dk3dj00sh7yi0gcnqryi1	tesyaherliana@cbt.com	TESYA HERLIANA	2025-12-13 14:11:51.703	2025-12-13 14:11:51.703	$2b$10$6cjjr8kiSnizJw9PB7ygI..n4wh/rE69z4dw/fMBkiXEHWQSwTpQ6	SISWA
cmj4dk3ez00sj7yi0768vpbxv	wisnumaulana@cbt.com	WISNU MAULANA	2025-12-13 14:11:51.755	2025-12-13 14:11:51.755	$2b$10$rg2Z/C9RdthAac3j0cddVOgvUgjNneznSmlTS1si2EMOGgme8GLNu	SISWA
cmj4dk3gd00sl7yi0k4zpzult	wulanfebriyanti@cbt.com	WULAN FEBRIYANTI	2025-12-13 14:11:51.805	2025-12-13 14:11:51.805	$2b$10$y4kh8.i/MqSLZKwvCRHkzefLEhr7h2rVqQXX/Q6Uy2t36GOuzGDtG	SISWA
cmj4dk3hs00sn7yi0u22pnts8	yehezkielkevinraharjo@cbt.com	YEHEZKIEL KEVIN RAHARJO	2025-12-13 14:11:51.856	2025-12-13 14:11:51.856	$2b$10$kThIA.ytgDAGc6/bSEM8K.vWhSEcDQokvyBdn.rORJX8Z1VlJgv.y	SISWA
cmj4dk3j700sp7yi0hdarbfl7	yohanesdwiprayoga@cbt.com	YOHANES DWI PRAYOGA	2025-12-13 14:11:51.907	2025-12-13 14:11:51.907	$2b$10$fvqWys1pPN99BpMXpgLvfeaoSqdAQHv2iKlaxrDl9yTUML2.2rIN.	SISWA
cmj4dk3km00sr7yi02jrhvxfe	example28@cbt.com	YUDA WIRASA	2025-12-13 14:11:51.958	2025-12-13 14:11:51.958	$2b$10$s6Ape13FbFU1/DkBvkBV/eMl0BxnDbbH4TswlUJHtv9Bt0CiD0wWC	SISWA
cmj4dk3m000st7yi0wadpf5aq	yuliyatimah@cbt.com	YULI YATIMAH	2025-12-13 14:11:52.008	2025-12-13 14:11:52.008	$2b$10$1GYCVEAif6YvE1PareRzIuhpk3F4ZQVMe5eRMbFYOpq9.6.oFNu2G	SISWA
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
88bfddba-4940-44e3-9a6b-38f59395b54d	609cb3817046359fc62b69f293e3903cd198aae0f3510bf462c59f9ad4035ff7	2025-12-12 08:12:10.278856+00	20251211102828_init	\N	\N	2025-12-12 08:12:10.274022+00	1
eaf7973c-a82e-4a48-94e6-e55942e7218f	2640bf707564a1056f78c31ab21927c3e2ba43ac93d47d3f1ef832ccced34bc8	2025-12-12 08:12:10.283878+00	20251211151758_npm_run_prisma_generate	\N	\N	2025-12-12 08:12:10.279866+00	1
959075bb-bc61-4c0e-992d-06e9deb2645e	0c7e0d4e778e1cc415cbfd0b3fbe7fdc91ffeb05229bf7599a2ebb8ceb9ffb3e	2025-12-12 09:58:57.592251+00	20251212095857_add_lms_entities	\N	\N	2025-12-12 09:58:57.575077+00	1
82c2dbd4-259c-4fd5-ade3-2b62903dc938	750d8a254ceaaf152f260f65242d25249ecaaf9678faa3f041f061007f1ee44d	2025-12-12 11:26:39.746689+00	20251212112639_add_jurusan_and_update_kelas	\N	\N	2025-12-12 11:26:39.735503+00	1
eab3bcb5-fdec-48c9-a578-0b7b7f2c8547	998edaffc3e7e33bda76f385a440e3df4dbf0428564a2a15763cd5aa26535719	2025-12-12 12:26:10.479048+00	20251212122610_add_many_to_many_guru_mata_pelajaran	\N	\N	2025-12-12 12:26:10.471051+00	1
dfd1bc6f-c4c7-4a49-83e5-0db46eed2fa3	92f08fc24273bbcd87412a6494250a94461f6da2ba78cc5cc67527b74e451431	2025-12-12 12:59:23.731389+00	20251212125923_add_user_integration_to_siswa_guru	\N	\N	2025-12-12 12:59:23.722637+00	1
eb2988d5-49bc-46ec-b1e7-b9be9e7f2bf2	2af40a7de13d912e0dc5428dfaad47807ad86bb19d9b998236759c7c6779f568	2025-12-12 15:00:20.329854+00	20251212145913_make_tahun_ajaran_required_in_kelas	\N	\N	2025-12-12 15:00:20.324502+00	1
f55e14ff-f083-4fd9-a827-075449847174	90480c68541aad550a5a12bc2e8485029efc1fb1fa25a9940a1323042c4385e2	2025-12-13 11:06:30.603123+00	20251213110630	\N	\N	2025-12-13 11:06:30.594106+00	1
\.


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
-- Name: Kelas_nama_jurusanId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Kelas_nama_jurusanId_key" ON public."Kelas" USING btree (nama, "jurusanId");


--
-- Name: MataPelajaran_kode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "MataPelajaran_kode_key" ON public."MataPelajaran" USING btree (kode);


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
-- Name: Kelas Kelas_tahunAjaranId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kelas"
    ADD CONSTRAINT "Kelas_tahunAjaranId_fkey" FOREIGN KEY ("tahunAjaranId") REFERENCES public."TahunAjaran"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Kelas Kelas_waliKelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Kelas"
    ADD CONSTRAINT "Kelas_waliKelasId_fkey" FOREIGN KEY ("waliKelasId") REFERENCES public."Guru"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Siswa Siswa_kelasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Siswa"
    ADD CONSTRAINT "Siswa_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES public."Kelas"(id) ON UPDATE CASCADE ON DELETE SET NULL;


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
-- PostgreSQL database dump complete
--

\unrestrict p0fI5nPa3f8Q5zjAdf02sWjM6cE0KD960ZXllDTZFR322SP36rUPGdkTIFdfbcT

