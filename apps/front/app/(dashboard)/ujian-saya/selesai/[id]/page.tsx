"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Home, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRole } from "../../../role-context";
import confetti from "canvas-confetti";

export default function SelesaiUjianPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useRole();
    const ujianSiswaId = params.id as string;
    const [showContent, setShowContent] = useState(false);

    // Fetch exam result
    const { data: result } = useQuery({
        queryKey: ["ujian-result", ujianSiswaId],
        queryFn: async () => {
            if (!token) return null;
            const res = await fetch(
                `http://localhost:3001/ujian-siswa/review/${ujianSiswaId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) return null;
            return res.json();
        },
        enabled: Boolean(token),
    });

    // Trigger confetti and show content animation
    useEffect(() => {
        // Delay content appearance
        const timer = setTimeout(() => setShowContent(true), 300);

        // Fire confetti
        const duration = 2000;
        const end = Date.now() + duration;

        const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899"];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();

        return () => clearTimeout(timer);
    }, []);

    const handleGoHome = () => {
        router.replace("/");
    };

    const handleViewResult = () => {
        router.push(`/ujian-saya/hasil/${ujianSiswaId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4">
            <div
                className={`max-w-md w-full transform transition-all duration-700 ${showContent
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-8 scale-95"
                    }`}
            >
                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
                    <CardContent className="p-8 text-center space-y-6">
                        {/* Success Icon */}
                        <div className="relative mx-auto w-28 h-28">
                            <div className="absolute inset-0 bg-green-400/20 dark:bg-green-500/20 rounded-full animate-ping" />
                            <div className="absolute inset-2 bg-green-400/30 dark:bg-green-500/30 rounded-full animate-pulse" />
                            <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle className="w-14 h-14 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2">
                                <Sparkles className="w-8 h-8 text-yellow-400 animate-bounce" />
                            </div>
                        </div>

                        {/* Trophy */}
                        <div className="flex justify-center">
                            <Trophy className="w-12 h-12 text-yellow-500 animate-pulse" />
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                Selamat! 🎉
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Ujian berhasil diselesaikan
                            </p>
                        </div>

                        {/* Exam Info */}
                        {result && (
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Ujian
                                </p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    {result.ujian?.judul || "Ujian"}
                                </p>
                                {result.ujian?.mataPelajaran && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {result.ujian.mataPelajaran.nama}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Message */}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Jawaban Anda telah berhasil disimpan. Terima kasih telah mengikuti ujian dengan baik.
                        </p>

                        {/* Actions */}
                        <div className="space-y-3 pt-4">
                            {result?.ujian?.tampilkanNilai && (
                                <Button
                                    onClick={handleViewResult}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
                                    size="lg"
                                >
                                    Lihat Hasil
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                onClick={handleGoHome}
                                className="w-full border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                                size="lg"
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Kembali ke Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
                    Semoga hasilnya memuaskan! 💪
                </p>
            </div>
        </div>
    );
}
