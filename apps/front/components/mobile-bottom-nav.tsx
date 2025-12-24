"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    CalendarRange,
    User,
    ClipboardCheck,
    Users2,
    BarChart3,
    LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole, Role } from "../app/(dashboard)/role-context";

type BottomNavItem = {
    label: string;
    icon: LucideIcon;
    href: string;
};

// Define most used items for each role
const bottomNavByRole: Record<Role, BottomNavItem[]> = {
    ADMIN: [
        { label: "Beranda", icon: LayoutDashboard, href: "/" },
        { label: "Siswa", icon: Users2, href: "/siswa" },
        { label: "Ujian", icon: ClipboardCheck, href: "/ujian" },
        { label: "Laporan", icon: BarChart3, href: "/laporan" },
        { label: "Profil", icon: User, href: "/profile" },
    ],
    GURU: [
        { label: "Beranda", icon: LayoutDashboard, href: "/" },
        { label: "Materi", icon: BookOpen, href: "/materi-management" },
        { label: "Ujian", icon: ClipboardCheck, href: "/ujian" },
        { label: "Tugas", icon: ClipboardList, href: "/tugas-management" },
        { label: "Profil", icon: User, href: "/profile" },
    ],
    SISWA: [
        { label: "Beranda", icon: LayoutDashboard, href: "/" },
        { label: "Materi", icon: BookOpen, href: "/materi" },
        { label: "Ujian", icon: ClipboardCheck, href: "/ujian-saya" },
        { label: "Tugas", icon: ClipboardList, href: "/tugas" },
        { label: "Profil", icon: User, href: "/profile" },
    ],
    PETUGAS_ABSENSI: [
        { label: "Beranda", icon: LayoutDashboard, href: "/" },
        { label: "Scanner", icon: ClipboardList, href: "/attendance/scanner" },
        { label: "Manual", icon: Users2, href: "/attendance/manual" },
        { label: "Laporan", icon: BarChart3, href: "/attendance/report" },
        { label: "Profil", icon: User, href: "/profile" },
    ],
};

export function MobileBottomNav() {
    const pathname = usePathname();
    const { role } = useRole();

    const navItems = useMemo(() => {
        if (!role) return [];
        return bottomNavByRole[role] || [];
    }, [role]);

    if (!role || navItems.length === 0) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Gradient blur background */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border" />

            {/* Safe area padding for iOS */}
            <div className="relative flex items-center justify-around px-2 pb-safe">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 py-3 px-3 min-w-[64px] transition-all duration-200",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground active:scale-95"
                            )}
                        >
                            <div
                                className={cn(
                                    "relative flex items-center justify-center w-12 h-8 rounded-2xl transition-all duration-300",
                                    isActive
                                        ? "bg-primary/15"
                                        : "bg-transparent"
                                )}
                            >
                                <Icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={cn(
                                        "transition-all duration-200",
                                        isActive && "scale-110"
                                    )}
                                />
                                {isActive && (
                                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                                )}
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] font-medium transition-all duration-200",
                                    isActive ? "opacity-100" : "opacity-70"
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
