"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tantml:function_calls>";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Clock, AlertTriangle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../../../role-context";

export default function KerjakanUjianPage() {
    const { token } = useRole();
    const router = useRouter();
    const params = useParams();
    const ujianSiswaId = params.id as string;

    const [jawaban, setJawaban] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [violations, setViolations] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch exam session
    const { data: session, isLoading } = useQuery({
        queryKey: ["ujian-session", ujianSiswaId],
        queryFn: async () => {
            const res = await fetch(
                `http://localhost:3001/ujian-siswa/session/${ujianSiswaId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) throw new Error("Failed to load exam");
            return res.json();
        },
        refetchInterval: false,
        refetchOnWindowFocus: false,
    });

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
            if (data.violations !== undefined) {
                setViolations(data.violations);
                if (data.violations >= 3) {
                    alert("Terlalu banyak pelanggaran! Ujian akan di-submit otomatis.");
                    submitMutation.mutate();
                }
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
                alert("Waktu habis! Ujian akan di-submit otomatis.");
                submitMutation.mutate();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [session]);

    // Anti-cheat: Fullscreen
    useEffect(() => {
        const enterFullscreen = async () => {
            try {
                await document.documentElement.requestFullscreen();
            } catch (err) {
                console.error("Fullscreen error:", err);
            }
        };

        enterFullscreen();

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                logActivityMutation.mutate("EXIT_FULLSCREEN");
                enterFullscreen(); // Try to re-enter
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4">
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
                                    Pelanggaran: {violations}/3
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
                {session.soal.map((soal: any, index: number) => (
                    <Card key={soal.id}>
                        <CardContent className="p-6">
                            <div className="mb-4">
                                <div className="flex items-start gap-3">
                                    <Badge variant="outline">Soal {index + 1}</Badge>
                                    <Badge className="bg-blue-500/15 text-blue-600">
                                        {soal.tipe.replace("_", " ")}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground ml-auto">
                                        Bobot: {soal.bobot}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-base whitespace-pre-wrap">{soal.pertanyaan}</p>
                            </div>

                            {/* Answer options */}
                            {soal.tipe === "PILIHAN_GANDA" && soal.pilihanJawaban && (
                                <div className="space-y-2">
                                    {soal.pilihanJawaban.map((pilihan: any) => (
                                        <label
                                            key={pilihan.id}
                                            className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/30 transition"
                                        >
                                            <input
                                                type="radio"
                                                name={`soal-${soal.id}`}
                                                value={pilihan.id}
                                                checked={jawaban[soal.id] === pilihan.id}
                                                onChange={(e) =>
                                                    setJawaban({ ...jawaban, [soal.id]: e.target.value })
                                                }
                                                className="mt-1"
                                            />
                                            <span className="flex-1">{pilihan.text}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {soal.tipe === "BENAR_SALAH" && (
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/30 transition">
                                        <input
                                            type="radio"
                                            name={`soal-${soal.id}`}
                                            value="BENAR"
                                            checked={jawaban[soal.id] === "BENAR"}
                                            onChange={(e) =>
                                                setJawaban({ ...jawaban, [soal.id]: e.target.value })
                                            }
                                        />
                                        <span>Benar</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/30 transition">
                                        <input
                                            type="radio"
                                            name={`soal-${soal.id}`}
                                            value="SALAH"
                                            checked={jawaban[soal.id] === "SALAH"}
                                            onChange={(e) =>
                                                setJawaban({ ...jawaban, [soal.id]: e.target.value })
                                            }
                                        />
                                        <span>Salah</span>
                                    </label>
                                </div>
                            )}

                            {(soal.tipe === "ESSAY" || soal.tipe === "ISIAN_SINGKAT") && (
                                <textarea
                                    value={jawaban[soal.id] || ""}
                                    onChange={(e) =>
                                        setJawaban({ ...jawaban, [soal.id]: e.target.value })
                                    }
                                    placeholder="Tulis jawaban Anda di sini..."
                                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-primary/60 focus:bg-white/10"
                                    rows={soal.tipe === "ESSAY" ? 6 : 2}
                                />
                            )}
                        </CardContent>
                    </Card>
                ))}

                {/* Submit button at bottom */}
                <Card className="sticky bottom-4">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Terjawab: {Object.keys(jawaban).length} / {session.soal.length}
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
