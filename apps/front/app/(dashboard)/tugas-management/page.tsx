"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    FileText,
    Plus,
    Edit,
    Trash2,
    Eye,
    Users,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    Upload,
    Download,
    Award,
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
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    tugasApi,
    mataPelajaranApi,
    kelasApi,
    guruApi,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { useRole } from "../role-context";
import { useToast } from "@/hooks/use-toast";
import { DeleteAlertDialog } from "@/components/DeleteAlertDialog";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";

export default function TugasManagementPage() {
    const { role } = useRole();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
    const [isGradingOpen, setIsGradingOpen] = useState(false);
    const [selectedTugas, setSelectedTugas] = useState<any>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [filterSubject, setFilterSubject] = useState("");
    const [filterClass, setFilterClass] = useState("");

    // Form states
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        instruksi: "",
        mataPelajaranId: "",
        kelasId: "",
        guruId: "", // Added for ADMIN
        deadline: "",
        maxScore: 100,
        allowLateSubmit: false,
        isPublished: true,
    });
    const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);

    // Grading form
    const [gradeData, setGradeData] = useState({
        score: 0,
        feedback: "",
    });

    // Fetch tugas created by current guru
    const { data: tugasList = [], isLoading } = useQuery({
        queryKey: ["tugas", "my-assignments"],
        queryFn: () => tugasApi.getAll({ myAssignments: "true" }),
    });

    // Fetch mata pelajaran (filtered by guru if role is GURU)
    const { data: mataPelajaranResponse, error: mataPelajaranError, isError: isMataPelajaranError } = useQuery({
        queryKey: ["mata-pelajaran", role],
        queryFn: async () => {
            const params = {
                limit: 100,
                ...(role === "GURU" ? { mySubjects: "true" } : {})
            };
            console.log('[FRONTEND] Fetching mata pelajaran with params:', params);
            console.log('[FRONTEND] Role:', role);
            try {
                const result = await mataPelajaranApi.getAll(params);
                console.log('[FRONTEND] Mata pelajaran result:', result);
                return result;
            } catch (error) {
                console.error('[FRONTEND] Error fetching mata pelajaran:', error);
                throw error;
            }
        },
        staleTime: 0, // Disable cache for debugging
        gcTime: 0,
    });

    if (isMataPelajaranError) {
        console.error('[FRONTEND] Mata pelajaran query error:', mataPelajaranError);
    }

    const mataPelajaranList = Array.isArray(mataPelajaranResponse)
        ? mataPelajaranResponse
        : (mataPelajaranResponse?.data || []);

    console.log('[FRONTEND] Final mataPelajaranList:', mataPelajaranList);

    // Fetch kelas
    const { data: kelasResponse } = useQuery({
        queryKey: ["kelas"],
        queryFn: () => kelasApi.getAll({ limit: 100 }),
    });
    const kelasList = Array.isArray(kelasResponse)
        ? kelasResponse
        : (kelasResponse?.data || []);

    // Fetch guru list (for ADMIN)
    const { data: guruResponse } = useQuery({
        queryKey: ["guru"],
        queryFn: () => guruApi.getAll({ limit: 100 }),
        enabled: role === "ADMIN",
    });
    const guruList = Array.isArray(guruResponse)
        ? guruResponse
        : (guruResponse?.data || []);

    // Fetch guru detail with mata pelajaran when guru is selected (for ADMIN)
    const { data: selectedGuru } = useQuery({
        queryKey: ["guru-detail", formData.guruId],
        queryFn: () => guruApi.getById(formData.guruId),
        enabled: role === "ADMIN" && !!formData.guruId,
    });

    // Create tugas mutation
    const createMutation = useMutation({
        mutationFn: async (data: FormData) => tugasApi.createWithFiles(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tugas"] });
            setIsCreateOpen(false);
            resetForm();
            toast({
                title: "Berhasil",
                description: "Tugas berhasil dibuat",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Gagal",
                description: error.message || "Gagal membuat tugas",
                variant: "destructive",
            });
        },
    });

    // Update tugas mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) =>
            tugasApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tugas"] });
            setIsEditOpen(false);
            resetForm();
            toast({
                title: "Berhasil",
                description: "Tugas berhasil diupdate",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Gagal",
                description: error.message || "Gagal mengupdate tugas",
                variant: "destructive",
            });
        },
    });

    // Delete tugas mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => tugasApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tugas"] });
            toast({
                title: "Berhasil",
                description: "Tugas berhasil dihapus",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Gagal",
                description: error.message || "Gagal menghapus tugas",
                variant: "destructive",
            });
        },
    });

    // Grade submission mutation
    const gradeMutation = useMutation({
        mutationFn: async ({
            tugasId,
            siswaId,
            score,
            feedback,
        }: {
            tugasId: string;
            siswaId: string;
            score: number;
            feedback?: string;
        }) => tugasApi.grade(tugasId, siswaId, { score, feedback }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["submissions"] });
            setIsGradingOpen(false);
            setGradeData({ score: 0, feedback: "" });
            toast({
                title: "Berhasil",
                description: "Nilai berhasil diberikan",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Gagal",
                description: error.message || "Gagal memberi nilai",
                variant: "destructive",
            });
        },
    });

    const resetForm = () => {
        setFormData({
            judul: "",
            deskripsi: "",
            instruksi: "",
            mataPelajaranId: "",
            kelasId: "",
            guruId: "",
            deadline: "",
            maxScore: 100,
            allowLateSubmit: false,
            isPublished: true,
        });
        setAttachmentFiles([]);
    };

    const handleCreate = () => {
        // Validate required fields
        if (!formData.judul || !formData.mataPelajaranId || !formData.deadline) {
            toast({
                title: "Error",
                description: "Harap isi semua field yang wajib",
                variant: "destructive",
            });
            return;
        }

        // For ADMIN, ensure guruId is selected
        if (role === "ADMIN" && !formData.guruId) {
            toast({
                title: "Error",
                description: "Harap pilih guru pengampu",
                variant: "destructive",
            });
            return;
        }

        const data = new FormData();

        // Add required fields
        data.append("judul", formData.judul);
        data.append("deskripsi", formData.deskripsi);
        data.append("instruksi", formData.instruksi);
        data.append("mataPelajaranId", formData.mataPelajaranId);
        data.append("deadline", formData.deadline);
        data.append("maxScore", formData.maxScore.toString());
        data.append("allowLateSubmit", formData.allowLateSubmit.toString());
        data.append("isPublished", formData.isPublished.toString());

        // Add optional kelasId only if valid (not empty and not 'all')
        if (formData.kelasId && formData.kelasId !== 'all') {
            data.append("kelasId", formData.kelasId);
        }

        // Add optional guruId only if valid (for ADMIN)
        if (formData.guruId && formData.guruId !== '') {
            data.append("guruId", formData.guruId);
        }

        // Add attachments
        attachmentFiles.forEach((file) => {
            data.append("attachments", file);
        });

        createMutation.mutate(data);
    };

    const handleEdit = (tugas: any) => {
        setSelectedTugas(tugas);

        // Convert deadline to local datetime-local format (YYYY-MM-DDTHH:mm)
        const deadlineDate = new Date(tugas.deadline);
        const localDeadline = new Date(deadlineDate.getTime() - deadlineDate.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);

        setFormData({
            judul: tugas.judul,
            deskripsi: tugas.deskripsi,
            instruksi: tugas.instruksi || "",
            mataPelajaranId: tugas.mataPelajaranId,
            // Convert 'all' or empty strings to undefined for optional foreign key fields
            kelasId: (tugas.kelasId === 'all' || tugas.kelasId === '') ? '' : tugas.kelasId,
            guruId: (tugas.guruId === 'all' || tugas.guruId === '') ? '' : tugas.guruId,
            deadline: localDeadline,
            maxScore: tugas.maxScore,
            allowLateSubmit: tugas.allowLateSubmit,
            isPublished: tugas.isPublished,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedTugas) return;
        // Exclude guruId from update payload as it's not allowed by the backend
        const { guruId, ...updateData } = formData;
        updateMutation.mutate({
            id: selectedTugas.id,
            data: updateData,
        });
    };

    const handleDelete = (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleViewSubmissions = async (tugas: any) => {
        setSelectedTugas(tugas);
        setIsSubmissionsOpen(true);
    };

    const handleGrade = (submission: any) => {
        setSelectedSubmission(submission);
        setGradeData({
            score: submission.score || 0,
            feedback: submission.feedback || "",
        });
        setIsGradingOpen(true);
    };

    const submitGrade = () => {
        if (!selectedTugas || !selectedSubmission) return;
        gradeMutation.mutate({
            tugasId: selectedTugas.id,
            siswaId: selectedSubmission.siswaId,
            score: gradeData.score,
            feedback: gradeData.feedback,
        });
    };

    // Filter tugas
    const filteredTugas = tugasList.filter((tugas: any) => {
        if (filterSubject && filterSubject !== 'all' && tugas.mataPelajaranId !== filterSubject) return false;
        if (filterClass && filterClass !== 'all' && tugas.kelasId !== filterClass) return false;
        return true;
    });

    const getStatusBadge = (deadline: string) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const isPast = now > deadlineDate;

        if (isPast) {
            return <Badge tone="warning">Berakhir</Badge>;
        }

        const daysLeft = Math.ceil(
            (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysLeft <= 3) {
            return (
                <Badge tone="warning" className="gap-1">
                    <Clock size={12} />
                    {daysLeft} hari lagi
                </Badge>
            );
        }

        return (
            <Badge tone="info" className="gap-1">
                <Calendar size={12} />
                Aktif
            </Badge>
        );
    };

    // Only accessible for GURU and ADMIN
    if (role !== "GURU" && role !== "ADMIN") {
        return (
            <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
                <h2 className="text-2xl font-bold mb-2">Akses Ditolak</h2>
                <p className="text-muted-foreground">
                    Halaman ini hanya dapat diakses oleh Guru dan Admin.
                </p>
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
                            Manajemen Tugas
                        </Badge>
                        <Badge tone="success">{filteredTugas.length} tugas</Badge>
                    </div>
                    <CardTitle className="text-3xl">Kelola Tugas & PR</CardTitle>
                    <CardDescription className="text-base">
                        Buat, edit, dan kelola tugas untuk siswa
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-blue-500/20 flex-shrink-0">
                                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl sm:text-2xl font-bold truncate">{tugasList.length}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">Total Tugas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-green-500/20 flex-shrink-0">
                                <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl sm:text-2xl font-bold truncate">
                                    {
                                        tugasList.filter((t: any) => new Date(t.deadline) > new Date())
                                            .length
                                    }
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">Aktif</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-amber-500/20 flex-shrink-0">
                                <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl sm:text-2xl font-bold truncate">
                                    {tugasList.reduce((sum: number, t: any) => sum + (t._count?.submissions || 0), 0)}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">Pengumpulan</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-purple-500/20 flex-shrink-0">
                                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl sm:text-2xl font-bold truncate">
                                    {
                                        tugasList.filter(
                                            (t: any) => t._count?.submissions > 0
                                        ).length
                                    }
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">Ada Pengumpulan</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Create Button */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Select value={filterSubject} onValueChange={setFilterSubject}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Semua Mata Pelajaran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                                {mataPelajaranList.map((mp: any) => (
                                    <SelectItem key={mp.id} value={mp.id}>
                                        {mp.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={filterClass} onValueChange={setFilterClass}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Semua Kelas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kelas</SelectItem>
                                {kelasList.map((kelas: any) => (
                                    <SelectItem key={kelas.id} value={kelas.id}>
                                        {kelas.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="sm:ml-auto">
                            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="gap-2 w-full sm:w-auto">
                                        <Plus size={16} />
                                        Buat Tugas Baru
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Buat Tugas Baru</DialogTitle>
                                        <DialogDescription>
                                            Isi form di bawah untuk membuat tugas baru
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Judul Tugas</Label>
                                            <Input
                                                value={formData.judul}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, judul: e.target.value })
                                                }
                                                placeholder="Contoh: Tugas Algoritma Sorting"
                                            />
                                        </div>

                                        <div>
                                            <Label>Deskripsi</Label>
                                            <Textarea
                                                value={formData.deskripsi}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, deskripsi: e.target.value })
                                                }
                                                placeholder="Deskripsi tugas..."
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <Label>Instruksi (Opsional)</Label>
                                            <Textarea
                                                value={formData.instruksi}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, instruksi: e.target.value })
                                                }
                                                placeholder="Instruksi pengerjaan..."
                                                rows={3}
                                            />
                                        </div>

                                        {/* Guru Selection - Only for ADMIN */}
                                        {role === "ADMIN" && (
                                            <div>
                                                <Label>Guru Pengampu *</Label>
                                                <SearchableSelect
                                                    options={guruList.map((guru: any) => ({
                                                        value: guru.id,
                                                        label: guru.nama,
                                                        description: guru.email,
                                                    }))}
                                                    value={formData.guruId}
                                                    onChange={(value) =>
                                                        setFormData({
                                                            ...formData,
                                                            guruId: value,
                                                            mataPelajaranId: "", // Reset mata pelajaran when guru changes
                                                        })
                                                    }
                                                    placeholder="Pilih guru"
                                                    searchPlaceholder="Cari guru..."
                                                />
                                                {!formData.guruId && (
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Pilih guru terlebih dahulu untuk melihat mata pelajaran
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Mata Pelajaran</Label>
                                                {/* For ADMIN: show only guru's mata pelajaran */}
                                                {role === "ADMIN" ? (
                                                    formData.guruId && selectedGuru?.mataPelajaran ? (
                                                        <SearchableSelect
                                                            options={selectedGuru.mataPelajaran.map((mp: any) => ({
                                                                value: mp.id,
                                                                label: mp.nama,
                                                                description: mp.kode,
                                                            }))}
                                                            value={formData.mataPelajaranId}
                                                            onChange={(value) =>
                                                                setFormData({ ...formData, mataPelajaranId: value })
                                                            }
                                                            placeholder="Pilih mata pelajaran"
                                                            searchPlaceholder="Cari mata pelajaran..."
                                                        />
                                                    ) : (
                                                        <div className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                                                            {formData.guruId ? "Memuat mata pelajaran..." : "Pilih guru terlebih dahulu"}
                                                        </div>
                                                    )
                                                ) : (
                                                    /* For GURU: show all mata pelajaran */
                                                    <SearchableSelect
                                                        options={mataPelajaranList.map((mp: any) => ({
                                                            value: mp.id,
                                                            label: mp.nama,
                                                            description: mp.kode,
                                                        }))}
                                                        value={formData.mataPelajaranId}
                                                        onChange={(value) =>
                                                            setFormData({ ...formData, mataPelajaranId: value })
                                                        }
                                                        placeholder="Pilih mata pelajaran"
                                                        searchPlaceholder="Cari mata pelajaran..."
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <Label>Kelas (Opsional)</Label>
                                                <SearchableSelect
                                                    options={[
                                                        { value: 'all', label: 'Semua Kelas' },
                                                        ...kelasList.map((kelas: any) => ({
                                                            value: kelas.id,
                                                            label: kelas.nama,
                                                            description: `${kelas.tingkat} - ${kelas.jurusan || 'Umum'}`,
                                                        }))
                                                    ]}
                                                    value={formData.kelasId || 'all'}
                                                    onChange={(value) =>
                                                        setFormData({ ...formData, kelasId: value })
                                                    }
                                                    placeholder="Semua kelas"
                                                    searchPlaceholder="Cari kelas..."
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Deadline</Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.deadline}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, deadline: e.target.value })
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <Label>Nilai Maksimal</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.maxScore}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            maxScore: parseInt(e.target.value) || 100,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Lampiran (Opsional)</Label>
                                            <Input
                                                type="file"
                                                multiple
                                                onChange={(e) =>
                                                    setAttachmentFiles(Array.from(e.target.files || []))
                                                }
                                                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                                            />
                                            {attachmentFiles.length > 0 && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {attachmentFiles.length} file dipilih
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.allowLateSubmit}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            allowLateSubmit: e.target.checked,
                                                        })
                                                    }
                                                />
                                                <span className="text-sm">Izinkan pengumpulan terlambat</span>
                                            </label>

                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isPublished}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            isPublished: e.target.checked,
                                                        })
                                                    }
                                                />
                                                <span className="text-sm">Publikasikan sekarang</span>
                                            </label>
                                        </div>

                                        <div className="flex gap-2 pt-4">
                                            <Button
                                                onClick={handleCreate}
                                                disabled={createMutation.isPending}
                                                className="flex-1"
                                            >
                                                {createMutation.isPending ? "Membuat..." : "Buat Tugas"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setIsCreateOpen(false);
                                                    resetForm();
                                                }}
                                                className="flex-1"
                                            >
                                                Batal
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tugas List */}
            <div className="space-y-4">
                {isLoading ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">Memuat data...</p>
                        </CardContent>
                    </Card>
                ) : filteredTugas.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-lg font-semibold mb-2">Belum ada tugas</p>
                            <p className="text-sm text-muted-foreground mb-4">
                                Klik tombol "Buat Tugas Baru" untuk membuat tugas pertama Anda
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredTugas.map((tugas: any) => (
                        <Card
                            key={tugas.id}
                            className="group hover:shadow-lg transition-all hover:shadow-primary/10"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CardTitle className="text-xl">{tugas.judul}</CardTitle>
                                            {getStatusBadge(tugas.deadline)}
                                            {!tugas.isPublished && (
                                                <Badge tone="info">Draft</Badge>
                                            )}
                                        </div>
                                        <CardDescription>{tugas.deskripsi}</CardDescription>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleViewSubmissions(tugas)}
                                        >
                                            <Eye size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(tugas)}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(tugas.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FileText size={14} className="text-muted-foreground" />
                                        <span>{tugas.mataPelajaran?.nama}</span>
                                    </div>
                                    {tugas.kelas && (
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-muted-foreground" />
                                            <span>{tugas.kelas.nama}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-muted-foreground" />
                                        <span>
                                            Deadline:{" "}
                                            {new Date(tugas.deadline).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award size={14} className="text-muted-foreground" />
                                        <span>Max: {tugas.maxScore} poin</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Upload size={14} className="text-muted-foreground" />
                                        <span>
                                            {tugas._count?.submissions || 0} pengumpulan
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Submissions Dialog */}
            <Dialog open={isSubmissionsOpen} onOpenChange={setIsSubmissionsOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">Pengumpulan: {selectedTugas?.judul}</DialogTitle>
                        <DialogDescription className="text-sm">
                            Daftar siswa yang telah mengumpulkan tugas
                        </DialogDescription>
                    </DialogHeader>
                    <SubmissionsView
                        tugasId={selectedTugas?.id}
                        onGrade={handleGrade}
                    />
                </DialogContent>
            </Dialog>

            {/* Grading Dialog */}
            <Dialog open={isGradingOpen} onOpenChange={setIsGradingOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Beri Nilai</DialogTitle>
                        <DialogDescription>
                            Siswa: {selectedSubmission?.siswa?.nama}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Nilai (0 - {selectedTugas?.maxScore || 100})</Label>
                            <Input
                                type="number"
                                value={gradeData.score}
                                onChange={(e) =>
                                    setGradeData({
                                        ...gradeData,
                                        score: parseInt(e.target.value) || 0,
                                    })
                                }
                                max={selectedTugas?.maxScore || 100}
                                min={0}
                            />
                        </div>

                        <div>
                            <Label>Feedback (Opsional)</Label>
                            <Textarea
                                value={gradeData.feedback}
                                onChange={(e) =>
                                    setGradeData({ ...gradeData, feedback: e.target.value })
                                }
                                placeholder="Tulis feedback untuk siswa..."
                                rows={4}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={submitGrade}
                                disabled={gradeMutation.isPending}
                                className="flex-1"
                            >
                                {gradeMutation.isPending ? "Menyimpan..." : "Simpan Nilai"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsGradingOpen(false)}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog - Similar to Create but with update */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Tugas</DialogTitle>
                        <DialogDescription>
                            Update informasi tugas
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Judul Tugas</Label>
                            <Input
                                value={formData.judul}
                                onChange={(e) =>
                                    setFormData({ ...formData, judul: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <Label>Deskripsi</Label>
                            <Textarea
                                value={formData.deskripsi}
                                onChange={(e) =>
                                    setFormData({ ...formData, deskripsi: e.target.value })
                                }
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label>Instruksi</Label>
                            <Textarea
                                value={formData.instruksi}
                                onChange={(e) =>
                                    setFormData({ ...formData, instruksi: e.target.value })
                                }
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Mata Pelajaran</Label>
                                <Select
                                    value={formData.mataPelajaranId}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, mataPelajaranId: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mataPelajaranList.map((mp: any) => (
                                            <SelectItem key={mp.id} value={mp.id}>
                                                {mp.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Kelas</Label>
                                <Select
                                    value={formData.kelasId || "all"}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, kelasId: value === "all" ? "" : value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kelas</SelectItem>
                                        {kelasList.map((kelas: any) => (
                                            <SelectItem key={kelas.id} value={kelas.id}>
                                                {kelas.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Deadline</Label>
                                <Input
                                    type="datetime-local"
                                    value={formData.deadline}
                                    onChange={(e) =>
                                        setFormData({ ...formData, deadline: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <Label>Nilai Maksimal</Label>
                                <Input
                                    type="number"
                                    value={formData.maxScore}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            maxScore: parseInt(e.target.value) || 100,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.allowLateSubmit}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            allowLateSubmit: e.target.checked,
                                        })
                                    }
                                />
                                <span className="text-sm">Izinkan pengumpulan terlambat</span>
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isPublished}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            isPublished: e.target.checked,
                                        })
                                    }
                                />
                                <span className="text-sm">Publikasikan</span>
                            </label>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                onClick={handleUpdate}
                                disabled={updateMutation.isPending}
                                className="flex-1"
                            >
                                {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsEditOpen(false);
                                    resetForm();
                                }}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Submissions View Component
function SubmissionsView({
    tugasId,
    onGrade,
}: {
    tugasId: string;
    onGrade: (submission: any) => void;
}) {
    const { data: submissions = [], isLoading } = useQuery({
        queryKey: ["submissions", tugasId],
        queryFn: () => tugasApi.getSubmissions(tugasId),
        enabled: !!tugasId,
    });

    if (isLoading) {
        return <p className="text-center py-4">Memuat data...</p>;
    }

    if (submissions.length === 0) {
        return (
            <div className="text-center py-8">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-semibold mb-2">Belum ada pengumpulan</p>
                <p className="text-sm text-muted-foreground">
                    Siswa belum ada yang mengumpulkan tugas ini
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {submissions.map((submission: any) => (
                <Card key={submission.id}>
                    <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                        <div className="space-y-3">
                            {/* Header with name and badges */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-sm sm:text-base truncate">{submission.siswa.nama}</p>
                                <Badge tone="info" className="text-xs">{submission.siswa.nisn}</Badge>
                                <Badge
                                    tone={
                                        submission.status === "DINILAI"
                                            ? "success"
                                            : submission.status === "TERLAMBAT"
                                                ? "warning"
                                                : "info"
                                    }
                                    className="text-xs"
                                >
                                    {submission.status}
                                </Badge>
                            </div>

                            {/* Info */}
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Kelas: {submission.siswa.kelas?.nama}
                            </p>
                            {submission.submittedAt && (
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Dikumpulkan:{" "}
                                    {new Date(submission.submittedAt).toLocaleString("id-ID")}
                                </p>
                            )}

                            {/* Konten */}
                            {submission.konten && (
                                <p className="text-xs sm:text-sm p-3 bg-muted rounded-lg">
                                    {submission.konten}
                                </p>
                            )}

                            {/* Files */}
                            {submission.files && submission.files.length > 0 && (
                                <div>
                                    <p className="text-xs sm:text-sm font-semibold mb-2">
                                        File Pengumpulan ({submission.files.length}):
                                    </p>
                                    <div className="space-y-2">
                                        {submission.files.map((file: any) => {
                                            const fileUrl = `http://localhost:3001/uploads/submissions/${file.urlFile}`;
                                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.namaFile);
                                            const isPdf = /\.pdf$/i.test(file.namaFile);
                                            const canPreview = isImage || isPdf;

                                            return (
                                                <div
                                                    key={file.id}
                                                    className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 bg-muted/50 rounded"
                                                >
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <Download size={14} className="flex-shrink-0" />
                                                        <div className="flex flex-col min-w-0 flex-1">
                                                            <span className="text-xs sm:text-sm truncate">{file.namaFile}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {(file.ukuranFile / 1024).toFixed(1)} KB
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 sm:gap-1">
                                                        {canPreview && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 px-3 text-xs flex-1 sm:flex-none"
                                                                onClick={() => window.open(fileUrl, "_blank")}
                                                            >
                                                                Lihat
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-3 text-xs flex-1 sm:flex-none"
                                                            onClick={() => {
                                                                const link = document.createElement('a');
                                                                link.href = fileUrl;
                                                                link.download = file.namaFile;
                                                                link.click();
                                                            }}
                                                        >
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Score/Feedback */}
                            {submission.score !== null && submission.score !== undefined && (
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        Nilai: {submission.score}
                                    </p>
                                    {submission.feedback && (
                                        <p className="text-sm mt-1">{submission.feedback}</p>
                                    )}
                                </div>
                            )}

                            {/* Grade Button - moved to bottom */}
                            <Button
                                size="sm"
                                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all"
                                onClick={() => onGrade(submission)}
                            >
                                <Award size={16} />
                                {submission.status === "DINILAI" ? "Edit Nilai" : "Beri Nilai"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
