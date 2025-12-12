"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Globe2,
  LogOut,
  Menu,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

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
import { type Role, useRole } from "./role-context";
import { ThemeToggle } from "@/components/theme-toggle";

const accessByRole: Record<Role, string[]> = {
  ADMIN: ["/", "/users", "/siswa", "/guru", "/kelas", "/jurusan", "/tahun-ajaran", "/mata-pelajaran", "/cbt", "/laporan", "/keuangan", "/keamanan"],
  GURU: ["/", "/kelas", "/mata-pelajaran", "/cbt", "/laporan"],
  SISWA: ["/", "/kelas", "/mata-pelajaran", "/cbt", "/keamanan"],
};

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, token, navigation, ready, logout } = useRole();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const allowed = useMemo(() => {
    if (!role) return false;
    const list = accessByRole[role];
    return list.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));
  }, [role, pathname]);

  useEffect(() => {
    if (ready && !token) {
      router.replace("/login");
    }
  }, [ready, token, router]);

  useEffect(() => {
    if (ready && token && role && !allowed) {
      router.replace("/");
    }
  }, [allowed, ready, role, token, router]);

  if (!ready || (!token && pathname !== "/login")) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Memuat...
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute inset-x-0 top-[-160px] h-80 bg-gradient-to-b from-primary/30 via-transparent to-transparent blur-3xl" />
        <div className="absolute right-[-80px] top-28 h-80 w-80 rounded-full bg-secondary/20 blur-[120px]" />
        <div className="absolute left-[-60px] bottom-[-60px] h-80 w-80 rounded-full bg-emerald-400/15 blur-[110px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-white/10 bg-card/80 shadow-2xl shadow-black/30 backdrop-blur-xl transition-all duration-300 md:static md:translate-x-0 md:flex-shrink-0",
            sidebarCollapsed ? "md:w-[92px]" : "md:w-[292px]",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
        >
          <div className="flex items-center justify-between px-4 py-4">
            <div
              className={cn(
                "flex items-center gap-3",
                sidebarCollapsed && "md:justify-center md:gap-0",
              )}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-background shadow-lg shadow-primary/40">
                <Sparkles size={20} />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
                    Arunika
                  </p>
                  <p className="text-lg font-semibold">LMS + School</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label="Tutup menu"
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:inline-flex"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                aria-label="Collapse sidebar"
              >
                {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </Button>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 pb-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href !== "/" && pathname.startsWith(item.href) && item.href !== "/cbt"
                  ? true
                  : pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left text-sm font-semibold transition duration-200",
                    isActive
                      ? "border-primary/50 bg-primary/10 text-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:border-white/10 hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  <Icon
                    size={18}
                    className={cn(
                      "text-primary transition duration-200 group-hover:scale-105",
                      isActive && "drop-shadow",
                    )}
                  />
                  {!sidebarCollapsed && (
                    <div className="flex flex-1 items-center justify-between gap-2">
                      <div>
                        <p>{item.label}</p>
                        <p className="text-xs font-normal text-muted-foreground">{item.note}</p>
                      </div>
                      {item.badge && (
                        <Badge tone="warning" className="px-2 py-1 text-[10px] uppercase">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 border-t border-white/5 p-4">
            <Card className="border-white/10 bg-gradient-to-br from-white/5 via-card/60 to-background/70">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <ShieldCheck size={18} />
                  </div>
                  {!sidebarCollapsed && (
                    <div>
                      <p className="text-sm font-semibold">Keamanan terjaga</p>
                      <p className="text-xs text-muted-foreground">
                        Single sign-on + audit trail aktif
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="flex items-center justify-between gap-3">
              {!sidebarCollapsed && (
                <div className="text-xs text-muted-foreground">
                  {user?.name ?? "Pengguna"}
                  <p className="text-foreground capitalize">{user?.role?.toLowerCase()}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Settings2 size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                  onClick={() => {
                    logout();
                    router.replace("/login");
                  }}
                  aria-label="Keluar"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 md:pl-0">
          <header className="sticky top-0 z-20 border-b border-white/5 bg-background/70 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-8">
              <div className="flex flex-1 items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileSidebarOpen(true)}
                  aria-label="Buka menu"
                >
                  <Menu size={18} />
                </Button>
                <div className="relative hidden flex-1 items-center md:flex">
                  <div className="absolute left-3 text-muted-foreground">
                    <Globe2 size={16} />
                  </div>
                  <input
                    placeholder="Cari kelas, siswa, atau modul..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-sm outline-none transition focus:border-primary/60 focus:bg-white/10"
                  />
                  <div className="absolute right-3 text-xs text-muted-foreground">
                    tekan /
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="info" className="hidden md:inline-flex capitalize">
                  {role?.toLowerCase()}
                </Badge>
                <Button variant="outline" size="sm" className="hidden md:inline-flex">
                  <CalendarRange size={16} />
                  Atur jadwal
                </Button>
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={18} />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
                </Button>
                <Button size="sm">
                  <Sparkles size={16} />
                  Buat materi
                </Button>
              </div>
            </div>
          </header>

          <div className="px-4 pb-10 pt-6 md:px-8 md:pt-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
