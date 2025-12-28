"use client";
import { API_URL } from "@/lib/api";

import { useState, useEffect, use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Search, Filter, Users, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useRole } from "../../../role-context";
import { useToast } from "@/hooks/use-toast";

export default function EditUjianPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { token } = useRole();
    const { toast } = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();

    // Basic Form Data
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        mataPelajaranId: "",
        guruId: "",
        paketSoalId: "",
        durasi: 60,
        tanggalMulai: "",
        tanggalSelesai: "",
        nilaiMinimal: 70,
        acakSoal: true,
        tampilkanNilai: false,
    });

    // Selection State
    const [kelasIds, setKelasIds] = useState<string[]>([]);
    const [siswaIds, setSiswaIds] = useState<string[]>([]);

    // Student Filtering State
    const [targetPeserta, setTargetPeserta] = useState<"ALL_CLASS" | "SPECIFIC">("ALL_CLASS");
    const [filterAgama, setFilterAgama] = useState<string>("ALL");
    const [searchStudent, setSearchStudent] = useState("");

    // Fetch existing ujian data
    const { data: ujianData, isLoading: isLoadingUjian } = useQuery({
        queryKey: ["ujian-edit", id],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/ujian/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to load ujian");
            return res.json();
        },
        enabled: !!id && !!token,
    });

    // Initialize form data when ujian data is loaded
    useEffect(() => {
        if (ujianData) {
            const formatDateTimeLocal = (dateStr: string) => {
                if (!dateStr) return "";
                const date = new Date(dateStr);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const hours = String(date.getHours()).padStart(2, "0");
                const minutes = String(date.getMinutes()).padStart(2, "0");
                return `${year}-${month}-${day}T${hours}:${minutes}`;
            };

            setFormData({
                judul: ujianData.judul || "",
                deskripsi: ujianData.deskripsi || "",
                mataPelajaranId: ujianData.mataPelajaranId || "",
                guruId: ujianData.guruId || "",
                paketSoalId: ujianData.paketSoalId || "",
                durasi: ujianData.durasi || 60,
                tanggalMulai: formatDateTimeLocal(ujianData.tanggalMulai),
                tanggalSelesai: formatDateTimeLocal(ujianData.tanggalSelesai),
                nilaiMinimal: ujianData.nilaiMinimal || 70,
                acakSoal: ujianData.acakSoal ?? true,
                tampilkanNilai: ujianData.tampilkanNilai ?? false,
            });

            // Set kelasIds from ujianKelas relation
            if (ujianData.ujianKelas && ujianData.ujianKelas.length > 0) {
                setKelasIds(ujianData.ujianKelas.map((uk: any) => uk.kelasId));
            } else if (ujianData.kelasId) {
                setKelasIds([ujianData.kelasId]);
            }
        }
    }, [ujianData]);

    // Fetch guru
    const { data: guruList } = useQuery({
        queryKey: ["guru-list"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/guru?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    // Fetch guru detail with mata pelajaran when guru is selected
    const { data: selectedGuru } = useQuery({
        queryKey: ["guru-detail", formData.guruId],
        queryFn: async () => {
            if (!formData.guruId) return null;
            const res = await fetch(`${API_URL}/guru/${formData.guruId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        enabled: !!formData.guruId,
    });

    // Fetch kelas
    const { data: kelasList } = useQuery({
        queryKey: ["kelas-list"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/kelas?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    // Fetch paket soal
    const { data: paketSoalList } = useQuery({
        queryKey: ["paket-soal-list", formData.mataPelajaranId],
        queryFn: async () => {
            const params = new URLSearchParams({ limit: "100" });
            if (formData.mataPelajaranId) {
                params.append("mataPelajaranId", formData.mataPelajaranId);
            }
            const res = await fetch(
                `${API_URL}/paket-soal?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
    });

    // Fetch students based on selected classes
    const { data: studentsList, isLoading: isLoadingStudents } = useQuery({
        queryKey: ["students-by-classes", kelasIds],
        queryFn: async () => {
            if (kelasIds.length === 0) return [];

            const params = new URLSearchParams();
            kelasIds.forEach(id => params.append("kelasIds", id));

            const res = await fetch(`${API_URL}/ujian/students-by-classes?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        enabled: kelasIds.length > 0,
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`${API_URL}/ujian/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Failed to update");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ujian"] });
            router.push("/ujian");
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message || "Gagal mengupdate ujian", variant: "destructive" });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.paketSoalId) {
            toast({ title: "Perhatian", description: "Pilih paket soal!", variant: "destructive" });
            return;
        }

        if (kelasIds.length === 0) {
            toast({ title: "Perhatian", description: "Pilih minimal 1 kelas!", variant: "destructive" });
            return;
        }

        if (targetPeserta === "SPECIFIC" && siswaIds.length === 0) {
            toast({ title: "Perhatian", description: "Pilih minimal 1 siswa jika menggunakan mode pilih siswa spesifik!", variant: "destructive" });
            return;
        }

        const submitData = {
            ...formData,
            mataPelajaranId: formData.mataPelajaranId || undefined,
            guruId: formData.guruId || undefined,
            tanggalMulai: new Date(formData.tanggalMulai).toISOString(),
            tanggalSelesai: new Date(formData.tanggalSelesai).toISOString(),
            paketSoalId: formData.paketSoalId,
            kelasIds: kelasIds,
            siswaIds: targetPeserta === "SPECIFIC" ? siswaIds : undefined,
        };

        updateMutation.mutate(submitData);
    };

    const toggleKelas = (id: string) => {
        if (kelasIds.includes(id)) {
            setKelasIds(kelasIds.filter(k => k !== id));
            // Also remove students from that class if deselecting class
            if (studentsList) {
                const studentsToRemove = studentsList.filter((s: any) => s.kelasId === id).map((s: any) => s.id);
                setSiswaIds(prev => prev.filter(sid => !studentsToRemove.includes(sid)));
            }
        } else {
            setKelasIds([...kelasIds, id]);
        }
    };

    const toggleStudent = (id: string) => {
        if (siswaIds.includes(id)) {
            setSiswaIds(siswaIds.filter(s => s !== id));
        } else {
            setSiswaIds([...siswaIds, id]);
        }
    };

    const handleSelectAllStudents = (filteredStudents: any[]) => {
        const ids = filteredStudents.map(s => s.id);
        const newIds = [...new Set([...siswaIds, ...ids])];
        setSiswaIds(newIds);
    };

    const handleDeselectAllStudents = (filteredStudents: any[]) => {
        const idsToRemove = filteredStudents.map(s => s.id);
        setSiswaIds(siswaIds.filter(id => !idsToRemove.includes(id)));
    };

    // Filter students logic
    const getFilteredStudents = () => {
        if (!studentsList) return [];
        return studentsList.filter((student: any) => {
            // Filter by Religion
            if (filterAgama !== "ALL" && student.agama !== filterAgama) return false;

            // Filter by Search
            if (searchStudent) {
                const searchLower = searchStudent.toLowerCase();
                return (
                    student.nama.toLowerCase().includes(searchLower) ||
                    student.nisn.includes(searchLower)
                );
            }

            return true;
        });
    };

    const filteredStudents = getFilteredStudents();
    const religionOptions = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];

    if (isLoadingUjian) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft size={20} />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Ujian</h1>
                            <p className="text-sm text-muted-foreground">
                                Edit data ujian - {ujianData?.kode}
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Informasi Dasar</h3>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Kode Ujian
                                </label>
                                <input
                                    type="text"
                                    value={ujianData?.kode || ""}
                                    disabled
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none opacity-60"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Judul Ujian *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.judul}
                                    onChange={(e) =>
                                        setFormData({ ...formData, judul: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                    placeholder="Contoh: Ujian Tengah Semester Matematika"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={formData.deskripsi}
                                    onChange={(e) =>
                                        setFormData({ ...formData, deskripsi: e.target.value })
                                    }
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Guru *
                                </label>
                                <SearchableSelect
                                    options={guruList?.data?.map((guru: any) => ({
                                        value: guru.id,
                                        label: guru.nama,
                                    })) || []}
                                    value={formData.guruId}
                                    onChange={(value) => {
                                        setFormData({
                                            ...formData,
                                            guruId: value,
                                            mataPelajaranId: "", // Reset mata pelajaran when guru changes
                                        });
                                    }}
                                    placeholder="Pilih Guru"
                                    searchPlaceholder="Cari guru..."
                                    emptyMessage="Guru tidak ditemukan"
                                />
                                {!formData.guruId && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Pilih guru terlebih dahulu untuk melihat mata pelajaran
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Mata Pelajaran
                                </label>
                                {formData.guruId && selectedGuru?.mataPelajaran ? (
                                    <>
                                        <SearchableSelect
                                            options={selectedGuru?.mataPelajaran?.map((mp: any) => ({
                                                value: mp.id,
                                                label: mp.nama,
                                                description: mp.kode ? `Kode: ${mp.kode}` : undefined,
                                            })) || []}
                                            value={formData.mataPelajaranId}
                                            onChange={(value) =>
                                                setFormData({
                                                    ...formData,
                                                    mataPelajaranId: value,
                                                })
                                            }
                                            placeholder="Pilih Mata Pelajaran"
                                            searchPlaceholder="Cari mata pelajaran..."
                                            emptyMessage="Mata pelajaran tidak ditemukan"
                                        />
                                        {selectedGuru?.mataPelajaran?.length === 0 && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Guru ini belum memiliki mata pelajaran yang diajar
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
                                        Pilih guru terlebih dahulu
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Class & Student Selection */}
                        <div className="space-y-4 rounded-lg border border-border bg-background p-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Users size={18} />
                                Peserta Ujian
                            </h3>

                            {/* Class Selection */}
                            <div className="space-y-2">
                                <label className="mb-2 block text-sm font-medium">
                                    Pilih Kelas *
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {kelasList?.data?.map((kelas: any) => (
                                        <div
                                            key={kelas.id}
                                            className={`
                                                cursor-pointer rounded-lg border px-3 py-2 text-sm transition
                                                ${kelasIds.includes(kelas.id)
                                                    ? "bg-primary/20 border-primary text-primary"
                                                    : "border-border bg-background hover:bg-accent"}
                                            `}
                                            onClick={() => toggleKelas(kelas.id)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`
                                                    flex h-4 w-4 items-center justify-center rounded border
                                                    ${kelasIds.includes(kelas.id) ? "border-primary bg-primary text-primary-foreground" : "border-white/30"}
                                                `}>
                                                    {kelasIds.includes(kelas.id) && <Check size={10} />}
                                                </div>
                                                <span>{kelas.nama}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {kelasIds.length} kelas dipilih
                                </p>
                            </div>

                            {/* Target Peserta Type */}
                            {kelasIds.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-border">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Target Peserta
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="targetPeserta"
                                                    checked={targetPeserta === "ALL_CLASS"}
                                                    onChange={() => setTargetPeserta("ALL_CLASS")}
                                                    className="text-primary"
                                                />
                                                <span className="text-sm">Semua Siswa di Kelas Terpilih</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="targetPeserta"
                                                    checked={targetPeserta === "SPECIFIC"}
                                                    onChange={() => setTargetPeserta("SPECIFIC")}
                                                    className="text-primary"
                                                />
                                                <span className="text-sm">Pilih Siswa Spesifik</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Specific Student Selection UI */}
                                    {targetPeserta === "SPECIFIC" && (
                                        <div className="bg-black/20 rounded-lg p-4 space-y-4">
                                            <div className="flex flex-col md:flex-row gap-4 justify-between">
                                                <div className="flex gap-2">
                                                    <div className="relative">
                                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <input
                                                            type="text"
                                                            placeholder="Cari siswa..."
                                                            value={searchStudent}
                                                            onChange={(e) => setSearchStudent(e.target.value)}
                                                            className="h-9 w-[200px] rounded-md border border-border bg-black/20 pl-9 pr-4 text-sm outline-none focus:border-primary/50"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <select
                                                            value={filterAgama}
                                                            onChange={(e) => setFilterAgama(e.target.value)}
                                                            className="h-9 rounded-md border border-border bg-black/20 pl-9 pr-8 text-sm outline-none focus:border-primary/50 appearance-none"
                                                        >
                                                            <option value="ALL">Semua Agama</option>
                                                            {religionOptions.map(agama => (
                                                                <option key={agama} value={agama}>{agama}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        type="button"
                                                        onClick={() => handleSelectAllStudents(filteredStudents)}
                                                    >
                                                        Pilih Semua
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        type="button"
                                                        onClick={() => handleDeselectAllStudents(filteredStudents)}
                                                    >
                                                        Hapus Pilihan
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="max-h-60 overflow-y-auto border border-border rounded-md">
                                                {isLoadingStudents ? (
                                                    <div className="p-4 text-center">
                                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                                                        <p className="text-xs text-muted-foreground mt-2">Memuat data siswa...</p>
                                                    </div>
                                                ) : filteredStudents.length === 0 ? (
                                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                                        Tidak ada siswa ditemukan
                                                    </div>
                                                ) : (
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-muted/40 sticky top-0">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left w-10">
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) handleSelectAllStudents(filteredStudents);
                                                                            else handleDeselectAllStudents(filteredStudents);
                                                                        }}
                                                                        checked={filteredStudents.length > 0 && filteredStudents.every((s: any) => siswaIds.includes(s.id))}
                                                                    />
                                                                </th>
                                                                <th className="px-4 py-2 text-left">Nama</th>
                                                                <th className="px-4 py-2 text-left">Kelas</th>
                                                                <th className="px-4 py-2 text-left">Agama</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredStudents.map((siswa: any) => (
                                                                <tr
                                                                    key={siswa.id}
                                                                    className={`border-t border-white/5 ${siswaIds.includes(siswa.id) ? "bg-primary/5" : ""}`}
                                                                >
                                                                    <td className="px-4 py-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={siswaIds.includes(siswa.id)}
                                                                            onChange={() => toggleStudent(siswa.id)}
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-2">
                                                                        <div>{siswa.nama}</div>
                                                                        <div className="text-xs text-muted-foreground">{siswa.nisn}</div>
                                                                    </td>
                                                                    <td className="px-4 py-2">{siswa.kelas.nama}</td>
                                                                    <td className="px-4 py-2">{siswa.agama || "-"}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground text-right">
                                                {siswaIds.length} siswa dipilih
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Schedule & Duration */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Jadwal & Durasi</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Tanggal & Waktu Mulai *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.tanggalMulai}
                                        onChange={(e) => {
                                            const newMulai = e.target.value;
                                            const newData = { ...formData, tanggalMulai: newMulai };
                                            // Auto-calculate duration if both dates are set
                                            if (newMulai && formData.tanggalSelesai) {
                                                const start = new Date(newMulai);
                                                const end = new Date(formData.tanggalSelesai);
                                                const diffMs = end.getTime() - start.getTime();
                                                const diffMins = Math.round(diffMs / 60000);
                                                if (diffMins > 0) {
                                                    newData.durasi = diffMins;
                                                }
                                            }
                                            setFormData(newData);
                                        }}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Tanggal & Waktu Selesai *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.tanggalSelesai}
                                        onChange={(e) => {
                                            const newSelesai = e.target.value;
                                            const newData = { ...formData, tanggalSelesai: newSelesai };
                                            // Auto-calculate duration if both dates are set
                                            if (formData.tanggalMulai && newSelesai) {
                                                const start = new Date(formData.tanggalMulai);
                                                const end = new Date(newSelesai);
                                                const diffMs = end.getTime() - start.getTime();
                                                const diffMins = Math.round(diffMs / 60000);
                                                if (diffMins > 0) {
                                                    newData.durasi = diffMins;
                                                }
                                            }
                                            setFormData(newData);
                                        }}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Durasi (menit) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.durasi}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                durasi: parseInt(e.target.value),
                                            })
                                        }
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Nilai Minimal (Passing Grade)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.nilaiMinimal}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                nilaiMinimal: parseInt(e.target.value),
                                            })
                                        }
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Configuration */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Konfigurasi</h3>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.acakSoal}
                                        onChange={(e) =>
                                            setFormData({ ...formData, acakSoal: e.target.checked })
                                        }
                                        className="rounded border-white/20"
                                    />
                                    <span className="text-sm">Acak urutan soal</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.tampilkanNilai}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tampilkanNilai: e.target.checked,
                                            })
                                        }
                                        className="rounded border-white/20"
                                    />
                                    <span className="text-sm">
                                        Tampilkan nilai setelah selesai
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Paket Soal Selection */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    Pilih Paket Soal
                                </h3>
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Paket Soal *
                                    </label>
                                    <select
                                        value={formData.paketSoalId}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                paketSoalId: e.target.value,
                                            })
                                        }
                                        required
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="">Pilih Paket Soal</option>
                                        {paketSoalList?.data?.map((paket: any) => (
                                            <option key={paket.id} value={paket.id}>
                                                {paket.nama} {paket.kode ? `(${paket.kode})` : ''} - {paket._count?.soalItems || 0} soal
                                            </option>
                                        ))}
                                    </select>
                                    {paketSoalList?.data?.length === 0 && formData.mataPelajaranId && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Tidak ada paket soal tersedia untuk mata pelajaran ini
                                        </p>
                                    )}
                                    {!formData.mataPelajaranId && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Pilih mata pelajaran terlebih dahulu untuk melihat paket soal
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex gap-2 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={updateMutation.isPending || !formData.paketSoalId}
                                className="flex-1"
                            >
                                {updateMutation.isPending ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : (
                                    "Simpan Perubahan"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
