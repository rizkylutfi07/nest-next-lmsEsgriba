"use client";

import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Upload,
    Award,
    TrendingUp,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "../role-context";

const tugasList = [
    {
        id: "1",
        judul: "Tugas Algoritma Sorting",
        deskripsi: "Implementasikan 3 algoritma sorting (Bubble, Quick, Merge) dalam Python",
        mataPelajaran: "Struktur Data",
        deadline: "2025-01-25T23:59:00",
        maxScore: 100,
        status: "BELUM_DIKUMPULKAN",
        isLate: false,
    },
    {
        id: "2",
        judul: "Essay: Dampak AI pada Pendidikan",
        deskripsi: "Tulis essay 1000 kata tentang dampak positif dan negatif AI dalam pendidikan",
        mataPelajaran: "Bahasa Indonesia",
        deadline: "2025-01-22T15:00:00",
        maxScore: 80,
        status: "DIKUMPULKAN",
        submittedAt: "2025-01-20T10:30:00",
        isLate: false,
    },
    {
        id: "3",
        judul: "Quiz Database Normalization",
        deskripsi: "Jawab 20 soal pilihan ganda tentang normalisasi database",
        mataPelajaran: "Database",
        deadline: "2025-01-28T18:00:00",
        maxScore: 100,
        status: "DINILAI",
        submittedAt: "2025-01-27T16:45:00",
        score: 85,
        feedback: "Bagus! Perhatikan kembali konsep 3NF",
        isLate: false,
    },
];

const getStatusBadge = (status: string, isLate: boolean) => {
    if (status === "DINILAI") {
        return <Badge tone="success" className="gap-1"><CheckCircle2 size={12} />Dinilai</Badge>;
    }
    if (status === "DIKUMPULKAN") {
        return <Badge tone="info" className="gap-1"><Upload size={12} />Dikumpulkan</Badge>;
    }
    if (isLate) {
        return <Badge tone="warning" className="gap-1"><AlertCircle size={12} />Terlambat</Badge>;
    }
    return <Badge tone="warning" className="gap-1"><Clock size={12} />Belum Dikumpulkan</Badge>;
};

const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: "Lewat deadline", urgent: true };
    if (days === 0) return { text: "Hari ini!", urgent: true };
    if (days === 1) return { text: "Besok", urgent: true };
    if (days <= 3) return { text: `${days} hari lagi`, urgent: true };
    return { text: `${days} hari lagi`, urgent: false };
};

