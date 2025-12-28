"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import {
  Bell,
  CalendarRange,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe2,
  LogOut,
  Menu,
  Search,
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
}
  from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { NotificationDropdown } from "@/components/notification-dropdown";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { useRole, Role, NavItem, NavGroup } from "./role-context";


const accessByRole: Record<Role, string[]> = {
  ADMIN: ["/", "/profile", "/change-password", "/users", "/siswa", "/kenaikan-kelas", "/guru", "/kelas", "/jurusan", "/tahun-ajaran", "/mata-pelajaran", "/jadwal-pelajaran", "/materi", "/materi-management", "/tugas", "/tugas-management", "/forum", "/attendance", "/database", "/cbt", "/bank-soal", "/paket-soal", "/ujian", "/penilaian", "/laporan", "/keuangan", "/keamanan", "/settings", "/pengumuman"],
  GURU: ["/", "/profile", "/change-password", "/kelas", "/mata-pelajaran", "/jadwal-pelajaran", "/materi", "/materi-management", "/tugas", "/tugas-management", "/forum", "/pengumuman", "/attendance", "/cbt", "/bank-soal", "/paket-soal", "/ujian", "/penilaian", "/laporan"],
  SISWA: ["/", "/profile", "/change-password", "/jadwal-pelajaran", "/materi", "/tugas", "/forum", "/pengumuman", "/cbt", "/ujian-saya", "/keamanan"],
  PETUGAS_ABSENSI: ["/", "/profile", "/change-password", "/attendance"],
};

