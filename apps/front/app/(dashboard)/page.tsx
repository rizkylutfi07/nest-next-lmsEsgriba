"use client";

import {
  Activity,
  BarChart3,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Clock,
  FileCheck,
  Globe2,
  Layers,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRole } from "./role-context";
import StudentDashboard from "@/components/student-dashboard";
import { useEffect, useState } from "react";
import { analyticsApi } from "@/lib/api";





export default function HomePage() {
  const { role } = useRole();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Show student dashboard for SISWA role
  if (role === "SISWA") {
    return <StudentDashboard />;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if (role === "ADMIN") {
          const data = await analyticsApi.getAdminDashboard();
          setDashboardData(data);
        } else if (role === "GURU") {
          const data = await analyticsApi.getGuruDashboard();
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (role) {
      fetchData();
    }
  }, [role]);

  const roleHeadline =
    role === "ADMIN"
      ? "Ruang kontrol sekolah"
      : role === "GURU"
        ? "Workspace mengajar & laporan"
        : "Dashboard belajar siswa";

  const roleSubtitle =
    role === "ADMIN"
      ? "Kelola operasional, data akademik, CBT, dan analitik."
      : role === "GURU"
        ? "Atur kelas, materi, ujian, dan rekap nilai."
        : "Lihat jadwal, materi, CBT, dan pengumuman terbaru.";

  const showManagement = role === "ADMIN";
  const showGuruTasks = true; // Since SISWA returns early, this is always true for remaining roles (ADMIN, GURU, etc) unless intended otherwise.

  // ADMIN HIGHLIGHTS
  const adminHighlights = [
    {
      title: "Total Siswa",
      value: loading ? "..." : `${dashboardData?.siswaCount || 0} siswa`,
      trend: "Data aktif",
      accent: "from-cyan-400/30 to-sky-500/20",
    },
    {
      title: "Total Guru",
      value: loading ? "..." : `${dashboardData?.guruCount || 0} guru`,
      trend: "Data aktif",
      accent: "from-emerald-400/25 to-teal-500/15",
    },
    {
      title: "Ujian Berjalan",
      value: loading ? "..." : `${dashboardData?.activeExams || 0} sesi`,
      trend: "Realtime monitoring",
      accent: "from-purple-400/30 to-indigo-500/10",
    },
  ];

  // GURU HIGHLIGHTS
  const guruHighlights = [
    {
      title: "Kelas Saya",
      value: loading ? "..." : `${dashboardData?.stats?.totalClasses || 0} kelas`,
      trend: "Diampu saat ini",
      accent: "from-cyan-400/30 to-sky-500/20",
    },
    {
      title: "Total Siswa",
      value: loading ? "..." : `${dashboardData?.stats?.totalStudents || 0} siswa`,
      trend: "Dalam jangkauan",
      accent: "from-emerald-400/25 to-teal-500/15",
    },
    {
      title: "Perlu Dinilai",
      value: loading ? "..." : `${dashboardData?.stats?.tasksToGrade || 0} tugas`,
      trend: "Menunggu review",
      accent: "from-purple-400/30 to-indigo-500/10",
    },
  ];

  const highlights = role === "ADMIN" ? adminHighlights : guruHighlights;

  // GURU SCHEDULE
  const schedule = role === "GURU" && dashboardData?.todaySchedule ? dashboardData.todaySchedule.map((s: any) => ({
    time: s.time,
    title: s.className, // Fallback reuse UI field
    mentor: s.subject,
    room: s.room,
    mode: "On-site"
  })) : [];

  // CBT ITEMS - Dynamic based on real data
  const cbtItems = [
    {
      title: "Data Soal",
      detail: "Bank soal adaptif dengan tagging kompetensi dan tingkat kesulitan.",
      stat: loading ? "..." : `${dashboardData?.totalSoal || 0} soal aktif`,
      icon: Layers,
      badge: "Bank Soal",
    },
    {
      title: "Data Ujian",
      detail: "Template ujian, mata pelajaran, dan aturan kelulusan.",
      stat: loading ? "..." : `${dashboardData?.totalUjian || 0} ujian terdaftar`,
      icon: FileCheck,
      badge: "Ujian",
    },
    {
      title: "Data Paket Soal",
      detail: "Kelola paket soal yang siap untuk ujian.",
      stat: loading ? "..." : `${dashboardData?.totalPaketSoal || 0} paket`,
      icon: Timer,
      badge: "Paket",
    },
    {
      title: "Tugas Dikumpulkan",
      detail: "Tugas siswa yang menunggu penilaian.",
      stat: loading ? "..." : `${dashboardData?.tugasDikumpulkan || 0} tugas`,
      icon: Activity,
      badge: "Menunggu",
    },
    {
      title: "Penilaian",
      detail: "Tugas yang telah dinilai.",
      stat: loading ? "..." : `${dashboardData?.tugasDinilai || 0} sudah dinilai`,
      icon: Star,
      badge: "Nilai",
    },
  ];

  // ESSENTIAL DATA - Dynamic based on real data
  const essentialData = [
    {
      title: "Data Siswa",
      detail: "Profil, kehadiran, dan histori kelas.",
      stat: loading ? "..." : `${dashboardData?.siswaCount || 0} siswa aktif`,
      action: "Kelola siswa",
      href: "/siswa",
      icon: Users2,
    },
    {
      title: "Data Guru",
      detail: "Penugasan, beban mengajar, dan sertifikasi.",
      stat: loading ? "..." : `${dashboardData?.guruCount || 0} guru`,
      action: "Kelola guru",
      href: "/guru",
      icon: Users2,
    },
    {
      title: "Data Kelas",
      detail: "Struktur kelas, wali, dan kapasitas.",
      stat: loading ? "..." : `${dashboardData?.kelasCount || 0} kelas`,
      action: "Kelola kelas",
      href: "/kelas",
      icon: Layers,
    },
    {
      title: "Tahun Ajaran Aktif",
      detail: "Periode berjalan, kalender akademik, dan status aktif.",
      stat: loading ? "..." : dashboardData?.tahunAjaranAktif || "N/A",
      action: "Setel tahun ajaran",
      href: "/tahun-ajaran",
      icon: CalendarRange,
    },
    {
      title: "Mata Pelajaran",
      detail: "Silabus, pemetaan kompetensi, dan penanggung jawab.",
      stat: loading ? "..." : `${dashboardData?.mapelCount || 0} mapel`,
      action: "Kelola mapel",
      href: "/mata-pelajaran",
      icon: BookOpen,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden border-primary/40 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
          <CardHeader className="gap-4 pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="info" className="uppercase tracking-[0.18em]">
                LMS Modern
              </Badge>
              <Badge tone="success" className="gap-2">
                <CheckCircle2 size={14} />
                Terhubung SIS
              </Badge>
            </div>
            <CardTitle className="text-3xl md:text-4xl">
              {roleHeadline}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground md:max-w-3xl">
              {roleSubtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className={cn(
                    "rounded-xl border border-border p-4 shadow-lg shadow-black/10",
                    "bg-gradient-to-br",
                    item.accent,
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {item.title}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                  <p className="text-xs text-primary">{item.trend}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Quick Actions based on Role */}
              {role === "ADMIN" && (
                <>
                  <Button size="sm" variant="secondary" className="gap-2">
                    <ClipboardCheck size={16} />
                    Tinjau performa
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <MessageSquare size={16} />
                    Kirim pengumuman
                  </Button>
                </>
              )}
              {role === "GURU" && (
                <>
                  <Button size="sm" variant="secondary" className="gap-2">
                    <ClipboardCheck size={16} />
                    Rencana mengajar
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <MessageSquare size={16} />
                    Kirim catatan kelas
                  </Button>
                </>
              )}
              <Button size="sm" variant="ghost" className="gap-2 text-muted-foreground">
                <Globe2 size={16} />
                Lihat portal siswa
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Card - Only for GURU */}
        {role === "GURU" && (
          <Card className="border-border bg-card/70 backdrop-blur">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <CalendarRange size={18} />
                Jadwal Mengajar Hari Ini
              </CardTitle>
              <CardDescription>
                Agenda kelas anda hari ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? <p className="text-sm text-muted-foreground">Memuat jadwal...</p> :
                schedule.length > 0 ? schedule.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 rounded-lg border border-white/5 bg-muted/40 p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.mentor} - {item.room}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge tone="info">{item.mode}</Badge>
                      <span className="text-muted-foreground">{item.time} WIB</span>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">Tidak ada jadwal mengajar hari ini.</p>
              }
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-primary/30 bg-card/70">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck size={18} />
              CBT & Ujian Digital
            </CardTitle>
            <CardDescription>
              Kelola seluruh siklus CBT: Data Soal, Data Ujian, Data Sesi, Monitoring, Penilaian.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="info">Terintegrasi</Badge>
            <Badge tone="success">Anti-cheat</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {cbtItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 rounded-xl border border-white/8 bg-muted/40 p-4 transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.stat}</p>
                    </div>
                    <Badge tone="warning" className="ml-auto text-[11px]">
                      {item.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="gap-2">
              <ClipboardCheck size={16} />
              Masuk ke menu CBT
            </Button>
            <Button size="sm" variant="outline" className="gap-2">
              <Activity size={16} />
              Pantau ujian live
            </Button>
            <Button size="sm" variant="ghost" className="gap-2 text-muted-foreground">
              <FileCheck size={16} />
              Lihat template ujian
            </Button>
          </div>
        </CardContent>
      </Card>

      {showManagement && (
        <Card className="border-border bg-card/70">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Data akademik esensial</CardTitle>
              <CardDescription>Kelola data dasar sekolah sebelum fitur lanjut.</CardDescription>
            </div>
            <Badge tone="info">Sinkron SIS</Badge>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {essentialData.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 rounded-xl border border-white/8 bg-muted/40 p-4 transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                      <p className="text-xs text-primary">{item.stat}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-fit gap-2" asChild>
                    <a href={item.href}>
                      <Sparkles size={14} />
                      {item.action}
                    </a>
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

