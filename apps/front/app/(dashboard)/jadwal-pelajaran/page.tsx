"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X, Calendar, Clock, BookOpen, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useRole } from "../role-context";
import { useToast } from "@/hooks/use-toast";

const HARI = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"] as const;
const HARI_LABEL: Record<string, string> = {
    SENIN: "Senin",
    SELASA: "Selasa",
    RABU: "Rabu",
    KAMIS: "Kamis",
    JUMAT: "Jumat",
    SABTU: "Sabtu",
};

// Jam pelajaran Senin s/d Sabtu (kecuali Jumat)
const JAM_SLOTS_REGULER = [
    { jamKe: 1, mulai: "07:00", selesai: "07:38", isBreak: false },
    { jamKe: 2, mulai: "07:38", selesai: "08:16", isBreak: false },
    { jamKe: 3, mulai: "08:16", selesai: "08:54", isBreak: false },
    { jamKe: 4, mulai: "08:54", selesai: "09:32", isBreak: false },
    { jamKe: null, mulai: "09:32", selesai: "10:10", isBreak: true, label: "Istirahat" },
    { jamKe: 5, mulai: "10:10", selesai: "10:45", isBreak: false },
    { jamKe: 6, mulai: "10:45", selesai: "11:20", isBreak: false },
    { jamKe: 7, mulai: "11:20", selesai: "11:55", isBreak: false },
    { jamKe: 8, mulai: "11:55", selesai: "12:30", isBreak: false },
    { jamKe: 9, mulai: "12:30", selesai: "13:05", isBreak: false },
];

// Jam pelajaran Jumat (istirahat di jam ke-4)
const JAM_SLOTS_JUMAT = [
    { jamKe: 1, mulai: "07:00", selesai: "07:35", isBreak: false },
    { jamKe: 2, mulai: "07:35", selesai: "08:10", isBreak: false },
    { jamKe: 3, mulai: "08:10", selesai: "08:45", isBreak: false },
    { jamKe: 4, mulai: "08:45", selesai: "09:05", isBreak: true, label: "Istirahat" },
    { jamKe: null, mulai: "09:05", selesai: "09:35", isBreak: false, label: "Jam 4" },
    { jamKe: 5, mulai: "09:35", selesai: "10:05", isBreak: false },
    { jamKe: 6, mulai: "10:05", selesai: "10:35", isBreak: false },
    { jamKe: 7, mulai: "10:35", selesai: "11:05", isBreak: true, label: "Jumatan" },
    { jamKe: 8, mulai: "11:05", selesai: "11:35", isBreak: true, label: "Jumatan" },
    { jamKe: 9, mulai: "11:35", selesai: "12:05", isBreak: true, label: "Jumatan" },
];

// Helper function to get class initial (e.g., "Teknik Kendaraan Ringan" -> "TKR")
function getKelasInitial(nama: string): string {
    // If nama is short enough (<=4 chars), use as-is
    if (nama.length <= 4) return nama;
    // Remove tingkat prefix (X, XI, XII) if present at the start
    const cleanedNama = nama.replace(/^(XII|XI|X)\s+/i, "");
    // Words to skip (connecting words)
    const skipWords = ["dan", "untuk", "atau", "yang", "ke", "di"];
    // Split by space and filter skip words
    const words = cleanedNama.split(" ").filter((word) => !skipWords.includes(word.toLowerCase()));
    // If single word, take first 2 letters (e.g., Akuntansi -> AK)
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }
    // Multiple words - take first letter of each
    return words.map((word) => word.charAt(0).toUpperCase()).join("");
}

