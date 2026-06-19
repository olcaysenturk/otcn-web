"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import type { HeroMetricCardProps } from "@/types/home";

export const HERO_GLASS_CARD_CLASS =
  "border border-white/20 bg-black/42 shadow-[0_22px_60px_rgba(0,0,0,0.42),inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-[18px]";

export function HeroMetricCard({
  titleKey,
  value,
  change,
  tone,
  chartData,
  placementClassName,
  helperTextKey,
  variant = "desktop",
}: HeroMetricCardProps) {
  const { t } = useI18n();
  const isPositive = tone === "positive";
  const isMobile = variant === "mobile";
  const chartColor = isPositive ? "#C8FF00" : "#FF6175";
  const mutedChartColor = isPositive ? "rgba(200,255,0,0.22)" : "rgba(255,97,117,0.22)";

  return (
    <div
      className={cn(
        HERO_GLASS_CARD_CLASS,
        isMobile
          ? "relative h-[140px] w-full overflow-hidden rounded-[10px] p-3"
          : "absolute h-[210px] w-[168px] overflow-hidden rounded-[18px] p-5 xl:h-[252px] xl:w-[200px] xl:rounded-[22px] xl:p-6",
        !isMobile && placementClassName,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "whitespace-pre-line font-bold text-white",
            isMobile
              ? "max-w-[58px] text-[10px] leading-[1.35]"
              : "max-w-[72px] text-[13px] leading-[1.4] xl:max-w-[82px] xl:text-[15px] xl:leading-[1.45]",
          )}
        >
          {t(titleKey)}
        </div>
        <div
          className={cn(
            "shrink-0",
            isMobile
              ? "mt-[-2px] h-[34px] w-[40px]"
              : "mt-[-3px] h-[48px] w-[52px] xl:mt-[-4px] xl:h-[58px] xl:w-[62px]",
          )}
          aria-hidden="true"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={mutedChartColor}
                strokeWidth={7}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2.4}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className={cn(
          "absolute font-medium leading-none tracking-normal text-white",
          isMobile
            ? "absolute left-3 top-[48px] text-[20px]"
            : "left-5 top-[118px] text-[25px] xl:left-6 xl:top-[154px] xl:text-[30px]",
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "absolute flex items-center leading-none",
          isMobile
            ? "absolute bottom-2.5 left-3 gap-2 text-[8px]"
            : "bottom-3.5 left-5 gap-2.5 text-[10px] xl:bottom-4 xl:left-6 xl:gap-3 xl:text-[12px]",
        )}
      >
        <span
          className={cn(
            "border font-bold",
            isMobile
              ? "rounded-[6px] px-2 py-1.5"
              : "rounded-[8px] px-2.5 py-1.5 xl:rounded-[9px] xl:px-3 xl:py-2",
            isPositive
              ? "border-[#00F0A8]/70 bg-[#00F0A8]/10 text-[#00F0A8]"
              : "border-[#FF3F68]/70 bg-[#FF3F68]/10 text-[#FF3F68]",
          )}
        >
          {change}
        </span>
        <span className="font-medium text-white/35">{t(helperTextKey)}</span>
      </div>
    </div>
  );
}
