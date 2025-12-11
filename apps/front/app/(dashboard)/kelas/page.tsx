"use client";

import Link from "next/link";
import { Building2, CalendarDays, Sparkles, Users } from "lucide-react";

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

const classes = [
  { name: "XI IPA 1", advisor: "Bu Diah", capacity: "32/34", schedule: "Senin-Kamis" },
  { name: "XII RPL", advisor: "Pak Ardi", capacity: "28/30", schedule: "Senin-Jumat" },
  { name: "XI DKV", advisor: "Bu Sari", capacity: "30/32", schedule: "Senin-Kamis" },
  { name: "X IPS 2", advisor: "Pak Fajar", capacity: "31/33", schedule: "Senin-Kamis" },
];

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info" className="uppercase tracking-[0.18em]">
                Data Kelas
              </Badge>
              <Badge tone="success" className="gap-2">
                <Sparkles size={14} />
                Jadwal sinkron
              </Badge>
            </div>
            <CardTitle className="text-3xl">Kelola kelas & wali</CardTitle>
            <CardDescription className="text-base text-muted-foreground md:max-w-3xl">
              Buat kelas baru, tetapkan wali, atur kapasitas, dan sinkron jadwal belajar.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button size="sm">Tambah kelas</Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/siswa">Kelola siswa</Link>
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground" asChild>
              <Link href="/">Kembali ke dasbor</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle>Ringkasan kelas</CardTitle>
            <CardDescription>Pengisian kapasitas.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "Total kelas", value: "246", accent: "from-primary/20 to-cyan-500/15" },
              { title: "Kapasitas rata-rata", value: "32 siswa", accent: "from-secondary/25 to-purple-500/15" },
              { title: "Kelas penuh", value: "18", accent: "from-amber-400/25 to-orange-500/15" },
              { title: "Slot tersedia", value: "142", accent: "from-emerald-400/25 to-teal-500/15" },
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
            <CardTitle>Daftar kelas</CardTitle>
            <CardDescription>Periksa wali kelas, kapasitas, dan jadwal.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Ekspor CSV
            </Button>
            <Button size="sm">Impor</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground sm:grid-cols-[1fr_1fr_1fr_0.8fr]">
            <span>Nama Kelas</span>
            <span>Wali</span>
            <span>Kapasitas</span>
            <span>Jadwal</span>
          </div>
          <div className="space-y-2">
            {classes.map((item) => (
              <div
                key={item.name}
                className="grid items-center gap-2 rounded-xl border border-white/10 bg-background/70 p-3 text-sm sm:grid-cols-[1fr_1fr_1fr_0.8fr]"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Building2 size={16} />
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </div>
                <span className="text-muted-foreground">{item.advisor}</span>
                <Badge tone="info">{item.capacity}</Badge>
                <span className="text-muted-foreground">{item.schedule}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/70">
        <CardHeader>
          <CardTitle>Kalender & ruangan</CardTitle>
          <CardDescription>Pastikan benturan jadwal bisa terdeteksi.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: CalendarDays,
              title: "Kalender kelas",
              desc: "Sync ke kalender guru dan siswa.",
            },
            {
              icon: Users,
              title: "Rotasi ruangan",
              desc: "Optimalkan kapasitas dan peralatan.",
            },
            {
              icon: Sparkles,
              title: "Penjadwalan pintar",
              desc: "Rekomendasi otomatis dari slot kosong.",
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
