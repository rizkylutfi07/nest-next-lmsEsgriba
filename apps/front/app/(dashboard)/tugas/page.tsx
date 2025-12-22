"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Upload,
    Award,
    TrendingUp,
    Download,
    X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "../role-context";
import { tugasApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const getStatusBadge = (status: string, isLate: boolean) => {
    if (status === "DINILAI") {
        return (
            <Badge tone="success" className="gap-1">
                <CheckCircle2 size={12} />
                Dinilai
            </Badge>
        );
    }
    if (status === "DIKUMPULKAN") {
        return (
            <Badge tone="info" className="gap-1">
                <Upload size={12} />
                Dikumpulkan
            </Badge>
        );
    }
    if (status === "TERLAMBAT") {
        return (
            <Badge tone="warning" className="gap-1">
                <AlertCircle size={12} />
                Terlambat
            </Badge>
        );
    }
    return (
        <Badge tone="warning" className="gap-1">
            <Clock size={12} />
            Belum Dikumpulkan
        </Badge>
    );
};

const getDaysRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: "Lewat deadline", urgent: true };
    if (days === 0) return { text: "Hari ini!", urgent: true };
    if (days === 1) return { text: "Besok", urgent: true };
    if (days <= 3) return { text: `${days} hari lagi`, urgent: true };
    return { text: `${days} hari lagi`, urgent: false };
};

