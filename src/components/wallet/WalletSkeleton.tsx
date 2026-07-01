"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function WalletSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-48 mb-2 bg-white/10" />
        <Skeleton className="h-4 w-96 bg-white/10" />
      </div>

      {/* Cards Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* WalletTotalCard Skeleton */}
        <div className="min-h-95 rounded-5xl bg-[#1a1b23] p-8 flex flex-col justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Skeleton className="hidden h-5 w-32 bg-white/10 md:flex" />
            <div className="flex w-full gap-3 md:w-auto md:justify-end">
              <Skeleton className="h-10 flex-1 rounded-full bg-white/10 md:w-24 md:flex-none" />
              <Skeleton className="h-10 flex-1 rounded-full bg-white/10 md:w-24 md:flex-none" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-9 w-48 bg-white/15 md:h-10.5" />
            <Skeleton className="h-4 w-32 bg-white/10" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Skeleton className="col-span-2 h-20 rounded-2xl bg-white/10 md:col-span-1 md:rounded-3xl" />
            <Skeleton className="h-20 rounded-2xl bg-white/10 md:rounded-3xl" />
            <Skeleton className="h-20 rounded-2xl bg-white/10 md:rounded-3xl" />
          </div>
        </div>

        {/* WalletDonutCard Skeleton */}
        <div className="min-h-95 flex flex-col rounded-[28px] border border-white/10 bg-[#1C2425] p-4 md:p-8">
          <div className="mb-8 inline-flex w-fit gap-2 rounded-full bg-white/5 p-1">
            <Skeleton className="h-9 w-33 rounded-full bg-white/10" />
            <Skeleton className="h-9 w-33 rounded-full bg-white/10" />
          </div>
          <div className="flex flex-1 flex-col items-center gap-8 lg:flex-row">
            <div className="flex w-full items-center justify-center lg:flex-1">
              <Skeleton className="h-[clamp(220px,62vw,260px)] w-[clamp(220px,62vw,260px)] rounded-full bg-white/10" />
            </div>
            <div className="grid w-full grid-cols-2 gap-x-8 gap-y-4 lg:flex-1 lg:block lg:space-y-4 lg:pr-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-3 rounded-full bg-white/10" />
                    <Skeleton className="h-4 w-20 bg-white/10" />
                  </div>
                  <Skeleton className="h-4 w-10 bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fiat Row Skeleton */}
      <section className="rounded-[28px] border border-white/10 bg-[#1C2425] p-5 md:p-8">
        <div className="mb-2 hidden md:grid grid-cols-[1fr_1fr_1fr_1.3fr] px-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-16 bg-white/10" />
          ))}
        </div>
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 bg-white/10" />
              <Skeleton className="h-3 w-12 bg-white/10" />
            </div>
          </div>
          <Skeleton className="h-4 w-20 bg-white/10" />
          <Skeleton className="h-4 w-20 bg-white/10" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20 rounded-full bg-white/10" />
            <Skeleton className="h-9 w-20 rounded-full bg-white/10" />
          </div>
        </div>
      </section>

      {/* Asset List Section Skeleton */}
      <section className="rounded-[28px] border border-white/10 bg-[#1C2425] p-5">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-6 w-32 bg-white/10" />
          <Skeleton className="h-4 w-16 bg-white/10" />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Skeleton className="h-10 w-full max-w-sm rounded-full bg-white/10" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-48 rounded-full bg-white/10" />
            <Skeleton className="h-5 w-32 bg-white/10" />
          </div>
        </div>

        <div className="mb-2 hidden md:grid grid-cols-[1fr_1fr_1fr_1.3fr] px-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-16 bg-white/10" />
          ))}
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="hidden md:grid grid-cols-[1fr_1fr_1fr_1.3fr] items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20 bg-white/10" />
                  <Skeleton className="h-3 w-12 bg-white/10" />
                </div>
              </div>
              <Skeleton className="h-4 w-16 bg-white/10" />
              <Skeleton className="h-4 w-16 bg-white/10" />
              <div className="flex items-center justify-end gap-2">
                <Skeleton className="h-9 w-20 rounded-full bg-white/10" />
                <Skeleton className="h-9 w-20 rounded-full bg-white/10" />
              </div>
            </div>
          ))}

          {/* Mobile Card Skeleton */}
          {[1, 2].map((i) => (
            <div key={i} className="md:hidden rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                  <Skeleton className="h-3 w-12 bg-white/10" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16 bg-white/10" />
                  <Skeleton className="h-4 w-20 bg-white/10" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-16 bg-white/10" />
                  <Skeleton className="h-4 w-20 bg-white/10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full rounded-full bg-white/10" />
                <Skeleton className="h-10 w-full rounded-full bg-white/10" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
            <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
            <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
          </div>
        </div>
      </section>
    </div>
  );
}
