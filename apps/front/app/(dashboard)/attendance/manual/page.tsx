"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../../role-context";
import { apiFetch } from "@/lib/api-client";
import { cn } from "@/lib/utils";

type AttendanceStatus = "HADIR" | "SAKIT" | "IZIN" | "ALPHA" | "TERLAMBAT";

interface Student {
    id: string;
    nisn: string;
    nama: string;
    kelas: {
        id: string;
        nama: string;
    } | null;
    attendance: {
        id: string;
        status: AttendanceStatus;
        jamMasuk: string;
        jamKeluar?: string;
        keterangan?: string;
    } | null;
}

interface ManualAttendanceResponse {
    tanggal: string;
    stats: {
        total: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpha: number;
        terlambat: number;
        belum: number;
    };
    students: Student[];
}

interface Kelas {
    id: string;
    nama: string;
}

const statusColors: Record<AttendanceStatus, string> = {
    HADIR: "bg-green-500/10 text-green-500 border-green-500/20",
    SAKIT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    IZIN: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    ALPHA: "bg-red-500/10 text-red-500 border-red-500/20",
    TERLAMBAT: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

const statusLabels: Record<AttendanceStatus, string> = {
    HADIR: "Hadir",
    SAKIT: "Sakit",
    IZIN: "Izin",
    ALPHA: "Alpha",
    TERLAMBAT: "Terlambat",
};

export default function ManualAttendancePage() {
    const { token } = useRole();
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedKelas, setSelectedKelas] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // all, attended, not-attended
    const [updatingStudentId, setUpdatingStudentId] = useState<string | null>(null);

    // Fetch classes
    const { data: kelasData } = useQuery({
        queryKey: ["kelas"],
        queryFn: async () => {
            return apiFetch<{ data: Kelas[] }>("/kelas", {}, token);
        },
    });

    // Fetch students for manual attendance
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["manual-attendance", selectedDate, selectedKelas],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (selectedDate) params.set("date", selectedDate);
            if (selectedKelas) params.set("kelasId", selectedKelas);

            return apiFetch<ManualAttendanceResponse>(
                `/attendance/manual?${params.toString()}`,
                {},
                token
            );
        },
    });

    // Filter students based on search query and status
    const filteredStudents = data?.students.filter(student => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch = (
                student.nisn.toLowerCase().includes(query) ||
                student.nama.toLowerCase().includes(query) ||
                student.kelas?.nama.toLowerCase().includes(query)
            );
            if (!matchesSearch) return false;
        }

        // Status filter
        if (statusFilter === "attended") {
            return student.attendance !== null;
        } else if (statusFilter === "not-attended") {
            return student.attendance === null;
        }

        return true; // all
    });

    // Update attendance mutation
    const updateMutation = useMutation({
        mutationFn: async ({ studentId, status }: { studentId: string; status: AttendanceStatus }) => {
            const student = data?.students.find(s => s.id === studentId);

            if (student?.attendance) {
                // Update existing attendance
                return apiFetch(
                    `/attendance/${student.attendance.id}`,
                    {
                        method: "PUT",
                        body: JSON.stringify({ status }),
                    },
                    token
                );
            } else {
                // Create new attendance
                return apiFetch(
                    `/attendance/manual`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            siswaId: studentId,
                            tanggal: selectedDate,
                            status,
                        }),
                    },
                    token
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["manual-attendance"] });
            setUpdatingStudentId(null);
        },
        onError: (error: Error) => {
            console.error("Failed to update attendance:", error);
            setUpdatingStudentId(null);
        },
    });

    const handleStatusUpdate = (studentId: string, status: AttendanceStatus) => {
        setUpdatingStudentId(studentId);
        updateMutation.mutate({ studentId, status });
    };

    // Check-out mutation
    const checkOutMutation = useMutation({
        mutationFn: async (nisn: string) => {
            return apiFetch(
                `/attendance/check-out`,
                {
                    method: "POST",
                    body: JSON.stringify({ siswaId: nisn }),
                },
                token
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["manual-attendance"] });
            setUpdatingStudentId(null);
        },
        onError: (error: Error) => {
            console.error("Failed to check-out:", error);
            alert(error.message || "Gagal check-out");
            setUpdatingStudentId(null);
        },
    });

    const handleCheckOut = (nisn: string, studentId: string) => {
        setUpdatingStudentId(studentId);
        checkOutMutation.mutate(nisn);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Absensi Manual</h1>
                <p className="text-muted-foreground">Kelola kehadiran siswa secara manual</p>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Tanggal</label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full rounded-lg border border-border bg-background px-10 py-2 outline-none transition focus:border-primary/60"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">Kelas</label>
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <select
                                        value={selectedKelas}
                                        onChange={(e) => setSelectedKelas(e.target.value)}
                                        className="w-full rounded-lg border border-border bg-background px-10 py-2 outline-none transition focus:border-primary/60"
                                    >
                                        <option value="">Semua Kelas</option>
                                        {kelasData?.data.map((kelas) => (
                                            <option key={kelas.id} value={kelas.id}>
                                                {kelas.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Cari Siswa</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari berdasarkan NISN, nama, atau kelas..."
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Status Kehadiran</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60"
                            >
                                <option value="all">Semua</option>
                                <option value="attended">Sudah Hadir</option>
                                <option value="not-attended">Belum Hadir</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics - Mobile Optimized */}
            {data && (
                <>
                    {/* Desktop: Multiple Cards */}
                    <div className="hidden lg:grid gap-4 grid-cols-7">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total</CardDescription>
                                <CardTitle className="text-2xl">{data.stats.total}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-green-500">Hadir</CardDescription>
                                <CardTitle className="text-2xl text-green-500">{data.stats.hadir}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-blue-500">Sakit</CardDescription>
                                <CardTitle className="text-2xl text-blue-500">{data.stats.sakit}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-yellow-500">Izin</CardDescription>
                                <CardTitle className="text-2xl text-yellow-500">{data.stats.izin}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-red-500">Alpha</CardDescription>
                                <CardTitle className="text-2xl text-red-500">{data.stats.alpha}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-orange-500">Terlambat</CardDescription>
                                <CardTitle className="text-2xl text-orange-500">{data.stats.terlambat}</CardTitle>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-muted-foreground">Belum</CardDescription>
                                <CardTitle className="text-2xl text-muted-foreground">{data.stats.belum}</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* Mobile: Single Consolidated Card */}
                    <Card className="lg:hidden">
                        <CardHeader>
                            <CardTitle>Statistik Kehadiran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">Total</p>
                                    <p className="text-2xl font-bold">{data.stats.total}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-green-500">Hadir</p>
                                    <p className="text-2xl font-bold text-green-500">{data.stats.hadir}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-blue-500">Sakit</p>
                                    <p className="text-2xl font-bold text-blue-500">{data.stats.sakit}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-yellow-500">Izin</p>
                                    <p className="text-2xl font-bold text-yellow-500">{data.stats.izin}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-red-500">Alpha</p>
                                    <p className="text-2xl font-bold text-red-500">{data.stats.alpha}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-orange-500">Terlambat</p>
                                    <p className="text-2xl font-bold text-orange-500">{data.stats.terlambat}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Students Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Siswa</CardTitle>
                    <CardDescription>
                        {new Date(selectedDate || new Date()).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                        {searchQuery && ` - ${filteredStudents?.length || 0} hasil pencarian`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-muted-foreground" size={32} />
                        </div>
                    ) : filteredStudents?.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            {searchQuery ? "Tidak ada siswa yang cocok dengan pencarian" : "Tidak ada siswa"}
                        </p>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border text-left text-sm text-muted-foreground">
                                            <th className="pb-3 font-medium">NISN</th>
                                            <th className="pb-3 font-medium">Nama</th>
                                            <th className="pb-3 font-medium">Kelas</th>
                                            <th className="pb-3 font-medium">Status</th>
                                            <th className="pb-3 font-medium">Jam Masuk</th>
                                            <th className="pb-3 font-medium">Jam Keluar</th>
                                            <th className="pb-3 font-medium text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents?.map((student) => (
                                            <tr key={student.id} className="border-b border-border/50 transition hover:bg-muted/30">
                                                <td className="py-4 text-sm">{student.nisn}</td>
                                                <td className="py-4 font-medium">{student.nama}</td>
                                                <td className="py-4 text-sm">{student.kelas?.nama || "-"}</td>
                                                <td className="py-4">
                                                    {student.attendance ? (
                                                        <Badge className={cn("border", statusColors[student.attendance.status])}>
                                                            {statusLabels[student.attendance.status]}
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="text-muted-foreground border">
                                                            Belum Absen
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="py-4 text-sm text-muted-foreground">
                                                    {student.attendance?.jamMasuk
                                                        ? new Date(student.attendance.jamMasuk).toLocaleTimeString("id-ID", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })
                                                        : "-"}
                                                </td>
                                                <td className="py-4 text-sm text-muted-foreground">
                                                    {student.attendance?.jamKeluar
                                                        ? new Date(student.attendance.jamKeluar).toLocaleTimeString("id-ID", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })
                                                        : "-"}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex justify-end gap-1">
                                                        {student.attendance &&
                                                            !student.attendance.jamKeluar &&
                                                            (student.attendance.status === "HADIR" || student.attendance.status === "TERLAMBAT") ? (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleCheckOut(student.nisn, student.id)}
                                                                disabled={updatingStudentId === student.id}
                                                                className="h-8 px-2 text-xs"
                                                                title="Check-Out"
                                                            >
                                                                {updatingStudentId === student.id ? (
                                                                    <Loader2 className="animate-spin" size={14} />
                                                                ) : (
                                                                    "Pulang"
                                                                )}
                                                            </Button>
                                                        ) : null}
                                                        {(["HADIR", "SAKIT", "IZIN", "ALPHA"] as AttendanceStatus[]).map((status) => (
                                                            <Button
                                                                key={status}
                                                                size="sm"
                                                                variant={student.attendance?.status === status ? "default" : "outline"}
                                                                onClick={() => handleStatusUpdate(student.id, status)}
                                                                disabled={updatingStudentId === student.id}
                                                                className="h-8 w-8 p-0"
                                                                title={statusLabels[status]}
                                                            >
                                                                {updatingStudentId === student.id ? (
                                                                    <Loader2 className="animate-spin" size={14} />
                                                                ) : (
                                                                    status[0]
                                                                )}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Simplified View */}
                            <div className="md:hidden space-y-3">
                                {filteredStudents?.map((student) => (
                                    <div key={student.id} className="border border-border rounded-lg p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{student.nama}</p>
                                                <p className="text-xs text-muted-foreground">{student.kelas?.nama || "-"}</p>
                                                {student.attendance && (
                                                    <Badge className={cn("border mt-1 text-xs", statusColors[student.attendance.status])}>
                                                        {statusLabels[student.attendance.status]}
                                                    </Badge>
                                                )}
                                            </div>
                                            {student.attendance &&
                                                !student.attendance.jamKeluar &&
                                                (student.attendance.status === "HADIR" || student.attendance.status === "TERLAMBAT") && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleCheckOut(student.nisn, student.id)}
                                                        disabled={updatingStudentId === student.id}
                                                        className="h-7 px-2 text-xs shrink-0"
                                                    >
                                                        {updatingStudentId === student.id ? (
                                                            <Loader2 className="animate-spin" size={12} />
                                                        ) : (
                                                            "Pulang"
                                                        )}
                                                    </Button>
                                                )}
                                        </div>
                                        <div className="flex gap-1">
                                            {(["HADIR", "SAKIT", "IZIN", "ALPHA"] as AttendanceStatus[]).map((status) => (
                                                <Button
                                                    key={status}
                                                    size="sm"
                                                    variant={student.attendance?.status === status ? "default" : "outline"}
                                                    onClick={() => handleStatusUpdate(student.id, status)}
                                                    disabled={updatingStudentId === student.id}
                                                    className="h-8 flex-1"
                                                >
                                                    {updatingStudentId === student.id ? (
                                                        <Loader2 className="animate-spin" size={14} />
                                                    ) : (
                                                        status[0]
                                                    )}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <div className="text-sm text-muted-foreground">
                <p>Keterangan: H = Hadir | S = Sakit | I = Izin | A = Alpha</p>
            </div>
        </div>
    );
}
