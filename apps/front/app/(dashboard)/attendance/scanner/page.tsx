"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, CheckCircle2, AlertCircle, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../../role-context";
import { useMutation } from "@tanstack/react-query";
import { apiBaseUrl } from "@/lib/api-client";

export default function ScannerPage() {
    const { token } = useRole();
    const [isScanning, setIsScanning] = useState(false);
    const [lastScan, setLastScan] = useState<any>(null);
    const [manualNisn, setManualNisn] = useState("");
    const [scanMode, setScanMode] = useState<"check-in" | "check-out">("check-in");
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDuplicate, setIsDuplicate] = useState(false);

    const scanMutation = useMutation({
        mutationFn: async (nisn: string) => {
            const endpoint = scanMode === "check-in" ? "/attendance/scan" : "/attendance/check-out";
            const res = await fetch(`${apiBaseUrl}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ [scanMode === "check-in" ? "nisn" : "siswaId"]: nisn }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Scan failed");
            }

            return res.json();
        },
        onSuccess: (data) => {
            setLastScan({ ...data, mode: scanMode });
            setIsDuplicate(false);

            // Stop scanner on success
            stopScanner();

            // Play success sound with error handling
            try {
                const audio = new Audio("/success.mp3");
                audio.volume = 0.5;
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch((err) => {
                        console.log("Audio play skipped:", err.name);
                    });
                }
            } catch (err) {
                // Ignore audio errors
            }

            // Clear after 10 seconds
            setTimeout(() => setLastScan(null), 10000);
        },
        onError: (error: any) => {
            // Check if this is a duplicate scan error
            const isDuplicateError = error.message.includes("sudah melakukan") || error.message.includes("Sudah melakukan");

            if (isDuplicateError) {
                setIsDuplicate(true);
                setError(error.message);
                // Stop scanner for duplicate
                stopScanner();
            } else {
                setIsDuplicate(false);
                setError(error.message);
            }

            // Play error/warning sound
            try {
                const audio = new Audio("/error.mp3");
                audio.volume = 0.5;
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch((err) => {
                        console.log("Audio play skipped:", err.name);
                    });
                }
            } catch (err) {
                // Ignore audio errors
            }

            // Clear after 10 seconds
            setTimeout(() => {
                setError(null);
                setIsDuplicate(false);
            }, 10000);
        },
    });

    const startScanner = async () => {
        try {
            setError(null);

            // Check if camera is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Camera API not supported in this browser");
            }

            // Request camera permission first
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }
                });
                // Stop the test stream
                stream.getTracks().forEach(track => track.stop());
            } catch (permErr: any) {
                throw new Error(`Camera permission denied: ${permErr.message}`);
            }

            const scanner = new Html5Qrcode("reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                (decodedText) => {
                    // Successfully scanned - send to API
                    scanMutation.mutate(decodedText);
                },
                (errorMessage) => {
                    // Ignore scan errors (happens continuously when no barcode detected)
                }
            );

            setIsScanning(true);
        } catch (err: any) {
            console.error("Camera error:", err);
            setError("Failed to start camera: " + err.message);
            setIsScanning(false);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                const state = await scannerRef.current.getState();
                // Only stop if scanner is actually running
                if (state === 2) { // 2 = SCANNING state
                    await scannerRef.current.stop();
                }
            } catch (err) {
                // Ignore errors when stopping - scanner might already be stopped
                console.log("Scanner stop skipped:", err);
            } finally {
                scannerRef.current = null;
                setIsScanning(false);
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

            {/* Mode Toggle */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                setScanMode("check-in");
                                setLastScan(null);
                                setError(null);
                            }}
                            variant={scanMode === "check-in" ? "default" : "outline"}
                            className="flex-1"
                        >
                            Datang (Check-In)
                        </Button>
                        <Button
                            onClick={() => {
                                setScanMode("check-out");
                                setLastScan(null);
                                setError(null);
                            }}
                            variant={scanMode === "check-out" ? "default" : "outline"}
                            className="flex-1"
                        >
                            Pulang (Check-Out)
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Scanner Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Camera size={20} />
                        Camera Scanner - {scanMode === "check-in" ? "Datang" : "Pulang"}
                    </CardTitle>
                    <CardDescription>
                        {scanMode === "check-in"
                            ? "Arahkan kamera ke QR Code untuk mencatat kedatangan siswa"
                            : "Arahkan kamera ke QR Code untuk mencatat kepulangan siswa"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Camera View */}
                        <div className="relative rounded-lg overflow-hidden bg-black border border-border min-h-[400px]">
                            <div id="reader" style={{ width: '100%' }}></div>
                            {!isScanning && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                    <div className="text-center">
                                        <Camera size={48} className="mx-auto mb-4 text-muted-foreground" />
                                        <p className="text-muted-foreground">Camera tidak aktif</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Debug Info */}
                        {isScanning && (
                            <div className="text-xs text-muted-foreground bg-blue-500/10 p-2 rounded border border-blue-500/20">
                                ✓ Scanner aktif - Arahkan kamera ke QR Code
                            </div>
                        )}

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
                                <h3 className="text-lg font-semibold text-green-500">
                                    {lastScan.mode === "check-in" ? "Check-In Berhasil!" : "Check-Out Berhasil!"}
                                </h3>
                                <div className="mt-2 space-y-1 text-sm">
                                    <p><strong>Nama:</strong> {lastScan.siswa?.nama}</p>
                                    <p><strong>NISN:</strong> {lastScan.siswa?.nisn}</p>
                                    <p><strong>Kelas:</strong> {lastScan.siswa?.kelas?.nama || "-"}</p>
                                    {lastScan.mode === "check-in" ? (
                                        <>
                                            <p><strong>Status:</strong> <span className={lastScan.status === "TERLAMBAT" ? "text-yellow-500" : "text-green-500"}>{lastScan.status}</span></p>
                                            <p><strong>Jam Masuk:</strong> {new Date(lastScan.jamMasuk).toLocaleTimeString("id-ID")}</p>
                                        </>
                                    ) : (
                                        <p><strong>Jam Keluar:</strong> {new Date(lastScan.jamKeluar).toLocaleTimeString("id-ID")}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error/Warning Feedback */}
            {error && (
                <Card className={isDuplicate ? "border-yellow-500/50 bg-yellow-500/10" : "border-red-500/50 bg-red-500/10"}>
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <AlertCircle className={isDuplicate ? "text-yellow-500" : "text-red-500"} size={32} />
                            <div className="flex-1">
                                <h3 className={`text-lg font-semibold ${isDuplicate ? "text-yellow-500" : "text-red-500"}`}>
                                    {isDuplicate ? "Sudah Absen" : "Error"}
                                </h3>
                                <p className="mt-2 text-sm">{error}</p>
                                {isDuplicate && (
                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Siswa ini sudah melakukan absensi hari ini. Klik "Mulai Scan" untuk scan siswa lain.
                                    </p>
                                )}
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
