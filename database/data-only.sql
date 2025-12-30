--
-- PostgreSQL database dump
--

\restrict Vm6HzLhvhGFnTHfVNCXxbzxNLWExQVVaq2bfZa8MNTReDS4W37rZmxLjrDqWGRC

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
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public."User" DISABLE TRIGGER ALL;

INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5cw3cn00004iud971p5w0w', 'rizky@mail.com', 'Rizky', '2025-12-14 06:40:58.103', '2025-12-14 06:40:58.103', '$2b$10$jYGpzfeTx.IJASjBGxrVE.tf4kuyrdQIV44CRGUcl3rqUQ2F3zQS2', 'ADMIN');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwyql000035udj9kefx0z', 'abihartowicaksono@cbt.com', 'ABI HARTO WICAKSONO', '2025-12-14 08:33:37.245', '2025-12-14 08:33:37.245', '$2b$10$5Q7gCiV/cmiDE5o8keIP3O/uyLV3B4aKP8x1iOQNV14fFpJduqXTa', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwysf000235udeqpf8mo9', 'adamsyahrezagumilang@cbt.com', 'ADAM SYAHREZA GUMILANG', '2025-12-14 08:33:37.311', '2025-12-14 08:33:37.311', '$2b$10$/Sm6OIJrU9ieTWaMw9yBrOEl8fMLlOFSu3QfCGHSBjLuFZCd.h2MO', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwytz000435ud3k5i6zne', 'aditiyarizkybayupradika@cbt.com', 'ADITIYA RIZKY BAYU PRADIKA', '2025-12-14 08:33:37.367', '2025-12-14 08:33:37.367', '$2b$10$QU0HMFDX.FKwgGVz79Wz5.awxbG.TgoepLsRkYqUVFr/yMm5vCh/K', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwyvj000635udzcqos5da', 'adityacaturprayogo@cbt.com', 'ADITYA CATUR PRAYOGO', '2025-12-14 08:33:37.423', '2025-12-14 08:33:37.423', '$2b$10$HoWP0zUaDssknhWwopCUO.QkByAqgzf9yIX/KlOugebAbfOandkqq', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwyx4000835udq2k2tbxp', 'example12@cbt.com', 'ADITYA DAMARA PUTRA KRISTIAWAN', '2025-12-14 08:33:37.48', '2025-12-14 08:33:37.48', '$2b$10$e2DEjQBUOuPzLnJ0qHorR.N4wzOUyMkz4SLF36aUJTpUfOzThPbj.', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwyyq000a35udwqnc8ohp', 'adrianodwipradhita@cbt.com', 'ADRIANO DWI PRADHITA', '2025-12-14 08:33:37.538', '2025-12-14 08:33:37.538', '$2b$10$mEYbgViYbC9UjLlHcDHf2.LCtSviCMVWt8SByedsrRop.0Xmew/d.', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwz0c000c35udn9g3zoan', 'agungtrisnadewi@cbt.com', 'AGUNG TRISNA DEWI', '2025-12-14 08:33:37.596', '2025-12-14 08:33:37.596', '$2b$10$2b5zxWGhxAIK9Arue6427OkSZU3is6UO3XHuEFwujAXR/4lZOj7Fm', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwz1y000e35udzacwpk0x', 'aguswiraadipurnomo@cbt.com', 'AGUS WIRA ADI PURNOMO', '2025-12-14 08:33:37.654', '2025-12-14 08:33:37.654', '$2b$10$iA0ZQR0O2ou6i0h/8Uvwjug6oiax6kaoSlq.5tNIxbuRFD6hpF9t.', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwz3i000g35udydzzmr53', 'example1@cbt.com', 'AHMAD DIMAS KURNIAWAN', '2025-12-14 08:33:37.71', '2025-12-14 08:33:37.71', '$2b$10$G0nnig6veHoW2uamT0Ymie512Ddy7NSx0/mXVq8XkyQVlpLlrR10i', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwz53000i35udw6fgqktc', 'ahmadrianzuhriafandi@cbt.com', 'AHMAD RIAN ZUHRI AFANDI', '2025-12-14 08:33:37.767', '2025-12-14 08:33:37.767', '$2b$10$qZ0d2joT83a83Wtm8P6eruxx34oID1RPEcscB0iTPBh38zkm/g5yS', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwz6p000k35ud68fsf33i', 'example2@cbt.com', 'AINO YOEL', '2025-12-14 08:33:37.825', '2025-12-14 08:33:37.825', '$2b$10$o7MJEfM5PhZvP3CYGi/pVOGoVIc5kWzLrfdwniiKjDWaQEuPi/d8y', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwz88000m35ud5x4ctx7s', 'ainurrohmah@cbt.com', 'AINUR ROHMAH', '2025-12-14 08:33:37.88', '2025-12-14 08:33:37.88', '$2b$10$yLDOyWQ0K9.jkzeJ67liu.6FhlSzyY4ePVAtL12xr9/2K6AUNYu82', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwz9q000o35ud7f7d7ltw', 'aldiprayatna@cbt.com', 'ALDI PRAYATNA', '2025-12-14 08:33:37.934', '2025-12-14 08:33:37.934', '$2b$10$NIPFvEd/wlOFP0ex3Aj3tujQxV5A2Vw2o2cFXVJhcxUi5QOuOATS.', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzb9000q35uds8mmj6bl', 'aldoilfanpratama@cbt.com', 'ALDO ILFAN PRATAMA', '2025-12-14 08:33:37.989', '2025-12-14 08:33:37.989', '$2b$10$sVsk69s8ge38pHvyYTQrUOEKQ7uN5XTR/3NN5ak4AHybO/dwxprKm', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzct000s35udllh69h8u', 'alfatriefendi@cbt.com', 'ALFA TRI EFENDI', '2025-12-14 08:33:38.045', '2025-12-14 08:33:38.045', '$2b$10$zdiROYH4yUho1R/7imiaHOR9ehhMtQ/a9dH4/4SBgFRZGnqa52dzG', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzed000u35udlnddwq47', 'example13@cbt.com', 'ALFAZA OKTAVINO PRADITIA', '2025-12-14 08:33:38.101', '2025-12-14 08:33:38.101', '$2b$10$7g2C1XGdos1wVaUCCwIii.yKz2d2EAMQb0BdpMblQgwWPBz98Y3Gq', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzfw000w35udzc26ap9b', 'alifaturrosikin@cbt.com', 'ALIFATUR ROSIKIN', '2025-12-14 08:33:38.156', '2025-12-14 08:33:38.156', '$2b$10$UeBkuTY2kaZg7J9UJcCvoOOE8A/wCaEocb.fcvpABsgs.ygG//aUu', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzhe000y35udg8o4lrsn', 'ameliadewisinta@cbt.com', 'AMELIA DEWI SINTA', '2025-12-14 08:33:38.21', '2025-12-14 08:33:38.21', '$2b$10$eNxyiUR7S3f4WtM/ABO.hePWuaOiP1X72yskw/qyWZvK0Ee9C7h0e', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwziy001035udhbgntn1o', 'example3@cbt.com', 'ANANDA MAYCKO WIJAYA', '2025-12-14 08:33:38.266', '2025-12-14 08:33:38.266', '$2b$10$MYx8nhclCk67gfBT8ZUJGerRFwxXJ1ixtYzB88R.IbFSvcWmjPBiS', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzkg001235uda1zowq2b', 'andhikabayusaputra@cbt.com', 'ANDHIKA BAYU SAPUTRA', '2025-12-14 08:33:38.32', '2025-12-14 08:33:38.32', '$2b$10$zX8SqUy76c/M68Jqvm87e.oMvj2fSea5vqHIekMDuZ3LbrpteVCbW', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzlz001435udoar1p1ou', 'example4@cbt.com', 'ANGGA CAHYO PRATAMA', '2025-12-14 08:33:38.375', '2025-12-14 08:33:38.375', '$2b$10$gkigz7.ZwvNxDfWJq2tlj.P7pYHj2tdFO.53./zHde097gFqqIIBi', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzni001635udt2intkub', 'anggivirnandaputri@cbt.com', 'ANGGI VIRNANDA PUTRI', '2025-12-14 08:33:38.43', '2025-12-14 08:33:38.43', '$2b$10$o9i2prpTY.dnXWu1ygFZrObK4x4blfSvG2gtgk/t.UuDixr3MkM4u', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzp2001835udtswr5q1s', 'awangsetiawan@cbt.com', 'AWANG SETIAWAN', '2025-12-14 08:33:38.486', '2025-12-14 08:33:38.486', '$2b$10$Dd4dvJtA2.dKgDAog2sMue17h/zkuWD/l1dgQ2nkeQZG.eXqtGZx6', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzql001a35udfoqzqfcv', 'example25@cbt.com', 'AYUNI ARIMBI', '2025-12-14 08:33:38.541', '2025-12-14 08:33:38.541', '$2b$10$bWEqVSCm3XQi9HDhb3bn4uqfQZJz6BFMILYwxaEZe8f6LsAK5eb6u', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzs4001c35udaqgx22e1', 'example5@cbt.com', 'AZAI DENIS SAFARULLAH', '2025-12-14 08:33:38.595', '2025-12-14 08:33:38.595', '$2b$10$8tlweExCNOq5bqKIz16v/uweuUTsCvsXRQcpob51dNx9ed.48puSC', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwztn001e35udd3b8c4mg', 'example14@cbt.com', 'BADRIA NUR ANISA', '2025-12-14 08:33:38.651', '2025-12-14 08:33:38.651', '$2b$10$5Llm6n1OEzmLVIUF3YoIIeQ2JYfpZlnhfbu60zfR2tcdZ4hn9kkNq', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzv5001g35ud5bbn2qzz', 'bagussetiawan@cbt.com', 'BAGUS SETIAWAN', '2025-12-14 08:33:38.705', '2025-12-14 08:33:38.705', '$2b$10$KKhYJEACdJ2M2er5QJE7T.JKPBKmvV6KBlVcpmoyP8kIFBcwIxE9C', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzwo001i35uduhbzcboi', 'example6@cbt.com', 'CANDRA PRATAMA', '2025-12-14 08:33:38.76', '2025-12-14 08:33:38.76', '$2b$10$31QCDyTLa5GrNMUVuP/UF.LxYqke8GbKRM44Lb7z./pmbBy8FUQ66', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzy7001k35udjqgqcye1', 'danubagusprayogo@cbt.com', 'DANU BAGUS PRAYOGO', '2025-12-14 08:33:38.815', '2025-12-14 08:33:38.815', '$2b$10$gIukZJLlI3dmIimx.J7QU.OLO.7t3SQNAKSWfhAcDAeUWEGVoa8uO', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gwzzr001m35udpblpr5c0', 'davaputraprasetya@cbt.com', 'DAVA PUTRA PRASETYA', '2025-12-14 08:33:38.871', '2025-12-14 08:33:38.871', '$2b$10$qh5M4U1WeNtmQ86yvJbk7eCOiMsrfcLduBCgyT7mpIT/vInmGUtU2', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx01a001o35udcz1uye9r', 'definingtyas@cbt.com', 'DEFI NINGTYAS', '2025-12-14 08:33:38.926', '2025-12-14 08:33:38.926', '$2b$10$QvqW3hyijv6G4lX5Tko1a.RYB49oEyz2oUB.YA/TrYJe9xT.SkgQm', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx02s001q35udsc32mvtz', 'dendibayupratama@cbt.com', 'DENDI BAYU PRATAMA', '2025-12-14 08:33:38.98', '2025-12-14 08:33:38.98', '$2b$10$2dqNuMhEz8Db286yFTgC5.4YFTEBXQNxeZKKfTzdB3hWZTZSGBuN.', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx05t001u35ud56w1gpg0', 'dewiwahyuni@cbt.com', 'DEWI WAHYUNI', '2025-12-14 08:33:39.089', '2025-12-14 08:33:39.089', '$2b$10$TmPC2a4wfh18AxF58kqaAe/XJHtTO4oq9AEM9gvo8dcblKKMOcbiG', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx07b001w35ud6uy774vt', 'dinarizaayumatussholeha@cbt.com', 'DINA RIZA AYU MATUSSHOLEHA', '2025-12-14 08:33:39.143', '2025-12-14 08:33:39.143', '$2b$10$N9CmxnGuK.o.mrQI64mixuWu7ICbZaMv4YK8I7ExYgrQGHnWruzJu', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx08u001y35udh95b095v', 'dinoabipratama@cbt.com', 'DINO ABI PRATAMA', '2025-12-14 08:33:39.198', '2025-12-14 08:33:39.198', '$2b$10$h5YihryfOT0xv40z4Ti27eQRdk04gfJ3qm78v7tjWQUC52ud4z9Y.', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0ac002035udfnj8z7vm', 'dizayogayudistia@cbt.com', 'DIZA YOGA YUDISTIA', '2025-12-14 08:33:39.252', '2025-12-14 08:33:39.252', '$2b$10$HrD9T8JdIAoDtzEGJcYfWemjQZ3HSb.UzjaXo8cfgNRTYS5Moz/pu', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0bv002235ud9wy5giy5', 'example15@cbt.com', 'DWI AYU MEI JAYANTI', '2025-12-14 08:33:39.307', '2025-12-14 08:33:39.307', '$2b$10$kQc9TPW0d7vDv4Srm.BkfePozlHyyR.aGBEQALuitUGL.n4KGub0O', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0de002435ud24zdsw0s', 'dwisintiaputri@cbt.com', 'DWI SINTIA PUTRI', '2025-12-14 08:33:39.362', '2025-12-14 08:33:39.362', '$2b$10$tO1CLLaMLbV2bdXILmNkNu4hWhk1zU207CacVStE0Lq/zGuLtGxrO', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0ev002635udvv65yg6g', 'ekadeviainurohma@cbt.com', 'EKA DEVI AINUROHMA', '2025-12-14 08:33:39.415', '2025-12-14 08:33:39.415', '$2b$10$8hsHdRGP7WMdt.gnP2FSNeX85PMAp0TShPGJuqlFDT9TjowA/v24m', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0gd002835udbw0sqmi6', 'enggardwiprasetyo@cbt.com', 'ENGGAR DWI PRASETYO', '2025-12-14 08:33:39.469', '2025-12-14 08:33:39.469', '$2b$10$ubzOUtFm5jvR3fsiPz13Yu4TQl.WR89LrTSA32wcyrICswbv/uAIW', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0hw002a35udavq9oyfo', 'esaagilputra@cbt.com', 'ESA AGIL PUTRA', '2025-12-14 08:33:39.524', '2025-12-14 08:33:39.524', '$2b$10$OZMrXJv03UocRK1Rkw5HZOl1tpW9E4EMB7IyWURaAB3L6t4ag7zs2', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0jf002c35udq9gtxbg2', 'fahmiadliyanto@cbt.com', 'FAHMI ADLIYANTO', '2025-12-14 08:33:39.579', '2025-12-14 08:33:39.579', '$2b$10$Yo2M7biLLoCR6.rzzVtT6ej.7dBnWQzb7B9o3GRhYPXGV4AkEJCXW', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0kw002e35ud03ae2xo1', 'fareladityaputra@cbt.com', 'FAREL ADITYA PUTRA', '2025-12-14 08:33:39.632', '2025-12-14 08:33:39.632', '$2b$10$WoYFgE1Pds8tbQ54nMqCnOGDL.2LpBGJ/6LRFYTn0wq3FSVRkXx.S', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0mf002g35udp7fvgdod', 'faturrohman@cbt.com', 'FATURROHMAN', '2025-12-14 08:33:39.687', '2025-12-14 08:33:39.687', '$2b$10$mldB2VE9.qQ.mG00C2ztQuY.DyqShydxESrwT0vcYKByO8MigmuBy', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0nz002i35udbi0v5c4g', 'example16@cbt.com', 'FERDIO PUTRA PRASETYA', '2025-12-14 08:33:39.743', '2025-12-14 08:33:39.743', '$2b$10$yCXsjoQ4JFhCjkZq5TZYbe8pOX51sxaCAGkfbr9SeoS8kpKJfbd/G', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0pi002k35udwebdytrh', 'fiolaseptianaramadani@cbt.com', 'FIOLA SEPTIANA RAMADANI', '2025-12-14 08:33:39.798', '2025-12-14 08:33:39.798', '$2b$10$ZWz5tUjK07/tMIraoICc9ex6iFfEQ6yD/sH4Nkl4Fs4Q3JnP9X8qO', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0r0002m35udzu8e92kf', 'fiqiaditia@cbt.com', 'FIQI ADITIA', '2025-12-14 08:33:39.852', '2025-12-14 08:33:39.852', '$2b$10$TXMxkufQzu.srwB1WyJvPuq5egxFcjtObm7520ddY8YdK9uqgStcq', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0si002o35ud2jnff2tj', 'fitrianaekaamelia@cbt.com', 'FITRIANA EKA AMELIA', '2025-12-14 08:33:39.906', '2025-12-14 08:33:39.906', '$2b$10$ghsNSpYjxMV//x.5AVleSuNPJisSHQ.TEyX7J5G8qrgS9dRq5SZHW', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0tz002q35udykvj7rwf', 'hernandawildanfirdausi@cbt.com', 'HERNANDA WILDAN FIRDAUSI', '2025-12-14 08:33:39.959', '2025-12-14 08:33:39.959', '$2b$10$Dcpmm3NTQ2Tfi6.COAhcjeGAuySHCrPnmTC2cq5zEwEch0w0Nbxc.', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0vh002s35udu1n8yl9k', 'example7@cbt.com', 'HUMAM FAUZI YANTO', '2025-12-14 08:33:40.013', '2025-12-14 08:33:40.013', '$2b$10$r8qqYovHDfi8YxylzDBFburR934QAnXHppsFB8b/wDI5c5jSntDfO', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0x0002u35udc7ccpufd', 'ichajuwita@cbt.com', 'ICHA JUWITA', '2025-12-14 08:33:40.068', '2025-12-14 08:33:40.068', '$2b$10$LyMfvfdzS3BY6JzzvYKL..jNr65MkT3CHst0TVZqpLeeBzcZ78z0K', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx0yj002w35ud8v9qi589', 'inaazrianadevi@cbt.com', 'INA AZRIANA DEVI', '2025-12-14 08:33:40.123', '2025-12-14 08:33:40.123', '$2b$10$uffZ51BM366x9JqaQWdpweTJiDoP7sgUla./YPw9aNv/jc.m7o3zG', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx100002y35udilmg1ny8', 'intanbalqishumairo@cbt.com', 'INTAN BALQIS HUMAIRO', '2025-12-14 08:33:40.176', '2025-12-14 08:33:40.176', '$2b$10$yRtmXtim8gtUMySIb0ltSu2x0xoP6XS9xiSA2zRytbe/.Gi9vIoFu', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx11g003035ud3bx82k5d', 'jeniekanursabela@cbt.com', 'JENI EKA NURSABELA', '2025-12-14 08:33:40.228', '2025-12-14 08:33:40.228', '$2b$10$g5xiOdWBYgyqedNbglhyMejmMoAHsWmfJlgmUW8r4z4JVGbvQxLa2', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx12x003235udw6jxtx4r', 'jesenardiyanto@cbt.com', 'JESEN ARDIYANTO', '2025-12-14 08:33:40.281', '2025-12-14 08:33:40.281', '$2b$10$L1KLICXq3ZaDTkBO17rOwerxL/PjdMPTjMp42BhVqZF/a.Km.0hTe', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx14g003435ud6w8b4goi', 'jesikamartaal-zahra@cbt.com', 'JESIKA MARTA AL-ZAHRA', '2025-12-14 08:33:40.336', '2025-12-14 08:33:40.336', '$2b$10$7qMEekHNAjTJJ499/hp6/uPCKwIZdyJk6d4kRA98hPZKPn7cVHG1.', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx15y003635udfzfvsnsn', 'joshuabagusnugroho@cbt.com', 'JOSHUA BAGUS NUGROHO', '2025-12-14 08:33:40.39', '2025-12-14 08:33:40.39', '$2b$10$cLd/Y6zZfpioG8.JQK7P9emrgU9cIWr2KW3ZeN/94GlMT88mzgZRW', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx17g003835uduzmy772u', 'example17@cbt.com', 'KETUT DIMAS MUHAMAD RISAL', '2025-12-14 08:33:40.444', '2025-12-14 08:33:40.444', '$2b$10$T0ukWPdR.809ccNV/5m7KO6LM1A1k2i/BIFrq/FyYiHSlt01yFz4u', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx18z003a35udlra3qj4l', 'example8@cbt.com', 'KEVIN MAULANA ISHAQ', '2025-12-14 08:33:40.499', '2025-12-14 08:33:40.499', '$2b$10$uBEpt3H35gGkW.hQxwpiZeswyIfQjNzWdtE70xDWtyxhNc.yyn8q.', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1ai003c35udrndkgaz9', 'khairulrizalfauzitukimin@cbt.com', 'KHAIRUL RIZAL FAUZI TUKIMIN', '2025-12-14 08:33:40.554', '2025-12-14 08:33:40.554', '$2b$10$N3N1Xsj3jQwTlz8j30D1uuyds7TGWMKmeXS04/goiUk4sHQEilYUC', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1bz003e35udkcmtj455', 'khaludsaifulanwar@cbt.com', 'KHALUD SAIFUL ANWAR', '2025-12-14 08:33:40.607', '2025-12-14 08:33:40.607', '$2b$10$pp2Q.A9uhWotYBb5Bl.bsOsajyaEwWjvt8kcPGdxQizPmthMo4aty', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1dg003g35udnuykpero', 'lianarantikaputri@cbt.com', 'LIANA RANTIKA PUTRI', '2025-12-14 08:33:40.66', '2025-12-14 08:33:40.66', '$2b$10$omtSpijg6/nqL.QV0F7bMOuhnKswBMwxk5flJb9Hh8/ov27Nya.d.', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1ex003i35ud2tmr6ezm', 'livianayuningutami@cbt.com', 'LIVIAN AYUNING UTAMI', '2025-12-14 08:33:40.713', '2025-12-14 08:33:40.713', '$2b$10$VLV5/X./8D.qHmC8R04oA.00/ROJj6octo7Iavzq5kph14.jNlzOK', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1gf003k35udqn4te1zt', 'luckyadityapratama@cbt.com', 'LUCKY ADITYA PRATAMA', '2025-12-14 08:33:40.767', '2025-12-14 08:33:40.767', '$2b$10$uAWsVU.zHR6xaCeLnJL71Oa4yr9RW1o.KgHZX21nOMC8bA6LsZwDK', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1hw003m35udhjaaqojj', 'lukmanafandi@cbt.com', 'LUKMAN AFANDI', '2025-12-14 08:33:40.82', '2025-12-14 08:33:40.82', '$2b$10$NXpY4ciXWh/zTT4a2MUikOOK3sIqZy0J5IvBhcsgghc7tAr099UhS', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1je003o35udc4kp1c2m', 'mbagassantoso@cbt.com', 'M. BAGAS SANTOSO', '2025-12-14 08:33:40.874', '2025-12-14 08:33:40.874', '$2b$10$w1M8IJqZarK/H4cTgWOKrep/vxu/uu5EE8s0/u52KdZMswpW16AOS', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1kx003q35udsvrwk0yg', 'mbagussatrio@cbt.com', 'M. BAGUS SATRIO', '2025-12-14 08:33:40.929', '2025-12-14 08:33:40.929', '$2b$10$.ejnfg5wFafLZs./iiALheXJWajy4.TTc2ck6QEIryBZikG9XgYga', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1mf003s35udmkcekzi3', 'example9@cbt.com', 'M. SAIFURROSI', '2025-12-14 08:33:40.983', '2025-12-14 08:33:40.983', '$2b$10$jb3UgkRydpRrwD2XyxSjseIGRZkQAhnEvvd4PIIJZBacStlrhKPly', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1nx003u35udc8a2l13v', 'example18@cbt.com', 'M. YUSRON GINANDA', '2025-12-14 08:33:41.037', '2025-12-14 08:33:41.037', '$2b$10$FIkX1Np6aCMbuZ2ah6gFwea8T.T7OPSTLoOPvpXzQWvdGyvEcg21S', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1pg003w35ud8n0lxpp8', 'marcelgalihginanjar@cbt.com', 'MARCEL GALIH GINANJAR', '2025-12-14 08:33:41.092', '2025-12-14 08:33:41.092', '$2b$10$t7ldjM39sSAPx0NtzxTDquA4uWING8BwJXs2H8zbIv9Z09PBGiWh6', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1qy003y35udt05qd1id', 'mazelloitoafrianzie@cbt.com', 'MAZELLO ITO AFRIANZIE', '2025-12-14 08:33:41.146', '2025-12-14 08:33:41.146', '$2b$10$lsg2kiPtwpWxWJJ0zCRJq.wvTyCt8xlX1wgrmOSMDEKVdG6vZ4qui', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1sg004035udzqsyoalc', 'minelasari@cbt.com', 'MINEL ASARI', '2025-12-14 08:33:41.2', '2025-12-14 08:33:41.2', '$2b$10$5LtAmaVu6JpetOQa5/KiPOG7jTRI8mGZcYURL7pGcYSotqyAPIOQa', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1tz004235udd1rv3ppx', 'example10000@example.com', 'MOH. AMAR MA''RUF', '2025-12-14 08:33:41.255', '2025-12-14 08:33:41.255', '$2b$10$XZMxr6ZQsd2FROhu0Kt0gOwqDVmvEGW0wO7E1y4EDAhV6.kUiPvOG', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1vi004435ud0rdy53xd', 'mohbayuainurrohman@cbt.com', 'MOH. BAYU AINURROHMAN', '2025-12-14 08:33:41.31', '2025-12-14 08:33:41.31', '$2b$10$CuJYnK2cWUKcTofGa.DKjeDmVs5q7zxX.HM3ekQlXS064YDJpXCTq', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1x1004635udvhadbran', 'example10@cbt.com', 'MOH. RADITH MUSTOFA', '2025-12-14 08:33:41.365', '2025-12-14 08:33:41.365', '$2b$10$TpsDqHe1q8NOfcmUUzn8UuEmRrdrpTBuMyRMfGNJvysBQ.F3DBIAK', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx1yk004835ud9hcuxcvr', 'mohammadzidanmaulana@cbt.com', 'MOHAMMAD ZIDAN MAULANA', '2025-12-14 08:33:41.42', '2025-12-14 08:33:41.42', '$2b$10$iQUGDy82Y/9HoevToUKDFeQ1IjjYmfDKTk0oq86dmJPqngA5l5EoO', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx202004a35uditlzqygw', 'example19@cbt.com', 'MUHAMAD RISKI NEO VALENTINO', '2025-12-14 08:33:41.474', '2025-12-14 08:33:41.474', '$2b$10$juj.bqsJNM7RIt1/WzjliOvyTZkS7.JpzbnhmXMfUfWPKz3GY1/X.', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx21k004c35udlo92ywg1', 'example20@cbt.com', 'MUHAMMAD RIZKI', '2025-12-14 08:33:41.528', '2025-12-14 08:33:41.528', '$2b$10$pQIKslwrgauDB.wIrz8Q/.7WkZirqlH/LoeMhvxQN6ySt8/F1m66a', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx231004e35udeisgbcya', 'example11@cbt.com', 'MUHAMMAD ZAINAL ABIDIN', '2025-12-14 08:33:41.581', '2025-12-14 08:33:41.581', '$2b$10$z5OD4jHLPKfZI1fEgTDskebpK4qF5FVJ833sWNlK/Zz1TzK2NN6g2', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx24i004g35udt6qrnb7l', 'nadiatuzzahroh@cbt.com', 'NADIATUZZAHROH', '2025-12-14 08:33:41.634', '2025-12-14 08:33:41.634', '$2b$10$IX/Bgj/B.XProOgGnL34aeIzBSYpF1CXGPa9aMWoysEg0bP7Swawu', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx260004i35udriuw72oc', 'example21@cbt.com', 'NAUFAL DZAKI HANIF ABIYYI', '2025-12-14 08:33:41.688', '2025-12-14 08:33:41.688', '$2b$10$LrNJSdRflPXfcHLqm6bDqe8.ktS4DCp3oqjHvGtUVLHNBEXHc7Gti', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx27h004k35udvdyo2fwy', 'naysilanadineceyseana@cbt.com', 'NAYSILA NADINE CEYSEANA', '2025-12-14 08:33:41.741', '2025-12-14 08:33:41.741', '$2b$10$nmv.pU4DbB48VDjsBn46l.1DDdJjBYX3Q3ETWvlLipyvL8euqaXOy', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx28x004m35udws9r11al', 'nouvalyurisaputra@cbt.com', 'NOUVAL YURI SAPUTRA', '2025-12-14 08:33:41.793', '2025-12-14 08:33:41.793', '$2b$10$F4qE08pklQZztYE92r9Xxuk2znLAAX1.b/VUIH2clsxB31iF9/Pta', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2ag004o35udqr0i50ow', 'nukekusumawardani@cbt.com', 'NUKE KUSUMA WARDANI', '2025-12-14 08:33:41.848', '2025-12-14 08:33:41.848', '$2b$10$H11ia2GrN8hNWVkJ/cGigu/RHFh.PH6z.7qFfE5SzRinEAjcbZyk2', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2bx004q35udncso3x1e', 'example27@cbt.com', 'NURHASAN', '2025-12-14 08:33:41.901', '2025-12-14 08:33:41.901', '$2b$10$yWbwzV5pZh2VY5cNKmi8yODVdu2UWKzKRO/JiIaEMtLNs5z9h6jt2', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2dg004s35udfhoy10rz', 'philipusjayabalanrakasiwi@cbt.com', 'PHILIPUS JAYA BALAN RAKASIWI', '2025-12-14 08:33:41.956', '2025-12-14 08:33:41.956', '$2b$10$rakNiN2VvDPskNw1eZ3wVOlUemfSd3csLPrTv5/iQZEGc0K8J97mi', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2ey004u35udtxb4t3ri', 'rahmadfirmansyah@cbt.com', 'RAHMAD FIRMANSYAH', '2025-12-14 08:33:42.01', '2025-12-14 08:33:42.01', '$2b$10$gIqO.dpbA2srgntpay6z6uguqeAP3dqYR30B6Sygzvwm2SYbovk4W', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2gf004w35udlkyaly82', 'ravadaladha@cbt.com', 'RAVADAL ADHA', '2025-12-14 08:33:42.063', '2025-12-14 08:33:42.063', '$2b$10$XV.Pzyw1nc.rYSWR6ZOxMeRjk9av1CR3Q7xEhODf6S6kmz0M.m0rO', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2hw004y35udh3y17ie4', 'example22@cbt.com', 'RAZKY GABRIL WAHYUDI', '2025-12-14 08:33:42.116', '2025-12-14 08:33:42.116', '$2b$10$5.cyobUBdBAoDYyWsmC.su7bF/5/B8l3kjfQkCOn3LxIxCi28TbOe', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2jd005035udyuohrs2j', 'rezyanggarabahari@cbt.com', 'REZY ANGGARA BAHARI', '2025-12-14 08:33:42.169', '2025-12-14 08:33:42.169', '$2b$10$Zxa2anNIEPVLnwCXwkusceo2RZ3mMPIKIx3VHs1ethbRuC283r32q', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2ku005235udqtgs17js', 'ridhoirwansyah@cbt.com', 'RIDHO IRWANSYAH', '2025-12-14 08:33:42.222', '2025-12-14 08:33:42.222', '$2b$10$2PTMmvSYZyB9aB0uVdQV8OgEg/6xEeHAEZr2B0ZZwrmRCKGe5AZHW', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2mc005435udz2z1c0tg', 'rivaadityaputra@cbt.com', 'RIVA ADITYA PUTRA', '2025-12-14 08:33:42.276', '2025-12-14 08:33:42.276', '$2b$10$a2AJfW7d4.WgMCjnMmoQN.3GaQ6SEeR8rnVLHPfauITNrmUnqNDNq', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2nv005635udhkikfx5c', 'example23@cbt.com', 'RIZKY WIDODO', '2025-12-14 08:33:42.331', '2025-12-14 08:33:42.331', '$2b$10$DpBpWS3yWRWwolk79ju9aeBvEq5pwx38GPzCyAG3e3Jvt1YnYsTle', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2pd005835udp1ug0523', 'septiairfanramadhan@cbt.com', 'SEPTIA IRFAN RAMADHAN', '2025-12-14 08:33:42.385', '2025-12-14 08:33:42.385', '$2b$10$fgb96s7bHiJBUAOiPAsGyOdzHP3WRL1BQ3NURlOlnW9QrsxqaxHsm', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2qv005a35ud9ybz7pdt', 'example24@cbt.com', 'SUPRIYADI', '2025-12-14 08:33:42.439', '2025-12-14 08:33:42.439', '$2b$10$/fHPGgD5ArqnFXg17lk7lOAPV5ArYq5bS0C0GQx8uJH/QMHNlarAG', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2sd005c35udyl3o8dav', 'tesyaherliana@cbt.com', 'TESYA HERLIANA', '2025-12-14 08:33:42.493', '2025-12-14 08:33:42.493', '$2b$10$XvMktoAKg7/oG.txjwJOxOn1jnZbTvuxIwBo8.qhTCoPvVfW/sSjm', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2tv005e35udpkauz4m3', 'wisnumaulana@cbt.com', 'WISNU MAULANA', '2025-12-14 08:33:42.547', '2025-12-14 08:33:42.547', '$2b$10$plpLK1tpmf./clc4mPg6DuUn0AqoYQjGa3eeAPRwbylsquFw7EGpi', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2vd005g35udsfcg75mb', 'wulanfebriyanti@cbt.com', 'WULAN FEBRIYANTI', '2025-12-14 08:33:42.601', '2025-12-14 08:33:42.601', '$2b$10$qJY6kQrkji64LTqKXhlk5u3s2tl2Sr13cxIb82UeFEOu0iObWx2Ea', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2ww005i35udmbp9bp8d', 'yehezkielkevinraharjo@cbt.com', 'YEHEZKIEL KEVIN RAHARJO', '2025-12-14 08:33:42.656', '2025-12-14 08:33:42.656', '$2b$10$8gdTpZSudlezzOgVk2GLZO7c97Puq3X2FICuk5P08uOdupVqbM6/i', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2ye005k35ud0lbk4bs6', 'yohanesdwiprayoga@cbt.com', 'YOHANES DWI PRAYOGA', '2025-12-14 08:33:42.71', '2025-12-14 08:33:42.71', '$2b$10$f5ECPVBxrDThgEuRQm7tLeKYyTISCXKsj6CM6Kn1o3a45HNFTggCW', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx2zv005m35ud2aj2o8s7', 'example28@cbt.com', 'YUDA WIRASA', '2025-12-14 08:33:42.763', '2025-12-14 08:33:42.763', '$2b$10$kimndO4msuJnUkkv4BoNDuGNABfPBrpZwz5707TApwOzvbgTs92em', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx31d005o35udqv3tt8vd', 'yuliyatimah@cbt.com', 'YULI YATIMAH', '2025-12-14 08:33:42.817', '2025-12-15 09:13:52.78', '$2b$10$FIJQKJNU8kn4aaD0mXT7WuT/yPTaLglP6BoZspMgbkYB1wjgNa0ya', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj8hh49m0000oaudjfiw6g8c', 'petugasabsensi@mail.com', 'Hari', '2025-12-16 11:12:36.058', '2025-12-16 11:12:36.058', '$2b$10$h24kCkRAeGrmZHveE0r19.dhXDmhVVHcbU7aTifSmWP3jK7rAbCAa', 'PETUGAS_ABSENSI');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8xto00215dudxiyqcr71', 'ainiabdcholis.73@gmail.com', 'Aini Abdul Cholis S.Pd.', '2025-12-17 12:17:53.724', '2025-12-17 12:17:53.724', '$2b$10$8d5eRQzqyaHxvTqdaZ0Xb.KMA9t1CccY0MokoaaCeQDO4JUonsm5u', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8xvb00235dudd4xbolii', 'drasuburhindartin@gmail.com', 'Dra. Subur Hindartin', '2025-12-17 12:17:53.783', '2025-12-17 12:17:53.783', '$2b$10$zK5uU3Xgn/ac3yU6KKx1a.8rpjn4D1WG.Ou1Tgucb5L4XQR1izT3C', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8xws00255dudbgtsplon', 'yudiaster1922@gmail.com', 'Dwi Wahyudi, S.T,', '2025-12-17 12:17:53.836', '2025-12-17 12:17:53.836', '$2b$10$YyJs1CrLRs5.2T8BUluBOe7Tj.wvxs2pLYSiyATFXmSTzXj.yGzVe', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8xy800275dudsv8ypuim', 'erlinnoviadiana@gmail.com', 'Erlin Novia Diana, S.E.', '2025-12-17 12:17:53.888', '2025-12-17 12:17:53.888', '$2b$10$/waGiSyB0t9vwLueL9NmFOC0JGkWUtsttc/SQu1V/ASD5ov8y2b3O', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8xzp00295dudiet5g8kd', 'feramegaharistiana@gmail.com', 'Fera Mega Haristina, S.Tr.Kom.', '2025-12-17 12:17:53.941', '2025-12-17 12:17:53.941', '$2b$10$O2yNs147SaOWSNADTQw.cOU9NgObwsUIzUy8QqGMZz7zHvAQx1S.q', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8y16002b5dudps21lpfm', 'franceskoyen16@gmail.com', 'Frances Laurence Setyo Budi, S.Pd.', '2025-12-17 12:17:53.994', '2025-12-17 12:17:53.994', '$2b$10$qTxhgk048vaLAkehVRUGD.gFHI3grpRamVmY4t0uwscnDAUHl9sWW', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8y2n002d5dudjgj6nzx4', 'imtianateguh@gmail.com', 'Imtiana, S.Pd', '2025-12-17 12:17:54.047', '2025-12-17 12:17:54.047', '$2b$10$YAm0kXZlWHCC31rxS2iAL.aNaX6lrF2E56eA5JGY9PClZApF2PX6G', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8y44002f5dudfvho6nza', 'faizabrahammalik@gmail.com', 'M. Fais Jainuddin, S.Pd', '2025-12-17 12:17:54.1', '2025-12-17 12:17:54.1', '$2b$10$pG.E6A1wwK8pFBDxijQ9FeAw7fhH.RYsuoceohV1i8yMB9Ywh1KaC', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8y5n002h5dud9vb23462', 'mohrohim02@gmail.com', 'Moh. Rohim, S.T.', '2025-12-17 12:17:54.155', '2025-12-17 12:17:54.155', '$2b$10$7HH5bidHf8R60YQ1wSPKZOzuLU/PZfNMG0pPwT1GxNl4cDiNXWmlK', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8y73002j5dud9ooury49', 'yunuskacer@gmail.com', 'Moh. Yunus Ansori, S.Pd.', '2025-12-17 12:17:54.207', '2025-12-17 12:17:54.207', '$2b$10$b.XN.kbU9W.rCAo.NtL/4uEYRtWcNjSv23TWqqlJqofhK0Haw4eK.', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8y8l002l5dudo8u4k81t', 'danzia22@gmail.com', 'Mulyono, S.Th.', '2025-12-17 12:17:54.261', '2025-12-17 12:17:54.261', '$2b$10$niDbRCJ5f.6DWxmLfDop2ej9J3nXS6natY9K/38fhMo5xLx/iRm.a', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8ya2002n5dudxxrmi27p', 'nunungindrawati437@gmail.com', 'Nunung Indrawati, S.Pd.', '2025-12-17 12:17:54.314', '2025-12-17 12:17:54.314', '$2b$10$W95AlE618b7g2R0jxnAtFurczP4G2yNzJGpuzoj9GcGDahmaYSiT2', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8ybk002p5dudp5man22v', 'nurmalaevayanti2006@gmail.com', 'Nurmala Evayanti S.Pd.', '2025-12-17 12:17:54.368', '2025-12-17 12:17:54.368', '$2b$10$JuD9MrSjTnn9JjGXK8s8I.s5gFTVjGYCU/Jl/Sg4A8ZDByCBZSvUa', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8ycz002r5duda3p9ojun', 'nurulhidayahse485@gmail.com', 'Nurul Hidayah, S.E.', '2025-12-17 12:17:54.419', '2025-12-17 12:17:54.419', '$2b$10$WCSq4rLN4ICBmTocXomrGOeQeRo2wHcv.9VXzzYb4ms0V561eMzuu', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8yfy002v5dudvf51yqq4', 'purwantisiska25@gmail.com', 'Siska Purwanti, S.E.', '2025-12-17 12:17:54.526', '2025-12-17 12:17:54.526', '$2b$10$sWRMxFzGkLPqKZWFTV5p5.F9yNbQrpSMpBIn4k/ZWipc2GK1oDQpG', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8yhh002x5dud9my7ci8i', 'rizalpecintaseni@gmail.com', 'Syamsul Rizal, S.Pd.I.', '2025-12-17 12:17:54.581', '2025-12-17 12:17:54.581', '$2b$10$CNuEXEu7LJVQRmA.BgEMG.bGjlD36JsK4DkKLfbBV1T/j0XgPIigq', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8yix002z5dudbc4lk8nv', 'udayaniprayuda@gmail.com', 'Udayani, S.Pd.', '2025-12-17 12:17:54.633', '2025-12-17 12:17:54.633', '$2b$10$mx2VrBuCGVqaCRIlMCl6kOpaX2BG3iAbUMUB2dijH3rZGl9bMySye', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8ykf00315duda3u6niqb', 'wahyumirnawati30@gmail.com', 'Wahyu Mirnawati, S.Ak.', '2025-12-17 12:17:54.687', '2025-12-17 12:17:54.687', '$2b$10$dRmoisOlOqhHY5ZTr7ErMeNDuO9E0nIEqWcVVf0qvP30LafIf42r6', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8ynd00355dudycn1e6hi', 'pa717885@gmail.com', 'Maulida Putri Lesmana', '2025-12-17 12:17:54.793', '2025-12-17 12:17:54.793', '$2b$10$tYhChWCpdqZ/5A1bzHFtcu9LZpKS2bIDhETwVIwgDSN0yRbWdggTG', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8you00375dudrf1e71qe', 'ilafebtisherly@gmail.com', 'Ila Febti Sherly M., S.E', '2025-12-17 12:17:54.846', '2025-12-17 12:17:54.846', '$2b$10$UB2xcYNx90qbDQQ3LlMkHOCSfQj.XWLldNJ9bmn4LW59GLZvbrYkm', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj5gx04c001s35udal7y6kqp', 'desimustika@esgriba.com', 'DESY MUSTIKA MAYA SARI', '2025-12-14 08:33:39.036', '2025-12-22 11:46:55.996', '$2b$10$nOCUVw8yH97gwAqDSQhuV.EQOBRd45gtsB79vTyNrDe3dOTi3IP/y', 'SISWA');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8ylv00335dudr8tet2na', 'zulfiamaliyah1306@gmail.com', 'Zulfi Amaliyah, S.Kom', '2025-12-17 12:17:54.739', '2025-12-23 07:48:07.524', '$2b$10$WFyItfPq96XxeDV9hutJweDwS7mRpoHgdeia06BTGTQVYV.upKDkC', 'GURU');
INSERT INTO public."User" (id, email, name, "createdAt", "updatedAt", password, role) VALUES ('cmj9z8yej002t5dudlb0wn4mh', 'rizkielutfi@gmail.com', 'Rizky Lutfi Romadona, S.Kom', '2025-12-17 12:17:54.475', '2025-12-25 11:54:51.909', '$2b$10$u/GAfkYy./EURPHeBYkbRem3Oro.3AcydU2Ptm3mv0yX1KSB3vnTu', 'GURU');


