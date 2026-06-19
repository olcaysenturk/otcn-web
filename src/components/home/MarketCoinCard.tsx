import Link from "next/link";

import { CoinIcon } from "@/components/ui/CoinIcon";
import { cn } from "@/lib/utils";
import type { MarketCoinCardProps } from "@/types/home";

export function MarketCoinCard({ coin, href }: MarketCoinCardProps) {
  const isNegative = coin.change.startsWith("-");

  return (
    <Link
      href={href}
      className="flex h-[58px] w-[152px] shrink-0 items-center gap-2.5 rounded-[10px] bg-white px-3 py-2.5 text-[#1b2020] shadow-[0_8px_22px_rgba(0,0,0,0.16)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8FF00] lg:h-[66px] lg:w-[160px] lg:gap-3 lg:rounded-[12px] lg:py-3"
    >
      <CoinIcon symbol={coin.symbol} size={36} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-black leading-tight">
          {coin.name} ({coin.symbol})
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold leading-none">
          <span>{coin.price}</span>
          <span className={cn(isNegative ? "text-[#FF6175]" : "text-[#16B56F]")}>
            {coin.change}
          </span>
        </div>
      </div>
    </Link>
  );
}
