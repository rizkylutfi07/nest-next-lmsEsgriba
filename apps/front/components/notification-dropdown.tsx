"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
    Bell,
    CheckCheck,
    Trash2,
    FileText,
    ClipboardCheck,
    BookOpen,
    Award,
    Clock,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { notifikasiApi } from "@/lib/api";

// Helper to get icon based on notification type
const getNotificationIcon = (tipe: string) => {
    switch (tipe) {
        case "TUGAS_BARU":
            return <FileText size={20} className="text-blue-500" />;
        case "TUGAS_DINILAI":
            return <Award size={20} className="text-green-500" />;
        case "DEADLINE_REMINDER":
            return <Clock size={20} className="text-amber-500" />;
        case "MATERI_BARU":
            return <BookOpen size={20} className="text-purple-500" />;
        case "SISTEM":
            return <ClipboardCheck size={20} className="text-cyan-500" />;
        default:
            return <Bell size={20} className="text-muted-foreground" />;
    }
};

// Helper to format relative time
const getRelativeTime = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return past.toLocaleDateString("id-ID");
};

// Group notifications by date
const groupNotificationsByDate = (notifications: any[]) => {
    const groups: { [key: string]: any[] } = {
        "Hari Ini": [],
        Kemarin: [],
        "Minggu Ini": [],
        Lainnya: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    notifications.forEach((notif) => {
        const notifDate = new Date(notif.createdAt);
        const notifDay = new Date(
            notifDate.getFullYear(),
            notifDate.getMonth(),
            notifDate.getDate()
        );

        if (notifDay.getTime() === today.getTime()) {
            groups["Hari Ini"].push(notif);
        } else if (notifDay.getTime() === yesterday.getTime()) {
            groups["Kemarin"].push(notif);
        } else if (notifDay >= weekAgo) {
            groups["Minggu Ini"].push(notif);
        } else {
            groups["Lainnya"].push(notif);
        }
    });

    return groups;
};

export function NotificationDropdown() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    // Fetch unread count
    const { data: unreadCountData } = useQuery({
        queryKey: ["notifications", "unread-count"],
        queryFn: () => notifikasiApi.getUnreadCount(),
        refetchInterval: 30000, // Poll every 30 seconds
    });

    const unreadCount = typeof unreadCountData === 'number' ? unreadCountData : 0;

    // Fetch notifications (only when dropdown is open)
    const { data: notifications = [], refetch } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => notifikasiApi.getAll(),
        enabled: isOpen,
    });

    // Mark as read mutation
    const markAsReadMutation = useMutation({
        mutationFn: (id: string) => notifikasiApi.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
        },
    });

    // Mark all as read mutation
    const markAllAsReadMutation = useMutation({
        mutationFn: () => notifikasiApi.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
        },
    });

    // Delete notification mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => notifikasiApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
        },
    });

    const handleNotificationClick = (notification: any) => {
        // Mark as read
        if (!notification.isRead) {
            markAsReadMutation.mutate(notification.id);
        }

        // Navigate to link
        if (notification.linkUrl) {
            router.push(notification.linkUrl);
            setIsOpen(false);
        }
    };

    const handleMarkAllRead = () => {
        markAllAsReadMutation.mutate();
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        deleteMutation.mutate(id);
    };

    // Refetch when dropdown opens
    useEffect(() => {
        if (isOpen) {
            refetch();
        }
    }, [isOpen, refetch]);

    const groupedNotifications = groupNotificationsByDate(notifications);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/5">
                    <Bell size={20} className="text-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-[10px] font-bold text-white shadow-lg ring-2 ring-background animate-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-screen sm:w-[420px] max-h-[85vh] sm:max-h-[600px] overflow-hidden p-0 shadow-2xl border bg-card"
                sideOffset={8}
            >
                {/* Header with solid background */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary/20 flex-shrink-0">
                            <Bell size={16} className="text-primary sm:h-[18px] sm:w-[18px]" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-sm sm:text-base truncate">Notifikasi</h3>
                            {unreadCount > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    {unreadCount} belum dibaca
                                </p>
                            )}
                        </div>
                    </div>
                    {notifications.length > 0 && unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 sm:h-8 gap-1 sm:gap-1.5 text-xs hover:bg-primary/10 hover:text-primary flex-shrink-0 px-2 sm:px-3"
                            onClick={handleMarkAllRead}
                            disabled={markAllAsReadMutation.isPending}
                        >
                            <CheckCheck size={14} className="hidden sm:block" />
                            <span className="text-xs">Tandai</span>
                        </Button>
                    )}
                </div>

                {/* Notifications List with custom scrollbar */}
                <div className="max-h-[calc(85vh-80px)] sm:max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 blur-xl" />
                                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
                                    <Bell size={36} className="text-primary/40" />
                                </div>
                            </div>
                            <h4 className="font-bold text-lg mb-2">Tidak ada notifikasi</h4>
                            <p className="text-sm text-muted-foreground text-center max-w-[280px]">
                                Notifikasi penting akan muncul di sini untuk membantu Anda tetap update
                            </p>
                        </div>
                    ) : (
                        Object.entries(groupedNotifications).map(
                            ([group, groupNotifications]) =>
                                groupNotifications.length > 0 && (
                                    <div key={group} className="border-b last:border-0">
                                        <div className="sticky top-0 z-10 px-3 sm:px-4 py-1.5 sm:py-2 bg-muted/80 backdrop-blur-sm">
                                            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wide">
                                                {group}
                                            </p>
                                        </div>
                                        <div className="divide-y divide-border/50">
                                            {groupNotifications.map((notification: any) => (
                                                <div
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className={cn(
                                                        "group relative flex gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 hover:bg-accent/50 cursor-pointer transition-all duration-200",
                                                        !notification.isRead && "bg-primary/10 border-l-2 border-l-primary"
                                                    )}
                                                >
                                                    {/* Icon with background */}
                                                    <div className="flex-shrink-0">
                                                        <div className={cn(
                                                            "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-transform group-hover:scale-110",
                                                            notification.tipe === "TUGAS_BARU" && "bg-blue-500/10",
                                                            notification.tipe === "TUGAS_DINILAI" && "bg-green-500/10",
                                                            notification.tipe === "DEADLINE_REMINDER" && "bg-amber-500/10",
                                                            notification.tipe === "MATERI_BARU" && "bg-purple-500/10",
                                                            notification.tipe === "SISTEM" && "bg-cyan-500/10"
                                                        )}>
                                                            {getNotificationIcon(notification.tipe)}
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1 pr-7 sm:pr-8">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p
                                                                className={cn(
                                                                    "text-xs sm:text-sm leading-snug break-words flex-1",
                                                                    !notification.isRead && "font-bold text-foreground"
                                                                )}
                                                            >
                                                                {notification.judul}
                                                            </p>
                                                            {!notification.isRead && (
                                                                <span className="flex-shrink-0 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-gradient-to-br from-primary to-primary/70 mt-1 shadow-lg shadow-primary/50" />
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2 break-words">
                                                            {notification.pesan}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5">
                                                            <Clock size={10} className="text-muted-foreground/70 sm:h-[11px] sm:w-[11px]" />
                                                            <p className="text-[10px] sm:text-xs text-muted-foreground/70 font-medium">
                                                                {getRelativeTime(notification.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Delete button (on hover/touch) */}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-2 top-2 h-6 w-6 sm:h-7 sm:w-7 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                                                        onClick={(e) => handleDelete(e, notification.id)}
                                                    >
                                                        <X size={12} className="sm:h-[14px] sm:w-[14px]" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                        )
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