ALTER TABLE public."User" ENABLE TRIGGER ALL;

--
-- Data for Name: Guru; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Guru" DISABLE TRIGGER ALL;

INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8yox00385dudt5p2uvo1', '1234567891', 'Ila Febti Sherly M., S.E', 'ilafebtisherly@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.849', '2025-12-17 12:25:57.706', NULL, 'cmj9z8you00375dudrf1e71qe');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8ybn002q5dud7n4058u9', '5040758659300040', 'Nurmala Evayanti S.Pd.', 'nurmalaevayanti2006@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.371', '2025-12-23 11:57:12.118', NULL, 'cmj9z8ybk002p5dudp5man22v');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8y4a002g5dudjlq4s2jp', '0000000000000066', 'M. Fais Jainuddin, S.Pd', 'faizabrahammalik@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.105', '2025-12-23 11:57:31.914', NULL, 'cmj9z8y44002f5dudfvho6nza');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8y77002k5dudwjch4365', '8834765666130320', 'Moh. Yunus Ansori, S.Pd.', 'yunuskacer@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.211', '2025-12-23 11:58:13.302', NULL, 'cmj9z8y73002j5dud9ooury49');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8xtu00225dudew59ixr7', '8550751654200000', 'Aini Abdul Cholis S.Pd.', 'ainiabdcholis.73@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:53.73', '2025-12-23 11:59:18.368', NULL, 'cmj9z8xto00215dudxiyqcr71');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8y5q002i5dudk3gr40r9', '00000000000023235', 'Moh. Rohim, S.T.', 'mohrohim02@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.158', '2025-12-23 12:02:46.205', NULL, 'cmj9z8y5n002h5dud9vb23462');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8yd4002s5dudqb9lav2o', '0000000000000007878', 'Nurul Hidayah, S.E.', 'nurulhidayahse485@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.423', '2025-12-23 12:01:50.717', NULL, 'cmj9z8ycz002r5duda3p9ojun');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8y8o002m5dudwnycw1jf', '0000000000000006', 'Mulyono, S.Th.', 'danzia22@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.263', '2025-12-23 12:05:31.217', NULL, 'cmj9z8y8l002l5dudo8u4k81t');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8yhl002y5dudqly12oc3', '8549764665110030', 'Syamsul Rizal, S.Pd.I.', 'rizalpecintaseni@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.585', '2025-12-23 12:05:44.242', NULL, 'cmj9z8yhh002x5dud9my7ci8i');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8xyc00285dudgvf5bnnv', '3455763666300010', 'Erlin Novia Diana, S.E.', 'erlinnoviadiana@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:53.891', '2025-12-23 12:06:19.489', NULL, 'cmj9z8xy800275dudsv8ypuim');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8ykj00325dudk20mdgjx', '00000000003444211', 'Wahyu Mirnawati, S.Ak.', 'wahyumirnawati30@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.691', '2025-12-23 12:08:17.471', NULL, 'cmj9z8ykf00315duda3u6niqb');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8y1b002c5dudh3e7fyuu', '0000000023232323', 'Frances Laurence Setyo Budi, S.Pd.', 'franceskoyen16@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:53.998', '2025-12-23 12:08:30.754', NULL, 'cmj9z8y16002b5dudps21lpfm');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8ya7002o5dudm0yzma1k', '5736762663300210', 'Nunung Indrawati, S.Pd.', 'nunungindrawati437@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.318', '2025-12-25 11:59:15.002', NULL, 'cmj9z8ya2002n5dudxxrmi27p');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8xzs002a5dudw0c717l2', '00000000000000022222', 'Fera Mega Haristina, S.Tr.Kom.', 'feramegaharistiana@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:53.943', '2025-12-25 12:04:08.915', NULL, 'cmj9z8xzp00295dudiet5g8kd');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8yg3002w5dud29sel0av', '00000000000000977', 'Siska Purwanti, S.E.', 'purwantisiska25@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.53', '2025-12-25 12:08:06.998', NULL, 'cmj9z8yfy002v5dudvf51yqq4');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8yj000305dudtwddc0j1', '0000000000000010044', 'Udayani, S.Pd.', 'udayaniprayuda@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.635', '2025-12-27 14:54:08.736', NULL, 'cmj9z8yix002z5dudbc4lk8nv');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8yem002u5dudolwskcz4', '1201212121212110', 'Rizky Lutfi Romadona, S.Kom.', 'rizkielutfi@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.477', '2025-12-29 13:49:03.398', NULL, 'cmj9z8yej002t5dudlb0wn4mh');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8ynh00365dudxaiuoy08', '00000000000000076', 'Maulida Putri Lesmana, S.Pd.', 'pa717885@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.797', '2025-12-29 13:51:21.808', NULL, 'cmj9z8ynd00355dudycn1e6hi');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8yly00345dudadjrqvfh', '0000000000000044', 'Zulfi Amaliyah, S.Kom.', 'zulfiamaliyah1306@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.742', '2025-12-29 13:51:25.822', NULL, 'cmj9z8ylv00335dudr8tet2na');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8y2q002e5dud69l0gx00', '00000000000000004', 'Imtiana, S.Pd.', 'imtianateguh@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:54.049', '2025-12-29 13:51:36.674', NULL, 'cmj9z8y2n002d5dudjgj6nzx4');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8xwv00265dud0w98oh1m', '00000000230011444', 'Dwi Wahyudi, S.T.', 'yudiaster1922@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:53.839', '2025-12-29 13:51:43.272', NULL, 'cmj9z8xws00255dudbgtsplon');
INSERT INTO public."Guru" (id, nip, nama, email, "nomorTelepon", status, "createdAt", "updatedAt", "deletedAt", "userId") VALUES ('cmj9z8xvg00245duda7dxbp56', '3449744648300010', 'Dra. Subur Hindartin, S.Pd.', 'drasuburhindartin@gmail.com', '081234567890', 'AKTIF', '2025-12-17 12:17:53.787', '2025-12-29 13:51:53.255', NULL, 'cmj9z8xvb00235dudd4xbolii');


