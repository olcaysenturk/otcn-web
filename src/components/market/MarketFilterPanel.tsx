"use client";

import { ChevronDown, ListFilter, Search } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import type { MarketFilterPanelProps, MarketTabKey } from "@/types/market";

const tabs: MarketTabKey[] = ["cryptos", "favorites", "spots", "futures"];

export function MarketFilterPanel({
  activeTab,
  activeCategory,
  categories,
  searchQuery,
  onTabChange,
  onCategoryChange,
  onSearchChange,
}: MarketFilterPanelProps) {
  const { t } = useI18n();

  return (
    <section>
      <div className="overflow-hidden rounded-[14px] border border-[#3A4043]/70 bg-[#0E0F10] p-3">
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as MarketTabKey)} variant="compact">
          <TabsList animated>
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {t(`marketPage.tabs.${tab}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            className={cn(
              "shrink-0 rounded-[7px] border px-3 py-1.5 text-[11px] font-medium text-[#F4F7F8] transition-colors sm:text-[12px]",
              activeCategory === null ? "border-[#C7F022]" : "border-[#3A4043]",
            )}
          >
            {t("marketPage.categories.all")}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={cn(
                "shrink-0 rounded-[7px] border px-3 py-1.5 text-[11px] font-medium text-[#F4F7F8] capitalize transition-colors sm:text-[12px]",
                activeCategory === category ? "border-[#C7F022]" : "border-[#3A4043]",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h1 className="text-[18px] font-medium text-[#F4F7F8]">
          {t("marketPage.categories.topGainers")}
        </h1>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="hidden h-7 rounded-[8px] bg-[#1F2628] px-3 text-[11px] text-[#F4F7F8] sm:block"
          >
            3m
          </button>
          <span className="text-[11px] text-[#5E666A]">120</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <label className="flex h-10 w-10 shrink-0 items-center gap-2 overflow-hidden rounded-full border border-[#3A4043] bg-[#0E0F10] px-[9px] transition-[width] sm:w-full sm:max-w-[500px] sm:px-3">
          <Search className="h-5 w-5 text-[#5E666A]" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("marketPage.search")}
            className="hidden min-w-0 flex-1 bg-transparent text-[12px] text-[#F4F7F8] outline-none placeholder:text-[#5E666A] sm:block"
          />
        </label>

        <div className="flex min-w-0 gap-2 overflow-x-auto [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden">
          {["marketCap", "volume24h"].map((filter) => (
            <button
              key={filter}
              type="button"
              className="hidden h-[38px] shrink-0 items-center gap-8 rounded-[12px] border border-[#3A4043] bg-[#0E0F10] px-3 text-[12px] text-[#C5C9CC] lg:flex"
            >
              {t(`marketPage.filters.${filter}`)}
              <ChevronDown className="h-4 w-4" />
            </button>
          ))}
          <button
            type="button"
            className="flex h-[38px] shrink-0 items-center gap-2 rounded-[12px] border border-[#3A4043] bg-[#0E0F10] px-3 text-[11px] text-[#C5C9CC] sm:text-[12px]"
          >
            <ListFilter className="h-4 w-4" />
            {t("marketPage.filters.all")}
          </button>
          <button
            type="button"
            className="flex h-[38px] shrink-0 items-center gap-4 rounded-[12px] border border-[#3A4043] bg-[#0E0F10] px-3 text-[11px] text-[#C5C9CC] sm:gap-8 sm:text-[12px]"
          >
            {t("marketPage.filters.sortBy")}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
