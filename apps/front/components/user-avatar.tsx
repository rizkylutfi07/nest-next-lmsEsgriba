"use client";

import { useState, useRef, useEffect } from "react";
import { User, KeyRound, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UserAvatarProps {
    user: {
        name?: string | null;
        email?: string | null;
        role?: string | null;
    } | null;
    onLogout: () => void;
}

export function UserAvatar({ user, onLogout }: UserAvatarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const getInitials = (name?: string | null) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const menuItems = [
        {
            icon: User,
            label: "Profil",
            href: "/profile",
            description: "Lihat dan edit profil",
        },
        {
            icon: KeyRound,
            label: "Ganti Password",
            href: "/change-password",
            description: "Ubah kata sandi Anda",
        },
        {
            icon: Settings,
            label: "Pengaturan",
            href: "/settings",
            description: "Kelola preferensi",
        },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 rounded-full hover:bg-muted/50 transition-colors p-1"
            >
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-background text-sm font-semibold">
                        {getInitials(user?.name)}
                    </AvatarFallback>
                </Avatar>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-card shadow-lg backdrop-blur-xl z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="border-b border-border bg-muted/30 p-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-primary/30">
                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-background font-semibold text-base">
                                    {getInitials(user?.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{user?.name || "Pengguna"}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user?.email || "user@example.com"}
                                </p>
                                <p className="text-xs text-primary capitalize mt-0.5">
                                    {user?.role?.toLowerCase() || "User"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
                                >
                                    <Icon size={18} className="text-muted-foreground shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium">{item.label}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {item.description}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-border">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onLogout();
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <LogOut size={18} className="shrink-0" />
                            <div className="flex-1 text-left">
                                <p className="font-medium">Keluar</p>
                                <p className="text-xs text-muted-foreground">
                                    Logout dari akun Anda
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
