"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, CheckCircle2, AlertCircle, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../../role-context";
import { useMutation } from "@tanstack/react-query";

export default function ScannerPage() {
    const { token } = useRole();
    const [isScanning, setIsScanning] = useState(false);
    const [lastScan, setLastScan] = useState<any>(null);
    const [manualNisn, setManualNisn] = useState("");
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState<string | null>(null);

    const scanMutation = useMutation({
        mutationFn: async (nisn: string) => {
            const res = await fetch("http://localhost:3001/attendance/scan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ nisn }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Scan failed");
            }

            return res.json();
        },
        onSuccess: (data) => {
            setLastScan(data);
            // Play success sound
            const audio = new Audio("/success.mp3");
            audio.play().catch(() => { });

            // Clear after 5 seconds
            setTimeout(() => setLastScan(null), 5000);
        },
        onError: (error: any) => {
            setError(error.message);
            // Play error sound
            const audio = new Audio("/error.mp3");
            audio.play().catch(() => { });

            setTimeout(() => setError(null), 5000);
        },
    });

    const startScanner = async () => {
        try {
            const scanner = new Html5Qrcode("reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    // Successfully scanned
                    scanMutation.mutate(decodedText);
                    // Stop scanner briefly to prevent multiple scans
                    stopScanner();
                    setTimeout(() => startScanner(), 2000);
                },
                (errorMessage) => {
                    // Ignore scan errors (happens continuously when no barcode detected)
                }
            );

            setIsScanning(true);
        } catch (err: any) {
            setError("Failed to start camera: " + err.message);
            setIsScanning(false);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                scannerRef.current = null;
                setIsScanning(false);
            } catch (err) {
                console.error("Error stopping scanner:", err);
            }
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualNisn.trim()) {
            scanMutation.mutate(manualNisn.trim());
            setManualNisn("");
        }
    };

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">QR Code Scanner</h1>
                <p className="text-muted-foreground">Scan QR Code kartu pelajar siswa untuk absensi</p>
            </div>

            {/* Scanner Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Camera size={20} />
                        Camera Scanner
                    </CardTitle>
                    <CardDescription>
                        Arahkan kamera ke QR Code pada kartu pelajar siswa
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Camera View */}
                        <div className="relative rounded-lg overflow-hidden bg-black/5 border border-border">
                            <div id="reader" className={isScanning ? "" : "hidden"}></div>
                            {!isScanning && (
                                <div className="flex items-center justify-center h-64">
                                    <div className="text-center">
                                        <Camera size={48} className="mx-auto mb-4 text-muted-foreground" />
                                        <p className="text-muted-foreground">Camera tidak aktif</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Scanner Controls */}
                        <div className="flex gap-2">
                            {!isScanning ? (
                                <Button onClick={startScanner} className="flex-1">
                                    <Camera size={16} />
                                    Mulai Scan
                                </Button>
                            ) : (
                                <Button onClick={stopScanner} variant="destructive" className="flex-1">
                                    <X size={16} />
                                    Stop Scan
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Manual Input */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User size={20} />
                        Input Manual
                    </CardTitle>
                    <CardDescription>
                        Masukkan NISN secara manual jika scanner tidak berfungsi
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleManualSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={manualNisn}
                            onChange={(e) => setManualNisn(e.target.value)}
                            placeholder="Masukkan NISN..."
                            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-primary"
                        />
                        <Button type="submit" disabled={scanMutation.isPending || !manualNisn.trim()}>
                            {scanMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : "Submit"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Success Feedback */}
            {lastScan && (
                <Card className="border-green-500/50 bg-green-500/10">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <CheckCircle2 className="text-green-500" size={32} />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-green-500">Absensi Berhasil!</h3>
                                <div className="mt-2 space-y-1 text-sm">
                                    <p><strong>Nama:</strong> {lastScan.siswa?.nama}</p>
                                    <p><strong>NISN:</strong> {lastScan.siswa?.nisn}</p>
                                    <p><strong>Kelas:</strong> {lastScan.siswa?.kelas || "-"}</p>
                                    <p><strong>Status:</strong> <span className={lastScan.status === "TERLAMBAT" ? "text-yellow-500" : "text-green-500"}>{lastScan.status}</span></p>
                                    <p><strong>Jam Masuk:</strong> {new Date(lastScan.jamMasuk).toLocaleTimeString("id-ID")}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error Feedback */}
            {error && (
                <Card className="border-red-500/50 bg-red-500/10">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="text-red-500" size={32} />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-red-500">Error</h3>
                                <p className="mt-2 text-sm">{error}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>Petunjuk Penggunaan</CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Klik "Mulai Scan" untuk mengaktifkan kamera</li>
                        <li>Arahkan kamera ke QR Code pada kartu pelajar siswa</li>
                        <li>Scanner akan otomatis membaca QR Code dan mencatat absensi</li>
                        <li>Jika scanner tidak berfungsi, gunakan input manual dengan memasukkan NISN</li>
                        <li>Siswa yang datang setelah jam 07:30 akan tercatat sebagai TERLAMBAT</li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
}
