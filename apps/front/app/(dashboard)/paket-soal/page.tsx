"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Trash2, Plus, X, Package, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../role-context";
import { useRouter } from "next/navigation";

export default function PaketSoalPage() {
    const { token } = useRole();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filterMataPelajaran, setFilterMataPelajaran] = useState("");
    const [deletingItem, setDeletingItem] = useState<any>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["paket-soal", page, search, filterMataPelajaran],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });
            if (search) params.append("search", search);
            if (filterMataPelajaran) params.append("mataPelajaranId", filterMataPelajaran);

            const res = await fetch(
                `http://localhost:3001/paket-soal?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
    });

    const { data: mataPelajaranList } = useQuery({
        queryKey: ["mata-pelajaran-list"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/mata-pelajaran?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`http://localhost:3001/paket-soal/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paket-soal"] });
            setDeletingItem(null);
        },
    });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="md:flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <Package className="h-8 w-8" />
                                Paket Soal
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola paket soal untuk ujian
                            </p>
                        </div>

                        <div className="flex gap-2 mt-4 md:mt-0">
                            <Button onClick={() => router.push("/paket-soal/create")}>
                                <Plus size={16} />
                                Buat Paket Soal
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Cari paket soal..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full rounded-lg border border-border bg-background py-2 px-4 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                        />

                        <select
                            value={filterMataPelajaran}
                            onChange={(e) => {
                                setFilterMataPelajaran(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="">Semua Mata Pelajaran</option>
                            {mataPelajaranList?.data?.map((mp: any) => (
                                <option key={mp.id} value={mp.id}>
                                    {mp.nama}
                                </option>
                            ))}
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
                                                <Badge className="border border-border bg-transparent text-muted-foreground">{item.kode}</Badge>
                                                {item.mataPelajaran && (
                                                    <Badge className="bg-indigo-500/15 text-indigo-600">
                                                        {item.mataPelajaran.nama}
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-semibold">{item.nama}</h3>
                                            {item.deskripsi && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                    {item.deskripsi}
                                                </p>
                                            )}
                                            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                                <span>📝 {item._count?.soalItems || item.totalSoal || 0} soal</span>
                                                <span>⭐ {item.totalPoint || 0} point</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => router.push(`/paket-soal/${item.id}`)}
                                            >
                                                <Eye size={14} />
                                                Detail
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
        <AlertDialog open={true} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus paket soal <strong>{item.nama}</strong>?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Batal</AlertDialogCancel>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Hapus"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
