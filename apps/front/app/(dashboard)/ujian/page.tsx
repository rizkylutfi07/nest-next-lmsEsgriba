"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Trash2, Plus, X, FileCheck, Eye, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../role-context";
import { useRouter } from "next/navigation";

export default function UjianPage() {
    const { token } = useRole();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [deletingItem, setDeletingItem] = useState<any>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["ujian", page, search, filterStatus],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });
            if (search) params.append("search", search);
            if (filterStatus) params.append("status", filterStatus);

            const res = await fetch(
                `http://localhost:3001/ujian?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
    });

    const publishMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`http://localhost:3001/ujian/${id}/publish`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to publish");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ujian"] });
        },
    });

    const assignMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`http://localhost:3001/ujian/${id}/assign`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to assign");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ujian"] });
            alert("Ujian berhasil di-assign ke siswa!");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`http://localhost:3001/ujian/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ujian"] });
            setDeletingItem(null);
        },
    });

    const getStatusBadge = (status: string) => {
        const statusConfig: any = {
            DRAFT: { className: "bg-gray-500/15 text-gray-600", label: "Draft" },
            PUBLISHED: { className: "bg-blue-500/15 text-blue-600", label: "Published" },
            ONGOING: { className: "bg-green-500/15 text-green-600", label: "Ongoing" },
            SELESAI: { className: "bg-purple-500/15 text-purple-600", label: "Selesai" },
            DIBATALKAN: { className: "bg-red-500/15 text-red-600", label: "Dibatalkan" },
        };
        const config = statusConfig[status] || statusConfig.DRAFT;
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="md:flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <FileCheck className="h-8 w-8" />
                                Kelola Ujian
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Buat dan kelola paket ujian
                            </p>
                        </div>

                        <div className="flex gap-2 mt-4 md:mt-0">
                            <Button onClick={() => router.push("/ujian/create")}>
                                <Plus size={16} />
                                Buat Ujian
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Cari ujian..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 px-4 text-sm outline-none transition focus:border-primary/60 focus:bg-white/10"
                        />

                        <select
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none transition focus:border-primary/60 focus:bg-white/10"
                        >
                            <option value="">Semua Status</option>
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                            <option value="ONGOING">Ongoing</option>
                            <option value="SELESAI">Selesai</option>
                        </select>
                    </div>
                </CardHeader>

                <CardContent className="p-2 md:p-4">
                    <div className="space-y-2">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-32 animate-pulse rounded-lg bg-muted/50"
                                />
                            ))
                        ) : data?.data?.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                Data tidak ditemukan
                            </div>
                        ) : (
                            data?.data?.map((item: any) => (
                                <Card key={item.id} className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="outline">{item.kode}</Badge>
                                                {getStatusBadge(item.status)}
                                                {item.mataPelajaran && (
                                                    <Badge className="bg-indigo-500/15 text-indigo-600">
                                                        {item.mataPelajaran.nama}
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-semibold">{item.judul}</h3>
                                            {item.deskripsi && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                    {item.deskripsi}
                                                </p>
                                            )}
                                            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                                <span>📝 {item._count?.ujianSoal || 0} soal</span>
                                                <span>👥 {item._count?.ujianSiswa || 0} siswa</span>
                                                <span>⏱️ {item.durasi} menit</span>
                                                {item.kelas && <span>🏫 {item.kelas.nama}</span>}
                                            </div>
                                            <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                                                <span>
                                                    Mulai: {new Date(item.tanggalMulai).toLocaleString("id-ID")}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    Selesai: {new Date(item.tanggalSelesai).toLocaleString("id-ID")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            {item.status === "DRAFT" && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => publishMutation.mutate(item.id)}
                                                    disabled={publishMutation.isPending}
                                                >
                                                    <Send size={14} />
                                                    Publish
                                                </Button>
                                            )}
                                            {(item.status === "PUBLISHED" || item.status === "ONGOING") && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => assignMutation.mutate(item.id)}
                                                        disabled={assignMutation.isPending}
                                                    >
                                                        <Send size={14} />
                                                        Assign
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.push(`/ujian/monitoring/${item.id}`)}
                                                    >
                                                        <Eye size={14} />
                                                        Monitor
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => router.push(`/ujian/edit/${item.id}`)}
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeletingItem(item)}
                                                className="text-destructive"
                                            >
                                                <Trash2 size={14} />
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>

                    {!isLoading && data?.meta && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                                Halaman {page} dari {data.meta.totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Sebelumnya
                                </Button>
                                <Button
                                    variant="outline"
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

            {deletingItem && (
                <DeleteModal
                    item={deletingItem}
                    onClose={() => setDeletingItem(null)}
                    onConfirm={() => deleteMutation.mutate(deletingItem.id)}
                    isLoading={deleteMutation.isPending}
                />
            )}
        </div>
    );
}

function DeleteModal({ item, onClose, onConfirm, isLoading }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Konfirmasi Hapus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        Apakah Anda yakin ingin menghapus ujian <strong>{item.judul}</strong>?
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Batal
                        </Button>
                        <Button onClick={onConfirm} disabled={isLoading} className="flex-1">
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={16} />
                            ) : (
                                "Hapus"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
