"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Trash2, Plus, X, BookOpen, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../role-context";
import { useToast } from "@/hooks/use-toast";

export default function BankSoalPage() {
    const { token } = useRole();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filterTipe, setFilterTipe] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [deletingItem, setDeletingItem] = useState<any>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["bank-soal", page, search, filterTipe],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });
            if (search) params.append("search", search);
            if (filterTipe) params.append("tipe", filterTipe);

            const res = await fetch(
                `http://localhost:3001/bank-soal?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("http://localhost:3001/bank-soal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bank-soal"] });
            setIsCreateModalOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: any) => {
            const res = await fetch(`http://localhost:3001/bank-soal/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bank-soal"] });
            setEditingItem(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`http://localhost:3001/bank-soal/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bank-soal"] });
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
                                <BookOpen className="h-8 w-8" />
                                Bank Soal
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Kelola bank soal untuk ujian
                            </p>
                        </div>

                        <div className="flex gap-2 mt-4 md:mt-0">
                            <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
                                <Upload size={16} />
                                Import
                            </Button>
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <Plus size={16} />
                                Tambah Soal
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Cari soal..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full rounded-lg border border-border bg-background py-2 px-4 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                        />

                        <select
                            value={filterTipe}
                            onChange={(e) => {
                                setFilterTipe(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                        >
                            <option value="">Semua Tipe</option>
                            <option value="PILIHAN_GANDA">Pilihan Ganda</option>
                            <option value="ESSAY">Essay</option>
                            <option value="BENAR_SALAH">Benar/Salah</option>
                            <option value="ISIAN_SINGKAT">Isian Singkat</option>
                        </select>
                    </div>
                </CardHeader>

                <CardContent className="p-2 md:p-4">
                    <div className="space-y-2">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-24 animate-pulse rounded-lg bg-muted/50"
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
                                                <Badge
                                                    className={
                                                        item.tipe === "PILIHAN_GANDA"
                                                            ? "bg-blue-500/15 text-blue-600"
                                                            : item.tipe === "ESSAY"
                                                                ? "bg-purple-500/15 text-purple-600"
                                                                : "bg-green-500/15 text-green-600"
                                                    }
                                                >
                                                    {item.tipe.replace("_", " ")}
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium line-clamp-2">
                                                {item.pertanyaan}
                                            </p>
                                            {item.mataPelajaran && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {item.mataPelajaran.nama}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setEditingItem(item)}
                                                className="h-8 w-8"
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeletingItem(item)}
                                                className="h-8 w-8 text-destructive"
                                            >
                                                <Trash2 size={16} />
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

            {isCreateModalOpen && (
                <FormModal
                    title="Tambah Soal"
                    item={null}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={(data) => createMutation.mutate(data)}
                    isLoading={createMutation.isPending}
                />
            )}

            {editingItem && (
                <FormModal
                    title="Edit Soal"
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSubmit={(data) =>
                        updateMutation.mutate({ id: editingItem.id, data })
                    }
                    isLoading={updateMutation.isPending}
                />
            )}

            {deletingItem && (
                <DeleteModal
                    item={deletingItem}
                    onClose={() => setDeletingItem(null)}
                    onConfirm={() => deleteMutation.mutate(deletingItem.id)}
                    isLoading={deleteMutation.isPending}
                />
            )}

            {isImportModalOpen && (
                <ImportModal
                    onClose={() => setIsImportModalOpen(false)}
                    token={token}
                    queryClient={queryClient}
                />
            )}
        </div>
    );
}

function FormModal({ title, item, onClose, onSubmit, isLoading }: any) {
    const { token } = useRole();
    const { toast } = useToast();
    const [formData, setFormData] = useState(
        item || {
            tipe: "PILIHAN_GANDA",
            bobot: 1,
            pilihanJawaban: [
                { id: "A", text: "", isCorrect: false },
                { id: "B", text: "", isCorrect: false },
                { id: "C", text: "", isCorrect: false },
                { id: "D", text: "", isCorrect: false },
            ],
        }
    );

    const { data: mataPelajaranList } = useQuery({
        queryKey: ["mata-pelajaran-list"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/mata-pelajaran?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    // Generate kode if creating new
    const { data: generatedKode } = useQuery({
        queryKey: ["generate-kode-soal"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/bank-soal/generate-kode`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.text();
        },
        enabled: !item,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData: any = { ...formData };

        // Add generated kode for new items
        if (!item && generatedKode) {
            submitData.kode = generatedKode;
        }

        // Ensure pertanyaan is present
        if (!submitData.pertanyaan) {
            toast({ title: "Perhatian", description: "Pertanyaan harus diisi!", variant: "destructive" });
            return;
        }

        // Clean up based on type
        if (submitData.tipe !== "PILIHAN_GANDA" && submitData.tipe !== "BENAR_SALAH") {
            delete submitData.pilihanJawaban;
        } else {
            // Ensure at least one answer is marked as correct for multiple choice
            const hasCorrect = submitData.pilihanJawaban?.some((p: any) => p.isCorrect);
            if (!hasCorrect) {
                toast({ title: "Perhatian", description: "Pilih minimal satu jawaban yang benar!", variant: "destructive" });
                return;
            }
        }

        onSubmit(submitData);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{title}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={18} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!item && generatedKode && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Kode Soal
                                </label>
                                <input
                                    type="text"
                                    value={generatedKode}
                                    disabled
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none opacity-60"
                                />
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Pertanyaan *
                            </label>
                            <textarea
                                required
                                value={formData.pertanyaan || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, pertanyaan: e.target.value })
                                }
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                rows={4}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Tipe Soal *
                            </label>
                            <select
                                required
                                value={formData.tipe || "PILIHAN_GANDA"}
                                onChange={(e) =>
                                    setFormData({ ...formData, tipe: e.target.value })
                                }
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="PILIHAN_GANDA">Pilihan Ganda</option>
                                <option value="ESSAY">Essay</option>
                                <option value="BENAR_SALAH">Benar/Salah</option>
                                <option value="ISIAN_SINGKAT">Isian Singkat</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Mata Pelajaran
                                </label>
                                <select
                                    value={formData.mataPelajaranId || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            mataPelajaranId: e.target.value || undefined,
                                        })
                                    }
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Pilih Mata Pelajaran</option>
                                    {mataPelajaranList?.data?.map((mp: any) => (
                                        <option key={mp.id} value={mp.id}>
                                            {mp.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Bobot</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.bobot || 1}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bobot: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        {(formData.tipe === "PILIHAN_GANDA" ||
                            formData.tipe === "BENAR_SALAH") && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Pilihan Jawaban *
                                    </label>
                                    <div className="space-y-2">
                                        {formData.pilihanJawaban?.map((pilihan: any, idx: number) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    type="radio"
                                                    name="correct"
                                                    checked={pilihan.isCorrect}
                                                    onChange={() => {
                                                        const updated = formData.pilihanJawaban.map(
                                                            (p: any, i: number) => ({
                                                                ...p,
                                                                isCorrect: i === idx,
                                                            })
                                                        );
                                                        setFormData({
                                                            ...formData,
                                                            pilihanJawaban: updated,
                                                        });
                                                    }}
                                                    className="mt-3"
                                                />
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder={`Pilihan ${pilihan.id}`}
                                                        value={pilihan.text}
                                                        onChange={(e) => {
                                                            const updated = [...formData.pilihanJawaban];
                                                            updated[idx].text = e.target.value;
                                                            setFormData({
                                                                ...formData,
                                                                pilihanJawaban: updated,
                                                            });
                                                        }}
                                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Pilih jawaban yang benar dengan radio button
                                    </p>
                                </div>
                            )}

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Penjelasan
                            </label>
                            <textarea
                                value={formData.penjelasan || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, penjelasan: e.target.value })
                                }
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : (
                                    "Simpan"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function DeleteModal({ item, onClose, onConfirm, isLoading }: any) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Konfirmasi Hapus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        Apakah Anda yakin ingin menghapus soal <strong>{item.kode}</strong>?
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

function ImportModal({ onClose, token, queryClient }: any) {
    const [file, setFile] = useState<File | null>(null);
    const [mataPelajaranId, setMataPelajaranId] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const { toast } = useToast();

    const { data: mataPelajaranList } = useQuery({
        queryKey: ["mata-pelajaran-list"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/mata-pelajaran?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const handleDownloadTemplate = async () => {
        try {
            const res = await fetch(`http://localhost:3001/bank-soal/template/word`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            // Convert base64 to blob
            const byteCharacters = atob(data.buffer);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: data.contentType || 'text/plain' });

            // Download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = data.filename;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast({ title: "Error", description: "Gagal download template", variant: "destructive" });
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast({ title: "Perhatian", description: "Pilih file terlebih dahulu!", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            if (mataPelajaranId) {
                formData.append("mataPelajaranId", mataPelajaranId);
            }

            const res = await fetch(`http://localhost:3001/bank-soal/import/file`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setResult(data);
            queryClient.invalidateQueries({ queryKey: ["bank-soal"] });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Import Soal</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={18} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!result ? (
                        <>
                            {/* Template Download */}
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Download size={16} />
                                    Download Template
                                </h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Download template teks untuk mempermudah import soal
                                </p>
                                <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                                    <Download size={14} className="mr-2" />
                                    Download Template
                                </Button>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Upload File *
                                </label>
                                <input
                                    type="file"
                                    accept=".docx,.doc,.txt,.json"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Format yang didukung: Word (.docx, .doc), Text (.txt) atau JSON (.json)
                                </p>
                            </div>

                            {/* Mata Pelajaran */}
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Mata Pelajaran (Opsional)
                                </label>
                                <select
                                    value={mataPelajaranId}
                                    onChange={(e) => setMataPelajaranId(e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Pilih Mata Pelajaran</option>
                                    {mataPelajaranList?.data?.map((mp: any) => (
                                        <option key={mp.id} value={mp.id}>
                                            {mp.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Instructions */}
                            <div className="p-4 bg-muted/30 rounded-lg text-sm">
                                <h4 className="font-semibold mb-2">Format Word/Text:</h4>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• Setiap soal dimulai dengan <strong>[NOMOR X]</strong></li>
                                    <li>• <strong>JENIS SOAL:</strong> PG atau ESSAY</li>
                                    <li>• <strong>NILAI:</strong> Bobot soal (angka)</li>
                                    <li>• <strong>SOAL:</strong> Pertanyaan soal</li>
                                    <li>• <strong>JAWABAN:</strong> Untuk PG, tulis 5 pilihan (setiap pilihan di baris baru)</li>
                                    <li>• <strong>KUNCI JAWABAN:</strong> A/B/C/D/E untuk PG, penjelasan untuk ESSAY</li>
                                </ul>
                                <p className="mt-2 text-xs">
                                    Contoh: Download template untuk melihat format lengkap
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={onClose} className="flex-1">
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleUpload}
                                    disabled={!file || isUploading}
                                    className="flex-1"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={16} />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} className="mr-2" />
                                            Upload & Import
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Result */}
                            <div className="space-y-4">
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <h4 className="font-semibold text-green-600 mb-2">
                                        ✓ Import Berhasil
                                    </h4>
                                    <p className="text-sm">
                                        {result.success.length} soal berhasil diimport
                                    </p>
                                </div>

                                {result.failed.length > 0 && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <h4 className="font-semibold text-red-600 mb-2">
                                            ⚠ {result.failed.length} soal gagal diimport
                                        </h4>
                                        <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
                                            {result.failed.map((item: any, idx: number) => (
                                                <p key={idx} className="text-muted-foreground">
                                                    • {item.error}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button onClick={onClose} className="w-full">
                                Tutup
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
