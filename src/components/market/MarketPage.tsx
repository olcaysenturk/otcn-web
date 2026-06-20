"use client";

import { useMemo, useState } from "react";

import { MarketFilterPanel } from "@/components/market/MarketFilterPanel";
import { MarketOverview } from "@/components/market/MarketOverview";
import { MarketPagination } from "@/components/market/MarketPagination";
import { MarketTable } from "@/components/market/MarketTable";
import { MarketTickerStrip } from "@/components/market/MarketTickerStrip";
import { marketAssets } from "@/data/market";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { MarketSortKey, MarketTabKey } from "@/types/market";

const PAGE_SIZE = 8;
const MOCK_TOTAL_PAGES = 10;

function numericValue(value: string) {
  const normalized = value.replace(/[$,%\s]/g, "");
  const multiplier = normalized.endsWith("T")
    ? 1_000_000_000_000
    : normalized.endsWith("B")
      ? 1_000_000_000
      : normalized.endsWith("M")
        ? 1_000_000
        : normalized.endsWith("K")
          ? 1_000
          : 1;

  return Number.parseFloat(normalized.replace(/[TBMK]/g, "")) * multiplier || 0;
}

export function MarketPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<MarketTabKey>("cryptos");
  const [activeCategory, setActiveCategory] = useState("gainers");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<MarketSortKey>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAssets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let assets = marketAssets.filter((asset) => {
      const matchesSearch =
        !query ||
        asset.name.toLowerCase().includes(query) ||
        asset.symbol.toLowerCase().includes(query);
      const matchesTab = activeTab !== "favorites" || favorites.has(asset.symbol);
      const matchesCategory =
        activeCategory === "all" ||
        activeCategory === "gainers" ||
        (activeCategory === "new" && ["VDA", "MATIC"].includes(asset.symbol)) ||
        asset.categories.includes(activeCategory);

      return matchesSearch && matchesTab && matchesCategory;
    });

    if (sortKey) {
      assets = [...assets].sort((left, right) => {
        const result = numericValue(left[sortKey]) - numericValue(right[sortKey]);
        return sortDirection === "asc" ? result : -result;
      });
    }

    return assets;
  }, [activeCategory, activeTab, favorites, searchQuery, sortDirection, sortKey]);

  const dataPageCount = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE));
  const totalPages = Math.max(MOCK_TOTAL_PAGES, dataPageCount);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageAssets =
    filteredAssets.length <= PAGE_SIZE
      ? filteredAssets
      : filteredAssets.slice(
          (safeCurrentPage - 1) * PAGE_SIZE,
          safeCurrentPage * PAGE_SIZE,
        );

  const resetPage = () => setCurrentPage(1);

  const handleSort = (key: MarketSortKey) => {
    if (sortKey === key) {
      setSortDirection((direction) => (direction === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
    resetPage();
  };

  const handleToggleFavorite = (symbol: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  };

  return (
    <div className="-mt-2 min-h-[calc(100vh-84px)] bg-[#1C2425] p-2 pb-8 font-satoshi text-white sm:p-4 lg:p-6">
      <div className="mx-auto flex w-full flex-col gap-5 overflow-hidden border border-[#0E0F10] bg-[#0E0F10]/40 p-2 rounded-[24px] sm:p-4 lg:rounded-[24px] lg:p-6">
        <MarketOverview />
        <MarketTickerStrip />
        <section className="rounded-[18px] bg-[#0E0F10] p-3 shadow-[0_2px_8px_0.3px_rgba(58,64,67,0.2)] sm:p-4 lg:rounded-[22px] lg:p-6">
          <MarketFilterPanel
            activeTab={activeTab}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            onTabChange={(tab) => {
              setActiveTab(tab);
              resetPage();
            }}
            onCategoryChange={(category) => {
              setActiveCategory(category);
              resetPage();
            }}
            onSearchChange={(query) => {
              setSearchQuery(query);
              resetPage();
            }}
          />
          <div className="mt-5">
            <MarketTable
              assets={pageAssets}
              favorites={favorites}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
          <div className="mt-5 flex items-center justify-between gap-4 px-1 sm:px-3">
            <div className="hidden items-center gap-2 text-[12px] text-[#C5C9CC] sm:flex">
              <span>{t("marketPage.itemsPerPage")}</span>
              <span className="text-[#F4F7F8]">{PAGE_SIZE}</span>
              <span className="text-[#788084]">⌄</span>
            </div>
            <MarketPagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
