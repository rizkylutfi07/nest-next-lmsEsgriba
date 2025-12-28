"use client";
import { API_URL } from "@/lib/api";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, AlertTriangle, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../../../role-context";
import { useToast } from "@/hooks/use-toast";

export default function MulaiUjianPage() {
    const { token } = useRole();
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const ujianId = params.id as string;
    const [tokenAccess, setTokenAccess] = useState("");

    const { data: ujian, isLoading } = useQuery({
        queryKey: ["ujian-detail", ujianId],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/ujian/${ujianId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const startMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`${API_URL}/ujian-siswa/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ujianId,
                    tokenAccess: tokenAccess || undefined,
                }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to start exam");
            }
            return res.json();
        },
        onSuccess: (data) => {
            router.push(`/ujian-saya/kerjakan/${data.id}`);
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Handle case when ujian data is not available or is an error
    if (!ujian || !ujian.id) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">Ujian tidak ditemukan atau terjadi kesalahan.</p>
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="mt-4"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Kembali
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Konfirmasi Mulai Ujian</h1>
                            <p className="text-sm text-muted-foreground">
                                Pastikan Anda siap sebelum memulai
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Exam Info */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{ujian.kode}</Badge>
                            {ujian.mataPelajaran && (
                                <Badge className="bg-indigo-500/15 text-indigo-600">
                                    {ujian.mataPelajaran.nama}
                                </Badge>
                            )}
                        </div>

                        <h2 className="text-xl font-semibold">{ujian.judul}</h2>

                        {ujian.deskripsi && (
                            <p className="text-sm text-muted-foreground">{ujian.deskripsi}</p>
                        )}

                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Durasi</p>
                                    <p className="font-semibold">{ujian.durasi} menit</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Jumlah Soal</p>
                                    <p className="font-semibold">{ujian._count?.ujianSoal || 0} soal</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Token Access (if required) */}
                    {ujian.tokenAccess && (
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Token Akses *
                            </label>
                            <input
                                type="text"
                                required
                                value={tokenAccess}
                                onChange={(e) => setTokenAccess(e.target.value)}
                                placeholder="Masukkan token akses dari guru"
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Token akses diperlukan untuk memulai ujian ini
                            </p>
                        </div>
                    )}

                    {/* Warning */}
                    <div className="flex gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2 text-sm">
                            <p className="font-semibold text-yellow-600">Perhatian!</p>
                            <ul className="space-y-1 text-muted-foreground">
                                <li>• Ujian akan dimulai segera setelah Anda klik tombol "Mulai"</li>
                                <li>• Waktu akan berjalan otomatis dan tidak dapat dihentikan</li>
                                <li>• Jangan keluar dari halaman atau menutup browser</li>
                                <li>• Jangan beralih ke tab/aplikasi lain (akan terdeteksi)</li>
                                <li>• Pastikan koneksi internet Anda stabil</li>
                                <li>• Sistem anti-cheat aktif dan akan mencatat aktivitas mencurigakan</li>
                            </ul>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={() => startMutation.mutate()}
                            disabled={startMutation.isPending || (ujian.tokenAccess && !tokenAccess)}
                            className="flex-1"
                        >
                            {startMutation.isPending ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={16} />
                                    Memulai...
                                </>
                            ) : (
                                "Mulai Ujian"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
