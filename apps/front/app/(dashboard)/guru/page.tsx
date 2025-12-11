"use client";

import Link from "next/link";
import { Award, CalendarRange, ClipboardList, Sparkles, UserCog } from "lucide-react";

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

const teachers = [
  { name: "Rina Kurnia", subject: "Matematika", load: "26 jp", status: "Aktif" },
  { name: "Bram Aditya", subject: "UI/UX", load: "18 jp", status: "Aktif" },
  { name: "Evelyn Hart", subject: "Bahasa Inggris", load: "24 jp", status: "Cuti" },
  { name: "Satria Dwi", subject: "Fisika", load: "22 jp", status: "Aktif" },
];

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info" className="uppercase tracking-[0.18em]">
                Data Guru
              </Badge>
              <Badge tone="success" className="gap-2">
                <Sparkles size={14} />
                Penugasan siap
              </Badge>
            </div>
            <CardTitle className="text-3xl">Kelola data guru & staff</CardTitle>
            <CardDescription className="text-base text-muted-foreground md:max-w-3xl">
              Atur beban mengajar, sertifikasi, jadwal, serta KPI dalam satu tempat.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button size="sm">Tambah guru</Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/mata-pelajaran">Lihat mata pelajaran</Link>
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground" asChild>
              <Link href="/">Kembali ke dasbor</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle>Ringkasan beban</CardTitle>
            <CardDescription>Distribusi pengajaran.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "Total guru", value: "312", accent: "from-primary/20 to-cyan-500/15" },
              { title: "Sertifikasi lengkap", value: "268", accent: "from-emerald-400/25 to-teal-500/15" },
              { title: "Kebutuhan pengganti", value: "9", accent: "from-amber-400/25 to-orange-500/15" },
              { title: "Cuti berjalan", value: "6", accent: "from-secondary/25 to-purple-500/15" },
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
            <CardTitle>Daftar guru</CardTitle>
            <CardDescription>Susun jadwal, cek beban, dan status sertifikasi.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Ekspor CSV
            </Button>
            <Button size="sm">Impor</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground sm:grid-cols-[1.2fr_1fr_0.7fr_0.7fr]">
            <span>Nama</span>
            <span>Mapel</span>
            <span>Beban</span>
            <span>Status</span>
          </div>
          <div className="space-y-2">
            {teachers.map((teacher) => (
              <div
                key={teacher.name}
                className="grid items-center gap-2 rounded-xl border border-white/10 bg-background/70 p-3 text-sm sm:grid-cols-[1.2fr_1fr_0.7fr_0.7fr]"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <UserCog size={16} />
                  </div>
                  <span className="font-semibold">{teacher.name}</span>
                </div>
                <span className="text-muted-foreground">{teacher.subject}</span>
                <span className="text-muted-foreground">{teacher.load}</span>
                <Badge tone={teacher.status === "Aktif" ? "success" : "warning"}>
                  {teacher.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/70">
        <CardHeader>
          <CardTitle>Agenda & evaluasi</CardTitle>
          <CardDescription>Atur observasi kelas dan rencana pelatihan.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: ClipboardList,
              title: "Observasi kelas",
              desc: "Checklist dan catatan untuk peningkatan pedagogi.",
            },
            {
              icon: Award,
              title: "Sertifikasi",
              desc: "Pantau kedaluwarsa sertifikat dan renewal.",
            },
            {
              icon: CalendarRange,
              title: "Jadwal pelatihan",
              desc: "Workshop internal dan eksternal guru.",
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
