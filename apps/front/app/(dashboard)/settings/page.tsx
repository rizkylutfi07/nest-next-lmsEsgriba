"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Settings as SettingsIcon, Save } from "lucide-react";
import { useRole } from "../role-context";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
    const { token } = useRole();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [lateTime, setLateTime] = useState("07:30");

    const { data: settings, isLoading } = useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3001/settings", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    useEffect(() => {
        if (settings) {
            const lateSetting = settings.find((s: any) => s.key === "late_time_threshold");
            if (lateSetting) {
                setLateTime(lateSetting.value);
            }
        }
    }, [settings]);

    const updateMutation = useMutation({
        mutationFn: async (value: string) => {
            const res = await fetch("http://localhost:3001/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    key: "late_time_threshold",
                    value: value,
                }),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Failed to update' }));
                throw new Error(errorData.message || `HTTP ${res.status}: Failed to update`);
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            toast({ title: "Sukses", description: "Pengaturan berhasil disimpan!" });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        },
    });

    const handleSave = () => {
        updateMutation.mutate(lateTime);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Pengaturan Sistem</h1>
                <p className="text-muted-foreground">Kelola pengaturan sistem absensi</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <SettingsIcon size={20} />
                        <CardTitle>Pengaturan Absensi</CardTitle>
                    </div>
                    <CardDescription>
                        Atur parameter untuk sistem absensi
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-muted-foreground" size={32} />
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Batas Waktu Terlambat
                                </label>
                                <p className="text-sm text-muted-foreground">
                                    Siswa yang datang setelah waktu ini akan ditandai sebagai terlambat
                                </p>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="time"
                                        value={lateTime}
                                        onChange={(e) => setLateTime(e.target.value)}
                                        className="rounded-lg border border-border bg-background px-4 py-2 outline-none transition focus:border-primary/60"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        (Format: HH:MM)
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleSave}
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Simpan Pengaturan
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Informasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>
                        <strong>Batas Waktu Terlambat:</strong> Waktu ini digunakan untuk menentukan apakah siswa terlambat saat melakukan scan barcode.
                    </p>
                    <p className="text-muted-foreground">
                        Contoh: Jika diatur ke 07:30, siswa yang scan setelah jam 07:30 akan otomatis ditandai sebagai "Terlambat".
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
