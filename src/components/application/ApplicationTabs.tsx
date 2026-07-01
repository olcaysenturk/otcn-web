"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type ApplicationTab = {
  id: string;
  label: string;
  description: string;
  slug?: string;
  href?: string;
  status?: "success" | "pending";
  icon?: React.ReactNode;
};

type Props = {
  tabs: ApplicationTab[];
  renderContent?: (tab: ApplicationTab) => React.ReactNode;
  asLinks?: (tab: ApplicationTab) => string | null;
};

export function ApplicationTabs({ tabs, renderContent, asLinks }: Props) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);

  return (
    <Tabs value={activeId} onValueChange={setActiveId} defaultValue={tabs[0]?.id}>
      <TabsList className="grid grid-cols-1 gap-3 bg-transparent p-0 sm:grid-cols-2 md:grid-cols-5 xl:grid-cols-5">
        {tabs.map((tab) => {
          const isActive = activeId === tab.id;
          const isSuccess = tab.status === "success";
          const href = asLinks?.(tab) ?? tab.href ?? null;

          const inner = (
            <>
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full border",
                  isSuccess
                    ? "border-green-200 bg-green-500 text-white"
                    : isActive
                      ? "border-gray-300 bg-gray-100 text-gray-700"
                      : "border-gray-100 bg-gray-50 text-gray-500"
                )}
              >
                {tab.icon ?? <Check className="h-4 w-4" />}
              </span>
              <span
                className={cn(
                  "text-xs",
                  isSuccess ? "text-green-700" : isActive ? "text-gray-800" : "text-gray-500"
                )}
              >
                {tab.label}
              </span>
            </>
          );

          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              asChild={Boolean(href)}
              className={cn(
                "w-full justify-start rounded-lg px-3 py-3 text-left hover:-translate-y-0.5",
                isSuccess
                  ? "border-green-100 bg-green-50 text-green-700"
                  : isActive
                    ? "border-gray-300 bg-white text-gray-800 shadow-sm"
                    : "border-gray-100 bg-white/80 text-gray-600"
              )}
            >
              {href ? (
                <Link href={href} className="flex w-full items-center gap-3">
                  {inner}
                </Link>
              ) : (
                <span className="flex items-center gap-3">{inner}</span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {renderContent &&
        tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {renderContent(tab)}
          </TabsContent>
        ))}
    </Tabs>
  );
}