ALTER TABLE public."Guru" ENABLE TRIGGER ALL;

--
-- Data for Name: Jurusan; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Jurusan" DISABLE TRIGGER ALL;

INSERT INTO public."Jurusan" (id, kode, nama, deskripsi, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj5cz42g00034iudqf3vd4tn', 'AK', 'Akuntansi', NULL, '2025-12-14 06:43:19', '2025-12-14 06:43:19', NULL);
INSERT INTO public."Jurusan" (id, kode, nama, deskripsi, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj5czfhl00044iudsyvwnrok', 'TKJ', 'Teknik Komputer dan Jaringan', NULL, '2025-12-14 06:43:33.801', '2025-12-14 06:43:33.801', NULL);
INSERT INTO public."Jurusan" (id, kode, nama, deskripsi, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj5czn6h00054iuds6wh2zr0', 'TKR', 'Teknik Kendaraan Ringan', NULL, '2025-12-14 06:43:43.768', '2025-12-14 06:43:43.768', NULL);


ALTER TABLE public."Jurusan" ENABLE TRIGGER ALL;

--
-- Data for Name: Kelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Kelas" DISABLE TRIGGER ALL;

INSERT INTO public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "waliKelasId", "jurusanId") VALUES ('cmj5ec9zf0000jsudgpxci2hf', 'X Akuntansi', 'X', 30, '2025-12-14 07:21:32.811', '2025-12-14 07:21:32.811', NULL, NULL, 'cmj5cz42g00034iudqf3vd4tn');
INSERT INTO public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "waliKelasId", "jurusanId") VALUES ('cmj5ec9zx0001jsud5cnf1k74', 'XI Akuntansi', 'XI', 30, '2025-12-14 07:21:32.829', '2025-12-14 07:21:32.829', NULL, NULL, 'cmj5cz42g00034iudqf3vd4tn');
INSERT INTO public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "waliKelasId", "jurusanId") VALUES ('cmj5eca050002jsudq5rc3oa3', 'XII Akuntansi', 'XII', 30, '2025-12-14 07:21:32.837', '2025-12-14 07:21:32.837', NULL, NULL, 'cmj5cz42g00034iudqf3vd4tn');
INSERT INTO public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "waliKelasId", "jurusanId") VALUES ('cmj5eca0e0003jsud1uxj50o4', 'X Teknik Komputer dan Jaringan', 'X', 30, '2025-12-14 07:21:32.846', '2025-12-14 07:21:32.846', NULL, NULL, 'cmj5czfhl00044iudsyvwnrok');
INSERT INTO public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "waliKelasId", "jurusanId") VALUES ('cmj5eca0k0004jsuddjewnal1', 'XI Teknik Komputer dan Jaringan', 'XI', 30, '2025-12-14 07:21:32.852', '2025-12-14 07:21:32.852', NULL, NULL, 'cmj5czfhl00044iudsyvwnrok');
INSERT INTO public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "waliKelasId", "jurusanId") VALUES ('cmj5eca0o0005jsud0ambwla7', 'XII Teknik Komputer dan Jaringan', 'XII', 30, '2025-12-14 07:21:32.856', '2025-12-14 07:21:32.856', NULL, NULL, 'cmj5czfhl00044iudsyvwnrok');
INSERT INTO public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "waliKelasId", "jurusanId") VALUES ('cmj5eca0w0006jsud9bca11b3', 'X Teknik Kendaraan Ringan', 'X', 30, '2025-12-14 07:21:32.864', '2025-12-14 07:21:32.864', NULL, NULL, 'cmj5czn6h00054iuds6wh2zr0');
INSERT INTO public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "waliKelasId", "jurusanId") VALUES ('cmj5eca130007jsudvzwt5rjx', 'XI Teknik Kendaraan Ringan', 'XI', 30, '2025-12-14 07:21:32.871', '2025-12-14 07:21:32.871', NULL, NULL, 'cmj5czn6h00054iuds6wh2zr0');
INSERT INTO public."Kelas" (id, nama, tingkat, kapasitas, "createdAt", "updatedAt", "deletedAt", "waliKelasId", "jurusanId") VALUES ('cmj5eca170008jsudb4r1h58n', 'XII Teknik Kendaraan Ringan', 'XII', 30, '2025-12-14 07:21:32.875', '2025-12-14 07:21:32.875', NULL, NULL, 'cmj5czn6h00054iuds6wh2zr0');


