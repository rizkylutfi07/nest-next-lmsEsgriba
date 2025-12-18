"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft, Users, Clock, AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../../../role-context";

export default function MonitoringPage() {
    const { token } = useRole();
    const router = useRouter();
    const params = useParams();
    const ujianId = params.id as string;
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Fetch ujian details
    const { data: ujian, isLoading: ujianLoading } = useQuery({
        queryKey: ["ujian-detail", ujianId],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/ujian/${ujianId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    // Fetch students taking exam (via ujianSiswa)
    const { data: students, isLoading: studentsLoading, refetch } = useQuery({
        queryKey: ["ujian-students", ujianId],
        queryFn: async () => {
            // We'll use a filter on ujian-siswa endpoint
            const res = await fetch(
                `http://localhost:3001/ujian-siswa/available`, // This needs to be adjusted in backend
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            // Filter for this specific ujian
            return data.filter((item: any) => item.id === ujianId);
        },
        refetchInterval: autoRefresh ? 5000 : false, // Refresh every 5 seconds
    });

    const getStatusBadge = (status: string) => {
        const config: any = {
            BELUM_MULAI: { className: "bg-gray-500/15 text-gray-600", label: "Belum Mulai" },
            SEDANG_DIKERJAKAN: { className: "bg-yellow-500/15 text-yellow-600", label: "Sedang Dikerjakan" },
            SELESAI: { className: "bg-green-500/15 text-green-600", label: "Selesai" },
        };
        return config[status] || config.BELUM_MULAI;
    };

    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    // Fetch activity logs for selected student
    const { data: activityLogs } = useQuery({
        queryKey: ["activity-logs", selectedStudent?.ujianSiswa?.id],
        queryFn: async () => {
            if (!selectedStudent?.ujianSiswa?.id) return [];
            const res = await fetch(
                `http://localhost:3001/ujian-siswa/activity-logs/${selectedStudent.ujianSiswa.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
        enabled: !!selectedStudent?.ujianSiswa?.id,
    });

    if (ujianLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const stats = {
        total: students?.length || 0,
        belumMulai: students?.filter((s: any) => !s.ujianSiswa || s.ujianSiswa.status === "BELUM_MULAI").length || 0,
        sedangDikerjakan: students?.filter((s: any) => s.ujianSiswa?.status === "SEDANG_DIKERJAKAN").length || 0,
        selesai: students?.filter((s: any) => s.ujianSiswa?.status === "SELESAI").length || 0,
    };

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ArrowLeft size={20} />
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold">Monitoring Ujian</h1>
                                <p className="text-sm text-muted-foreground">{ujian?.judul}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                    className="rounded"
                                />
                                Auto-refresh (5s)
                            </label>
                            <Button variant="outline" size="sm" onClick={() => refetch()}>
                                Refresh
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Siswa</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gray-500/20 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Belum Mulai</p>
                                <p className="text-2xl font-bold">{stats.belumMulai}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Sedang Dikerjakan</p>
                                <p className="text-2xl font-bold">{stats.sedangDikerjakan}</p>
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
                                <p className="text-sm text-muted-foreground">Selesai</p>
                                <p className="text-2xl font-bold">{stats.selesai}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Student List */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Siswa</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 text-left">Nama Siswa</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Waktu Mulai</th>
                                    <th className="px-4 py-3 text-left">Nilai</th>
                                    <th className="px-4 py-3 text-left">Pelanggaran</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {studentsLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : students?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                            Belum ada siswa yang mengerjakan
                                        </td>
                                    </tr>
                                ) : (
                                    students?.map((student: any) => {
                                        const statusConfig = getStatusBadge(
                                            student.ujianSiswa?.status || "BELUM_MULAI"
                                        );
                                        return (
                                            <tr key={student.id} className="hover:bg-muted/30">
                                                <td className="px-4 py-3 font-medium">
                                                    {student.siswa?.nama || "Unknown"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge className={statusConfig.className}>
                                                        {statusConfig.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {student.ujianSiswa?.waktuMulai
                                                        ? new Date(student.ujianSiswa.waktuMulai).toLocaleTimeString("id-ID")
                                                        : "-"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {student.ujianSiswa?.nilai !== null &&
                                                        student.ujianSiswa?.nilai !== undefined
                                                        ? student.ujianSiswa.nilai
                                                        : "-"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {student.ujianSiswa?.violationCount > 0 ? (
                                                        <Badge className="bg-red-500/15 text-red-600">
                                                            {student.ujianSiswa.violationCount}
                                                        </Badge>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {student.ujianSiswa && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSelectedStudent(student)}
                                                        >
                                                            <Eye size={14} className="mr-1" />
                                                            Detail
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Activity Logs Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
                    <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Detail Aktivitas</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {selectedStudent.siswa?.nama}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedStudent(null)}
                                >
                                    <ArrowLeft size={18} />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                <div>
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <p className="font-semibold">
                                        {selectedStudent.ujianSiswa?.status || "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Nilai</p>
                                    <p className="font-semibold">
                                        {selectedStudent.ujianSiswa?.nilai ?? "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Waktu Mulai</p>
                                    <p className="font-semibold">
                                        {selectedStudent.ujianSiswa?.waktuMulai
                                            ? new Date(selectedStudent.ujianSiswa.waktuMulai).toLocaleString("id-ID")
                                            : "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Pelanggaran</p>
                                    <p className="font-semibold">
                                        {selectedStudent.ujianSiswa?.violationCount || 0}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-3">Log Aktivitas</h4>
                                {activityLogs?.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Tidak ada aktivitas mencurigakan
                                    </p>
                                ) : (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {activityLogs?.map((log: any, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg text-sm"
                                            >
                                                <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="font-medium">{log.activityType}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(log.timestamp).toLocaleString("id-ID")}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
