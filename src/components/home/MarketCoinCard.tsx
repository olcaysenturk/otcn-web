import Link from "next/link";

import { CoinIcon } from "@/components/ui/CoinIcon";
import { cn } from "@/lib/utils";
import type { MarketCoinCardProps } from "@/types/home";

export function MarketCoinCard({ coin, href }: MarketCoinCardProps) {
  const isNegative = coin.change.startsWith("-");

  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-3 rounded-[14px] border border-border/50 bg-card p-3 shadow-card-dark transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <CoinIcon symbol={coin.symbol} size={32} />
      <div className="flex flex-col gap-1 pr-2">
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span className="font-sora text-[12px] font-semibold leading-[1.35] tracking-[-0.01em] text-foreground">
            {coin.name}
          </span>
          <span className="font-sora text-[12px] font-normal leading-[1.35] tracking-[-0.01em] text-gray-steel">
            ({coin.symbol})
          </span>
        </div>
        <div className="flex items-center gap-1 whitespace-nowrap">
          <span className="font-sora text-[12px] font-semibold leading-[1.35] tracking-[-0.01em] text-foreground">
            {coin.price}
          </span>
          <span
            className={cn(
              "font-sora text-[12px] font-semibold leading-[1.35] tracking-[-0.01em]",
              isNegative ? "text-destructive" : "text-success",
            )}
          >
            {coin.change}
          </span>
        </div>
      </div>
    </Link>
  );
}