ALTER TABLE public."Kelas" ENABLE TRIGGER ALL;

--
-- Data for Name: TahunAjaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."TahunAjaran" DISABLE TRIGGER ALL;

INSERT INTO public."TahunAjaran" (id, tahun, "tanggalMulai", "tanggalSelesai", status, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj5cxv7e00014iudyynxuvmc', '2025/2026', '2025-12-16 00:00:00', '2026-02-19 00:00:00', 'AKTIF', '2025-12-14 06:42:20.858', '2025-12-17 07:23:20.52', NULL);


ALTER TABLE public."TahunAjaran" ENABLE TRIGGER ALL;

--
-- Data for Name: Siswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Siswa" DISABLE TRIGGER ALL;

INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwyqw000135udakhyrrna', '81475874', 'ABI HARTO WICAKSONO', '1970-01-01 00:00:38.367', 'Jl. Merdeka No. 123', '81234567890', 'abihartowicaksono@cbt.com', 'AKTIF', '2025-12-14 08:33:37.255', '2025-12-14 08:33:37.255', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gwyql000035udj9kefx0z', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwysk000335ud06zbjkum', '95805399', 'ADAM SYAHREZA GUMILANG', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 45', '81234567891', 'adamsyahrezagumilang@cbt.com', 'AKTIF', '2025-12-14 08:33:37.315', '2025-12-14 08:33:37.315', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gwysf000235udeqpf8mo9', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwyu3000535udp8xm32kg', '3088037976', 'ADITIYA RIZKY BAYU PRADIKA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 46', '81234567892', 'aditiyarizkybayupradika@cbt.com', 'AKTIF', '2025-12-14 08:33:37.371', '2025-12-14 08:33:37.371', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gwytz000435ud3k5i6zne', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwyvo000735udytelfevq', '84194598', 'ADITYA CATUR PRAYOGO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 47', '81234567893', 'adityacaturprayogo@cbt.com', 'AKTIF', '2025-12-14 08:33:37.427', '2025-12-14 08:33:37.427', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gwyvj000635udzcqos5da', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwyx9000935ud28f9ggyr', '108737154', 'ADITYA DAMARA PUTRA KRISTIAWAN', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 48', '81234567894', 'example12@cbt.com', 'AKTIF', '2025-12-14 08:33:37.485', '2025-12-14 08:33:37.485', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gwyx4000835udq2k2tbxp', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwz0g000d35ud5n8q889d', '77382296', 'AGUNG TRISNA DEWI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 50', '81234567896', 'agungtrisnadewi@cbt.com', 'AKTIF', '2025-12-14 08:33:37.599', '2025-12-14 08:33:37.599', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gwz0c000c35udn9g3zoan', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwz23000f35udoygf650d', '86881070', 'AGUS WIRA ADI PURNOMO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 51', '81234567897', 'aguswiraadipurnomo@cbt.com', 'AKTIF', '2025-12-14 08:33:37.659', '2025-12-14 08:33:37.659', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gwz1y000e35udzacwpk0x', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwz3n000h35udillr14ag', '99461767', 'AHMAD DIMAS KURNIAWAN', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 52', '81234567898', 'example1@cbt.com', 'AKTIF', '2025-12-14 08:33:37.714', '2025-12-14 08:33:37.714', NULL, 'cmj5eca0w0006jsud9bca11b3', 'cmj5gwz3i000g35udydzzmr53', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwz6t000l35ud8wsvgkyz', '99396650', 'AINO YOEL', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 54', '81234567900', 'example2@cbt.com', 'AKTIF', '2025-12-14 08:33:37.828', '2025-12-14 08:33:37.828', NULL, 'cmj5eca0w0006jsud9bca11b3', 'cmj5gwz6p000k35ud68fsf33i', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwz8c000n35ud8pxa34ep', '50397766', 'AINUR ROHMAH', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 55', '81234567901', 'ainurrohmah@cbt.com', 'AKTIF', '2025-12-14 08:33:37.883', '2025-12-14 08:33:37.883', NULL, 'cmj5ec9zx0001jsud5cnf1k74', 'cmj5gwz88000m35ud5x4ctx7s', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwz9u000p35uddazsd00z', '79686226', 'ALDI PRAYATNA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 56', '81234567902', 'aldiprayatna@cbt.com', 'AKTIF', '2025-12-14 08:33:37.937', '2025-12-14 08:33:37.937', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gwz9q000o35ud7f7d7ltw', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzeh000v35udwd1xnzk8', '97678393', 'ALFAZA OKTAVINO PRADITIA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 59', '81234567905', 'example13@cbt.com', 'AKTIF', '2025-12-14 08:33:38.105', '2025-12-14 08:33:38.105', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gwzed000u35udlnddwq47', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzg0000x35udzy1o8cpn', '97759070', 'ALIFATUR ROSIKIN', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 60', '81234567906', 'alifaturrosikin@cbt.com', 'AKTIF', '2025-12-14 08:33:38.16', '2025-12-14 08:33:38.16', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gwzfw000w35udzc26ap9b', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzhi000z35udkij11ubh', '85609468', 'AMELIA DEWI SINTA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 61', '81234567907', 'ameliadewisinta@cbt.com', 'AKTIF', '2025-12-14 08:33:38.214', '2025-12-14 08:33:38.214', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gwzhe000y35udg8o4lrsn', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzj2001135udp7u21il5', '94461900', 'ANANDA MAYCKO WIJAYA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 62', '81234567908', 'example3@cbt.com', 'AKTIF', '2025-12-14 08:33:38.269', '2025-12-14 08:33:38.269', NULL, 'cmj5eca0w0006jsud9bca11b3', 'cmj5gwziy001035udhbgntn1o', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzkk001335uddaybproj', '88279036', 'ANDHIKA BAYU SAPUTRA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 63', '81234567909', 'andhikabayusaputra@cbt.com', 'AKTIF', '2025-12-14 08:33:38.324', '2025-12-14 08:33:38.324', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gwzkg001235uda1zowq2b', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzm3001535ud35s55raa', '104207471', 'ANGGA CAHYO PRATAMA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 64', '81234567910', 'example4@cbt.com', 'AKTIF', '2025-12-14 08:33:38.378', '2025-12-14 08:33:38.378', NULL, 'cmj5eca0w0006jsud9bca11b3', 'cmj5gwzlz001435udoar1p1ou', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwznm001735udpzuadsi6', '87785971', 'ANGGI VIRNANDA PUTRI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 65', '81234567911', 'anggivirnandaputri@cbt.com', 'AKTIF', '2025-12-14 08:33:38.434', '2025-12-14 08:33:38.434', NULL, 'cmj5ec9zx0001jsud5cnf1k74', 'cmj5gwzni001635udt2intkub', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzp6001935udi39qku1d', '3080015591', 'AWANG SETIAWAN', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 66', '81234567912', 'awangsetiawan@cbt.com', 'AKTIF', '2025-12-14 08:33:38.489', '2025-12-14 08:33:38.489', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gwzp2001835udtswr5q1s', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzqp001b35udoas61cxe', '95325705', 'AYUNI ARIMBI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 67', '81234567913', 'example25@cbt.com', 'AKTIF', '2025-12-14 08:33:38.544', '2025-12-14 08:33:38.544', NULL, 'cmj5ec9zf0000jsudgpxci2hf', 'cmj5gwzql001a35udfoqzqfcv', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzs8001d35ud78grtko5', '88137615', 'AZAI DENIS SAFARULLAH', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 68', '81234567914', 'example5@cbt.com', 'AKTIF', '2025-12-14 08:33:38.599', '2025-12-14 08:33:38.599', NULL, 'cmj5eca0w0006jsud9bca11b3', 'cmj5gwzs4001c35udaqgx22e1', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwztr001f35udgp2iqne6', '99940723', 'BADRIA NUR ANISA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 69', '81234567915', 'example14@cbt.com', 'AKTIF', '2025-12-14 08:33:38.654', '2025-12-14 08:33:38.654', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gwztn001e35udd3b8c4mg', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzv9001h35udc6lry71w', '85744170', 'BAGUS SETIAWAN', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 70', '81234567916', 'bagussetiawan@cbt.com', 'AKTIF', '2025-12-14 08:33:38.708', '2025-12-14 08:33:38.708', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gwzv5001g35ud5bbn2qzz', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzws001j35ud376v2a11', '3096187956', 'CANDRA PRATAMA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 71', '81234567917', 'example6@cbt.com', 'AKTIF', '2025-12-14 08:33:38.764', '2025-12-14 08:33:38.764', NULL, 'cmj5eca0w0006jsud9bca11b3', 'cmj5gwzwo001i35uduhbzcboi', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzzu001n35udi1ekaazg', '3080427888', 'DAVA PUTRA PRASETYA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 73', '81234567919', 'davaputraprasetya@cbt.com', 'AKTIF', '2025-12-14 08:33:38.874', '2025-12-14 08:33:38.874', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gwzzr001m35udpblpr5c0', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx01e001p35udcjqmly7n', '75360603', 'DEFI NINGTYAS', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 74', '81234567920', 'definingtyas@cbt.com', 'AKTIF', '2025-12-14 08:33:38.929', '2025-12-14 08:33:38.929', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gx01a001o35udcz1uye9r', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzbe000r35ud3dm0w5mp', '57279011', 'ALDO ILFAN PRATAMA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 57', '81234567903', 'aldoilfanpratama@cbt.com', 'AKTIF', '2025-12-14 08:33:37.994', '2025-12-16 12:33:14.38', NULL, 'cmj5eca170008jsudb4r1h58n', 'cmj5gwzb9000q35uds8mmj6bl', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwz58000j35ud2jgpgotd', '86817502', 'AHMAD RIAN ZUHRI AFANDI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 53', '81234567899', 'ahmadrianzuhriafandi@cbt.com', 'AKTIF', '2025-12-14 08:33:37.771', '2025-12-16 12:33:17.609', NULL, 'cmj5eca170008jsudb4r1h58n', 'cmj5gwz53000i35udw6fgqktc', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwyyw000b35udpo5b2m4t', '76544902', 'ADRIANO DWI PRADHITA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 49', '81234567895', 'adrianodwipradhita@cbt.com', 'AKTIF', '2025-12-14 08:33:37.543', '2025-12-16 12:33:21.091', NULL, 'cmj5eca170008jsudb4r1h58n', 'cmj5gwyyq000a35udwqnc8ohp', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzcy000t35ud1wibxk47', '78367595', 'ALFA TRI EFENDI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 58', '81234567904', 'alfatriefendi@cbt.com', 'AKTIF', '2025-12-14 08:33:38.049', '2025-12-16 12:33:11.1', NULL, 'cmj5eca170008jsudb4r1h58n', 'cmj5gwzct000s35udllh69h8u', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx02w001r35ud6qdfidog', '86514583', 'DENDI BAYU PRATAMA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 75', '81234567921', 'dendibayupratama@cbt.com', 'AKTIF', '2025-12-14 08:33:38.983', '2025-12-14 08:33:38.983', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gx02s001q35udsc32mvtz', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx05x001v35udwd5nk8nj', '71300771', 'DEWI WAHYUNI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 77', '81234567923', 'dewiwahyuni@cbt.com', 'AKTIF', '2025-12-14 08:33:39.093', '2025-12-14 08:33:39.093', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gx05t001u35ud56w1gpg0', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx07f001x35udj3ispkx8', '74612857', 'DINA RIZA AYU MATUSSHOLEHA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 78', '81234567924', 'dinarizaayumatussholeha@cbt.com', 'AKTIF', '2025-12-14 08:33:39.147', '2025-12-14 08:33:39.147', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx07b001w35ud6uy774vt', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx08y001z35udsqo698l8', '88236354', 'DINO ABI PRATAMA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 79', '81234567925', 'dinoabipratama@cbt.com', 'AKTIF', '2025-12-14 08:33:39.201', '2025-12-14 08:33:39.201', NULL, 'cmj5eca0k0004jsuddjewnal1', 'cmj5gx08u001y35udh95b095v', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0ag002135ud9fhzdekh', '84607003', 'DIZA YOGA YUDISTIA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 80', '81234567926', 'dizayogayudistia@cbt.com', 'AKTIF', '2025-12-14 08:33:39.256', '2025-12-14 08:33:39.256', NULL, 'cmj5ec9zx0001jsud5cnf1k74', 'cmj5gx0ac002035udfnj8z7vm', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0c0002335udrmwctcnm', '108153368', 'DWI AYU MEI JAYANTI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 81', '81234567927', 'example15@cbt.com', 'AKTIF', '2025-12-14 08:33:39.311', '2025-12-14 08:33:39.311', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gx0bv002235ud9wy5giy5', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0di002535ud32uasdbw', '85947084', 'DWI SINTIA PUTRI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 82', '81234567928', 'dwisintiaputri@cbt.com', 'AKTIF', '2025-12-14 08:33:39.365', '2025-12-14 08:33:39.365', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gx0de002435ud24zdsw0s', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0ez002735ud6aegx8z1', '83725353', 'EKA DEVI AINUROHMA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 83', '81234567929', 'ekadeviainurohma@cbt.com', 'AKTIF', '2025-12-14 08:33:39.419', '2025-12-14 08:33:39.419', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx0ev002635udvv65yg6g', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0gi002935udl20nfbog', '24142799', 'ENGGAR DWI PRASETYO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 84', '81234567930', 'enggardwiprasetyo@cbt.com', 'AKTIF', '2025-12-14 08:33:39.474', '2025-12-14 08:33:39.474', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gx0gd002835udbw0sqmi6', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0i0002b35ud19a6xd7r', '76887989', 'ESA AGIL PUTRA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 85', '81234567931', 'esaagilputra@cbt.com', 'AKTIF', '2025-12-14 08:33:39.528', '2025-12-14 08:33:39.528', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gx0hw002a35udavq9oyfo', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0jj002d35udjlza7xue', '82535073', 'FAHMI ADLIYANTO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 86', '81234567932', 'fahmiadliyanto@cbt.com', 'AKTIF', '2025-12-14 08:33:39.582', '2025-12-14 08:33:39.582', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gx0jf002c35udq9gtxbg2', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0l0002f35ud6j2sufzk', '3087966253', 'FAREL ADITYA PUTRA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 87', '81234567933', 'fareladityaputra@cbt.com', 'AKTIF', '2025-12-14 08:33:39.635', '2025-12-14 08:33:39.635', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gx0kw002e35ud03ae2xo1', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0ml002h35udvjc8yzeb', '78956609', 'FATURROHMAN', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 88', '81234567934', 'faturrohman@cbt.com', 'AKTIF', '2025-12-14 08:33:39.692', '2025-12-14 08:33:39.692', NULL, 'cmj5eca0k0004jsuddjewnal1', 'cmj5gx0mf002g35udp7fvgdod', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0o3002j35uda0ok0i4j', '108026037', 'FERDIO PUTRA PRASETYA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 89', '81234567935', 'example16@cbt.com', 'AKTIF', '2025-12-14 08:33:39.747', '2025-12-14 08:33:39.747', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gx0nz002i35udbi0v5c4g', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0pm002l35udhnyriry6', '83278579', 'FIOLA SEPTIANA RAMADANI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 90', '81234567936', 'fiolaseptianaramadani@cbt.com', 'AKTIF', '2025-12-14 08:33:39.802', '2025-12-14 08:33:39.802', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx0pi002k35udwebdytrh', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0r4002n35ud6i7qxccl', '91017410', 'FIQI ADITIA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 91', '81234567937', 'fiqiaditia@cbt.com', 'AKTIF', '2025-12-14 08:33:39.855', '2025-12-14 08:33:39.855', NULL, 'cmj5eca0k0004jsuddjewnal1', 'cmj5gx0r0002m35udzu8e92kf', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0sm002p35udzxd3mus1', '73255473', 'FITRIANA EKA AMELIA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 92', '81234567938', 'fitrianaekaamelia@cbt.com', 'AKTIF', '2025-12-14 08:33:39.91', '2025-12-14 08:33:39.91', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx0si002o35ud2jnff2tj', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0u3002r35udqkenscl3', '81943244', 'HERNANDA WILDAN FIRDAUSI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 93', '81234567939', 'hernandawildanfirdausi@cbt.com', 'AKTIF', '2025-12-14 08:33:39.962', '2025-12-14 08:33:39.962', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gx0tz002q35udykvj7rwf', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0vl002t35udzzptrcos', '91150081', 'HUMAM FAUZI YANTO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 94', '81234567940', 'example7@cbt.com', 'AKTIF', '2025-12-14 08:33:40.017', '2025-12-14 08:33:40.017', NULL, 'cmj5eca0w0006jsud9bca11b3', 'cmj5gx0vh002s35udu1n8yl9k', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0x4002v35udz7qohe6d', '82276835', 'ICHA JUWITA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 95', '81234567941', 'ichajuwita@cbt.com', 'AKTIF', '2025-12-14 08:33:40.072', '2025-12-14 08:33:40.072', NULL, 'cmj5eca0k0004jsuddjewnal1', 'cmj5gx0x0002u35udc7ccpufd', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx0ym002x35udzhcjnau4', '83877893', 'INA AZRIANA DEVI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 96', '81234567942', 'inaazrianadevi@cbt.com', 'AKTIF', '2025-12-14 08:33:40.125', '2025-12-14 08:33:40.125', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx0yj002w35ud8v9qi589', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx103002z35udn2m30zv3', '3083956550', 'INTAN BALQIS HUMAIRO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 97', '81234567943', 'intanbalqishumairo@cbt.com', 'AKTIF', '2025-12-14 08:33:40.178', '2025-12-14 08:33:40.178', NULL, 'cmj5eca0k0004jsuddjewnal1', 'cmj5gx100002y35udilmg1ny8', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx11k003135ud73cds1fi', '93398824', 'JENI EKA NURSABELA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 98', '81234567944', 'jeniekanursabela@cbt.com', 'AKTIF', '2025-12-14 08:33:40.232', '2025-12-14 08:33:40.232', NULL, 'cmj5ec9zx0001jsud5cnf1k74', 'cmj5gx11g003035ud3bx82k5d', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx131003335ud6cxmwwir', '27420464', 'JESEN ARDIYANTO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 99', '81234567945', 'jesenardiyanto@cbt.com', 'AKTIF', '2025-12-14 08:33:40.285', '2025-12-14 08:33:40.285', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gx12x003235udw6jxtx4r', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx14k003535udo7rhjcnp', '71482878', 'JESIKA MARTA AL-ZAHRA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 100', '81234567946', 'jesikamartaal-zahra@cbt.com', 'AKTIF', '2025-12-14 08:33:40.339', '2025-12-14 08:33:40.339', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx14g003435ud6w8b4goi', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx162003735ud5de1cxbc', '84405603', 'JOSHUA BAGUS NUGROHO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 101', '81234567947', 'joshuabagusnugroho@cbt.com', 'AKTIF', '2025-12-14 08:33:40.394', '2025-12-14 08:33:40.394', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gx15y003635udfzfvsnsn', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx17k003935udaewx76ro', '98437959', 'KETUT DIMAS MUHAMAD RISAL', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 102', '81234567948', 'example17@cbt.com', 'AKTIF', '2025-12-14 08:33:40.447', '2025-12-14 08:33:40.447', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gx17g003835uduzmy772u', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx193003b35udn6l73ohj', '3102507572', 'KEVIN MAULANA ISHAQ', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 103', '81234567949', 'example8@cbt.com', 'AKTIF', '2025-12-14 08:33:40.503', '2025-12-14 08:33:40.503', NULL, 'cmj5eca0w0006jsud9bca11b3', 'cmj5gx18z003a35udlra3qj4l', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1c3003f35udp6zso1o3', '76188634', 'KHALUD SAIFUL ANWAR', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 105', '81234567951', 'khaludsaifulanwar@cbt.com', 'AKTIF', '2025-12-14 08:33:40.61', '2025-12-14 08:33:40.61', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gx1bz003e35udkcmtj455', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1dj003h35udb14ouf8y', '82219934', 'LIANA RANTIKA PUTRI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 106', '81234567952', 'lianarantikaputri@cbt.com', 'AKTIF', '2025-12-14 08:33:40.663', '2025-12-14 08:33:40.663', NULL, 'cmj5ec9zx0001jsud5cnf1k74', 'cmj5gx1dg003g35udnuykpero', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1f1003j35udutcxv8c7', '81662471', 'LIVIAN AYUNING UTAMI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 107', '81234567953', 'livianayuningutami@cbt.com', 'AKTIF', '2025-12-14 08:33:40.717', '2025-12-14 08:33:40.717', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx1ex003i35ud2tmr6ezm', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1gj003l35udh98cts8w', '94280655', 'LUCKY ADITYA PRATAMA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 108', '81234567954', 'luckyadityapratama@cbt.com', 'AKTIF', '2025-12-14 08:33:40.77', '2025-12-14 08:33:40.77', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gx1gf003k35udqn4te1zt', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1ji003p35udxuz53ke6', '3088988176', 'M. BAGAS SANTOSO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 110', '81234567956', 'mbagassantoso@cbt.com', 'AKTIF', '2025-12-14 08:33:40.878', '2025-12-14 08:33:40.878', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gx1je003o35udc4kp1c2m', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1l1003r35udz4zykbfo', '3088352964', 'M. BAGUS SATRIO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 111', '81234567957', 'mbagussatrio@cbt.com', 'AKTIF', '2025-12-14 08:33:40.933', '2025-12-14 08:33:40.933', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gx1kx003q35udsvrwk0yg', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1mi003t35udec1w0c85', '97802751', 'M. SAIFURROSI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 112', '81234567958', 'example9@cbt.com', 'AKTIF', '2025-12-14 08:33:40.986', '2025-12-14 08:33:40.986', NULL, 'cmj5eca0w0006jsud9bca11b3', 'cmj5gx1mf003s35udmkcekzi3', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1o2003v35udzn7dj9ls', '93234409', 'M. YUSRON GINANDA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 113', '81234567959', 'example18@cbt.com', 'AKTIF', '2025-12-14 08:33:41.041', '2025-12-14 08:33:41.041', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gx1nx003u35udc8a2l13v', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1pk003x35udstmkp6g7', '78252676', 'MARCEL GALIH GINANJAR', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 114', '81234567960', 'marcelgalihginanjar@cbt.com', 'AKTIF', '2025-12-14 08:33:41.095', '2025-12-14 08:33:41.095', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gx1pg003w35ud8n0lxpp8', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1u3004335udkj267fhr', '82560328', 'MOH. AMAR MA''RUF', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 117', '81234567963', 'example10000@example.com', 'AKTIF', '2025-12-14 08:33:41.258', '2025-12-14 08:33:41.258', NULL, 'cmj5eca0w0006jsud9bca11b3', 'cmj5gx1tz004235udd1rv3ppx', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1vm004535udc4l2kzg5', '94760422', 'MOH. BAYU AINURROHMAN', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 118', '81234567964', 'mohbayuainurrohman@cbt.com', 'AKTIF', '2025-12-14 08:33:41.314', '2025-12-14 08:33:41.314', NULL, 'cmj5eca0k0004jsuddjewnal1', 'cmj5gx1vi004435ud0rdy53xd', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1x5004735udoeer6a1p', '3093129285', 'MOH. RADITH MUSTOFA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 119', '81234567965', 'example10@cbt.com', 'AKTIF', '2025-12-14 08:33:41.368', '2025-12-14 08:33:41.368', NULL, 'cmj5eca0w0006jsud9bca11b3', 'cmj5gx1x1004635udvhadbran', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx206004b35uduf215trn', '89145134', 'MUHAMAD RISKI NEO VALENTINO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 121', '81234567967', 'example19@cbt.com', 'AKTIF', '2025-12-14 08:33:41.477', '2025-12-14 08:33:41.477', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gx202004a35uditlzqygw', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx21o004d35udxjptvn08', '119631620', 'MUHAMMAD RIZKI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 122', '81234567968', 'example20@cbt.com', 'AKTIF', '2025-12-14 08:33:41.532', '2025-12-14 08:33:41.532', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gx21k004c35udlo92ywg1', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx234004f35udt3s4ka40', '101593710', 'MUHAMMAD ZAINAL ABIDIN', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 123', '81234567969', 'example11@cbt.com', 'AKTIF', '2025-12-14 08:33:41.584', '2025-12-14 08:33:41.584', NULL, 'cmj5eca0w0006jsud9bca11b3', 'cmj5gx231004e35udeisgbcya', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx24m004h35udvyljawbl', '83159381', 'NADIATUZZAHROH', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 124', '81234567970', 'nadiatuzzahroh@cbt.com', 'AKTIF', '2025-12-14 08:33:41.637', '2025-12-14 08:33:41.637', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx24i004g35udt6qrnb7l', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx264004j35ud8hnkcdnj', '95829771', 'NAUFAL DZAKI HANIF ABIYYI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 125', '81234567971', 'example21@cbt.com', 'AKTIF', '2025-12-14 08:33:41.691', '2025-12-14 08:33:41.691', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gx260004i35udriuw72oc', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx27k004l35udp3ylddi4', '74347595', 'NAYSILA NADINE CEYSEANA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 126', '81234567972', 'naysilanadineceyseana@cbt.com', 'AKTIF', '2025-12-14 08:33:41.744', '2025-12-14 08:33:41.744', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx27h004k35udvdyo2fwy', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2ak004p35udjg0jhfie', '79295893', 'NUKE KUSUMA WARDANI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 128', '81234567974', 'nukekusumawardani@cbt.com', 'AKTIF', '2025-12-14 08:33:41.852', '2025-12-14 08:33:41.852', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx2ag004o35udqr0i50ow', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2c1004r35udtqywx9eq', '78151631', 'NURHASAN', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 129', '81234567975', 'example27@cbt.com', 'AKTIF', '2025-12-14 08:33:41.905', '2025-12-14 08:33:41.905', NULL, 'cmj5ec9zf0000jsudgpxci2hf', 'cmj5gx2bx004q35udncso3x1e', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2dj004t35udiz37sd6e', '65243793', 'PHILIPUS JAYA BALAN RAKASIWI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 130', '81234567976', 'philipusjayabalanrakasiwi@cbt.com', 'AKTIF', '2025-12-14 08:33:41.958', '2025-12-14 08:33:41.958', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gx2dg004s35udfhoy10rz', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2gi004x35ud0wei40by', '81034228', 'RAVADAL ADHA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 132', '81234567978', 'ravadaladha@cbt.com', 'AKTIF', '2025-12-14 08:33:42.066', '2025-12-14 08:33:42.066', NULL, 'cmj5ec9zx0001jsud5cnf1k74', 'cmj5gx2gf004w35udlkyaly82', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2i0004z35udecgz1nlq', '99114829', 'RAZKY GABRIL WAHYUDI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 133', '81234567979', 'example22@cbt.com', 'AKTIF', '2025-12-14 08:33:42.119', '2025-12-14 08:33:42.119', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gx2hw004y35udh3y17ie4', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2jh005135udtbcxbtb9', '71528590', 'REZY ANGGARA BAHARI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 134', '81234567980', 'rezyanggarabahari@cbt.com', 'AKTIF', '2025-12-14 08:33:42.172', '2025-12-14 08:33:42.172', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx2jd005035udyuohrs2j', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2kx005335udc4757qsp', '98069279', 'RIDHO IRWANSYAH', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 135', '81234567981', 'ridhoirwansyah@cbt.com', 'AKTIF', '2025-12-14 08:33:42.225', '2025-12-14 08:33:42.225', NULL, 'cmj5eca0k0004jsuddjewnal1', 'cmj5gx2ku005235udqtgs17js', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2mh005535ud6oic8o1p', '82598502', 'RIVA ADITYA PUTRA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 136', '81234567982', 'rivaadityaputra@cbt.com', 'AKTIF', '2025-12-14 08:33:42.28', '2025-12-14 08:33:42.28', NULL, 'cmj5eca130007jsudvzwt5rjx', 'cmj5gx2mc005435udz2z1c0tg', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1yo004935ud3pslwtt1', '78005721', 'MOHAMMAD ZIDAN MAULANA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 120', '81234567966', 'mohammadzidanmaulana@cbt.com', 'AKTIF', '2025-12-14 08:33:41.424', '2025-12-16 12:32:56.951', NULL, 'cmj5eca170008jsudb4r1h58n', 'cmj5gx1yk004835ud9hcuxcvr', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1i0003n35udv6gnc1l1', '67491019', 'LUKMAN AFANDI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 109', '81234567955', 'lukmanafandi@cbt.com', 'AKTIF', '2025-12-14 08:33:40.824', '2025-12-16 12:33:00.633', NULL, 'cmj5eca170008jsudb4r1h58n', 'cmj5gx1hw003m35udhjaaqojj', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1sk004135udexpydl8s', '29537229', 'MINEL ASARI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 116', '81234567962', 'minelasari@cbt.com', 'AKTIF', '2025-12-14 08:33:41.204', '2025-12-16 12:33:37.138', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gx1sg004035udzqsyoalc', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1r2003z35udbet34tx1', '81962676', 'MAZELLO ITO AFRIANZIE', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 115', '81234567961', 'mazelloitoafrianzie@cbt.com', 'AKTIF', '2025-12-14 08:33:41.15', '2025-12-16 12:33:40.619', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gx1qy003y35udt05qd1id', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx292004n35ud17iskv1j', '89544490', 'NOUVAL YURI SAPUTRA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 127', '81234567973', 'nouvalyurisaputra@cbt.com', 'AKTIF', '2025-12-14 08:33:41.796', '2025-12-16 12:32:51.295', NULL, 'cmj5eca170008jsudb4r1h58n', 'cmj5gx28x004m35udws9r11al', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2ny005735udgqgfno56', '109444333', 'RIZKY WIDODO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 137', '81234567983', 'example23@cbt.com', 'AKTIF', '2025-12-14 08:33:42.334', '2025-12-14 08:33:42.334', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gx2nv005635udhkikfx5c', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2qz005b35ud4370ott0', '113396361', 'SUPRIYADI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 139', '81234567985', 'example24@cbt.com', 'AKTIF', '2025-12-14 08:33:42.443', '2025-12-14 08:33:42.443', NULL, 'cmj5eca0e0003jsud1uxj50o4', 'cmj5gx2qv005a35ud9ybz7pdt', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2sg005d35udvqbnlkoz', '86217954', 'TESYA HERLIANA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 140', '81234567986', 'tesyaherliana@cbt.com', 'AKTIF', '2025-12-14 08:33:42.496', '2025-12-14 08:33:42.496', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx2sd005c35udyl3o8dav', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2u0005f35udktuxz1uv', '75001728', 'WISNU MAULANA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 141', '81234567987', 'wisnumaulana@cbt.com', 'AKTIF', '2025-12-14 08:33:42.551', '2025-12-14 08:33:42.551', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx2tv005e35udpkauz4m3', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2vh005h35udn702xrb0', '83757487', 'WULAN FEBRIYANTI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 142', '81234567988', 'wulanfebriyanti@cbt.com', 'AKTIF', '2025-12-14 08:33:42.605', '2025-12-14 08:33:42.605', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx2vd005g35udsfcg75mb', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2zz005n35udbo6v7qv9', '97561362', 'YUDA WIRASA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 145', '81234567991', 'example28@cbt.com', 'AKTIF', '2025-12-14 08:33:42.766', '2025-12-14 08:33:42.766', NULL, 'cmj5ec9zf0000jsudgpxci2hf', 'cmj5gx2zv005m35ud2aj2o8s7', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2yi005l35udcr748bi3', '79467322', 'YOHANES DWI PRAYOGA', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 144', '81234567990', 'yohanesdwiprayoga@cbt.com', 'AKTIF', '2025-12-14 08:33:42.713', '2025-12-16 12:32:37.753', NULL, 'cmj5eca170008jsudb4r1h58n', 'cmj5gx2ye005k35ud0lbk4bs6', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2ph005935udv1g8ipeb', '77627927', 'SEPTIA IRFAN RAMADHAN', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 138', '81234567984', 'septiairfanramadhan@cbt.com', 'AKTIF', '2025-12-14 08:33:42.388', '2025-12-16 12:32:41.218', NULL, 'cmj5eca170008jsudb4r1h58n', 'cmj5gx2pd005835udp1ug0523', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2f2004v35udq20lwbo0', '78440641', 'RAHMAD FIRMANSYAH', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 131', '81234567977', 'rahmadfirmansyah@cbt.com', 'AKTIF', '2025-12-14 08:33:42.013', '2025-12-16 12:32:46.386', NULL, 'cmj5eca170008jsudb4r1h58n', 'cmj5gx2ey004u35udtxb4t3ri', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx1al003d35udbg9vhv2a', '72745125', 'KHAIRUL RIZAL FAUZI TUKIMIN', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 104', '81234567950', 'khairulrizalfauzitukimin@cbt.com', 'AKTIF', '2025-12-14 08:33:40.557', '2025-12-16 12:33:03.952', NULL, 'cmj5eca170008jsudb4r1h58n', 'cmj5gx1ai003c35udrndkgaz9', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gwzyc001l35udnzueuy9e', '69853933', 'DANU BAGUS PRAYOGO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 72', '81234567918', 'danubagusprayogo@cbt.com', 'AKTIF', '2025-12-14 08:33:38.819', '2025-12-16 12:33:07.513', NULL, 'cmj5eca170008jsudb4r1h58n', 'cmj5gwzy7001k35udjqgqcye1', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx31i005p35ud17ebh91g', '71347347', 'YULI YATIMAH', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 146', '81234567992', 'yuliyatimah@cbt.com', 'AKTIF', '2025-12-14 08:33:42.821', '2025-12-16 12:33:27.522', NULL, 'cmj5eca050002jsudq5rc3oa3', 'cmj5gx31d005o35udqv3tt8vd', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx2wz005j35ud2ivwa2j0', '88579651', 'YEHEZKIEL KEVIN RAHARJO', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 143', '81234567989', 'yehezkielkevinraharjo@cbt.com', 'AKTIF', '2025-12-14 08:33:42.658', '2025-12-16 12:33:30.953', NULL, 'cmj5eca0o0005jsud0ambwla7', 'cmj5gx2ww005i35udmbp9bp8d', 'cmj5cxv7e00014iudyynxuvmc', NULL);
INSERT INTO public."Siswa" (id, nisn, nama, "tanggalLahir", alamat, "nomorTelepon", email, status, "createdAt", "updatedAt", "deletedAt", "kelasId", "userId", "tahunAjaranId", agama) VALUES ('cmj5gx04g001t35udknq3yqoe', '3093967437', 'DESY MUSTIKA MAYA SARI', '1970-01-01 00:00:38.431', 'Jl. Sudirman No. 76', '81234567922', 'desimustika@esgriba.com', 'AKTIF', '2025-12-14 08:33:39.039', '2025-12-22 11:46:56.003', NULL, 'cmj5ec9zf0000jsudgpxci2hf', 'cmj5gx04c001s35udal7y6kqp', 'cmj5cxv7e00014iudyynxuvmc', NULL);


