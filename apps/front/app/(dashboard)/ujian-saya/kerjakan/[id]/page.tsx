"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Clock, AlertTriangle, Send, AlertCircle, Ban, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../../../role-context";
import { useToast } from "@/hooks/use-toast";

type PilihanJawaban = {
    id: string;
    text: string;
    value: string;
};

/**
 * Parse inline concatenated options like "Word B.Excel C.PowerPoint D.Corel Draw E.Paint"
 */
const parseInlineOptions = (text: string): PilihanJawaban[] => {
    const optionLabels = ['A', 'B', 'C', 'D', 'E'];

    // Check if text contains inline option markers like " B.", " C." etc.
    if (!/ [B-E]\./i.test(text)) {
        return [];
    }

    // Split by space followed by B., C., D., E.
    const splitPattern = /\s+(?=[A-E]\.)/gi;
    const parts = text.split(splitPattern).filter(p => p.trim());

    if (parts.length < 2) {
        return [];
    }

    const options: PilihanJawaban[] = [];

    for (let i = 0; i < parts.length && i < optionLabels.length; i++) {
        let part = parts[i]!.trim();

        // Remove leading label like "A.", "B." etc if present
        part = part.replace(/^[A-E]\.\s*/i, '').trim();

        if (part) {
            options.push({
                id: optionLabels[i]!,
                text: part,
                value: optionLabels[i]!,
            });
        }
    }

    return options.length >= 2 ? options : [];
};

