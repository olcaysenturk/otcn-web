"use client";

import { Star } from "lucide-react";
import Link from "next/link";

import { CoinIcon } from "@/components/ui/CoinIcon";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { cn } from "@/lib/utils";
import type { MarketAsset, MarketSortKey, MarketTableProps } from "@/types/market";

function ChangeValue({ value }: { value: string }) {
  const isNegative = value.trim().startsWith("-");
  return (
    <span className={cn(isNegative ? "text-[#FF4D6D]" : "text-[#27E9A6]")}>{value}</span>
  );
}

function PerpBadge() {
  return (
    <span className="inline-flex items-center rounded-[4px] border border-[#C7F022]/40 bg-[#C7F022]/10 px-1 py-[1px] text-[9px] font-bold tracking-wide text-[#C7F022]">
      PERP
    </span>
  );
}

export function MarketTable({
  assets,
  favorites,
  sortKey,
  sortDirection = "desc",
  onSort,
  onToggleFavorite,
}: MarketTableProps) {
  const { locale, t } = useI18n();

  const columns: DataTableColumn<MarketAsset, MarketSortKey>[] = [
    {
      id: "asset",
      header: t("marketPage.table.asset"),
      minWidth: "180px",
      cell: (asset) => (
        <Link
          href={withLocale(
            asset.isPerpetual ? "/trade/future" : `/trade/spot/${asset.symbol.toLowerCase()}`,
            locale,
          )}
          className="flex items-center gap-3"
        >
          <CoinIcon symbol={asset.symbol} size={32} />
          <span>
            <span className="flex items-center gap-1.5">
              <span className="block text-[14px] font-medium text-[#F4F7F8]">{asset.name}</span>
              {asset.isPerpetual && <PerpBadge />}
            </span>
            <span className="mt-0.5 block text-[11px] text-[#C5C9CC]">({asset.symbol})</span>
          </span>
        </Link>
      ),
    },
    {
      id: "price",
      header: t("marketPage.table.price"),
      sortable: true,
      cellClassName: "whitespace-nowrap font-medium",
      cell: (asset) => asset.price,
    },
    {
      id: "change24h",
      header: t("marketPage.table.change24h"),
      sortable: true,
      cellClassName: "whitespace-nowrap",
      cell: (asset) => <ChangeValue value={asset.change24h} />,
    },
    {
      id: "marketCap",
      header: t("marketPage.table.marketCap"),
      sortable: true,
      cellClassName: "whitespace-nowrap",
      cell: (asset) => asset.marketCap,
    },
    {
      id: "volume24h",
      header: t("marketPage.table.volume24h"),
      sortable: true,
      cellClassName: "whitespace-nowrap",
      cell: (asset) => (
        <>
          <span className="block">{asset.volume24h}</span>
          <span className="mt-0.5 block text-[10px] text-[#788084]">{asset.volumeUnits}</span>
        </>
      ),
    },
    {
      id: "circulatingSupply",
      header: t("marketPage.table.circulatingSupply"),
      sortable: true,
      cellClassName: "whitespace-nowrap",
      cell: (asset) => asset.circulatingSupply,
    },
    {
      id: "trade",
      header: "",
      width: "76px",
      align: "center",
      cell: (asset) => (
        <Link
          href={withLocale(
            asset.isPerpetual ? "/trade/future" : `/trade/easy/${asset.symbol.toLowerCase()}-usdt`,
            locale,
          )}
          className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#F4F7F8] px-4 text-[12px] font-bold text-[#F4F7F8] transition hover:border-[#C7F022] hover:text-[#C7F022]"
        >
          {t("marketPage.trade")}
        </Link>
      ),
    },
    {
      id: "favorite",
      header: "",
      width: "48px",
      align: "center",
      cell: (asset) => (
        <button
          type="button"
          aria-label={`${asset.name} favorite`}
          onClick={() => onToggleFavorite(asset.id)}
          className="inline-flex text-[#F4F7F8] transition hover:text-[#C7F022]"
        >
          <Star className={cn("h-4 w-4", favorites.has(asset.id) && "fill-[#C7F022] text-[#C7F022]")} />
        </button>
      ),
    },
  ];

  return (
    <section>
      <DataTable<MarketAsset, MarketSortKey>
        columns={columns}
        data={assets}
        getRowId={(asset) => asset.id}
        minWidth="1160px"
        sort={sortKey ? { key: sortKey, direction: sortDirection } : null}
        onSortChange={onSort}
        rowClassName={() => "hover:[&>td]:bg-[#121516]"}
        disableMobileCards
        empty={
          <div className="px-6 py-16 text-center text-sm text-[#788084]">{t("marketPage.empty")}</div>
        }
      />

      {/* Compact mobile layout (kept bespoke for density) */}
      <div className="md:hidden">
        <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(90px,1fr)_80px] gap-1 border-b border-[#3A4043]/60 px-1 pb-2 text-[10px] text-[#788084]">
          <button
            type="button"
            onClick={() => onSort("price")}
            className="flex items-center gap-1 text-left"
          >
            {t("marketPage.table.name")}
          </button>
          <button
            type="button"
            onClick={() => onSort("change24h")}
            className="flex items-center justify-end gap-1 text-right"
          >
            {t("marketPage.table.mobilePriceChange")}
          </button>
          <button
            type="button"
            onClick={() => onSort("marketCap")}
            className="flex items-center justify-end gap-1 text-right"
          >
            {t("marketPage.table.mobileCapVolume")}
          </button>
        </div>

        <div className="divide-y divide-[#3A4043]/40">
          {assets.map((asset) => {
            const isNegative = asset.change24h.trim().startsWith("-");
            return (
              <div
                key={asset.id}
                className="grid min-h-[60px] grid-cols-[minmax(0,1.1fr)_minmax(90px,1fr)_80px] items-center gap-1 px-1 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label={`${asset.name} favorite`}
                    onClick={() => onToggleFavorite(asset.id)}
                    className="shrink-0 text-[#F4F7F8]"
                  >
                    <Star
                      className={cn(
                        "h-3.5 w-3.5",
                        favorites.has(asset.id) && "fill-[#C7F022] text-[#C7F022]",
                      )}
                    />
                  </button>
                  <Link
                    href={withLocale(
                      asset.isPerpetual
                        ? "/trade/future"
                        : `/trade/spot/${asset.symbol.toLowerCase()}`,
                      locale,
                    )}
                    className="flex min-w-0 items-center gap-2"
                  >
                    <CoinIcon symbol={asset.symbol} size={24} />
                    <span className="flex min-w-0 items-center gap-1">
                      <span className="truncate text-[11px] font-medium text-[#F4F7F8]">
                        {asset.symbol}
                      </span>
                      {asset.isPerpetual && <PerpBadge />}
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

        {assets.length === 0 && (
          <div className="px-6 py-16 text-center text-sm text-[#788084]">
            {t("marketPage.empty")}
          </div>
        )}
      </div>
    </section>
  );
}
