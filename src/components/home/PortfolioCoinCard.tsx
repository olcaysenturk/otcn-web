import Link from "next/link";

import { CoinIcon } from "@/components/ui/CoinIcon";
import { cn } from "@/lib/utils";
import type { PortfolioCoinCardProps } from "@/types/home";

export function PortfolioCoinCard({ coin, href }: PortfolioCoinCardProps) {
  const isNegative = coin.change.startsWith("-");

  return (
    <Link
      href={href}
      className="flex h-full min-w-0 flex-col gap-3 rounded-[14px] border border-border/50 bg-card p-3 shadow-card-dark transition-colors hover:border-border hover:bg-background/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <CoinIcon symbol={coin.symbol} size={32} />

      {/* Name + abbreviation (symbol on its own line under the name) */}
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-sora text-[12px] font-semibold leading-[1.35] tracking-[-0.01em] text-foreground">
          {coin.name}
        </span>
        <span className="font-sora text-[12px] font-normal leading-[1.35] tracking-[-0.01em] text-muted-foreground">
          {coin.symbol}
        </span>
      </div>

      {/* Price + change pinned to the bottom (aligned across all cards) */}
      <div className="mt-auto flex flex-col gap-1">
        <span className="font-sora text-[14px] font-semibold leading-normal tracking-[-0.015em] text-foreground">
          {coin.price}
        </span>
        <span
          className={cn(
            "font-sora text-[16px] font-bold leading-normal tracking-[-0.01em]",
            isNegative ? "text-destructive" : "text-success",
          )}
        >
          {coin.change}
        </span>
      </div>
    </Link>
  );
}
