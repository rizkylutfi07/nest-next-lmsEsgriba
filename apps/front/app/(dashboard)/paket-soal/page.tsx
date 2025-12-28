"use client";
import { API_URL } from "@/lib/api";

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
                `${API_URL}/paket-soal?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
    });

    const { data: mataPelajaranList } = useQuery({
        queryKey: ["mata-pelajaran-list"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/mata-pelajaran?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`${API_URL}/paket-soal/${id}`, {
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
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Kode</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Nama Paket</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Mata Pelajaran</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Kelas</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Jumlah Soal</th>
                                    <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Total Point</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="border-b border-border/50">
                                            <td className="py-4 px-4"><div className="h-5 w-20 animate-pulse rounded bg-muted/50" /></td>
                                            <td className="py-4 px-4"><div className="h-5 w-40 animate-pulse rounded bg-muted/50" /></td>
                                            <td className="py-4 px-4"><div className="h-5 w-24 animate-pulse rounded bg-muted/50" /></td>
                                            <td className="py-4 px-4"><div className="h-5 w-12 mx-auto animate-pulse rounded bg-muted/50" /></td>
                                            <td className="py-4 px-4"><div className="h-5 w-12 mx-auto animate-pulse rounded bg-muted/50" /></td>
                                            <td className="py-4 px-4"><div className="h-5 w-12 mx-auto animate-pulse rounded bg-muted/50" /></td>
                                            <td className="py-4 px-4"><div className="h-5 w-20 ml-auto animate-pulse rounded bg-muted/50" /></td>
                                        </tr>
                                    ))
                                ) : data?.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                            Data tidak ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    data?.data?.map((item: any) => (
                                        <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                            <td className="py-4 px-4">
                                                <Badge className="border border-border bg-transparent text-muted-foreground font-mono">
                                                    {item.kode}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-medium">{item.nama}</p>
                                                    {item.deskripsi && (
                                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                            {item.deskripsi}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                {item.mataPelajaran ? (
                                                    <Badge className="bg-indigo-500/15 text-indigo-600">
                                                        {item.mataPelajaran.nama}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                {item.paketSoalKelas && item.paketSoalKelas.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1 justify-center">
                                                        {item.paketSoalKelas.map((psk: any) => (
                                                            <Badge key={psk.id} className="bg-emerald-500/15 text-emerald-500">
                                                                {psk.kelas?.nama}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="text-sm">
                                                    {item._count?.soalItems || item.totalSoal || 0}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className="text-sm">
                                                    {item.totalPoint || 0}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex justify-end gap-1">
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
                                                        onClick={() => router.push(`/paket-soal/${item.id}/edit`)}
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
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
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
