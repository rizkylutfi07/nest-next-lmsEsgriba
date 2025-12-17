"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUpCircle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../role-context";

export default function KenaikanKelasPage() {
    const { token } = useRole();
    const queryClient = useQueryClient();
    const [kelasAsalId, setKelasAsalId] = useState("");
    const [kelasTujuanId, setKelasTujuanId] = useState("");
    const [tahunAjaranTujuanId, setTahunAjaranTujuanId] = useState("");
    const [siswaList, setSiswaList] = useState<any[]>([]);
    const [selectedSiswaIds, setSelectedSiswaIds] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState<any>(null);

    // Fetch kelas list
    const { data: kelasList } = useQuery({
        queryKey: ["kelas-all"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/kelas?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    // Fetch tahun ajaran list
    const { data: tahunAjaranList } = useQuery({
        queryKey: ["tahun-ajaran-all"],
        queryFn: async () => {
            const res = await fetch(`http://localhost:3001/tahun-ajaran?limit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    // Fetch siswa from source class
    const loadSiswa = async () => {
        if (!kelasAsalId) return;

        const res = await fetch(`http://localhost:3001/siswa?kelasId=${kelasAsalId}&limit=1000`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSiswaList(data.data || []);
        setSelectedSiswaIds([]);
    };

    // Kenaikan kelas mutation
    const kenaikanKelasMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`http://localhost:3001/siswa/kenaikan-kelas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Gagal memproses kenaikan kelas');
            }
            return res.json();
        },
        onSuccess: (data) => {
            setResult(data);
            setShowResult(true);
            queryClient.invalidateQueries({ queryKey: ["siswa"] });
            setSiswaList([]);
            setSelectedSiswaIds([]);
            setKelasAsalId("");
            setKelasTujuanId("");
        },
        onError: (error: any) => {
            alert(error.message || 'Gagal memproses kenaikan kelas');
        },
    });

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedSiswaIds(siswaList.map(s => s.id));
        } else {
            setSelectedSiswaIds([]);
        }
    };

    const handleSelectSiswa = (siswaId: string, checked: boolean) => {
        if (checked) {
            setSelectedSiswaIds([...selectedSiswaIds, siswaId]);
        } else {
            setSelectedSiswaIds(selectedSiswaIds.filter(id => id !== siswaId));
        }
    };

    const handleProses = () => {
        const kelasAsal = kelasList?.data?.find((k: any) => k.id === kelasAsalId);
        const isGraduationMode = kelasAsal?.tingkat === "XII" || kelasAsal?.tingkat === "12" || kelasAsal?.tingkat === "3";

        if (!kelasAsalId || (!isGraduationMode && (!kelasTujuanId || !tahunAjaranTujuanId)) || selectedSiswaIds.length === 0) {
            alert('Mohon lengkapi semua pilihan');
            return;
        }

        kenaikanKelasMutation.mutate({
            kelasAsalId,
            kelasTujuanId: isGraduationMode ? undefined : kelasTujuanId,
            tahunAjaranTujuanId: isGraduationMode ? undefined : tahunAjaranTujuanId,
            siswaIds: selectedSiswaIds,
            isGraduation: isGraduationMode,
        });
    };

    const kelasAsal = kelasList?.data?.find((k: any) => k.id === kelasAsalId);
    const kelasAsalNama = kelasAsal?.nama;
    const kelasTujuanNama = kelasList?.data?.find((k: any) => k.id === kelasTujuanId)?.nama;

    // Detect if this is a final year class (Grade XII)
    const isGraduationMode = kelasAsal?.tingkat === "XII" || kelasAsal?.tingkat === "12" || kelasAsal?.tingkat === "3";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <ArrowUpCircle size={32} />
                    {isGraduationMode ? "Kelulusan Siswa" : "Kenaikan Kelas Massal"}
                </h1>
                <p className="text-muted-foreground">
                    {isGraduationMode
                        ? "Luluskan siswa tingkat akhir (Kelas XII) menjadi alumni"
                        : "Pindahkan siswa dari satu kelas ke kelas lain secara massal"
                    }
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Pilih Kelas</CardTitle>
                    <CardDescription>Pilih kelas asal dan {isGraduationMode ? "konfirmasi kelulusan" : "kelas tujuan"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Kelas Asal</label>
                            <select
                                value={kelasAsalId}
                                onChange={(e) => { setKelasAsalId(e.target.value); setSiswaList([]); setSelectedSiswaIds([]); setKelasTujuanId(""); setTahunAjaranTujuanId(""); }}
                                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
                            >
                                <option value="">Pilih Kelas Asal</option>
                                {kelasList?.data?.map((kelas: any) => (
                                    <option key={kelas.id} value={kelas.id}>
                                        {kelas.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {!isGraduationMode && (
                            <>
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Kelas Tujuan</label>
                                    <select
                                        value={kelasTujuanId}
                                        onChange={(e) => setKelasTujuanId(e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
                                    >
                                        <option value="">Pilih Kelas Tujuan</option>
                                        {kelasList?.data?.map((kelas: any) => (
                                            <option key={kelas.id} value={kelas.id}>
                                                {kelas.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium">Tahun Ajaran Tujuan</label>
                                    <select
                                        value={tahunAjaranTujuanId}
                                        onChange={(e) => setTahunAjaranTujuanId(e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none transition focus:border-primary/60 focus:bg-white/10"
                                    >
                                        <option value="">Pilih Tahun Ajaran Tujuan</option>
                                        {tahunAjaranList?.data?.map((ta: any) => (
                                            <option key={ta.id} value={ta.id}>
                                                {ta.tahun} ({ta.status})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                    <Button onClick={loadSiswa} disabled={!kelasAsalId}>
                        Muat Siswa dari Kelas Asal
                    </Button>
                </CardContent>
            </Card>

            {siswaList.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Pilih Siswa</CardTitle>
                        <CardDescription>
                            {selectedSiswaIds.length} dari {siswaList.length} siswa dipilih
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedSiswaIds.length === siswaList.length}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="rounded border-white/20"
                                />
                                <span className="text-sm font-medium">Pilih Semua</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10 text-left text-sm text-muted-foreground">
                                            <th className="pb-3 font-medium w-12"></th>
                                            <th className="pb-3 font-medium">NISN</th>
                                            <th className="pb-3 font-medium">Nama</th>
                                            <th className="pb-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {siswaList.map((siswa: any) => (
                                            <tr key={siswa.id} className="border-b border-white/5">
                                                <td className="py-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSiswaIds.includes(siswa.id)}
                                                        onChange={(e) => handleSelectSiswa(siswa.id, e.target.checked)}
                                                        className="rounded border-white/20"
                                                    />
                                                </td>
                                                <td className="py-3">{siswa.nisn}</td>
                                                <td className="py-3">{siswa.nama}</td>
                                                <td className="py-3">{siswa.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {selectedSiswaIds.length > 0 && (
                                <div className={`rounded-lg p-4 ${isGraduationMode ? "bg-green-500/10 text-green-400" : "bg-primary/10"}`}>
                                    <p className="text-sm">
                                        {isGraduationMode ? (
                                            <span>
                                                <strong>{selectedSiswaIds.length} siswa</strong> akan dinyatakan <strong>LULUS</strong> dan menjadi Alumni.
                                            </span>
                                        ) : (
                                            kelasTujuanNama && (
                                                <span>
                                                    <strong>{selectedSiswaIds.length} siswa</strong> akan dipindahkan dari{" "}
                                                    <strong>{kelasAsalNama}</strong> ke <strong>{kelasTujuanNama}</strong>
                                                </span>
                                            )
                                        )}
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={handleProses}
                                disabled={selectedSiswaIds.length === 0 || (!isGraduationMode && !kelasTujuanId) || kenaikanKelasMutation.isPending}
                                className={`w-full ${isGraduationMode ? "bg-green-600 hover:bg-green-700" : ""}`}
                            >
                                {kenaikanKelasMutation.isPending ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                        Memproses...
                                    </>
                                ) : (
                                    isGraduationMode ? "Luluskan Siswa" : "Proses Kenaikan Kelas"
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {showResult && result && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Hasil Kenaikan Kelas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-green-400">
                                    <CheckCircle2 size={20} />
                                    <span><strong>{result.success}</strong> siswa berhasil dipindahkan</span>
                                </div>
                                {result.failed > 0 && (
                                    <div className="flex items-center gap-2 text-red-400">
                                        <XCircle size={20} />
                                        <span><strong>{result.failed}</strong> siswa gagal dipindahkan</span>
                                    </div>
                                )}
                            </div>

                            {result.errors && result.errors.length > 0 && (
                                <div className="rounded-lg bg-red-500/10 p-3 text-sm">
                                    <p className="font-medium mb-2">Error Details:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {result.errors.map((err: any, idx: number) => (
                                            <li key={idx}>{err.error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <Button onClick={() => setShowResult(false)} className="w-full">
                                Tutup
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
