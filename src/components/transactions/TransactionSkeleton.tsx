import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TransactionRowSkeleton({ columns }: { columns: string }) {
    return (
        <div className={cn("grid gap-4 items-center px-4 py-4 border-b border-slate-100 last:border-0", columns)}>
            {[...Array(columns.split("_").length || 6)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
            ))}
        </div>
    );
}

type TradeTableSkeletonVariant = "open" | "orders" | "history";

const TRADE_TABLE_SKELETON_CONFIG: Record<
    TradeTableSkeletonVariant,
    {
        desktopColsClass: string;
        desktopColCount: number;
        desktopHeaderCount: number;
        desktopRowClass: string;
        mobileDetailCount: number;
    }
> = {
    open: {
        desktopColsClass: "grid-cols-[1.5fr_1fr_0.8fr_0.8fr_1fr_1fr_1fr_1fr_0.5fr]",
        desktopColCount: 9,
        desktopHeaderCount: 8,
        desktopRowClass: "rounded-full py-4",
        mobileDetailCount: 6,
    },
    orders: {
        desktopColsClass: "grid-cols-[1.5fr_1fr_0.8fr_0.8fr_1fr_1fr_1fr_1fr_1fr_0.5fr]",
        desktopColCount: 10,
        desktopHeaderCount: 9,
        desktopRowClass: "rounded-3xl py-3",
        mobileDetailCount: 7,
    },
    history: {
        desktopColsClass: "grid-cols-[1.2fr_1.2fr_0.8fr_1fr_1.4fr_1.4fr_1.4fr_0.4fr]",
        desktopColCount: 8,
        desktopHeaderCount: 7,
        desktopRowClass: "rounded-3xl py-3",
        mobileDetailCount: 6,
    },
};

export function TradeTableSkeleton({ variant = "open" }: { variant?: TradeTableSkeletonVariant }) {
    const config = TRADE_TABLE_SKELETON_CONFIG[variant];

    return (
        <div className="space-y-3">
            {/* Desktop Header Skeleton */}
            <div className={cn("hidden md:grid items-center px-4 mb-2", config.desktopColsClass)}>
                {[...Array(config.desktopHeaderCount)].map((_, i) => (
                    <Skeleton key={i} className="h-3 w-16" />
                ))}
            </div>

            {[...Array(8)].map((_, i) => (
                <div key={i}>
                    {/* Desktop Row */}
                    <div
                        className={cn(
                            "hidden md:grid items-center border border-slate-200 bg-white px-4",
                            config.desktopColsClass,
                            config.desktopRowClass
                        )}
                    >
                        {[...Array(config.desktopColCount)].map((_, colIdx) => (
                            <div key={colIdx} className={cn(colIdx === config.desktopColCount - 1 && "flex justify-end")}>
                                {colIdx === 0 ? (
                                    <div className="flex flex-col gap-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                ) : colIdx === config.desktopColCount - 1 ? (
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                ) : (
                                    <Skeleton className="h-4 w-20" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Card */}
                    <div className="md:hidden rounded-3xl border border-slate-200 bg-white p-4 space-y-4">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(config.mobileDetailCount)].map((_, j) => (
                                <div key={j} className="flex justify-between items-center">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function TransactionsTableSkeleton() {
    return (
        <div className="mt-4 space-y-3">
            <div className="hidden lg:grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1.2fr_0.4fr] items-center px-4">
                {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-3 w-16" />
                ))}
            </div>

            {[...Array(8)].map((_, i) => (
                <div key={i}>
                    <div className="hidden lg:grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1.2fr_0.4fr] items-center rounded-3xl border border-slate-200 bg-white px-4 py-3">
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-4 w-28" />
                        <div className="flex justify-end">
                            <Skeleton className="h-9 w-9 rounded-full" />
                        </div>
                    </div>

                    <div className="lg:hidden rounded-3xl border border-slate-200 bg-white p-4 space-y-4">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(5)].map((__, j) => (
                                <div key={j} className="flex items-center justify-between">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function FiatTransactionSkeleton() {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_0.5fr] items-center px-4 mb-2">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-3 w-16" />
                ))}
            </div>

            {[...Array(8)].map((_, i) => (
                <div key={i}>
                    {/* Desktop */}
                    <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr_0.5fr] items-center rounded-full border border-slate-200 bg-white px-4 py-4">
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-32" />
                        <div className="flex justify-end">
                            <Skeleton className="h-9 w-9 rounded-full" />
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden rounded-3xl border border-slate-200 bg-white p-4 space-y-4">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, j) => (
                                <div key={j} className="flex justify-between items-center">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CryptoTransactionSkeleton() {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_1.2fr_1fr_1fr_1.5fr_0.5fr] items-center px-4 mb-2">
                {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-3 w-16" />
                ))}
            </div>

            {[...Array(8)].map((_, i) => (
                <div key={i}>
                    {/* Desktop */}
                    <div className="hidden md:grid grid-cols-[1fr_1fr_1.2fr_1fr_1fr_1.5fr_0.5fr] items-center rounded-full border border-slate-200 bg-white px-4 py-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                        <div className="flex justify-end">
                            <Skeleton className="h-9 w-9 rounded-full" />
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden rounded-3xl border border-slate-200 bg-white p-4 space-y-4">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, j) => (
                                <div key={j} className="flex justify-between items-center">
                                    <Skeleton className="h-3 w-20" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function FilterSkeleton() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-10 w-32 rounded-3xl" />
                </div>
            ))}
        </div>
    );
}

export function TransactionPageSkeleton() {
    return (
        <div className="min-h-[1000px] space-y-8 animate-in fade-in duration-500 rounded-4xl md:rounded-44 border border-slate-100 bg-slate-50/80 p-4 md:p-6 shadow-sm">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
            </div>

            {/* Main Card */}
            <div className="min-h-[800px] rounded-3xl border border-slate-200 bg-white/70 p-4 backdrop-blur-sm space-y-6">
                {/* Filters */}
                {/* <FilterSkeleton /> */}

                {/* Table Data */}
                <TradeTableSkeleton />

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-9 w-16 rounded-full" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
