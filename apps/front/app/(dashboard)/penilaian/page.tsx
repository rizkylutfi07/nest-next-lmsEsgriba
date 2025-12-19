"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Search, ShieldCheck, ClipboardList, CheckCircle, AlertTriangle, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../role-context";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type UjianOption = {
  id: string;
  judul: string;
  mataPelajaran?: { nama?: string } | null;
};

type MonitoringItem = {
  id: string;
  siswa?: { nama?: string; nisn?: string; kelas?: { nama?: string } | null } | null;
  status: string;
  answeredCount?: number;
  ujian?: { _count?: { ujianSoal?: number } };
  nilaiTotal?: number | null;
  violationCount?: number;
  jawaban?: any;
};

export default function PenilaianPage() {
  const { token } = useRole();
  const [selectedUjian, setSelectedUjian] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: ujianList, isLoading: ujianLoading } = useQuery<UjianOption[]>({
    queryKey: ["penilaian-ujian-list"],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/ujian?limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load ujian");
      const json = await res.json();
      return json?.data ?? json ?? [];
    },
    enabled: !!token,
    staleTime: 30_000,
  });

  const { data: monitoring, isLoading: monitoringLoading, refetch } = useQuery<MonitoringItem[]>({
    queryKey: ["penilaian-monitoring", selectedUjian],
    queryFn: async () => {
      if (!selectedUjian) return [];
      const res = await fetch(`http://localhost:3001/ujian-siswa/monitoring/${selectedUjian}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load data");
      return res.json();
    },
    enabled: !!token && !!selectedUjian,
    refetchInterval: 15_000,
  });

  const items = useMemo(() => {
    if (!monitoring) return [];
    return monitoring.filter((m) => {
      const q = search.toLowerCase();
      const nama = m.siswa?.nama?.toLowerCase() ?? "";
      const nisn = m.siswa?.nisn ?? "";
      const kelas = m.siswa?.kelas?.nama?.toLowerCase() ?? "";
      return nama.includes(q) || nisn.includes(q) || kelas.includes(q);
    });
  }, [monitoring, search]);

  const selectedUjianObj = ujianList?.find((u) => u.id === selectedUjian);
  const [gradingId, setGradingId] = useState<string | null>(null);

  const { data: reviewData, isLoading: reviewLoading, refetch: refetchReview } = useQuery<any>({
    queryKey: ["penilaian-review", gradingId],
    queryFn: async () => {
      if (!gradingId) return null;
      const res = await fetch(`http://localhost:3001/ujian-siswa/review/${gradingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load review data");
      return res.json();
    },
    enabled: !!gradingId && !!token,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Penilaian Ujian</h1>
          <p className="text-sm text-muted-foreground">Review progres dan nilai ujian per siswa.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={monitoringLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${monitoringLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle>Ujian</CardTitle>
              <p className="text-sm text-muted-foreground">
                Pilih ujian untuk melihat daftar siswa dan nilai.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <select
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
                value={selectedUjian ?? ""}
                onChange={(e) => setSelectedUjian(e.target.value || null)}
                disabled={ujianLoading}
              >
                <option value="">{ujianLoading ? "Memuat..." : "Pilih ujian"}</option>
                {ujianList?.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.judul} {u.mataPelajaran?.nama ? `• ${u.mataPelajaran.nama}` : ""}
                  </option>
                ))}
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari siswa / nisn / kelas"
                  className="pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary"
                  disabled={!selectedUjian}
                />
              </div>
            </div>
          </div>
          {selectedUjianObj && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ClipboardList size={14} />
              <span>{selectedUjianObj.judul}</span>
              {selectedUjianObj.mataPelajaran?.nama && (
                <Badge variant="outline" className="text-xs">
                  {selectedUjianObj.mataPelajaran.nama}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {monitoringLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !selectedUjian ? (
            <div className="py-8 text-center text-muted-foreground">Pilih ujian terlebih dahulu.</div>
          ) : items.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Data tidak ditemukan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Peserta</th>
                    <th className="px-4 py-3 text-left">Kelas</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Progres</th>
                    <th className="px-4 py-3 text-left">Nilai</th>
                    <th className="px-4 py-3 text-left">Pelanggaran</th>
                    <th className="px-4 py-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((s) => {
                    const total = s.ujian?._count?.ujianSoal || 0;
                    const answered = s.answeredCount ?? 0;
                    const percent = total ? Math.round((answered / total) * 100) : 0;
                    return (
                      <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-foreground">{s.siswa?.nama}</div>
                          <div className="text-xs text-muted-foreground">{s.siswa?.nisn}</div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{s.siswa?.kelas?.nama || "-"}</td>
                        <td className="px-4 py-3">
                          <StatusPill status={s.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-28 rounded-full bg-muted overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {answered}/{total} ({percent}%)
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold">
                          {s.nilaiTotal !== null && s.nilaiTotal !== undefined ? s.nilaiTotal.toFixed(1) : "-"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{s.violationCount ?? 0}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setGradingId(s.id)}>
                              Koreksi
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {gradingId && reviewData && (
        <GradeModal
          data={reviewData}
          onClose={() => setGradingId(null)}
          onSaved={() => {
            setGradingId(null);
            refetch();
          }}
          isLoading={reviewLoading}
          token={token}
        />
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === "SELESAI") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-700">
        <CheckCircle size={12} />
        Selesai
      </span>
    );
  }
  if (status === "SEDANG_MENGERJAKAN") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-medium text-blue-700">
        <Clock size={12} />
        Proses
      </span>
    );
  }
  if (status === "DIBLOKIR") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-700">
        <AlertTriangle size={12} />
        Diblokir
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-700">
      <AlertTriangle size={12} />
      Belum mulai
    </span>
  );
}

function GradeModal({ data, onClose, onSaved, isLoading, token }: any) {
  const [saving, setSaving] = useState(false);
  const [grades, setGrades] = useState<Record<string, number | null>>({});

  const normalize = (text: string) =>
    (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\u00c0-\u024f\\s]/g, " ")
      .replace(/\\s+/g, " ")
      .trim();

  const isEssayCorrect = (kunci: string | null | undefined, jawaban: string | null | undefined) => {
    if (!kunci || !jawaban) return false;
    const keyNorm = normalize(kunci);
    const ansNorm = normalize(jawaban);
    if (!keyNorm || !ansNorm) return false;
    if (keyNorm === ansNorm) return true;
    if (ansNorm.includes(keyNorm) || keyNorm.includes(ansNorm)) return true;
    const keyTokens = new Set(keyNorm.split(" "));
    const ansTokens = new Set(ansNorm.split(" "));
    const intersect = Array.from(keyTokens).filter((t) => ansTokens.has(t)).length;
    const union = new Set([...Array.from(keyTokens), ...Array.from(ansTokens)]).size || 1;
    const jaccard = intersect / union;
    return jaccard >= 0.5;
  };

  const jawabanMap = Array.isArray(data?.jawaban)
    ? data.jawaban.reduce((acc: any, item: any) => {
        acc[item.soalId] = item.jawaban;
        return acc;
      }, {})
    : {};

  const soalList = data?.ujian?.ujianSoal ?? [];
  const essayList = soalList.filter(
    (s: any) => s.bankSoal.tipe === "ESSAY" || s.bankSoal.tipe === "ISIAN_SINGKAT",
  );

  const handleSave = async () => {
    const payload = Object.entries(grades)
      .filter(([, v]) => v !== null && !Number.isNaN(v))
      .map(([soalId, val]) => ({ soalId, score: Number(val) }));

    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3001/ujian-siswa/${data.id}/grade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ grades: payload }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan nilai");
      onSaved();
    } catch (err: any) {
      alert(err?.message || "Gagal menyimpan nilai");
    } finally {
      setSaving(false);
    }
  };

  const initialScore = (soal: any) => {
    const ans = jawabanMap[soal.bankSoalId];
    if (!ans) return null;
    return isEssayCorrect(soal.bankSoal.jawabanBenar, ans) ? soal.bankSoal.bobot ?? 0 : 0;
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <div>
            <CardTitle>Koreksi Essay</CardTitle>
            <p className="text-sm text-muted-foreground">
              {data?.siswa?.nama} • {data?.siswa?.kelas?.nama || "-"}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Tutup
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : essayList.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">Tidak ada soal essay/isian.</div>
          ) : (
            <div className="divide-y divide-border">
              {essayList.map((soal: any, idx: number) => {
                const ans = jawabanMap[soal.bankSoalId];
                const current = grades[soal.bankSoalId] ?? initialScore(soal);
                return (
                  <div key={soal.id} className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-muted-foreground">Soal {idx + 1}</span>
                      <Badge variant="outline" className="text-xs">
                        {soal.bankSoal.tipe.replace("_", " ")}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Bobot: {soal.bankSoal.bobot ?? 0}
                      </Badge>
                    </div>
                    <div className="text-foreground" dangerouslySetInnerHTML={{ __html: soal.bankSoal.pertanyaan }} />
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Jawaban Siswa: </span>
                      <span>{ans ?? "-"}</span>
                    </div>
                    {soal.bankSoal.jawabanBenar && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Kunci: </span>
                        <span>{soal.bankSoal.jawabanBenar}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setGrades((prev) => ({
                            ...prev,
                            [soal.bankSoalId]: null,
                          }))
                        }
                        className={cn(current === null ? "border-primary text-primary" : "")}
                      >
                        Ikuti auto
                      </Button>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={soal.bankSoal.bobot ?? 0}
                          value={current ?? ""}
                          placeholder="Nilai"
                          className="w-24"
                          onChange={(e) => {
                            const val = e.target.value === "" ? null : Number(e.target.value);
                            setGrades((prev) => ({
                              ...prev,
                              [soal.bankSoalId]: val,
                            }));
                          }}
                        />
                        <span className="text-xs text-muted-foreground">/ {soal.bankSoal.bobot ?? 0}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        <div className="p-4 border-t border-border flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Simpan Nilai
          </Button>
        </div>
      </Card>
    </div>
  );
}
