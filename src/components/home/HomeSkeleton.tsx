import { PopularSkeletonRows } from "@/components/home/PopularSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="space-y-7 pb-7">
      {/* Hero — HeroSection ile birebir aynı kapsayıcı/boyutlar (layout shift olmasın) */}
      <section className="relative overflow-hidden rounded-[28px] border border-card bg-card px-6 py-16 lg:px-20 lg:py-30">
        <div className="flex flex-col gap-20 xl:flex-row xl:items-stretch xl:gap-20">
          {/* Left */}
          <div className="flex flex-1 flex-col justify-between gap-14">
            <div className="flex flex-col gap-6">
              <div className="flex max-w-160 flex-col gap-3">
                <Skeleton className="h-8 w-full bg-foreground/10 lg:h-11" />
                <Skeleton className="h-8 w-4/5 bg-foreground/10 lg:h-11" />
              </div>
              <div className="flex w-full max-w-120 items-center gap-2.5 rounded-2xl border border-border bg-card py-2 pl-5 pr-2">
                <Skeleton className="h-5 flex-1 bg-foreground/10" />
                <Skeleton className="h-11.5 w-32.5 shrink-0 rounded-[14px] bg-foreground/10" />
              </div>
            </div>
            <div className="hidden flex-col gap-3 lg:flex">
              <Skeleton className="h-11.5 w-105 max-w-full bg-foreground/10" />
              <Skeleton className="h-13 w-115 max-w-full bg-foreground/5" />
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6 sm:flex-row xl:gap-6">
            <div className="flex w-full flex-col gap-6 sm:w-50">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col justify-between gap-8 rounded-[14px] border border-foreground/10 bg-card/40 p-6"
                >
                  <Skeleton className="h-5 w-20 bg-foreground/10" />
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-8 w-24 bg-foreground/10" />
                    <Skeleton className="h-7 w-16 rounded-lg bg-foreground/10" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex w-full flex-col gap-8 rounded-[14px] border border-foreground/10 bg-card/40 p-6 sm:w-75.75">
              <Skeleton className="h-6 w-20 bg-foreground/10" />
              <PopularSkeletonRows />
            </div>
          </div>
        </div>
      </section>

      {/* Market movers */}
      <div className="space-y-5">
        <section className="flex min-h-49 flex-col items-center justify-center overflow-hidden rounded-[28px] bg-[#0e0f10] px-0 py-6 lg:min-h-82.5 lg:px-5 lg:py-9">
          <div className="inline-flex gap-1 rounded-[10px] bg-[#252c2d] p-1 lg:rounded-[12px]">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-7 w-18 rounded-[8px] bg-white/10 lg:h-9 lg:w-21" />
            ))}
          </div>

          <div className="mt-7 flex w-full max-w-262.5 flex-col gap-3 lg:mt-10 lg:gap-4">
            <div className="flex gap-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-32 shrink-0 rounded-full bg-white/5" />
              ))}
            </div>
            <div className="flex gap-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-32 shrink-0 rounded-full bg-white/5" />
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-53.5 flex-col items-center justify-center overflow-hidden rounded-[28px] bg-[#0e0f10] px-5 text-center lg:min-h-70">
          <Skeleton className="h-9 w-2/3 max-w-md bg-white/10 md:h-16" />
          <Skeleton className="mt-4 h-6 w-1/2 max-w-xs bg-white/10 md:mt-8 md:h-10" />
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:mt-16">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-20 bg-white/5" />
            ))}
          </div>
        </section>
      </div>

      {/* Portfolio */}
      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0e0f10]">
        <div className="grid min-h-151 gap-6 px-4 py-6 md:min-h-112.5 md:grid-cols-[0.95fr_1.15fr] md:items-center md:gap-10 md:px-21.5 md:py-21">
          <div className="space-y-5">
            <Skeleton className="h-9 w-full max-w-105 bg-white/10 md:h-12" />
            <Skeleton className="h-4 w-full max-w-105 bg-white/10" />
            <Skeleton className="h-4 w-3/4 max-w-80 bg-white/10" />
            <Skeleton className="mt-7 hidden h-11 w-36 rounded-[12px] bg-white/20 md:block" />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:justify-self-end md:gap-x-6 md:gap-y-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-29.5 w-full rounded-[12px] border border-white/10 bg-[#0B0D0E] md:h-36.25 md:w-32" />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="overflow-hidden rounded-[28px] bg-[#0e0f10]">
        <div className="mx-auto min-h-130 max-w-4xl px-5 py-8 md:px-0 md:py-16">
          <Skeleton className="mx-auto h-6 w-64 bg-white/10 md:h-10" />

          <div className="mt-9 space-y-5 md:mt-12">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-3 border-b border-white/10 pb-5">
                <Skeleton className="h-4 w-full max-w-md bg-white/10" />
                {i === 0 && (
                  <>
                    <Skeleton className="h-3 w-full max-w-lg bg-white/5" />
                    <Skeleton className="h-3 w-2/3 max-w-sm bg-white/5" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
