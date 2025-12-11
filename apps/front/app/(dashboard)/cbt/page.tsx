"use client";

import { Activity, ClipboardCheck, FileCheck, Layers, Sparkles, Timer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cbtItems = [
  {
    title: "Data Soal",
    detail: "Bank soal adaptif dengan tagging kompetensi dan tingkat kesulitan.",
    stat: "1.240 soal aktif",
    icon: Layers,
    badge: "Bank Soal",
  },
  {
    title: "Data Ujian",
    detail: "Template ujian, mata pelajaran, dan aturan kelulusan.",
    stat: "32 jadwal minggu ini",
    icon: FileCheck,
    badge: "Ujian",
  },
  {
    title: "Data Sesi",
    detail: "Kelola slot, durasi, token akses, dan perangkat yang diizinkan.",
    stat: "14 sesi berjalan",
    icon: Timer,
    badge: "Sesi",
  },
  {
    title: "Data Monitoring Ujian",
    detail: "Pantau live, perangkat ganda, dan status submit siswa.",
    stat: "Stabil - 0 insiden",
    icon: Activity,
    badge: "Monitoring",
  },
  {
    title: "Penilaian",
    detail: "Auto-scoring, essay rubric, dan publish nilai ke portal.",
    stat: "78% sudah dinilai",
    icon: Sparkles,
    badge: "Nilai",
  },
];

export default function CBTPage() {
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
          <Button size="sm">Buat ujian</Button>
          <Button size="sm" variant="outline">
            Lihat bank soal
          </Button>
          <Button size="sm" variant="ghost" className="text-muted-foreground">
            Panduan proktor
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/70">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Menu CBT</CardTitle>
            <CardDescription>Data Soal, Data Ujian, Data Sesi, Monitoring, Penilaian.</CardDescription>
          </div>
          <Badge tone="info">Terintegrasi</Badge>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {cbtItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/5 p-4 transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15"
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
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
