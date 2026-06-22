"use client";

import { useMemo, useState } from "react";

import { MarketFilterPanel } from "@/components/market/MarketFilterPanel";
import { MarketOverview } from "@/components/market/MarketOverview";
import { MarketPagination } from "@/components/market/MarketPagination";
import { MarketTable } from "@/components/market/MarketTable";
import { MarketTickerStrip } from "@/components/market/MarketTickerStrip";
import { buildMarketAssets } from "@/lib/market/buildMarketAssets";
import { parseFormattedNumber } from "@/lib/market/parseFormattedNumber";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useExchangeInfoStore } from "@/stores/useExchangeInfoStore";
import { useGlobalMarketStore } from "@/stores/useGlobalMarketStore";
import { useTickerStore } from "@/stores/useTickerStore";
import type { MarketSortKey, MarketTabKey } from "@/types/market";

const PAGE_SIZE = 8;

export function MarketPage() {
  const { t } = useI18n();
  const assets = useExchangeInfoStore((state) => state.assets);
  const pairs = useExchangeInfoStore((state) => state.pairs);
  const tickers = useTickerStore((state) => state.tickers);
  const marketAssets = useGlobalMarketStore((state) => state.assets);

  const [activeTab, setActiveTab] = useState<MarketTabKey>("cryptos");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<MarketSortKey>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const liveAssets = useMemo(
    () => buildMarketAssets(assets, pairs, tickers, marketAssets),
    [assets, pairs, tickers, marketAssets],
  );

  const categories = useMemo(() => {
    const unique = new Set<string>();
    liveAssets.forEach((asset) => asset.categories.forEach((category) => unique.add(category)));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [liveAssets]);

  const filteredAssets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let items = liveAssets.filter((asset) => {
      const matchesSearch =
        !query ||
        asset.name.toLowerCase().includes(query) ||
        asset.symbol.toLowerCase().includes(query);
      const matchesFavorites = activeTab !== "favorites" || favorites.has(asset.id);
      const matchesMarketType =
        activeTab === "futures"
          ? asset.isPerpetual
          : activeTab === "spots"
            ? !asset.isPerpetual
            : true;
      const matchesCategory = !activeCategory || asset.categories.includes(activeCategory);

      return matchesSearch && matchesFavorites && matchesMarketType && matchesCategory;
    });

    if (sortKey) {
      items = [...items].sort((left, right) => {
        const result = parseFormattedNumber(left[sortKey]) - parseFormattedNumber(right[sortKey]);
        return sortDirection === "asc" ? result : -result;
      });
    }

    return items;
  }, [activeCategory, activeTab, favorites, liveAssets, searchQuery, sortDirection, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageAssets = filteredAssets.slice(
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

  const handleToggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
            categories={categories}
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
