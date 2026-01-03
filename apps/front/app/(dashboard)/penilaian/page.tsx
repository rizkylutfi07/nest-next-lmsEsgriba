"use client";
import { API_URL } from "@/lib/api";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Search, CheckCircle, AlertTriangle, Clock, Loader2, Filter, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "../role-context";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type MataPelajaran = {
  id: string;
  nama: string;
};

type UjianItem = {
  id: string;
  judul: string;
  status: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  mataPelajaran?: MataPelajaran | null;
  _count?: { ujianSiswa?: number };
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
  pgBenar?: number;
  pgSalah?: number;
};

import { useSearchParams } from "next/navigation";

// ... inside component
export default function PenilaianPage() {
  const { token } = useRole();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const initialUjianId = searchParams.get("ujianId");

  const [selectedMapel, setSelectedMapel] = useState<string>("");
  const [selectedUjian, setSelectedUjian] = useState<string | null>(initialUjianId);
  const [search, setSearch] = useState("");

  // Fetch mata pelajaran list
  const { data: mapelList, isLoading: mapelLoading } = useQuery<MataPelajaran[]>({
    queryKey: ["penilaian-mapel-list"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/mata-pelajaran`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load mapel");
      const json = await res.json();
      return json?.data ?? json ?? [];
    },
    enabled: !!token,
    staleTime: 60_000,
  });

  // Fetch ujian list (with optional mapel filter)
  const { data: ujianList, isLoading: ujianLoading, refetch: refetchUjian } = useQuery<UjianItem[]>({
    queryKey: ["penilaian-ujian-list", selectedMapel],
    queryFn: async () => {
      const url = selectedMapel
        ? `${API_URL}/ujian?limit=200&mataPelajaranId=${selectedMapel}`
        : `${API_URL}/ujian?limit=200`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load ujian");
      const json = await res.json();
      return json?.data ?? json ?? [];
    },
    enabled: !!token,
    staleTime: 30_000,
  });

  // Fetch monitoring data for selected ujian
  const { data: monitoring, isLoading: monitoringLoading, refetch } = useQuery<MonitoringItem[]>({
    queryKey: ["penilaian-monitoring", selectedUjian],
    queryFn: async () => {
      if (!selectedUjian) return [];
      const res = await fetch(`${API_URL}/ujian-siswa/monitoring/${selectedUjian}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load data");
      return res.json();
    },
    enabled: !!token && !!selectedUjian,
    refetchInterval: 15_000,
  });

  const filteredStudents = useMemo(() => {
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
  const [detailId, setDetailId] = useState<string | null>(null);

  const activeId = gradingId || detailId;

  const { data: reviewData, isLoading: reviewLoading } = useQuery<any>({
    queryKey: ["penilaian-review", activeId],
    queryFn: async () => {
      if (!activeId) return null;
      const res = await fetch(`${API_URL}/ujian-siswa/review/${activeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load review data");
      return res.json();
    },
    enabled: !!activeId && !!token,
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ONGOING":
        return <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/20">Berlangsung</Badge>;
      case "PUBLISHED":
        return <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/20">Terpublish</Badge>;
      case "SELESAI":
        return <Badge className="bg-gray-500/15 text-gray-700 hover:bg-gray-500/20">Selesai</Badge>;
      default:
        return <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Penilaian Ujian</h1>
          <p className="text-sm text-muted-foreground">Review progres dan nilai ujian per siswa.</p>
        </div>
        <Button variant="outline" onClick={() => { refetchUjian(); refetch(); }} disabled={ujianLoading || monitoringLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${(ujianLoading || monitoringLoading) ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">Filter</span>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <select
                className="rounded-lg border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary min-w-[200px]"
                value={selectedMapel}
                onChange={(e) => {
                  setSelectedMapel(e.target.value);
                  setSelectedUjian(null);
                }}
                disabled={mapelLoading}
              >
                <option value="">{mapelLoading ? "Memuat..." : "Semua Mata Pelajaran"}</option>
                {mapelList?.map((m) => (
                  <option key={m.id} value={m.id}>{m.nama}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Ujian Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={18} />
            Daftar Ujian
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {ujianLoading ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !ujianList || ujianList.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Tidak ada ujian ditemukan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">Judul Ujian</th>
                    <th className="px-4 py-3 text-left">Mata Pelajaran</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Tanggal</th>
                    <th className="px-4 py-3 text-left">Peserta</th>
                    <th className="px-4 py-3 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ujianList.map((u) => (
                    <tr
                      key={u.id}
                      className={cn(
                        "hover:bg-muted/40 transition-colors cursor-pointer",
                        selectedUjian === u.id && "bg-primary/5 border-l-2 border-l-primary"
                      )}
                      onClick={() => setSelectedUjian(u.id)}
                    >
                      <td className="px-4 py-3 font-medium">{u.judul}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {u.mataPelajaran?.nama || "-"}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(u.status)}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {formatDate(u.tanggalMulai)} - {formatDate(u.tanggalSelesai)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {u._count?.ujianSiswa || 0} siswa
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant={selectedUjian === u.id ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUjian(u.id);
                          }}
                        >
                          {selectedUjian === u.id ? "Dipilih" : "Lihat Nilai"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Grades Table */}
      {selectedUjian && (
        <Card>
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <CardTitle>Nilai Peserta</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedUjianObj?.judul} • {selectedUjianObj?.mataPelajaran?.nama || "-"}
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari siswa / nisn / kelas"
                  className="pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {monitoringLoading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredStudents.length === 0 ? (
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
                      <th className="px-4 py-3 text-left">PG B/S</th>
                      <th className="px-4 py-3 text-left">Nilai</th>
                      <th className="px-4 py-3 text-left">Pelanggaran</th>
                      <th className="px-4 py-3 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredStudents.map((s) => {
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
                          <td className="px-4 py-3 text-sm">
                            <span className="text-green-600 font-medium">{s.pgBenar ?? 0}</span> / <span className="text-red-600 font-medium">{s.pgSalah ?? 0}</span>
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {s.nilaiTotal !== null && s.nilaiTotal !== undefined ? s.nilaiTotal.toFixed(1) : "-"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{s.violationCount ?? 0}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setDetailId(s.id)}>
                                Detail
                              </Button>
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
      )}

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

      {detailId && reviewData && (
        <AnswerDetailModal
          data={reviewData}
          onClose={() => setDetailId(null)}
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

function AnswerDetailModal({ data, onClose }: { data: any; onClose: () => void }) {
  const soalList = data?.ujian?.ujianSoal ?? [];
  const jawabanMap = Array.isArray(data?.jawaban)
    ? data.jawaban.reduce((acc: any, item: any) => {
      acc[item.soalId] = item.jawaban;
      return acc;
    }, {})
    : {};

  const isCorrect = (soal: any, ans: any) => {
    if (!ans) return false;
    if (soal.bankSoal.tipe === "PILIHAN_GANDA" || soal.bankSoal.tipe === "BENAR_SALAH") {
      // Check both isCorrect flag in pilihanJawaban and jawabanBenar field
      const correct = soal.bankSoal.pilihanJawaban?.find((p: any) => p.isCorrect === true || p.id === soal.bankSoal.jawabanBenar);
      return correct?.id === ans;
    }
    if (soal.bankSoal.tipe === "ISIAN_SINGKAT") {
      return soal.bankSoal.jawabanBenar?.toLowerCase() === ans?.toLowerCase();
    }
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border py-4">
          <div>
            <CardTitle>Detail Jawaban</CardTitle>
            <p className="text-sm text-muted-foreground">
              {data?.siswa?.nama} • {data?.siswa?.kelas?.nama || "-"}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} size="sm">
            Tutup
          </Button>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto bg-muted/10">
          <div className="divide-y divide-border">
            {soalList.map((soal: any, idx: number) => {
              const ans = jawabanMap[soal.bankSoalId];
              const correct = isCorrect(soal, ans);
              const isEssay = soal.bankSoal.tipe === "ESSAY" || soal.bankSoal.tipe === "ISIAN_SINGKAT";

              return (
                <div key={soal.id} className="p-6 bg-background">
                  <div className="flex items-start gap-4">
                    <div className="min-w-[30px] flex flex-col items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-semibold text-sm">
                        {idx + 1}
                      </div>
                      {correct === true && <CheckCircle className="text-green-500" size={20} />}
                      {correct === false && <AlertTriangle className="text-red-500" size={20} />}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="text-xs">{soal.bankSoal.tipe.replace("_", " ")}</Badge>
                        <Badge className="text-xs">Bobot: {soal.bankSoal.bobot ?? 0}</Badge>
                      </div>

                      <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: soal.bankSoal.pertanyaan }} />

                      {(soal.bankSoal.tipe === "PILIHAN_GANDA" || soal.bankSoal.tipe === "BENAR_SALAH") && (
                        <div className="space-y-2 mt-4 ml-1">
                          {soal.bankSoal.pilihanJawaban?.map((p: any) => {
                            const isSelected = p.id === ans;
                            // Check both isCorrect flag and jawabanBenar field (which stores the correct option ID like "A", "B", etc.)
                            const isKey = p.isCorrect === true || p.id === soal.bankSoal.jawabanBenar;
                            let itemClass = "border-transparent bg-muted/30";
                            if (isSelected && isKey) itemClass = "border-green-500 bg-green-500/10";
                            else if (isSelected && !isKey) itemClass = "border-red-500 bg-red-500/10";
                            else if (isKey) itemClass = "border-green-500 border-dashed bg-green-500/5";

                            return (
                              <div key={p.id} className={cn("flex items-center gap-3 p-3 rounded-lg border text-sm", itemClass)}>
                                <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center",
                                  isSelected ? (isKey ? "border-green-600 bg-green-600" : "border-red-600 bg-red-600") : (isKey ? "border-green-500" : "border-muted-foreground")
                                )}>
                                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div className="flex-1" dangerouslySetInnerHTML={{ __html: p.text }} />
                                {isKey && (
                                  <div className="flex items-center gap-1.5 ml-auto">
                                    <CheckCircle className="text-green-600" size={16} />
                                    <Badge className="bg-green-600 hover:bg-green-700">Kunci Benar</Badge>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {isEssay && (
                        <div className="mt-4 p-4 rounded-lg bg-muted/30 space-y-3">
                          <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Jawaban Siswa</span>
                            <div className="mt-1 text-sm bg-background p-3 rounded border border-border">
                              {ans || <span className="text-muted-foreground italic">Tidak dijawab</span>}
                            </div>
                          </div>
                          {soal.bankSoal.jawabanBenar && (
                            <div>
                              <span className="text-xs font-semibold text-muted-foreground uppercase">Kunci Jawaban</span>
                              <div
                                className="mt-1 text-sm bg-green-500/10 border border-green-500/20 p-3 rounded text-green-900 dark:text-green-100 prose prose-sm max-w-none [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded"
                                dangerouslySetInnerHTML={{ __html: soal.bankSoal.jawabanBenar }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <div className="p-4 border-t border-border flex justify-end">
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </Card>
    </div>
  );
}

function GradeModal({ data, onClose, onSaved, isLoading, token }: any) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const existingGrades = (data?.manualGrades as Record<string, number>) || {};
  const [grades, setGrades] = useState<Record<string, number | null>>(existingGrades);

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
      const res = await fetch(`${API_URL}/ujian-siswa/${data.id}/grade`, {
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
      toast({ title: "Error", description: err?.message || "Gagal menyimpan nilai", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/10 p-4">
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
                const ans = jawabanMap[soal.bankSoalId] || jawabanMap[soal.id];
                const current = grades[soal.id] ?? null;
                return (
                  <div key={soal.id} className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-muted-foreground">Soal {idx + 1}</span>
                      <Badge className="text-xs">
                        {soal.bankSoal.tipe.replace("_", " ")}
                      </Badge>
                      <Badge className="text-xs">
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
                        <div
                          className="mt-1 prose prose-sm max-w-none [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:max-h-40"
                          dangerouslySetInnerHTML={{ __html: soal.bankSoal.jawabanBenar }}
                        />
                      </div>
                    )}

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
                            [soal.id]: val,
                          }));
                        }}
                      />
                      <span className="text-xs text-muted-foreground">/ {soal.bankSoal.bobot ?? 0}</span>
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
    </div >
  );
}
