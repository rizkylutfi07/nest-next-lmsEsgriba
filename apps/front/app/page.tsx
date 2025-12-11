"use client";

import {
  ArrowUpRight,
  Database,
  PlugZap,
  RefreshCcw,
  ServerCog,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

type HealthPayload = {
  status: string;
  timestamp: string;
  environment: string;
};

type UserPayload = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

const fetcher = async <T,>(path: string): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export default function Home() {
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: () => fetcher<HealthPayload>("/health"),
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => fetcher<UserPayload[]>("/users"),
    retry: 1,
  });

  const healthTone = healthQuery.isError
    ? "warning"
    : healthQuery.data?.status === "ok"
      ? "success"
      : "info";

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-cyan-400/15 via-transparent to-transparent blur-3xl" />
        <div className="absolute right-10 top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-[120px]" />
        <div className="absolute left-[-10%] bottom-[-10%] h-80 w-80 rounded-full bg-orange-400/10 blur-[120px]" />
      </div>

      <section className="container relative z-10 pb-16 pt-12 lg:pb-20 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="info" className="uppercase tracking-[0.18em]">
                Turborepo • NestJS • Prisma • Postgres
              </Badge>
              <Badge tone="success" className="flex items-center gap-2">
                <PlugZap size={14} /> TanStack Query ready
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Ship faster with a typed stack that&apos;s already talking to
                your API.
              </h1>
              <p className="text-lg text-muted-foreground md:max-w-2xl">
                Next.js front-end + NestJS API + Prisma ORM in one Turborepo.
                Dockerized Postgres, shadcn/ui components, and TanStack Query
                wiring are all pre-installed.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={`${apiBaseUrl}/health`} target="_blank" rel="noreferrer">
                  Open API health
                  <ArrowUpRight size={16} />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a
                  href="https://tanstack.com/query/latest/docs/framework/react/overview"
                  target="_blank"
                  rel="noreferrer"
                  className="gap-2"
                >
                  TanStack docs
                  <ArrowUpRight size={16} />
                </a>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border border-primary/30 bg-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ServerCog size={18} />
                    API status
                  </CardTitle>
                  <CardDescription>
                    NestJS + Prisma runtime with CORS enabled for the front-end.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Badge tone={healthTone}>
                      {healthQuery.isPending && "Checking..."}
                      {healthQuery.isError && "Offline"}
                      {healthQuery.data?.status === "ok" && "Healthy"}
                    </Badge>
                    {healthQuery.data?.environment && (
                      <span className="text-sm text-muted-foreground">
                        {healthQuery.data.environment}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {healthQuery.isError && (
                      <span className="text-destructive">
                        {healthQuery.error?.message ??
                          "API belum merespons, jalankan server backend."}
                      </span>
                    )}
                    {healthQuery.data?.timestamp && !healthQuery.isError && (
                      <span>
                        Last heartbeat:{" "}
                        {new Date(healthQuery.data.timestamp).toLocaleString()}
                      </span>
                    )}
                    {healthQuery.isPending && "Menunggu respons dari API..."}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => healthQuery.refetch()}
                    >
                      <RefreshCcw size={14} />
                      Refresh
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      asChild
                    >
                      <a href="http://localhost:3001" target="_blank" rel="noreferrer">
                        Open raw API
                        <ArrowUpRight size={14} />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Database size={18} />
                    Dockerized Postgres
                  </CardTitle>
                  <CardDescription>
                    Compose file lives in the monorepo root with safe defaults.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="rounded-md bg-foreground/5 px-4 py-3 text-sm">
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                      <span>Command</span>
                      <span className="flex items-center gap-1 text-primary">
                        <Sparkles size={14} /> Ready
                      </span>
                    </div>
                    <code className="mt-2 block font-mono text-sm text-foreground">
                      docker compose up -d db
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prisma connects via <code>DATABASE_URL</code> in
                    <code> apps/api/.env</code>. Change credentials in
                    <code> docker-compose.yml</code> to match your setup.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <PlugZap size={18} />
                Live queries
              </CardTitle>
              <CardDescription>
                TanStack Query is already wired; the list below hits the NestJS
                endpoint backed by Prisma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge tone="info" className="gap-2">
                  <Database size={14} /> Users table
                </Badge>
                <Badge tone="warning" className="gap-2">
                  <ServerCog size={14} /> Prisma client
                </Badge>
              </div>

              <div className="rounded-lg border border-border/60 bg-foreground/5 p-4">
                {usersQuery.isPending && (
                  <p className="text-sm text-muted-foreground">
                    Loading users from Postgres...
                  </p>
                )}
                {usersQuery.isError && (
                  <p className="text-sm text-destructive">
                    {usersQuery.error?.message ??
                      "Tidak bisa memuat pengguna. Pastikan Postgres + migrasi Prisma sudah jalan."}
                  </p>
                )}
                {usersQuery.data && usersQuery.data.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Tidak ada data yet. Tambahkan user via Prisma atau endpoint
                    <code className="ml-1 font-mono text-primary">/users</code>.
                  </p>
                )}
                {usersQuery.data && usersQuery.data.length > 0 && (
                  <ul className="space-y-2 text-sm">
                    {usersQuery.data.map((user) => (
                      <li
                        key={user.id}
                        className="flex items-center justify-between rounded-md border border-border/70 bg-background/60 px-3 py-2"
                      >
                        <div>
                          <p className="font-semibold">{user.name ?? "Tanpa nama"}</p>
                          <p className="text-muted-foreground">{user.email}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border/70 bg-foreground/5 px-4 py-3">
                  <p className="text-xs uppercase text-muted-foreground">
                    Front-end
                  </p>
                  <p className="text-sm font-semibold">Next.js 16 + shadcn/ui</p>
                  <p className="text-xs text-muted-foreground">
                    Tailwind-based design system ready for component drops.
                  </p>
                </div>
                <div className="rounded-lg border border-border/70 bg-foreground/5 px-4 py-3">
                  <p className="text-xs uppercase text-muted-foreground">
                    Backend
                  </p>
                  <p className="text-sm font-semibold">NestJS + Prisma</p>
                  <p className="text-xs text-muted-foreground">
                    CORS enabled and configured for Postgres in Docker.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