// Search Command Component
function SearchCommand({ navigation }: { navigation: NavGroup[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Flatten all navigation items for searching
  const allItems = useMemo(() => {
    const items: (NavItem & { group: string })[] = [];
    navigation.forEach((group) => {
      group.items.forEach((item) => {
        items.push({ ...item, group: group.label || "Menu" });
      });
    });
    return items;
  }, [navigation]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8); // Show first 8 items when no query
    const lowerQuery = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(lowerQuery) ||
        item.note.toLowerCase().includes(lowerQuery) ||
        item.href.toLowerCase().includes(lowerQuery)
    );
  }, [allItems, query]);

  // Reset selected index when filtered items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // "/" to focus search
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (item: NavItem) => {
      router.push(item.href);
      setIsOpen(false);
      setQuery("");
      inputRef.current?.blur();
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div className="relative flex flex-1 items-center">
      <div className="absolute left-3 text-muted-foreground z-10">
        <Search size={16} />
      </div>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Cari menu..."
        className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary/60 focus:bg-background md:pr-10"
      />
      <div className="absolute right-3 hidden text-xs text-muted-foreground md:block">
        tekan /
      </div>

      {/* Dropdown */}
      {isOpen && filteredItems.length > 0 && (
        <div
          ref={dropdownRef}
          className={cn(
            "mt-2 max-h-80 overflow-y-auto rounded-xl border border-border bg-card shadow-lg backdrop-blur-xl z-50",
            // Mobile: Fixed position to span screen width
            "fixed left-4 right-4 top-20",
            // Desktop: Absolute position under input
            "md:absolute md:top-full md:left-0 md:right-0"
          )}
        >
          {filteredItems.map((item, index) => {
            const Icon = item.icon;
            const isSelected = index === selectedIndex;
            return (
              <button
                key={`${item.href}-${index}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition",
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/50"
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.note}
                  </p>
                </div>
                {item.group && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    {item.group}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* No results */}
      {isOpen && query && filteredItems.length === 0 && (
        <div
          ref={dropdownRef}
          className={cn(
            "mt-2 rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground shadow-lg backdrop-blur-xl z-50",
            "fixed left-4 right-4 top-20",
            "md:absolute md:top-full md:left-0 md:right-0"
          )}
        >
          Tidak ada hasil untuk "{query}"
        </div>
      )}
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, token, navigation, ready, logout } = useRole();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const allowed = useMemo(() => {
    if (!role) return false;
    const list = accessByRole[role];
    return list.some((p) => (p === "/" ? pathname === "/" : pathname.startsWith(p)));
  }, [role, pathname]);

  const isFocusMode = useMemo(() => {
    return pathname.includes("/ujian-saya/kerjakan/");
  }, [pathname]);

  // Initialize all groups as expanded by default
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    navigation.forEach((group) => {
      if (group.label && group.collapsible) {
        initialExpanded[group.label] = true;
      }
    });
    setExpandedGroups(initialExpanded);
  }, [navigation]);

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
      {!isFocusMode && (
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute inset-x-0 top-[-160px] h-80 bg-gradient-to-b from-primary/30 via-transparent to-transparent blur-3xl" />
          <div className="absolute right-[-80px] top-28 h-80 w-80 rounded-full bg-secondary/20 blur-[120px]" />
          <div className="absolute left-[-60px] bottom-[-60px] h-80 w-80 rounded-full bg-emerald-400/15 blur-[110px]" />
        </div>
      )}

      <div className="relative z-10 flex min-h-screen">
        {!isFocusMode && (
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-border bg-card/80 shadow-2xl shadow-black/5 dark:shadow-black/30 backdrop-blur-xl transition-all duration-300 md:translate-x-0",
              sidebarCollapsed ? "w-[92px]" : "w-[292px]",
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            )}
          >
            <div className="flex items-center justify-between px-4 py-4">
              <div
                className={cn(
                  "flex items-center gap-3",
                  sidebarCollapsed && "justify-center gap-0",
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

            <nav className="flex-1 overflow-y-auto space-y-1 px-3 pb-4 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
              {navigation.map((group, groupIndex) => {
                const isExpanded = expandedGroups[group.label] !== false;
                const hasLabel = group.label !== "";

                return (
                  <div key={groupIndex} className="space-y-1">
                    {hasLabel && group.collapsible && (
                      <button
                        onClick={() =>
                          setExpandedGroups((prev) => ({
                            ...prev,
                            [group.label]: !isExpanded,
                          }))
                        }
                        className={cn(
                          "group flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider transition duration-200",
                          sidebarCollapsed ? "justify-center" : "",
                          "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {!sidebarCollapsed && <span>{group.label}</span>}
                        <ChevronDown
                          size={14}
                          className={cn(
                            "transition-transform duration-200",
                            isExpanded ? "rotate-0" : "-rotate-90"
                          )}
                        />
                      </button>
                    )}
                    {hasLabel && !group.collapsible && !sidebarCollapsed && (
                      <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {group.label}
                      </div>
                    )}
                    <div
                      className={cn(
                        "space-y-1 overflow-hidden transition-all duration-300",
                        !isExpanded && group.collapsible ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
                      )}
                    >
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        // Special handling for /ujian paths to match correctly
                        let isActive = false;
                        if (item.href === "/ujian") {
                          // "Ujian Akan Datang" - hanya aktif untuk /ujian, /ujian/create, /ujian/edit
                          isActive = pathname === "/ujian" ||
                            pathname.startsWith("/ujian/create") ||
                            pathname.startsWith("/ujian/edit");
                        } else if (item.href === "/ujian/berlangsung") {
                          // "Pelaksanaan Ujian" - aktif untuk /ujian/berlangsung dan /ujian/monitoring
                          isActive = pathname.startsWith("/ujian/berlangsung") ||
                            pathname.startsWith("/ujian/monitoring");
                        } else if (item.href === "/ujian/hasil") {
                          // "Hasil Ujian" - hanya /ujian/hasil
                          isActive = pathname.startsWith("/ujian/hasil");
                        } else if (item.href !== "/" && item.href !== "/cbt") {
                          isActive = pathname.startsWith(item.href);
                        } else {
                          isActive = pathname === item.href;
                        }

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMobileSidebarOpen(false)}
                            className={cn(
                              "group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left text-sm font-medium transition duration-200",
                              hasLabel && !sidebarCollapsed ? "ml-2" : "",
                              isActive
                                ? "border-border bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                          >
                            <Icon
                              size={18}
                              className={cn(
                                "transition duration-200",
                                isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
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
                    </div>
                  </div>
                );
              })}
            </nav>
          </aside>
        )}

        <div
          className={cn(
            "flex-1 min-w-0 transition-all duration-300 ease-in-out",
            isFocusMode ? "p-0" : (sidebarCollapsed ? "md:pl-[92px]" : "md:pl-[292px]")
          )}
        >
          {!isFocusMode && (
            <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
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
                  <SearchCommand navigation={navigation} />
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <NotificationDropdown />
                  <UserAvatar
                    user={user}
                    onLogout={() => {
                      logout();
                      router.replace("/login");
                    }}
                  />
                </div>
              </div>
            </header>
          )}

          <div
            className={cn(
              "md:px-8",
              isFocusMode ? "p-0 min-h-screen bg-background" : "px-4 pb-24 pt-6 md:pt-8 md:pb-10"
            )}
          >
            {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation - Hide in Focus Mode */}
        {!isFocusMode && <MobileBottomNav />}
      </div>
    </main>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
