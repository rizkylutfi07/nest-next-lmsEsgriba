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

const forumCategories = [
    { id: "1", nama: "Pemrograman", warna: "#3b82f6", icon: "💻", threadCount: 24 },
    { id: "2", nama: "Matematika", warna: "#8b5cf6", icon: "📐", threadCount: 18 },
    { id: "3", nama: "Umum", warna: "#10b981", icon: "💬", threadCount: 32 },
];

const forumThreads = [
    {
        id: "1",
        judul: "Cara Optimal Belajar Algoritma?",
        kategori: "Pemrograman",
        author: "Ahmad Rizki",
        authorType: "SISWA",
        replyCount: 15,
        viewCount: 234,
        isPinned: true,
        isLocked: false,
        createdAt: "2025-01-20T10:30:00",
        latestReply: "2025-01-21T15:45:00",
    },
    {
        id: "2",
        judul: "Tips Mengerjakan Soal Limit",
        kategori: "Matematika",
        author: "Bu Siti (Guru)",
        authorType: "GURU",
        replyCount: 8,
        viewCount: 156,
        isPinned: false,
        isLocked: false,
        createdAt: "2025-01-19T14:20:00",
        latestReply: "2025-01-20T09:15:00",
    },
    {
        id: "3",
        judul: "Diskusi Tugas Database Minggu Ini",
        kategori: "Pemrograman",
        author: "Sari Indah",
        authorType: "SISWA",
        replyCount: 23,
        viewCount: 189,
        isPinned: false,
        isLocked: false,
        createdAt: "2025-01-18T16:00:00",
        latestReply: "2025-01-21T11:30:00",
    },
];

export default function ForumPage() {
    const { role } = useRole();

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
                    {forumThreads.map((thread) => (
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
                                                    {thread.kategori}
                                                </Badge>
                                                <span>•</span>
                                                <span>
                                                    oleh <strong>{thread.author}</strong>
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
                                            <span>{thread.replyCount} replies</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Eye size={14} />
                                            <span>{thread.viewCount} views</span>
                                        </div>
                                        <div className="ml-auto text-xs">
                                            Terakhir: {new Date(thread.latestReply).toLocaleDateString("id-ID")}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
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
