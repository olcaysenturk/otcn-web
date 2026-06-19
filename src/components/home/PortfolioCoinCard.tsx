import { CoinIcon } from "@/components/ui/CoinIcon";
import { cn } from "@/lib/utils";
import type { PortfolioCoinCardProps } from "@/types/home";

export function PortfolioCoinCard({ coin }: PortfolioCoinCardProps) {
  const isNegative = coin.change.startsWith("-");

  return (
    <article className="h-[118px] w-full rounded-[12px] border border-white/10 bg-[#0B0D0E] px-3 py-3.5 shadow-[0_10px_22px_rgba(0,0,0,0.34),inset_0_0_0_1px_rgba(255,255,255,0.02)] md:h-[145px] md:w-[128px] md:rounded-[13px] md:px-3.5">
      <CoinIcon symbol={coin.symbol} size={32} />

      <div className="mt-4 truncate text-[11px] font-medium leading-none text-white/80 md:mt-6">
        <span className="md:hidden">{coin.symbol}</span>
        <span className="hidden md:inline">
          {coin.name} <span className="text-white/45">({coin.symbol})</span>
        </span>
      </div>
      <div className="mt-2 flex flex-col gap-1 whitespace-nowrap md:flex-row md:items-baseline md:gap-2">
        <span className="text-[13px] font-medium leading-none text-white md:text-[14px]">
          {coin.price}
        </span>
        <span
          className={cn(
            "text-[12px] font-black leading-none",
            isNegative ? "text-[#FF3F68]" : "text-[#00F0A8]",
          )}
        >
          {coin.change}
        </span>
      </div>
    </article>
  );
}
