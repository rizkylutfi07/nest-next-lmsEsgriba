"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const notifications = [
    {
        id: "1",
        type: "TUGAS_DINILAI",
        title: "Nilai tugas Database telah keluar",
        message: "Anda mendapat nilai 85/100",
        time: "2 jam yang lalu",
        isRead: false,
    },
    {
        id: "2",
        type: "MATERI_BARU",
        title: "Materi baru: Tutorial React Hooks",
        message: "Pak Rizky mengunggah materi di Pemrograman Web",
        time: "5 jam yang lalu",
        isRead: false,
    },
    {
        id: "3",
        type: "FORUM_REPLY",
        title: "Pak Rizky menjawab pertanyaan Anda",
        message: "Thread: Cara Optimal Belajar Algoritma",
        time: "1 hari yang lalu",
        isRead: true,
    },
    {
        id: "4",
        type: "DEADLINE_REMINDER",
        title: "Reminder: Tugas Algoritma",
        message: "Deadline dalam 2 hari",
        time: "1 hari yang lalu",
        isRead: true,
    },
];

const typeIcons: Record<string, string> = {
    TUGAS_DINILAI: "🎓",
    MATERI_BARU: "📚",
    FORUM_REPLY: "💬",
    DEADLINE_REMINDER: "⏰",
    TUGAS_BARU: "📝",
    PENGUMUMAN: "📢",
};

export function NotificationBell() {
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center"
                            tone="warning"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifikasi</span>
                    {unreadCount > 0 && (
                        <Badge tone="info" className="text-xs">
                            {unreadCount} baru
                        </Badge>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((notif) => (
                        <DropdownMenuItem
                            key={notif.id}
                            className={cn(
                                "flex flex-col items-start gap-1 p-3 cursor-pointer",
                                !notif.isRead && "bg-primary/5"
                            )}
                        >
                            <div className="flex w-full items-start gap-2">
                                <span className="text-lg">{typeIcons[notif.type] || "📌"}</span>
                                <div className="flex-1 space-y-1">
                                    <p className={cn("text-sm font-medium", !notif.isRead && "font-semibold")}>
                                        {notif.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{notif.message}</p>
                                    <p className="text-[10px] text-muted-foreground">{notif.time}</p>
                                </div>
                                {!notif.isRead && (
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                )}
                            </div>
                        </DropdownMenuItem>
                    ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-xs text-primary">
                    Lihat Semua Notifikasi
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
