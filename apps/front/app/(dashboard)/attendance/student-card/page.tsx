"use client";
import { API_URL } from "@/lib/api";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Printer, Download, Users, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRole } from "../../role-context";
import { QRCodeCanvas } from "qrcode.react";
import { useReactToPrint } from "react-to-print";

export default function StudentCardPage() {
    const { token } = useRole();
    const [selectedKelas, setSelectedKelas] = useState<string>("");
    const printRef = useRef<HTMLDivElement>(null);

    const { data: siswaList } = useQuery({
        queryKey: ["siswa-all"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/siswa?limit=1000`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const { data: kelasList } = useQuery({
        queryKey: ["kelas-all"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/kelas`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.json();
        },
    });

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Kartu Pelajar",
    });

    const filteredSiswa = selectedKelas
        ? siswaList?.data?.filter((s: any) => s.kelasId === selectedKelas)
        : siswaList?.data || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Kartu Pelajar</h1>
                    <p className="text-muted-foreground">Generate dan print kartu pelajar dengan QR Code</p>
                </div>
                <Button onClick={handlePrint} disabled={filteredSiswa.length === 0}>
                    <Printer size={16} />
                    Print Kartu
                </Button>
            </div>

            {/* Filter */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users size={20} />
                        Filter Siswa
                    </CardTitle>
                    <CardDescription>Pilih kelas untuk generate kartu</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <select
                            value={selectedKelas}
                            onChange={(e) => setSelectedKelas(e.target.value)}
                            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-primary"
                        >
                            <option value="">Semua Kelas</option>
                            {kelasList?.data?.map((kelas: any) => (
                                <option key={kelas.id} value={kelas.id}>
                                    {kelas.nama}
                                </option>
                            ))}
                        </select>
                        <Button variant="outline" onClick={() => setSelectedKelas("")}>
                            Reset
                        </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {filteredSiswa.length} siswa dipilih
                    </p>
                </CardContent>
            </Card>

            {/* Preview */}
            <Card>
                <CardHeader>
                    <CardTitle>Preview Kartu</CardTitle>
                    <CardDescription>Preview kartu pelajar sebelum print</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-h-[600px] overflow-y-auto">
                        <div ref={printRef} className="space-y-4">
                            {filteredSiswa.map((siswa: any) => (
                                <StudentCard key={siswa.id} siswa={siswa} />
                            ))}
                        </div>
                        {filteredSiswa.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                Tidak ada siswa untuk ditampilkan
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StudentCard({ siswa }: { siswa: any }) {
    const qrRef = useRef<HTMLCanvasElement>(null);

    const handleDownloadQR = () => {
        if (!qrRef.current) return;

        // Convert canvas to blob and download
        qrRef.current.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `QR_${siswa.nisn}_${siswa.nama.replace(/\s+/g, "_")}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    };

    return (
        <div className="border border-border rounded-lg p-6 bg-white text-black print:break-inside-avoid">
            <div className="flex gap-6">
                {/* Photo Placeholder */}
                <div className="w-24 h-32 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <Users size={32} className="text-gray-400" />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                    <div className="border-b border-gray-300 pb-2">
                        <h3 className="text-lg font-bold">KARTU PELAJAR</h3>
                        <p className="text-xs text-gray-600">SMK ARUNIKA LMS</p>
                    </div>

                    <div className="space-y-1 text-sm">
                        <div>
                            <span className="font-semibold">NISN:</span> {siswa.nisn}
                        </div>
                        <div>
                            <span className="font-semibold">Nama:</span> {siswa.nama}
                        </div>
                        <div>
                            <span className="font-semibold">Kelas:</span> {siswa.kelas?.nama || "-"}
                        </div>
                        <div>
                            <span className="font-semibold">Tahun Ajaran:</span>{" "}
                            {siswa.tahunAjaran?.tahun || "-"}
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="mt-4 flex flex-col items-center gap-2">
                        <QRCodeCanvas
                            ref={qrRef}
                            value={siswa.nisn}
                            size={120}
                            level="H"
                            includeMargin={true}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadQR}
                            className="print:hidden"
                        >
                            <Download size={14} />
                            Download QR PNG
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
