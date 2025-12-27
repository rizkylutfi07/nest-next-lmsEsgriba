"use client";

import { use, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Plus, Trash2, Upload, FileText, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../../role-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

// ... (keep types and normalizePilihanData existing code)

type PilihanJawaban = {
    id: string;
    text: string;
    value: string;
};

/**
 * Parse inline concatenated options like "Word B.Excel C.PowerPoint D.Corel Draw E.Paint"
 */
const parseInlineOptions = (text: string): PilihanJawaban[] => {
    const optionLabels = ['A', 'B', 'C', 'D', 'E'];

    // Check if text contains inline option markers like " B.", " C." etc.
    if (!/ [B-E]\./i.test(text)) {
        return [];
    }

    // Split by space followed by B., C., D., E.
    const splitPattern = /\s+(?=[A-E]\.)/gi;
    const parts = text.split(splitPattern).filter(p => p.trim());

    if (parts.length < 2) {
        return [];
    }

    const options: PilihanJawaban[] = [];

    for (let i = 0; i < parts.length && i < optionLabels.length; i++) {
        let part = parts[i]!.trim();

        // Remove leading label like "A.", "B." etc if present
        part = part.replace(/^[A-E]\.\s*/i, '').trim();

        if (part) {
            options.push({
                id: optionLabels[i]!,
                text: part,
                value: optionLabels[i]!,
            });
        }
    }

    return options.length >= 2 ? options : [];
};

const normalizePilihanData = (source: any): PilihanJawaban[] => {
    if (!source) return [];
    let data = source;
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch {
            // If parsing fails, try inline parsing
            const inlineOptions = parseInlineOptions(data);
            if (inlineOptions.length >= 2) {
                return inlineOptions;
            }
            return [];
        }
    }
    if (Array.isArray(data)) {
        // Check if this looks like properly formatted options
        const firstItem = data[0];

        // Case: Array has valid option objects [{id: "A", text: "..."}, ...]
        if (firstItem && typeof firstItem === 'object' && (firstItem.id || firstItem.text)) {
            return data.map((item: any, idx: number) => {
                const id = item?.id ?? item?.value ?? `${idx}`;
                return {
                    id,
                    text: item?.text ?? item?.label ?? item?.value ?? "",
                    value: id,
                };
            });
        }

        // Case: Array has single string element with concatenated options
        if (data.length === 1 && typeof firstItem === 'string') {
            const inlineOptions = parseInlineOptions(firstItem);
            if (inlineOptions.length >= 2) {
                return inlineOptions;
            }
        }

        // Case: Array of strings - try to parse each as option text
        if (data.every((item: any) => typeof item === 'string')) {
            // Check if first item contains inline options
            if (data.length === 1 && data[0]) {
                const inlineOptions = parseInlineOptions(data[0]);
                if (inlineOptions.length >= 2) {
                    return inlineOptions;
                }
            }

            // Otherwise, treat each string as a separate option
            const optionLabels = ['A', 'B', 'C', 'D', 'E'];
            return data.map((text: string, idx: number) => ({
                id: optionLabels[idx] || `${idx}`,
                text: text.replace(/^[A-E][\.)]\s*/i, '').trim(),
                value: optionLabels[idx] || `${idx}`,
            }));
        }

        // Default array handling
        return data.map((item: any, idx: number) => {
            const id = item?.id ?? item?.value ?? `${idx}`;
            return {
                id,
                text: item?.text ?? item?.label ?? item?.value ?? "",
                value: id,
            };
        });
    }
    if (typeof data === "object") {
        return Object.entries(data).map(([key, value]: [string, any], idx) => {
            if (typeof value === "string") {
                const id = key ?? `${idx}`;
                return { id, text: value, value: id };
            }
            const id = value?.id ?? key ?? `${idx}`;
            return {
                id,
                text: value?.text ?? value?.label ?? value?.value ?? "",
                value: id,
            };
        });
    }
    return [];
};

function ModalPortal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return createPortal(children, document.body);
}



