"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Mail, Shield, Calendar, Loader2, Edit, GraduationCap, IdCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRole } from "../role-context";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
    const { user, token } = useRole();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
    });

    const updateMutation = useMutation({
        mutationFn: async (data: { name: string; email: string }) => {
            const res = await fetch("http://localhost:3001/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Gagal mengupdate profil");
            return res.json();
        },
        onSuccess: async () => {
            toast({ title: "Sukses", description: "Profil berhasil diupdate!" });

            // Fetch fresh user data from backend
            try {
                const userRes = await fetch("http://localhost:3001/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (userRes.ok) {
                    const freshUserData = await userRes.json();
                    // Update localStorage with fresh data
                    const authData = localStorage.getItem("arunika-auth");
                    if (authData) {
                        const parsed = JSON.parse(authData);
                        parsed.user = freshUserData;
                        localStorage.setItem("arunika-auth", JSON.stringify(parsed));
                    }
                }
            } catch (err) {
                console.error("Failed to refresh user data:", err);
            }

            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            setIsEditing(false);
            // Reload to refresh user context
            setTimeout(() => window.location.reload(), 500);
        },
        onError: (error: Error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const getInitials = (name?: string | null) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold">Profil Saya</h1>
                <p className="text-muted-foreground">Kelola informasi profil Anda</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informasi Pribadi</CardTitle>
                    <CardDescription>Data pribadi dan informasi akun Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24 border-4 border-primary/20">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-background text-2xl font-bold">
                                {getInitials(user?.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-semibold">{user?.name || "Pengguna"}</h3>
                            <p className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</p>
                            <p className="text-sm text-primary capitalize mt-1">{user?.role?.toLowerCase() || "User"}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <User size={16} />
                                Nama Lengkap
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!isEditing}
                                placeholder="Nama lengkap Anda"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Mail size={16} />
                                Email
                            </label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={!isEditing}
                                placeholder="email@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Shield size={16} />
                                Role
                            </label>
                            <Input
                                value={user?.role || ""}
                                disabled
                                className="capitalize"
                            />
                        </div>

                        {user?.role === "SISWA" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <GraduationCap size={16} />
                                    Kelas
                                </label>
                                <Input
                                    value={user?.siswa?.kelas?.nama || "-"}
                                    disabled
                                />
                            </div>
                        )}

                        {user?.role === "SISWA" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <IdCard size={16} />
                                    NISN
                                </label>
                                <Input
                                    value={user?.siswa?.nisn || "-"}
                                    disabled
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Calendar size={16} />
                                Member Since
                            </label>
                            <Input
                                value={new Date(user?.createdAt || Date.now()).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                                disabled
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            {isEditing ? (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: user?.name || "",
                                                email: user?.email || "",
                                            });
                                        }}
                                    >
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={updateMutation.isPending}>
                                        {updateMutation.isPending ? (
                                            <>
                                                <Loader2 className="animate-spin" size={16} />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            "Simpan Perubahan"
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <Button type="button" onClick={() => setIsEditing(true)}>
                                    <Edit size={16} />
                                    Edit Profil
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
