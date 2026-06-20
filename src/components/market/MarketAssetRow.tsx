"use client";

import { Star } from "lucide-react";
import Link from "next/link";

import { CoinIcon } from "@/components/ui/CoinIcon";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { withLocale } from "@/lib/i18n/href";
import { cn } from "@/lib/utils";
import type { MarketAssetRowProps } from "@/types/market";

function ChangeValue({ value }: { value: string }) {
  const isNegative = value.trim().startsWith("-");

  return (
    <span className={cn(isNegative ? "text-[#FF4D6D]" : "text-[#27E9A6]")}>
      {value}
    </span>
  );
}

export function MarketAssetRow({
  asset,
  isFavorite,
  onToggleFavorite,
}: MarketAssetRowProps) {
  const { locale, t } = useI18n();

  return (
    <tr className="group [&>td]:h-[74px] [&>td]:border-y [&>td]:border-[#3A4043] [&>td]:bg-[#0E0F10] [&>td]:transition-colors hover:[&>td]:bg-[#121516]">
      <td className="min-w-[180px] rounded-l-[20px] border-l px-4">
        <Link
          href={withLocale(`/trade/spot/${asset.symbol.toLowerCase()}`, locale)}
          className="flex items-center gap-3"
        >
          <CoinIcon symbol={asset.symbol} size={32} />
          <span>
            <span className="block text-[14px] font-medium text-[#F4F7F8]">
              {asset.name}
            </span>
            <span className="mt-0.5 block text-[11px] text-[#C5C9CC]">
              ({asset.symbol})
            </span>
          </span>
        </Link>
      </td>
      <td className="whitespace-nowrap px-3 text-left text-[13px] font-medium text-[#F4F7F8]">
        {asset.price}
      </td>
      <td className="whitespace-nowrap px-3 text-left text-[13px]">
        <ChangeValue value={asset.change1h} />
      </td>
      <td className="whitespace-nowrap px-3 text-left text-[13px]">
        <ChangeValue value={asset.change24h} />
      </td>
      <td className="whitespace-nowrap px-3 text-left text-[13px]">
        <ChangeValue value={asset.change7d} />
      </td>
      <td className="whitespace-nowrap px-3 text-left text-[13px] text-[#F4F7F8]">
        {asset.marketCap}
      </td>
      <td className="whitespace-nowrap px-3 text-left text-[13px] text-[#F4F7F8]">
        <span className="block">{asset.volume24h}</span>
        <span className="mt-0.5 block text-[10px] text-[#788084]">{asset.volumeUnits}</span>
      </td>
      <td className="whitespace-nowrap px-3 text-left text-[13px] text-[#F4F7F8]">
        {asset.circulatingSupply}
      </td>
      <td className="w-[76px] px-2 text-center">
        <Link
          href={withLocale(`/trade/easy/${asset.symbol.toLowerCase()}-usdt`, locale)}
          className="inline-flex h-10 items-center justify-center rounded-[12px] border border-[#F4F7F8] px-4 text-[12px] font-bold text-[#F4F7F8] transition hover:border-[#C7F022] hover:text-[#C7F022]"
        >
          {t("marketPage.trade")}
        </Link>
      </td>
      <td className="w-12 rounded-r-[20px] border-r px-3 text-center">
        <button
          type="button"
          aria-label={`${asset.name} favorite`}
          onClick={() => onToggleFavorite(asset.symbol)}
          className="inline-flex text-[#F4F7F8] transition hover:text-[#C7F022]"
        >
          <Star
            className={cn("h-4 w-4", isFavorite && "fill-[#C7F022] text-[#C7F022]")}
          />
        </button>
      </td>
    </tr>
  );
}
