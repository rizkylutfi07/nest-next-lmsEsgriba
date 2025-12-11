"use client";

import Link from "next/link";
import { CalendarClock, CalendarRange, RefreshCcw, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const years = [
  { label: "2025 / 2026", status: "Aktif", start: "15 Jul 2025", end: "30 Jun 2026" },
  { label: "2024 / 2025", status: "Selesai", start: "17 Jul 2024", end: "28 Jun 2025" },
  { label: "2023 / 2024", status: "Arsip", start: "18 Jul 2023", end: "29 Jun 2024" },
];

export default function AcademicYearPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info" className="uppercase tracking-[0.18em]">
                Tahun Ajaran
              </Badge>
              <Badge tone="success" className="gap-2">
                <Sparkles size={14} />
                Sinkron kalender
              </Badge>
            </div>
            <CardTitle className="text-3xl">Atur tahun ajaran aktif</CardTitle>
            <CardDescription className="text-base text-muted-foreground md:max-w-3xl">
              Tentukan periode aktif, kunci kalender akademik, dan hubungkan ke penjadwalan kelas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button size="sm">Setel tahun ajaran</Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/kelas">Sinkron ke jadwal</Link>
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground" asChild>
              <Link href="/">Kembali ke dasbor</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle>Pengingat</CardTitle>
            <CardDescription>Seragamkan kalender.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "Hari efektif", value: "198 hari", accent: "from-primary/20 to-cyan-500/15" },
              { title: "Libur nasional", value: "16", accent: "from-secondary/25 to-purple-500/15" },
              { title: "Ujian semester", value: "4 jadwal", accent: "from-amber-400/25 to-orange-500/15" },
              { title: "Rapat akademik", value: "6 agenda", accent: "from-emerald-400/25 to-teal-500/15" },
            ].map((item) => (
              <div
                key={item.title}
                className={cn(
                  "rounded-xl border border-white/10 p-3",
                  "bg-gradient-to-br",
                  item.accent,
                )}
              >
                <p className="text-xs uppercase text-muted-foreground">{item.title}</p>
                <p className="text-xl font-semibold">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-card/70">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daftar tahun ajaran</CardTitle>
            <CardDescription>Aktifkan hanya satu periode utama.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Arsipkan
            </Button>
            <Button size="sm">Tambah periode</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {years.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-background/70 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <CalendarClock size={16} />
                </div>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.start} - {item.end}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={item.status === "Aktif" ? "success" : "info"}>{item.status}</Badge>
                {item.status === "Aktif" ? (
                  <Button size="sm" variant="outline" className="gap-2">
                    <RefreshCcw size={14} />
                    Perbarui kalender
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost">
                    Jadikan aktif
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/70">
        <CardHeader>
          <CardTitle>Agenda akademik</CardTitle>
          <CardDescription>Blok penting tahun ajaran aktif.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: CalendarRange,
              title: "Kalender akademik",
              desc: "Sinkron otomatis ke jadwal kelas.",
            },
            {
              icon: Sparkles,
              title: "Template ujian",
              desc: "Konfigurasi UTS, UAS, dan ujian sekolah.",
            },
            {
              icon: RefreshCcw,
              title: "Roll-over data",
              desc: "Naik kelas, reset kelas, dan arsip otomatis.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
