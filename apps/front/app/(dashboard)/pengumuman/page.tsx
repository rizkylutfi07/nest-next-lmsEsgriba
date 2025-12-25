"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Loader2, Plus, Trash2, Globe, Users, GraduationCap, ArrowLeft, Edit, Eye, EyeOff, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api-client";
import { useRole } from "../role-context";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
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

interface AnnouncementFormData {
    judul: string;
    konten: string;
    targetRoles: string[];
    isActive?: boolean;
}

interface Announcement {
    id: string;
    judul: string;
    konten: string;
    targetRoles: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    author?: {
        name?: string;
        email?: string;
    };
}

// Detail Modal for viewing announcement (for students/teachers)
// Detail Modal for viewing announcement (for students/teachers)
function AnnouncementDetailModal({
    announcement,
    onClose
}: {
    announcement: Announcement;
    onClose: () => void;
}) {
    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <MessageSquare className="text-primary h-5 w-5" />
                        {announcement.judul}
                    </DialogTitle>
                    <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground pt-1">
                        <Badge tone="info" className="text-xs font-normal bg-muted text-muted-foreground border-border">
                            {announcement.targetRoles?.length > 0
                                ? announcement.targetRoles.join(", ")
                                : "Umum"}
                        </Badge>
                        <span>•</span>
                        <span>{announcement.author?.name || "Admin"}</span>
                        <span>•</span>
                        <span>
                            {format(new Date(announcement.createdAt), "dd MMM yyyy, HH:mm", { locale: idLocale })}
                        </span>
                    </div>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto py-2">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                            {announcement.konten}
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Tutup</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


// Form Modal for Create/Edit (Admin only)
function FormModal({
    onClose,
    onSubmit,
    isLoading,
    initialData
}: {
    onClose: () => void;
    onSubmit: (data: any) => void;
    isLoading: boolean;
    initialData?: Announcement | null;
}) {
    const [formData, setFormData] = useState({
        judul: initialData?.judul || "",
        konten: initialData?.konten || "",
        targetRoles: initialData?.targetRoles || [],
        isActive: initialData?.isActive ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Pengumuman" : "Buat Pengumuman Baru"}</DialogTitle>
                    <DialogDescription>
                        Bagikan informasi penting kepada warga sekolah.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Judul Pengumuman</label>
                        <Input
                            required
                            value={formData.judul}
                            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                            placeholder="Contoh: Jadwal Libur Semester Ganjil"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Konten / Isi</label>
                        <Textarea
                            required
                            value={formData.konten}
                            onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                            placeholder="Tulis detail pengumuman di sini..."
                            rows={6}
                            className="resize-none"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium">Target Penerima</label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={formData.targetRoles.length === 0 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFormData({ ...formData, targetRoles: [] })}
                                className="gap-2 px-3"
                            >
                                <Globe size={14} />
                                Semua
                            </Button>
                            <Button
                                type="button"
                                variant={formData.targetRoles.includes("GURU") ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    const hasGuru = formData.targetRoles.includes("GURU");
                                    setFormData({
                                        ...formData,
                                        targetRoles: hasGuru
                                            ? formData.targetRoles.filter(r => r !== "GURU")
                                            : [...formData.targetRoles, "GURU"]
                                    });
                                }}
                                className="gap-2 px-3"
                            >
                                <Users size={14} />
                                Guru
                            </Button>
                            <Button
                                type="button"
                                variant={formData.targetRoles.includes("SISWA") ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    const hasSiswa = formData.targetRoles.includes("SISWA");
                                    setFormData({
                                        ...formData,
                                        targetRoles: hasSiswa
                                            ? formData.targetRoles.filter(r => r !== "SISWA")
                                            : [...formData.targetRoles, "SISWA"]
                                    });
                                }}
                                className="gap-2 px-3"
                            >
                                <GraduationCap size={14} />
                                Siswa
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border border-border/50">
                            {formData.targetRoles.length === 0
                                ? "Pengumuman akan dilihat oleh semua pengguna (Siswa & Guru)."
                                : `Hanya terlihat oleh: ${formData.targetRoles.join(", ")}`}
                        </p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4 bg-card">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium">Status Pengumuman</label>
                            <p className="text-xs text-muted-foreground">
                                {formData.isActive ? "Pengumuman akan ditampilkan" : "Pengumuman disembunyikan"}
                            </p>
                        </div>
                        <Switch
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : initialData ? "Simpan Perubahan" : "Kirim Pengumuman"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Delete Confirmation Modal (Admin only)
// Delete Confirmation Modal (Admin only)
function DeleteConfirmModal({
    onClose,
    onConfirm,
    isLoading
}: {
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}) {
    return (
        <AlertDialog open={true} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">Hapus Pengumuman</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus pengumuman ini? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Batal</AlertDialogCancel>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Hapus"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// Student/Teacher View Component
function StudentTeacherView({
    announcements,
    isLoading
}: {
    announcements: Announcement[];
    isLoading: boolean;
}) {
    const router = useRouter();
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" onClick={() => router.back()}>
                            <ArrowLeft size={18} />
                        </Button>
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare size={20} />
                                Pengumuman Sekolah
                            </CardTitle>
                            <CardDescription>Informasi penting untuk Anda</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-muted-foreground" />
                        </div>
                    ) : announcements?.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                            Tidak ada pengumuman saat ini.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {announcements?.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative rounded-lg border bg-card p-4 transition-all hover:bg-muted/50 hover:border-primary/50"
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <Badge tone="info" className="text-xs">
                                            {item.targetRoles?.length > 0
                                                ? item.targetRoles.join(", ")
                                                : "Umum"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {format(new Date(item.createdAt), "dd MMM yyyy", { locale: idLocale })}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-base mb-2">{item.judul}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                        {item.konten}
                                    </p>
                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <span className="text-xs text-muted-foreground">
                                            Oleh: {item.author?.name || "Admin"}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedAnnouncement(item)}
                                            className="gap-2"
                                        >
                                            <Eye size={14} />
                                            Lihat Detail
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detail Modal */}
            {selectedAnnouncement && (
                <AnnouncementDetailModal
                    announcement={selectedAnnouncement}
                    onClose={() => setSelectedAnnouncement(null)}
                />
            )}
        </>
    );
}

// Admin View Component
function AdminView({
    announcements,
    isLoading,
    onCreateClick,
    onEditClick,
    onDeleteClick,
    onToggleActive,
    toggleActivePending
}: {
    announcements: Announcement[];
    isLoading: boolean;
    onCreateClick: () => void;
    onEditClick: (announcement: Announcement) => void;
    onDeleteClick: (id: string) => void;
    onToggleActive: (id: string, isActive: boolean) => void;
    toggleActivePending: boolean;
}) {
    const router = useRouter();

    return (
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
                <Button onClick={onCreateClick}>
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
                            <div
                                key={item.id}
                                className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${item.isActive ? "hover:bg-muted/50" : "bg-muted/30 opacity-70"
                                    }`}
                            >
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold">{item.judul}</h3>

                                        {/* Status Badge */}
                                        <Badge
                                            className={`text-xs ${item.isActive
                                                ? "bg-green-100 text-green-700 border-green-300"
                                                : "bg-gray-100 text-gray-600 border-gray-300"
                                                }`}
                                        >
                                            {item.isActive ? (
                                                <>
                                                    <Eye size={12} className="mr-1" />
                                                    Ditampilkan
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff size={12} className="mr-1" />
                                                    Disembunyikan
                                                </>
                                            )}
                                        </Badge>

                                        {/* Target Roles Badges */}
                                        {item.targetRoles.length === 0 ? (
                                            <Badge tone="info" className="border-border text-muted-foreground text-xs">
                                                Semua
                                            </Badge>
                                        ) : (
                                            item.targetRoles.map((r: string) => (
                                                <Badge
                                                    key={r}
                                                    tone="info"
                                                    className="border-border text-indigo-500 bg-indigo-50 text-xs"
                                                >
                                                    {r}
                                                </Badge>
                                            ))
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-2">{item.konten}</p>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                                        <span>Oleh: {item.author?.name || "Admin"}</span>
                                        <span>•</span>
                                        <span>{format(new Date(item.createdAt), "dd MMM yyyy, HH:mm", { locale: idLocale })}</span>
                                        {item.updatedAt !== item.createdAt && (
                                            <>
                                                <span>•</span>
                                                <span className="italic">Diperbarui: {format(new Date(item.updatedAt), "dd MMM yyyy, HH:mm", { locale: idLocale })}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-start gap-1">
                                    {/* Toggle Active/Inactive */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-primary"
                                        onClick={() => onToggleActive(item.id, !item.isActive)}
                                        disabled={toggleActivePending}
                                        title={item.isActive ? "Sembunyikan" : "Tampilkan"}
                                    >
                                        {item.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>

                                    {/* Edit Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-primary"
                                        onClick={() => onEditClick(item)}
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </Button>

                                    {/* Delete Button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() => onDeleteClick(item.id)}
                                        title="Hapus"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Main Page Component
export default function PengumumanPage() {
    const { token, role } = useRole();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [deletingAnnouncementId, setDeletingAnnouncementId] = useState<string | null>(null);

    // Fetch announcements based on role
    const { data: announcements, isLoading } = useQuery({
        queryKey: role === "ADMIN" ? ["pengumuman-admin"] : ["pengumuman"],
        queryFn: async () => {
            const endpoint = role === "ADMIN" ? "/pengumuman/manage" : "/pengumuman";
            const res = await apiFetch<Announcement[]>(endpoint, {}, token);
            return res;
        },
        enabled: !!token,
    });

    const createMutation = useMutation({
        mutationFn: (data: AnnouncementFormData) =>
            apiFetch("/pengumuman", {
                method: "POST",
                body: JSON.stringify(data),
            }, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pengumuman-admin"] });
            queryClient.invalidateQueries({ queryKey: ["pengumuman"] });
            setIsCreateModalOpen(false);
            toast({ title: "Berhasil", description: "Pengumuman berhasil dibuat" });
        },
        onError: () => {
            toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: AnnouncementFormData }) =>
            apiFetch(`/pengumuman/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pengumuman-admin"] });
            queryClient.invalidateQueries({ queryKey: ["pengumuman"] });
            setEditingAnnouncement(null);
            toast({ title: "Berhasil", description: "Pengumuman berhasil diperbarui" });
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
            queryClient.invalidateQueries({ queryKey: ["pengumuman"] });
            setDeletingAnnouncementId(null);
            toast({ title: "Berhasil", description: "Pengumuman berhasil dihapus" });
        },
        onError: () => {
            toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
            setDeletingAnnouncementId(null);
        },
    });

    const toggleActiveMutation = useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            apiFetch(`/pengumuman/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ isActive }),
            }, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pengumuman-admin"] });
            queryClient.invalidateQueries({ queryKey: ["pengumuman"] });
            toast({
                title: "Berhasil",
                description: "Status pengumuman berhasil diubah"
            });
        },
        onError: () => {
            toast({ title: "Gagal", description: "Terjadi kesalahan", variant: "destructive" });
        },
    });

    return (
        <div className="space-y-6">
            {/* Render different views based on role */}
            {role === "ADMIN" ? (
                <AdminView
                    announcements={announcements || []}
                    isLoading={isLoading}
                    onCreateClick={() => setIsCreateModalOpen(true)}
                    onEditClick={(announcement) => setEditingAnnouncement(announcement)}
                    onDeleteClick={(id) => setDeletingAnnouncementId(id)}
                    onToggleActive={(id, isActive) => toggleActiveMutation.mutate({ id, isActive })}
                    toggleActivePending={toggleActiveMutation.isPending}
                />
            ) : (
                <StudentTeacherView
                    announcements={announcements || []}
                    isLoading={isLoading}
                />
            )}

            {/* Admin-only Modals */}
            {role === "ADMIN" && (
                <>
                    {/* Create Modal */}
                    {isCreateModalOpen && (
                        <FormModal
                            onClose={() => setIsCreateModalOpen(false)}
                            onSubmit={(data) => createMutation.mutate(data)}
                            isLoading={createMutation.isPending}
                        />
                    )}

                    {/* Edit Modal */}
                    {editingAnnouncement && (
                        <FormModal
                            onClose={() => setEditingAnnouncement(null)}
                            onSubmit={(data) => updateMutation.mutate({
                                id: editingAnnouncement.id,
                                data
                            })}
                            isLoading={updateMutation.isPending}
                            initialData={editingAnnouncement}
                        />
                    )}

                    {/* Delete Confirmation Modal */}
                    {deletingAnnouncementId && (
                        <DeleteConfirmModal
                            onClose={() => setDeletingAnnouncementId(null)}
                            onConfirm={() => deleteMutation.mutate(deletingAnnouncementId)}
                            isLoading={deleteMutation.isPending}
                        />
                    )}
                </>
            )}
        </div>
    );
}
