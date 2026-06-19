"use client";

import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface SearchResult {
    name: string;
    symbol: string;
}

interface SearchInputProps {
    placeholder?: string;
    className?: string;
    onSearch?: (query: string) => void;
    results?: SearchResult[];
    onResultSelect?: (result: SearchResult) => void;
}

export function SearchInput({
    placeholder,
    className,
    onSearch,
    results = [],
    onResultSelect,
}: SearchInputProps) {
    const { t } = useI18n();
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsFocused(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch?.(value);
    };

    const clearSearch = () => {
        setQuery("");
        onSearch?.("");
    };

    const resolvedPlaceholder = placeholder ?? t("common.searchInput.placeholder");

    return (
        <div ref={containerRef} className={cn("relative z-50 w-full", className)}>
            <div className="flex items-center w-full h-10 rounded-[24px] border border-white/10 bg-white/5 pl-[10px] pr-1 py-1 gap-2 relative z-50">
                <Search className="h-5 w-5 text-gray-400 shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    placeholder={resolvedPlaceholder}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 h-full text-sm min-w-0"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors mr-1 shrink-0"
                    >
                        <X className="h-3 w-3 text-gray-300" />
                    </button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isFocused && query && results.length > 0 && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#1C2425] rounded-[24px] border border-white/10 shadow-lg p-4 z-40">
                    <div className="text-sm text-gray-400 mb-2 px-2">{t("common.searchInput.relatedResults")}</div>
                    <div className="space-y-1">
                        {results.map((result, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    onResultSelect?.(result);
                                    setIsFocused(false);
                                }}
                                className="flex items-center px-4 py-3 rounded-xl hover:bg-white/10 cursor-pointer transition-colors group"
                            >
                                <span className="text-sm font-medium text-white">
                                    {result.name} ({result.symbol})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