const normalizePilihanData = (source: any): PilihanJawaban[] => {
    if (!source) return [];
    let data = source;
    if (typeof data === "string") {
        try {
            data = JSON.parse(data);
        } catch {
            // If parsing fails, try inline parsing
            const inlineOptions = parseInlineOptions(data);
            if (inlineOptions.length >= 2) {
                return inlineOptions;
            }
            return [];
        }
    }
    if (Array.isArray(data)) {
        // Check if this looks like properly formatted options
        const firstItem = data[0];

        // Case: Array has valid option objects [{id: "A", text: "..."}, ...]
        if (firstItem && typeof firstItem === 'object' && (firstItem.id || firstItem.text)) {
            return data.map((item: any, idx: number) => {
                const id = item?.id ?? item?.value ?? `${idx}`;
                return {
                    id,
                    text: item?.text ?? item?.label ?? item?.value ?? "",
                    value: id,
                };
            });
        }

        // Case: Array has single string element with concatenated options
        if (data.length === 1 && typeof firstItem === 'string') {
            const inlineOptions = parseInlineOptions(firstItem);
            if (inlineOptions.length >= 2) {
                return inlineOptions;
            }
        }

        // Case: Array of strings - try to parse each as option text
        if (data.every((item: any) => typeof item === 'string')) {
            // Check if first item contains inline options
            if (data.length === 1 && data[0]) {
                const inlineOptions = parseInlineOptions(data[0]);
                if (inlineOptions.length >= 2) {
                    return inlineOptions;
                }
            }

            // Otherwise, treat each string as a separate option
            const optionLabels = ['A', 'B', 'C', 'D', 'E'];
            return data.map((text: string, idx: number) => ({
                id: optionLabels[idx] || `${idx}`,
                text: text.replace(/^[A-E][\\.)]\s*/i, '').trim(),
                value: optionLabels[idx] || `${idx}`,
            }));
        }

        // Default array handling
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
    const { toast } = useToast();
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
    const saveProgressTimer = useRef<NodeJS.Timeout | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const fullscreenRequested = useRef(false);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [unansweredList, setUnansweredList] = useState<{ idx: number; key: string }[]>([]);

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

    // Push existing saved answers to server once after load
    useEffect(() => {
        if (!hasLoadedSavedAnswers) return;
        if (!token || !ujianSiswaId) return;
        if (Object.keys(jawaban).length === 0) return;
        queueSaveProgress(jawaban);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasLoadedSavedAnswers]);

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
            if (!res.ok) {
                const message = await res.text();
                throw new Error(message || "Failed to submit");
            }
            return res.json();
        },
        onSuccess: () => {
            if (typeof window !== "undefined") {
                localStorage.removeItem(STORAGE_KEY);
            }
            // Redirect ke halaman congratulations
            router.replace(`/ujian-saya/selesai/${ujianSiswaId}`);
        },
        onError: (err: any) => {
            toast({ title: "Error", description: err?.message || "Gagal submit ujian", variant: "destructive" });
        },
    });

    // Persist progress to server (for monitoring) with debounce
    const saveProgressMutation = useMutation({
        mutationFn: async (jawabanPayload: { soalId: string; jawaban: string }[]) => {
            const res = await fetch(
                `http://localhost:3001/ujian-siswa/progress/${ujianSiswaId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ jawaban: jawabanPayload }),
                }
            );
            if (!res.ok) throw new Error("Failed to save progress");
            return res.json();
        },
        onSuccess: () => setSaveError(null),
        onError: (err: any) => setSaveError(err?.message || "Gagal menyimpan progres"),
    });

    const queueSaveProgress = (nextJawaban: Record<string, string>) => {
        if (!token || !ujianSiswaId || !hasLoadedSavedAnswers) return;

        if (saveProgressTimer.current) {
            clearTimeout(saveProgressTimer.current);
        }

        const jawabanArray = Object.entries(nextJawaban).map(([soalId, answer]) => ({
            soalId,
            jawaban: answer,
        }));

        saveProgressTimer.current = setTimeout(() => {
            saveProgressMutation.mutate(jawabanArray);
        }, 600);
    };

    useEffect(() => {
        return () => {
            if (saveProgressTimer.current) {
                clearTimeout(saveProgressTimer.current);
            }
        };
    }, []);

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
                toast({ title: "Waktu Habis!", description: "Ujian akan dikirim otomatis oleh sistem.", variant: "destructive" });
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

    // Auto-request fullscreen when session is ready
    useEffect(() => {
        if (!session) return;
        if (fullscreenRequested.current) return;
        fullscreenRequested.current = true;
        requestFullscreen();
    }, [session]);

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
        const unanswered = soalList
            .map((soal: any, idx: number) => ({ key: soal.bankSoalId ?? soal.id, idx }))
            .filter(({ key }: { key: string }) => !jawaban[key]);

        setUnansweredList(unanswered);
        setShowSubmitConfirm(true);
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
        <div className="min-h-screen bg-background p-1">
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
                <div className="max-w-4xl mx-auto flex items-center justify-center">
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
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto pt-2 pb-2 space-y-6">
                <Card>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold">Navigasi Soal</p>
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
                        const bobot = currentSoal.bobot ?? soalData?.bobot ?? 1;
                        const getTipeLabel = (tipe: string) => {
                            const labels: Record<string, string> = {
                                PILIHAN_GANDA: "Pilihan Ganda",
                                ESSAY: "Essay",
                                BENAR_SALAH: "Benar/Salah",
                                ISIAN_SINGKAT: "Isian Singkat",
                            };
                            return labels[tipe] || tipe;
                        };

                        return (
                            <Card>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge className="bg-muted text-muted-foreground border border-border">Soal {currentIndex + 1}</Badge>
                                        <Badge className="bg-blue-500/15 text-blue-600 border-0">{getTipeLabel(tipeSoal)}</Badge>
                                        <Badge className="bg-purple-500/15 text-purple-600 border-0">Bobot: {bobot}</Badge>
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
                                                const optionImageUrl = pilihan.imageUrl;
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
                                                            onChange={(e) => {
                                                                const next = { ...jawaban, [soalKey]: e.target.value };
                                                                setJawaban(next);
                                                                queueSaveProgress(next);
                                                            }}
                                                            className="mt-1"
                                                        />
                                                        <div className="flex-1">
                                                            {optionLabel.includes('<img') ? (
                                                                <div
                                                                    className="prose prose-sm max-w-none"
                                                                    dangerouslySetInnerHTML={{ __html: optionLabel }}
                                                                />
                                                            ) : (
                                                                <span>{optionLabel}</span>
                                                            )}
                                                            {optionImageUrl && (
                                                                <img
                                                                    src={optionImageUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || ''}${optionImageUrl}` : optionImageUrl}
                                                                    alt={`Option ${optionValue}`}
                                                                    className="mt-2 max-w-full max-h-48 object-contain rounded"
                                                                />
                                                            )}
                                                        </div>
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
                                                    onChange={(e) => {
                                                        const next = { ...jawaban, [soalKey]: e.target.value };
                                                        setJawaban(next);
                                                        queueSaveProgress(next);
                                                    }}
                                                />
                                                <span>Benar</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/30 transition">
                                                <input
                                                    type="radio"
                                                    name={`soal-${soalKey}`}
                                                    value="SALAH"
                                                    checked={jawaban[soalKey] === "SALAH"}
                                                    onChange={(e) => {
                                                        const next = { ...jawaban, [soalKey]: e.target.value };
                                                        setJawaban(next);
                                                        queueSaveProgress(next);
                                                    }}
                                                />
                                                <span>Salah</span>
                                            </label>
                                        </div>
                                    )}

                                    {(tipeSoal === "ESSAY" || tipeSoal === "ISIAN_SINGKAT") && (
                                        <textarea
                                            value={jawaban[soalKey] || ""}
                                            onChange={(e) => {
                                                const next = { ...jawaban, [soalKey]: e.target.value };
                                                setJawaban(next);
                                                queueSaveProgress(next);
                                            }}
                                            placeholder="Tulis jawaban Anda di sini..."
                                            className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
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

                                        <Button
                                            variant="outline"
                                            onClick={() => goToIndex(currentIndex + 1)}
                                            disabled={currentIndex === soalList.length - 1}
                                        >
                                            Soal Berikutnya
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-left">
                                        <span className="text-sm text-muted-foreground">
                                            Soal {currentIndex + 1} dari {soalList.length}
                                        </span>
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
                <Card className="sticky bottom-4 shadow-lg border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground space-y-1">
                                <div>Terjawab: {answeredCount} / {soalList.length}</div>
                                {saveProgressMutation.isPending ? (
                                    <div className="text-xs text-primary flex items-center gap-1">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Menyimpan progres...
                                    </div>
                                ) : saveError ? (
                                    <div className="text-xs text-destructive">Gagal simpan progres: {saveError}</div>
                                ) : (
                                    <div className="text-xs text-muted-foreground">Progres otomatis tersimpan</div>
                                )}
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting || submitMutation.isPending}
                                size="lg"
                                className="gap-2 px-5"
                            >
                                {isSubmitting || submitMutation.isPending ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={18} />
                                        Kirim Jawaban
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Submit confirmation modal */}
            {showSubmitConfirm && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-5 border-b border-border bg-muted/30">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-primary" size={20} />
                                <div>
                                    <div className="font-semibold text-foreground">Kirim Jawaban</div>
                                    <div className="text-xs text-muted-foreground">Pastikan semua jawaban sudah benar.</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            {unansweredList.length > 0 ? (
                                <>
                                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                        <AlertTriangle size={16} />
                                        {unansweredList.length} soal belum terjawab.
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                        {unansweredList.slice(0, 6).map((item) => (
                                            <span
                                                key={item.idx}
                                                className="inline-flex items-center px-2 py-1 rounded-full bg-muted text-foreground border border-border cursor-pointer hover:border-primary/50"
                                                onClick={() => {
                                                    setShowSubmitConfirm(false);
                                                    goToIndex(item.idx);
                                                }}
                                            >
                                                Soal {item.idx + 1}
                                            </span>
                                        ))}
                                        {unansweredList.length > 6 && (
                                            <span className="text-xs text-muted-foreground">+{unansweredList.length - 6} lainnya</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Anda bisa melompat ke soal yang belum dijawab atau tetap kirim.
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                    <ShieldCheck size={16} />
                                    Semua soal sudah terjawab.
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-border bg-muted/30 flex gap-2 justify-end">
                            <Button
                                variant="ghost"
                                className="flex-1"
                                onClick={() => setShowSubmitConfirm(false)}
                                disabled={isSubmitting || submitMutation.isPending}
                            >
                                Batal
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    setShowSubmitConfirm(false);
                                    setIsSubmitting(true);
                                    submitMutation.mutate();
                                }}
                                disabled={isSubmitting || submitMutation.isPending}
                            >
                                {isSubmitting || submitMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Kirim Sekarang
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
