"use client";
import { API_URL } from "@/lib/api";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, ClipboardCheck, FileCheck, Layers, Package, ShieldCheck, Sparkles, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRole } from "../role-context";

type Summary = {
  bankSoalTotal?: number;
  paketSoalTotal?: number;
  ujianTotal?: number;
  ujianPublished?: number;
  ujianOngoing?: number;
  ujianSelesai?: number;
};

const numberFormat = new Intl.NumberFormat("id-ID");

const buildStat = (value: number | undefined, suffix: string, loading: boolean) => {
  if (loading) return "Memuat...";
  if (value === undefined) return "-";
  return `${numberFormat.format(value)} ${suffix}`;
};

export default function CBTPage() {
  const { token, role } = useRole();
  const isAdminOrGuru = role === "ADMIN" || role === "GURU";

  const { data: summary, isLoading } = useQuery<Summary>({
    queryKey: ["cbt-summary"],
    enabled: Boolean(token) && isAdminOrGuru,
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${token}` };

      const fetchJson = async (url: string) => {
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      };

      const getTotal = (payload: any) => {
        if (payload?.meta?.total !== undefined) return payload.meta.total;
        if (Array.isArray(payload?.data)) return payload.data.length;
        if (Array.isArray(payload)) return payload.length;
        return 0;
      };

      const [bankSoal, paketSoal, ujianAll, ujianPublished, ujianOngoing, ujianSelesai] = await Promise.all([
        fetchJson(`${API_URL}/bank-soal?limit=1`),
        fetchJson(`${API_URL}/paket-soal?limit=1`),
        fetchJson(`${API_URL}/ujian?limit=1`),
        fetchJson(`${API_URL}/ujian?status=PUBLISHED&limit=1`),
        fetchJson(`${API_URL}/ujian?status=ONGOING&limit=1`),
        fetchJson(`${API_URL}/ujian?status=SELESAI&limit=1`),
      ]);

      return {
        bankSoalTotal: getTotal(bankSoal),
        paketSoalTotal: getTotal(paketSoal),
        ujianTotal: getTotal(ujianAll),
        ujianPublished: getTotal(ujianPublished),
        ujianOngoing: getTotal(ujianOngoing),
        ujianSelesai: getTotal(ujianSelesai),
      };
    },
  });

  const cbtItems = useMemo(() => {
    const loading = isLoading || !isAdminOrGuru;
    return [
      {
        title: "Bank Soal",
        detail: "Kelola pertanyaan, bobot, dan kunci jawaban.",
        stat: buildStat(summary?.bankSoalTotal, "soal", loading),
        icon: Layers,
        badge: "Bank Soal",
        href: "/bank-soal",
      },
      {
        title: "Paket Soal",
        detail: "Susun paket dengan urutan soal siap pakai.",
        stat: buildStat(summary?.paketSoalTotal, "paket", loading),
        icon: Package,
        badge: "Paket Soal",
        href: "/paket-soal",
      },
      {
        title: "Ujian Terbit",
        detail: "Ujian yang siap dijadwalkan ke siswa.",
        stat: buildStat(summary?.ujianPublished, "ujian", loading),
        icon: FileCheck,
        badge: "Ujian",
        href: "/ujian",
      },
      {
        title: "Sesi Berjalan",
        detail: "Ujian yang sedang aktif untuk dipantau.",
        stat: buildStat(summary?.ujianOngoing, "aktif", loading),
        icon: Timer,
        badge: "Monitoring",
        href: "/ujian",
      },
      {
        title: "Siap Dinilai",
        detail: "Ujian selesai untuk proses penilaian.",
        stat: buildStat(summary?.ujianSelesai, "ujian", loading),
        icon: ShieldCheck,
        badge: "Penilaian",
        href: "/penilaian",
      },
    ];
  }, [summary, isLoading, isAdminOrGuru]);

  return (
    <div className="space-y-6">
      <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="info" className="uppercase tracking-[0.18em]">
              CBT
            </Badge>
            <Badge tone="success" className="gap-2">
              <Sparkles size={14} />
              Anti-cheat aktif
            </Badge>
          </div>
          <CardTitle className="text-3xl">Kelola ujian digital</CardTitle>
          <CardDescription className="text-base text-muted-foreground md:max-w-3xl">
            Siapkan bank soal, jadwalkan ujian, kelola sesi, monitoring live, dan penilaian
            otomatis dalam satu tempat.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button size="sm" asChild>
            <Link href="/ujian/create">Buat ujian</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/bank-soal">Lihat bank soal</Link>
          </Button>
          <Button size="sm" variant="ghost" className="text-muted-foreground" asChild>
            <Link href="/ujian">Kelola jadwal</Link>
          </Button>
          <Button size="sm" variant="ghost" className="text-muted-foreground" asChild>
            <Link href="/penilaian">Penilaian ujian</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/70">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Menu CBT</CardTitle>
            <CardDescription>Data Soal, Data Ujian, Data Sesi, Monitoring, Penilaian.</CardDescription>
          </div>
          <Badge tone="info">{isAdminOrGuru ? "Data real-time" : "Ringkasan"}</Badge>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cbtItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col gap-3 rounded-xl border border-white/8 bg-muted/40 p-4 transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.stat}</p>
                  </div>
                  <Badge tone="warning" className="ml-auto text-[11px]">
                    {item.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
                <Button variant="ghost" size="sm" className="justify-start px-0 text-primary" asChild>
                  <Link href={item.href}>Buka {item.badge}</Link>
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
