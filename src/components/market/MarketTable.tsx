"use client";

import { ArrowDownUp, Star } from "lucide-react";
import Link from "next/link";

import { MarketAssetRow } from "@/components/market/MarketAssetRow";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { cn } from "@/lib/utils";
import type { MarketSortKey, MarketTableProps } from "@/types/market";

const columns: Array<{ key: MarketSortKey; labelKey: string }> = [
  { key: "price", labelKey: "marketPage.table.price" },
  { key: "change1h", labelKey: "marketPage.table.change1h" },
  { key: "change24h", labelKey: "marketPage.table.change24h" },
  { key: "change7d", labelKey: "marketPage.table.change7d" },
  { key: "marketCap", labelKey: "marketPage.table.marketCap" },
  { key: "volume24h", labelKey: "marketPage.table.volume24h" },
  { key: "circulatingSupply", labelKey: "marketPage.table.circulatingSupply" },
];

export function MarketTable({
  assets,
  favorites,
  sortKey,
  onSort,
  onToggleFavorite,
}: MarketTableProps) {
  const { locale, t } = useI18n();

  return (
    <section>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1160px] border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="min-w-[180px] px-4 py-1 text-left text-[11px] font-medium text-[#788084]">
                {t("marketPage.table.asset")}
              </th>
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-1 text-left">
                  <button
                    type="button"
                    onClick={() => onSort(column.key)}
                    className="flex items-center gap-1 text-[11px] font-medium text-[#788084] transition hover:text-[#F4F7F8]"
                  >
                    {t(column.labelKey)}
                    <ArrowDownUp
                      className={`h-3 w-3 ${sortKey === column.key ? "text-[#C7F022]" : ""}`}
                    />
                  </button>
                </th>
              ))}
              <th className="w-[76px]" />
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <MarketAssetRow
                key={asset.symbol}
                asset={asset}
                isFavorite={favorites.has(asset.symbol)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(90px,1fr)_80px] gap-1 border-b border-[#3A4043]/60 px-1 pb-2 text-[10px] text-[#788084]">
          <button
            type="button"
            onClick={() => onSort("price")}
            className="flex items-center gap-1 text-left"
          >
            {t("marketPage.table.name")} <ArrowDownUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onSort("change24h")}
            className="flex items-center justify-end gap-1 text-right"
          >
            {t("marketPage.table.mobilePriceChange")} <ArrowDownUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onSort("marketCap")}
            className="flex items-center justify-end gap-1 text-right"
          >
            {t("marketPage.table.mobileCapVolume")} <ArrowDownUp className="h-3 w-3" />
          </button>
        </div>

        <div className="divide-y divide-[#3A4043]/40">
          {assets.map((asset) => {
            const isNegative = asset.change24h.trim().startsWith("-");

            return (
              <div
                key={asset.symbol}
                className="grid min-h-[60px] grid-cols-[minmax(0,1.1fr)_minmax(90px,1fr)_80px] items-center gap-1 px-1 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label={`${asset.name} favorite`}
                    onClick={() => onToggleFavorite(asset.symbol)}
                    className="shrink-0 text-[#F4F7F8]"
                  >
                    <Star
                      className={cn(
                        "h-3.5 w-3.5",
                        favorites.has(asset.symbol) && "fill-[#C7F022] text-[#C7F022]",
                      )}
                    />
                  </button>
                  <Link
                    href={withLocale(`/trade/spot/${asset.symbol.toLowerCase()}`, locale)}
                    className="flex min-w-0 items-center gap-2"
                  >
                    <CoinIcon symbol={asset.symbol} size={24} />
                    <span className="truncate text-[11px] font-medium text-[#F4F7F8]">
                      {asset.symbol}
                    </span>
                  </Link>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#F4F7F8]">{asset.price}</div>
                  <div
                    className={cn(
                      "mt-0.5 text-[10px]",
                      isNegative ? "text-[#FF4D6D]" : "text-[#27E9A6]",
                    )}
                  >
                    {asset.change24h}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#F4F7F8]">{asset.marketCap}</div>
                  <div className="mt-0.5 text-[9px] text-[#788084]">{asset.volume24h}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {assets.length === 0 && (
        <div className="px-6 py-16 text-center text-sm text-[#788084]">
          {t("marketPage.empty")}
        </div>
      )}
    </section>
  );
}
