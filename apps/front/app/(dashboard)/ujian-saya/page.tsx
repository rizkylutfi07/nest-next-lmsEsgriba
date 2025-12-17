"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Clock, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../../role-context";

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

    const getStatusInfo = (ujianSiswa: any) => {
        if (!ujianSiswa) {
            return { icon: FileText, color: "text-blue-500", label: "Belum Dikerjakan" };
        }
        if (ujianSiswa.status === "SELESAI") {
            return { icon: CheckCircle, color: "text-green-500", label: "Selesai" };
        }
        if (ujianSiswa.status === "SEDANG_DIKERJAKAN") {
            return { icon: Clock, color: "text-yellow-500", label: "Sedang Dikerjakan" };
        }
        return { icon: AlertCircle, color: "text-gray-500", label: "Belum Mulai" };
    };

    const isAvailable = (ujian: any) => {
        const now = new Date();
        const start = new Date(ujian.tanggalMulai);
        const end = new Date(ujian.tanggalSelesai);
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
                        ) : data?.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                <p>Tidak ada ujian tersedia saat ini</p>
                            </div>
                        ) : (
                            data?.map((item: any) => {
                                const statusInfo = getStatusInfo(item.ujianSiswa);
                                const StatusIcon = statusInfo.icon;
                                const available = isAvailable(item);

                                return (
                                    <Card key={item.id} className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline">{item.kode}</Badge>
                                                    {item.mataPelajaran && (
                                                        <Badge className="bg-indigo-500/15 text-indigo-600">
                                                            {item.mataPelajaran.nama}
                                                        </Badge>
                                                    )}
                                                    {!available && (
                                                        <Badge className="bg-red-500/15 text-red-600">
                                                            Tidak Tersedia
                                                        </Badge>
                                                    )}
                                                </div>

                                                <h3 className="text-lg font-semibold mb-1">
                                                    {item.judul}
                                                </h3>

                                                {item.deskripsi && (
                                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                        {item.deskripsi}
                                                    </p>
                                                )}

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span>{item.durasi} menit</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <span>{item._count?.ujianSoal || 0} soal</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                                                        <span>{statusInfo.label}</span>
                                                    </div>
                                                    {item.ujianSiswa?.nilai !== null && item.ujianSiswa?.nilai !== undefined && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold">
                                                                Nilai: {item.ujianSiswa.nilai}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-3 text-xs text-muted-foreground">
                                                    <p>
                                                        Mulai: {new Date(item.tanggalMulai).toLocaleString("id-ID")}
                                                    </p>
                                                    <p>
                                                        Selesai: {new Date(item.tanggalSelesai).toLocaleString("id-ID")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {item.ujianSiswa?.status === "SELESAI" ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.push(`/ujian-saya/hasil/${item.ujianSiswa.id}`)
                                                        }
                                                    >
                                                        Lihat Hasil
                                                    </Button>
                                                ) : item.ujianSiswa?.status === "SEDANG_DIKERJAKAN" ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            router.push(`/ujian-saya/kerjakan/${item.ujianSiswa.id}`)
                                                        }
                                                    >
                                                        Lanjutkan
                                                    </Button>
                                                ) : available ? (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            router.push(`/ujian-saya/mulai/${item.id}`)
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
