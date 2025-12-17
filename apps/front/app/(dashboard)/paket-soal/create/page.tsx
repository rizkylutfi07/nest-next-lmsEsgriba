"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../../role-context";
import { useRouter } from "next/navigation";

export default function CreatePaketSoalPage() {
    const { token } = useRole();
    const router = useRouter();
    const [formData, setFormData] = useState({
        kode: "",
        nama: "",
        deskripsi: "",
        mataPelajaranId: "",
        guruId: "",
    });

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
        queryKey: ["mata-pelajaran-list"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/mata-pelajaran?limit=100`, {
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
            alert("Nama paket soal harus diisi!");
            return;
        }

        // Remove empty optional fields
        if (!submitData.mataPelajaranId) delete submitData.mataPelajaranId;
        if (!submitData.guruId) delete submitData.guruId;
        if (!submitData.deskripsi) delete submitData.deskripsi;

        createMutation.mutate(submitData);
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
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none opacity-60"
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
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
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
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Mata Pelajaran
                            </label>
                            <select
                                value={formData.mataPelajaranId}
                                onChange={(e) =>
                                    setFormData({ ...formData, mataPelajaranId: e.target.value })
                                }
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
                            >
                                <option value="">Pilih Mata Pelajaran</option>
                                {mataPelajaranList?.data?.map((mp: any) => (
                                    <option key={mp.id} value={mp.id}>
                                        {mp.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Guru Mata Pelajaran
                            </label>
                            <select
                                value={formData.guruId}
                                onChange={(e) =>
                                    setFormData({ ...formData, guruId: e.target.value })
                                }
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
                            >
                                <option value="">Pilih Guru</option>
                                {guruList?.data?.map((guru: any) => (
                                    <option key={guru.id} value={guru.id}>
                                        {guru.nama}
                                    </option>
                                ))}
                            </select>
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