ALTER TABLE public."Siswa" ENABLE TRIGGER ALL;

--
-- Data for Name: Attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Attendance" DISABLE TRIGGER ALL;



ALTER TABLE public."Attendance" ENABLE TRIGGER ALL;

--
-- Data for Name: MataPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."MataPelajaran" DISABLE TRIGGER ALL;

INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q7y001c5dudu38a65qb', 'MTK', 'Matematika', 4, '', 'SEMUA', '2025-12-17 12:16:57.214', '2025-12-17 12:16:57.214', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q84001d5dud60yqektg', 'BIND', 'Bahasa Indonesia', 4, '', 'SEMUA', '2025-12-17 12:16:57.22', '2025-12-17 12:16:57.22', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q87001e5dudb1uk5u9j', 'DPK TKJ', 'Dasar Program Keahlian TKJ', 4, '', 'SEMUA', '2025-12-17 12:16:57.223', '2025-12-17 12:16:57.223', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q8c001f5dudtoyt49tx', 'Informatika', 'Informatika', 4, '', 'SEMUA', '2025-12-17 12:16:57.228', '2025-12-17 12:16:57.228', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q8h001g5dud3cnj22wr', 'IPAS', 'IPAS', 4, '', 'SEMUA', '2025-12-17 12:16:57.233', '2025-12-17 12:16:57.233', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q8k001h5dudkou2wtsf', 'Bahasa Inggris', 'Bahasa Inggris', 4, '', 'SEMUA', '2025-12-17 12:16:57.236', '2025-12-17 12:16:57.236', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q8m001i5dudi334c2ms', 'Sejarah Indonesia', 'Sejarah Indonesia', 4, '', 'SEMUA', '2025-12-17 12:16:57.238', '2025-12-17 12:16:57.238', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q8q001j5dudx5o1zuri', 'PPKN', 'Pendidikan Pancasila dan Kewarganegaraan', 4, '', 'SEMUA', '2025-12-17 12:16:57.242', '2025-12-17 12:16:57.242', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q8v001k5dudwd0dr0f2', 'PJOK', 'PJOK', 4, '', 'SEMUA', '2025-12-17 12:16:57.247', '2025-12-17 12:16:57.247', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q8x001l5dudh15r8ocj', 'PKKWU AK', 'PKKWU AK', 4, '', 'SEMUA', '2025-12-17 12:16:57.249', '2025-12-17 12:16:57.249', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q90001m5dud5q6cvaku', 'PAI', 'PAI', 4, '', 'SEMUA', '2025-12-17 12:16:57.252', '2025-12-17 12:16:57.252', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q94001n5dudvyt50cow', 'DPK AK', 'Dasar Program Keahlian AK', 4, '', 'SEMUA', '2025-12-17 12:16:57.256', '2025-12-17 12:16:57.256', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q98001o5dudu8zzru3q', 'DPK TKR', 'Dasar Program Keahlian TKR', 4, '', 'SEMUA', '2025-12-17 12:16:57.26', '2025-12-17 12:16:57.26', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q9c001p5dudhh2cp17a', 'Bahasa Daerah', 'Bahasa Daerah', 4, '', 'SEMUA', '2025-12-17 12:16:57.264', '2025-12-17 12:16:57.264', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q9f001q5dud3giiabft', 'KK TKR', 'Konsentrasi Keahlian TKR', 4, '', 'SEMUA', '2025-12-17 12:16:57.267', '2025-12-17 12:16:57.267', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q9i001r5dudnscpl8q0', 'KK AK', 'Konsentrasi Keahlian AK', 4, '', 'SEMUA', '2025-12-17 12:16:57.27', '2025-12-17 12:16:57.27', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q9n001s5dudxr525koc', 'KK TKJ', 'Konsentrasi Keahlian TKJ', 4, '', 'SEMUA', '2025-12-17 12:16:57.275', '2025-12-17 12:16:57.275', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q9q001t5dudysev7yd8', 'PAK', 'PAK', 4, '', 'SEMUA', '2025-12-17 12:16:57.278', '2025-12-17 12:16:57.278', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q9s001u5dudswlkj5ya', 'Mapel Pilihan AK', 'Mapel Pilihan AK', 4, '', 'SEMUA', '2025-12-17 12:16:57.28', '2025-12-17 12:16:57.28', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7q9v001v5dud8r2heab2', 'Mapel Pilihan TKJ', 'Mapel Pilihan TKJ', 4, '', 'SEMUA', '2025-12-17 12:16:57.283', '2025-12-17 12:16:57.283', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7qa0001w5dudmau1sngf', 'Mapel Pilihan TKR', 'Mapel Pilihan TKR', 4, '', 'SEMUA', '2025-12-17 12:16:57.288', '2025-12-17 12:16:57.288', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7qa5001x5dudniu477gy', 'PKKWU TKJ', 'PKKWU TKJ', 4, '', 'SEMUA', '2025-12-17 12:16:57.293', '2025-12-17 12:16:57.293', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7qa8001y5dud4gjab2sw', 'PKKWU TKR', 'PKKWU TKR', 4, '', 'SEMUA', '2025-12-17 12:16:57.296', '2025-12-17 12:16:57.296', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7qaa001z5dudjfz3mlu8', 'Pramuka', 'Pramuka', 4, '', 'SEMUA', '2025-12-17 12:16:57.298', '2025-12-17 12:16:57.298', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmj9z7qae00205dudqey9zf1h', 'Seni Budaya', 'Seni Budaya', 4, '', 'SEMUA', '2025-12-17 12:16:57.302', '2025-12-17 12:16:57.302', NULL);
INSERT INTO public."MataPelajaran" (id, kode, nama, "jamPelajaran", deskripsi, tingkat, "createdAt", "updatedAt", "deletedAt") VALUES ('cmjof810t000005udgq7bzpjh', 'BK', 'Bimbingan Konseling', 5, NULL, 'SEMUA', '2025-12-27 14:53:51.533', '2025-12-27 14:53:51.533', NULL);


