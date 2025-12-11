"use client";

import { useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  CalendarRange,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardCheck,
  Clock,
  CreditCard,
  FileCheck,
  Globe2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings2,
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

const navigation = [
  { label: "Dasbor", icon: LayoutDashboard, active: true, note: "Sorotan hari ini" },
  { label: "Akademik", icon: GraduationCap, note: "Silabus, kurikulum" },
  { label: "Kelas & Jadwal", icon: CalendarRange, note: "5 sesi live", badge: "Live" },
  { label: "Modul & Konten", icon: BookOpen, note: "46 course aktif" },
  { label: "CBT", icon: ClipboardCheck, note: "Data Soal, Ujian, Sesi", badge: "CBT" },
  { label: "Guru & Staff", icon: Users2, note: "Penjadwalan & KPI" },
  { label: "Keuangan", icon: CreditCard, note: "Tagihan, SPP" },
  { label: "Pelaporan", icon: BarChart3, note: "Analitik & export" },
];

const highlights = [
  {
    title: "Aktif hari ini",
    value: "1.284 siswa",
    trend: "+12% vs kemarin",
    accent: "from-cyan-400/30 to-sky-500/20",
  },
  {
    title: "Guru siap mengajar",
    value: "68/74",
    trend: "91% kehadiran",
    accent: "from-emerald-400/25 to-teal-500/15",
  },
  {
    title: "Kepuasan belajar",
    value: "4.82/5",
    trend: "268 feedback minggu ini",
    accent: "from-purple-400/30 to-indigo-500/10",
  },
];

const schedule = [
  {
    time: "08:00",
    title: "Aljabar Lanjut",
    mentor: "Bu Diah",
    room: "Lab Matematika 02",
    mode: "Hybrid",
  },
  {
    time: "10:15",
    title: "UI/UX Creative Sprint",
    mentor: "Pak Bram",
    room: "Studio Desain",
    mode: "On-site",
  },
  {
    time: "13:30",
    title: "Bahasa Inggris Academic",
    mentor: "Ms. Evelyn",
    room: "Zoom - 482 221",
    mode: "Online",
  },
];

const courses = [
  {
    title: "Data Science for School",
    progress: 76,
    badge: "STEM",
    mentor: "Mentor Rania",
    tone: "info" as const,
  },
  {
    title: "Creative Writing Lab",
    progress: 52,
    badge: "Literasi",
    mentor: "Mentor Iman",
    tone: "success" as const,
  },
  {
    title: "Leadership & Softskill",
    progress: 34,
    badge: "Karakter",
    mentor: "Mentor Sari",
    tone: "warning" as const,
  },
];

const announcements = [
  {
    title: "Rapat kurikulum lintas jurusan",
    detail: "Kolaborasi guru IPA, IPS, Bahasa untuk semester baru.",
    time: "Hari ini - 16.00",
  },
  {
    title: "Pembukaan program microlearning",
    detail: "Modul 15 menit untuk skill digital siswa.",
    time: "Besok - 09.30",
  },
  {
    title: "Upgrade infrastruktur jaringan",
    detail: "Downtime server perpustakaan pukul 21.00-22.00.",
    time: "Jumat - 21.00",
  },
];

const tasks = [
  { title: "Approve pengajuan kelas baru", owner: "Koordinator Akademik", status: "Segera" },
  { title: "Review laporan kehadiran guru", owner: "HR School", status: "Progres" },
  { title: "Kirim pengumuman ujian tengah", owner: "Admin", status: "Dijadwalkan" },
];

const cbtItems = [
  {
    title: "Data Soal",
    detail: "Bank soal adaptif dengan tagging kompetensi dan tingkat kesulitan.",
    stat: "1.240 soal aktif",
    icon: Layers,
    badge: "Bank Soal",
  },
  {
    title: "Data Ujian",
    detail: "Template ujian, mata pelajaran, dan aturan kelulusan.",
    stat: "32 jadwal minggu ini",
    icon: FileCheck,
    badge: "Ujian",
  },
  {
    title: "Data Sesi",
    detail: "Kelola slot, durasi, token akses, dan perangkat yang diizinkan.",
    stat: "14 sesi berjalan",
    icon: Timer,
    badge: "Sesi",
  },
  {
    title: "Data Monitoring Ujian",
    detail: "Pantau live, perangkat ganda, dan status submit siswa.",
    stat: "Stabil - 0 insiden",
    icon: Activity,
    badge: "Monitoring",
  },
  {
    title: "Penilaian",
    detail: "Auto-scoring, essay rubric, dan publish nilai ke portal.",
    stat: "78% sudah dinilai",
    icon: Star,
    badge: "Nilai",
  },
];

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute inset-x-0 top-[-160px] h-80 bg-gradient-to-b from-primary/30 via-transparent to-transparent blur-3xl" />
        <div className="absolute right-[-80px] top-28 h-80 w-80 rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute left-[-60px] bottom-[-60px] h-80 w-80 rounded-full bg-emerald-400/15 blur-[110px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-white/10 bg-card/80 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 md:static md:translate-x-0 md:flex-shrink-0",
            sidebarCollapsed ? "md:w-[92px]" : "md:w-[292px]",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
        >
          <div className="flex items-center justify-between px-4 py-4">
            <div
              className={cn(
                "flex items-center gap-3",
                sidebarCollapsed && "md:justify-center md:gap-0",
              )}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-background shadow-lg shadow-primary/40">
                <Sparkles size={20} />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
                    Arunika
                  </p>
                  <p className="text-lg font-semibold">LMS + School</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Tutup menu"
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                aria-label="Collapse sidebar"
              >
                {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </Button>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 pb-4">
            {navigation.map((item) => (
              <button
                key={item.label}
                type="button"
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left text-sm font-semibold transition duration-200",
                  item.active
                    ? "border-primary/50 bg-primary/10 text-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:border-white/10 hover:bg-white/5 hover:text-foreground",
                )}
              >
                <item.icon
                  size={18}
                  className={cn(
                    "text-primary transition duration-200 group-hover:scale-105",
                    item.active && "drop-shadow",
                  )}
                />
                {!sidebarCollapsed && (
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <div>
                      <p>{item.label}</p>
                      <p className="text-xs font-normal text-muted-foreground">{item.note}</p>
                    </div>
                    {item.badge && (
                      <Badge tone="warning" className="px-2 py-1 text-[10px] uppercase">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </button>
            ))}
          </nav>

          <div className="space-y-3 border-t border-white/5 p-4">
            <Card className="border-white/10 bg-gradient-to-br from-white/5 via-card/60 to-background/70">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <ShieldCheck size={18} />
                  </div>
                  {!sidebarCollapsed && (
                    <div>
                      <p className="text-sm font-semibold">Keamanan terjaga</p>
                      <p className="text-xs text-muted-foreground">
                        Single sign-on + audit trail aktif
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="flex items-center justify-between gap-3">
              {!sidebarCollapsed && (
                <div className="text-xs text-muted-foreground">
                  Tahun ajaran 2025/2026
                  <p className="text-foreground">Siklus berjalan</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Settings2 size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 md:pl-0">
          <header className="sticky top-0 z-20 border-b border-white/5 bg-background/70 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-8">
              <div className="flex flex-1 items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileSidebarOpen(true)}
                  aria-label="Buka menu"
                >
                  <Menu size={18} />
                </Button>
                <div className="relative hidden flex-1 items-center md:flex">
                  <div className="absolute left-3 text-muted-foreground">
                    <Globe2 size={16} />
                  </div>
                  <input
                    placeholder="Cari kelas, siswa, atau modul..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-sm outline-none transition focus:border-primary/60 focus:bg-white/10"
                  />
                  <div className="absolute right-3 text-xs text-muted-foreground">
                    tekan /
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden md:inline-flex">
                  <CalendarRange size={16} />
                  Atur jadwal
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={18} />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
                </Button>
                <Button size="sm">
                  <Sparkles size={16} />
                  Buat materi
                </Button>
              </div>
            </div>
          </header>

          <div className="px-4 pb-10 pt-6 md:px-8 md:pt-8">
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
                    Ruang belajar elegan untuk siswa, guru, dan admin sekolah.
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground md:max-w-3xl">
                    Kelola kelas, pantau performa, bagikan materi, dan jalankan manajemen
                    sekolah dalam satu dashboard responsif.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {highlights.map((item) => (
                      <div
                        key={item.title}
                        className={cn(
                          "rounded-xl border border-white/10 p-4 shadow-lg shadow-black/10",
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
                    <Button size="sm" variant="secondary" className="gap-2">
                      <ClipboardCheck size={16} />
                      Tinjau performa
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <MessageSquare size={16} />
                      Kirim pengumuman
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-2 text-muted-foreground">
                      <Globe2 size={16} />
                      Lihat portal siswa
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-card/70 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarRange size={18} />
                    Jadwal live hari ini
                  </CardTitle>
                  <CardDescription>Responsif untuk kelas online maupun on-site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {schedule.map((item) => (
                    <div
                      key={item.title}
                      className="flex flex-col gap-2 rounded-lg border border-white/5 bg-white/5 p-3 md:flex-row md:items-center md:justify-between"
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
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
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
                          className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/5 p-4 transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15"
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
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="border-white/10 bg-card/70">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Progress course utama</CardTitle>
                    <CardDescription>Perkembangan modul inti lintas kelas.</CardDescription>
                  </div>
                  <Badge tone="success">Realtime</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.title}
                      className="rounded-xl border border-white/5 bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.mentor}</p>
                        </div>
                        <Badge tone={course.tone}>{course.badge}</Badge>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {course.progress}% selesai
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-card/70">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Rencana & tugas manajemen</CardTitle>
                    <CardDescription>Prioritas singkat untuk admin.</CardDescription>
                  </div>
                  <Badge tone="warning">3 tugas</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.title}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-semibold">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.owner}</p>
                      </div>
                      <Badge tone="info" className="text-[11px]">
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-3">
                    <div>
                      <p className="text-sm font-semibold">Tambah automasi</p>
                      <p className="text-xs text-muted-foreground">
                        Kirim notifikasi & laporan berkala
                      </p>
                    </div>
                    <Button size="sm" variant="secondary" className="gap-2">
                      <Sparkles size={16} />
                      Mulai
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <Card className="border-white/10 bg-card/70">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Pengumuman & broadcast</CardTitle>
                    <CardDescription>Jangkau siswa, guru, dan orang tua.</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2">
                    <MessageSquare size={16} />
                    Buat baru
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.title}
                      className="rounded-lg border border-white/5 bg-white/5 p-4"
                    >
                      <p className="font-semibold">{announcement.title}</p>
                      <p className="text-sm text-muted-foreground">{announcement.detail}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-primary">
                        <Circle size={6} />
                        {announcement.time}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-card/70">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Aktivitas terbaru</CardTitle>
                    <CardDescription>Rekap lintas modul & pengguna.</CardDescription>
                  </div>
                  <Badge tone="success" className="gap-1">
                    <Sparkles size={14} />
                    Stabil
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Users2 size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">156 siswa menyelesaikan modul</p>
                      <p className="text-xs text-muted-foreground">30 menit terakhir</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 text-secondary-foreground">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Audit login multi-device aman</p>
                      <p className="text-xs text-muted-foreground">SSO + OTP aktif</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">Bandwidth penggunaan video</p>
                        <p className="text-xs text-muted-foreground">Diukur per 30 menit</p>
                      </div>
                      <Badge tone="warning">Streaming</Badge>
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                      <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-secondary via-primary to-accent" />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>3.2 TB digunakan</span>
                      <span>Kuota aman</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
