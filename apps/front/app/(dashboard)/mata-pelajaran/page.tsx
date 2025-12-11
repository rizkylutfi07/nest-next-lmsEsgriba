"use client";

import Link from "next/link";
import { BookOpen, ClipboardCheck, Sparkles, User } from "lucide-react";

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

const subjects = [
  { name: "Matematika Wajib", grade: "X - XII", owner: "Bu Rina", type: "Wajib" },
  { name: "Fisika Terapan", grade: "XI - XII", owner: "Pak Satria", type: "Peminatan" },
  { name: "Bahasa Inggris Academic", grade: "X - XII", owner: "Ms. Evelyn", type: "Wajib" },
  { name: "UI/UX Creative", grade: "XI - XII", owner: "Pak Bram", type: "Peminatan" },
];

export default function SubjectsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-card/60 to-background/80">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info" className="uppercase tracking-[0.18em]">
                Mata Pelajaran
              </Badge>
              <Badge tone="success" className="gap-2">
                <Sparkles size={14} />
                Silabus siap
              </Badge>
            </div>
            <CardTitle className="text-3xl">Kelola mata pelajaran</CardTitle>
            <CardDescription className="text-base text-muted-foreground md:max-w-3xl">
              Atur mapel wajib dan peminatan, assign penanggung jawab, serta tautkan kurikulum.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button size="sm">Tambah mapel</Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/guru">Lihat pengampu</Link>
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground" asChild>
              <Link href="/">Kembali ke dasbor</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle>Ringkasan mapel</CardTitle>
            <CardDescription>Per tingkat & tipe.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "Total mapel", value: "58", accent: "from-primary/20 to-cyan-500/15" },
              { title: "Mapel wajib", value: "24", accent: "from-secondary/25 to-purple-500/15" },
              { title: "Peminatan", value: "34", accent: "from-emerald-400/25 to-teal-500/15" },
              { title: "Butuh silabus", value: "6", accent: "from-amber-400/25 to-orange-500/15" },
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
            <CardTitle>Daftar mata pelajaran</CardTitle>
            <CardDescription>Kelola tingkat, tipe, dan penanggung jawab.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Ekspor CSV
            </Button>
            <Button size="sm">Impor</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground sm:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <span>Nama Mapel</span>
            <span>Tingkat</span>
            <span>Penanggung jawab</span>
            <span>Tipe</span>
          </div>
          <div className="space-y-2">
            {subjects.map((item) => (
              <div
                key={item.name}
                className="grid items-center gap-2 rounded-xl border border-white/10 bg-background/70 p-3 text-sm sm:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <BookOpen size={16} />
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </div>
                <span className="text-muted-foreground">{item.grade}</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User size={14} />
                  <span>{item.owner}</span>
                </div>
                <Badge tone={item.type === "Wajib" ? "success" : "info"}>{item.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/70">
        <CardHeader>
          <CardTitle>Silabus & penilaian</CardTitle>
          <CardDescription>Hubungkan ke CBT, materi, dan rubrik.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: ClipboardCheck,
              title: "Rubrik & KKM",
              desc: "Standar penilaian lintas kelas.",
            },
            {
              icon: Sparkles,
              title: "Integrasi CBT",
              desc: "Peta soal per kompetensi.",
            },
            {
              icon: BookOpen,
              title: "Materi & modul",
              desc: "Tautkan konten digital siap pakai.",
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
