"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchableSelectOption = {
    value: string;
    label: string;
    description?: string;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
};

type SearchableSelectProps = {
    options: SearchableSelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
};

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Pilih...",
    searchPlaceholder = "Cari...",
    emptyMessage = "Tidak ada hasil",
    disabled = false,
    className,
}: SearchableSelectProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Get selected option label
    const selectedOption = useMemo(
        () => options.find((opt) => opt.value === value),
        [options, value]
    );

    // Filter options based on query
    const filteredOptions = useMemo(() => {
        if (!query.trim()) return options;
        const lowerQuery = query.toLowerCase();
        return options.filter(
            (opt) =>
                opt.label.toLowerCase().includes(lowerQuery) ||
                opt.description?.toLowerCase().includes(lowerQuery)
        );
    }, [options, query]);

    // Reset selected index when filtered options change
    useEffect(() => {
        setSelectedIndex(0);
    }, [filteredOptions]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = useCallback(
        (opt: SearchableSelectOption) => {
            onChange(opt.value);
            setIsOpen(false);
            setQuery("");
        },
        [onChange]
    );

    const handleClear = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onChange("");
            setQuery("");
        },
        [onChange]
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === "Enter" || e.key === "ArrowDown") {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < filteredOptions.length - 1 ? prev + 1 : 0
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredOptions.length - 1
                );
                break;
            case "Enter":
                e.preventDefault();
                if (filteredOptions[selectedIndex]) {
                    handleSelect(filteredOptions[selectedIndex]);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setQuery("");
                break;
        }
    };

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            {/* Trigger Button / Display */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) {
                        setTimeout(() => inputRef.current?.focus(), 0);
                    }
                }}
                className={cn(
                    "flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-left transition",
                    "hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                    disabled && "opacity-50 cursor-not-allowed",
                    isOpen && "border-primary ring-2 ring-primary/20"
                )}
            >
                <span className={cn(!selectedOption && "text-muted-foreground")}>
                    {selectedOption?.label || placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {value && (
                        <X
                            size={14}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={handleClear}
                        />
                    )}
                    <ChevronDown
                        size={16}
                        className={cn(
                            "text-muted-foreground transition-transform",
                            isOpen && "rotate-180"
                        )}
                    />
                </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-[100] rounded-lg border border-border bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-border bg-gray-50 dark:bg-zinc-800/50">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={searchPlaceholder}
                                className="w-full h-9 rounded-md border border-border bg-background pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                {emptyMessage}
                            </div>
                        ) : (
                            filteredOptions.map((opt, index) => {
                                const Icon = opt.icon;
                                const isSelected = opt.value === value;
                                const isHighlighted = index === selectedIndex;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(opt)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={cn(
                                            "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition",
                                            isHighlighted && "bg-gray-100 dark:bg-zinc-800",
                                            isSelected && "text-primary bg-primary/10"
                                        )}
                                    >
                                        {Icon && (
                                            <Icon
                                                size={16}
                                                className={cn(
                                                    "shrink-0",
                                                    isSelected ? "text-primary" : "text-muted-foreground"
                                                )}
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate font-medium">{opt.label}</p>
                                            {opt.description && (
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {opt.description}
                                                </p>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <Check size={16} className="shrink-0 text-primary" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
