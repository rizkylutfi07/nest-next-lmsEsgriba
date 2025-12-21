"use client";

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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Student Dashboard Data
const studentStats = {
    materiBookmarked: 5,
    tugasPending: 3,
    tugasCompleted: 12,
    forumPosts: 8,
    avgScore: 87,
};

const upcomingTasks = [
    {
        id: "1",
        judul: "Tugas Algoritma Sorting",
        mataPelajaran: "Struktur Data",
        deadline: "2025-01-25T23:59:00",
        urgent: true,
    },
    {
        id: "2",
        judul: "Essay: Dampak AI",
        mataPelajaran: "Bahasa Indonesia",
        deadline: "2025-01-22T15:00:00",
        urgent: true,
    },
    {
        id: "3",
        judul: "Quiz Database",
        mataPelajaran: "Database",
        deadline: "2025-01-28T18:00:00",
        urgent: false,
    },
];

const recentActivities = [
    {
        type: "grade",
        title: "Nilai tugas Database telah keluar",
        score: 85,
        time: "2 jam yang lalu",
        icon: Award,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    {
        type: "material",
        title: "Materi baru: Tutorial React Hooks",
        subject: "Pemrograman Web",
        time: "5 jam yang lalu",
        icon: BookOpen,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        type: "forum",
        title: "Pak Rizky menjawab pertanyaan Anda",
        thread: "Cara Optimal Belajar Algoritma",
        time: "1 hari yang lalu",
        icon: MessageSquare,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
];

const progressBySubject = [
    { subject: "Pemrograman", progress: 75, color: "bg-blue-500" },
    { subject: "Database", progress: 60, color: "bg-purple-500" },
    { subject: "Matematika", progress: 85, color: "bg-green-500" },
    { subject: "Bahasa Indonesia", progress: 70, color: "bg-amber-500" },
];

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

export default function StudentDashboard() {
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
                                <BookMarked className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{studentStats.materiBookmarked}</p>
                                <p className="text-sm text-muted-foreground">Materi Tersimpan</p>
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
                                <p className="text-2xl font-bold">{studentStats.tugasPending}</p>
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
                                <p className="text-2xl font-bold">{studentStats.tugasCompleted}</p>
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
                                <p className="text-2xl font-bold">{studentStats.avgScore}</p>
                                <p className="text-sm text-muted-foreground">Rata-rata Nilai</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
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
                        {upcomingTasks.map((task) => {
                            const daysInfo = getDaysRemaining(task.deadline);
                            return (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between rounded-lg border border-white/5 bg-muted/40 p-3"
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{task.judul}</p>
                                        <p className="text-xs text-muted-foreground">{task.mataPelajaran}</p>
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
                        })}
                    </CardContent>
                </Card>

                {/* Progress by Subject */}
                <Card className="border-border bg-card/70">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp size={18} />
                            Progress Mata Pelajaran
                        </CardTitle>
                        <CardDescription>Pantau kemajuan belajarmu</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {progressBySubject.map((item) => (
                            <div key={item.subject} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{item.subject}</span>
                                    <span className="text-muted-foreground">{item.progress}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-white/10">
                                    <div
                                        className={cn("h-full rounded-full transition-all", item.color)}
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-border bg-card/70">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap size={18} />
                        Aktivitas Terbaru
                    </CardTitle>
                    <CardDescription>Update terbaru dari kelas Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {recentActivities.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-start gap-3 rounded-lg border border-white/5 bg-muted/40 p-3"
                            >
                                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", activity.bg)}>
                                    <Icon size={18} className={activity.color} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{activity.title}</p>
                                    {activity.type === "grade" && (
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                            Nilai: {activity.score}/100
                                        </p>
                                    )}
                                    {activity.type === "material" && (
                                        <p className="text-xs text-muted-foreground">{activity.subject}</p>
                                    )}
                                    {activity.type === "forum" && (
                                        <p className="text-xs text-muted-foreground">{activity.thread}</p>
                                    )}
                                    <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                            </div>
                        );
                    })}
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
    );
}