export default function TugasPage() {
    const { role } = useRole();

    // For GURU and ADMIN, show management interface placeholder
    if (role === "GURU" || role === "ADMIN") {
        return (
            <div className="space-y-6">
                <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
                    <CardHeader>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge tone="info" className="gap-2">
                                <FileText size={14} />
                                Kelola Tugas
                            </Badge>
                        </div>
                        <CardTitle className="text-3xl">Manajemen Tugas & PR</CardTitle>
                        <CardDescription className="text-base">
                            Buat tugas baru, pantau pengumpulan, dan beri nilai
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
                            <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
                            <p className="text-lg font-semibold mb-2">Halaman Manajemen Tugas</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Interface untuk guru mengelola tugas sedang dalam pengembangan.
                                <br />
                                Sementara ini, Anda dapat menggunakan API endpoint untuk mengelola tugas.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <Button>Buat Tugas Baru</Button>
                                <Button variant="outline">Lihat Semua Pengumpulan</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Student view
    const upcoming = tugasList.filter(t => t.status === "BELUM_DIKUMPULKAN");
    const submitted = tugasList.filter(t => t.status === "DIKUMPULKAN");
    const graded = tugasList.filter(t => t.status === "DINILAI");

    const avgScore = graded.length > 0
        ? graded.reduce((sum, t) => sum + (t.score || 0), 0) / graded.length
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
                <CardHeader>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge tone="info" className="gap-2">
                            <FileText size={14} />
                            Tugas & Pengumpulan
                        </Badge>
                        <Badge tone="success">{tugasList.length} tugas</Badge>
                    </div>
                    <CardTitle className="text-3xl">Daftar Tugas</CardTitle>
                    <CardDescription className="text-base">
                        Kelola dan kumpulkan tugas tepat waktu
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-4">
                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                                <Clock className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{upcoming.length}</p>
                                <p className="text-sm text-muted-foreground">Belum Selesai</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                                <Upload className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{submitted.length}</p>
                                <p className="text-sm text-muted-foreground">Dikumpulkan</p>
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
                                <p className="text-2xl font-bold">{graded.length}</p>
                                <p className="text-sm text-muted-foreground">Sudah Dinilai</p>
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
                                <p className="text-2xl font-bold">{avgScore.toFixed(0)}</p>
                                <p className="text-sm text-muted-foreground">Rata-rata Nilai</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tugas Tabs */}
            <Tabs defaultValue="upcoming" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="upcoming" className="gap-2">
                        <Clock size={16} />
                        Belum Selesai ({upcoming.length})
                    </TabsTrigger>
                    <TabsTrigger value="submitted" className="gap-2">
                        <Upload size={16} />
                        Dikumpulkan ({submitted.length})
                    </TabsTrigger>
                    <TabsTrigger value="graded" className="gap-2">
                        <CheckCircle2 size={16} />
                        Sudah Dinilai ({graded.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                    {upcoming.map((tugas) => {
                        const daysInfo = getDaysRemaining(tugas.deadline);
                        return (
                            <Card key={tugas.id} className="group transition-all hover:shadow-lg hover:shadow-primary/10">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <CardTitle className="text-xl">{tugas.judul}</CardTitle>
                                                {getStatusBadge(tugas.status, tugas.isLate)}
                                            </div>
                                            <CardDescription>{tugas.deskripsi}</CardDescription>
                                        </div>
                                        <div className={cn(
                                            "flex flex-col items-end gap-1 rounded-lg border px-3 py-2",
                                            daysInfo.urgent ? "border-red-500/50 bg-red-500/10" : "border-blue-500/50 bg-blue-500/10"
                                        )}>
                                            <p className={cn(
                                                "text-lg font-bold",
                                                daysInfo.urgent ? "text-red-500" : "text-blue-500"
                                            )}>
                                                {daysInfo.text}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(tugas.deadline).toLocaleDateString("id-ID")}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-muted-foreground" />
                                            <span>{tugas.mataPelajaran}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp size={14} className="text-muted-foreground" />
                                            <span>Max: {tugas.maxScore} poin</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-muted-foreground" />
                                            <span>{new Date(tugas.deadline).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button className="gap-2">
                                            <Upload size={16} />
                                            Kumpulkan Tugas
                                        </Button>
                                        <Button variant="outline" className="gap-2">
                                            Lihat Detail
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>

                <TabsContent value="submitted" className="space-y-4">
                    {submitted.map((tugas) => (
                        <Card key={tugas.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-xl">{tugas.judul}</CardTitle>
                                            {getStatusBadge(tugas.status, tugas.isLate)}
                                        </div>
                                        <CardDescription>{tugas.deskripsi}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        ✓ Dikumpulkan pada {new Date(tugas.submittedAt!).toLocaleString("id-ID")}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline">Lihat Pengumpulan</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="graded" className="space-y-4">
                    {graded.map((tugas) => (
                        <Card key={tugas.id} className="border-green-500/30">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-xl">{tugas.judul}</CardTitle>
                                            {getStatusBadge(tugas.status, tugas.isLate)}
                                        </div>
                                        <CardDescription>{tugas.deskripsi}</CardDescription>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-primary bg-primary/10 px-4 py-3">
                                        <Award size={24} className="text-primary" />
                                        <p className="text-3xl font-bold text-primary">{tugas.score}</p>
                                        <p className="text-xs text-muted-foreground">/ {tugas.maxScore}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {tugas.feedback && (
                                    <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Feedback Guru:</p>
                                        <p className="mt-1 text-sm">{tugas.feedback}</p>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span>Dikumpulkan: {new Date(tugas.submittedAt!).toLocaleDateString("id-ID")}</span>
                                    <span>•</span>
                                    <span>{tugas.mataPelajaran}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
