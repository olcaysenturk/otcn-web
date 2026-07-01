"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Label, ResponsiveContainer, Tooltip } from "recharts";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { WalletSidebarAsset } from "@/types/wallet";
import { D } from "@/lib/math/decimal";

type WalletDonutCardProps = {
  isEmpty?: boolean;
  assets?: WalletSidebarAsset[];
  displayCurrency?: "TRY" | "USDT";
  activeTab?: "unit" | "category";
  onTabChange?: (tab: "unit" | "category") => void;
  showTabs?: boolean;
};

type DonutItem = { name: string; color: string; value: number };

export function WalletDonutCard({
  isEmpty = false,
  assets = [],
  displayCurrency = "TRY",
  activeTab,
  onTabChange,
  showTabs = true,
}: WalletDonutCardProps) {
  const { t } = useI18n();
  const [internalTab, setInternalTab] = useState<"unit" | "category">("unit");
  const selectedTab = activeTab ?? internalTab;

  const donutData = useMemo<DonutItem[]>(() => {
    const palette = [
      "#8B5CF6",
      "#3B82F6",
      "#F59E0B",
      "#D946EF",
      "#7C3AED",
      "#2563EB",
      "#10B981",
      "#F97316",
      "#9CA3AF",
    ];

    const colorBySymbol: Record<string, string> = {
      BTC: "#8B5CF6",
      ETH: "#3B82F6",
      USDT: "#F59E0B",
      BNB: "#D946EF",
      USDC: "#10B981",
      DAI: "#F97316",
    };

    const nameBySymbol: Record<string, string> = {
      BTC: t("wallet.donut.legend.bitcoin"),
      ETH: t("wallet.donut.legend.ethereum"),
      USDT: t("wallet.donut.legend.tether"),
      BNB: t("wallet.donut.legend.bnb"),
    };

    const cryptoAssets = assets.filter((asset) => asset.symbol !== "TRY");
    const values = cryptoAssets.map((asset) => {
      const displayValue =
        displayCurrency === "USDT" ? (asset.usdtValue ?? 0) : (asset.fiatValue ?? 0);
      if (displayValue > 0) return D.single(D.from(displayValue));
      const precision = asset.asset?.displayPrecision ?? asset.asset?.precision ?? 0;
      const parsed = D.parse(asset.amount, precision);
      return D.single(parsed);
    });
    const totalValue = values.reduce((acc, value) => acc + value, 0);

    const sampleUnit: DonutItem[] = [
      { name: t("wallet.donut.legend.bitcoin"), color: "#8B5CF6", value: 37 },
      { name: t("wallet.donut.legend.ethereum"), color: "#3B82F6", value: 35 },
      { name: t("wallet.donut.legend.tether"), color: "#F59E0B", value: 17 },
      { name: t("wallet.donut.legend.bnb"), color: "#D946EF", value: 11 },
      { name: t("wallet.donut.legend.other"), color: "#9CA3AF", value: 10 },
    ];

    const sampleCategory: DonutItem[] = [
      { name: t("wallet.donut.categories.bitcoin"), color: "#8B5CF6", value: 37 },
      { name: t("wallet.donut.categories.altcoins"), color: "#3B82F6", value: 50 },
      { name: t("wallet.donut.categories.stable"), color: "#F59E0B", value: 13 },
    ];

    if (cryptoAssets.length === 0 || totalValue <= 0) {
      return selectedTab === "unit" ? sampleUnit : sampleCategory;
    }

    const toPercent = (value: number) => Number(((value / totalValue) * 100).toFixed(1));

    if (selectedTab === "category") {
      const stableSymbols = new Set(["USDT", "USDC", "DAI", "BUSD", "TUSD"]);
      let bitcoinValue = 0;
      let stableValue = 0;
      let altValue = 0;

      cryptoAssets.forEach((asset, index) => {
        const value = values[index] ?? 0;
        if (asset.symbol === "BTC") {
          bitcoinValue += value;
        } else if (stableSymbols.has(asset.symbol)) {
          stableValue += value;
        } else {
          altValue += value;
        }
      });

      return [
        {
          name: t("wallet.donut.categories.bitcoin"),
          color: "#8B5CF6",
          value: toPercent(bitcoinValue),
        },
        {
          name: t("wallet.donut.categories.altcoins"),
          color: "#3B82F6",
          value: toPercent(altValue),
        },
        {
          name: t("wallet.donut.categories.stable"),
          color: "#F59E0B",
          value: toPercent(stableValue),
        },
      ];
    }

    return cryptoAssets.map((asset, index) => {
      const value = values[index] ?? 0;
      const symbol = asset.symbol.toUpperCase();
      return {
        name: nameBySymbol[symbol] ?? asset.name ?? symbol,
        color: colorBySymbol[symbol] ?? palette[index % palette.length],
        value: toPercent(value),
      };
    });
  }, [assets, selectedTab, displayCurrency, t]);

  const primary = donutData[0];

  return (
    <div className="flex min-h-[380px] flex-col rounded-[28px] border border-white/10 bg-[#1C2425] p-4 md:p-8">
      {showTabs && (
        <div className="mb-8 w-full max-w-full overflow-x-auto overscroll-x-contain pb-2 scrollbar-hide [-webkit-overflow-scrolling:touch] md:overflow-x-visible md:pb-0">
          <div className="inline-flex min-w-max flex-nowrap rounded-full bg-white/5 p-1 whitespace-nowrap">
            <button
              className={[
                "min-w-33 shrink-0 rounded-full px-6 py-2 text-xs font-semibold transition-all",
                selectedTab === "unit"
                  ? "bg-[#0F1415] text-white"
                  : "text-gray-400 hover:text-white",
              ].join(" ")}
              onClick={() => {
                const next = "unit";
                setInternalTab(next);
                onTabChange?.(next);
              }}
            >
              {t("wallet.donut.assetUnit")}
            </button>
            <button
              className={[
                "min-w-33 shrink-0 rounded-full px-6 py-2 text-xs font-semibold transition-all",
                selectedTab === "category"
                  ? "bg-[#0F1415] text-white"
                  : "text-gray-400 hover:text-white",
              ].join(" ")}
              onClick={() => {
                const next = "category";
                setInternalTab(next);
                onTabChange?.(next);
              }}
            >
              {t("wallet.donut.assetCategory")}
            </button>
          </div>
        </div>
      )}

      <div className="relative flex flex-1 flex-col items-center gap-8 lg:flex-row">
        {/* Chart Column */}
        <div className={["flex w-full items-center justify-center lg:flex-1", isEmpty ? "opacity-30 blur-[1px]" : ""].join(" ")}>
          <div className="h-[clamp(220px,62vw,260px)] w-[clamp(220px,62vw,260px)]">
            <ResponsiveContainer width="100%" height="100%" minWidth={220} minHeight={220}>
              <PieChart>
                <Tooltip
                  formatter={(value?: number | string) => `%${value ?? 0}`}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{ fontWeight: 600, color: "#111827" }}
                  itemStyle={{ color: "#111827" }}
                />
                <Pie
                  data={donutData}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={6}
                  cornerRadius={14}
                  stroke="transparent"
                >
                  {donutData.map((item, index) => (
                    <Cell key={`${item.name}-${index}`} fill={item.color} />
                  ))}
                  <Label
                    position="center"
                    content={({ viewBox }) => {
                      if (!viewBox || !primary) return null;
                      const { cx, cy } = viewBox as { cx?: number; cy?: number };
                      if (typeof cx !== 'number' || typeof cy !== 'number') return null;
                      const x = cx + 55;
                      const y = cy - 25;

                      return (
                        <g>
                          <rect
                            x={x - 22}
                            y={y - 14}
                            width={44}
                            height={28}
                            rx={14}
                            fill="#FFFFFF"
                          />
                          <text
                            x={x}
                            y={y + 5}
                            textAnchor="middle"
                            fontSize={12}
                            fontWeight={600}
                            fill="#111827"
                          >
                            %{primary.value}
                          </text>
                        </g>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend Column */}
        <div className={["grid w-full grid-cols-2 gap-x-8 gap-y-4 pr-0 lg:flex-1 lg:block lg:space-y-4 lg:pr-4", isEmpty ? "opacity-30 blur-[1px]" : ""].join(" ")}>
          {donutData.map((item, idx) => (
            <div key={`${item.name}-${idx}`} className="flex items-center justify-between text-body-md">
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-300">
                  {item.name}
                </span>
              </div>
              <span className="text-body-md-medium text-white">
                %{item.value}
              </span>
            </div>
          ))}
        </div>

        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <p className="max-w-xs text-body-sm-medium text-gray-300">
              {t("wallet.empty.donutMessage")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
