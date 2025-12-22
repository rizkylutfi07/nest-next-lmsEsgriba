"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    UserCircle,
    Mail,
    Shield,
    Calendar,
    X,
    Loader2,
    KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usersApi, type User, type CreateUserData, type UpdateUserData } from "@/lib/users-api";
import { useRole } from "../role-context";
import { cn } from "@/lib/utils";

const roleColors = {
    ADMIN: "bg-red-500/10 text-red-500 border-red-500/20",
    GURU: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    SISWA: "bg-green-500/10 text-green-500 border-green-500/20",
    PETUGAS_ABSENSI: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

const roleLabels = {
    ADMIN: "Admin",
    GURU: "Guru",
    SISWA: "Siswa",
    PETUGAS_ABSENSI: "Petugas Absensi",
};

export default function UsersPage() {
    const { token } = useRole();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [page, setPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [resettingPasswordUser, setResettingPasswordUser] = useState<User | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["users", page, search, selectedRole],
        queryFn: () =>
            usersApi.getUsers(
                {
                    page,
                    limit: 10,
                    search: search || undefined,
                    role: selectedRole as any || undefined,
                },
                token
            ),
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateUserData) => usersApi.createUser(data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setIsCreateModalOpen(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
            usersApi.updateUser(id, data, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setEditingUser(null);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => usersApi.deleteUser(id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setDeletingUser(null);
        },
    });

    const resetPasswordMutation = useMutation({
        mutationFn: ({ userId, newPassword }: { userId: string; newPassword: string }) =>
            fetch("http://localhost:3001/auth/admin/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, newPassword }),
            }).then((res) => {
                if (!res.ok) throw new Error("Gagal reset password");
                return res.json();
            }),
        onSuccess: () => {
            setResettingPasswordUser(null);
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Kelola User</h1>
                    <p className="text-muted-foreground">Manajemen pengguna sistem</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={16} />
                    Tambah User
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle>Daftar User</CardTitle>
                            <CardDescription>
                                Total {data?.meta.total || 0} pengguna terdaftar
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau email..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <select
                                value={selectedRole}
                                onChange={(e) => {
                                    setSelectedRole(e.target.value);
                                    setPage(1);
                                }}
                                className="rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Semua Role</option>
                                <option value="ADMIN">Admin</option>
                                <option value="GURU">Guru</option>
                                <option value="SISWA">Siswa</option>
                                <option value="PETUGAS_ABSENSI">Petugas Absensi</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-muted-foreground" size={32} />
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border text-left text-sm text-muted-foreground">
                                            <th className="pb-3 font-medium">User</th>
                                            <th className="pb-3 font-medium">Email</th>
                                            <th className="pb-3 font-medium">Role</th>
                                            <th className="pb-3 font-medium">Terdaftar</th>
                                            <th className="pb-3 font-medium text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.data.map((user) => (
                                            <tr key={user.id} className="border-b border-white/5 transition hover:bg-muted/40">
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                            <UserCircle size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{user.name}</p>
                                                            <p className="text-xs text-muted-foreground">ID: {user.id.slice(0, 8)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Mail size={14} />
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <Badge className={cn("border", roleColors[user.role])}>
                                                        <Shield size={12} className="mr-1" />
                                                        {roleLabels[user.role]}
                                                    </Badge>
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar size={14} />
                                                        {new Date(user.createdAt).toLocaleDateString("id-ID")}
                                                    </div>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setEditingUser(user)}
                                                        >
                                                            <Pencil size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setResettingPasswordUser(user)}
                                                            title="Reset Password"
                                                        >
                                                            <KeyRound size={14} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setDeletingUser(user)}
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {data && data.meta.totalPages > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Halaman {data.meta.page} dari {data.meta.totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page === 1}
                                            onClick={() => setPage(page - 1)}
                                        >
                                            Sebelumnya
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page === data.meta.totalPages}
                                            onClick={() => setPage(page + 1)}
                                        >
                                            Selanjutnya
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <UserFormModal
                    title="Tambah User Baru"
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={(data) => createMutation.mutate(data)}
                    isLoading={createMutation.isPending}
                />
            )}

            {/* Edit Modal */}
            {editingUser && (
                <UserFormModal
                    title="Edit User"
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSubmit={(data) => updateMutation.mutate({ id: editingUser.id, data })}
                    isLoading={updateMutation.isPending}
                />
            )}

            {/* Delete Confirmation */}
            {deletingUser && (
                <DeleteConfirmModal
                    user={deletingUser}
                    onClose={() => setDeletingUser(null)}
                    onConfirm={() => deleteMutation.mutate(deletingUser.id)}
                    isLoading={deleteMutation.isPending}
                />
            )}

            {/* Reset Password Modal */}
            {resettingPasswordUser && (
                <ResetPasswordModal
                    user={resettingPasswordUser}
                    onClose={() => setResettingPasswordUser(null)}
                    onConfirm={(newPassword) => resetPasswordMutation.mutate({ userId: resettingPasswordUser.id, newPassword })}
                    isLoading={resetPasswordMutation.isPending}
                />
            )}
        </div>
    );
}

function UserFormModal({
    title,
    user,
    onClose,
    onSubmit,
    isLoading,
}: {
    title: string;
    user?: User;
    onClose: () => void;
    onSubmit: (data: CreateUserData | UpdateUserData) => void;
    isLoading: boolean;
}) {
    const [formData, setFormData] = useState({
        email: user?.email || "",
        name: user?.name || "",
        password: "",
        role: user?.role || "SISWA",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: any = {
            email: formData.email,
            name: formData.name,
            role: formData.role as any,
        };
        if (formData.password) {
            data.password = formData.password;
        }
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{title}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={18} />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Nama</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Password {user && "(kosongkan jika tidak ingin mengubah)"}
                            </label>
                            <input
                                type="password"
                                required={!user}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Role</label>
                            <select
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="SISWA">Siswa</option>
                                <option value="GURU">Guru</option>
                                <option value="ADMIN">Admin</option>
                                <option value="PETUGAS_ABSENSI">Petugas Absensi</option>
                            </select>
                        </div>
                        <div className="flex gap-2 pt-4">
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

function DeleteConfirmModal({
    user,
    onClose,
    onConfirm,
    isLoading,
}: {
    user: User;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Hapus User</CardTitle>
                    <CardDescription>
                        Apakah Anda yakin ingin menghapus user <strong>{user.name}</strong>?
                        Tindakan ini tidak dapat dibatalkan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Hapus"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ResetPasswordModal({
    user,
    onClose,
    onConfirm,
    isLoading,
}: {
    user: User;
    onClose: () => void;
    onConfirm: (newPassword: string) => void;
    isLoading: boolean;
}) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Password tidak cocok!");
            return;
        }
        if (newPassword.length < 6) {
            alert("Password minimal 6 karakter!");
            return;
        }
        onConfirm(newPassword);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound size={20} />
                            Reset Password
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={18} />
                        </Button>
                    </div>
                    <CardDescription>
                        Reset password untuk user <strong>{user.name}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Password Baru</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minimal 6 karakter"
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Konfirmasi Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Ulangi password baru"
                                className="w-full rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                                Batal
                            </Button>
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Reset Password"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
