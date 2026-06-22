import { MarketCoinCard } from "@/components/home/MarketCoinCard";
import { withLocale } from "@/lib/i18n/href";
import { cn } from "@/lib/utils";
import type { MarketCoinRowProps } from "@/types/home";

export function MarketCoinRow({ coins, direction, locale }: MarketCoinRowProps) {
  return (
    <div className="market-coin-row relative w-full overflow-hidden">
      <div
        className={cn(
          "market-coin-track flex w-max will-change-transform py-1",
          direction === "right"
            ? "animate-market-row-right"
            : "animate-market-row-left",
        )}
      >
        {[0, 1].map((setIndex) => (
          <div key={setIndex} className="flex shrink-0 gap-4 pr-4">
            {coins.map((coin) => (
              <MarketCoinCard
                key={`${direction}-${setIndex}-${coin.symbol}`}
                coin={coin}
                href={withLocale(`/trade/spot/${coin.symbol.toLowerCase()}`, locale)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
