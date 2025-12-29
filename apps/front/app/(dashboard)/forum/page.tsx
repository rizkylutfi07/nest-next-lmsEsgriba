"use client";

import {
    MessageSquare,
    ThumbsUp,
    Heart,
    Lightbulb,
    Send,
    Pin,
    Lock,
    Eye,
    MessageCircle,
    Loader2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "../role-context";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/api";

export default function ForumPage() {
    const { role, token } = useRole();

    // Fetch forum threads from API
    const { data: threadsData, isLoading: isLoadingThreads } = useQuery({
        queryKey: ["forum-threads"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/forum/threads`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        enabled: !!token,
    });

    const forumThreads = Array.isArray(threadsData) ? threadsData : [];

    // Count threads by kategori
    const kategoriCounts = forumThreads.reduce((acc: any, thread: any) => {
        const kategoriNama = thread.kategori?.nama || "Umum";
        acc[kategoriNama] = (acc[kategoriNama] || 0) + 1;
        return acc;
    }, {});

    // Create categories from actual thread data
    const forumCategories = [
        { id: "pemrograman", nama: "Pemrograman", warna: "#3b82f6", icon: "💻", threadCount: kategoriCounts["Pemrograman"] || 0 },
        { id: "matematika", nama: "Matematika", warna: "#8b5cf6", icon: "📐", threadCount: kategoriCounts["Matematika"] || 0 },
        { id: "umum", nama: "Umum", warna: "#10b981", icon: "💬", threadCount: kategoriCounts["Umum"] || 0 },
    ];

    const headerSubtitle = role === "GURU"
        ? "Jawab pertanyaan siswa dan moderasi diskusi kelas"
        : role === "ADMIN"
            ? "Monitor dan moderasi diskusi antar siswa dan guru"
            : "Diskusikan materi, tugas, dan berbagi pengetahuan dengan teman sekelas";

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
                <CardHeader>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge tone="info" className="gap-2">
                            <MessageSquare size={14} />
                            Forum Diskusi
                        </Badge>
                        <Badge tone="success">{forumThreads.length} diskusi aktif</Badge>
                    </div>
                    <CardTitle className="text-3xl">Forum Diskusi Kelas</CardTitle>
                    <CardDescription className="text-base">
                        {headerSubtitle}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="gap-2">
                        <Send size={16} />
                        Buat Diskusi Baru
                    </Button>
                </CardContent>
            </Card>

            {/* Categories */}
            <div className="grid gap-4 sm:grid-cols-3">
                {forumCategories.map((cat) => (
                    <Card
                        key={cat.id}
                        className="cursor-pointer transition-all hover:shadow-lg hover:shadow-primary/10"
                        style={{ borderColor: `${cat.warna}40` }}
                    >
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
                                    style={{ backgroundColor: `${cat.warna}20` }}
                                >
                                    {cat.icon}
                                </div>
                                <div>
                                    <p className="font-semibold" style={{ color: cat.warna }}>
                                        {cat.nama}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {cat.threadCount} diskusi
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Threads List */}
            <Card>
                <CardHeader>
                    <CardTitle>Diskusi Terbaru</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {isLoadingThreads ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    ) : forumThreads.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p>Belum ada diskusi. Mulai diskusi pertama!</p>
                        </div>
                    ) : (
                        forumThreads.map((thread: any) => (
                            <Card key={thread.id} className="group transition-all hover:border-primary/50 hover:bg-muted/30">
                                <CardContent className="pt-6">
                                    <div className="space-y-3">
                                        {/* Title & Badges */}
                                        <div className="flex items-start gap-3">
                                            <MessageCircle size={20} className="mt-1 text-primary" />
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {thread.isPinned && <Pin size={14} className="text-amber-500" />}
                                                    {thread.isLocked && <Lock size={14} className="text-muted-foreground" />}
                                                    <h3 className="font-semibold group-hover:text-primary">
                                                        {thread.judul}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                                    <Badge tone="info" className="text-xs">
                                                        {thread.kategori?.nama || "Umum"}
                                                    </Badge>
                                                    <span>•</span>
                                                    <span>
                                                        oleh <strong>{thread.author?.nama || thread.user?.nama || "Unknown"}</strong>
                                                        {thread.authorType === "GURU" && " 👨‍🏫"}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{new Date(thread.createdAt).toLocaleDateString("id-ID")}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-6 text-sm text-muted-foreground pl-9">
                                            <div className="flex items-center gap-2">
                                                <MessageSquare size={14} />
                                                <span>{thread._count?.posts || thread.replyCount || 0} replies</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Eye size={14} />
                                                <span>{thread.viewCount || 0} views</span>
                                            </div>
                                            {thread.updatedAt && (
                                                <div className="ml-auto text-xs">
                                                    Terakhir: {new Date(thread.updatedAt).toLocaleDateString("id-ID")}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Example Thread Detail (for reference) */}
            <Card className="border-primary/50">
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <CardTitle className="text-2xl">
                                <Pin size={18} className="inline text-amber-500 mr-2" />
                                Cara Optimal Belajar Algoritma?
                            </CardTitle>
                            <CardDescription>
                                Posted by <strong>Ahmad Rizki</strong> • 20 Jan 2025
                            </CardDescription>
                        </div>
                        <Badge tone="info">Pemrograman</Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Original Post */}
                    <div className="rounded-lg border border-muted bg-muted/30 p-4">
                        <p className="text-sm">
                            Halo teman-teman! Saya sedang belajar algoritma sorting dan masih bingung dengan konsep
                            time complexity. Ada yang punya tips atau resources yang bagus untuk belajar? 🙏
                        </p>
                    </div>

                    {/* Reactions */}
                    <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                            <ThumbsUp size={14} />
                            Suka (12)
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                            <Heart size={14} />
                            Berguna (8)
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2">
                            <Lightbulb size={14} />
                            Solusi (3)
                        </Button>
                    </div>

                    {/* Sample Reply */}
                    <div className="space-y-4 border-l-2 border-primary/30 pl-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold">Pak Rizky (Guru) 👨‍🏫</p>
                                <span className="text-xs text-muted-foreground">• 21 Jan, 10:30</span>
                            </div>
                            <p className="text-sm">
                                Coba pahami dulu konsep Big O Notation. Saya recommend channel YouTube "Abdul Bari"
                                untuk penjelasan yang jelas tentang algoritma. Jangan lupa praktik dengan coding!
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs">
                                    <ThumbsUp size={12} />
                                    15
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 text-xs">
                                    Balas
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
