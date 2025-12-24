"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Loader2, Plus, Trash2, Globe, Users, GraduationCap, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api-client";
import { useRole } from "../role-context";

// Reuse standard components/layout from other pages
function FormModal({ onClose, onSubmit, isLoading }: any) {
    const [formData, setFormData] = useState({
        judul: "",
        konten: "",
        targetRoles: [] as string[], // Empty = All, 'SISWA', 'GURU'
    });

    const toggleTarget = (role: string) => {
        setFormData((prev) => {
            const current = prev.targetRoles;
            if (current.includes(role)) {
                return { ...prev, targetRoles: current.filter((r) => r !== role) };
            } else {
                return { ...prev, targetRoles: [...current, role] };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Buat Pengumuman Baru</CardTitle>
                    <CardDescription>Bagikan informasi penting kepada warga sekolah.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Judul Pengumuman</label>
                            <Input
                                required
                                value={formData.judul}
                                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                placeholder="Contoh: Jadwal Libur Semester Ganjil"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Konten / Isi</label>
                            <Textarea
                                required
                                value={formData.konten}
                                onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                                placeholder="Tulis detail pengumuman di sini..."
                                rows={5}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Target Penerima</label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={formData.targetRoles.length === 0 ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, targetRoles: [] })}
                                    className="gap-2"
                                >
                                    <Globe size={14} />
                                    Semua
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.targetRoles.includes("GURU") ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        const others = formData.targetRoles.filter(r => r !== "GURU"); // Remove ALL state if selecting specific
                                        setFormData({ ...formData, targetRoles: formData.targetRoles.length === 0 ? ["GURU"] : (formData.targetRoles.includes("GURU") ? others : [...formData.targetRoles, "GURU"]) });
                                    }}
                                    className="gap-2"
                                >
                                    <Users size={14} />
                                    Guru
                                </Button>
                                <Button
                                    type="button"
                                    variant={formData.targetRoles.includes("SISWA") ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        const others = formData.targetRoles.filter(r => r !== "SISWA");
                                        setFormData({ ...formData, targetRoles: formData.targetRoles.length === 0 ? ["SISWA"] : (formData.targetRoles.includes("SISWA") ? others : [...formData.targetRoles, "SISWA"]) });
                                    }}
                                    className="gap-2"
                                >
                                    <GraduationCap size={14} />
                                    Siswa
                                </Button>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {formData.targetRoles.length === 0
                                    ? "Pengumuman akan dilihat oleh semua pengguna (Siswa & Guru)."
                                    : `Hanya terlihat oleh: ${formData.targetRoles.join(", ")}`}
                            </p>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                                Batal
                            </Button>
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Kirim Pengumuman"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PengumumanPage() {
    const { token, role } = useRole();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const router = useRouter();

    const { data: announcements, isLoading } = useQuery({
        queryKey: ["pengumuman-admin"],
        queryFn: async () => {
            const res = await apiFetch<any[]>("/pengumuman/manage", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res;
        },
        enabled: !!token && role === "ADMIN",
    });

    const createMutation = useMutation({
        mutationFn: (data: any) =>
            apiFetch("/pengumuman", {
                method: "POST",
                body: JSON.stringify(data),
            }, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pengumuman-admin"] });
            setIsCreateModalOpen(false);
            toast({ title: "Berhasil", description: "Pengumuman berhasil dibuat" });
        },
        onError: () => {
            toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            apiFetch(`/pengumuman/${id}`, { method: "DELETE" }, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pengumuman-admin"] });
            toast({ title: "Berhasil", description: "Pengumuman dihapus" });
        },
    });

    if (role !== "ADMIN") {
        return <div className="p-8 text-center text-muted-foreground">Akses ditolak. Halaman ini hanya untuk Admin.</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" onClick={() => router.back()}>
                                <ArrowLeft size={18} />
                            </Button>
                            <CardTitle>Kelola Pengumuman</CardTitle>
                        </div>
                        <CardDescription>Buat dan kelola informasi untuk warga sekolah</CardDescription>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={16} className="mr-2" />
                        Buat Baru
                    </Button>
                </CardHeader>
                <CardContent className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-muted-foreground" />
                        </div>
                    ) : announcements?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            Belum ada pengumuman yang dibuat.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {announcements?.map((item) => (
                                <div key={item.id} className="flex items-start justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{item.judul}</h3>
                                            {item.targetRoles.length === 0 ? (
                                                <Badge tone="info" className="border-border text-muted-foreground text-xs">Semua</Badge>
                                            ) : (
                                                item.targetRoles.map((r: string) => (
                                                    <Badge key={r} tone="info" className="border-border text-indigo-500 bg-indigo-50 text-xs">{r}</Badge>
                                                ))
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{item.konten}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                                            <span>Oleh: {item.author?.name || "Admin"}</span>
                                            <span>•</span>
                                            <span>{format(new Date(item.createdAt), "dd MMM yyyy, HH:mm", { locale: idLocale })}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() => {
                                            if (confirm("Hapus pengumuman ini?")) deleteMutation.mutate(item.id);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {isCreateModalOpen && (
                <FormModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={(data: any) => createMutation.mutate(data)}
                    isLoading={createMutation.isPending}
                />
            )}
        </div>
    );
}
