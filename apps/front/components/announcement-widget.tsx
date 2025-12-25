"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Eye, X } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import { useRole } from "@/app/(dashboard)/role-context";

interface Announcement {
    id: string;
    judul: string;
    konten: string;
    targetRoles: string[];
    isActive: boolean;
    createdAt: string;
    author?: {
        name?: string;
        email?: string;
    };
}

// Detail Modal Component
function AnnouncementDetailModal({
    announcement,
    onClose
}: {
    announcement: Announcement;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="sticky top-0 bg-card z-10 border-b">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquare size={20} className="text-primary" />
                                <CardTitle className="text-xl">{announcement.judul}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge tone="info" className="text-xs">
                                    {announcement.targetRoles?.length > 0
                                        ? announcement.targetRoles.join(", ")
                                        : "Umum"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    Oleh: {announcement.author?.name || "Admin"}
                                </span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                    {format(new Date(announcement.createdAt), "dd MMMM yyyy, HH:mm", { locale: idLocale })}
                                </span>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={18} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                            {announcement.konten}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function AnnouncementWidget({
    role,
    limit = 3,
    compact = false
}: {
    role?: string | null;
    limit?: number;
    compact?: boolean;
}) {
    const { token } = useRole();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    useEffect(() => {
        if (!token) return;

        async function fetchAnnouncements() {
            try {
                const res = await apiFetch<Announcement[]>("/pengumuman", {}, token);
                setAnnouncements(res);
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAnnouncements();
    }, [token]);

    if (loading) return <div className="text-center text-sm text-muted-foreground p-4">Memuat pengumuman...</div>;

    if (announcements.length === 0) {
        return (
            <Card className="border-border bg-card/70">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare size={18} />
                            Pengumuman Terbaru
                        </CardTitle>
                        <CardDescription>Informasi penting untuk Anda.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg">
                        Tidak ada pengumuman terbaru.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="border-border bg-card/70">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare size={18} />
                            Pengumuman Terbaru
                        </CardTitle>
                        <CardDescription>Informasi penting untuk Anda.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/pengumuman" className="text-xs">Lihat Semua</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {announcements.slice(0, limit).map((item) => (
                            <div key={item.id} className="relative rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
                                <div className="mb-2 flex items-center justify-between">
                                    <Badge tone="info" className="border-border text-muted-foreground text-[10px] font-normal">
                                        {item.targetRoles?.length > 0 ? item.targetRoles.join(", ") : "Umum"}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="font-semibold text-sm mb-1 line-clamp-1">{item.judul}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-3 mb-3">{item.konten}</p>

                                {/* Detail Button */}
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <span className="text-xs text-muted-foreground">
                                        Oleh: {item.author?.name || "Admin"}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedAnnouncement(item)}
                                        className="h-7 gap-2 text-xs"
                                    >
                                        <Eye size={14} />
                                        Lihat Detail
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Detail Modal */}
            {selectedAnnouncement && (
                <AnnouncementDetailModal
                    announcement={selectedAnnouncement}
                    onClose={() => setSelectedAnnouncement(null)}
                />
            )}
        </>
    );
}
