"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportModalProps {
    title: string;
    description: string;
    endpoint: string;
    onClose: () => void;
    onSuccess: () => void;
    token: string | null;
}

export function ImportModal({ title, description, endpoint, onClose, onSuccess, token }: ImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`http://localhost:3001/${endpoint}/import`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error('Import failed');

            const data = await res.json();
            setResult(data);

            if (data.success > 0) {
                toast({
                    title: "Berhasil!",
                    description: `${data.success} data berhasil diimport`,
                });
                setTimeout(() => onSuccess(), 2000);
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || 'Gagal import data',
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{title}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={18} />
                        </Button>
                    </div>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {!result ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={!file || isLoading} className="flex-1">
                                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Upload"}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm"><strong>Berhasil:</strong> {result.success}</p>
                            <p className="text-sm"><strong>Gagal:</strong> {result.failed}</p>
                            <p className="text-sm"><strong>Dilewati:</strong> {result.skipped}</p>
                            {result.errors?.length > 0 && (
                                <div className="mt-4 max-h-48 overflow-y-auto">
                                    <p className="text-sm font-medium mb-2">Errors:</p>
                                    {result.errors.slice(0, 5).map((err: any, i: number) => (
                                        <p key={i} className="text-xs text-red-500">Row {err.row}: {err.error}</p>
                                    ))}
                                </div>
                            )}
                            <Button onClick={onClose} className="w-full mt-4">Tutup</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
