"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    FileText,
    TrendingUp,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRole } from "@/app/(dashboard)/role-context";
import { API_URL } from "@/lib/api";

type AttendanceStatus = "HADIR" | "TERLAMBAT" | "SAKIT" | "IZIN" | "ALPHA";

interface AttendanceRecord {
    id: string;
    tanggal: string | Date;
    jamMasuk: string;
    jamKeluar: string | null;
    status: AttendanceStatus;
    keterangan: string | null;
}

const statusConfig = {
    HADIR: { label: "Hadir", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30", icon: CheckCircle2 },
    TERLAMBAT: { label: "Terlambat", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30", icon: Clock },
    SAKIT: { label: "Sakit", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30", icon: AlertCircle },
    IZIN: { label: "Izin", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: FileText },
    ALPHA: { label: "Alpha", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30", icon: XCircle },
};

export default function KehadiranSayaPage() {
    const { user, token } = useRole();
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    // Calculate start and end of the selected month
    const startDate = useMemo(() => {
        const d = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        return d.toISOString().split('T')[0];
    }, [selectedMonth]);

    const endDate = useMemo(() => {
        const d = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
        return d.toISOString().split('T')[0];
    }, [selectedMonth]);

    const { data: attendanceData = [], isLoading } = useQuery({
        queryKey: ["student-attendance", user?.siswa?.id, startDate, endDate],
        queryFn: async () => {
            if (!user?.siswa?.id) return [];
            const res = await fetch(
                `${API_URL}/attendance/student/${user.siswa.id}?startDate=${startDate}&endDate=${endDate}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
        enabled: !!user?.siswa?.id && !!token,
    });

    // Calculate statistics
    const stats = useMemo(() => {
        const total = attendanceData.length;
        const hadir = attendanceData.filter((a: AttendanceRecord) => a.status === "HADIR").length;
        const terlambat = attendanceData.filter((a: AttendanceRecord) => a.status === "TERLAMBAT").length;
        const sakit = attendanceData.filter((a: AttendanceRecord) => a.status === "SAKIT").length;
        const izin = attendanceData.filter((a: AttendanceRecord) => a.status === "IZIN").length;
        const alpha = attendanceData.filter((a: AttendanceRecord) => a.status === "ALPHA").length;
        const percentage = total > 0 ? Math.round(((hadir + terlambat) / total) * 100) : 0;

        return { total, hadir, terlambat, sakit, izin, alpha, percentage };
    }, [attendanceData]);

    // Create a map of attendance by date
    const attendanceByDate = useMemo(() => {
        const map = new Map<string, AttendanceRecord>();
        attendanceData.forEach((record: AttendanceRecord) => {
            // Convert Date to YYYY-MM-DD string for consistent key
            const dateKey = typeof record.tanggal === 'string'
                ? record.tanggal.split('T')[0]!
                : new Date(record.tanggal).toISOString().split('T')[0]!;
            map.set(dateKey, record);
        });
        return map;
    }, [attendanceData]);

    // Generate calendar days for the selected month
    const calendarDays = useMemo(() => {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

        const days: (Date | null)[] = [];

        // Add empty cells for days before the first of the month
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    }, [selectedMonth]);

    const prevMonth = () => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
    };

    const monthName = selectedMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Kehadiran Saya</h1>
                <p className="text-muted-foreground">Riwayat kehadiran dan statistik</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                        <p className="text-xs text-muted-foreground mt-1">Total Hari</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
                    <CardContent className="p-4 text-center">
                        <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <p className="text-3xl font-bold text-green-600">{stats.hadir}</p>
                        <p className="text-xs text-muted-foreground mt-1">Hadir</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
                    <CardContent className="p-4 text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <p className="text-3xl font-bold text-orange-600">{stats.terlambat}</p>
                        <p className="text-xs text-muted-foreground mt-1">Terlambat</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4 text-center">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-3xl font-bold text-blue-600">{stats.sakit}</p>
                        <p className="text-xs text-muted-foreground mt-1">Sakit</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-4 text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                        <p className="text-3xl font-bold text-yellow-600">{stats.izin}</p>
                        <p className="text-xs text-muted-foreground mt-1">Izin</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-4 text-center">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <p className="text-3xl font-bold text-purple-600">{stats.percentage}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Kehadiran</p>
                    </CardContent>
                </Card>
            </div>

            {/* Calendar View */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Kalender Kehadiran
                            </CardTitle>
                            <CardDescription className="capitalize">{monthName}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={prevMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={nextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Memuat data...</div>
                    ) : (
                        <div className="grid grid-cols-7 gap-2">
                            {/* Header Row */}
                            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                                <div key={day} className="text-center text-sm font-semibold text-muted-foreground p-2">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar Days */}
                            {calendarDays.map((date, index) => {
                                if (!date) {
                                    return <div key={`empty-${index}`} className="aspect-square" />;
                                }

                                const dateStr = date.toISOString().split('T')[0];
                                const attendance = attendanceByDate.get(dateStr) || null;
                                const isToday = dateStr === new Date().toISOString().split('T')[0];

                                return (
                                    <div
                                        key={dateStr}
                                        className={cn(
                                            "aspect-square rounded-lg border p-2 flex flex-col items-center justify-center text-sm transition-all",
                                            isToday && "border-primary border-2",
                                            attendance ? statusConfig[attendance.status].bg : "bg-muted/20",
                                            !attendance && "opacity-50"
                                        )}
                                    >
                                        <span className={cn(
                                            "font-semibold",
                                            attendance ? statusConfig[attendance.status].color : "text-muted-foreground"
                                        )}>
                                            {date.getDate()}
                                        </span>
                                        {attendance && (
                                            <span className={cn("text-xs mt-1", statusConfig[attendance.status].color)}>
                                                {statusConfig[attendance.status].label}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Attendance List */}
            <Card>
                <CardHeader>
                    <CardTitle>Riwayat Detail</CardTitle>
                    <CardDescription>Daftar kehadiran bulan {monthName}</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Memuat data...</div>
                    ) : attendanceData.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>Tidak ada data kehadiran untuk bulan ini</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {attendanceData
                                .slice()
                                .reverse()
                                .map((record: AttendanceRecord) => {
                                    const config = statusConfig[record.status];
                                    const Icon = config.icon;
                                    // Parse date properly - tanggal from API is "YYYY-MM-DD" string
                                    const date = new Date(record.tanggal);
                                    const dayName = date.toLocaleDateString("id-ID", { weekday: "long", timeZone: "UTC" });
                                    const dateStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

                                    return (
                                        <div
                                            key={record.id}
                                            className="flex items-center justify-between p-4 rounded-lg border bg-background/50 hover:bg-accent/30 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", config.bg)}>
                                                    <Icon className={cn("h-6 w-6", config.color)} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{dayName}</p>
                                                    <p className="text-sm text-muted-foreground">{dateStr}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={cn(config.bg, config.color, "mb-1")}>
                                                    {config.label}
                                                </Badge>
                                                <p className="text-sm text-muted-foreground">
                                                    {record.jamMasuk || "-"}
                                                </p>
                                                {record.keterangan && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {record.keterangan}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
