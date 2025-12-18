"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Clock, AlertTriangle, Send, AlertCircle, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../../../role-context";

type PilihanJawaban = {
    id: string;
    text: string;
    value: string;
};

const normalizePilihanData = (source: any): PilihanJawaban[] => {
    if (!source) return [];
    let data = source;
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch {
            return [];
        }
    }
    if (Array.isArray(data)) {
        return data.map((item: any, idx: number) => {
            const id = item?.id ?? item?.value ?? `${idx}`;
            return {
                id,
                text: item?.text ?? item?.label ?? item?.value ?? "",
                value: id,
            };
        });
    }
    if (typeof data === "object") {
        return Object.entries(data).map(([key, value]: [string, any], idx) => {
            if (typeof value === "string") {
                const id = key ?? `${idx}`;
                return { id, text: value, value: id };
            }
            const id = value?.id ?? key ?? `${idx}`;
            return {
                id,
                text: value?.text ?? value?.label ?? value?.value ?? "",
                value: id,
            };
        });
    }
    return [];
};

export default function KerjakanUjianPage() {
    const { token } = useRole();
    const router = useRouter();
    const params = useParams();
    const ujianSiswaId = params.id as string;
    const STORAGE_KEY = `ujian-jawaban-${ujianSiswaId}`;

    const [jawaban, setJawaban] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [violations, setViolations] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeSoalId, setActiveSoalId] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasLoadedSavedAnswers, setHasLoadedSavedAnswers] = useState(false);

    // Load saved answers from localStorage (if any)
    useEffect(() => {
        if (typeof window === "undefined" || !ujianSiswaId) return;
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === "object") {
                    setJawaban(parsed);
                }
            } catch {
                // ignore parse errors
            }
        }
        setHasLoadedSavedAnswers(true);
    }, [ujianSiswaId]);

    // Persist answers locally on every change
    useEffect(() => {
        if (typeof window === "undefined" || !ujianSiswaId) return;
        if (!hasLoadedSavedAnswers) return; // avoid overwriting before load
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jawaban));
    }, [jawaban, ujianSiswaId, hasLoadedSavedAnswers]);

    // Fetch exam session
    const { data: session, isLoading } = useQuery({
        queryKey: ["ujian-session", ujianSiswaId],
        queryFn: async () => {
            if (!token) return null;
            const res = await fetch(
                `http://localhost:3001/ujian-siswa/session/${ujianSiswaId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) throw new Error("Failed to load exam");
            return res.json();
        },
        enabled: Boolean(token),

        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

    // Real-time status check for blocking
    const { data: statusData, refetch: refetchStatus } = useQuery({
        queryKey: ["ujian-status", ujianSiswaId],
        queryFn: async () => {
            if (!token) return null;
            const res = await fetch(
                `http://localhost:3001/ujian-siswa/session/${ujianSiswaId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) return null;
            return res.json();
        },
        enabled: Boolean(token),
        refetchInterval: 2000, // Check every 2 seconds
        refetchOnWindowFocus: true,
    });

    const isBlocked = statusData?.status === "DIBLOKIR";

    // Log activity mutation
    const logActivityMutation = useMutation({
        mutationFn: async (activityType: string) => {
            const res = await fetch(
                `http://localhost:3001/ujian-siswa/log-activity`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ujianSiswaId,
                        activityType,
                    }),
                }
            );
            return res.json();
        },
        onSuccess: (data) => {
            if (data.violationCount !== undefined) {
                setViolations(data.violationCount);
            }
            if (data.blocked) {
                // Immediately refetch status to show blocking popup
                refetchStatus();
            }
        },
    });

    // Submit mutation
    const submitMutation = useMutation({
        mutationFn: async () => {
            const jawabanArray = Object.entries(jawaban).map(([soalId, answer]) => ({
                soalId,
                jawaban: answer,
            }));

            const res = await fetch(
                `http://localhost:3001/ujian-siswa/submit/${ujianSiswaId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ jawaban: jawabanArray }),
                }
            );
            if (!res.ok) throw new Error("Failed to submit");
            return res.json();
        },
        onSuccess: () => {
            if (typeof window !== "undefined") {
                localStorage.removeItem(STORAGE_KEY);
            }
            router.push(`/ujian-saya/hasil/${ujianSiswaId}`);
        },
    });

    // Timer
    useEffect(() => {
        if (!session) return;

        const calculateTimeLeft = () => {
            const now = new Date();
            const started = new Date(session.waktuMulai);
            const duration = session.ujian.durasi * 60 * 1000; // convert to ms
            const elapsed = now.getTime() - started.getTime();
            const remaining = Math.max(0, duration - elapsed);
            return Math.floor(remaining / 1000); // convert to seconds
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(timer);
                alert("Waktu habis! Ujian akan dikirim otomatis oleh sistem.");
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [session]);

    const requestFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.error("Fullscreen error:", err);
        }
    };

    const exitFullscreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error("Exit fullscreen error:", err);
        }
    };

    // Anti-cheat: Fullscreen
    useEffect(() => {
        const handleFullscreenChange = () => {
            const currentlyFullscreen = Boolean(document.fullscreenElement);
            setIsFullscreen(currentlyFullscreen);
            if (!currentlyFullscreen) {
                logActivityMutation.mutate("EXIT_FULLSCREEN");
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    // Anti-cheat: Tab visibility
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                logActivityMutation.mutate("TAB_SWITCH");
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () =>
            document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    // Anti-cheat: Copy/Paste
    useEffect(() => {
        const preventCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            logActivityMutation.mutate("COPY_PASTE");
        };

        document.addEventListener("copy", preventCopy);
        document.addEventListener("paste", preventCopy);
        document.addEventListener("cut", preventCopy);

        return () => {
            document.removeEventListener("copy", preventCopy);
            document.removeEventListener("paste", preventCopy);
            document.removeEventListener("cut", preventCopy);
        };
    }, []);

    // Anti-cheat: Right-click
    useEffect(() => {
        const preventRightClick = (e: MouseEvent) => {
            e.preventDefault();
            logActivityMutation.mutate("RIGHT_CLICK");
        };

        document.addEventListener("contextmenu", preventRightClick);
        return () => document.removeEventListener("contextmenu", preventRightClick);
    }, []);

    // Format time
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleSubmit = () => {
        if (confirm("Apakah Anda yakin ingin submit ujian?")) {
            setIsSubmitting(true);
            submitMutation.mutate();
        }
    };

    const soalList = session?.ujian?.ujianSoal ?? [];
    const answeredCount = Object.values(jawaban).filter((val) => val !== undefined && val !== "").length;

    useEffect(() => {
        if (soalList.length === 0) {
            setActiveSoalId(null);
            setCurrentIndex(0);
            return;
        }
        if (currentIndex >= soalList.length) {
            setCurrentIndex(soalList.length - 1);
        }
        const current = soalList[Math.min(currentIndex, soalList.length - 1)];
        const key = current?.bankSoalId ?? current?.id ?? null;
        if (key && key !== activeSoalId) {
            setActiveSoalId(key);
        }
    }, [soalList, currentIndex, activeSoalId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen text-muted-foreground">
                Data ujian tidak tersedia.
            </div>
        );
    }

    const goToIndex = (index: number) => {
        if (index < 0 || index >= soalList.length) return;
        setCurrentIndex(index);
        const soal = soalList[index];
        const key = soal.bankSoalId ?? soal.id;
        setActiveSoalId(key);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleNavigateSoal = (index: number) => {
        goToIndex(index);
    };

    return (
        <div className="min-h-screen bg-background p-4">
            {/* Blocking Modal */}
            {isBlocked && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md p-4">
                    <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <Ban className="w-12 h-12 text-red-600 dark:text-red-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">Ujian Diblokir</h2>
                            <p className="text-muted-foreground">
                                Sistem mendeteksi aktivitas mencurigakan pada akun Anda. Akses ujian telah diblokir sementara untuk menjaga integritas ujian.
                            </p>
                        </div>
                        <div className="bg-card border border-border p-4 rounded-lg text-sm text-left space-y-2 shadow-sm">
                            <p className="font-medium text-foreground">Apa yang harus saya lakukan?</p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                <li>Jangan tutup halaman ini.</li>
                                <li>Hubungi pengawas ujian segera.</li>
                                <li>Minta pengawas untuk membuka blokir Anda.</li>
                            </ul>
                        </div>
                        <p className="text-xs text-muted-foreground animate-pulse">
                            Menunggu konfirmasi pembukaan blokir dari pengawas...
                        </p>
                    </div>
                </div>
            )}

            {/* Header - Fixed */}
            <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-50 p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">{session.ujian.judul}</h1>
                        <p className="text-sm text-muted-foreground">
                            {session.ujian.mataPelajaran?.nama}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {violations > 0 && (
                            <div className="flex items-center gap-2 text-red-600">
                                <AlertTriangle size={20} />
                                <span className="text-sm font-semibold">
                                    Pelanggaran: {violations}/1
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <Clock size={20} />
                            <span
                                className={`text-lg font-bold ${timeLeft < 300 ? "text-red-600" : ""
                                    }`}
                            >
                                {formatTime(timeLeft)}
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => (isFullscreen ? exitFullscreen() : requestFullscreen())}
                        >
                            {isFullscreen ? "Keluar Fullscreen" : "Fullscreen"}
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || submitMutation.isPending}
                            size="sm"
                        >
                            {isSubmitting || submitMutation.isPending ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" size={16} />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send size={16} className="mr-2" />
                                    Submit
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto pt-24 pb-8 space-y-6">
                <Card>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold">Navigasi Soal</p>
                                <p className="text-xs text-muted-foreground">
                                    Klik nomor untuk lompat ke soal
                                </p>
                            </div>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                                <span>
                                    <span className="inline-flex h-3 w-3 rounded-full bg-muted mr-1" /> Belum
                                </span>
                                <span>
                                    <span className="inline-flex h-3 w-3 rounded-full bg-green-500 mr-1" /> Terjawab
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                            {soalList.map((soal: any, index: number) => {
                                const soalKey = soal.bankSoalId ?? soal.id;
                                const isActive = currentIndex === index;
                                const answered = Boolean(jawaban[soalKey]);
                                return (
                                    <button
                                        key={soalKey}
                                        type="button"
                                        onClick={() => handleNavigateSoal(index)}
                                        className={`rounded-md border px-0 py-2 text-xs font-semibold transition ${isActive
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : answered
                                                ? "border-green-500 bg-green-500/10 text-green-700"
                                                : "border-muted bg-muted/40 text-muted-foreground"
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
                {soalList.length > 0 && activeSoalId ? (
                    (() => {
                        const currentSoal = soalList[currentIndex];
                        const soalKey = currentSoal.bankSoalId ?? currentSoal.id;
                        const soalData = currentSoal.bankSoal ?? currentSoal;
                        const tipeSoal = soalData?.tipe ?? currentSoal.tipe;
                        const pertanyaan = soalData?.pertanyaan ?? currentSoal.pertanyaan ?? "";
                        const pilihanRaw = soalData?.pilihanJawaban ?? currentSoal.pilihanJawaban;
                        const pilihanJawaban = normalizePilihanData(pilihanRaw);

                        return (
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-start gap-3">
                                        <Badge className="bg-muted text-muted-foreground border border-border">Soal {currentIndex + 1}</Badge>
                                        {tipeSoal && (
                                            <Badge className="bg-blue-500/15 text-blue-600">
                                                {tipeSoal.replace("_", " ")}
                                            </Badge>
                                        )}
                                        <span className="text-sm text-muted-foreground ml-auto">
                                            Bobot: {currentSoal.bobot}
                                        </span>
                                    </div>

                                    {typeof pertanyaan === "string" && pertanyaan.includes("<") ? (
                                        <div
                                            className="prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: pertanyaan }}
                                        />
                                    ) : (
                                        <p className="text-base whitespace-pre-wrap">{pertanyaan}</p>
                                    )}

                                    {tipeSoal === "PILIHAN_GANDA" && pilihanJawaban.length > 0 && (
                                        <div className="space-y-2">
                                            {pilihanJawaban.map((pilihan: any, idx: number) => {
                                                const optionKey = `${pilihan.id ?? "opt"}-${idx}`;
                                                const optionValue = pilihan.id ?? pilihan.value ?? `${idx}`;
                                                const optionLabel = pilihan.text || optionValue;
                                                return (
                                                    <label
                                                        key={optionKey}
                                                        className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/30 transition"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`soal-${soalKey}`}
                                                            value={optionValue}
                                                            checked={jawaban[soalKey] === optionValue}
                                                            onChange={(e) =>
                                                                setJawaban({ ...jawaban, [soalKey]: e.target.value })
                                                            }
                                                            className="mt-1"
                                                        />
                                                        <span className="flex-1">{optionLabel}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {tipeSoal === "BENAR_SALAH" && (
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/30 transition">
                                                <input
                                                    type="radio"
                                                    name={`soal-${soalKey}`}
                                                    value="BENAR"
                                                    checked={jawaban[soalKey] === "BENAR"}
                                                    onChange={(e) =>
                                                        setJawaban({ ...jawaban, [soalKey]: e.target.value })
                                                    }
                                                />
                                                <span>Benar</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/30 transition">
                                                <input
                                                    type="radio"
                                                    name={`soal-${soalKey}`}
                                                    value="SALAH"
                                                    checked={jawaban[soalKey] === "SALAH"}
                                                    onChange={(e) =>
                                                        setJawaban({ ...jawaban, [soalKey]: e.target.value })
                                                    }
                                                />
                                                <span>Salah</span>
                                            </label>
                                        </div>
                                    )}

                                    {(tipeSoal === "ESSAY" || tipeSoal === "ISIAN_SINGKAT") && (
                                        <textarea
                                            value={jawaban[soalKey] || ""}
                                            onChange={(e) =>
                                                setJawaban({ ...jawaban, [soalKey]: e.target.value })
                                            }
                                            placeholder="Tulis jawaban Anda di sini..."
                                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-primary/60 focus:bg-white/10"
                                            rows={tipeSoal === "ESSAY" ? 6 : 2}
                                        />
                                    )}

                                    <div className="flex items-center justify-between pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => goToIndex(currentIndex - 1)}
                                            disabled={currentIndex === 0}
                                        >
                                            Soal Sebelumnya
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            Soal {currentIndex + 1} dari {soalList.length}
                                        </span>
                                        <Button
                                            variant="outline"
                                            onClick={() => goToIndex(currentIndex + 1)}
                                            disabled={currentIndex === soalList.length - 1}
                                        >
                                            Soal Berikutnya
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })()
                ) : (
                    <div className="p-6 text-center text-muted-foreground">
                        Tidak ada soal untuk ditampilkan.
                    </div>
                )}

                {/* Submit button at bottom */}
                <Card className="sticky bottom-4">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Terjawab: {answeredCount} / {soalList.length}
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || submitMutation.isPending}
                                size="lg"
                            >
                                {isSubmitting || submitMutation.isPending ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} className="mr-2" />
                                        Submit Ujian
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
