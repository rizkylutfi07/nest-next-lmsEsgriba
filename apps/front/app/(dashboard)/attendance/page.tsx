"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, UserX, Clock, Calendar, QrCode } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole } from "../role-context";
import Link from "next/link";

export default function AttendancePage() {
    const { token } = useRole();

    const { data: todayData, isLoading } = useQuery({
        queryKey: ["attendance-today"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3001/attendance/today", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const stats = [
        {
            title: "Total Siswa",
            value: todayData?.totalSiswa || 0,
            icon: Users,
            color: "text-blue-500",
        },
        {
            title: "Hadir Hari Ini",
            value: todayData?.totalHadir || 0,
            icon: UserCheck,
            color: "text-green-500",
        },
        {
            title: "Alpha",
            value: todayData?.totalAlpha || 0,
            icon: UserX,
            color: "text-red-500",
        },
        {
            title: "Persentase Kehadiran",
            value: todayData?.totalSiswa
                ? `${((todayData.totalHadir / todayData.totalSiswa) * 100).toFixed(1)}%`
                : "0%",
            icon: Clock,
            color: "text-yellow-500",
        },
    ];

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

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className={stat.color} size={20} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
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

            {/* Recent Attendance */}
            <Card>
                <CardHeader>
                    <CardTitle>Absensi Hari Ini</CardTitle>
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
                    {isLoading ? (
                        <p className="text-center text-muted-foreground py-8">Loading...</p>
                    ) : todayData?.attendance?.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Belum ada absensi hari ini</p>
                    ) : (
                        <div className="space-y-2">
                            {todayData?.attendance?.slice(0, 10).map((att: any) => (
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
                                            className={`text-xs ${att.status === "HADIR"
                                                    ? "text-green-500"
                                                    : att.status === "TERLAMBAT"
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
