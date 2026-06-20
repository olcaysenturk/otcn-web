import { Skeleton } from "@/components/ui/skeleton";

/**
 * Dark table skeleton still used by the (not-yet-migrated) trade-orders tab
 * panel. Matches the dark "card row" look of <DataTable />. The deposit/withdraw
 * tables now render their loading state through <DataTable isLoading /> with
 * column-aware skeletons.
 */
export function TransactionsTableSkeleton() {
    return (
        <div className="mt-4 space-y-3">
            <div className="hidden lg:grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1.2fr_0.4fr] items-center px-4">
                {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-3 w-16 bg-white/10" />
                ))}
            </div>

            {[...Array(8)].map((_, i) => (
                <div key={i}>
                    <div className="hidden lg:grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1.2fr_0.4fr] items-center rounded-[20px] border border-[#3A4043] bg-[#0E0F10] px-4 py-3">
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24 bg-white/10" />
                            <Skeleton className="h-3 w-16 bg-white/10" />
                        </div>
                        <Skeleton className="h-4 w-20 bg-white/10" />
                        <Skeleton className="h-4 w-24 bg-white/10" />
                        <Skeleton className="h-4 w-20 bg-white/10" />
                        <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
                        <Skeleton className="h-4 w-28 bg-white/10" />
                        <div className="flex justify-end">
                            <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
                        </div>
                    </div>

                    <div className="lg:hidden rounded-[20px] border border-[#3A4043] bg-[#0E0F10] p-4 space-y-4">
                        <div className="flex items-start justify-between border-b border-[#3A4043] pb-3">
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24 bg-white/10" />
                                <Skeleton className="h-3 w-16 bg-white/10" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(5)].map((__, j) => (
                                <div key={j} className="flex items-center justify-between">
                                    <Skeleton className="h-3 w-20 bg-white/10" />
                                    <Skeleton className="h-3 w-24 bg-white/10" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

/** Full-page loading state for the transactions pages (dark). */
export function TransactionPageSkeleton() {
    return (
        <div className="min-h-[1000px] space-y-8 animate-in fade-in duration-500 rounded-4xl md:rounded-44 border border-[#1F2526] bg-[#0E0F10] p-4 md:p-6">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-32 bg-white/10" />
                <Skeleton className="h-4 w-64 bg-white/10" />
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded-full bg-white/10" />
                <Skeleton className="h-10 w-24 rounded-full bg-white/10" />
            </div>

            {/* Main Card */}
            <div className="min-h-[800px] rounded-3xl border border-[#1F2526] bg-[#161A1B] p-4 space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-36 rounded-full bg-white/5" />
                    ))}
                </div>

                {/* Table Data */}
                <div className="space-y-2">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-[74px] w-full rounded-[20px] bg-white/5" />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12 bg-white/10" />
                        <Skeleton className="h-9 w-16 rounded-full bg-white/10" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-9 rounded-md bg-white/10" />
                        <Skeleton className="h-9 w-9 rounded-md bg-white/10" />
                        <Skeleton className="h-9 w-9 rounded-md bg-white/10" />
                    </div>
                </div>
            </div>
        </div>
    );
}
