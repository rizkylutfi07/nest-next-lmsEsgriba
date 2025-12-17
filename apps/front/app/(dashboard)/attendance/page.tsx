"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, UserX, Clock, Calendar, QrCode, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole } from "../role-context";
import Link from "next/link";

export default function AttendancePage() {
    const { token } = useRole();
    const [statusFilter, setStatusFilter] = useState("all"); // all, attended, not-attended, terlambat, hadir, sakit, izin, alpha

    const { data: todayData, isLoading } = useQuery({
        queryKey: ["attendance-today"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3001/attendance/today", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const { data: absentData, isLoading: isLoadingAbsent } = useQuery({
        queryKey: ["absent-students"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3001/attendance/absent-students", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        enabled: statusFilter === "not-attended",
    });

    // Filter attendance based on status
    const filteredAttendance = todayData?.attendance?.filter((att: any) => {
        if (statusFilter === "attended") return true; // All in attendance list are attended
        if (statusFilter === "not-attended") return false; // This will be handled separately
        if (statusFilter === "terlambat") return att.status === "TERLAMBAT";
        if (statusFilter === "hadir") return att.status === "HADIR";
        if (statusFilter === "sakit") return att.status === "SAKIT";
        if (statusFilter === "izin") return att.status === "IZIN";
        if (statusFilter === "alpha") return att.status === "ALPHA";
        return true; // all
    }) || [];

    // Get list of students who haven't attended (if we need it)
    const totalNotAttended = (todayData?.totalSiswa || 0) - (todayData?.totalHadir || 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Absensi Siswa</h1>
                    <p className="text-muted-foreground">Sistem absensi dengan barcode scanner</p>
                </div>
                <Link href="/attendance/scanner">
                    <Button>
                        <QrCode size={16} />
                        Buka Scanner
                    </Button>
                </Link>
            </div>

            {/* Statistics - Single Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Statistik Kehadiran Hari Ini</CardTitle>
                    <CardDescription>
                        {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        <div className="text-center p-4 rounded-lg bg-muted/30">
                            <Users className="mx-auto mb-2 text-blue-500" size={24} />
                            <p className="text-2xl font-bold">{todayData?.totalSiswa || 0}</p>
                            <p className="text-sm text-muted-foreground">Total Siswa</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/30">
                            <UserCheck className="mx-auto mb-2 text-green-500" size={24} />
                            <p className="text-2xl font-bold">{todayData?.stats?.hadir || 0}</p>
                            <p className="text-sm text-muted-foreground">Hadir</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/30">
                            <Clock className="mx-auto mb-2 text-orange-500" size={24} />
                            <p className="text-2xl font-bold">{todayData?.stats?.terlambat || 0}</p>
                            <p className="text-sm text-muted-foreground">Terlambat</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/30">
                            <UserX className="mx-auto mb-2 text-blue-400" size={24} />
                            <p className="text-2xl font-bold">{todayData?.stats?.sakit || 0}</p>
                            <p className="text-sm text-muted-foreground">Sakit</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/30">
                            <UserX className="mx-auto mb-2 text-yellow-500" size={24} />
                            <p className="text-2xl font-bold">{todayData?.stats?.izin || 0}</p>
                            <p className="text-sm text-muted-foreground">Izin</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/30">
                            <UserX className="mx-auto mb-2 text-red-500" size={24} />
                            <p className="text-2xl font-bold">{todayData?.stats?.alpha || 0}</p>
                            <p className="text-sm text-muted-foreground">Alpha</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/30">
                            <UserX className="mx-auto mb-2 text-gray-500" size={24} />
                            <p className="text-2xl font-bold">{totalNotAttended}</p>
                            <p className="text-sm text-muted-foreground">Belum Datang</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/30">
                            <UserCheck className="mx-auto mb-2 text-purple-500" size={24} />
                            <p className="text-2xl font-bold">
                                {todayData?.totalSiswa
                                    ? `${((todayData.totalHadir / todayData.totalSiswa) * 100).toFixed(1)}%`
                                    : "0%"}
                            </p>
                            <p className="text-sm text-muted-foreground">Persentase</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/attendance/scanner">
                    <Card className="cursor-pointer hover:bg-muted/30 transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <QrCode size={20} />
                                Scanner
                            </CardTitle>
                            <CardDescription>Scan barcode kartu pelajar</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/attendance/manual">
                    <Card className="cursor-pointer hover:bg-muted/30 transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users size={20} />
                                Absensi Manual
                            </CardTitle>
                            <CardDescription>Tandai kehadiran manual</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/attendance/report">
                    <Card className="cursor-pointer hover:bg-muted/30 transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar size={20} />
                                Laporan
                            </CardTitle>
                            <CardDescription>Lihat laporan kehadiran</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link href="/attendance/student-card">
                    <Card className="cursor-pointer hover:bg-muted/30 transition">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users size={20} />
                                Kartu Pelajar
                            </CardTitle>
                            <CardDescription>Generate & print kartu</CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>

            {/* Recent Attendance with Filter */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Daftar Kehadiran Hari Ini</CardTitle>
                            <CardDescription>
                                {statusFilter === "all" && "Semua siswa"}
                                {statusFilter === "attended" && "Siswa yang sudah datang"}
                                {statusFilter === "not-attended" && "Siswa yang belum datang"}
                                {statusFilter === "terlambat" && "Siswa yang terlambat"}
                                {statusFilter === "hadir" && "Siswa yang hadir tepat waktu"}
                                {statusFilter === "sakit" && "Siswa yang sakit"}
                                {statusFilter === "izin" && "Siswa yang izin"}
                                {statusFilter === "alpha" && "Siswa yang alpha"}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-muted-foreground" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none transition focus:border-primary/60"
                            >
                                <option value="all">Semua</option>
                                <option value="attended">Sudah Datang</option>
                                <option value="not-attended">Belum Datang</option>
                                <option value="hadir">Hadir</option>
                                <option value="terlambat">Terlambat</option>
                                <option value="sakit">Sakit</option>
                                <option value="izin">Izin</option>
                                <option value="alpha">Alpha</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading || (statusFilter === "not-attended" && isLoadingAbsent) ? (
                        <p className="text-center text-muted-foreground py-8">Loading...</p>
                    ) : statusFilter === "not-attended" ? (
                        absentData?.students?.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                                Semua siswa sudah hadir hari ini! 🎉
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {absentData?.students?.map((student: any) => (
                                    <div
                                        key={student.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition"
                                    >
                                        <div>
                                            <p className="font-medium">{student.nama}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {student.kelas?.nama || "-"} • {student.nisn}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-red-500 font-medium">
                                                Belum Hadir
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : filteredAttendance.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            {statusFilter === "terlambat" && "Tidak ada siswa yang terlambat hari ini"}
                            {statusFilter === "hadir" && "Tidak ada siswa yang hadir tepat waktu hari ini"}
                            {statusFilter === "sakit" && "Tidak ada siswa yang sakit hari ini"}
                            {statusFilter === "izin" && "Tidak ada siswa yang izin hari ini"}
                            {statusFilter === "alpha" && "Tidak ada siswa yang alpha hari ini"}
                            {statusFilter === "all" && "Belum ada absensi hari ini"}
                            {statusFilter === "attended" && "Belum ada absensi hari ini"}
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {filteredAttendance.slice(0, 10).map((att: any) => (
                                <div
                                    key={att.id}
                                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition"
                                >
                                    <div>
                                        <p className="font-medium">{att.siswa.nama}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {att.siswa.kelas?.nama || "-"} • {att.siswa.nisn}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {new Date(att.jamMasuk).toLocaleTimeString("id-ID")}
                                        </p>
                                        <p
                                            className={`text-xs font-semibold ${att.status === "HADIR"
                                                ? "text-green-500"
                                                : att.status === "TERLAMBAT"
                                                    ? "text-orange-500"
                                                    : att.status === "SAKIT"
                                                        ? "text-blue-500"
                                                        : att.status === "IZIN"
                                                            ? "text-yellow-500"
                                                            : "text-red-500"
                                                }`}
                                        >
                                            {att.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
