"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Upload, Loader2, X, Database, AlertTriangle, Trash2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../role-context";

export default function DatabasePage() {
    const { token, role } = useRole();
    const queryClient = useQueryClient();
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Check if user is admin
    if (role !== 'ADMIN') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>Only administrators can access database management.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const { data: backups, isLoading } = useQuery({
        queryKey: ["database-backups"],
        queryFn: async () => {
            const res = await fetch('http://localhost:3001/database/backups', {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const handleExport = async () => {
        const res = await fetch('http://localhost:3001/database/export', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `database_backup_${new Date().toISOString().split('T')[0]}.sql`;
        a.click();
    };

    const deleteMutation = useMutation({
        mutationFn: async (filename: string) => {
            const res = await fetch(`http://localhost:3001/database/backups/${filename}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["database-backups"] });
        },
    });

    const handleDownloadBackup = async (filename: string) => {
        const res = await fetch(`http://localhost:3001/database/backups/${filename}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Database Management</h1>
                    <p className="text-muted-foreground">Backup and restore database</p>
                </div>
            </div>

            {/* Export Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Download size={20} />
                        Export Database
                    </CardTitle>
                    <CardDescription>
                        Download a complete backup of the database as SQL file
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleExport}>
                        <Download size={16} />
                        Export Database
                    </Button>
                </CardContent>
            </Card>

            {/* Import Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload size={20} />
                        Import Database
                    </CardTitle>
                    <CardDescription>
                        Restore database from SQL backup file
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 mb-4">
                        <div className="flex gap-2">
                            <AlertTriangle className="text-yellow-500" size={20} />
                            <div className="text-sm">
                                <p className="font-medium text-yellow-500">Warning</p>
                                <p className="text-muted-foreground">
                                    Importing will overwrite existing database data. An automatic backup will be created before import.
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => setIsImportModalOpen(true)} variant="outline">
                        <Upload size={16} />
                        Import Database
                    </Button>
                </CardContent>
            </Card>

            {/* Backup History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database size={20} />
                        Backup History
                    </CardTitle>
                    <CardDescription>
                        List of automatic and manual backups
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="animate-spin text-muted-foreground" size={32} />
                        </div>
                    ) : backups?.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No backups available</p>
                    ) : (
                        <div className="space-y-2">
                            {backups?.map((backup: any) => (
                                <div
                                    key={backup.filename}
                                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition"
                                >
                                    <div>
                                        <p className="font-medium">{backup.filename}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(backup.created).toLocaleString()} • {(backup.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDownloadBackup(backup.filename)}
                                        >
                                            <FileDown size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm(`Delete backup ${backup.filename}?`)) {
                                                    deleteMutation.mutate(backup.filename);
                                                }
                                            }}
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

            {isImportModalOpen && (
                <ImportModal
                    onClose={() => setIsImportModalOpen(false)}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ["database-backups"] });
                        setIsImportModalOpen(false);
                    }}
                    token={token}
                />
            )}
        </div>
    );
}

function ImportModal({ onClose, onSuccess, token }: { onClose: () => void; onSuccess: () => void; token: string | null }) {
    const [file, setFile] = useState<File | null>(null);
    const [createBackup, setCreateBackup] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async () => {
        if (!file) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`http://localhost:3001/database/import?createBackup=${createBackup}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Import failed');
            }

            const data = await res.json();
            alert(`Database imported successfully! ${data.backupFile ? `Backup created: ${data.backupFile}` : ''}`);
            onSuccess();
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Import Database</CardTitle>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={18} />
                        </Button>
                    </div>
                    <CardDescription>
                        Upload SQL backup file to restore database
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!showConfirm ? (
                        <div className="space-y-4">
                            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
                                <div className="flex gap-2">
                                    <AlertTriangle className="text-red-500" size={20} />
                                    <div className="text-sm">
                                        <p className="font-medium text-red-500">Critical Warning</p>
                                        <p className="text-muted-foreground">
                                            This action will OVERWRITE all existing data in the database. This cannot be undone without a backup.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <input
                                    type="file"
                                    accept=".sql"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 outline-none"
                                />
                                {file && (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={createBackup}
                                    onChange={(e) => setCreateBackup(e.target.checked)}
                                    className="rounded border-white/20"
                                />
                                <span className="text-sm">Create automatic backup before import (recommended)</span>
                            </label>

                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => setShowConfirm(true)}
                                    disabled={!file}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
                                <p className="font-medium text-yellow-500 mb-2">Final Confirmation</p>
                                <p className="text-sm text-muted-foreground">
                                    Are you absolutely sure you want to import this database? This will replace all current data.
                                </p>
                                {createBackup && (
                                    <p className="text-sm text-green-500 mt-2">
                                        ✓ Automatic backup will be created before import
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowConfirm(false)} className="flex-1">
                                    Go Back
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Import Now"}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
