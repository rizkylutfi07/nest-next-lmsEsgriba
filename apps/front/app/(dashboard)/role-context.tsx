"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpCircle,
  BarChart3,
  BookOpen,
  CalendarClock,
  CalendarRange,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  Users2,
  Database,
  ClipboardList,
  Settings,
} from "lucide-react";

export type Role = "ADMIN" | "GURU" | "SISWA" | "PETUGAS_ABSENSI";

export type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
  note: string;
  badge?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
  collapsible?: boolean;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt?: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

type RoleContextValue = {
  user: AuthUser | null;
  token: string | null;
  role: Role | null;
  navigation: NavGroup[];
  ready: boolean;
  setAuth: (auth: AuthResponse) => void;
  logout: () => void;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const navByRole: Record<Role, NavGroup[]> = {
  ADMIN: [
    {
      label: "",
      items: [
        { label: "Dasbor", icon: LayoutDashboard, href: "/", note: "Sorotan hari ini" },
      ],
      collapsible: false,
    },
    {
      label: "Data Akademik",
      collapsible: true,
      items: [
        { label: "Data Siswa", icon: Users2, href: "/siswa", note: "Profil & kehadiran" },
        { label: "Kenaikan Kelas", icon: ArrowUpCircle, href: "/kenaikan-kelas", note: "Manajemen kenaikan kelas" },
        { label: "Data Guru", icon: Users2, href: "/guru", note: "Penugasan & KPI" },
        { label: "Data Kelas", icon: CalendarRange, href: "/kelas", note: "Struktur & jadwal" },
        { label: "Data Jurusan", icon: BookOpen, href: "/jurusan", note: "Program studi" },
        { label: "Tahun Ajaran", icon: CalendarClock, href: "/tahun-ajaran", note: "Periode aktif" },
        { label: "Mata Pelajaran", icon: BookOpen, href: "/mata-pelajaran", note: "Silabus & mapel" },
      ],
    },
    {
      label: "LMS",
      collapsible: true,
      items: [
        { label: "Absensi", icon: ClipboardList, href: "/attendance", note: "Scan & laporan" },
        { label: "Absensi Manual", icon: Users2, href: "/attendance/manual", note: "Tandai kehadiran" },
        { label: "Pelaporan", icon: BarChart3, href: "/laporan", note: "Analitik & export" },
      ],
    },
    {
      label: "CBT",
      collapsible: true,
      items: [
        { label: "CBT", icon: ClipboardCheck, href: "/cbt", note: "Soal, ujian, sesi", badge: "CBT" },
      ],
    },
    {
      label: "Sistem",
      collapsible: true,
      items: [
        { label: "Pengaturan", icon: Settings, href: "/settings", note: "Konfigurasi sistem" },
        { label: "Kelola User", icon: Users2, href: "/users", note: "Manajemen pengguna" },
        { label: "Database", icon: Database, href: "/database", note: "Backup & restore" },
        { label: "Keamanan", icon: ShieldCheck, href: "/keamanan", note: "Role & audit" },
        { label: "Keuangan", icon: CreditCard, href: "/keuangan", note: "Tagihan, SPP" },
      ],
    },
  ],
  GURU: [
    {
      label: "",
      items: [
        { label: "Dasbor Guru", icon: LayoutDashboard, href: "/", note: "Agenda mengajar" },
      ],
      collapsible: false,
    },
    {
      label: "Pembelajaran",
      collapsible: true,
      items: [
        { label: "Kelas Saya", icon: CalendarRange, href: "/kelas", note: "Jadwal & materi" },
        { label: "Mata Pelajaran", icon: BookOpen, href: "/mata-pelajaran", note: "Silabus & rubrik" },
      ],
    },
    {
      label: "LMS",
      collapsible: true,
      items: [
        { label: "Absensi", icon: ClipboardList, href: "/attendance", note: "Scan & laporan" },
        { label: "Absensi Manual", icon: Users2, href: "/attendance/manual", note: "Tandai kehadiran" },
        { label: "Laporan Nilai", icon: BarChart3, href: "/laporan", note: "Rekap nilai" },
      ],
    },
    {
      label: "CBT",
      collapsible: true,
      items: [
        { label: "CBT", icon: ClipboardCheck, href: "/cbt", note: "Soal & monitoring", badge: "CBT" },
      ],
    },
  ],
  SISWA: [
    {
      label: "",
      items: [
        { label: "Dasbor Siswa", icon: LayoutDashboard, href: "/", note: "Progress belajar" },
      ],
      collapsible: false,
    },
    {
      label: "Pembelajaran",
      collapsible: true,
      items: [
        { label: "Jadwal & Kelas", icon: CalendarRange, href: "/kelas", note: "Kelas aktif" },
        { label: "Mata Pelajaran", icon: BookOpen, href: "/mata-pelajaran", note: "Materi & modul" },
      ],
    },
    {
      label: "CBT",
      collapsible: true,
      items: [
        { label: "CBT", icon: ClipboardCheck, href: "/cbt", note: "Ujian & sesi", badge: "CBT" },
      ],
    },
    {
      label: "Akun",
      collapsible: true,
      items: [
        { label: "Keamanan", icon: ShieldCheck, href: "/keamanan", note: "Akun & perangkat" },
      ],
    },
  ],
  PETUGAS_ABSENSI: [
    {
      label: "",
      items: [
        { label: "Dasbor Absensi", icon: LayoutDashboard, href: "/", note: "Ringkasan kehadiran" },
      ],
      collapsible: false,
    },
    {
      label: "Absensi",
      collapsible: true,
      items: [
        { label: "Scanner", icon: ClipboardList, href: "/attendance/scanner", note: "Scan barcode siswa" },
        { label: "Absensi Manual", icon: Users2, href: "/attendance/manual", note: "Tandai kehadiran" },
        { label: "Laporan Kehadiran", icon: BarChart3, href: "/attendance/report", note: "Rekap absensi" },
        { label: "Kartu Pelajar", icon: CreditCard, href: "/attendance/student-card", note: "Cetak kartu" },
      ],
    },
  ],
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  ready: boolean;
};

const STORAGE_KEY = "arunika-auth";

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    ready: false,
  });

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { user: AuthUser; token: string };
        setState({ user: parsed.user, token: parsed.token, ready: true });
        return;
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setState((prev) => ({ ...prev, ready: true }));
  }, []);

  const setAuth = (auth: AuthResponse) => {
    const payload = { user: auth.user, token: auth.accessToken };
    setState({ user: auth.user, token: auth.accessToken, ready: true });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const logout = () => {
    setState({ user: null, token: null, ready: true });
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const navigation = useMemo(() => (state.user ? navByRole[state.user.role] : []), [state.user]);

  return (
    <RoleContext.Provider
      value={{
        user: state.user,
        token: state.token,
        role: state.user?.role ?? null,
        navigation,
        ready: state.ready,
        setAuth,
        logout,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return ctx;
}
