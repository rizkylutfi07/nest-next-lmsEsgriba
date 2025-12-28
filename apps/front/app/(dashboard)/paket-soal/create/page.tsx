"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useRole } from "../../role-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function CreatePaketSoalPage() {
    const { token, role } = useRole();
    const { toast } = useToast();
    const router = useRouter();
    const [formData, setFormData] = useState({
        kode: "",
        nama: "",
        deskripsi: "",
        mataPelajaranId: "",
        guruId: "",
        kelasId: "",
    });
    const [mapelTouched, setMapelTouched] = useState(false);
    // Search state no longer needed with SearchableSelect
    // const [mapelSearch, setMapelSearch] = useState("");

    const { data: generatedKode, isLoading: isLoadingKode } = useQuery({
        queryKey: ["generate-kode-paket"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/paket-soal/generate-kode`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to generate kode");
            const data = await res.json();
            return data.kode || "";
        },
        enabled: !!token,
    });



    const { data: mataPelajaranList } = useQuery({
        queryKey: ["mata-pelajaran-list", role],
        queryFn: async () => {
            const queryParams = role === "GURU" ? "?mySubjects=true&limit=100" : "?limit=100";
            const res = await fetch(`http://localhost:3001/mata-pelajaran${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const { data: kelasList } = useQuery({
        queryKey: ["kelas-list"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/kelas?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const { data: guruList } = useQuery({
        queryKey: ["guru-list"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/guru?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        enabled: role === "ADMIN", // Only fetch if admin
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`http://localhost:3001/paket-soal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create");
            return res.json();
        },
        onSuccess: (data) => {
            router.push(`/paket-soal/${data.id}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData: any = { ...formData };

        if (generatedKode) {
            submitData.kode = generatedKode;
        }

        if (!submitData.nama) {
            toast({ title: "Perhatian", description: "Nama paket soal harus diisi!", variant: "destructive" });
            return;
        }

        // Remove empty optional fields
        if (!submitData.mataPelajaranId) delete submitData.mataPelajaranId;
        if (!submitData.guruId) delete submitData.guruId;
        if (!submitData.kelasId) delete submitData.kelasId;
        if (!submitData.deskripsi) delete submitData.deskripsi;

        createMutation.mutate(submitData);
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
            const next = { ...prev, mataPelajaranId: value };
            if (prev.guruId) {
                const guru = guruOptions.find((g: any) => g.id === prev.guruId);
                const guruHasMapel = guru?.mataPelajaran?.some((mp: any) => mp.id === value);
                if (!guruHasMapel) {
                    next.guruId = "";
                }
            }
            return next;
        });
        setMapelTouched(true);
    };

    const handleGuruChange = (value: string) => {
        if (!value) {
            setFormData((prev) => ({ ...prev, guruId: "", mataPelajaranId: mapelTouched ? prev.mataPelajaranId : "" }));
            return;
        }

        const guru = guruOptions.find((g: any) => g.id === value);
        const guruMapelIds = (guru?.mataPelajaran || []).map((mp: any) => mp.id);

        setFormData((prev) => {
            const next = { ...prev, guruId: value };

            if (guruMapelIds.length === 1) {
                next.mataPelajaranId = guruMapelIds[0];
            } else if (prev.mataPelajaranId && !guruMapelIds.includes(prev.mataPelajaranId)) {
                next.mataPelajaranId = "";
            } else if (!prev.mataPelajaranId && guruMapelIds.length > 0) {
                // Default to the first mapel the guru teaches to keep the relation valid
                next.mataPelajaranId = guruMapelIds[0];
            }

            return next;
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Buat Paket Soal Baru</h1>
                    <p className="text-sm text-muted-foreground">
                        Isi informasi paket soal di bawah ini
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informasi Paket Soal</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {generatedKode && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Kode Paket
                                </label>
                                <input
                                    type="text"
                                    value={generatedKode}
                                    disabled
                                    className="w-full rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground outline-none opacity-80"
                                />
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Nama Paket Soal *
                            </label>
                            <input
                                type="text"
                                value={formData.nama}
                                onChange={(e) =>
                                    setFormData({ ...formData, nama: e.target.value })
                                }
                                placeholder="Contoh: Paket Soal Matematika Kelas XII"
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
                                required
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
                                placeholder="Deskripsi paket soal..."
                                rows={3}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
                            />
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
                            {formData.guruId && !selectedGuru?.mataPelajaran?.some((mp: any) => mp.id === formData.mataPelajaranId) && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Guru yang dipilih tidak mengajar mapel ini. Pilih mapel yang sesuai.
                                </p>
                            )}
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
                                {formData.guruId && selectedGuru && !selectedGuru.mataPelajaran?.length && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Guru belum memiliki mata pelajaran terhubung.
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Kelas
                            </label>
                            <SearchableSelect
                                options={kelasOptions.map((kelas: any) => ({
                                    value: kelas.id,
                                    label: kelas.nama,
                                    description: kelas.tingkat ? `Tingkat ${kelas.tingkat}` : undefined,
                                }))}
                                value={formData.kelasId}
                                onChange={(value) => setFormData({ ...formData, kelasId: value })}
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
                                disabled={createMutation.isPending}
                                className="flex-1"
                            >
                                {createMutation.isPending ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                        Menyimpan...
                                    </>
                                ) : (
                                    "Buat Paket Soal"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
