"use client";

import { useQuery } from "@tanstack/react-query";
import {
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    MessageSquare,
    TrendingUp,
    Award,
    Target,
    Zap,
    ArrowRight,
    BookMarked,
    Bell,
    Megaphone,
    CalendarClock,
    GraduationCap,
    MapPin,
    User,
    XCircle,
    AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { tugasApi, materiApi, notifikasiApi, API_URL } from "@/lib/api";
import { AnnouncementWidget } from "@/components/announcement-widget";
import { useRole } from "@/app/(dashboard)/role-context";

const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: "Lewat!", urgent: true };
    if (days === 0) return { text: "Hari ini", urgent: true };
    if (days === 1) return { text: "Besok", urgent: true };
    if (days <= 3) return { text: `${days} hari`, urgent: true };
    return { text: `${days} hari`, urgent: false };
};

const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days === 1) return "Kemarin";
    return `${days} hari yang lalu`;
};

// Helper for Jadwal
const HARI = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"] as const;
const getCurrentDay = (): string => {
    const days = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
    const today = new Date().getDay();
    const currentDay = days[today];
    return currentDay === "MINGGU" ? "SENIN" : currentDay;
};

export default function StudentDashboard() {
    const { token, user } = useRole();
    const currentDay = getCurrentDay();

    // 1. Fetch PENGUMUMAN (handled by widget, but we put it first)

    // 2. Fetch JADWAL HARI INI
    const { data: jadwalList = [], isLoading: jadwalLoading } = useQuery({
        queryKey: ["jadwal-pelajaran", "student-dashboard", currentDay],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/jadwal-pelajaran?hari=${currentDay}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        enabled: !!token,
    });

    // Filter jadwal for student's class
    const mySchedule = Array.isArray(jadwalList)
        ? jadwalList
            .filter((j: any) => j.kelasId === user?.siswa?.kelasId)
            .sort((a: any, b: any) => {
                const timeA = parseInt(a.jamMulai.replace(":", ""));
                const timeB = parseInt(b.jamMulai.replace(":", ""));
                return timeA - timeB;
            })
        : [];


    // 3. Fetch TUGAS
    const { data: tugasList = [], isLoading: tugasLoading } = useQuery({
        queryKey: ["tugas", "student"],
        queryFn: () => tugasApi.getAll({}),
    });
    const tugasArray = Array.isArray(tugasList) ? tugasList : [];
    const now = new Date();
    const upcomingTasks = tugasArray
        .filter((t: any) => {
            const deadline = new Date(t.deadline);
            const hasSubmitted = t.submissions?.length > 0;
            return deadline > now && !hasSubmitted;
        })
        .sort((a: any, b: any) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 5);


    // 4. Fetch UJIAN
    const { data: examsData, isLoading: examsLoading } = useQuery({
        queryKey: ["ujian-siswa-available", "dashboard"],
        queryFn: async () => {
            const res = await fetch(
                `${API_URL}/ujian-siswa/available`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
        enabled: !!token,
    });
    const exams = Array.isArray(examsData) ? examsData : [];
    const availableExams = exams.filter((item: any) => {
        const ujian = item.ujian;
        if (!ujian) return false;
        const start = new Date(ujian.tanggalMulai);
        const end = new Date(ujian.tanggalSelesai);
        return now >= start && now <= end && item.status !== "SELESAI";
    }).slice(0, 3);


    // 5. Fetch ATTENDANCE for current month
    const currentMonth = new Date();
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString().split('T')[0];

    const { data: attendanceData = [] } = useQuery({
        queryKey: ["student-attendance-dashboard", user?.siswa?.id, startDate, endDate],
        queryFn: async () => {
            if (!user?.siswa?.id) return [];
            const res = await fetch(
                `${API_URL}/attendance/student/${user.siswa.id}?startDate=${startDate}&endDate=${endDate}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
        enabled: !!user?.siswa?.id && !!token,
    });

    // Create attendance map
    const attendanceByDate = new Map();
    attendanceData.forEach((record: any) => {
        const dateKey = typeof record.tanggal === 'string'
            ? record.tanggal.split('T')[0]!
            : new Date(record.tanggal).toISOString().split('T')[0]!;
        attendanceByDate.set(dateKey, record);
    });

    // Generate calendar days for current month
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = firstDay.getDay();
    const calendarDays: (Date | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(new Date(year, month, day));
    }

    // Stats
    const { data: materiResponse } = useQuery({
        queryKey: ["materi", "student"],
        queryFn: () => materiApi.getAll({}),
    });
    const materiList = Array.isArray(materiResponse) ? materiResponse : (materiResponse as any)?.data || [];

    const tugasPending = tugasArray.filter((t: any) => {
        const deadline = new Date(t.deadline);
        const hasSubmitted = t.submissions?.length > 0;
        return deadline > now && !hasSubmitted;
    }).length;

    const tugasCompleted = tugasArray.filter((t: any) => {
        return t.submissions?.length > 0;
    }).length;

    const gradedSubmissions = tugasArray.flatMap((t: any) =>
        (t.submissions || []).filter((s: any) => s.status === "DINILAI" && s.score !== null)
    );
    const avgScore = gradedSubmissions.length > 0
        ? Math.round(gradedSubmissions.reduce((sum: number, s: any) => sum + (s.score || 0), 0) / gradedSubmissions.length)
        : 0;

    const studentStats = {
        materiCount: materiList.length,
        tugasPending,
        tugasCompleted,
        avgScore,
    };

    const isLoading = jadwalLoading || tugasLoading || examsLoading;

    return (
        <div className="space-y-8">
            {/* Header with Welcome & Quick Stats */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard Siswa</h1>
                        <p className="text-muted-foreground">Selamat datang, {user?.name || "Siswa"}! 👋</p>
                    </div>
                </div>

                {/* Top Navigation Buttons - Compact Design */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Link href="/pengumuman" className="group">
                        <Card className="border-transparent shadow-sm transition-all hover:shadow-md hover:border-blue-500/30 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
                            <CardContent className="flex items-center gap-3 p-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <Megaphone className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-semibold text-sm text-blue-900 dark:text-blue-100">Pengumuman</span>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/jadwal-pelajaran" className="group">
                        <Card className="border-transparent shadow-sm transition-all hover:shadow-md hover:border-amber-500/30 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20">
                            <CardContent className="flex items-center gap-3 p-3">
                                <div className="h-10 w-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <CalendarClock className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-semibold text-sm text-amber-900 dark:text-amber-100">Jadwal</span>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/tugas" className="group">
                        <Card className="border-transparent shadow-sm transition-all hover:shadow-md hover:border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20">
                            <CardContent className="flex items-center gap-3 p-3">
                                <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <BookMarked className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">Tugas & PR</span>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/ujian-saya" className="group">
                        <Card className="border-transparent shadow-sm transition-all hover:shadow-md hover:border-purple-500/30 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20">
                            <CardContent className="flex items-center gap-3 p-3">
                                <div className="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                    <GraduationCap className="h-5 w-5 text-white" />
                                </div>
                                <span className="font-semibold text-sm text-purple-900 dark:text-purple-100">Ujian</span>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                {/* Main Column */}
                <div className="space-y-8">

                    {/* PRIORITY 1: PENGUMUMAN */}
                    <div id="pengumuman-section">
                        <AnnouncementWidget role="SISWA" />
                    </div>

                    {/* PRIORITY 2: JADWAL HARI INI */}
                    <Card className="border-border bg-card/70 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-amber-500" />
                                Jadwal Hari Ini
                                <span className="text-sm font-normal text-muted-foreground ml-2 capitalize">
                                    ({currentDay.toLowerCase()})
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {jadwalLoading ? (
                                <div className="text-center py-8">Memuat jadwal...</div>
                            ) : jadwalList.length > 0 ? (
                                <div className="space-y-3">
                                    {jadwalList.map((item: any, index: number) => {
                                        // Check if this class is currently ongoing
                                        const now = new Date();
                                        const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
                                        const [startHour, startMin] = item.jamMulai.split(':').map(Number);
                                        const [endHour, endMin] = item.jamSelesai.split(':').map(Number);
                                        const startTime = startHour * 60 + startMin;
                                        const endTime = endHour * 60 + endMin;
                                        const isOngoing = currentTime >= startTime && currentTime < endTime;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`flex items-center gap-4 p-3 rounded-lg transition-all ${isOngoing
                                                        ? 'bg-emerald-500/10 border-2 border-emerald-500/30 shadow-md'
                                                        : 'bg-muted/30 border-2 border-transparent hover:bg-muted/50'
                                                    }`}
                                            >
                                                <div className={`flex flex-col items-center min-w-[60px] ${isOngoing ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                                                    }`}>
                                                    <span className="text-xs font-medium">{item.jamMulai}</span>
                                                    <div className={`h-[1px] w-6 my-0.5 ${isOngoing ? 'bg-emerald-500/50' : 'bg-amber-500/30'
                                                        }`}></div>
                                                    <span className="text-xs opacity-80">{item.jamSelesai}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold truncate">{item.mataPelajaran?.nama}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                                                        <User size={14} />
                                                        <span className="truncate">{item.guru?.nama}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1 items-end">
                                                    {isOngoing && (
                                                        <Badge className="bg-emerald-500 text-white border-0 text-xs">
                                                            Sedang Berlangsung
                                                        </Badge>
                                                    )}
                                                    <Badge variant="outline" className="hidden sm:flex">
                                                        Jam ke-{index + 1}
                                                    </Badge>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                    <Calendar className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                    <p>Tidak ada jadwal pelajaran hari ini.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* PRIORITY 3: TUGAS */}
                    <Card className="border-border bg-card/70 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-emerald-500" />
                                    Tugas Segera
                                </CardTitle>
                                <CardDescription>Selesaikan sebelum tenggat waktu</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/tugas">Lihat Semua <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {tugasLoading ? (
                                <div className="text-center py-8">Memuat tugas...</div>
                            ) : upcomingTasks.length > 0 ? (
                                <div className="grid gap-3">
                                    {upcomingTasks.map((task: any) => {
                                        const daysInfo = getDaysRemaining(task.deadline);
                                        return (
                                            <div key={task.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border bg-background/50 p-4 hover:border-emerald-500/30 transition-all">
                                                <div className="space-y-1">
                                                    <h4 className="font-semibold hover:text-emerald-600 transition-colors">
                                                        <Link href={`/tugas/${task.id}`}>{task.judul}</Link>
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span className="font-medium text-foreground/80">
                                                            {task.mataPelajaran?.nama}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{new Date(task.deadline).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant={daysInfo.urgent ? "destructive" : "secondary"}
                                                    className={cn("w-fit", daysInfo.urgent ? "bg-red-500/10 text-red-600 hover:bg-red-500/20" : "")}
                                                >
                                                    <Clock size={12} className="mr-1" />
                                                    {daysInfo.text}
                                                </Badge>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                    <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-20 text-emerald-500" />
                                    <p>Hore! Tidak ada tugas yang mendesak.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* PRIORITY 4: UJIAN */}
                    <Card className="border-border bg-card/70 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-purple-500" />
                                    Ujian Tersedia
                                </CardTitle>
                                <CardDescription>Ujian yang sedang berlangsung</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/ujian-saya">Lihat Semua <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {examsLoading ? (
                                <div className="text-center py-8">Memuat ujian...</div>
                            ) : availableExams.length > 0 ? (
                                <div className="grid gap-3">
                                    {availableExams.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-purple-500 hover:bg-purple-600">UJO</Badge>
                                                    <h4 className="font-semibold">{item.ujian?.judul}</h4>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{item.ujian?.mataPelajaran?.nama}</p>
                                            </div>
                                            <Button size="sm" asChild>
                                                <Link href={`/ujian-saya/mulai/${item.ujian?.id}`}>Mulai</Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                    <Award className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                    <p>Tidak ada ujian aktif saat ini.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Sidebar Column (Stats & Others) */}
                <div className="space-y-6">
                    {/* Compact Stats */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Statistik Belajar</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-blue-500/10 p-3 text-center">
                                <h3 className="text-2xl font-bold text-blue-600">{studentStats.materiCount}</h3>
                                <p className="text-xs text-muted-foreground">Materi</p>
                            </div>
                            <div className="rounded-lg bg-amber-500/10 p-3 text-center">
                                <h3 className="text-2xl font-bold text-amber-600">{studentStats.tugasPending}</h3>
                                <p className="text-xs text-muted-foreground">Pending</p>
                            </div>
                            <div className="rounded-lg bg-emerald-500/10 p-3 text-center">
                                <h3 className="text-2xl font-bold text-emerald-600">{studentStats.tugasCompleted}</h3>
                                <p className="text-xs text-muted-foreground">Selesai</p>
                            </div>
                            <div className="rounded-lg bg-purple-500/10 p-3 text-center">
                                <h3 className="text-2xl font-bold text-purple-600">{studentStats.avgScore}</h3>
                                <p className="text-xs text-muted-foreground">Rata-rata</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attendance Calendar */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Calendar size={18} /> Kalender Kehadiran
                                </CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/kehadiran-saya" className="text-xs">
                                        Lihat Detail
                                    </Link>
                                </Button>
                            </div>
                            <CardDescription className="capitalize">
                                {currentMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-7 gap-1">
                                {/* Header */}
                                {["M", "S", "S", "R", "K", "J", "S"].map((day, i) => (
                                    <div key={i} className="text-center text-xs font-semibold text-muted-foreground p-1">
                                        {day}
                                    </div>
                                ))}
                                {/* Days */}
                                {calendarDays.map((date, index) => {
                                    if (!date) {
                                        return <div key={`empty-${index}`} className="aspect-square" />;
                                    }
                                    const dateStr = date.toISOString().split('T')[0];
                                    const attendance = attendanceByDate.get(dateStr) || null;
                                    const isToday = dateStr === new Date().toISOString().split('T')[0];

                                    const statusColors: Record<string, string> = {
                                        HADIR: "bg-green-500/20 text-green-700 dark:text-green-400",
                                        TERLAMBAT: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
                                        SAKIT: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
                                        IZIN: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
                                        ALPHA: "bg-red-500/20 text-red-700 dark:text-red-400",
                                    };

                                    return (
                                        <div
                                            key={dateStr}
                                            className={cn(
                                                "aspect-square rounded text-xs flex items-center justify-center font-medium",
                                                isToday && "ring-2 ring-primary",
                                                attendance ? statusColors[attendance.status] : "text-muted-foreground/50"
                                            )}
                                        >
                                            {date.getDate()}
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Legend */}
                            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 size={12} className="text-green-600" />
                                    <span>Hadir</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={12} className="text-orange-600" />
                                    <span>Terlambat</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle size={12} className="text-blue-600" />
                                    <span>Sakit</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FileText size={12} className="text-yellow-600" />
                                    <span>Izin</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
