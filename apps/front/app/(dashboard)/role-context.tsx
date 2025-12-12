"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  BookOpen,
  CalendarClock,
  CalendarRange,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  Users2,
} from "lucide-react";

export type Role = "ADMIN" | "GURU" | "SISWA";

export type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
  note: string;
  badge?: string;
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
  navigation: NavItem[];
  ready: boolean;
  setAuth: (auth: AuthResponse) => void;
  logout: () => void;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

const navByRole: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Dasbor", icon: LayoutDashboard, href: "/", note: "Sorotan hari ini" },
    { label: "Kelola User", icon: Users2, href: "/users", note: "Manajemen pengguna" },
    { label: "Data Siswa", icon: Users2, href: "/siswa", note: "Profil & kehadiran" },
    { label: "Data Guru", icon: Users2, href: "/guru", note: "Penugasan & KPI" },
    { label: "Data Kelas", icon: CalendarRange, href: "/kelas", note: "Struktur & jadwal" },
    { label: "Data Jurusan", icon: BookOpen, href: "/jurusan", note: "Program studi" },
    { label: "Tahun Ajaran", icon: CalendarClock, href: "/tahun-ajaran", note: "Periode aktif" },
    { label: "Mata Pelajaran", icon: BookOpen, href: "/mata-pelajaran", note: "Silabus & mapel" },
    { label: "CBT", icon: ClipboardCheck, href: "/cbt", note: "Soal, ujian, sesi", badge: "CBT" },
    { label: "Pelaporan", icon: BarChart3, href: "/laporan", note: "Analitik & export" },
    { label: "Keamanan", icon: ShieldCheck, href: "/keamanan", note: "Role & audit" },
    { label: "Keuangan", icon: CreditCard, href: "/keuangan", note: "Tagihan, SPP" },
  ],
  GURU: [
    { label: "Dasbor Guru", icon: LayoutDashboard, href: "/", note: "Agenda mengajar" },
    { label: "Kelas Saya", icon: CalendarRange, href: "/kelas", note: "Jadwal & materi" },
    { label: "Mata Pelajaran", icon: BookOpen, href: "/mata-pelajaran", note: "Silabus & rubrik" },
    { label: "CBT", icon: ClipboardCheck, href: "/cbt", note: "Soal & monitoring", badge: "CBT" },
    { label: "Laporan Nilai", icon: BarChart3, href: "/laporan", note: "Rekap nilai" },
  ],
  SISWA: [
    { label: "Dasbor Siswa", icon: LayoutDashboard, href: "/", note: "Progress belajar" },
    { label: "Jadwal & Kelas", icon: CalendarRange, href: "/kelas", note: "Kelas aktif" },
    { label: "Mata Pelajaran", icon: BookOpen, href: "/mata-pelajaran", note: "Materi & modul" },
    { label: "CBT", icon: ClipboardCheck, href: "/cbt", note: "Ujian & sesi", badge: "CBT" },
    { label: "Keamanan", icon: ShieldCheck, href: "/keamanan", note: "Akun & perangkat" },
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