export default function PaketSoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { token } = useRole();
    const { toast } = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showAddModal, setShowAddModal] = useState(false);
    const [addMode, setAddMode] = useState<"bank" | "import" | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [previewAnswers, setPreviewAnswers] = useState<Record<string, string>>({});

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
                        <Badge className="bg-transparent">{paketSoal.kode}</Badge>
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

            <div className="flex justify-end">
                <Button
                    variant="outline"
                    onClick={() => {
                        setPreviewIndex(0);
                        setShowPreview(true);
                    }}
                >
                    <FileText size={16} className="mr-2" />
                    Pratinjau seperti siswa
                </Button>
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
                                                <Badge className="bg-transparent">
                                                    Bobot: {item.bankSoal.bobot}
                                                </Badge>
                                            </div>
                                            {item.bankSoal.pertanyaan.includes('<img') ? (
                                                <div
                                                    className="text-sm whitespace-pre-wrap prose prose-sm max-w-none"
                                                    dangerouslySetInnerHTML={{ __html: item.bankSoal.pertanyaan }}
                                                />
                                            ) : (
                                                <p className="text-sm whitespace-pre-wrap">{item.bankSoal.pertanyaan}</p>
                                            )}
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

            {showPreview && (
                <PreviewModal
                    paketSoal={paketSoal}
                    index={previewIndex}
                    setIndex={setPreviewIndex}
                    answers={previewAnswers}
                    setAnswers={setPreviewAnswers}
                    onClose={() => setShowPreview(false)}
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
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Pilih Soal dari Bank Soal</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto space-y-4 px-1">
                    <input
                        type="text"
                        placeholder="Cari soal..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2 mb-4 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                    />

                    <div className="space-y-2">
                        {bankSoal?.data?.map((soal: any) => (
                            <div
                                key={soal.id}
                                onClick={() => toggleSoal(soal.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition ${selectedSoal.includes(soal.id)
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-white/20"
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
                                        {soal.pertanyaan.includes('<img') ? (
                                            <div
                                                className="text-sm whitespace-pre-wrap prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: soal.pertanyaan }}
                                            />
                                        ) : (
                                            <p className="text-sm whitespace-pre-wrap">{soal.pertanyaan}</p>
                                        )}
                                        <div className="flex gap-2 mt-1">
                                            <Badge className="text-xs">{soal.tipe}</Badge>
                                            <Badge className="bg-transparent text-xs">
                                                Bobot: {soal.bobot}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
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
            </DialogContent>
        </Dialog>
    );
}

function ImportSoalModal({ paketSoalId, token, onClose, onSuccess }: any) {
    const { toast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewing, setPreviewing] = useState(false);
    const [preview, setPreview] = useState<any>(null);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setPreview(null);
            setResult(null);
        }
    };

    const handlePreview = async () => {
        if (!file) return;

        setPreviewing(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`http://localhost:3001/paket-soal/${paketSoalId}/preview`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Preview failed");

            const data = await res.json();
            setPreview(data);
        } catch (error) {
            console.error("Preview error:", error);
            toast({ title: "Error", description: "Gagal memproses file", variant: "destructive" });
        } finally {
            setPreviewing(false);
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
            toast({ title: "Error", description: "Gagal mengupload file", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const resetPreview = () => {
        setPreview(null);
        setFile(null);
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Import Soal ke Paket</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Step 1: File Selection */}
                    {!preview && !result && (
                        <div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Upload file Word (.docx) dengan format yang sama seperti Bank Soal.
                                Soal akan divalidasi terlebih dahulu sebelum diimport.
                            </p>

                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
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
                    )}

                    {/* Step 2: Preview Results */}
                    {preview && !result && (
                        <div className="space-y-4">
                            {/* Summary */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center">
                                    <p className="text-2xl font-bold text-blue-600">{preview.totalSoal}</p>
                                    <p className="text-xs text-muted-foreground">Total Soal</p>
                                </div>
                                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                                    <p className="text-2xl font-bold text-green-600">{preview.validCount}</p>
                                    <p className="text-xs text-muted-foreground">Valid</p>
                                </div>
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                                    <p className="text-2xl font-bold text-red-600">{preview.invalidCount}</p>
                                    <p className="text-xs text-muted-foreground">Bermasalah</p>
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <p className="text-sm font-medium text-purple-600">
                                    Total Bobot: {preview.totalBobot} poin
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    (Hanya dari soal yang valid)
                                </p>
                            </div>

                            {/* Invalid Soal List */}
                            {preview.invalidSoal.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-red-600">
                                        ⚠ Soal Bermasalah (Nomor: {preview.nomorBermasalah.join(", ")}):
                                    </p>
                                    <div className="max-h-48 overflow-y-auto space-y-2">
                                        {preview.invalidSoal.map((soal: any) => (
                                            <div key={soal.nomor} className="p-2 rounded bg-red-500/5 border border-red-500/10 text-sm">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-medium">Nomor {soal.nomor}</span>
                                                    <span className="text-xs text-muted-foreground">{soal.jenisSoal}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                    {soal.pertanyaanPreview}
                                                </p>
                                                <ul className="mt-1 text-xs text-red-500">
                                                    {soal.issues.map((issue: string, i: number) => (
                                                        <li key={i}>• {issue}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Valid Soal List */}
                            {preview.validSoal.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-green-600">
                                        ✓ Soal Valid ({preview.validCount}):
                                    </p>
                                    <div className="max-h-48 overflow-y-auto space-y-2">
                                        {preview.validSoal.map((soal: any) => (
                                            <div key={soal.nomor} className="p-2 rounded bg-green-500/5 border border-green-500/10 text-sm">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-medium">
                                                        Nomor {soal.nomor}
                                                        {soal.hasImage && <span className="ml-1 text-cyan-500">🖼️</span>}
                                                    </span>
                                                    <div className="flex gap-2 text-xs">
                                                        <span className="text-muted-foreground">{soal.jenisSoal}</span>
                                                        <span className="text-purple-500">Bobot: {soal.bobot}</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                    {soal.pertanyaanPreview}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Import Results */}
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

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                        {!preview && !result && (
                            <>
                                <Button variant="outline" onClick={onClose} className="flex-1">
                                    Batal
                                </Button>
                                <Button
                                    onClick={handlePreview}
                                    disabled={!file || previewing}
                                    className="flex-1"
                                >
                                    {previewing ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={16} />
                                            Memvalidasi...
                                        </>
                                    ) : (
                                        "Validasi File"
                                    )}
                                </Button>
                            </>
                        )}

                        {preview && !result && (
                            <>
                                <Button variant="outline" onClick={resetPreview} className="flex-1">
                                    Pilih File Lain
                                </Button>
                                <Button
                                    onClick={handleUpload}
                                    disabled={preview.validCount === 0 || uploading}
                                    className="flex-1"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" size={16} />
                                            Mengimport...
                                        </>
                                    ) : (
                                        `Import ${preview.validCount} Soal`
                                    )}
                                </Button>
                            </>
                        )}

                        {result && (
                            <Button onClick={onClose} className="flex-1">
                                Tutup
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}


function PreviewModal({ paketSoal, index, setIndex, answers, setAnswers, onClose }: any) {
    const soalItems = paketSoal?.soalItems || [];
    const current = soalItems[index] || soalItems[0];
    const soalData = current?.bankSoal ?? current;
    const tipe = soalData?.tipe;
    const pertanyaan = soalData?.pertanyaan ?? "";
    const pilihanJawaban = normalizePilihanData(soalData?.pilihanJawaban);
    const total = soalItems.length;
    const goTo = (i: number) => {
        if (i < 0 || i >= total) return;
        setIndex(i);
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Pratinjau Soal (tampilan siswa)</DialogTitle>
                    <DialogDescription>
                        Urutan mengikuti acak siswa (deterministik) dan opsi sesuai yang akan terlihat oleh siswa.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto space-y-4 px-1">
                    <div className="p-4 rounded-lg border bg-muted/40">
                        <p className="text-sm font-semibold mb-2">Navigasi Soal</p>
                        <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                            {soalItems.map((item: any, idx: number) => {
                                const key = item.bankSoalId ?? item.id;
                                const isActive = idx === index;
                                const answered = Boolean(answers[key]);
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => goTo(idx)}
                                        className={`rounded-md border px-0 py-2 text-xs font-semibold transition ${isActive
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : answered
                                                ? "border-green-500 bg-green-500/10 text-green-700"
                                                : "border-muted bg-muted/40 text-muted-foreground"
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {current ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-transparent">Soal {index + 1}</Badge>
                                {tipe && (
                                    <Badge className="bg-blue-500/15 text-blue-600">
                                        {tipe.replace("_", " ")}
                                    </Badge>
                                )}
                                <Badge className="bg-transparent">Bobot: {current.bankSoal?.bobot ?? 1}</Badge>
                            </div>
                            {pertanyaan.includes('<img') ? (
                                <div
                                    className="text-base whitespace-pre-wrap prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: pertanyaan }}
                                />
                            ) : (
                                <p className="text-base whitespace-pre-wrap">{pertanyaan}</p>
                            )}

                            {tipe === "PILIHAN_GANDA" && pilihanJawaban.length > 0 && (
                                <div className="space-y-2">
                                    {pilihanJawaban.map((pilihan: any, idx: number) => {
                                        const optionKey = `${pilihan.id ?? "opt"}-${idx}`;
                                        const optionValue = pilihan.id ?? pilihan.value ?? `${idx}`;
                                        const optionLabel = pilihan.text || optionValue;
                                        const optionImageUrl = pilihan.imageUrl;
                                        const soalKey = current.bankSoalId ?? current.id;
                                        return (
                                            <label
                                                key={optionKey}
                                                className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/30 transition"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`preview-${soalKey}`}
                                                    value={optionValue}
                                                    checked={answers[soalKey] === optionValue}
                                                    onChange={(e) =>
                                                        setAnswers({ ...answers, [soalKey]: e.target.value })
                                                    }
                                                    className="mt-1"
                                                />
                                                <div className="flex-1">
                                                    {optionLabel.includes('<img') ? (
                                                        <div
                                                            className="prose prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: optionLabel }}
                                                        />
                                                    ) : (
                                                        <span>{optionLabel}</span>
                                                    )}
                                                    {optionImageUrl && (
                                                        <img
                                                            src={optionImageUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || ''}${optionImageUrl}` : optionImageUrl}
                                                            alt={`Option ${optionValue}`}
                                                            className="mt-2 max-w-full max-h-48 object-contain rounded"
                                                        />
                                                    )}
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}

                            {tipe === "BENAR_SALAH" && (
                                <div className="space-y-2">
                                    {["BENAR", "SALAH"].map((opt) => {
                                        const soalKey = current.bankSoalId ?? current.id;
                                        return (
                                            <label
                                                key={opt}
                                                className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/30 transition"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`preview-${soalKey}`}
                                                    value={opt}
                                                    checked={answers[soalKey] === opt}
                                                    onChange={(e) =>
                                                        setAnswers({ ...answers, [soalKey]: e.target.value })
                                                    }
                                                    className="mt-1"
                                                />
                                                <span className="flex-1">{opt === "BENAR" ? "Benar" : "Salah"}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}

                            {(tipe === "ESSAY" || tipe === "ISIAN_SINGKAT") && (
                                <div className="p-3 rounded-lg border bg-muted/30 text-sm text-muted-foreground">
                                    Tampilan jawaban siswa akan berupa area teks di sini.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            Tidak ada soal untuk dipratinjau.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t flex items-center justify-between">
                    <Button
                        variant="outline"
                        disabled={index === 0}
                        onClick={() => goTo(index - 1)}
                    >
                        Soal Sebelumnya
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Soal {index + 1} dari {total}
                    </span>
                    <Button
                        variant="outline"
                        disabled={index >= total - 1}
                        onClick={() => goTo(index + 1)}
                    >
                        Soal Berikutnya
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
