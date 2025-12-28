"use client";
import { API_URL } from "@/lib/api";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { MultiSelect } from "@/components/ui/multi-select";
import { useRole } from "../../../role-context";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function EditPaketSoalPage() {
    const { token, role } = useRole();
    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const id = params.id as string;

    const [formData, setFormData] = useState({
        nama: "",
        deskripsi: "",
        mataPelajaranId: "",
        guruId: "",
        kelasIds: [] as string[],
    });
    const [isInitialized, setIsInitialized] = useState(false);

    // Fetch paket soal data
    const { data: paketSoal, isLoading: isLoadingPaket } = useQuery({
        queryKey: ["paket-soal", id],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/paket-soal/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        },
        enabled: !!token && !!id,
    });

    // Initialize form data when paket soal is loaded
    useEffect(() => {
        if (paketSoal && !isInitialized) {
            setFormData({
                nama: paketSoal.nama || "",
                deskripsi: paketSoal.deskripsi || "",
                mataPelajaranId: paketSoal.mataPelajaranId || "",
                guruId: paketSoal.guruId || "",
                kelasIds: paketSoal.paketSoalKelas?.map((psk: any) => psk.kelasId) || [],
            });
            setIsInitialized(true);
        }
    }, [paketSoal, isInitialized]);

    const { data: mataPelajaranList } = useQuery({
        queryKey: ["mata-pelajaran-list", role],
        queryFn: async () => {
            const queryParams = role === "GURU" ? "?mySubjects=true&limit=100" : "?limit=100";
            const res = await fetch(`${API_URL}/mata-pelajaran${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const { data: kelasList } = useQuery({
        queryKey: ["kelas-list"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/kelas?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const { data: guruList } = useQuery({
        queryKey: ["guru-list"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/guru?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        enabled: role === "ADMIN",
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`${API_URL}/paket-soal/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update");
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Berhasil", description: "Paket soal berhasil diperbarui" });
            queryClient.invalidateQueries({ queryKey: ["paket-soal"] });
            router.push(`/paket-soal/${id}`);
        },
        onError: () => {
            toast({ title: "Error", description: "Gagal memperbarui paket soal", variant: "destructive" });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData: any = { ...formData };

        if (!submitData.nama) {
            toast({ title: "Perhatian", description: "Nama paket soal harus diisi!", variant: "destructive" });
            return;
        }

        // Remove empty optional fields
        if (!submitData.mataPelajaranId) delete submitData.mataPelajaranId;
        if (!submitData.guruId) delete submitData.guruId;
        if (!submitData.deskripsi) delete submitData.deskripsi;

        updateMutation.mutate(submitData);
    };

    const mataPelajaranOptions = (mataPelajaranList?.data ?? [])
        .sort((a: any, b: any) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }));

    const kelasOptions = (kelasList?.data ?? [])
        .sort((a: any, b: any) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }));

    const guruOptions = (guruList?.data ?? []).sort((a: any, b: any) =>
        a.nama.localeCompare(b.nama, "id", { sensitivity: "base" })
    );
    const selectedGuru = guruOptions.find((guru: any) => guru.id === formData.guruId);
    const filteredGuruOptions = formData.mataPelajaranId
        ? guruOptions.filter((guru: any) =>
            guru.mataPelajaran?.some((mp: any) => mp.id === formData.mataPelajaranId)
        )
        : guruOptions;

    const handleMataPelajaranChange = (value: string) => {
        setFormData((prev) => {
            const newGuruId =
                prev.guruId &&
                    guruOptions.find((g: any) => g.id === prev.guruId)?.mataPelajaran?.some(
                        (mp: any) => mp.id === value
                    )
                    ? prev.guruId
                    : "";
            return { ...prev, mataPelajaranId: value, guruId: newGuruId };
        });
    };

    const handleGuruChange = (value: string) => {
        setFormData((prev) => ({ ...prev, guruId: value }));
    };

    if (isLoadingPaket) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
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
                            <h1 className="text-2xl font-bold">Edit Paket Soal</h1>
                            <p className="text-sm text-muted-foreground">
                                Edit informasi paket soal - Kode: {paketSoal?.kode}
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="p-4 bg-muted/30 rounded-lg">
                            <h3 className="font-semibold mb-4">Informasi Paket Soal</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Kode Paket
                                    </label>
                                    <input
                                        type="text"
                                        value={paketSoal?.kode || ""}
                                        disabled
                                        className="w-full rounded-lg border border-border bg-muted px-4 py-2 outline-none opacity-60"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Kode paket tidak dapat diubah
                                    </p>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Nama Paket Soal *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Paket Soal Matematika Kelas XII"
                                        value={formData.nama}
                                        onChange={(e) =>
                                            setFormData({ ...formData, nama: e.target.value })
                                        }
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        placeholder="Deskripsi paket soal..."
                                        value={formData.deskripsi}
                                        onChange={(e) =>
                                            setFormData({ ...formData, deskripsi: e.target.value })
                                        }
                                        rows={3}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Mata Pelajaran
                            </label>
                            <SearchableSelect
                                options={mataPelajaranOptions.map((mp: any) => ({
                                    value: mp.id,
                                    label: mp.nama,
                                    description: mp.kode ? `Kode: ${mp.kode}` : undefined,
                                }))}
                                value={formData.mataPelajaranId}
                                onChange={handleMataPelajaranChange}
                                placeholder="Pilih Mata Pelajaran"
                                searchPlaceholder="Cari mata pelajaran..."
                                emptyMessage="Tidak ada mata pelajaran yang cocok"
                            />
                        </div>

                        {role === "ADMIN" && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Guru Mata Pelajaran
                                </label>
                                <SearchableSelect
                                    options={filteredGuruOptions.map((guru: any) => ({
                                        value: guru.id,
                                        label: guru.nama,
                                    }))}
                                    value={formData.guruId}
                                    onChange={handleGuruChange}
                                    placeholder="Pilih Guru"
                                    searchPlaceholder="Cari guru..."
                                    emptyMessage={formData.mataPelajaranId ? "Tidak ada guru yang mengajar mapel ini" : "Guru tidak ditemukan"}
                                />
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Kelas
                            </label>
                            <MultiSelect
                                options={kelasOptions.map((kelas: any) => ({
                                    value: kelas.id,
                                    label: kelas.nama,
                                    description: kelas.tingkat ? `Tingkat ${kelas.tingkat}` : undefined,
                                }))}
                                values={formData.kelasIds}
                                onChange={(values) => setFormData({ ...formData, kelasIds: values })}
                                placeholder="Pilih Kelas (Opsional)"
                                searchPlaceholder="Cari kelas..."
                                emptyMessage="Tidak ada kelas yang cocok"
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
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
                                disabled={updateMutation.isPending}
                                className="flex-1"
                            >
                                {updateMutation.isPending ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                        Menyimpan...
                                    </>
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