ALTER TABLE public."MataPelajaran" ENABLE TRIGGER ALL;

--
-- Data for Name: BankSoal; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."BankSoal" DISABLE TRIGGER ALL;



ALTER TABLE public."BankSoal" ENABLE TRIGGER ALL;

--
-- Data for Name: ForumKategori; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ForumKategori" DISABLE TRIGGER ALL;



ALTER TABLE public."ForumKategori" ENABLE TRIGGER ALL;

--
-- Data for Name: ForumThread; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ForumThread" DISABLE TRIGGER ALL;



ALTER TABLE public."ForumThread" ENABLE TRIGGER ALL;

--
-- Data for Name: ForumPost; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ForumPost" DISABLE TRIGGER ALL;



ALTER TABLE public."ForumPost" ENABLE TRIGGER ALL;

--
-- Data for Name: ForumReaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ForumReaction" DISABLE TRIGGER ALL;



ALTER TABLE public."ForumReaction" ENABLE TRIGGER ALL;

--
-- Data for Name: JadwalPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."JadwalPelajaran" DISABLE TRIGGER ALL;

INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7mij60004laudb3xy6wa8', 'SENIN', '08:16', '08:54', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q84001d5dud60yqektg', 'cmj9z8ybn002q5dud7n4058u9', '2025-12-29 13:44:29.01', '2025-12-29 14:03:04.577');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7mijc0005laudungska8r', 'SENIN', '08:54', '09:32', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q84001d5dud60yqektg', 'cmj9z8ybn002q5dud7n4058u9', '2025-12-29 13:44:29.016', '2025-12-29 14:03:04.585');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7mijj0006laud3ja4aztt', 'SENIN', '10:10', '10:45', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q84001d5dud60yqektg', 'cmj9z8ybn002q5dud7n4058u9', '2025-12-29 13:44:29.023', '2025-12-29 14:03:04.593');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7spee000nlaudxqbumeko', 'SENIN', '10:45', '11:20', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q87001e5dudb1uk5u9j', 'cmj9z8yem002u5dudolwskcz4', '2025-12-29 13:49:17.846', '2025-12-29 14:03:04.686');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7spek000olaudaqt9nmi4', 'SENIN', '11:20', '11:55', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q87001e5dudb1uk5u9j', 'cmj9z8yem002u5dudolwskcz4', '2025-12-29 13:49:17.852', '2025-12-29 14:03:04.691');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7spep000plaud2bdijgv1', 'SENIN', '11:55', '12:30', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q87001e5dudb1uk5u9j', 'cmj9z8yem002u5dudolwskcz4', '2025-12-29 13:49:17.857', '2025-12-29 14:03:04.696');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7speu000qlaudl4whrwb0', 'SENIN', '12:30', '13:05', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q87001e5dudb1uk5u9j', 'cmj9z8yem002u5dudolwskcz4', '2025-12-29 13:49:17.862', '2025-12-29 14:03:04.702');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89biy000rlaud6t1l7ikd', 'SENIN', '07:38', '08:16', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8xtu00225dudew59ixr7', '2025-12-29 14:02:13.018', '2025-12-29 14:03:04.706');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7mijq0007laud2yfc6yxo', 'SENIN', '10:45', '11:20', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q7y001c5dudu38a65qb', 'cmj9z8y4a002g5dudjlq4s2jp', '2025-12-29 13:44:29.03', '2025-12-29 14:03:04.601');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7mijv0008laudp9i3uhso', 'SENIN', '11:20', '11:55', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q7y001c5dudu38a65qb', 'cmj9z8y4a002g5dudjlq4s2jp', '2025-12-29 13:44:29.035', '2025-12-29 14:03:04.606');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7mik20009laudu1d05jlf', 'SENIN', '11:55', '12:30', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q7y001c5dudu38a65qb', 'cmj9z8y4a002g5dudjlq4s2jp', '2025-12-29 13:44:29.042', '2025-12-29 14:03:04.612');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7mik7000alaudla2f7jnr', 'SENIN', '12:30', '13:05', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q7y001c5dudu38a65qb', 'cmj9z8y4a002g5dudjlq4s2jp', '2025-12-29 13:44:29.047', '2025-12-29 14:03:04.617');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7ovsh000blaude5fhsbzy', 'SENIN', '07:38', '08:16', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q94001n5dudvyt50cow', 'cmj9z8yg3002w5dud29sel0av', '2025-12-29 13:46:19.505', '2025-12-29 14:03:04.623');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7ovsm000claudg7h4ihvz', 'SENIN', '08:16', '08:54', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q94001n5dudvyt50cow', 'cmj9z8yg3002w5dud29sel0av', '2025-12-29 13:46:19.51', '2025-12-29 14:03:04.628');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7ovsr000dlaudo5k5ifra', 'SENIN', '08:54', '09:32', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q94001n5dudvyt50cow', 'cmj9z8yg3002w5dud29sel0av', '2025-12-29 13:46:19.515', '2025-12-29 14:03:04.633');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7ovsw000elauditk0mcm1', 'SENIN', '10:10', '10:45', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q94001n5dudvyt50cow', 'cmj9z8yg3002w5dud29sel0av', '2025-12-29 13:46:19.52', '2025-12-29 14:03:04.638');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7ovt1000flaudanywb0z8', 'SENIN', '10:45', '11:20', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q84001d5dud60yqektg', 'cmj9z8ybn002q5dud7n4058u9', '2025-12-29 13:46:19.525', '2025-12-29 14:03:04.643');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7ovt6000glaudisesfljw', 'SENIN', '11:20', '11:55', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q84001d5dud60yqektg', 'cmj9z8ybn002q5dud7n4058u9', '2025-12-29 13:46:19.53', '2025-12-29 14:03:04.648');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7ovtc000hlaudjd7b89q9', 'SENIN', '11:55', '12:30', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q84001d5dud60yqektg', 'cmj9z8ybn002q5dud7n4058u9', '2025-12-29 13:46:19.536', '2025-12-29 14:03:04.654');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7ovti000ilaud3v1rsx3b', 'SENIN', '12:30', '13:05', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q84001d5dud60yqektg', 'cmj9z8ybn002q5dud7n4058u9', '2025-12-29 13:46:19.542', '2025-12-29 14:03:04.658');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7spdh000jlaudv1xaahr8', 'SENIN', '07:38', '08:16', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q8v001k5dudwd0dr0f2', 'cmj9z8y77002k5dudwjch4365', '2025-12-29 13:49:17.813', '2025-12-29 14:03:04.664');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7spdr000klaudtbyedgjs', 'SENIN', '08:16', '08:54', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q8v001k5dudwd0dr0f2', 'cmj9z8y77002k5dudwjch4365', '2025-12-29 13:49:17.823', '2025-12-29 14:03:04.67');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7spe3000llauds31ruxra', 'SENIN', '08:54', '09:32', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q8v001k5dudwd0dr0f2', 'cmj9z8y77002k5dudwjch4365', '2025-12-29 13:49:17.835', '2025-12-29 14:03:04.675');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7spe9000mlauduq8wv1fy', 'SENIN', '10:10', '10:45', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q8c001f5dudtoyt49tx', 'cmj9z8y8o002m5dudwnycw1jf', '2025-12-29 13:49:17.841', '2025-12-29 14:03:04.681');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bj4000slaudacb7hd6u', 'SENIN', '08:16', '08:54', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8xtu00225dudew59ixr7', '2025-12-29 14:02:13.024', '2025-12-29 14:03:04.712');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bj9000tlaud9hdp917x', 'SENIN', '08:54', '09:32', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8xtu00225dudew59ixr7', '2025-12-29 14:02:13.029', '2025-12-29 14:03:04.717');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bje000ulaudjh7fttn8', 'SENIN', '10:10', '10:45', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8xtu00225dudew59ixr7', '2025-12-29 14:02:13.034', '2025-12-29 14:03:04.722');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bjk000vlaudpa7agawy', 'SENIN', '10:45', '11:20', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q9f001q5dud3giiabft', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-29 14:02:13.04', '2025-12-29 14:03:04.727');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bjp000wlaudd0lzlvj5', 'SENIN', '11:20', '11:55', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q9f001q5dud3giiabft', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-29 14:02:13.045', '2025-12-29 14:03:04.732');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bju000xlaudzcr4mwfr', 'SENIN', '11:55', '12:30', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q9f001q5dud3giiabft', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-29 14:02:13.05', '2025-12-29 14:03:04.737');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bjz000ylaudakuob2f1', 'SENIN', '12:30', '13:05', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q9f001q5dud3giiabft', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-29 14:02:13.055', '2025-12-29 14:03:04.742');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bk5000zlauddwy7fc9s', 'SENIN', '07:38', '08:16', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q7y001c5dudu38a65qb', 'cmj9z8yj000305dudtwddc0j1', '2025-12-29 14:02:13.061', '2025-12-29 14:03:04.747');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bk90010laudvoq6bult', 'SENIN', '08:16', '08:54', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q7y001c5dudu38a65qb', 'cmj9z8yj000305dudtwddc0j1', '2025-12-29 14:02:13.065', '2025-12-29 14:03:04.752');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bke0011laudxwu0jawl', 'SENIN', '08:54', '09:32', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q7y001c5dudu38a65qb', 'cmj9z8yj000305dudtwddc0j1', '2025-12-29 14:02:13.07', '2025-12-29 14:03:04.757');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bkj0012laudc1yfq525', 'SENIN', '10:10', '10:45', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8ya7002o5dudm0yzma1k', '2025-12-29 14:02:13.075', '2025-12-29 14:03:04.763');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bko0013laud8y3kqv81', 'SENIN', '10:45', '11:20', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8ya7002o5dudm0yzma1k', '2025-12-29 14:02:13.08', '2025-12-29 14:03:04.768');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bkt0014lauduxgnpfkn', 'SENIN', '11:20', '11:55', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8ya7002o5dudm0yzma1k', '2025-12-29 14:02:13.085', '2025-12-29 14:03:04.773');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bl00015laudqzbp5r0v', 'SENIN', '11:55', '12:30', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8xyc00285dudgvf5bnnv', '2025-12-29 14:02:13.092', '2025-12-29 14:03:04.778');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bl90016laudocdafnkm', 'SENIN', '12:30', '13:05', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8xyc00285dudgvf5bnnv', '2025-12-29 14:02:13.101', '2025-12-29 14:03:04.783');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bli0017laudmu1rqcbq', 'SENIN', '07:38', '08:16', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q8q001j5dudx5o1zuri', 'cmj9z8xvg00245duda7dxbp56', '2025-12-29 14:02:13.11', '2025-12-29 14:03:04.788');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89blq0018laudz84us053', 'SENIN', '08:16', '08:54', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q8q001j5dudx5o1zuri', 'cmj9z8xvg00245duda7dxbp56', '2025-12-29 14:02:13.118', '2025-12-29 14:03:04.793');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bm00019laudghsm3uuk', 'SENIN', '08:54', '09:32', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q8m001i5dudi334c2ms', 'cmj9z8xyc00285dudgvf5bnnv', '2025-12-29 14:02:13.128', '2025-12-29 14:03:04.798');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bm9001alauda0j961f3', 'SENIN', '10:10', '10:45', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q8m001i5dudi334c2ms', 'cmj9z8xyc00285dudgvf5bnnv', '2025-12-29 14:02:13.137', '2025-12-29 14:03:04.803');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bmh001blaudws2r6585', 'SENIN', '10:45', '11:20', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8xtu00225dudew59ixr7', '2025-12-29 14:02:13.145', '2025-12-29 14:03:04.808');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bmp001claudil7qpllo', 'SENIN', '11:20', '11:55', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8xtu00225dudew59ixr7', '2025-12-29 14:02:13.153', '2025-12-29 14:03:04.813');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr7miil0003laudjtx7100x', 'SENIN', '07:38', '08:16', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q84001d5dud60yqektg', 'cmj9z8ybn002q5dud7n4058u9', '2025-12-29 13:44:28.989', '2025-12-29 14:03:04.564');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bmu001dlaud3rxer16a', 'SENIN', '11:55', '12:30', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8xtu00225dudew59ixr7', '2025-12-29 14:02:13.158', '2025-12-29 14:03:04.817');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bn0001elaudzifq9lqx', 'SENIN', '12:30', '13:05', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8xtu00225dudew59ixr7', '2025-12-29 14:02:13.164', '2025-12-29 14:03:04.822');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bn7001flaudku54wur1', 'SENIN', '07:38', '08:16', 'cmj5eca170008jsudb4r1h58n', 'cmj9z7q9f001q5dud3giiabft', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-29 14:02:13.171', '2025-12-29 14:03:04.826');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bnc001glaud8eju6ig7', 'SENIN', '08:16', '08:54', 'cmj5eca170008jsudb4r1h58n', 'cmj9z7q9f001q5dud3giiabft', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-29 14:02:13.176', '2025-12-29 14:03:04.831');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bni001hlaudvpq6bgzm', 'SENIN', '08:54', '09:32', 'cmj5eca170008jsudb4r1h58n', 'cmj9z7q9f001q5dud3giiabft', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-29 14:02:13.182', '2025-12-29 14:03:04.836');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr8afig001rlaud74y27et6', 'SENIN', '10:10', '10:45', 'cmj5eca170008jsudb4r1h58n', 'cmj9z7qa8001y5dud4gjab2sw', 'cmj9z8xwv00265dud0w98oh1m', '2025-12-29 14:03:04.84', '2025-12-29 14:03:04.84');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr8afil001slaud9if0a1m2', 'SENIN', '10:45', '11:20', 'cmj5eca170008jsudb4r1h58n', 'cmj9z7qa8001y5dud4gjab2sw', 'cmj9z8xwv00265dud0w98oh1m', '2025-12-29 14:03:04.845', '2025-12-29 14:03:04.845');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bnr001ilaud8x9bm612', 'SENIN', '07:38', '08:16', 'cmj5eca050002jsudq5rc3oa3', 'cmj9z7q8x001l5dudh15r8ocj', 'cmj9z8ya7002o5dudm0yzma1k', '2025-12-29 14:02:13.191', '2025-12-29 14:03:04.85');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bnw001jlaudod8er5k7', 'SENIN', '08:16', '08:54', 'cmj5eca050002jsudq5rc3oa3', 'cmj9z7q8x001l5dudh15r8ocj', 'cmj9z8ya7002o5dudm0yzma1k', '2025-12-29 14:02:13.196', '2025-12-29 14:03:04.854');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bo2001klaudsbv98chc', 'SENIN', '08:54', '09:32', 'cmj5eca050002jsudq5rc3oa3', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8yd4002s5dudqb9lav2o', '2025-12-29 14:02:13.202', '2025-12-29 14:03:04.859');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bo8001llauddkih58au', 'SENIN', '10:10', '10:45', 'cmj5eca050002jsudq5rc3oa3', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8yd4002s5dudqb9lav2o', '2025-12-29 14:02:13.208', '2025-12-29 14:03:04.863');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89boe001mlaudgtpmwgfi', 'SENIN', '10:45', '11:20', 'cmj5eca050002jsudq5rc3oa3', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8yd4002s5dudqb9lav2o', '2025-12-29 14:02:13.214', '2025-12-29 14:03:04.868');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bok001nlaud64jhepnx', 'SENIN', '11:20', '11:55', 'cmj5eca050002jsudq5rc3oa3', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8yd4002s5dudqb9lav2o', '2025-12-29 14:02:13.22', '2025-12-29 14:03:04.873');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bop001olaudwpzh79hp', 'SENIN', '07:38', '08:16', 'cmj5eca0o0005jsud0ambwla7', 'cmj9z7q9n001s5dudxr525koc', 'cmj9z8xzs002a5dudw0c717l2', '2025-12-29 14:02:13.225', '2025-12-29 14:03:04.877');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bow001plaud9fn9dfpi', 'SENIN', '08:16', '08:54', 'cmj5eca0o0005jsud0ambwla7', 'cmj9z7q9n001s5dudxr525koc', 'cmj9z8xzs002a5dudw0c717l2', '2025-12-29 14:02:13.232', '2025-12-29 14:03:04.882');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjr89bp1001qlaud4wrphamt', 'SENIN', '08:54', '09:32', 'cmj5eca0o0005jsud0ambwla7', 'cmj9z7q9n001s5dudxr525koc', 'cmj9z8xzs002a5dudw0c717l2', '2025-12-29 14:02:13.237', '2025-12-29 14:03:04.886');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6jarh000055ud2ejf2m47', 'SELASA', '07:00', '07:38', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q8v001k5dudwd0dr0f2', 'cmj9z8y77002k5dudwjch4365', '2025-12-30 06:01:45.532', '2025-12-30 06:01:45.532');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6jg41000155ud2mggikw4', 'SELASA', '07:38', '08:16', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q8v001k5dudwd0dr0f2', 'cmj9z8y77002k5dudwjch4365', '2025-12-30 06:01:52.464', '2025-12-30 06:01:52.464');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6jk22000255udja90wkk2', 'SELASA', '08:16', '08:54', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q8v001k5dudwd0dr0f2', 'cmj9z8y77002k5dudwjch4365', '2025-12-30 06:01:57.576', '2025-12-30 06:01:57.576');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6jyhc000355ud6ozb8qn9', 'SELASA', '08:54', '09:32', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q8c001f5dudtoyt49tx', 'cmj9z8yly00345dudadjrqvfh', '2025-12-30 06:02:16.271', '2025-12-30 06:02:16.271');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6k3yp000455udba0tzbbi', 'SELASA', '10:10', '10:45', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q8c001f5dudtoyt49tx', 'cmj9z8yly00345dudadjrqvfh', '2025-12-30 06:02:23.376', '2025-12-30 06:02:23.376');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6kpo6000555ud75t9pf5c', 'SELASA', '10:45', '11:20', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q98001o5dudu8zzru3q', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-30 06:02:51.509', '2025-12-30 06:02:51.509');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6ktts000655ud8ss1of3n', 'SELASA', '11:20', '11:55', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q98001o5dudu8zzru3q', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-30 06:02:56.895', '2025-12-30 06:02:56.895');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6kxd9000755udg2jkok71', 'SELASA', '11:55', '12:30', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q98001o5dudu8zzru3q', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-30 06:03:01.485', '2025-12-30 06:03:01.485');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6l2mv000855udkpcldo21', 'SELASA', '12:30', '13:05', 'cmj5eca0w0006jsud9bca11b3', 'cmj9z7q98001o5dudu8zzru3q', 'cmj9z8xwv00265dud0w98oh1m', '2025-12-30 06:03:08.308', '2025-12-30 06:03:08.308');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6lsfl000955udh7i36ma3', 'SELASA', '07:00', '07:38', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q8v001k5dudwd0dr0f2', 'cmj9z8y77002k5dudwjch4365', '2025-12-30 06:03:41.744', '2025-12-30 06:03:41.744');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6lw7l000a55udklmjlkm3', 'SELASA', '07:38', '08:16', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q8v001k5dudwd0dr0f2', 'cmj9z8y77002k5dudwjch4365', '2025-12-30 06:03:46.639', '2025-12-30 06:03:46.639');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6m1bg000b55ud958jmape', 'SELASA', '08:16', '08:54', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q8v001k5dudwd0dr0f2', 'cmj9z8y77002k5dudwjch4365', '2025-12-30 06:03:53.26', '2025-12-30 06:03:53.26');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6ml4k000c55ud1wxye928', 'SELASA', '08:54', '09:32', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8ya7002o5dudm0yzma1k', '2025-12-30 06:04:18.931', '2025-12-30 06:04:18.931');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6mokb000d55uda77jb741', 'SELASA', '10:10', '10:45', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8ya7002o5dudm0yzma1k', '2025-12-30 06:04:23.386', '2025-12-30 06:04:23.386');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6msa0000e55udxrvagyhh', 'SELASA', '10:45', '11:20', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8ya7002o5dudm0yzma1k', '2025-12-30 06:04:28.199', '2025-12-30 06:04:28.199');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6n26n000f55udt8s4a7hi', 'SELASA', '11:20', '11:55', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8ya7002o5dudm0yzma1k', '2025-12-30 06:04:41.039', '2025-12-30 06:04:41.039');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6n6gn000g55uds5eloxw5', 'SELASA', '11:55', '12:30', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q8h001g5dud3cnj22wr', 'cmj9z8y2q002e5dud69l0gx00', '2025-12-30 06:04:46.582', '2025-12-30 06:04:46.582');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6naan000h55udswvz68dj', 'SELASA', '12:30', '13:05', 'cmj5ec9zf0000jsudgpxci2hf', 'cmj9z7q8h001g5dud3cnj22wr', 'cmj9z8y2q002e5dud69l0gx00', '2025-12-30 06:04:51.55', '2025-12-30 06:04:51.55');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6nya8000i55ud0n5nr0zd', 'SELASA', '07:00', '07:38', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q8h001g5dud3cnj22wr', 'cmj9z8y2q002e5dud69l0gx00', '2025-12-30 06:05:22.639', '2025-12-30 06:05:22.639');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6o18f000j55ud12m3ptay', 'SELASA', '07:38', '08:16', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q8h001g5dud3cnj22wr', 'cmj9z8y2q002e5dud69l0gx00', '2025-12-30 06:05:26.461', '2025-12-30 06:05:26.461');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6o43e000k55udevlmmsg4', 'SELASA', '08:16', '08:54', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q8h001g5dud3cnj22wr', 'cmj9z8y2q002e5dud69l0gx00', '2025-12-30 06:05:30.169', '2025-12-30 06:05:30.169');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6oif5000l55ud996qsgxn', 'SELASA', '08:54', '09:32', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q87001e5dudb1uk5u9j', 'cmj9z8yem002u5dudolwskcz4', '2025-12-30 06:05:48.736', '2025-12-30 06:05:48.736');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6on6f000m55ud5ypsfw6z', 'SELASA', '10:10', '10:45', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q87001e5dudb1uk5u9j', 'cmj9z8yem002u5dudolwskcz4', '2025-12-30 06:05:54.903', '2025-12-30 06:05:54.903');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6or55000n55ud67mymvue', 'SELASA', '10:45', '11:20', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q87001e5dudb1uk5u9j', 'cmj9z8yem002u5dudolwskcz4', '2025-12-30 06:06:00.041', '2025-12-30 06:06:00.041');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6oye5000o55ud5eg1yr31', 'SELASA', '11:20', '11:55', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q87001e5dudb1uk5u9j', 'cmj9z8yem002u5dudolwskcz4', '2025-12-30 06:06:09.436', '2025-12-30 06:06:09.436');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6p2zu000p55udkhu6dpf3', 'SELASA', '11:55', '12:30', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q8m001i5dudi334c2ms', 'cmj9z8xyc00285dudgvf5bnnv', '2025-12-30 06:06:15.402', '2025-12-30 06:06:15.402');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6p66o000q55ud5pyvv9tt', 'SELASA', '12:30', '13:05', 'cmj5eca0e0003jsud1uxj50o4', 'cmj9z7q8m001i5dudi334c2ms', 'cmj9z8xyc00285dudgvf5bnnv', '2025-12-30 06:06:19.536', '2025-12-30 06:06:19.536');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6qap3000r55ud02pwyx5z', 'SELASA', '07:00', '07:38', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q90001m5dud5q6cvaku', 'cmj9z8yly00345dudadjrqvfh', '2025-12-30 06:07:12.039', '2025-12-30 06:07:12.039');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6qdm3000s55udxpoho987', 'SELASA', '07:38', '08:16', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q90001m5dud5q6cvaku', 'cmj9z8yly00345dudadjrqvfh', '2025-12-30 06:07:15.818', '2025-12-30 06:07:15.818');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6qgps000t55udwbewqf91', 'SELASA', '08:16', '08:54', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q90001m5dud5q6cvaku', 'cmj9z8yly00345dudadjrqvfh', '2025-12-30 06:07:19.84', '2025-12-30 06:07:19.84');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6qya9000u55udwppwzo67', 'SELASA', '08:54', '09:32', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q98001o5dudu8zzru3q', 'cmj9z8xwv00265dud0w98oh1m', '2025-12-30 06:07:42.608', '2025-12-30 06:07:42.608');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6r1lc000v55udunts7sad', 'SELASA', '10:10', '10:45', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q98001o5dudu8zzru3q', 'cmj9z8xwv00265dud0w98oh1m', '2025-12-30 06:07:46.895', '2025-12-30 06:07:46.895');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6r4w9000w55udgak7jwh7', 'SELASA', '10:45', '11:20', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q98001o5dudu8zzru3q', 'cmj9z8xwv00265dud0w98oh1m', '2025-12-30 06:07:51.177', '2025-12-30 06:07:51.177');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6rg48000x55udz7ljt2ug', 'SELASA', '11:20', '11:55', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q98001o5dudu8zzru3q', 'cmj9z8xwv00265dud0w98oh1m', '2025-12-30 06:08:05.72', '2025-12-30 06:08:05.72');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6rjo3000y55udemnypz4n', 'SELASA', '11:55', '12:30', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q98001o5dudu8zzru3q', 'cmj9z8xwv00265dud0w98oh1m', '2025-12-30 06:08:10.321', '2025-12-30 06:08:10.321');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6rn6n000z55ud313z0j7n', 'SELASA', '12:30', '13:05', 'cmj5eca130007jsudvzwt5rjx', 'cmj9z7q98001o5dudu8zzru3q', 'cmj9z8xwv00265dud0w98oh1m', '2025-12-30 06:08:14.879', '2025-12-30 06:08:14.879');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6tt1m001055ud70xthpf6', 'SELASA', '07:00', '07:38', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q8x001l5dudh15r8ocj', 'cmj9z8ykj00325dudk20mdgjx', '2025-12-30 06:09:55.785', '2025-12-30 06:09:55.785');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6txll001155udqb0bo501', 'SELASA', '07:38', '08:16', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q8x001l5dudh15r8ocj', 'cmj9z8ykj00325dudk20mdgjx', '2025-12-30 06:10:01.688', '2025-12-30 06:10:01.688');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6u1i4001255ud0wyfb1kf', 'SELASA', '08:16', '08:54', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q8x001l5dudh15r8ocj', 'cmj9z8ykj00325dudk20mdgjx', '2025-12-30 06:10:06.746', '2025-12-30 06:10:06.746');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6uy0w001355udtz3i4p11', 'SELASA', '08:54', '09:32', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8xyc00285dudgvf5bnnv', '2025-12-30 06:10:48.895', '2025-12-30 06:10:48.895');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6v6vm001455udm94fgh9l', 'SELASA', '10:10', '10:45', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8xyc00285dudgvf5bnnv', '2025-12-30 06:11:00.369', '2025-12-30 06:11:00.369');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6vcnt001555uda0ajwyex', 'SELASA', '10:45', '11:20', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8yd4002s5dudqb9lav2o', '2025-12-30 06:11:07.864', '2025-12-30 06:11:07.864');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6vhkx001655uddmm65hrf', 'SELASA', '11:20', '11:55', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8yd4002s5dudqb9lav2o', '2025-12-30 06:11:14.239', '2025-12-30 06:11:14.239');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6vlmb001755udkc2ajxny', 'SELASA', '11:55', '12:30', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8yd4002s5dudqb9lav2o', '2025-12-30 06:11:19.475', '2025-12-30 06:11:19.475');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6vpgg001855ud0g2hz55w', 'SELASA', '12:30', '13:05', 'cmj5ec9zx0001jsud5cnf1k74', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8yd4002s5dudqb9lav2o', '2025-12-30 06:11:24.446', '2025-12-30 06:11:24.446');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6w9ox001955udh6ywaowz', 'SELASA', '07:00', '07:38', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q9n001s5dudxr525koc', 'cmj9z8yem002u5dudolwskcz4', '2025-12-30 06:11:50.673', '2025-12-30 06:11:50.673');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6wd0z001a55udxrs9lyg0', 'SELASA', '07:38', '08:16', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q9n001s5dudxr525koc', 'cmj9z8yem002u5dudolwskcz4', '2025-12-30 06:11:54.994', '2025-12-30 06:11:54.994');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6wgcc001b55udvi3q70z9', 'SELASA', '08:16', '08:54', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q9n001s5dudxr525koc', 'cmj9z8yem002u5dudolwskcz4', '2025-12-30 06:11:59.291', '2025-12-30 06:11:59.291');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6wpuh001c55udx2sy9s6q', 'SELASA', '08:54', '09:32', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q9n001s5dudxr525koc', 'cmj9z8y8o002m5dudwnycw1jf', '2025-12-30 06:12:11.608', '2025-12-30 06:12:11.608');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6wtpy001d55ude1zk2ume', 'SELASA', '10:10', '10:45', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q9n001s5dudxr525koc', 'cmj9z8y8o002m5dudwnycw1jf', '2025-12-30 06:12:16.628', '2025-12-30 06:12:16.628');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6wxhs001e55udhhascbpc', 'SELASA', '10:45', '11:20', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q9n001s5dudxr525koc', 'cmj9z8y8o002m5dudwnycw1jf', '2025-12-30 06:12:21.52', '2025-12-30 06:12:21.52');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6x1x5001f55uds3tfrguj', 'SELASA', '11:20', '11:55', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q9n001s5dudxr525koc', 'cmj9z8y8o002m5dudwnycw1jf', '2025-12-30 06:12:27.256', '2025-12-30 06:12:27.256');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6x6m2001g55udti5f4y1x', 'SELASA', '11:55', '12:30', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q9n001s5dudxr525koc', 'cmj9z8y8o002m5dudwnycw1jf', '2025-12-30 06:12:33.338', '2025-12-30 06:12:33.338');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6xa6o001h55ud0tl3u60n', 'SELASA', '12:30', '13:05', 'cmj5eca0k0004jsuddjewnal1', 'cmj9z7q9n001s5dudxr525koc', 'cmj9z8y8o002m5dudwnycw1jf', '2025-12-30 06:12:37.967', '2025-12-30 06:12:37.967');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6xqww001i55ud3gbhvhpg', 'SELASA', '07:00', '07:38', 'cmj5eca170008jsudb4r1h58n', 'cmj9z7q9f001q5dud3giiabft', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-30 06:12:59.648', '2025-12-30 06:12:59.648');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6xu49001j55udz35rascc', 'SELASA', '07:38', '08:16', 'cmj5eca170008jsudb4r1h58n', 'cmj9z7q9f001q5dud3giiabft', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-30 06:13:03.8', '2025-12-30 06:13:03.8');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6xx02001k55udfi59yihs', 'SELASA', '08:16', '08:54', 'cmj5eca170008jsudb4r1h58n', 'cmj9z7q9f001q5dud3giiabft', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-30 06:13:07.537', '2025-12-30 06:13:07.537');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6xzw0001l55ud2crz6tkx', 'SELASA', '08:54', '09:32', 'cmj5eca170008jsudb4r1h58n', 'cmj9z7q9f001q5dud3giiabft', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-30 06:13:11.279', '2025-12-30 06:13:11.279');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6y7a9001m55udg31hu9rb', 'SELASA', '10:10', '10:45', 'cmj5eca170008jsudb4r1h58n', 'cmj9z7q9f001q5dud3giiabft', 'cmj9z8y5q002i5dudk3gr40r9', '2025-12-30 06:13:20.864', '2025-12-30 06:13:20.864');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6yiu8001n55udvn1hbo3b', 'SELASA', '07:00', '07:38', 'cmj5eca050002jsudq5rc3oa3', 'cmj9z7q84001d5dud60yqektg', 'cmj9z8ybn002q5dud7n4058u9', '2025-12-30 06:13:35.839', '2025-12-30 06:13:35.839');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6ytkd001o55udexvh859k', 'SELASA', '07:38', '08:16', 'cmj5eca050002jsudq5rc3oa3', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8yd4002s5dudqb9lav2o', '2025-12-30 06:13:49.74', '2025-12-30 06:13:49.74');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6z3nk001p55udjrp345vj', 'SELASA', '08:16', '08:54', 'cmj5eca050002jsudq5rc3oa3', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8yox00385dudt5p2uvo1', '2025-12-30 06:14:02.815', '2025-12-30 06:14:02.815');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6z7p6001q55ud9450akfe', 'SELASA', '08:54', '09:32', 'cmj5eca050002jsudq5rc3oa3', 'cmj9z7q9i001r5dudnscpl8q0', 'cmj9z8yox00385dudt5p2uvo1', '2025-12-30 06:14:08.057', '2025-12-30 06:14:08.057');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6zogc001r55ud47wl7nfd', 'SELASA', '07:00', '07:38', 'cmj5eca0o0005jsud0ambwla7', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8xtu00225dudew59ixr7', '2025-12-30 06:14:29.771', '2025-12-30 06:14:29.771');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs6zsc2001s55udq9yovq9y', 'SELASA', '07:38', '08:16', 'cmj5eca0o0005jsud0ambwla7', 'cmj9z7q8k001h5dudkou2wtsf', 'cmj9z8xtu00225dudew59ixr7', '2025-12-30 06:14:34.801', '2025-12-30 06:14:34.801');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs702ox001t55udsvwlm47x', 'SELASA', '08:16', '08:54', 'cmj5eca0o0005jsud0ambwla7', 'cmj9z7qa5001x5dudniu477gy', 'cmj9z8y2q002e5dud69l0gx00', '2025-12-30 06:14:48.225', '2025-12-30 06:14:48.225');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs705sg001u55udp9tajcrt', 'SELASA', '08:54', '09:32', 'cmj5eca0o0005jsud0ambwla7', 'cmj9z7qa5001x5dudniu477gy', 'cmj9z8y2q002e5dud69l0gx00', '2025-12-30 06:14:52.239', '2025-12-30 06:14:52.239');
INSERT INTO public."JadwalPelajaran" (id, hari, "jamMulai", "jamSelesai", "kelasId", "mataPelajaranId", "guruId", "createdAt", "updatedAt") VALUES ('cmjs70a76001v55udtp739a5y', 'SELASA', '10:10', '10:45', 'cmj5eca0o0005jsud0ambwla7', 'cmj9z7q84001d5dud60yqektg', 'cmj9z8ybn002q5dud7n4058u9', '2025-12-30 06:14:57.951', '2025-12-30 06:14:57.951');


