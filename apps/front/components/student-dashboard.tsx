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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { tugasApi, materiApi, notifikasiApi } from "@/lib/api";
import { AnnouncementWidget } from "@/components/announcement-widget";

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

export default function StudentDashboard() {
    // Fetch tugas for student (backend filters by student's class)
    const { data: tugasList = [], isLoading: tugasLoading } = useQuery({
        queryKey: ["tugas", "student"],
        queryFn: () => tugasApi.getAll({}),
    });

    // Fetch materi
    const { data: materiResponse, isLoading: materiLoading } = useQuery({
        queryKey: ["materi", "student"],
        queryFn: () => materiApi.getAll({}),
    });
    const materiList = Array.isArray(materiResponse) ? materiResponse : (materiResponse as any)?.data || [];

    // Fetch notifications for recent activity
    const { data: notifikasiList = [], isLoading: notifikasiLoading } = useQuery({
        queryKey: ["notifikasi", "student-dashboard"],
        queryFn: () => notifikasiApi.getAll({}),
    });

    // Calculate stats from real data
    const now = new Date();
    const tugasArray = Array.isArray(tugasList) ? tugasList : [];

    const tugasPending = tugasArray.filter((t: any) => {
        const deadline = new Date(t.deadline);
        const hasSubmitted = t.submissions?.length > 0;
        return deadline > now && !hasSubmitted;
    }).length;

    const tugasCompleted = tugasArray.filter((t: any) => {
        return t.submissions?.length > 0;
    }).length;

    // Calculate average score from graded submissions
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

    // Get upcoming tasks (pending assignments sorted by deadline)
    const upcomingTasks = tugasArray
        .filter((t: any) => {
            const deadline = new Date(t.deadline);
            const hasSubmitted = t.submissions?.length > 0;
            return deadline > now && !hasSubmitted;
        })
        .sort((a: any, b: any) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 5);

    // Get recent notifications for activity feed
    const notifikasiArray = Array.isArray(notifikasiList) ? notifikasiList : [];
    const recentActivities = notifikasiArray.slice(0, 5).map((n: any) => ({
        id: n.id,
        title: n.judul,
        message: n.pesan,
        time: getTimeAgo(n.createdAt),
        isRead: n.isRead,
        type: n.tipe,
    }));

    const isLoading = tugasLoading || materiLoading || notifikasiLoading;

    return (
        <div className="space-y-6">
            {/* Welcome Card */}
            <Card className="overflow-hidden border-primary/40 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
                <CardHeader className="gap-4 pb-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge tone="success" className="gap-2">
                            <Zap size={14} />
                            Dashboard Siswa
                        </Badge>
                        <Badge tone="info">Semester Genap 2024/2025</Badge>
                    </div>
                    <CardTitle className="text-3xl md:text-4xl">
                        Selamat Datang Kembali! 👋
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground md:max-w-3xl">
                        Lihat progress belajar, tugas yang perlu dikerjakan, dan materi terbaru
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                                <BookOpen className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {isLoading ? "..." : studentStats.materiCount}
                                </p>
                                <p className="text-sm text-muted-foreground">Total Materi</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                                <Clock className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {isLoading ? "..." : studentStats.tugasPending}
                                </p>
                                <p className="text-sm text-muted-foreground">Tugas Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {isLoading ? "..." : studentStats.tugasCompleted}
                                </p>
                                <p className="text-sm text-muted-foreground">Tugas Selesai</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                                <Award className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {isLoading ? "..." : studentStats.avgScore || "-"}
                                </p>
                                <p className="text-sm text-muted-foreground">Rata-rata Nilai</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                {/* Left Column: Tasks & Materi */}
                <div className="space-y-6">
                    {/* Upcoming Tasks */}
                    <Card className="border-border bg-card/70">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Target size={18} />
                                    Tugas yang Akan Datang
                                </CardTitle>
                                <CardDescription>Jangan sampai terlewat deadline!</CardDescription>
                            </div>
                            <Link href="/tugas">
                                <Button size="sm" variant="outline" className="gap-2">
                                    Lihat Semua
                                    <ArrowRight size={14} />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isLoading ? (
                                <div className="text-center py-4 text-muted-foreground">
                                    Memuat data...
                                </div>
                            ) : upcomingTasks.length === 0 ? (
                                <div className="text-center py-8">
                                    <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Tidak ada tugas yang menunggu 🎉
                                    </p>
                                </div>
                            ) : (
                                upcomingTasks.map((task: any) => {
                                    const daysInfo = getDaysRemaining(task.deadline);
                                    return (
                                        <div
                                            key={task.id}
                                            className="flex items-center justify-between rounded-lg border border-white/5 bg-muted/40 p-3"
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold">{task.judul}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {task.mataPelajaran?.nama || "Mata Pelajaran"}
                                                </p>
                                            </div>
                                            <div
                                                className={cn(
                                                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold",
                                                    daysInfo.urgent
                                                        ? "bg-red-500/20 text-red-500"
                                                        : "bg-blue-500/20 text-blue-500"
                                                )}
                                            >
                                                <Clock size={14} />
                                                {daysInfo.text}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Materi */}
                    <Card className="border-border bg-card/70">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen size={18} />
                                Materi Terbaru
                            </CardTitle>
                            <CardDescription>Materi pelajaran terbaru untuk kamu</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isLoading ? (
                                <div className="text-center py-4 text-muted-foreground">
                                    Memuat data...
                                </div>
                            ) : materiList.length === 0 ? (
                                <div className="text-center py-8">
                                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada materi tersedia
                                    </p>
                                </div>
                            ) : (
                                materiList.slice(0, 4).map((item: any) => (
                                    <Link key={item.id} href={`/materi/${item.id}`}>
                                        <div className="rounded-lg border border-white/5 bg-muted/40 p-3 hover:bg-muted/60 transition-colors cursor-pointer">
                                            <p className="text-sm font-semibold line-clamp-1">{item.judul}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.mataPelajaran?.nama || "Mata Pelajaran"}
                                            </p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Announcements & Activity */}
                <div className="space-y-6">
                    <AnnouncementWidget role="SISWA" />

                    {/* Recent Activity */}
                    <Card className="border-border bg-card/70">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell size={18} />
                                Aktivitas Terbaru
                            </CardTitle>
                            <CardDescription>Notifikasi dan update terbaru</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isLoading ? (
                                <div className="text-center py-4 text-muted-foreground">
                                    Memuat data...
                                </div>
                            ) : recentActivities.length === 0 ? (
                                <div className="text-center py-8">
                                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada aktivitas terbaru
                                    </p>
                                </div>
                            ) : (
                                recentActivities.map((activity: any) => (
                                    <div
                                        key={activity.id}
                                        className={cn(
                                            "flex items-start gap-3 rounded-lg border border-white/5 bg-muted/40 p-3",
                                            !activity.isRead && "border-primary/30 bg-primary/5"
                                        )}
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <Bell size={18} className="text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold">{activity.title}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {activity.message}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                        {!activity.isRead && (
                                            <Badge tone="info" className="text-xs">Baru</Badge>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Link href="/materi">
                            <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                                        <BookOpen className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold group-hover:text-primary">Materi Pelajaran</p>
                                        <p className="text-xs text-muted-foreground">Akses materi lengkap</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/tugas">
                            <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                                        <FileText className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold group-hover:text-primary">Tugas & PR</p>
                                        <p className="text-xs text-muted-foreground">Kumpulkan tugas</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/forum">
                            <Card className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                                        <MessageSquare className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold group-hover:text-primary">Forum Diskusi</p>
                                        <p className="text-xs text-muted-foreground">Tanya & diskusi</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
