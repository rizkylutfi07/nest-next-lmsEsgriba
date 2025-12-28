"use client";
import { API_URL } from "@/lib/api";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "../role-context";
import { useToast } from "@/hooks/use-toast";

export default function ChangePasswordPage() {
    const { token } = useRole();
    const { toast } = useToast();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const changePasswordMutation = useMutation({
        mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
            const res = await fetch(`${API_URL}/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Gagal mengganti password");
            }
            return res.json();
        },
        onSuccess: () => {
            toast({
                title: "Sukses",
                description: "Password berhasil diubah!",
            });
            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            toast({
                title: "Perhatian",
                description: "Semua field harus diisi!",
                variant: "destructive",
            });
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast({
                title: "Perhatian",
                description: "Password baru dan konfirmasi tidak cocok!",
                variant: "destructive",
            });
            return;
        }

        if (formData.newPassword.length < 6) {
            toast({
                title: "Perhatian",
                description: "Password baru minimal 6 karakter!",
                variant: "destructive",
            });
            return;
        }

        changePasswordMutation.mutate({
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
        });
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold">Ganti Password</h1>
                <p className="text-muted-foreground">Ubah kata sandi akun Anda</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <KeyRound size={20} />
                        Keamanan Akun
                    </CardTitle>
                    <CardDescription>
                        Pastikan menggunakan password yang kuat dan unik
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Old Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password Lama</label>
                            <div className="relative">
                                <Input
                                    type={showOldPassword ? "text" : "password"}
                                    value={formData.oldPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, oldPassword: e.target.value })
                                    }
                                    placeholder="Masukkan password lama"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                                >
                                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password Baru</label>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, newPassword: e.target.value })
                                    }
                                    placeholder="Masukkan password baru (min. 6 karakter)"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Konfirmasi Password Baru</label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({ ...formData, confirmPassword: e.target.value })
                                    }
                                    placeholder="Ulangi password baru"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                            <p className="text-sm font-medium mb-2">Persyaratan Password:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={14} className={formData.newPassword.length >= 6 ? "text-green-500" : "text-muted-foreground"} />
                                    Minimal 6 karakter
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle size={14} className={formData.newPassword === formData.confirmPassword && formData.newPassword.length > 0 ? "text-green-500" : "text-muted-foreground"} />
                                    Password cocok dengan konfirmasi
                                </li>
                            </ul>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={changePasswordMutation.isPending}
                        >
                            {changePasswordMutation.isPending ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Mengubah Password...
                                </>
                            ) : (
                                <>
                                    <KeyRound size={16} />
                                    Ubah Password
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
