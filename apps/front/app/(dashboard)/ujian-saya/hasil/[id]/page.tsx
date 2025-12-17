"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle, XCircle, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../../../role-context";

export default function HasilUjianPage() {
    const { token } = useRole();
    const router = useRouter();
    const params = useParams();
    const ujianSiswaId = params.id as string;

    const { data: result, isLoading } = useQuery({
        queryKey: ["ujian-result", ujianSiswaId],
        queryFn: async () => {
            const res = await fetch(
                `http://localhost:3001/ujian-siswa/result/${ujianSiswaId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) throw new Error("Failed to load result");
            return res.json();
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const isPassed = result.nilai >= result.ujian.nilaiMinimal;
    const duration = result.durasiPengerjaan
        ? `${Math.floor(result.durasiPengerjaan / 60)} menit ${result.durasiPengerjaan % 60} detik`
        : "-";

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push("/ujian-saya")}>
                            <ArrowLeft size={20} />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">Hasil Ujian</h1>
                            <p className="text-sm text-muted-foreground">{result.ujian.judul}</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Score Card */}
            <Card>
                <CardContent className="p-8">
                    <div className="text-center space-y-6">
                        {isPassed ? (
                            <div className="flex justify-center">
                                <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle className="h-12 w-12 text-green-600" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <XCircle className="h-12 w-12 text-red-600" />
                                </div>
                            </div>
                        )}

                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Nilai Anda</p>
                            <p className="text-6xl font-bold">{result.nilai}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Passing Grade: {result.ujian.nilaiMinimal}
                            </p>
                        </div>

                        <Badge
                            className={`text-lg px-6 py-2 ${isPassed
                                    ? "bg-green-500/15 text-green-600"
                                    : "bg-red-500/15 text-red-600"
                                }`}
                        >
                            {isPassed ? "LULUS" : "TIDAK LULUS"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Award className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Skor</p>
                                <p className="text-2xl font-bold">{result.nilai}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Durasi</p>
                                <p className="text-lg font-bold">{duration}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="text-lg font-bold">{result.status}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Detail Ujian</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Mata Pelajaran</span>
                        <span className="font-medium">{result.ujian.mataPelajaran?.nama || "-"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Kelas</span>
                        <span className="font-medium">{result.ujian.kelas?.nama || "-"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Waktu Mulai</span>
                        <span className="font-medium">
                            {new Date(result.waktuMulai).toLocaleString("id-ID")}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Waktu Selesai</span>
                        <span className="font-medium">
                            {result.waktuSelesai
                                ? new Date(result.waktuSelesai).toLocaleString("id-ID")
                                : "-"}
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Jumlah Soal</span>
                        <span className="font-medium">{result.ujian._count?.ujianSoal || 0}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Feedback */}
            {result.ujian.tampilkanNilai && (
                <Card>
                    <CardHeader>
                        <CardTitle>Catatan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isPassed ? (
                            <p className="text-green-600">
                                Selamat! Anda telah lulus ujian ini dengan nilai {result.nilai}. Pertahankan
                                prestasi Anda!
                            </p>
                        ) : (
                            <p className="text-red-600">
                                Nilai Anda belum mencapai passing grade. Tetap semangat dan terus belajar!
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Actions */}
            <div className="flex justify-center">
                <Button onClick={() => router.push("/ujian-saya")} size="lg">
                    Kembali ke Daftar Ujian
                </Button>
            </div>
        </div>
    );
}
