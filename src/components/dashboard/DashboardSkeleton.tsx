"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4 md:p-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-6">
          {/* Assets Card Skeleton */}
          <div className="rounded-[28px] border border-white/10 bg-[#1C2425] p-6">
            <Skeleton className="mb-5 h-7 w-32 bg-white/10" />

            <div className="overflow-x-auto no-scrollbar">
              <div className="inline-flex flex-nowrap gap-2 rounded-full bg-white/5 p-1 whitespace-nowrap">
                <Skeleton className="h-9 min-w-33 rounded-full bg-white/10" />
                <Skeleton className="h-9 min-w-33 rounded-full bg-white/10" />
                <Skeleton className="h-9 w-33 rounded-full bg-white/10" />
              </div>
            </div>

            <div className="mt-5 min-h-95 rounded-5xl bg-[#1a1b23] p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Skeleton className="hidden h-5 w-32 bg-white/10 md:flex" />
                <div className="flex w-full gap-3 md:w-auto md:justify-end">
                  <Skeleton className="h-10 flex-1 rounded-full bg-white/10 md:w-24 md:flex-none" />
                  <Skeleton className="h-10 flex-1 rounded-full bg-white/10 md:w-24 md:flex-none" />
                </div>
              </div>

              <div className="mt-2 space-y-2">
                <Skeleton className="h-9 w-56 bg-white/15 md:h-10.5" />
                <Skeleton className="h-4 w-32 bg-white/10" />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                <Skeleton className="col-span-2 h-20 rounded-2xl bg-white/10 md:col-span-1 md:rounded-3xl" />
                <Skeleton className="h-20 rounded-2xl bg-white/10 md:rounded-3xl" />
                <Skeleton className="h-20 rounded-2xl bg-white/10 md:rounded-3xl" />
              </div>
            </div>
          </div>

          {/* Operations Card Skeleton */}
          <div className="rounded-[28px] border border-white/10 bg-[#1C2425] p-6">
            <Skeleton className="mb-5 h-7 w-32 bg-white/10" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-4xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                      <Skeleton className="h-5 w-24 bg-white/10" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-24 bg-white/10" />
                      <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-end">
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-3 w-12 bg-white/10" />
                      <Skeleton className="h-5 w-20 bg-white/10" />
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                      <Skeleton className="h-3 w-12 bg-white/10" />
                      <Skeleton className="h-5 w-20 bg-white/10" />
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <Skeleton className="h-3 w-12 bg-white/10" />
                      <Skeleton className="h-5 w-20 bg-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications Card Skeleton */}
        <div className="rounded-[28px] border border-white/10 bg-[#1C2425] p-6 flex flex-col">
          <Skeleton className="mb-2 h-7 w-40 bg-white/10" />
          <Skeleton className="mb-6 h-4 w-64 bg-white/10" />

          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center"
              >
                <div className="flex items-start gap-4 flex-1">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-white/10" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3 bg-white/10" />
                    <Skeleton className="h-3 w-3/4 bg-white/10" />
                  </div>
                </div>
                {i === 1 && (
                  <Skeleton className="h-8 w-24 self-end rounded-full bg-white/10 md:self-auto" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
