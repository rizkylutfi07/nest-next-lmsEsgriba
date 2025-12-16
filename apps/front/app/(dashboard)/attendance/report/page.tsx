"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Download, Filter, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../../role-context";
import * as XLSX from "xlsx";

export default function AttendanceReportPage() {
    const { token } = useRole();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedKelas, setSelectedKelas] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

    const { data: reportData, isLoading } = useQuery({
        queryKey: ["attendance-report", startDate, endDate, selectedKelas, selectedStatus],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);
            if (selectedKelas) params.append("kelasId", selectedKelas);
            if (selectedStatus) params.append("status", selectedStatus);

            const res = await fetch(`http://localhost:3001/attendance/report?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const { data: kelasList } = useQuery({
        queryKey: ["kelas-all"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3001/kelas", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    // Helper function to format date without timezone shift
    const formatDate = (dateString: string) => {
        // Extract date part from ISO string (YYYY-MM-DD)
        const datePart = dateString.split('T')[0];
        if (!datePart) return dateString;
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleExportExcel = () => {
        if (!reportData?.attendance) return;

        const data = reportData.attendance.map((att: any) => ({
            Tanggal: formatDate(att.tanggal),
            NISN: att.siswa.nisn,
            Nama: att.siswa.nama,
            Kelas: att.siswa.kelas?.nama || "-",
            "Jam Masuk": new Date(att.jamMasuk).toLocaleTimeString("id-ID"),
            "Jam Keluar": att.jamKeluar ? new Date(att.jamKeluar).toLocaleTimeString("id-ID") : "-",
            Status: att.status,
            Keterangan: att.keterangan || "-",
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Laporan Absensi");
        XLSX.writeFile(wb, `Laporan_Absensi_${new Date().toISOString().split("T")[0]}.xlsx`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Laporan Absensi</h1>
                    <p className="text-muted-foreground">Lihat dan export laporan kehadiran siswa</p>
                </div>
                <Button
                    onClick={handleExportExcel}
                    disabled={!reportData?.attendance || reportData.attendance.length === 0}
                >
                    <FileSpreadsheet size={16} />
                    Export Excel
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter size={20} />
                        Filter Laporan
                    </CardTitle>
                    <CardDescription>Pilih periode dan filter untuk laporan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Tanggal Mulai</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Tanggal Akhir</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Kelas</label>
                            <select
                                value={selectedKelas}
                                onChange={(e) => setSelectedKelas(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-primary"
                            >
                                <option value="">Semua Kelas</option>
                                {kelasList?.data?.map((kelas: any) => (
                                    <option key={kelas.id} value={kelas.id}>
                                        {kelas.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-primary"
                            >
                                <option value="">Semua Status</option>
                                <option value="HADIR">Hadir</option>
                                <option value="TERLAMBAT">Terlambat</option>
                                <option value="IZIN">Izin</option>
                                <option value="SAKIT">Sakit</option>
                                <option value="ALPHA">Alpha</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics */}
            {reportData?.stats && (
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reportData.stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-500">Hadir</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reportData.stats.hadir}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-500">Terlambat</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reportData.stats.terlambat}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-500">Izin</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reportData.stats.izin}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-orange-500">Sakit</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reportData.stats.sakit}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-red-500">Alpha</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{reportData.stats.alpha}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Attendance Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Data Absensi</CardTitle>
                    <CardDescription>
                        {reportData?.attendance?.length || 0} record ditemukan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-center text-muted-foreground py-8">Loading...</p>
                    ) : reportData?.attendance?.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Tidak ada data dengan filter yang dipilih</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-left text-sm font-medium">Tanggal</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">NISN</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Nama</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Kelas</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Jam Masuk</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Jam Keluar</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData?.attendance?.map((att: any) => (
                                        <tr key={att.id} className="border-b border-border hover:bg-muted/30">
                                            <td className="px-4 py-3 text-sm">
                                                {formatDate(att.tanggal)}
                                            </td>
                                            <td className="px-4 py-3 text-sm">{att.siswa.nisn}</td>
                                            <td className="px-4 py-3 text-sm">{att.siswa.nama}</td>
                                            <td className="px-4 py-3 text-sm">{att.siswa.kelas?.nama || "-"}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {new Date(att.jamMasuk).toLocaleTimeString("id-ID")}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {att.jamKeluar
                                                    ? new Date(att.jamKeluar).toLocaleTimeString("id-ID")
                                                    : "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs ${att.status === "HADIR"
                                                        ? "bg-green-500/20 text-green-500"
                                                        : att.status === "TERLAMBAT"
                                                            ? "bg-yellow-500/20 text-yellow-500"
                                                            : att.status === "IZIN"
                                                                ? "bg-blue-500/20 text-blue-500"
                                                                : att.status === "SAKIT"
                                                                    ? "bg-orange-500/20 text-orange-500"
                                                                    : "bg-red-500/20 text-red-500"
                                                        }`}
                                                >
                                                    {att.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