export default function JadwalPelajaranPage() {
    const { token, role } = useRole();
    const queryClient = useQueryClient();

    // Auto-detect current day
    const getCurrentDay = (): string => {
        const days = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
        const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
        const currentDay = days[today];
        // If Sunday, default to Monday (since schools usually don't have classes on Sunday)
        return currentDay === "MINGGU" ? "SENIN" : currentDay;
    };

    const [selectedHari, setSelectedHari] = useState<string>(getCurrentDay());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [modalSlot, setModalSlot] = useState<{ jamKe: number | null; jamMulai: string; jamSelesai: string; kelasId?: string } | null>(null);

    const isReadOnly = role === 'SISWA';

    // Fetch kelas list
    const { data: kelasList } = useQuery({
        queryKey: ["kelas-list"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/kelas?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        enabled: !!token,
    });

    // Fetch all jadwal for selected hari (all classes)
    const { data: jadwalList, isLoading: isLoadingJadwal } = useQuery({
        queryKey: ["jadwal-pelajaran", selectedHari],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/jadwal-pelajaran?hari=${selectedHari}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        enabled: !!token && !!selectedHari,
    });

    // Fetch guru and mapel for modal
    const { data: guruList } = useQuery({
        queryKey: ["guru-list"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/guru?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        enabled: !!token,
    });

    const { data: mapelList } = useQuery({
        queryKey: ["mapel-list"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/mata-pelajaran?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        enabled: !!token,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("http://localhost:3001/jadwal-pelajaran", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jadwal-pelajaran"] });
            closeModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await fetch(`http://localhost:3001/jadwal-pelajaran/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jadwal-pelajaran"] });
            closeModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`http://localhost:3001/jadwal-pelajaran/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jadwal-pelajaran"] });
            closeModal();
        },
    });

    // Get time slots based on selected day
    const getTimeSlots = () => {
        return selectedHari === "JUMAT" ? JAM_SLOTS_JUMAT : JAM_SLOTS_REGULER;
    };

    // Build schedule grid: key by kelasId, then by time slot
    const scheduleGrid = useMemo(() => {
        const grid: Record<string, Record<string, any>> = {};
        const items = Array.isArray(jadwalList) ? jadwalList : [];
        items.forEach((item: any) => {
            if (!grid[item.kelasId]) {
                grid[item.kelasId] = {};
            }
            const key = `${item.jamMulai}-${item.jamSelesai}`;
            grid[item.kelasId][key] = item;
        });
        return grid;
    }, [jadwalList]);

    const openModal = (jamKe: number | null, jamMulai: string, jamSelesai: string, kelasId?: string, item?: any) => {
        if (isReadOnly) return; // Disable for SISWA
        setModalSlot({ jamKe, jamMulai, jamSelesai, kelasId });
        setEditingItem(item || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setModalSlot(null);
    };

    const handleSubmit = (data: { kelasId: string; mataPelajaranId: string; guruId: string }) => {
        if (!modalSlot) return;

        const payload = {
            hari: selectedHari,
            jamMulai: modalSlot.jamMulai,
            jamSelesai: modalSlot.jamSelesai,
            ...data,
        };

        if (editingItem) {
            updateMutation.mutate({ id: editingItem.id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const handleDelete = () => {
        if (editingItem) {
            deleteMutation.mutate(editingItem.id);
        }
    };

    const hariOptions = HARI.map((h) => ({
        value: h,
        label: HARI_LABEL[h] || h,
    }));

    // Sort classes: by tingkat (X, XI, XII), then by jurusan (TKR, AK, TKJ)
    const tingkatOrder: Record<string, number> = { "X": 1, "XI": 2, "XII": 3 };
    const jurusanOrder: Record<string, number> = { "TKR": 1, "AK": 2, "TKJ": 3 };

    // Get classList: use kelasList if available (for ADMIN/GURU), otherwise extract from jadwalList (for SISWA)
    let classListSource: any[] = [];
    if (kelasList?.data && kelasList.data.length > 0) {
        classListSource = kelasList.data;
    } else if (jadwalList && Array.isArray(jadwalList) && jadwalList.length > 0) {
        // Extract unique kelas from jadwalList
        const uniqueKelasMap = new Map();
        jadwalList.forEach((jadwal: any) => {
            if (jadwal.kelas && !uniqueKelasMap.has(jadwal.kelas.id)) {
                uniqueKelasMap.set(jadwal.kelas.id, jadwal.kelas);
            }
        });
        classListSource = Array.from(uniqueKelasMap.values());
    }

    const classList = [...classListSource].sort((a: any, b: any) => {
        // First sort by tingkat
        const tingkatA = tingkatOrder[a.tingkat] || 99;
        const tingkatB = tingkatOrder[b.tingkat] || 99;
        if (tingkatA !== tingkatB) return tingkatA - tingkatB;
        // Then sort by jurusan initial
        const jurusanA = getKelasInitial(a.nama);
        const jurusanB = getKelasInitial(b.nama);
        const orderA = jurusanOrder[jurusanA] || 99;
        const orderB = jurusanOrder[jurusanB] || 99;
        return orderA - orderB;
    });
    const timeSlots = getTimeSlots();

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Calendar className="text-primary" />
                        Jadwal Pelajaran
                    </h1>
                    <p className="text-muted-foreground mt-1">Kelola jadwal pelajaran per hari</p>
                </div>
            </div>

            {/* Hari Selector */}
            <Card className="overflow-visible relative z-50">
                <CardHeader>
                    <CardTitle>Pilih Hari</CardTitle>
                </CardHeader>
                <CardContent className="overflow-visible">
                    <div className="max-w-md">
                        <SearchableSelect
                            options={hariOptions}
                            value={selectedHari}
                            onChange={setSelectedHari}
                            placeholder="Pilih hari..."
                            searchPlaceholder="Cari hari..."
                            emptyMessage="Tidak ada hari"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Schedule Grid */}
            {isLoadingJadwal ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock size={20} />
                            Jadwal Hari {HARI_LABEL[selectedHari]}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border border-border bg-muted/50 px-2 py-2 text-center text-xs font-medium w-[60px]">
                                            Jam
                                        </th>
                                        {classList.map((kelas: any) => (
                                            <th
                                                key={kelas.id}
                                                className="border border-border bg-muted/50 px-2 py-2 text-center text-xs font-bold w-[70px]"
                                            >
                                                {kelas.tingkat} {getKelasInitial(kelas.nama)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map((slot, rowIndex) => (
                                        <tr key={`${slot.mulai}-${slot.selesai}`} className={slot.isBreak ? "bg-amber-500/10" : ""}>
                                            <td className={`border border-border px-1 py-1 text-xs font-medium text-center w-[60px] ${slot.isBreak ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-muted/30"}`}>
                                                <div className="flex flex-col">
                                                    <span className="font-bold">
                                                        {slot.isBreak ? (slot.label || "Ist") : slot.jamKe}
                                                    </span>
                                                    <span className="text-[10px] opacity-70">{slot.mulai}</span>
                                                </div>
                                            </td>
                                            {classList.map((kelas: any) => {
                                                const item = scheduleGrid[kelas.id]?.[`${slot.mulai}-${slot.selesai}`];
                                                const isBreakSlot = slot.isBreak;

                                                return (
                                                    <td
                                                        key={`${kelas.id}-${slot.mulai}`}
                                                        className={`border border-border p-1 transition ${isBreakSlot
                                                            ? "bg-amber-500/10 cursor-not-allowed"
                                                            : isReadOnly
                                                                ? "cursor-default"
                                                                : "cursor-pointer hover:bg-muted/50"
                                                            }`}
                                                        onClick={() => !isBreakSlot && openModal(slot.jamKe, slot.mulai, slot.selesai, kelas.id, item)}
                                                    >
                                                        {isBreakSlot ? (
                                                            <div className="h-12 flex items-center justify-center text-xs text-amber-600 dark:text-amber-400 font-medium">
                                                                {slot.label || "Istirahat"}
                                                            </div>
                                                        ) : item ? (
                                                            <div className="bg-primary/10 border border-primary/30 rounded-lg p-2 text-xs min-h-[48px]">
                                                                <p className="font-semibold text-primary truncate">
                                                                    {item.mataPelajaran?.nama?.substring(0, 22) || "-"}
                                                                </p>
                                                                <p className="text-muted-foreground truncate text-[10px]">
                                                                    {item.guru?.nama?.substring(0, 22) || "-"}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div className="h-12 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                                                <Plus size={14} className="text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && modalSlot && (
                <ScheduleModal
                    slot={modalSlot}
                    hari={selectedHari}
                    item={editingItem}
                    kelasList={classList}
                    guruList={guruList?.data || []}
                    mapelList={mapelList?.data || []}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    onDelete={handleDelete}
                    isLoading={createMutation.isPending || updateMutation.isPending}
                    isDeleting={deleteMutation.isPending}
                />
            )}
        </div>
    );
}

function ScheduleModal({
    slot,
    hari,
    item,
    kelasList,
    guruList,
    mapelList,
    onClose,
    onSubmit,
    onDelete,
    isLoading,
    isDeleting,
}: {
    slot: { jamKe: number | null; jamMulai: string; jamSelesai: string; kelasId?: string };
    hari: string;
    item: any;
    kelasList: any[];
    guruList: any[];
    mapelList: any[];
    onClose: () => void;
    onSubmit: (data: { kelasId: string; mataPelajaranId: string; guruId: string }) => void;
    onDelete: () => void;
    isLoading: boolean;
    isDeleting: boolean;
}) {
    const [kelasId, setKelasId] = useState(item?.kelasId || slot.kelasId || "");
    const [mataPelajaranId, setMataPelajaranId] = useState(item?.mataPelajaranId || "");
    const [guruId, setGuruId] = useState(item?.guruId || "");
    const { toast } = useToast();

    // Filter guru based on selected mata pelajaran (from mataPelajaran relation)
    const filteredGuruList = useMemo(() => {
        if (!mataPelajaranId) return [];
        return guruList.filter((guru: any) =>
            guru.mataPelajaran?.some((mp: any) => mp.id === mataPelajaranId)
        );
    }, [guruList, mataPelajaranId]);

    // Reset guruId when mataPelajaranId changes (only if the current guru doesn't teach the new subject)
    const handleMapelChange = (newMapelId: string) => {
        setMataPelajaranId(newMapelId);
        // Check if current guru teaches this subject
        const currentGuruTeachesSubject = guruList.find((g: any) =>
            g.id === guruId && g.mataPelajaran?.some((mp: any) => mp.id === newMapelId)
        );
        if (!currentGuruTeachesSubject) {
            setGuruId("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!kelasId || !mataPelajaranId || !guruId) {
            toast({ title: "Perhatian", description: "Harap lengkapi semua field!", variant: "destructive" });
            return;
        }
        onSubmit({ kelasId, mataPelajaranId, guruId });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{item ? "Edit Jadwal" : "Tambah Jadwal"}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={18} />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {HARI_LABEL[hari]}, Jam ke-{slot.jamKe} ({slot.jamMulai} - {slot.jamSelesai})
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Kelas *</label>
                            <SearchableSelect
                                options={kelasList.map((k: any) => ({
                                    value: k.id,
                                    label: `${k.tingkat} - ${k.nama}`,
                                }))}
                                value={kelasId}
                                onChange={setKelasId}
                                placeholder="Pilih kelas..."
                                searchPlaceholder="Cari kelas..."
                                emptyMessage="Tidak ada kelas"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Mata Pelajaran *</label>
                            <SearchableSelect
                                options={mapelList.map((mp: any) => ({
                                    value: mp.id,
                                    label: mp.nama,
                                }))}
                                value={mataPelajaranId}
                                onChange={handleMapelChange}
                                placeholder="Pilih mata pelajaran..."
                                searchPlaceholder="Cari..."
                                emptyMessage="Tidak ada mata pelajaran"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Guru *</label>
                            <SearchableSelect
                                options={filteredGuruList.map((g: any) => ({
                                    value: g.id,
                                    label: g.nama,
                                }))}
                                value={guruId}
                                onChange={setGuruId}
                                placeholder={mataPelajaranId ? "Pilih guru..." : "Pilih mata pelajaran dulu..."}
                                searchPlaceholder="Cari..."
                                emptyMessage={mataPelajaranId ? "Tidak ada guru untuk mata pelajaran ini" : "Pilih mata pelajaran dulu"}
                            />
                        </div>
                        <div className="flex gap-2 pt-4">
                            {item && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={onDelete}
                                    disabled={isDeleting}
                                    className="flex-1"
                                >
                                    {isDeleting ? <Loader2 className="animate-spin" size={16} /> : "Hapus"}
                                </Button>
                            )}
                            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                                Batal
                            </Button>
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
