"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";

import { CoinIcon } from "@/components/ui/CoinIcon";
import { marketTickerItems } from "@/data/market";
import { cn } from "@/lib/utils";

export function MarketTickerStrip() {
  const renderTickerItems = (copy: "primary" | "duplicate") =>
    marketTickerItems.map((item) => {
      const isNegative = item.change.startsWith("-");

      return (
        <article
          key={`${copy}-${item.symbol}`}
          className="flex h-[60px] w-[180px] shrink-0 items-center gap-3 overflow-hidden rounded-[12px] border border-[#3A4043]/40 bg-[#0E0F10] px-3 sm:w-[250px]"
        >
          <CoinIcon symbol={item.symbol} size={32} />
          <div className="min-w-0 flex-1 sm:min-w-[92px] sm:flex-none">
            <div className="text-[12px] font-bold text-[#F4F7F8]">{item.symbol}</div>
            <div className="mt-1 flex items-center gap-1 whitespace-nowrap text-[12px]">
              <span className="text-[#F4F7F8]">{item.price}</span>
              <span className={cn(isNegative ? "text-[#FF4D6D]" : "text-[#27E9A6]")}>
                {item.change}
              </span>
            </div>
          </div>
          <div className="hidden h-[26px] w-[82px] shrink-0 sm:block">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={item.chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isNegative ? "#FF4D6D" : "#27E9A6"}
                  strokeWidth={1.8}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      );
    });

  return (
    <section className="market-coin-row overflow-hidden">
      <div className="market-coin-track animate-market-row-left flex w-max will-change-transform">
        <div className="flex shrink-0 gap-3 pr-3 sm:gap-6 sm:pr-6">
          {renderTickerItems("primary")}
        </div>
        <div
          aria-hidden="true"
          className="flex shrink-0 gap-3 pr-3 sm:gap-6 sm:pr-6"
        >
          {renderTickerItems("duplicate")}
        </div>
      </div>
    </section>
  );
}
