import { MarketOverviewCard } from "@/components/market/MarketOverviewCard";
import { marketOverviewMetrics } from "@/data/market";

export function MarketOverview() {
  return (
    <section className="overflow-x-auto rounded-[18px] bg-[#0E0F10] p-3 shadow-[0_2px_8px_0.3px_rgba(58,64,67,0.2)] [scrollbar-width:none] lg:rounded-[22px] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max items-center px-2 py-3">
        {marketOverviewMetrics.map((metric) => (
          <MarketOverviewCard key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  );
}
