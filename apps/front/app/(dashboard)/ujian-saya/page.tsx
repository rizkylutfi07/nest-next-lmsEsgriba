"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Clock, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../role-context";

export default function UjianSayaPage() {
    const { token } = useRole();
    const router = useRouter();

    const { data, isLoading } = useQuery({
        queryKey: ["ujian-siswa-available"],
        queryFn: async () => {
            const res = await fetch(
                `http://localhost:3001/ujian-siswa/available`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
    });

    const exams = Array.isArray(data) ? data : [];

    const getStatusInfo = (ujianSiswa: any) => {
        if (!ujianSiswa) {
            return { icon: FileText, color: "text-blue-500", label: "Belum Dikerjakan" };
        }
        if (ujianSiswa.status === "SELESAI") {
            return { icon: CheckCircle, color: "text-green-500", label: "Selesai" };
        }
        if (ujianSiswa.status === "SEDANG_MENGERJAKAN") {
            return { icon: Clock, color: "text-yellow-500", label: "Sedang Dikerjakan" };
        }
        return { icon: AlertCircle, color: "text-gray-500", label: "Belum Mulai" };
    };

    const isAvailable = (ujian: any) => {
        const now = new Date();
        const start = ujian ? new Date(ujian.tanggalMulai) : null;
        const end = ujian ? new Date(ujian.tanggalSelesai) : null;
        if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return false;
        }
        return now >= start && now <= end;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div>
                        <h1 className="text-3xl font-bold">Ujian Saya</h1>
                        <p className="text-sm text-muted-foreground">
                            Daftar ujian yang tersedia untuk Anda
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="p-2 md:p-4">
                    <div className="space-y-3">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-40 animate-pulse rounded-lg bg-muted/50"
                                />
                            ))
                        ) : exams.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                <p>Tidak ada ujian tersedia saat ini</p>
                            </div>
                        ) : (
                            exams.map((item: any) => {
                                const ujian = item.ujian;
                                const statusInfo = getStatusInfo(item);
                                const StatusIcon = statusInfo.icon;
                                const available = ujian ? isAvailable(ujian) : false;

                                return (
                                    <Card key={item.id} className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline">{ujian?.kode || "-"}</Badge>
                                                    {ujian?.mataPelajaran && (
                                                        <Badge className="bg-indigo-500/15 text-indigo-600">
                                                            {ujian.mataPelajaran.nama}
                                                        </Badge>
                                                    )}
                                                    {!available && (
                                                        <Badge className="bg-red-500/15 text-red-600">
                                                            Tidak Tersedia
                                                        </Badge>
                                                    )}
                                                </div>

                                                <h3 className="text-lg font-semibold mb-1">
                                                    {ujian?.judul || "Ujian Tanpa Judul"}
                                                </h3>

                                                {ujian?.deskripsi && (
                                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                        {ujian.deskripsi}
                                                    </p>
                                                )}

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span>{ujian?.durasi ?? 0} menit</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <span>{ujian?._count?.ujianSoal || 0} soal</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                                                        <span>{statusInfo.label}</span>
                                                    </div>
                                                    {item.nilaiTotal !== null && item.nilaiTotal !== undefined && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold">
                                                                Nilai: {item.nilaiTotal}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-3 text-xs text-muted-foreground">
                                                    <p>
                                                        Mulai: {ujian ? new Date(ujian.tanggalMulai).toLocaleString("id-ID") : "-"}
                                                    </p>
                                                    <p>
                                                        Selesai: {ujian ? new Date(ujian.tanggalSelesai).toLocaleString("id-ID") : "-"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {item.status === "SELESAI" ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.push(`/ujian-saya/hasil/${item.id}`)
                                                        }
                                                    >
                                                        Lihat Hasil
                                                    </Button>
                                                ) : item.status === "SEDANG_MENGERJAKAN" ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            router.push(`/ujian-saya/kerjakan/${item.id}`)
                                                        }
                                                    >
                                                        Lanjutkan
                                                    </Button>
                                                ) : available && ujian ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            router.push(`/ujian-saya/mulai/${ujian.id}`)
                                                        }
                                                    >
                                                        Mulai Ujian
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" disabled>
                                                        Tidak Tersedia
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
