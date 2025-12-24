"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import { useRole } from "@/app/(dashboard)/role-context";

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
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        async function fetchAnnouncements() {
            try {
                const res = await apiFetch<any[]>("/pengumuman", {}, token);
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
                            <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-3">{item.konten}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