export default function TugasPage() {
    const { role } = useRole();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [selectedTugas, setSelectedTugas] = useState<any>(null);
    const [isSubmitOpen, setIsSubmitOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [submitData, setSubmitData] = useState({
        konten: "",
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // Fetch assignments
    const { data: tugasList = [], isLoading } = useQuery({
        queryKey: ["tugas", "student"],
        queryFn: () => tugasApi.getAll({}),
    });

    // Submit assignment mutation
    const submitMutation = useMutation({
        mutationFn: async ({ tugasId, formData }: { tugasId: string; formData: FormData }) =>
            tugasApi.submit(tugasId, formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tugas"] });
            setIsSubmitOpen(false);
            setSubmitData({ konten: "" });
            setSelectedFiles([]);
            toast({
                title: "Berhasil",
                description: "Tugas berhasil dikumpulkan",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Gagal",
                description: error.message || "Gagal mengumpulkan tugas",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = () => {
        if (!selectedTugas) return;

        const formData = new FormData();
        formData.append("konten", submitData.konten);
        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });

        submitMutation.mutate({ tugasId: selectedTugas.id, formData });
    };

    const handleOpenSubmit = (tugas: any) => {
        setSelectedTugas(tugas);
        setIsSubmitOpen(true);
    };

    const handleOpenDetail = (tugas: any) => {
        setSelectedTugas(tugas);
        setIsDetailOpen(true);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    // For GURU and ADMIN, redirect to management page
    if (role === "GURU" || role === "ADMIN") {
        return (
            <div className="space-y-6">
                <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
                    <CardHeader>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge tone="info" className="gap-2">
                                <FileText size={14} />
                                Kelola Tugas
                            </Badge>
                        </div>
                        <CardTitle className="text-3xl">Manajemen Tugas & PR</CardTitle>
                        <CardDescription className="text-base">
                            Buat tugas baru, pantau pengumpulan, dan beri nilai
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
                            <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
                            <p className="text-lg font-semibold mb-2">Halaman Manajemen Tugas</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Silakan akses halaman Tugas Management untuk mengelola tugas
                            </p>
                            <Button onClick={() => (window.location.href = "/tugas-management")}>
                                Buka Tugas Management
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Student view
    const upcoming = tugasList.filter(
        (t: any) =>
            !t.submissions || t.submissions.length === 0 || t.submissions[0].status === "BELUM_DIKUMPULKAN"
    );
    const submitted = tugasList.filter(
        (t: any) =>
            t.submissions &&
            t.submissions.length > 0 &&
            (t.submissions[0].status === "DIKUMPULKAN" || t.submissions[0].status === "TERLAMBAT")
    );
    const graded = tugasList.filter(
        (t: any) => t.submissions && t.submissions.length > 0 && t.submissions[0].status === "DINILAI"
    );

    const avgScore =
        graded.length > 0
            ? graded.reduce((sum: number, t: any) => sum + (t.submissions[0].score || 0), 0) / graded.length
            : 0;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Memuat data tugas...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
                <CardHeader>
                    <div className="flex flex-wrap items-center gap-3">
                        <Badge tone="info" className="gap-2">
                            <FileText size={14} />
                            Tugas & Pengumpulan
                        </Badge>
                        <Badge tone="success">{tugasList.length} tugas</Badge>
                    </div>
                    <CardTitle className="text-3xl">Daftar Tugas</CardTitle>
                    <CardDescription className="text-base">
                        Kelola dan kumpulkan tugas tepat waktu
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-4">
                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                                <Clock className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{upcoming.length}</p>
                                <p className="text-sm text-muted-foreground">Belum Selesai</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
                                <Upload className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{submitted.length}</p>
                                <p className="text-sm text-muted-foreground">Dikumpulkan</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{graded.length}</p>
                                <p className="text-sm text-muted-foreground">Sudah Dinilai</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                                <Award className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{avgScore.toFixed(0)}</p>
                                <p className="text-sm text-muted-foreground">Rata-rata Nilai</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tugas Tabs */}
            <Tabs defaultValue="upcoming" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="upcoming" className="gap-2">
                        <Clock size={16} />
                        Belum Selesai ({upcoming.length})
                    </TabsTrigger>
                    <TabsTrigger value="submitted" className="gap-2">
                        <Upload size={16} />
                        Dikumpulkan ({submitted.length})
                    </TabsTrigger>
                    <TabsTrigger value="graded" className="gap-2">
                        <CheckCircle2 size={16} />
                        Sudah Dinilai ({graded.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                    {upcoming.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-4" />
                                <p className="text-lg font-semibold mb-2">Semua tugas sudah dikumpulkan!</p>
                                <p className="text-sm text-muted-foreground">
                                    Anda tidak memiliki tugas yang belum dikumpulkan
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        upcoming.map((tugas: any) => {
                            const daysInfo = getDaysRemaining(tugas.deadline);
                            const submission = tugas.submissions?.[0];
                            return (
                                <Card
                                    key={tugas.id}
                                    className="group transition-all hover:shadow-lg hover:shadow-primary/10"
                                >
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <CardTitle className="text-xl">{tugas.judul}</CardTitle>
                                                    {getStatusBadge(
                                                        submission?.status || "BELUM_DIKUMPULKAN",
                                                        submission?.status === "TERLAMBAT"
                                                    )}
                                                </div>
                                                <CardDescription>{tugas.deskripsi}</CardDescription>
                                            </div>
                                            <div
                                                className={cn(
                                                    "flex flex-col items-end gap-1 rounded-lg border px-3 py-2",
                                                    daysInfo.urgent
                                                        ? "border-red-500/50 bg-red-500/10"
                                                        : "border-blue-500/50 bg-blue-500/10"
                                                )}
                                            >
                                                <p
                                                    className={cn(
                                                        "text-lg font-bold",
                                                        daysInfo.urgent ? "text-red-500" : "text-blue-500"
                                                    )}
                                                >
                                                    {daysInfo.text}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(tugas.deadline).toLocaleDateString("id-ID")}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <FileText size={14} className="text-muted-foreground" />
                                                <span>{tugas.mataPelajaran?.nama}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <TrendingUp size={14} className="text-muted-foreground" />
                                                <span>Max: {tugas.maxScore} poin</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-muted-foreground" />
                                                <span>
                                                    {new Date(tugas.deadline).toLocaleTimeString("id-ID", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Button className="gap-2" onClick={() => handleOpenSubmit(tugas)}>
                                                <Upload size={16} />
                                                Kumpulkan Tugas
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="gap-2"
                                                onClick={() => handleOpenDetail(tugas)}
                                            >
                                                Lihat Detail
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </TabsContent>

                <TabsContent value="submitted" className="space-y-4">
                    {submitted.map((tugas: any) => {
                        const submission = tugas.submissions[0];
                        return (
                            <Card key={tugas.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-xl">{tugas.judul}</CardTitle>
                                                {getStatusBadge(
                                                    submission.status,
                                                    submission.status === "TERLAMBAT"
                                                )}
                                            </div>
                                            <CardDescription>{tugas.deskripsi}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                                        <p className="text-sm text-green-600 dark:text-green-400">
                                            ✓ Dikumpulkan pada{" "}
                                            {new Date(submission.submittedAt).toLocaleString("id-ID")}
                                        </p>
                                        {submission.konten && (
                                            <p className="text-sm mt-2 p-2 bg-background/50 rounded">
                                                {submission.konten}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => handleOpenDetail(tugas)}>
                                            Lihat Detail
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>

                <TabsContent value="graded" className="space-y-4">
                    {graded.map((tugas: any) => {
                        const submission = tugas.submissions[0];
                        return (
                            <Card key={tugas.id} className="border-green-500/30">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-xl">{tugas.judul}</CardTitle>
                                                {getStatusBadge(submission.status, false)}
                                            </div>
                                            <CardDescription>{tugas.deskripsi}</CardDescription>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-primary bg-primary/10 px-4 py-3">
                                            <Award size={24} className="text-primary" />
                                            <p className="text-3xl font-bold text-primary">
                                                {submission.score}
                                            </p>
                                            <p className="text-xs text-muted-foreground">/ {tugas.maxScore}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {submission.feedback && (
                                        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3">
                                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                Feedback Guru:
                                            </p>
                                            <p className="mt-1 text-sm">{submission.feedback}</p>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <span>
                                            Dikumpulkan:{" "}
                                            {new Date(submission.submittedAt).toLocaleDateString("id-ID")}
                                        </span>
                                        <span>•</span>
                                        <span>{tugas.mataPelajaran?.nama}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </TabsContent>
            </Tabs>

            {/* Submit Dialog */}
            <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Kumpulkan Tugas</DialogTitle>
                        <DialogDescription>{selectedTugas?.judul}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Jawaban / Catatan (Opsional)</Label>
                            <Textarea
                                value={submitData.konten}
                                onChange={(e) => setSubmitData({ ...submitData, konten: e.target.value })}
                                placeholder="Tulis jawaban atau catatan Anda di sini..."
                                rows={6}
                            />
                        </div>

                        <div>
                            <Label>Upload File (Opsional, Max 5 files)</Label>
                            <Input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    if (files.length + selectedFiles.length > 5) {
                                        toast({
                                            title: "Peringatan",
                                            description: "Maksimal 5 file",
                                            variant: "destructive",
                                        });
                                        return;
                                    }
                                    setSelectedFiles([...selectedFiles, ...files]);
                                }}
                            />

                            {selectedFiles.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-muted rounded"
                                        >
                                            <span className="text-sm truncate flex-1">{file.name}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeFile(index)}
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                            <p className="text-sm text-amber-600 dark:text-amber-400">
                                ⚠️ Pastikan file dan jawaban Anda sudah benar sebelum mengumpulkan.
                                {selectedTugas?.allowLateSubmit &&
                                    " Anda dapat mengumpulkan kembali jika ada perubahan."}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleSubmit}
                                disabled={
                                    submitMutation.isPending ||
                                    (!submitData.konten && selectedFiles.length === 0)
                                }
                                className="flex-1"
                            >
                                {submitMutation.isPending ? "Mengumpulkan..." : "Kumpulkan Tugas"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsSubmitOpen(false);
                                    setSubmitData({ konten: "" });
                                    setSelectedFiles([]);
                                }}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedTugas?.judul}</DialogTitle>
                        <DialogDescription>
                            {selectedTugas?.mataPelajaran?.nama} •{" "}
                            {selectedTugas?.kelas?.nama || "Semua Kelas"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Deskripsi</h4>
                            <p className="text-sm text-muted-foreground">{selectedTugas?.deskripsi}</p>
                        </div>

                        {selectedTugas?.instruksi && (
                            <div>
                                <h4 className="font-semibold mb-2">Instruksi</h4>
                                <p className="text-sm text-muted-foreground">{selectedTugas.instruksi}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2">Deadline</h4>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(selectedTugas?.deadline || "").toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Nilai Maksimal</h4>
                                <p className="text-sm text-muted-foreground">
                                    {selectedTugas?.maxScore} poin
                                </p>
                            </div>
                        </div>

                        {selectedTugas?.attachments && selectedTugas.attachments.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">Lampiran dari Guru</h4>
                                <div className="space-y-2">
                                    {selectedTugas.attachments.map((file: any) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Download size={16} />
                                                <span className="text-sm">{file.namaFile}</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    // Download file logic
                                                    const url = `${process.env.NEXT_PUBLIC_API_URL}/uploads/tugas/${file.urlFile}`;
                                                    window.open(url, "_blank");
                                                }}
                                            >
                                                Download
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button onClick={() => setIsDetailOpen(false)} className="w-full">
                            Tutup
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
