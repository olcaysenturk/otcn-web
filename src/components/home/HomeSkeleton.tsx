import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="space-y-7 pb-7">
      {/* Hero */}
      <section className="relative min-h-[642px] overflow-hidden rounded-[24px] border border-white/10 bg-black px-5 py-7 lg:min-h-[640px] lg:rounded-[36px] lg:px-[60px] lg:py-[74px] xl:min-h-[760px]">
        <div className="relative z-10 grid min-h-[586px] min-w-0 gap-0 lg:min-h-[560px] lg:grid-cols-[1.06fr_0.94fr] lg:gap-10 xl:min-h-[612px]">
          <div className="flex min-w-0 flex-col justify-center lg:justify-start lg:pt-[58px]">
            <div className="max-w-[660px] space-y-3">
              <Skeleton className="h-6 w-full max-w-[560px] bg-white/10 lg:h-10" />
              <Skeleton className="h-6 w-3/4 max-w-[420px] bg-white/10 lg:h-10" />
              <Skeleton className="h-6 w-1/2 max-w-[280px] bg-white/10 lg:h-10" />
            </div>

            <div className="relative mt-7 flex h-11 w-full max-w-[430px] items-center rounded-[13px] border border-white/15 bg-[#121717] p-1 lg:mt-[44px] lg:h-16 lg:p-1.5">
              <Skeleton className="h-full flex-1 bg-transparent" />
              <Skeleton className="absolute right-1 top-1 h-8 w-[98px] rounded-[11px] bg-[#C8FF00]/40 lg:right-1.5 lg:top-1.5 lg:h-[52px] lg:w-32 lg:rounded-[12px]" />
            </div>

            <Skeleton className="mt-[98px] hidden h-[140px] w-[260px] bg-white/5 lg:block" />
          </div>

          <div className="mt-5 grid h-[290px] grid-cols-[112px_minmax(0,250px)] justify-between gap-2.5 lg:hidden">
            <div className="flex flex-col gap-2.5">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-[64px] w-full rounded-[10px] border border-white/10 bg-black/40" />
              ))}
            </div>
            <Skeleton className="h-full w-full rounded-[10px] border border-white/10 bg-black/40" />
          </div>

          <div className="relative mt-[30px] hidden h-[440px] w-[440px] justify-self-end lg:block xl:mt-[26px] xl:h-[528px] xl:w-[528px]">
            <Skeleton className="absolute left-0 top-0 h-[210px] w-[168px] rounded-[18px] border border-white/20 bg-black/40 xl:h-[252px] xl:w-[200px]" />
            <Skeleton className="absolute left-0 top-[230px] h-[210px] w-[168px] rounded-[18px] border border-white/20 bg-black/40 xl:top-[276px] xl:h-[252px] xl:w-[200px]" />
            <Skeleton className="absolute right-0 top-0 h-[440px] w-[253px] rounded-[18px] border border-white/20 bg-black/40 xl:h-[528px] xl:w-[304px]" />
          </div>

          <Skeleton className="mt-5 h-[110px] w-full max-w-[260px] bg-white/5 lg:hidden" />
        </div>
      </section>

      {/* Market movers */}
      <div className="space-y-5">
        <section className="flex min-h-[196px] flex-col items-center justify-center overflow-hidden rounded-[28px] bg-[#0e0f10] px-0 py-6 lg:min-h-[330px] lg:px-5 lg:py-9">
          <div className="inline-flex gap-1 rounded-[10px] bg-[#252c2d] p-1 lg:rounded-[12px]">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-7 w-[72px] rounded-[8px] bg-white/10 lg:h-9 lg:w-[84px]" />
            ))}
          </div>

          <div className="mt-7 flex w-full max-w-[1050px] flex-col gap-3 lg:mt-10 lg:gap-4">
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

        <section className="flex min-h-[214px] flex-col items-center justify-center overflow-hidden rounded-[28px] bg-[#0e0f10] px-5 text-center lg:min-h-[280px]">
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
        <div className="grid min-h-[604px] gap-6 px-4 py-6 md:min-h-[450px] md:grid-cols-[0.95fr_1.15fr] md:items-center md:gap-10 md:px-[86px] md:py-[84px]">
          <div className="space-y-5">
            <Skeleton className="h-9 w-full max-w-[420px] bg-white/10 md:h-12" />
            <Skeleton className="h-4 w-full max-w-[420px] bg-white/10" />
            <Skeleton className="h-4 w-3/4 max-w-[320px] bg-white/10" />
            <Skeleton className="mt-7 hidden h-11 w-36 rounded-[12px] bg-white/20 md:block" />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:justify-self-end md:gap-x-6 md:gap-y-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[118px] w-full rounded-[12px] border border-white/10 bg-[#0B0D0E] md:h-[145px] md:w-[128px]" />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="overflow-hidden rounded-[28px] bg-[#0e0f10]">
        <div className="mx-auto min-h-[520px] max-w-4xl px-5 py-8 md:px-0 md:py-16">
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
