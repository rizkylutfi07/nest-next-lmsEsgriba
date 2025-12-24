"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import {
    Loader2,
    ArrowLeft,
    Users,
    Clock,
    AlertTriangle,
    CheckCircle,
    Eye,
    Search,
    RefreshCw,
    MoreHorizontal,
    Filter,
    Ban,
    ShieldAlert,
    Lock,
    Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useRole } from "../../../role-context";
import { useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MonitoringPage() {
    const { token } = useRole();
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const ujianId = params.id as string;
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [search, setSearch] = useState("");
    const [filterClass, setFilterClass] = useState("ALL");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [blockStudent, setBlockStudent] = useState<string | null>(null);
    const [unblockStudent, setUnblockStudent] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Mutation untuk toggle deteksi kecurangan
    const toggleDetectionMutation = useMutation({
        mutationFn: async (enabled: boolean) => {
            const res = await fetch(`http://localhost:3001/ujian/${ujianId}/toggle-detection`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ enabled }),
            });
            if (!res.ok) throw new Error("Gagal mengubah status deteksi kecurangan");
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["ujian-detail", ujianId] });
            toast({
                title: "Berhasil",
                description: `Deteksi Kecurangan ${data.deteksiKecurangan ? "diaktifkan" : "dinonaktifkan"}`,
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Gagal mengubah status deteksi kecurangan",
                variant: "destructive",
            });
        },
    });

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
            const res = await fetch(
                `http://localhost:3001/ujian-siswa/monitoring/${ujianId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) throw new Error("Failed to fetch students");
            const data = await res.json();
            setLastUpdate(new Date());
            return data;
        },
        refetchInterval: autoRefresh ? 5000 : false,
    });

    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    // Fetch activity logs for selected student
    const { data: activityLogs } = useQuery({
        queryKey: ["activity-logs", selectedStudent?.id],
        queryFn: async () => {
            if (!selectedStudent?.id) return [];
            const res = await fetch(
                `http://localhost:3001/ujian-siswa/activity-logs/${selectedStudent.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
        enabled: !!selectedStudent?.id,
    });

    const getUniqueClasses = () => {
        if (!students) return [];
        const classes = new Set(students.map((s: any) => s.siswa?.kelas?.nama).filter(Boolean));
        return Array.from(classes) as string[];
    };

    const getFilteredStudents = () => {
        if (!students) return [];
        return students.filter((s: any) => {
            const matchesSearch = s.siswa?.nama?.toLowerCase().includes(search.toLowerCase()) ||
                s.siswa?.nisn?.includes(search);
            const matchesClass = filterClass === "ALL" || s.siswa?.kelas?.nama === filterClass;
            const matchesStatus =
                filterStatus === "ALL"
                    ? true
                    : filterStatus === "BLOCKED"
                        ? s.status === "DIBLOKIR"
                        : s.status === filterStatus;

            return matchesSearch && matchesClass && matchesStatus;
        });
    };

    const filteredStudents = getFilteredStudents();
    const getAnsweredCount = (jawaban: any) => {
        if (!jawaban) return 0;
        if (Array.isArray(jawaban)) return jawaban.length;
        if (typeof jawaban === "object") return Object.keys(jawaban).length;
        return 0;
    };

    const stats = {
        total: students?.length || 0,
        belumMulai: students?.filter((s: any) => s.status === "BELUM_MULAI").length || 0,
        sedangDikerjakan: students?.filter((s: any) => s.status === "SEDANG_MENGERJAKAN").length || 0,
        selesai: students?.filter((s: any) => s.status === "SELESAI").length || 0,
        diblokir: students?.filter((s: any) => s.status === "DIBLOKIR").length || 0,
    };

    const handleBlockStudent = async (studentId: string) => {
        try {
            const res = await fetch(`http://localhost:3001/ujian-siswa/${studentId}/block`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Gagal memblokir siswa");
            refetch();
            setBlockStudent(null);
        } catch (error) {
            toast({ title: "Error", description: "Gagal memblokir siswa", variant: "destructive" });
        }
    };

    const handleUnblockStudent = async (studentId: string) => {
        try {
            const res = await fetch(`http://localhost:3001/ujian-siswa/${studentId}/unblock`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Gagal membuka blokir siswa");
            refetch();
            setUnblockStudent(null);
        } catch (error) {
            toast({ title: "Error", description: "Gagal membuka blokir siswa", variant: "destructive" });
        }
    };

    if (ujianLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Monitoring Ujian</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>Pantau progres realtime siswa</span>
                        <span className="w-1 h-1 rounded-full bg-foreground/50" />
                        <span className="text-green-500">
                            Update: {lastUpdate.toLocaleTimeString("id-ID", { hour12: false })}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-card px-4 py-2 rounded-lg text-sm font-medium border border-border sombra-sm">
                        {ujian?.judul}
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                        className="bg-card border-border hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                    >
                        <RefreshCw size={16} className={`mr-2 ${studentsLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Exam Control Card */}
            <Card className="bg-card border-border shadow-sm">
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-foreground">{ujian?.judul || "Ujian"}</h2>
                            <Badge className="text-muted-foreground border-border bg-transparent border">
                                {ujian?.kode ? `#${ujian.kode}` : "No Code"}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-4 bg-muted/50 p-3 rounded-lg border border-border">
                            <div className="flex items-center gap-3">
                                <Switch
                                    checked={ujian?.deteksiKecurangan ?? true}
                                    onCheckedChange={(checked) => toggleDetectionMutation.mutate(checked)}
                                    disabled={toggleDetectionMutation.isPending}
                                />
                                <span className="font-medium text-foreground">Deteksi Kecurangan</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Blokir otomatis saat terdeteksi pelanggaran</span>
                            <Badge className={`ml-auto ${ujian?.deteksiKecurangan ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200 dark:border-green-900" : "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200 dark:border-red-900"}`}>
                                {ujian?.deteksiKecurangan ? "AKTIF" : "NONAKTIF"}
                            </Badge>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard
                    label="TOTAL PESERTA"
                    value={stats.total}
                    subLabel="Jumlah peserta terdaftar"
                    icon={<Users size={20} />}
                    color="purple"
                    active
                />
                <StatCard
                    label="SEDANG BERLANGSUNG"
                    value={stats.sedangDikerjakan}
                    subLabel="Attempt aktif saat ini"
                    icon={<Clock size={20} />}
                    color="cyan"
                />
                <StatCard
                    label="SELESAI"
                    value={stats.selesai}
                    subLabel="Attempt yang sudah selesai"
                    icon={<CheckCircle size={20} />}
                    color="green"
                />
                <StatCard
                    label="DIBLOKIR"
                    value={stats.diblokir}
                    subLabel="Attempt yang diblokir"
                    icon={<Ban size={20} />}
                    color="red"
                />
                <StatCard
                    label="BELUM MULAI"
                    value={stats.belumMulai}
                    subLabel="Siswa belum memulai ujian"
                    icon={<AlertTriangle size={20} />}
                    color="orange"
                />
            </div>

            {/* Student List Section */}
            <Card className="bg-card border-border flex-1 flex flex-col min-h-[500px]">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Status Pengerjaan</h3>
                            <p className="text-sm text-muted-foreground">Daftar attempt siswa diperbarui otomatis setiap 5 detik.</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="text"
                                placeholder="Cari siswa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-muted/50 border border-input rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors placeholder:text-muted-foreground"
                            />
                        </div>
                        <select
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                            className="bg-muted/50 border border-input rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-w-[150px]"
                        >
                            <option value="ALL">Semua Kelas</option>
                            {getUniqueClasses().map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <div className="flex bg-muted/30 rounded-full border border-input p-1 gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilterStatus("ALL")}
                                className={`h-8 px-3 text-xs rounded-full ${filterStatus === "ALL" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                Semua
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFilterStatus("BLOCKED")}
                                className={`h-8 px-3 text-xs rounded-full ${filterStatus === "BLOCKED" ? "bg-red-500/10 text-red-600 dark:text-red-400" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <ShieldAlert size={12} className="mr-1" />
                                Diblokir
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                                    <th className="px-4 py-3">PESERTA</th>
                                    <th className="px-4 py-3">STATUS</th>
                                    <th className="px-4 py-3">PROGRES</th>
                                    <th className="px-4 py-3">AKTIVITAS & PELANGGARAN</th>
                                    <th className="px-4 py-3 text-right">AKSI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredStudents.map((student: any) => {
                                    const totalQuestions = student.ujian?._count?.ujianSoal || 0;
                                    const answeredCount = student.answeredCount ?? getAnsweredCount(student.jawaban);
                                    const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

                                    return (
                                        <tr
                                            key={student.id}
                                            className={`group transition-colors ${student.status === "DIBLOKIR" ? "bg-red-50/80 dark:bg-red-950/30" : "hover:bg-muted/50"}`}
                                        >
                                            <td className="px-4 py-4">
                                                <div>
                                                    <div className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                                        {student.siswa?.nama}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mb-2">{student.siswa?.nisn} | {student.siswa?.email}</div>
                                                    <Badge className="bg-muted text-muted-foreground border-border text-[10px] px-2 py-0.5 pointer-events-none hover:bg-muted">
                                                        {student.siswa?.kelas?.nama}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top">
                                                <StatusPill status={student.status} time={student.waktuMulai} />
                                            </td>
                                            <td className="px-4 py-4 align-top">
                                                <div className="flex items-center justify-between text-xs mb-2">
                                                    <span className="text-muted-foreground">{answeredCount} / {totalQuestions}</span>
                                                    <span className="text-primary font-medium">{progressPercent}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full transition-all duration-500"
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                                <div className="text-[10px] text-muted-foreground mt-2">
                                                    Last active: -
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 align-top">
                                                <div
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-colors ${student.violationCount > 0
                                                        ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                                                        : "bg-muted border-border text-muted-foreground hover:border-foreground/20"
                                                        }`}
                                                    onClick={() => setSelectedStudent(student)}
                                                >
                                                    <ShieldAlert size={12} />
                                                    {student.violationCount} Pelanggaran
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right align-top">
                                                <div className="flex justify-end gap-2">
                                                    {student.status === "SEDANG_MENGERJAKAN" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-300"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleBlockStudent(student.id);
                                                            }}
                                                        >
                                                            <Lock size={14} className="mr-1" />
                                                            Blokir
                                                        </Button>
                                                    )}
                                                    {student.status === "DIBLOKIR" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900 dark:text-green-300"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUnblockStudent(student.id);
                                                            }}
                                                        >
                                                            <Unlock size={14} className="mr-1" />
                                                            Buka blokir
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                                        onClick={() => setSelectedStudent(student)}
                                                        title="Detail"
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>

            {/* Activity Logs Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-2xl max-h-[85vh] overflow-hidden bg-card border-border shadow-2xl flex flex-col">
                        <CardHeader className="border-b border-border bg-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">{selectedStudent.siswa?.nama}</h3>
                                    <p className="text-sm text-muted-foreground">Detail Aktivitas & Log Pengerjaan</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedStudent(null)} className="text-muted-foreground hover:text-foreground">
                                    <ArrowLeft size={20} />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto bg-muted/20 custom-scrollbar">
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-card p-4 rounded-lg border border-border">
                                        <span className="text-xs text-muted-foreground block mb-1">Status</span>
                                        <span className="text-foreground font-medium">{selectedStudent.status}</span>
                                    </div>
                                    <div className="bg-card p-4 rounded-lg border border-border">
                                        <span className="text-xs text-muted-foreground block mb-1">Nilai Sementara</span>
                                        <span className="text-foreground font-medium">{selectedStudent.nilaiTotal || 0}</span>
                                    </div>
                                    <div className="bg-card p-4 rounded-lg border border-border">
                                        <span className="text-xs text-muted-foreground block mb-1">Pelanggaran</span>
                                        <span className="text-red-500 font-medium">{selectedStudent.violationCount}</span>
                                    </div>
                                    <div className="bg-card p-4 rounded-lg border border-border">
                                        <span className="text-xs text-muted-foreground block mb-1">Waktu Mulai</span>
                                        <span className="text-foreground font-medium">
                                            {selectedStudent.waktuMulai ? new Date(selectedStudent.waktuMulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-foreground mb-3 ml-1">Log Aktivitas</h4>
                                    <div className="space-y-2">
                                        {activityLogs?.length === 0 ? (
                                            <div className="text-center py-8 text-muted-foreground bg-card rounded-lg border border-border border-dashed">
                                                Tidak ada aktivitas mencurigakan tercatat
                                            </div>
                                        ) : (
                                            activityLogs?.map((log: any, i: number) => (
                                                <div key={i} className="flex gap-3 p-3 rounded-lg bg-card border border-border">
                                                    <div className="mt-0.5">
                                                        <AlertTriangle size={16} className="text-orange-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <span className="text-sm font-medium text-foreground">{log.activityType}</span>
                                                            <span className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString('id-ID')}</span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            User melakukan aktivitas mencurigakan.
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, subLabel, icon, color, active }: any) {
    const colors: any = {
        purple: "bg-purple-500 text-purple-200",
        cyan: "bg-cyan-500 text-cyan-200",
        green: "bg-emerald-500 text-emerald-200",
        red: "bg-rose-500 text-rose-200",
        orange: "bg-orange-500 text-orange-200",
    };

    const iconColors: any = {
        purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        red: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    };

    return (
        <div className={`p-4 rounded-xl border transition-all ${active ? "bg-card border-primary/50 ring-1 ring-primary/20" : "bg-card/50 border-border hover:bg-card"}`}>
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground">{label}</span>
                <div className={`p-1.5 rounded-lg ${iconColors[color]}`}>
                    {icon}
                </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
            <div className="text-[10px] text-muted-foreground">{subLabel}</div>
        </div>
    );
}

function StatusPill({ status, time }: any) {
    if (status === "BELUM_MULAI") {
        return (
            <div className="space-y-1">
                <div className="inline-flex px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-medium">
                    Belum memulai
                </div>
                <div className="text-[10px] text-muted-foreground pl-1">
                    Belum login / belum klik ujian
                </div>
            </div>
        );
    }
    if (status === "SEDANG_MENGERJAKAN") {
        return (
            <div className="space-y-1">
                <div className="inline-flex px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-medium items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    Sedang Mengerjakan
                </div>
                <div className="text-[10px] text-muted-foreground pl-1">
                    Mulai: {time ? new Date(time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                </div>
            </div>
        );
    }
    if (status === "SELESAI") {
        return (
            <div className="space-y-1">
                <div className="inline-flex px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                    Selesai
                </div>
                <div className="text-[10px] text-muted-foreground pl-1">
                    Sudah submit jawaban
                </div>
            </div>
        );
    }
    if (status === "DIBLOKIR") {
        return (
            <div className="space-y-1">
                <div className="inline-flex px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
                    Diblokir
                </div>
                <div className="text-[10px] text-muted-foreground pl-1">
                    Akses ujian ditutup
                </div>
            </div>
        );
    }
    return <span className="text-muted-foreground text-xs">{status}</span>;
}
