"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Plus, Trash2, Upload, FileText, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../../role-context";
import { useRouter } from "next/navigation";

export default function PaketSoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { token } = useRole();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showAddModal, setShowAddModal] = useState(false);
    const [addMode, setAddMode] = useState<"bank" | "import" | null>(null);

    const { data: paketSoal, isLoading } = useQuery({
        queryKey: ["paket-soal", id],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/paket-soal/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        },
    });

    const removeSoalMutation = useMutation({
        mutationFn: async (itemId: string) => {
            const res = await fetch(
                `http://localhost:3001/paket-soal/${id}/soal/${itemId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (!res.ok) throw new Error("Failed to remove");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paket-soal", id] });
        },
    });

    const getTipeBadge = (tipe: string) => {
        const config: any = {
            PILIHAN_GANDA: { className: "bg-blue-500/15 text-blue-600", label: "PG" },
            ESSAY: { className: "bg-green-500/15 text-green-600", label: "Essay" },
            BENAR_SALAH: { className: "bg-yellow-500/15 text-yellow-600", label: "B/S" },
            ISIAN_SINGKAT: { className: "bg-purple-500/15 text-purple-600", label: "Isian" },
        };
        const item = config[tipe] || config.PILIHAN_GANDA;
        return <Badge className={item.className}>{item.label}</Badge>;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft size={20} />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{paketSoal.kode}</Badge>
                        {paketSoal.mataPelajaran && (
                            <Badge className="bg-indigo-500/15 text-indigo-600">
                                {paketSoal.mataPelajaran.nama}
                            </Badge>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold">{paketSoal.nama}</h1>
                    {paketSoal.deskripsi && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {paketSoal.deskripsi}
                        </p>
                    )}
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{paketSoal.totalSoal}</div>
                        <p className="text-sm text-muted-foreground">Total Soal</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                            {paketSoal.soalItems?.filter((item: any) => item.bankSoal.tipe === "PILIHAN_GANDA").length || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">Pilihan Ganda</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                            {paketSoal.soalItems?.filter((item: any) => item.bankSoal.tipe === "ESSAY").length || 0}
                        </div>
                        <p className="text-sm text-muted-foreground">Essay</p>
                    </CardContent>
                </Card>
            </div>

            {/* Soal List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Daftar Soal</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setAddMode("bank");
                                    setShowAddModal(true);
                                }}
                            >
                                <Database size={14} className="mr-2" />
                                Dari Bank Soal
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setAddMode("import");
                                    setShowAddModal(true);
                                }}
                            >
                                <Upload size={14} className="mr-2" />
                                Import
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {paketSoal.soalItems?.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                            Belum ada soal. Tambahkan soal dari bank soal atau import.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {paketSoal.soalItems?.map((item: any, index: number) => (
                                <Card key={item.id} className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getTipeBadge(item.bankSoal.tipe)}
                                                <Badge variant="outline">
                                                    Bobot: {item.bankSoal.bobot}
                                                </Badge>
                                            </div>
                                            <p className="text-sm">{item.bankSoal.pertanyaan}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSoalMutation.mutate(item.id)}
                                            disabled={removeSoalMutation.isPending}
                                            className="text-destructive"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Modal */}
            {showAddModal && addMode === "bank" && (
                <AddFromBankModal
                    paketSoalId={id}
                    token={token}
                    onClose={() => {
                        setShowAddModal(false);
                        setAddMode(null);
                    }}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ["paket-soal", id] });
                        setShowAddModal(false);
                        setAddMode(null);
                    }}
                />
            )}

            {showAddModal && addMode === "import" && (
                <ImportSoalModal
                    paketSoalId={id}
                    token={token}
                    onClose={() => {
                        setShowAddModal(false);
                        setAddMode(null);
                    }}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ["paket-soal", id] });
                        setShowAddModal(false);
                        setAddMode(null);
                    }}
                />
            )}
        </div>
    );
}

function AddFromBankModal({ paketSoalId, token, onClose, onSuccess }: any) {
    const queryClient = useQueryClient();
    const [selectedSoal, setSelectedSoal] = useState<string[]>([]);
    const [search, setSearch] = useState("");

    const { data: bankSoal } = useQuery({
        queryKey: ["bank-soal-list", search],
        queryFn: async () => {
            const params = new URLSearchParams({ limit: "50" });
            if (search) params.append("search", search);

            const res = await fetch(`http://localhost:3001/bank-soal?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const addSoalMutation = useMutation({
        mutationFn: async (bankSoalIds: string[]) => {
            const res = await fetch(`http://localhost:3001/paket-soal/${paketSoalId}/soal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bankSoalIds }),
            });
            if (!res.ok) throw new Error("Failed to add");
            return res.json();
        },
        onSuccess,
    });

    const toggleSoal = (id: string) => {
        setSelectedSoal((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <CardHeader>
                    <CardTitle>Pilih Soal dari Bank Soal</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                    <input
                        type="text"
                        placeholder="Cari soal..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 mb-4 outline-none transition focus:border-primary/60 focus:bg-white/10"
                    />

                    <div className="space-y-2">
                        {bankSoal?.data?.map((soal: any) => (
                            <div
                                key={soal.id}
                                onClick={() => toggleSoal(soal.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition ${selectedSoal.includes(soal.id)
                                    ? "border-primary bg-primary/10"
                                    : "border-white/10 hover:border-white/20"
                                    }`}
                            >
                                <div className="flex items-start gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedSoal.includes(soal.id)}
                                        onChange={() => toggleSoal(soal.id)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm">{soal.pertanyaan}</p>
                                        <div className="flex gap-2 mt-1">
                                            <Badge className="text-xs">{soal.tipe}</Badge>
                                            <Badge variant="outline" className="text-xs">
                                                Bobot: {soal.bobot}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <div className="p-4 border-t flex gap-2">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                    <Button
                        onClick={() => addSoalMutation.mutate(selectedSoal)}
                        disabled={selectedSoal.length === 0 || addSoalMutation.isPending}
                        className="flex-1"
                    >
                        {addSoalMutation.isPending ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={16} />
                                Menambahkan...
                            </>
                        ) : (
                            `Tambahkan ${selectedSoal.length} Soal`
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

function ImportSoalModal({ paketSoalId, token, onClose, onSuccess }: any) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`http://localhost:3001/paket-soal/${paketSoalId}/import`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setResult(data);

            if (data.success?.length > 0) {
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Gagal mengupload file");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Import Soal ke Paket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Upload file Word (.docx) dengan format yang sama seperti Bank Soal.
                            Soal akan otomatis ditambahkan ke Bank Soal dan paket ini.
                        </p>

                        <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center gap-2"
                            >
                                <Upload size={32} className="text-muted-foreground" />
                                <div>
                                    <p className="font-medium">
                                        {file ? file.name : "Pilih file Word"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Format: .doc atau .docx
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {result && (
                        <div className="space-y-2">
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <p className="text-sm font-medium text-green-600">
                                    ✓ {result.success?.length || 0} soal berhasil diimport
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {result.addedToPackage} soal ditambahkan ke paket
                                </p>
                            </div>
                            {result.failed?.length > 0 && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <p className="text-sm font-medium text-red-600">
                                        ✗ {result.failed.length} soal gagal diimport
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-2 pt-4">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            {result ? "Tutup" : "Batal"}
                        </Button>
                        {!result && (
                            <Button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="flex-1"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                        Mengupload...
                                    </>
                                ) : (
                                    "Upload & Import"
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