ALTER TABLE public."JadwalPelajaran" ENABLE TRIGGER ALL;

--
-- Data for Name: Materi; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Materi" DISABLE TRIGGER ALL;



ALTER TABLE public."Materi" ENABLE TRIGGER ALL;

--
-- Data for Name: MateriAttachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."MateriAttachment" DISABLE TRIGGER ALL;



ALTER TABLE public."MateriAttachment" ENABLE TRIGGER ALL;

--
-- Data for Name: MateriBookmark; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."MateriBookmark" DISABLE TRIGGER ALL;



ALTER TABLE public."MateriBookmark" ENABLE TRIGGER ALL;

--
-- Data for Name: Notifikasi; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Notifikasi" DISABLE TRIGGER ALL;



ALTER TABLE public."Notifikasi" ENABLE TRIGGER ALL;

--
-- Data for Name: PaketSoal; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."PaketSoal" DISABLE TRIGGER ALL;



ALTER TABLE public."PaketSoal" ENABLE TRIGGER ALL;

--
-- Data for Name: PaketSoalItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."PaketSoalItem" DISABLE TRIGGER ALL;



ALTER TABLE public."PaketSoalItem" ENABLE TRIGGER ALL;

--
-- Data for Name: Pengumuman; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Pengumuman" DISABLE TRIGGER ALL;



