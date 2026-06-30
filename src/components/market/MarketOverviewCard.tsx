"use client";

import { ChevronRight } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

import { useI18n } from "@/lib/i18n/I18nProvider";
import type { MarketOverviewCardProps } from "@/types/market";

export function MarketOverviewCard({ metric }: MarketOverviewCardProps) {
  const { t } = useI18n();

  return (
    <article className="w-[262px] shrink-0 border-r border-[#5E666A]/20 px-5 last:border-r-0">
      <div className="flex h-[101px] flex-col">
        <div className="flex items-center gap-2 text-[14px] font-bold text-[#F4F7F8]">
          {t(metric.titleKey)}
          <ChevronRight className="h-4 w-4 text-[#5E666A]" />
        </div>

        {metric.kind === "chart" && (
          <>
            <div className="mt-1 flex items-center gap-3">
              <div className="text-[20px] font-bold text-[#F4F7F8]">
                {metric.prefix && <span className="mr-2 text-[#5E666A]">{metric.prefix}</span>}
                {metric.value}
              </div>
              <span className="rounded-[8px] border border-[#FF4D6D]/50 px-2 py-1.5 text-[12px] font-medium text-[#FF4D6D]">
                {metric.change}
              </span>
            </div>
            <div className="mt-auto h-[38px] w-[164px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.chartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#FF4D6D"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {metric.kind === "gauge" && (
          <div className="relative mt-1 h-[76px] w-[128px] overflow-hidden">
            <div className="absolute left-2 top-1 h-[96px] w-[112px] rounded-full border-[7px] border-b-transparent border-l-[#FF4D6D] border-r-[#1FBF8C] border-t-[#f54a14]" />
            <div className="absolute inset-x-0 bottom-0 text-center">
              <div className="text-[20px] font-bold text-[#F4F7F8]">{metric.value}</div>
              <div className="text-[12px] text-[#C5C9CC]">{metric.detailKey ? t(metric.detailKey) : ""}</div>
            </div>
          </div>
        )}

        {metric.kind === "range" && (
          <>
            <div className="mt-1 text-[20px] font-bold text-[#F4F7F8]">
              {metric.value}
              {metric.suffix && <span className="ml-2 text-[#5E666A]">{metric.suffix}</span>}
            </div>
            <div className="mt-auto w-full max-w-[192px]">
              <div className="relative flex h-1.5 overflow-visible rounded-full">
                <span className="flex-1 rounded-l-full bg-[#6E72F5]" />
                <span className="flex-1 bg-[#B8BBFF]" />
                <span className="flex-1 bg-[#A8FBE0]" />
                <span className="flex-1 rounded-r-full bg-[#1FBF8C]" />
                <span
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#F4F7F8] bg-[#3A4043]"
                  style={{ left: `${metric.rangeValue ?? 50}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-[#C5C9CC]">
                <span>{metric.rangeLabels ? t(metric.rangeLabels[0]) : ""}</span>
                <span>{metric.rangeLabels ? t(metric.rangeLabels[1]) : ""}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
