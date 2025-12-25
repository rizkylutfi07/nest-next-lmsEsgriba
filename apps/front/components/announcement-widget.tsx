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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

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
// Detail Modal Component
function AnnouncementDetailModal({
    announcement,
    onClose
}: {
    announcement: Announcement;
    onClose: () => void;
}) {
    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <MessageSquare className="text-primary h-5 w-5" />
                        {announcement.judul}
                    </DialogTitle>
                    <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground pt-1">
                        <Badge tone="info" className="text-xs font-normal bg-muted text-muted-foreground border-border">
                            {announcement.targetRoles?.length > 0
                                ? announcement.targetRoles.join(", ")
                                : "Umum"}
                        </Badge>
                        <span>•</span>
                        <span>{announcement.author?.name || "Admin"}</span>
                        <span>•</span>
                        <span>
                            {format(new Date(announcement.createdAt), "dd MMM yyyy, HH:mm", { locale: idLocale })}
                        </span>
                    </div>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto py-2">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                            {announcement.konten}
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Tutup</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
