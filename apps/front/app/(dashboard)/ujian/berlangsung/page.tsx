"use client";
import { API_URL } from "@/lib/api";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Eye, FileCheck, Activity, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../../role-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function UjianBerlangsungPage() {
    const { token } = useRole();
    const { toast } = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["ujian", "list", "berlangsung", page, search],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                status: "ONGOING",
            });
            if (search) params.append("search", search);

            const res = await fetch(
                `${API_URL}/ujian?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await fetch(`${API_URL}/ujian/${id}/status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to update status");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ujian"] });
            toast({ title: "Berhasil!", description: "Status ujian berhasil diupdate" });
        },
        onError: (err) => {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        }
    });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="md:flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <Activity className="h-8 w-8" />
                                Pelaksanaan Ujian
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Monitor ujian yang sedang berlangsung
                            </p>
                        </div>
                    </div>

                    <input
                        type="text"
                        placeholder="Cari ujian..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full rounded-lg border border-border bg-background py-2 px-4 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                    />
                </CardHeader>

                <CardContent className="p-2 md:p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Kode</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Judul</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Mata Pelajaran</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Kelas</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Durasi</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Peserta</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Jadwal</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <tr key={i}>
                                            <td colSpan={8} className="py-4">
                                                <div className="h-12 animate-pulse rounded bg-muted/50" />
                                            </td>
                                        </tr>
                                    ))
                                ) : data?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-16 text-center">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <Activity size={48} className="opacity-30" />
                                                <p className="font-medium">Tidak ada ujian yang sedang berlangsung</p>
                                                <p className="text-sm">Ujian yang sedang berjalan akan muncul di sini</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data?.data?.map((item: any) => (
                                        <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition">
                                            <td className="py-4 px-4">
                                                <Badge className="border border-border bg-transparent text-muted-foreground font-mono">
                                                    {item.kode}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <p className="font-medium">{item.judul}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                {item.mataPelajaran ? (
                                                    <Badge className="bg-indigo-500/15 text-indigo-500">
                                                        {item.mataPelajaran.nama}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {item.ujianKelas?.length > 0 ? (
                                                        item.ujianKelas.map((uk: any) => (
                                                            <Badge key={uk.id} className="bg-emerald-500/15 text-emerald-500">
                                                                {uk.kelas?.nama}
                                                            </Badge>
                                                        ))
                                                    ) : item.kelas ? (
                                                        <Badge className="bg-emerald-500/15 text-emerald-500">
                                                            {item.kelas.nama}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="text-sm">{item.durasi} menit</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span className="text-sm font-medium">{item._count?.ujianSiswa || 0}</span>
                                                    <span className="text-xs text-muted-foreground">siswa</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-xs space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-muted-foreground">Selesai:</span>
                                                        <span>{new Date(item.tanggalSelesai).toLocaleString("id-ID", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.push(`/ujian/monitoring/${item.id}`)}
                                                    >
                                                        <Eye size={14} />
                                                        Monitor
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => updateStatusMutation.mutate({ id: item.id, status: "SELESAI" })}
                                                        disabled={updateStatusMutation.isPending}
                                                        className="text-purple-500 hover:text-purple-600"
                                                    >
                                                        <FileCheck size={14} />
                                                        Selesaikan
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {!isLoading && data?.meta && data.meta.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                                Halaman {page} dari {data.meta.totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    className="border border-border bg-transparent text-muted-foreground"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    className="border border-border bg-transparent text-muted-foreground"
                                    size="sm"
                                    onClick={() =>
                                        setPage((p) => Math.min(data.meta.totalPages, p + 1))
                                    }
                                    disabled={page === data.meta.totalPages}
                                >
                                    Selanjutnya
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