ALTER TABLE public."Pengumuman" ENABLE TRIGGER ALL;

--
-- Data for Name: ProgressSiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."ProgressSiswa" DISABLE TRIGGER ALL;



ALTER TABLE public."ProgressSiswa" ENABLE TRIGGER ALL;

--
-- Data for Name: Settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Settings" DISABLE TRIGGER ALL;

INSERT INTO public."Settings" (id, key, value, "createdAt", "updatedAt") VALUES ('cmjaxivkf0000u0udfciy166n', 'late_time_threshold', '07:00', '2025-12-18 04:17:24.303', '2025-12-18 04:17:24.303');


ALTER TABLE public."Settings" ENABLE TRIGGER ALL;

--
-- Data for Name: SiswaKelasHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."SiswaKelasHistory" DISABLE TRIGGER ALL;



ALTER TABLE public."SiswaKelasHistory" ENABLE TRIGGER ALL;

--
-- Data for Name: Tugas; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Tugas" DISABLE TRIGGER ALL;



ALTER TABLE public."Tugas" ENABLE TRIGGER ALL;

--
-- Data for Name: TugasAttachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."TugasAttachment" DISABLE TRIGGER ALL;



ALTER TABLE public."TugasAttachment" ENABLE TRIGGER ALL;

--
-- Data for Name: TugasSiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."TugasSiswa" DISABLE TRIGGER ALL;



ALTER TABLE public."TugasSiswa" ENABLE TRIGGER ALL;

--
-- Data for Name: TugasSiswaFile; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."TugasSiswaFile" DISABLE TRIGGER ALL;



ALTER TABLE public."TugasSiswaFile" ENABLE TRIGGER ALL;

--
-- Data for Name: Ujian; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."Ujian" DISABLE TRIGGER ALL;



ALTER TABLE public."Ujian" ENABLE TRIGGER ALL;

--
-- Data for Name: UjianKelas; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."UjianKelas" DISABLE TRIGGER ALL;



ALTER TABLE public."UjianKelas" ENABLE TRIGGER ALL;

--
-- Data for Name: UjianSiswa; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."UjianSiswa" DISABLE TRIGGER ALL;



ALTER TABLE public."UjianSiswa" ENABLE TRIGGER ALL;

--
-- Data for Name: UjianSoal; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."UjianSoal" DISABLE TRIGGER ALL;



ALTER TABLE public."UjianSoal" ENABLE TRIGGER ALL;

--
-- Data for Name: _GuruMataPelajaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public."_GuruMataPelajaran" DISABLE TRIGGER ALL;

INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yox00385dudt5p2uvo1', 'cmj9z7q9i001r5dudnscpl8q0');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8ybn002q5dud7n4058u9', 'cmj9z7q84001d5dud60yqektg');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8y4a002g5dudjlq4s2jp', 'cmj9z7q7y001c5dudu38a65qb');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8y77002k5dudwjch4365', 'cmj9z7q8v001k5dudwd0dr0f2');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8xtu00225dudew59ixr7', 'cmj9z7q8k001h5dudkou2wtsf');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yd4002s5dudqb9lav2o', 'cmj9z7q9i001r5dudnscpl8q0');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8y5q002i5dudk3gr40r9', 'cmj9z7q98001o5dudu8zzru3q');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8y5q002i5dudk3gr40r9', 'cmj9z7q9f001q5dud3giiabft');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8y8o002m5dudwnycw1jf', 'cmj9z7q8c001f5dudtoyt49tx');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8y8o002m5dudwnycw1jf', 'cmj9z7q9n001s5dudxr525koc');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yhl002y5dudqly12oc3', 'cmj9z7q90001m5dud5q6cvaku');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yhl002y5dudqly12oc3', 'cmj9z7qae00205dudqey9zf1h');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8xyc00285dudgvf5bnnv', 'cmj9z7q8m001i5dudi334c2ms');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8xyc00285dudgvf5bnnv', 'cmj9z7q9i001r5dudnscpl8q0');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8xyc00285dudgvf5bnnv', 'cmj9z7q9v001v5dud8r2heab2');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8ykj00325dudk20mdgjx', 'cmj9z7q8x001l5dudh15r8ocj');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8y1b002c5dudh3e7fyuu', 'cmj9z7q9c001p5dudhh2cp17a');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8ya7002o5dudm0yzma1k', 'cmj9z7q8k001h5dudkou2wtsf');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8ya7002o5dudm0yzma1k', 'cmj9z7q8x001l5dudh15r8ocj');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8ya7002o5dudm0yzma1k', 'cmj9z7q9c001p5dudhh2cp17a');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8xzs002a5dudw0c717l2', 'cmj9z7q87001e5dudb1uk5u9j');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8xzs002a5dudw0c717l2', 'cmj9z7q9n001s5dudxr525koc');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8xzs002a5dudw0c717l2', 'cmj9z7q9v001v5dud8r2heab2');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8xzs002a5dudw0c717l2', 'cmj9z7qa0001w5dudmau1sngf');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yg3002w5dud29sel0av', 'cmj9z7q94001n5dudvyt50cow');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yg3002w5dud29sel0av', 'cmj9z7q9i001r5dudnscpl8q0');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yj000305dudtwddc0j1', 'cmj9z7q7y001c5dudu38a65qb');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yj000305dudtwddc0j1', 'cmj9z7qaa001z5dudjfz3mlu8');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yem002u5dudolwskcz4', 'cmj9z7q87001e5dudb1uk5u9j');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yem002u5dudolwskcz4', 'cmj9z7q9n001s5dudxr525koc');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8ynh00365dudxaiuoy08', 'cmjof810t000005udgq7bzpjh');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yly00345dudadjrqvfh', 'cmj9z7q8c001f5dudtoyt49tx');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yly00345dudadjrqvfh', 'cmj9z7q90001m5dud5q6cvaku');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8yly00345dudadjrqvfh', 'cmj9z7qa0001w5dudmau1sngf');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8y2q002e5dud69l0gx00', 'cmj9z7q8h001g5dud3cnj22wr');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8y2q002e5dud69l0gx00', 'cmj9z7qa5001x5dudniu477gy');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8xwv00265dud0w98oh1m', 'cmj9z7q98001o5dudu8zzru3q');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8xwv00265dud0w98oh1m', 'cmj9z7q9f001q5dud3giiabft');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8xwv00265dud0w98oh1m', 'cmj9z7qa8001y5dud4gjab2sw');
INSERT INTO public."_GuruMataPelajaran" ("A", "B") VALUES ('cmj9z8xvg00245duda7dxbp56', 'cmj9z7q8q001j5dudx5o1zuri');


ALTER TABLE public."_GuruMataPelajaran" ENABLE TRIGGER ALL;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER TABLE public._prisma_migrations DISABLE TRIGGER ALL;



ALTER TABLE public._prisma_migrations ENABLE TRIGGER ALL;

--
-- PostgreSQL database dump complete
--

\unrestrict Vm6HzLhvhGFnTHfVNCXxbzxNLWExQVVaq2bfZa8MNTReDS4W37rZmxLjrDqWGRC

