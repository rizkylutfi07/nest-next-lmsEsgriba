"use client";

import { useState, useEffect } from "react";
import { BookOpen, Calendar, CheckCircle2, Clock, Download, FileText, Bookmark, Video, Link2, Image } from "lucide-react";
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
import { useRole } from "../role-context";
import { materiApi } from "@/lib/api";

const tipeIcons = {
    DOKUMEN: FileText,
    VIDEO: Video,
    LINK: Link2,
    GAMBAR: Image,
    TEKS: FileText,
};

const tipeColors = {
    DOKUMEN: "from-blue-500/20 to-cyan-500/10",
    VIDEO: "from-pink-500/20 to-rose-500/10",
    LINK: "from-purple-500/20 to-indigo-500/10",
    GAMBAR: "from-green-500/20 to-emerald-500/10",
    TEKS: "from-amber-500/20 to-yellow-500/10",
};

export default function MateriPage() {
    const { role, ready } = useRole();
    const [materiList, setMateriList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMateri();
    }, []);

    const loadMateri = async () => {
        try {
            setLoading(true);
            // Fetch only published materials
            const response = await materiApi.getAll({ isPublished: true });
            const data = Array.isArray(response) ? response : (response.data || []);
            setMateriList(data);
        } catch (error) {
            console.error("Error loading materi:", error);
        } finally {
            setLoading(false);
        }
    };

    // Wait for auth to be ready
    if (!ready || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    // For GURU and ADMIN, show management interface placeholder
    if (role === "GURU" || role === "ADMIN") {
        return (
            <div className="space-y-6">
                <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
                    <CardHeader>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge tone="info" className="gap-2">
                                <BookOpen size={14} />
                                Kelola Materi
                            </Badge>
                        </div>
                        <CardTitle className="text-3xl">Manajemen Materi Pelajaran</CardTitle>
                        <CardDescription className="text-base">
                            Kelola dan upload materi pembelajaran untuk siswa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
                            <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
                            <p className="text-lg font-semibold mb-2">Halaman Manajemen Materi</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Interface untuk guru mengelola materi sedang dalam pengembangan.
                                <br />
                                Sementara ini, Anda dapat menggunakan API endpoint untuk mengelola materi.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <Button>Upload Materi Baru</Button>
                                <Button variant="outline">Lihat Semua Materi</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Student view
    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
                <CardHeader>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge tone="info" className="gap-2">
                            <BookOpen size={14} />
                            Materi Pelajaran
                        </Badge>
                        <Badge tone="success">{materiList.length} materi tersedia</Badge>
                    </div>
                    <CardTitle className="text-3xl">Bank Materi Pembelajaran</CardTitle>
                    <CardDescription className="text-base">
                        Akses semua materi pembelajaran dari berbagai mata pelajaran
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                                <BookOpen className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{materiList.length}</p>
                                <p className="text-sm text-muted-foreground">Total Materi</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20">
                                <Bookmark className="h-6 w-6 text-pink-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {materiList.filter((m) => m.isBookmarked).length}
                                </p>
                                <p className="text-sm text-muted-foreground">Bookmarked</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                                <CheckCircle2 className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {materiList.reduce((sum, m) => sum + m.viewCount, 0)}
                                </p>
                                <p className="text-sm text-muted-foreground">Total Views</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Materi List */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {materiList.map((materi) => {
                    const TipeIcon = tipeIcons[materi.tipe as keyof typeof tipeIcons];
                    const gradientClass = tipeColors[materi.tipe as keyof typeof tipeColors];

                    return (
                        <Card
                            key={materi.id}
                            className="group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10"
                        >
                            {/* Gradient Background */}
                            <div
                                className={cn(
                                    "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-70",
                                    gradientClass
                                )}
                            />

                            <CardHeader className="relative">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                                            <TipeIcon size={20} className="text-primary" />
                                        </div>
                                        <Badge tone="info" className="text-xs">
                                            {materi.tipe}
                                        </Badge>
                                    </div>
                                    {materi.isBookmarked && (
                                        <Bookmark size={18} className="text-amber-500 fill-amber-500" />
                                    )}
                                </div>
                                <CardTitle className="mt-2 line-clamp-2">{materi.judul}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {materi.deskripsi}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="relative space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <BookOpen size={14} />
                                        <span>{materi.mataPelajaran?.nama || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar size={14} />
                                        <span>{new Date(materi.createdAt).toLocaleDateString("id-ID")}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock size={14} />
                                        <span>{materi.viewCount || 0} views</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        size="sm"
                                        className="flex-1 gap-2"
                                        onClick={() => window.location.href = `/materi/${materi.id}`}
                                    >
                                        <BookOpen size={16} />
                                        Buka Materi
                                    </Button>
                                    {materi.attachments && materi.attachments.length > 0 && (
                                        <Button size="sm" variant="outline" className="gap-2">
                                            <Download size={16} />
                                            Download
                                        </Button>
                                    )}
                                </div>

                                {materi.attachments && materi.attachments.length > 0 && (
                                    <div className="rounded-lg border border-white/10 bg-muted/30 p-2">
                                        <p className="text-xs text-muted-foreground">
                                            📎 {materi.attachments[0].namaFile} (
                                            {(materi.attachments[0].ukuranFile / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
