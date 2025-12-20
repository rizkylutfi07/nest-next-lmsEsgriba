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

const essentialData = [
  {
    title: "Data Siswa",
    detail: "Profil, kehadiran, dan histori kelas.",
    stat: "8.420 siswa aktif",
    action: "Kelola siswa",
    href: "/siswa",
    icon: Users2,
  },
  {
    title: "Data Guru",
    detail: "Penugasan, beban mengajar, dan sertifikasi.",
    stat: "312 guru",
    action: "Kelola guru",
    href: "/guru",
    icon: Users2,
  },
  {
    title: "Data Kelas",
    detail: "Struktur kelas, wali, dan kapasitas.",
    stat: "246 kelas",
    action: "Kelola kelas",
    href: "/kelas",
    icon: Layers,
  },
  {
    title: "Tahun Ajaran Aktif",
    detail: "Periode berjalan, kalender akademik, dan status aktif.",
    stat: "2025 / 2026",
    action: "Setel tahun ajaran",
    href: "/tahun-ajaran",
    icon: CalendarRange,
  },
  {
    title: "Mata Pelajaran",
    detail: "Silabus, pemetaan kompetensi, dan penanggung jawab.",
    stat: "58 mapel",
    action: "Kelola mapel",
    href: "/mata-pelajaran",
    icon: BookOpen,
  },
];

export default function HomePage() {
  const { role } = useRole();

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
  const showGuruTasks = role !== "SISWA";

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
              {role === "SISWA" && (
                <>
                  <Button size="sm" variant="secondary" className="gap-2">
                    <ClipboardCheck size={16} />
                    Lanjutkan belajar
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <MessageSquare size={16} />
                    Hubungi wali kelas
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

        <Card className="border-border bg-card/70 backdrop-blur">
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
            ))}
          </CardContent>
        </Card>
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
              {role === "SISWA" ? "Lihat jadwal ujian" : "Masuk ke menu CBT"}
            </Button>
            {role !== "SISWA" && (
              <Button size="sm" variant="outline" className="gap-2">
                <Activity size={16} />
                Pantau ujian live
              </Button>
            )}
            <Button size="sm" variant="ghost" className="gap-2 text-muted-foreground">
              <FileCheck size={16} />
              {role === "SISWA" ? "Hasil ujian" : "Lihat template ujian"}
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

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border bg-card/70">
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
                className="rounded-xl border border-white/5 bg-muted/40 p-4"
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

        {showGuruTasks && (
          <Card className="border-border bg-card/70">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {role === "ADMIN" ? "Rencana & tugas manajemen" : "Agenda guru"}
                </CardTitle>
                <CardDescription>
                  {role === "ADMIN"
                    ? "Prioritas singkat untuk admin."
                    : "Checklist kelas & CBT yang perlu dibuka."}
                </CardDescription>
              </div>
              <Badge tone="warning">3 tugas</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.title}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-muted/40 px-3 py-2"
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
              {role === "ADMIN" && (
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
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-border bg-card/70">
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
                className="rounded-lg border border-white/5 bg-muted/40 p-4"
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

        {role !== "SISWA" && (
          <Card className="border-border bg-card/70">
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
              <div className="rounded-xl border border-white/5 bg-muted/40 p-4">
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
        )}
      </div>
    </div>
  );
}
